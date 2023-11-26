import { useParams } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import styles from "./SearchPage.module.sass";
import { useEffect, useState } from "react";
import { Filter } from "../Filter/Filter"
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { searchWritings } from "../../store/writings/actionsCreators";
import { SearchResult, Writing } from "../../interfaces/writings.interface";
import { SearchItem } from "./SearchItem/SearchItem";
import { FilterCategory, FilterDTO } from "../../interfaces/filter.interface";
import { chosenFilterStore } from "../../store/filter/selectors";
import { WRITINGS_ON_SEARCHPAGE } from "../../utils/const";
import { FilterStatus } from "../../utils/enums";

export const SearchPage = () => {
    const { searchTextParam, category } = useParams();
    const [writings, setWritings] = useState<Writing[]>([]);
    const [filter, setFilter] = useState<FilterCategory[]>([]);
    const [pages, setPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const chosenFilter: FilterDTO = useSelector(chosenFilterStore);
    const dispatch: AppDispatch = useDispatch();

    const filterOrCheck = (): FilterDTO => {
        const chosenFilterTemp: FilterDTO = JSON.parse(JSON.stringify(chosenFilter));

        if (chosenFilter.filterCategories?.reduce((total, filterCategory) => {
            return total + (filterCategory?.filterItems.filter(filterItem => filterItem.status === FilterStatus.OR).length);
        }, 0) < 2) {
            chosenFilterTemp?.filterCategories?.forEach(filterCategory => {
                filterCategory.filterItems = filterCategory.filterItems.filter(filterItem => filterItem.status !== FilterStatus.OR);
            });
        }

        return chosenFilterTemp;
    }

    useEffect(() => {
        const getWritings = async () => {
            const chosenFilterTemp: FilterDTO = filterOrCheck();

            const searchResult: SearchResult = await dispatch(searchWritings(chosenFilterTemp, searchTextParam as string, category as string, 0, false)) as SearchResult;
            setWritings(searchResult.books);
            setFilter(searchResult.filter);
            setCurrentPage(0);
            setPages(Math.ceil(searchResult.books.length / WRITINGS_ON_SEARCHPAGE));
        }

        getWritings();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [searchTextParam, chosenFilter])

    const changePage = async (page: number) => {
        setCurrentPage(page);

        const chosenFilterTemp: FilterDTO = filterOrCheck();
        const searchResult: Writing[] = await dispatch(searchWritings(chosenFilterTemp, searchTextParam as string, category as string, page, true)) as Writing[];
        setWritings(searchResult);
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.searchList}>
                    {writings.length > 0 && writings.map((writing) => {
                        return (
                            <SearchItem writing={writing} key={writing.id} />
                        )
                    })}
                    <div className={styles.pagination}>
                        <button onClick={() => changePage(currentPage - 1)}>Previous</button>
                        {Array.from({ length: pages }, (_, index) => {
                            return (
                                <div key={index} onClick={() => changePage(index)}>{index + 1}</div>
                            );
                        })}

                        <button onClick={() => changePage(currentPage + 1)}>Next</button>
                    </div>
                </div>
                <Filter filter={filter} />
            </main>
            <Footer />
        </>
    )
}