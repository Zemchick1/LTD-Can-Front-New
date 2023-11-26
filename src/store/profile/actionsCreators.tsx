import { AppDispatch, store } from "..";
import { Profile } from "../../interfaces/profile.inteface";
import { ActionType } from "./actionTypes";
import { initialState, ProfileState } from "./reducer";

export const signUp = (userInfo: Profile) => ({
    type: ActionType.SIGN_IN,
    payload: userInfo
})

export const signOut = () => ({
    type: ActionType.SIGN_OUT
})

export const changeDefaultCategory = (category: string) => ({
    type: ActionType.CHANGE_DEFAULT_CATEGORY,
    payload: category
})

export const changeUserLanguage = (language: string) => ({
    type: ActionType.CHANGE_LANGUAGE,
    payload: language
})

export const merge = (state: ProfileState) => ({
    type: ActionType.MERGE,
    payload: state
})

export const mergeProfileState = (): (dispatch: AppDispatch) => Promise<void> => async (dispatch: AppDispatch) => {
    const state: ProfileState = store.getState().profile;
    Object.keys(state).forEach((key) => {
        if (!(key in initialState)) {
            // @ts-ignore
            delete state[key];
        }
    })
    const mergedState = { ...state, ...initialState }
    dispatch(merge(mergedState));
}

export const register = (userInfo: Profile): (dispatch: AppDispatch) => Promise<boolean> => async (dispatch: AppDispatch) => {
    let res: boolean = false;
    await fetch(process.env.REACT_APP_API_KEY + "auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInfo),
    }).then(response => {
        if (!response.ok) {
            throw Error("Could not register user");
        }
        return response.json();
    }).then(data => {
        dispatch(signUp(userInfo));
        res = data;
    }).catch(err => {
        return err.message;
    })
    return res;
}

export const login = (userInfo: Profile): (dispatch: AppDispatch) => Promise<boolean> => async (dispatch: AppDispatch) => {
    let res: boolean = false;
    await fetch(process.env.REACT_APP_API_KEY + "auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userInfo),
    }).then(async response => {
        if (!response.ok) {
            throw Error("Could not login user");
        }
        return response.text()
    }).then(() => {
        dispatch(signUp(userInfo));
        res = true;
    }).catch(err => {
        console.log(err)
        return err.message;
    })
    return res;
}

export const logout = (): (dispatch: AppDispatch) => Promise<boolean> => async (dispatch: AppDispatch) => {
    let res: boolean = false;
    await fetch(process.env.REACT_APP_API_KEY + "auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }).then(response => {
        if (!response.ok) {
            throw Error("Could not logout user");
        }
        return response.text();
    }).then(() => {
        dispatch(signOut());
        res = true;
    }).catch(err => {
        return err.message
    })
    return res;
}