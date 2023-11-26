import { AnyAction } from "redux";
import { ActionType } from "./actionTypes";
import { FilterCategory } from "../../interfaces/filter.interface";

interface FilterState {
    filterCategories: FilterCategory[],
    yearFrom: number,
    yearTo: number
}

const initialState: FilterState = {
    filterCategories: [{ type: "author", filterItems: [] }, { type: "genre", filterItems: [] }, { type: "tag", filterItems: [] }],
    yearFrom: 0,
    yearTo: 0
}

export const filterReducer = (state: FilterState = initialState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.SET_FILTER:
            return {
                ...state,
                filterCategories: action.payload
            };
        case ActionType.SET_YEAR_RANGE:
            return {
                ...state,
                yearFrom: action.payload.from,
                yearTo: action.payload.to
            };
        default: return state;
    }
}
