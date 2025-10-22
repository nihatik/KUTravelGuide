import BuildingCard from "@/components/features/Building/BuildingCard";
import BuildingService from "@/services/api/BuildingService";
import "./BuildingsAdminPage.css";

export default function BuildingsAdminPage() {

    console.log(BuildingService.buildings);
    return (
        <>
            <ul>
                {
                    BuildingService.buildings.map(building => {
                        return (
                            <BuildingCard
                                key={building.id}
                                building={building}
                                shown={true}
                                active={false}
                                onSelect={() => { }}
                            />)
                    }
                    )
                }
            </ul>

        </>
    );
}