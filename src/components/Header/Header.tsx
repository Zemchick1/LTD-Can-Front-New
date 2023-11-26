import styles from "./Header.module.sass"
import { SearchBar } from "../SearchBar/SearchBar"
import { NavLink, useParams } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { profileAuth, profileLanguage } from "../../store/profile/selectors"
import { Navigation } from "../Navigation/Navigation"
import { AppDispatch } from "../../store"
import { changeUserLanguage, logout } from "../../store/profile/actionsCreators"
import { DbCategories } from "../../utils/enums"

export const Header = () => {
    const [profileMenuVisible, setProfileMenuVisibility] = useState<boolean>(false);
    const [categoryVisibility, setCategoryVisibility] = useState<boolean>(false);
    const [languageMenuVisibility, setlanguageMenuVisibility] = useState<boolean>(false);
    const authed = useSelector(profileAuth);
    const { category } = useParams();
    const dispatch: AppDispatch = useDispatch();
    const language = useSelector(profileLanguage);

    const handleProfileMenu = (): void => {
        setProfileMenuVisibility(true);
    }

    const handleLanguageMenu = (): void => {
        setlanguageMenuVisibility(true);
    }

    const changeLanguage = (language: string): void => {
        dispatch(changeUserLanguage(language));
    }

    const signOut = (): void => {
        dispatch(logout());
    }

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.header}>
                <NavLink className="logo" to={`${category}`}>
                    <img alt="logo"></img>
                </NavLink>
                <button className={styles.categoryDropdown} onClick={() => setCategoryVisibility(!categoryVisibility)}>
                    {category}
                    {categoryVisibility &&
                        <ul className={styles.headerDropdown}>
                            <li className={styles.categoryDropdownItem}>
                                <NavLink to="/book" className={styles.categoryDropdownLink}>{DbCategories.BOOK}</NavLink>
                            </li>
                            <li className={styles.categoryDropdownItem}>
                                <NavLink to="/manga" className={styles.categoryDropdownLink}>Manga</NavLink>
                            </li>
                            <li className={styles.categoryDropdownItem}>
                                <NavLink to="/comics" className={styles.categoryDropdownLink}>Comics</NavLink>
                            </li>
                        </ul>}
                </button>
                <SearchBar category={category as string} />
                <button onClick={handleLanguageMenu} data-testid="langBtn" className={styles.langBtn}>
                    {language}
                    {languageMenuVisibility &&
                        <ul className={styles.headerDropdown} data-testid="languageMenu">
                            <li className={styles.categoryDropdownItem} data-testid="lang" onClick={() => changeLanguage("en")}>English</li>
                            <li className={styles.categoryDropdownItem} data-testid="lang" onClick={() => changeLanguage("de")}>German</li>
                            <li className={styles.categoryDropdownItem} data-testid="lang" onClick={() => changeLanguage("ua")}>Ukrainian</li>
                        </ul>}
                </button>
                {authed ?
                    <div onClick={handleProfileMenu} data-testid="profileBtnAuthed">
                        <img className={styles.avatar} alt="avatar"></img>
                        {profileMenuVisible &&
                            <div className={styles.headerDropdown}>
                                <button className={styles.profileMenuButton}>Your Profile</button>
                                <ul className={`${styles.profileMenuButton} ${styles.logOutBtn}`} data-testid="logOutBtn" onClick={signOut}>Log Out</ul>
                            </div>}
                    </div>
                    :
                    <div onClick={handleProfileMenu} data-testid="profileBtn">
                        <div className={styles.authBtn}>
                            door
                        </div>
                        {profileMenuVisible &&
                            <div className={styles.headerDropdown}>
                                <NavLink to="/logIn" replace className={styles.logInBtn}>Log In</NavLink>
                                <NavLink to="/signUp" replace className={styles.logInBtn}>Sign Up</NavLink>
                            </div>}
                    </div>
                }
                <Navigation />
            </div>
        </header>
    )
}