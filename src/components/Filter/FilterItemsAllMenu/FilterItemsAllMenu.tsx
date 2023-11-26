import { useEffect, useState } from "react";
import styles from "./FilterItemsAllMenu.module.sass";
import { FilterItem } from "../FilterItem/FilterItem";
import { FilterItem as FilterItemInterface } from "../../../interfaces/filter.interface";
import { AppDispatch } from "../../../store";
import { useDispatch } from "react-redux";
import { fetchAllFilterItems } from "../../../store/filter/actionsCreators";

export const FilterItemsAllMenu = ({ closeMenu, type }: { closeMenu: Function, type: string }) => {
    const [filterItems, setFilterItems] = useState<FilterItemInterface[]>([]);
    const dispatch: AppDispatch = useDispatch();

    const getAllFilterItems = async () => {
        const filterItems = await dispatch(fetchAllFilterItems(type));
        setFilterItems(filterItems);
    }

    useEffect(() => {
        getAllFilterItems();

        // eslint-disable-next-line
    }, [])

    return (
        <div className={styles.shade}>
            <div className={styles.menu}>
                <button onClick={() => closeMenu(false)}>X</button>
                {filterItems?.map((filterItem) => {
                    return (
                        <FilterItem filterItem={filterItem} type={type} key={filterItem.name} />
                    )
                })}
            </div>
        </div>
    )
}