import styles from "./Filter.module.sass"
import { FilterCategory } from "./FilterCategory/FilterCategory";
import { FilterCategory as FilterCategoryInterface } from "../../interfaces/filter.interface";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { setYearRange } from "../../store/filter/actionsCreators";

export const Filter = ({ filter }: { filter: FilterCategoryInterface[] }) => {
    const dispatch: AppDispatch = useDispatch();

    const chooseYearRange = (): void => {
        dispatch(setYearRange(0, 0));
    }

    return (
        <div className={styles.filter}>
            {filter?.map((filterCategory) => {
                return (
                    <FilterCategory filterCategory={filterCategory} key={filterCategory.type} />
                )
            })}
            <div className={styles.yearRange} onClick={chooseYearRange}></div>
        </div>
    )
}