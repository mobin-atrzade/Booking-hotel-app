import { useHotels } from "../Context/HotelsProvider";

function Map() {
    const { isLoading, hotels } = useHotels();

    return (
        <div className="mapContainer">map</div>
    )
}

export default Map;