import { YMaps } from '@pbe/react-yandex-maps';
import "../styles/YMap.css";
import GeocodeMap from '../components/layouts/geocode-map';
import RightPanel from '../components/RightPanel';
import { useRef, useState, useMemo, useEffect } from 'react';
import CampusMap from '../components/BuildingMap';
import BuildingService from '../services/BuildingService';
import BuildingCard from '../components/custom/BuildingCard';
import '../styles/LeftPanel.css';
import TabsBox from '../components/base/tabsbox/TabsBox';
import Tab from '../components/base/tabsbox/Tab';
import type Building from '../model/Building';
import { faBarsStaggered, faBookmark,faFire, faHistory, faMap, faSearch, faUniversity } from '@fortawesome/free-solid-svg-icons';
import "../styles/Main.css";

export default function Get() {
  const allBuildings = BuildingService.getAll();

  const mapRef = useRef<any>(null);
  const [activeBuildingId, setActiveBuildingId] = useState<number | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleGetLocation = async () => { };

  const handleJoin = (id: number) => {
    const newBuilding = BuildingService.getById(id);
    if (newBuilding) {
      BuildingService.activeBuilding = newBuilding;
      setActiveBuildingId(newBuilding.id);
    }
  };

  useEffect(()=>{
    setActiveBuilding(BuildingService.activeBuilding)
  }, [BuildingService.activeBuilding])

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const filteredIds = useMemo(() => {
    if (!searchValue.trim()) return allBuildings.map(b => b.id);

    return allBuildings
      .filter(b =>
        b.name.toLowerCase().includes(searchValue) ||
        b.description?.toLowerCase().includes(searchValue)
      )
      .map(b => b.id);
  }, [searchValue, allBuildings]);

  useEffect(() => {
    if (filteredIds.length === 1) {
      setActiveBuildingId(filteredIds[0]);
    } else {
      setActiveBuildingId(null);
    }
  }, [filteredIds]);

  return (
    <>
      <div id="left-panel">
        <TabsBox defaultTab='search'>
          <Tab id='search' label='Поиск' icon={faSearch}>
            <div>
              <input
                id="buildingSearch"
                type="search"
                onChange={handleInput}
                placeholder="Что-то ищем?..."
              />

              <ul id="buildingResults">
                {allBuildings.map(building => {
                  const isShown = filteredIds.includes(building.id);
                  return (
                    <BuildingCard
                      key={building.id}
                      building={building}
                      shown={isShown}
                      active={activeBuildingId === building.id}
                      onSelect={handleJoin}
                    />
                  );
                })}
              </ul>
            </div>
          </Tab>
          <Tab id='history' label='История' icon={faHistory}>
          </Tab>
          <Tab id='map' label='Карта' icon={faMap}>
          </Tab>
          <Tab id='university' label='Учеба' icon={faUniversity}></Tab>
          <Tab id='popular' label='Частое' icon={faFire}>
          </Tab>
          <Tab id='bookmarks' label='Закладки' icon={faBookmark}>
          </Tab>
          <Tab id='hide' label='Скрыть' icon={faBarsStaggered}>
          </Tab>
        </TabsBox>
      </div>

      {!activeBuilding && (
        <YMaps>
          <div className="map-container">
            <GeocodeMap />
          </div>
        </YMaps>
      )}

      {activeBuilding && <CampusMap />}

      <RightPanel
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onGetLocation={handleGetLocation}
      />

    </>
  );
}
