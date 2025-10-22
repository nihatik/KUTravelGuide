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
import { QuestionCard } from '@/components/features/Card/QuestionCard';
import { LessonCard } from '@/components/features/Card/LessonCard';
import RoutesService from '@/services/api/RoutesService';

export default function Get() {
  const allBuildings = BuildingService.getAll();
  const [isLoaded, setIsLoaded] = useState(false);

  const mapRef = useRef<any>(null);
  const [activeBuildingId, setActiveBuildingId] = useState<number | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleGetLocation = async () => { };


  useEffect(() => {
    BuildingService.init().then(() =>
      RoutesService.init().then(() => setIsLoaded(true))
    );
  }, [RoutesService]);

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
              <input
                id="buildingSearch"
                type="search"
                placeholder="Поиск..."
              />

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
              <input
                id="buildingSearch"
                type="search"
                onChange={handleInput}
                placeholder="Поиск..."
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
          <Tab id='schedule' label='Учеба' icon={faCalendarAlt}>
            <h3>Моё расписание</h3>
            <ul>
              <LessonCard
                lesson={{
                  name: "Проектирование надежных компьютерных систем-лекц",
                  time: "9:30 - 10:20",
                  room: "405/УЛК",
                  teacher: "маг., ст.пр. Пяткова Т.В."
                }}
              />
              <LessonCard
                lesson={{



                  name: "Системы искусственного интеллекта-лекц",
                  time: "10:30 - 11:20",
                  room: "636/УЛК",
                  teacher: "док PhD, доц. Астапенко Н.В."
                }}
              />
              <LessonCard
                lesson={{
                  name: "Информационная безопасность-лекц",
                  time: "11:30 - 12:20",
                  room: "636/УЛК",
                  teacher: "маг., ст.пр. Семенюк В.В."
                }}
              />
              <LessonCard
                lesson={{
                  name: "Проектирование программного обеспечения-лекц",
                  time: "12:50 - 13:40",
                  room: "413/УЛК",
                  teacher: "маг., ст.пр. Пяткова Т.В."
                }}
              />
              <LessonCard
                lesson={{
                  name: "Управление разработкой программного обеспечения-лекц",
                  time: "13:50 - 14:40",
                  room: "413/УЛК",
                  teacher: "маг., ст.пр. Пяткова Т.В."
                }}
              />
              <LessonCard
                lesson={{
                  name: "Управление разработкой программного обеспечения-лаб",
                  time: "14:50 - 15:40",
                  room: "324/6",
                  teacher: "Мунтинов к.Д."
                }}
              />
              <LessonCard
                lesson={{
                  name: "Управление разработкой программного обеспечения-лаб",
                  time: "15:50 - 16:40",
                  room: "324/6",
                  teacher: "Мунтинов к.Д."
                }}
              />
            </ul>
          </Tab>
          <Tab id='popular' label='Частое' icon={faFire}>
          </Tab>
          <Tab id='bookmarks' label='Закладки' icon={faBookmark}>
          </Tab>
          <Tab id='help' label='Помощь' icon={faQuestionCircle}>
            <ul>
              <QuestionCard
                question="Как проложить маршрут до аудитории?"
                answer="Чтобы проложить маршрут до аудитории, выберите здание на карте или в списке зданий, затем укажите вашу текущую позицию и пункт назначения. Система автоматически рассчитает оптимальный маршрут."
              />
              <QuestionCard
                question="Как найти ближайший туалет?"
                answer="Чтобы найти ближайший туалет, воспользуйтесь картой и выберите соответствующий пункт. Вы также можете спросить у сотрудников университета."
              />
              <QuestionCard
                question="Как изменить настройки карты?"
                answer="Чтобы изменить настройки карты, перейдите в раздел настроек в правом верхнем углу карты. Там вы сможете выбрать тип карты, включить или отключить слои и настроить другие параметры отображения."
              />
              <QuestionCard
                question="Как сообщить о проблеме с картой?"
                answer="Если вы обнаружили проблему с картой, пожалуйста, свяжитесь с нашей службой поддержки через форму обратной связи на сайте или отправьте электронное письмо на указанный адрес поддержки."
              />
              <QuestionCard
              question='Публикация статей'
              answer='Чтобы опубликовать статью, перейдите в раздел "Мои статьи" и нажмите кнопку "Создать новую статью". Заполните необходимые поля и нажмите "Опубликовать".'
              />
            </ul>

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
      />

    </>
  );
}
