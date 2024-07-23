import React from "react";
import useFetch from "../../hooks/useFetch";

function LocationList() {
    const { isLoading, data } = useFetch("http://localhost:5000/hotels", "");

    if (isLoading) <p>loading ...</p>
    return (
        <div className="nearByLocation">
            <h2>NearBy Locations</h2>
            <div className="locationList">
                {data.map((item) => {
                    return (
                        <div key={item.id} className="locationItem">
                            <img src={item.picture_url.url} alt={item.name} />
                            <div className="locationItemDesc">
                                <p className="location">{item.smart_location}</p>
                                <p className="name">{item.name}</p>
                                <p className="price"> €&nbsp;{item.price}&nbsp;<span>night</span></p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default LocationList;