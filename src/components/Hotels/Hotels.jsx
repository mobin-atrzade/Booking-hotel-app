import { Link, useSearchParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from './../Loader/Loader';


function Hotels() {

    const [searchParams, setSearchParams] = useSearchParams();
    const destination = searchParams.get("destination");
    const room = JSON.parse(searchParams.get("options"))?.room;
    const { isLoading, data: hotels } = useFetch(
        "http://localhost:5000/hotels",
        `name_like=${destination || ""}&accommodates_gte=${room || 1}`
    )

    if (isLoading) <Loader />
    return (
        <div className="searchList">
            <h2>Search Results ({hotels.length})</h2>

            {hotels.map((item) => {
                return <Link
                    key={item.id}
                    to={`/hotels/${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
                >
                    <div className="searchItem">
                        <img src={item.picture_url.url} alt={item.name} />
                        <div className="searchItemDesc">
                            <p className="location">{item.smart_location}</p>
                            <p className="name">{item.name}</p>
                            <p className="price">
                                €&nbsp;{item.price}&nbsp;<span>night</span>
                            </p>
                        </div>
                    </div>
                </Link>
            })}
        </div>
    )
}

export default Hotels;