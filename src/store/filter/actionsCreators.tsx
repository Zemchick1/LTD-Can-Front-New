import { FilterCategory, FilterItem } from "../../interfaces/filter.interface";
import { ActionType } from "./actionTypes";

export const setFilter = (chosenFilter: FilterCategory[]) => ({
    type: ActionType.SET_FILTER,
    payload: chosenFilter
})

export const setYearRange = (from: number, to: number) => ({
    type: ActionType.SET_YEAR_RANGE,
    payload: [from, to]
})

export const fetchAllFilterItems = (type: string): () => Promise<FilterItem[]> => async () => {
    let res: FilterItem[] = [];
    const params = `?type=${type}`;
    await fetch(process.env.REACT_APP_API_KEY + "find" + params, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    }).then(response => {
        if (!response.ok) {
            throw Error("Could not fetch resource");
        }
        return response.json();
    }).then(data => {
        res = data;
    }).catch(err => {
        return err.message;
    })
    return res;
}