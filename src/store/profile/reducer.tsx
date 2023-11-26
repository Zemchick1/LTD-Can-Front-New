import { AnyAction } from "redux";
import { CookieConsent, NavMark, Profile } from "../../interfaces/profile.inteface";
import { DbCategories, NavMarks } from "../../utils/enums";
import { ActionType } from "./actionTypes";

export interface ProfileState {
    authed: boolean
    admin: boolean,
    userInfo: Profile,
    defaultCategory: string,
    navMarks: NavMark[],
    language: string,
    cookieConsent: CookieConsent
}

export const initialState: ProfileState = {
    authed: false,
    admin: false,
    userInfo: {
        id: "",
        username: "",
        email: ""
    },
    defaultCategory: DbCategories.BOOK,
    navMarks: [{ name: NavMarks.POPULAR, link: `${NavMarks.POPULAR}` }, { name: NavMarks.GENRES, menu: [{ name: "Fantasy", link: "fantasy" }, { name: "Sci-fi", link: "sciFi" }, { name: "Detective", link: "detective" }] }, { name: NavMarks.COLLECTIONS, menu: [{ name: "Top ", link: "top" }] }, { name: NavMarks.RANDOM, link: `${NavMarks.RANDOM}` }],
    language: "en",
    cookieConsent: { necessary: false }
}

export const profileReducer = (state: ProfileState = initialState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.SIGN_IN:
            return {
                ...state,
                authed: true,
                userInfo: action.payload
            };
        case ActionType.SIGN_OUT:
            return initialState;
        case ActionType.CHANGE_DEFAULT_CATEGORY:
            return {
                ...state,
                category: action.payload
            };
        case ActionType.CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.payload
            };
        case ActionType.MERGE:
            return action.payload;
        default: return state;
    }
}
