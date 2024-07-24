import { createContext, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import toast from "react-hot-toast";


const HotelContext = createContext();
const BASE_URL = "http://localhost:5000/hotels";

function HotelsProvider({ children }) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentHotel, setCurrentHotel] = useState(null);
    const [isLoadingCurrentHotel, setIsLoadingCurrentHotel] = useState(false);
    const destination = searchParams.get("destination");
    const room = JSON.parse(searchParams.get("options"))?.room;
    const { isLoading, data: hotels } = useFetch(
        BASE_URL,
        `name_like=${destination || ""}&accommodates_gte=${room || 1}`
    )

    async function getHotel(id) {
        setIsLoadingCurrentHotel(true);
        try {
            const { data } = await axios.get(`${BASE_URL}/${id}`);
            setCurrentHotel(data);
            setIsLoadingCurrentHotel(false);
        } catch (error) {
            toast.error(error.message);
            setIsLoadingCurrentHotel(false);
        }
    }

    return <HotelContext.Provider value={{ isLoading, hotels, getHotel, isLoadingCurrentHotel, currentHotel }}>
        {children}
    </HotelContext.Provider>
}

export default HotelsProvider;


export function useHotels() {
    return useContext(HotelContext);
}