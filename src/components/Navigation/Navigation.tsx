import { useState } from "react";
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom";
import { NavMark } from "../../interfaces/profile.inteface";
import { profileNavMarks } from "../../store/profile/selectors"
import styles from "./Navigation.module.sass"

export const Navigation = () => {
    const [currentDropdown, setCurrentDropdown] = useState<NavMark[]>([]);
    const [dropdownIndex, setDropdownIndex] = useState<number>(NaN);
    const [timeout, setDropdownTimeout] = useState<NodeJS.Timeout>();
    const navMarksList: NavMark[] = useSelector(profileNavMarks);

    const handleDropdown = (navMark: NavMark, index: number): void => {
        if (index === dropdownIndex) {
            setDropdownIndex(NaN);
            const dropdownTimeout = setTimeout(() => {
                setCurrentDropdown([]);
            }, 500);
            setDropdownTimeout(dropdownTimeout);
        } else {
            setCurrentDropdown(navMark.menu as NavMark[]);
            setDropdownIndex(index);
            clearTimeout(timeout);
        }
    }

    return (
        <nav className={styles.nav}>
            <div className={`${styles.navMarkList} ${!isNaN(dropdownIndex) && styles.active}`}>
                {navMarksList && navMarksList?.map((navMark, index) => {
                    if (navMark.link) {
                        return (
                            <div className={`${styles.navButton} ${dropdownIndex - index === 1 && styles.beforeActive} ${dropdownIndex - index === -1 && styles.afterActive}`} key={navMark.name}>
                                <NavLink to={`./${navMark.link}`} className={styles.link}>{navMark.name}</NavLink>
                            </div>)
                    } else {
                        return (
                            <div key={navMark.name} className={`${styles.navButton} ${dropdownIndex - index === 1 && styles.beforeActive} ${dropdownIndex - index === -1 && styles.afterActive}  ${dropdownIndex === index && styles.active}`} onClick={() => handleDropdown(navMark, index)}>
                                <p className={styles.dropdownText}>{navMark.name}</p>
                                <div className={styles.chevron}></div>
                            </div>
                        )
                    }
                })}
            </div>
            <div className={styles.dropdown}>
                {currentDropdown?.map((item) => {
                    return (
                        <NavLink to={item.link as string} key={item.name} className={styles.dropdownLink}>{item.name}</NavLink>
                    )
                })}
            </div>
        </nav>
    )
}