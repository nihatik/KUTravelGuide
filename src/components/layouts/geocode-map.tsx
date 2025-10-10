import { Map, Placemark } from '@pbe/react-yandex-maps';
import styled from 'styled-components';
import BuildingDataManager from '../../services/BuildingService';
import GeoService from '../../services/GeoService';
import { useEffect, useRef, useState } from 'react';
import BuildingService from '../../services/BuildingService';

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
            const [lat, lon] = BuildingService.activeBuilding.position;

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
            {BuildingDataManager.buildings.map(building => (
                <Placemark
                    key={building.id}
                    geometry={building.position}
                    properties={{
                        hintContent: building.name,
                        balloonContent: `Это здание ${building.name}`,
                    }}
                    options={{
                        iconLayout: "default#image",
                        iconImageHref: "/assets/" + building.type + ".png",
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
            ))}
        </MapStyled>

    );
};

export default GeocodeMap;
