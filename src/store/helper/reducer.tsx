import { AnyAction } from "redux";

type helperState = {
}

const initialState: helperState = {
}

export const helperReducer = (state: helperState = initialState, action: AnyAction) => {
    switch (action.type) {
        default:
            return state;
    }
}