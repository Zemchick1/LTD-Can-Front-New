import { MouseEvent, useRef, useState } from "react"
import { FilterDTO, FilterItem as FilterItemInterface, Position } from "../../../interfaces/filter.interface"
import styles from "./FilterItem.module.sass"
import { FilterStatus } from "../../../utils/enums";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../../store/filter/actionsCreators";
import { useOnClickOutside } from "../../../utils/hooks";
import { chosenFilterStore } from "../../../store/filter/selectors";
import { AppDispatch } from "../../../store";

export const FilterItem = ({ filterItem, type }: { filterItem: FilterItemInterface, type: string }) => {
    const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
    const [height, setheight] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout>();
    const chosenFilter: FilterDTO = useSelector(chosenFilterStore);
    const dispatch: AppDispatch = useDispatch();

    const openMenu = (event: MouseEvent<HTMLDivElement>): void => {
        clearTimeout(timeoutState);

        setMenuVisibility(true);
        setTimeout(() => {
            setheight("100vh")
        }, 1)

        const node = event.currentTarget as HTMLElement
        const rect = node.getBoundingClientRect();
        const x = event.pageX - rect.left;
        const y = event.clientY - rect.top;
        setPosition({ x: x, y: y });
    }

    const closeMenu = (): void => {
        setheight("0px");

        const timeout = setTimeout(() => {
            setMenuVisibility(false);
        }, 500);
        setTimeoutState(timeout);
    }

    const chooseFilter = (status: string): void => {
        const filterCategoryIndex = chosenFilter.filterCategories.findIndex((filterCategory) => {
            return filterCategory.type === type;
        })

        const itemIndex = chosenFilter.filterCategories[filterCategoryIndex].filterItems.findIndex((item) => {
            return item.name === filterItem.name;
        })

        if (itemIndex >= 0) {
            chosenFilter.filterCategories[filterCategoryIndex].filterItems.splice(itemIndex, 1, { name: filterItem.name, status: status })
        } else {
            chosenFilter.filterCategories[filterCategoryIndex].filterItems.push({ name: filterItem.name, status: status })
        }

        setStatus(status);
        dispatch(setFilter(chosenFilter.filterCategories));
    }

    const removeFilter = (): void => {
        const filterCategoryIndex = chosenFilter.filterCategories.findIndex((filterCategory) => {
            return filterCategory.type === type;
        })

        const itemIndex = chosenFilter.filterCategories[filterCategoryIndex].filterItems.findIndex((item) => {
            return item.name === filterItem.name;
        })

        chosenFilter.filterCategories[filterCategoryIndex].filterItems.splice(itemIndex, 1);

        setStatus("");
        dispatch(setFilter(chosenFilter.filterCategories));
    }

    useOnClickOutside(filterMenuRef, closeMenu);

    return (
        <div className={styles.filterItem}>
            <h4 className={styles.tag} onClick={(event) => openMenu(event)} >{filterItem.name}</h4>
            <h4>{filterItem.quantity}</h4>
            {status && <button onClick={removeFilter}>X</button>}
            {menuVisibility &&
                <div className={styles.filterContextMenu} ref={filterMenuRef} style={{ top: position.y, left: position.x, maxHeight: height }}>
                    <div className={styles.filterStatus} onClick={() => chooseFilter(FilterStatus.AND)}>{FilterStatus.AND}</div>
                    <div className={styles.filterStatus} onClick={() => chooseFilter(FilterStatus.OR)}>{FilterStatus.OR}</div>
                    <div className={styles.filterStatus} onClick={() => chooseFilter(FilterStatus.NOT)}>{FilterStatus.NOT}</div>
                </div >}
        </div >
    )
}