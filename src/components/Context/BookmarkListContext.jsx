import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";


const BookmarkContext = createContext();
const BASE_URL = "http://localhost:5000";

const initialState = {
    bookmarks: [],
    isLoading: false,
    currentBookmark: null,
    error: null
}

function bookmarkReducer(state, action) {
    switch (action.type) {
        case "loading": return {
            ...state,
            isLoading: true
        }
        case "bookmarks/loaded": return {
            ...state,
            bookmarks: action.payload,
            isLoading: false
        }
        case "bookmark/loaded": return {
            ...state,
            isLoading: false,
            currentBookmark: action.payload
        }
        case "bookmark/created": return {
            ...state,
            isLoading: false,
            bookmarks: [...state.bookmarks, action.payload],
            currentBookmark: action.payload
        }
        case "bookmark/deleted": return {
            ...state,
            isLoading: false,
            bookmarks: state.bookmarks.filter((item) => item.id !== action.payload),
            currentBookmark: null
        }
        case "rejected": return {
            ...state,
            isLoading: false,
            error: action.payload
        }
        default: throw new Error("Unknown action");
    }
}

function BookmarkListProvider({ children }) {
    // const [currentBookmark, setCurrentBookmark] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    // const [bookmarks, setBookmarks] = useState([]);
    const [{ bookmarks, isLoading, currentBookmark }, dispatch] = useReducer(bookmarkReducer, initialState);

    useEffect(() => {
        async function fetchBookmarkList() {
            // setIsLoading(true);
            dispatch({ type: "loading" });
            try {
                const { data } = await axios.get(`${BASE_URL}/bookmarks/`);
                // setBookmarks(data);
                dispatch({ type: "bookmarks/loaded", payload: data })
            } catch (error) {
                // toast.error(error.message);
                dispatch({ type: "rejected", payload: error.message })
            }
        }
        fetchBookmarkList();
    }, [])

    async function getBookmark(id) {
        if (Number(id) === currentBookmark?.id) return;
        dispatch({ type: "loading" });
        // setIsLoading(true);
        // setCurrentBookmark(null);
        try {
            const { data } = await axios.get(`${BASE_URL}/bookmarks/${id}`);
            // setCurrentBookmark(data);
            dispatch({ type: "bookmark/loaded", payload: data })
        } catch (error) {
            // toast.error(error.message);
            dispatch({ type: "rejected", payload: error.message })
        }
    }

    async function createBookmark(newBookmark) {
        dispatch({ type: "loading" });
        try {
            const { data } = await axios.post(`${BASE_URL}/bookmarks/`, newBookmark);
            // setCurrentBookmark(data);
            dispatch({ type: "bookmark/created", payload: data })
            // setBookmarks((prev) => [...prev, data]);
        } catch (error) {
            // toast.error(error.message);
            dispatch({ type: "rejected", payload: error.message })
        }
    }

    async function deleteBookmark(id) {
        dispatch({ type: "loading" });
        try {
            await axios.delete(`${BASE_URL}/bookmarks/${id}`);
            dispatch({ type: "bookmark/deleted", payload: id })
            // setBookmarks((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            // toast.error(error.message);
            dispatch({ type: "rejected", payload: error.message })
        }
    }

    return <BookmarkContext.Provider
        value={{
            isLoading,
            bookmarks,
            getBookmark,
            createBookmark,
            deleteBookmark,
            currentBookmark
        }}>
        {children}
    </BookmarkContext.Provider>
}

export default BookmarkListProvider;


export function useBookmark() {
    return useContext(BookmarkContext);
}