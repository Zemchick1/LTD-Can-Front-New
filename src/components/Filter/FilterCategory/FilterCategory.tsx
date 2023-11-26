import { ChangeEvent, useEffect, useState } from "react"
import { FilterCategory as FilterCategoryInterface, FilterItem as FilterItemInterface } from "../../../interfaces/filter.interface"
import { FilterItem } from "../FilterItem/FilterItem"
import styles from "./FilterCategory.module.sass"
import { FilterItemsAllMenu } from "../FilterItemsAllMenu/FilterItemsAllMenu"

export const FilterCategory = ({ filterCategory }: { filterCategory: FilterCategoryInterface }) => {
    const [filterText, setFilterText] = useState<string>("");
    const [filterItems, setFilterItems] = useState<FilterItemInterface[]>([]);
    const [menuVisibility, setMenuVisibility] = useState<boolean>(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setFilterText(event.target.value);
    }

    const closeMenu = (): void => {
        setMenuVisibility(false);
    }

    useEffect(() => {
        setFilterItems(filterCategory?.filterItems?.filter((filterItem) =>
            filterItem.name.toLowerCase().includes(filterText.toLowerCase())));

        // eslint-disable-next-line
    }, [filterText, filterCategory])

    return (
        <details className={styles.filterCategory}>
            <summary className={styles.filterCategoryName}>{filterCategory.type}<div className={styles.chevron}></div></summary>
            <input value={filterText} onChange={(event) => handleChange(event)}></input>
            {filterItems?.map((filterItem) => {
                return (
                    <FilterItem filterItem={filterItem} type={filterCategory.type} key={filterItem.name} />
                )
            })}
            <div onClick={() => setMenuVisibility(true)}>See All</div>
            {menuVisibility && <FilterItemsAllMenu closeMenu={closeMenu} type={filterCategory.type} />}
        </details>
    )
}