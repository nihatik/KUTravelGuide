class MapService {
    private map: any | null = null;

    setMap(mapInstance: any) {
        this.map = mapInstance;
    }

    isReady(): boolean {
        return !!this.map;
    }

    zoomIn(step: number = 1) {
        if (!this.map) return;
        const current = this.map.getZoom?.() ?? 16;
        this.map.setZoom(current + step, { duration: 200 });
    }

    zoomOut(step: number = 1) {
        if (!this.map) return;
        const current = this.map.getZoom?.() ?? 16;
        this.map.setZoom(current - step, { duration: 200 });
    }

    panToCenter(coords: [number, number]) {
        if (!this.map) return;
        const panPromise = this.map.panTo(coords, { flying: true, duration: 600 });
        if (panPromise?.then) {
            panPromise.catch(() => void 0);
        }
    }
}

export default new MapService();


