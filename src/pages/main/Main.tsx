import { YMaps } from '@pbe/react-yandex-maps';
import "@/assets/styles/YMap.css";
import GeocodeMap from '@/components/features/Map/GeocodeMap';
import RightPanel from '@/components/RightPanel';
import { useRef, useState, useMemo, useEffect } from 'react';
import CampusMap from '@/components/features/Building/BuildingMap';
import BuildingService from '@/services/api/BuildingService';
import BuildingCard from '@/components/features/Building/BuildingCard';
import '@/assets/styles/LeftPanel.css';
import { TabsBox, Tab } from '@/components/ui/TabsBox';
import type Building from '@/types/building/Building';
import { faBarsStaggered, faBookmark, faCalendarAlt, faFire, faHome, faQuestionCircle, faUniversity } from '@fortawesome/free-solid-svg-icons';
import "@/assets/styles/Main.css";
import { HistoryCard } from '@/components/features/Card/HistoryCard';
import RoutesService from '@/services/api/RoutesService';
import Lessons from './leftcontent/lessons/Lessons';
import KUTGSearch from './features/KUTGSearch';
import Help from './leftcontent/help/Help';
import MapService from '@/services/MapService';
import FavoritesService from '@/services/FavoritesService';

export default function Get() {
  const allBuildings = BuildingService.getAll();

  const mapRef = useRef<any>(null);
  const [activeBuildingId, setActiveBuildingId] = useState<number | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [bookmarkSearch, setBookmarkSearch] = useState<string>("");

  const handleGetLocation = async () => { };

  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    BuildingService.init().then(() =>
      RoutesService.init().then(() => setIsLoaded(true))
    );
  }, []);
  const [favoritesVersion, setFavoritesVersion] = useState(0);
  useEffect(() => {
    const unsubscribe = FavoritesService.subscribe(() => setFavoritesVersion(v => v + 1));
    return () => { unsubscribe(); };
  }, []);



  
  const handleJoin = (id: number) => {
    const newBuilding = BuildingService.getById(id);
    if (newBuilding) {
      BuildingService.setActive(newBuilding);
      setActiveBuildingId(newBuilding.id);
    }
  };

  useEffect(() => {
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

  const favoriteBuildingIds = useMemo(() => FavoritesService.getBuildingIds(), [favoritesVersion]);
  const favoriteBuildings = useMemo(() => {
    return favoriteBuildingIds
      .map(id => BuildingService.getById(id))
      .filter((b): b is Building => Boolean(b));
  }, [favoriteBuildingIds]);

  const filteredFavoriteBuildings = useMemo(() => {
    const q = bookmarkSearch.toLowerCase().trim();
    if (!q) return favoriteBuildings;
    return favoriteBuildings.filter(b => b.name.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q));
  }, [bookmarkSearch, favoriteBuildings]);

  useEffect(() => {
    if (filteredIds.length === 1) {
      setActiveBuildingId(filteredIds[0]);
    } else {
      setActiveBuildingId(null);
    }
  }, [filteredIds]);

  if (!isLoaded) return null;

  return (
    <>
      <div id="left-panel">
        <TabsBox defaultTab='main'>
          <Tab id='main' label='Главная' icon={faHome}>
            <div>
              <KUTGSearch/>
              <ul>
                <HistoryCard
                  name="1 корпус"
                  address="ун. им. М. Козыбаева, ул. Жабаева 1000">
                </HistoryCard>
              </ul>
            </div>
          </Tab>
          <Tab id='university' label='Здания' icon={faUniversity}>
            <div>
              <KUTGSearch onChange={handleInput} />
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
          <Tab id='schedule' label='Учеба' icon={faCalendarAlt}>
            <Lessons/>
          </Tab>
          <Tab id='popular' label='Частое' icon={faFire}>
          </Tab>
          <Tab id='bookmarks' label='Закладки' icon={faBookmark}>
            <div>
              <KUTGSearch onChange={(e) => setBookmarkSearch(e.target.value)} placeholder={"Поиск по закладкам"} />
              {!filteredFavoriteBuildings.length && (
                <div style={{ padding: '16px', color: 'rgba(0,0,0,0.6)' }}>У вас ещё нет закладок.</div>
              )}
              <ul id="buildingResults">
                {filteredFavoriteBuildings.map(building => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                    shown={true}
                    active={activeBuildingId === building.id}
                    onSelect={handleJoin}
                  />
                ))}
              </ul>
            </div>
          </Tab>
          <Tab id='help' label='Помощь' icon={faQuestionCircle}>
            <Help/>
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
        onZoomIn={() => MapService.zoomIn()}
        onZoomOut={() => MapService.zoomOut()}
        onGetLocation={handleGetLocation}
      />
    </>
  );
}
