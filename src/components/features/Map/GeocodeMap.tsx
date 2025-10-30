import { Map, Placemark } from '@pbe/react-yandex-maps';
import styled from 'styled-components';
import BuildingDataManager from '@/services/api/BuildingService';
import GeoService from '@/services/api/GeoService';
import { useEffect, useRef, useState } from 'react';
import BuildingService from '@/services/api/BuildingService';

const MapStyled = styled(Map)`
  width: 100%;
  height: 100%;
`;

const GeocodeMap = () => {
    const mapRef = useRef<any>(null);
    const [mapReady, setMapReady] = useState(false);

    const handleMapLoad = (map: any) => {
        mapRef.current = map;
        setMapReady(true);
    };
    const handleClick = (e: any) => {
        console.log(e.get("coords"))
    }
    useEffect(() => {
        if (mapReady && BuildingService.activeBuilding && mapRef.current) {
            const map = mapRef.current;
            const position = BuildingService.activeBuilding.position;
            let lat: number;
            let lon: number;

            if (Array.isArray(position)) {
                [lat, lon] = position;
            } else if (position && typeof position === "object" && "lat" in position && "lng" in position) {
                lat = (position as any).lat;
                lon = (position as any).lng;
            } else {
                return;
            }

            const panPromise = map.panTo([lat, lon], {
                flying: true,
                delay: 1000,
                duration: 1000,
            });

            if (panPromise && typeof panPromise.then === "function") {
                panPromise.then(() => {
                    map.setZoom(18, { duration: 300 });
                });

            } else {
                setTimeout(() => {
                    map.setZoom(18, { duration: 300 });
                }, 1000);

            }
        }
    }, [BuildingService.activeBuilding, mapReady]);

    return (
        <MapStyled
            defaultState={{
                center: [GeoService.baseLat, GeoService.baseLon],
                zoom: 16,
                controls: []
            }}
            onClick={handleClick}
            instanceRef={handleMapLoad}
        >
            {BuildingDataManager.buildings.map(building => {
                if (!building.position) return null;

                const coords: [number, number] = [building.position.latitude, building.position.longitude];
                console.log(building.name +  coords)
                return (
                    <Placemark
                        key={building.id}
                        geometry={coords}
                        properties={{
                            hintContent: building.name,
                            balloonContent: `Это здание ${building.name}`,
                        }}
                        options={{
                            iconLayout: "default#image",
                            iconImageHref: "/assets/" + building.buildingType.toLowerCase() + ".png",
                            iconImageSize: [48, 48],
                            iconImageOffset: [-24, -48],
                        }}
                        onClick={() => {
                            const element = document.getElementById("positionValue");
                            const joinBtn = document.getElementById("joinButton");

                            if (element) {
                                element.textContent = building.name;
                                if (joinBtn) {
                                    joinBtn.style.display = '';
                                    joinBtn.dataset.buildingId = building.id.toString();
                                }
                            } else if (joinBtn) {
                                joinBtn.style.display = 'none';
                            }
                        }}
                    />
                );
            })}

        </MapStyled>

    );
};

export default GeocodeMap;
