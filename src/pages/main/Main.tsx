import { YMaps } from '@pbe/react-yandex-maps';
import "@/assets/styles/YMap.css";
import GeocodeMap from '@/components/features/Map/GeocodeMap';
import RightPanel from './features/RightPanel';
import { useRef, useState, useEffect } from 'react';
import CampusMap from '@/pages/main/leftcontent/buildings/features/BuildingMap';
import BuildingService from '@/services/api/BuildingService';
import '@/assets/styles/LeftPanel.css';
import { TabsBox, Tab } from '@/components/ui/TabsBox';
import { faBarsStaggered, faBookmark, faCalendarAlt, faQuestionCircle, faUniversity } from '@fortawesome/free-solid-svg-icons';
import "@/assets/styles/Main.css";
import Lessons from './leftcontent/lessons/Lessons';
import Help from './leftcontent/help/Help';
import Buildings from './leftcontent/buildings/Buildings';
import type { ServerBuildingDTO } from '@/services/api/BuildingsHttp';
import Bookmarks from './leftcontent/bookmarks/Bookmarks';

export default function Get() {

  const mapRef = useRef<any>(null);
  const [activeBuilding, setActiveBuilding] = useState<ServerBuildingDTO | null>(null);

  const handleGetLocation = async () => { };
  
  const handleBackToMap = () => {
    BuildingService.clearActive();
    setActiveBuilding(null);
  };

  useEffect(() => {
    setActiveBuilding(BuildingService.activeBuilding)
  }, [BuildingService.activeBuilding])

  return (
    <>
      <div id="left-panel">
        <TabsBox defaultTab='main'>
          <Tab id='university' label='Здания' icon={faUniversity}>
            <Buildings />
          </Tab>
          <Tab id='schedule' label='Расписание' icon={faCalendarAlt}>
            <Lessons />
          </Tab>
          <Tab id='bookmarks' label='Закладки' icon={faBookmark}>
            <Bookmarks />
          </Tab>
          <Tab id='help' label='Помощь' icon={faQuestionCircle}>
            <Help />
          </Tab>
          <Tab id='hide' label='Скрыть' icon={faBarsStaggered}>
          </Tab>
        </TabsBox>
      </div >

      {!activeBuilding && (
        <YMaps>
          <div className="map-container">
            <GeocodeMap />
          </div>
        </YMaps>
      )
      }

      {activeBuilding && <CampusMap />}

      <RightPanel
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onGetLocation={handleGetLocation}
        onBackToMap={handleBackToMap}
      />
    </>
  );
}
