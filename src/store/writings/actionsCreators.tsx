import { ActionTypeRequestStatus } from "./actionTypes";
import { SearchResult, Writing } from "../../interfaces/writings.interface";
import { AppDispatch } from "..";
import { FilterDTO } from "../../interfaces/filter.interface";
import { handleRequestWithTokenRenewal } from "../helper/actionCreators";

export const getWritingsLoading = () => ({
    type: ActionTypeRequestStatus.REQUEST_WRITINGS_LOADING
})

export const getWritingsSuccess = () => ({
    type: ActionTypeRequestStatus.REQUEST_WRITINGS_SUCCESS,
})

export const getWritingsFailure = (error: string) => ({
    type: ActionTypeRequestStatus.REQUEST_WRITINGS_FAILURE,
    payload: error
})

export const getWritingFeed = (category: string, theme: string): (dispatch: AppDispatch) => Promise<Writing[]> => async (dispatch: AppDispatch) => {
    let res: Writing[] = [];
    const params = `?theme=${theme}`;
    await fetch(process.env.REACT_APP_API_KEY + category + params, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    }).then(response => {
        dispatch(getWritingsLoading());
        if (!response.ok) {
            throw Error("Could not fetch the data for that resource");
        }
        return response.json();
    }).then(data => {
        dispatch(getWritingsSuccess());
        res = data;
    }).catch(err => {
        dispatch(getWritingsFailure(err.message));
        return err.message;
    })
    return res;
}

export const searchWritings = (filter: FilterDTO, searchText: string, category: string, currentPage: number, pageChange: boolean): (dispatch: AppDispatch) => Promise<SearchResult | Writing[]> => async (dispatch: AppDispatch) => {
    let res: SearchResult | Writing[] = {
        books: [],
        filter: []
    };

    let search: string = "";
    if (searchText !== undefined) {
        search = searchText;
    }

    const params = `?searchText=${search}&category=${category}&page=${currentPage}&pageChange=${pageChange}`;

    const requestOptions: any = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(filter),
        url: process.env.REACT_APP_API_KEY + "search" + params
    }

    await fetch(process.env.REACT_APP_API_KEY + "search" + params, requestOptions).then(async response => {
        dispatch(getWritingsLoading());
        if (!response.ok) {
            if (response.status === 401 || 403) {
                return response = await handleRequestWithTokenRenewal(requestOptions);
            } else {
                throw Error("Could not fetch the data for that resource");
            }
        }
        console.log(response)
        return response.json();
    }).then(data => {
        dispatch(getWritingsSuccess());
        res = data;
    }).catch(err => {
        console.log(err.message);
        dispatch(getWritingsFailure(err.message));
        return err.message;
    })
    return res;
}

export const addWriting = (writing: Writing, category: string): () => Promise<boolean> => async () => {
    let res: boolean = false;
    await fetch(process.env.REACT_APP_API_KEY + category + "add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(writing)
    }).then(response => {
        if (!response.ok) {
            throw Error("Could not add new writing");
        }
        return response.json();
    }).then(data => {
        res = data;
    }).catch(err => {
        return err.message;
    })
    return res;
}

export const fetchSeriesBookList = (series: string, category: string): () => Promise<string[]> => async () => {
    let res: string[] = [];
    const params = `?series=${series}`;
    await fetch(process.env.REACT_APP_API_KEY + category + "seriesBookList" + params, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    }).then(response => {
        if (!response.ok) {
            throw Error("Could not fetch series book list");
        }
        return response.json();
    }).then(data => {
        res = data;
    }).catch(err => {
        return err.message;
    })
    return res;
}

export const findInputResults = (text: string, variation: string, category: string): () => Promise<string[]> => async () => {
    let res: string[] = [];
    const params = `?text=${text}&variation=${variation}`;
    await fetch(process.env.REACT_APP_API_KEY + category + "find" + params, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    }).then(response => {
        if (!response.ok) {
            throw Error("Could not fetch input results");
        }
        return response.json();
    }).then(data => {
        res = data;
    }).catch(err => {
        return err.message;
    })
    return res;
}