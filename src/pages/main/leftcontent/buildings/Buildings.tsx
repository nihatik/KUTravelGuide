import { useEffect, useMemo, useState } from "react";
import KUTGSearch from "../../features/KUTGSearch";
import BuildingCard from "./features/BuildingCard";
import { HistoryCard } from "./features/HistoryCard";
import BuildingService from "@/services/api/BuildingService";
import RoutesService from "@/services/api/RoutesService";
import type { LocalStorageBuildingData } from "./data/LocalStorageBuildingData";


const LOCAL_STORAGE_KEY = "buildingSearchHistory";


export default function Buildings() {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchHistory, setSearchHistory] = useState<LocalStorageBuildingData[]>([]);

    const allBuildings = BuildingService.getAll();

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        BuildingService.init().then(() =>
            RoutesService.init().then(() => setIsLoaded(true))
        );

        const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedHistory) {
            setSearchHistory(JSON.parse(storedHistory));
        }
    }, []);

    const filteredIds = useMemo(() => {
        if (!searchValue.trim()) return allBuildings.map(b => b.id);

        return allBuildings
            .filter(b =>
                b.name.toLowerCase().includes(searchValue) ||
                b.description?.toLowerCase().includes(searchValue)
            )
            .map(b => b.id);
    }, [searchValue, allBuildings]);

    const [activeBuildingId, setActiveBuildingId] = useState<number | null>(null);

    useEffect(() => {
        if (filteredIds.length === 1) {
            setActiveBuildingId(filteredIds[0]);
        } else {
            setActiveBuildingId(null);
        }
    }, [filteredIds]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(searchHistory));
    }, [searchHistory]);

    const handleJoin = (id: number) => {
        const building = BuildingService.getById(id);
        if (building) {
            BuildingService.setActive(building);
            setActiveBuildingId(building.id);

            setSearchHistory(prev => {
                if (prev.find(b => b.id === building.id)) return prev;
                return [{ id: building.id, name: building.name, address: building.street || "" }, ...prev].slice(0, 5);
            });
        }
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value.toLowerCase());
    };

    const handleHistoryClick = (id: number) => {
        setActiveBuildingId(id);
        BuildingService.setActiveById(id);
    };

    return (
        <div>
            <KUTGSearch onChange={handleInput} />

            {searchHistory.length > 0 && searchValue === "" && (
                <div>
                    {searchHistory.map(building => (
                        <HistoryCard
                            onClick={() => handleHistoryClick(building.id)}
                            name={building.name}
                            address={building.address || ""}
                        />
                    ))}
                </div>
            )}

            {searchValue !== "" &&
                allBuildings.map(item => {
                    const isShown = filteredIds.includes(item.id);
                    return (
                        <BuildingCard
                            key={item.id}
                            building={item}
                            shown={isShown}
                            active={activeBuildingId === item.id}
                            onSelect={handleJoin}
                        />
                    );
                })}
        </div>
    );
}
