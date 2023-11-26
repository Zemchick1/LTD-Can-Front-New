import { ChangeEvent, KeyboardEvent, useState, useEffect } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import styles from "./SearchBar.module.sass"

export const SearchBar = ({ category }: { category: string }) => {
    const [searchText, setSearchText] = useState<string>("");
    const navigate: NavigateFunction = useNavigate();
    const { searchTextParam } = useParams();

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(event.target.value);
    }

    const handleSubmit = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            navigate(`/${category}/search/${searchText}`);
        }
    }

    useEffect(() => {
        if (searchTextParam !== undefined) {
            setSearchText(searchTextParam);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    return (
        <div className={styles.searchBarWrapper}>
            <input value={searchText} onKeyDown={(event) => handleSubmit(event)} onChange={(event) => { handleChange(event) }} placeholder={`Find ${category}`} className={styles.searchBar} />
            <button className={styles.searchBtn}></button>
        </div>
    )
}