import { MdLocationOn } from "react-icons/md";
import { HiCalendar, HiLogout, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { useState } from "react";
import { useRef } from "react";
import useOutSideClick from "../../hooks/useOutSideClick";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { createSearchParams, Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";

function Header() {
    const [searchParams, setSearchparams] = useSearchParams();
    const [destination, setDestination] = useState(searchParams.get("destination") || "");
    const [openOptions, setOpenOptions] = useState(false);
    const navigate = useNavigate();
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1
    });
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
    ]);
    const [openDate, setOpenDate] = useState(false);

    const handleOptions = (name, operation) => {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation === "inc" ? options[name] + 1 : options[name] - 1
            }
        })
    }

    const handleSearch = () => {
        const encodedParams = createSearchParams({
            date: JSON.stringify(date),
            destination,
            options: JSON.stringify(options)
        })
        //note =>  setSearchparams(encodedParams);
        navigate({
            pathname: "/hotels",
            search: encodedParams.toString()
        });
    }

    return (
        <div className="header">
            <Link to="/bookmark">
                Bookmarks
            </Link>
            <div className="headerSearch">
                <div className="headerSearchItem">
                    <MdLocationOn className="headerIcon locationIcon" />
                    <input
                        type="text"
                        placeholder="where to go?"
                        onChange={(e) => setDestination(e.target.value)}
                        className="headerSearchInput"
                        name="destination"
                        id="destination"
                    />
                    <span className="seperator"></span>
                </div>
                <div className="headerSearchItem">
                    <HiCalendar className="headerIcon dateIcon" />
                    <div
                        className="dateDropDown"
                        onClick={() => setOpenDate(!openDate)}
                    >
                        {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(date[0].endDate, "MM/dd/yyyy")}`}
                    </div>
                    {openDate && <DateRange
                        onChange={(item) => setDate([item.selection])}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                        moveRangeOnFirstSelection={true}
                    />}
                    <span className="seperator"></span>
                </div>
                <div className="headerSearchItem">
                    <div
                        id="optionDropDown"
                        onClick={() => setOpenOptions(!openOptions)}
                    >
                        {options.adult} adult &bull; {options.children} children &bull; {options.room} room
                    </div>
                    {openOptions && <GuestOptionList
                        handleOptions={handleOptions}
                        options={options}
                        setOpenOptions={setOpenOptions}
                    />}
                    <span className="seperator"></span>
                </div>
                <div className="headerSearchItem">
                    <button className="headerSearchBtn" onClick={handleSearch}>
                        <HiSearch className="headerIcon" />
                    </button>
                </div>
            </div>
            <User />
        </div >
    )
}
export default Header;

function GuestOptionList({ options, handleOptions, setOpenOptions }) {
    const optionsRef = useRef();
    useOutSideClick(optionsRef, "optionDropDown", () => setOpenOptions(false));
    return (
        <div className="guestOptions" ref={optionsRef}>
            <OptionItem type="adult" handleOptions={handleOptions} options={options} minLimit={1} />
            <OptionItem type="children" handleOptions={handleOptions} options={options} minLimit={0} />
            <OptionItem type="room" handleOptions={handleOptions} options={options} minLimit={1} />
        </div>
    )
}

function OptionItem({ type, options, minLimit, handleOptions }) {
    return (
        <div className="guestOptionItem">
            <span className="optionText">{type}</span>
            <span className="optionCounter">
                <button
                    onClick={() => handleOptions(type, "dec")}
                    className="optionCounterBtn"
                    disabled={options[type] <= minLimit}
                >
                    <HiMinus className="icon" />
                </button>
                <span className="optionCounterNumber">{options[type]}</span>
                <button
                    className="optionCounterBtn"
                    onClick={() => handleOptions(type, "inc")}
                >
                    <HiPlus className="icon" />
                </button>
            </span>
        </div>
    )
}

function User() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
    }
    return (
        <div>
            {isAuthenticated ?
                (<div>
                    <span>{user.name}</span>
                    <button><HiLogout onClick={handleLogout} className="icon" /></button>
                </div>) :
                (<NavLink to="/login">login</NavLink>)
            }
        </div>
    )
}