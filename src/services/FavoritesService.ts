type FavoritesListener = () => void;

class FavoritesServiceImpl {
    private static BUILDINGS_KEY = 'kutg_favorites_buildings';
    private listeners: Set<FavoritesListener> = new Set();

    private readIds(): number[] {
        try {
            const raw = localStorage.getItem(FavoritesServiceImpl.BUILDINGS_KEY);
            return raw ? (JSON.parse(raw) as number[]) : [];
        } catch {
            return [];
        }
    }

    private writeIds(ids: number[]) {
        localStorage.setItem(FavoritesServiceImpl.BUILDINGS_KEY, JSON.stringify(Array.from(new Set(ids))));
        this.emit();
    }

    subscribe(listener: FavoritesListener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private emit() {
        this.listeners.forEach((l) => l());
    }

    getBuildingIds(): number[] {
        return this.readIds();
    }

    isFavoriteBuilding(id: number): boolean {
        return this.readIds().includes(id);
    }

    toggleBuilding(id: number) {
        const ids = this.readIds();
        if (ids.includes(id)) {
            this.writeIds(ids.filter((x) => x !== id));
        } else {
            ids.push(id);
            this.writeIds(ids);
        }
    }
}

const FavoritesService = new FavoritesServiceImpl();
export default FavoritesService;


