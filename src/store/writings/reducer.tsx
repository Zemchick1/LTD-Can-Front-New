import { AnyAction } from "redux";
import { RequestStatus } from "../../utils/enums";
import { Request } from "../../interfaces/products.interface";
import { ActionTypeRequestStatus } from "./actionTypes";

type WritingsState = {
    request: Request
}

const initialState: WritingsState = {
    request: { status: RequestStatus.IDLE, error: "" }
}

export const writingsReducer = (state: WritingsState = initialState, action: AnyAction) => {
    switch (action.type) {
        case ActionTypeRequestStatus.REQUEST_WRITINGS_LOADING:
            return {
                ...state,
                request: { ...state.request, status: RequestStatus.LOADING }
            }
        case ActionTypeRequestStatus.REQUEST_WRITINGS_SUCCESS:
            return {
                ...state,
                request: {
                    ...state.request, status: RequestStatus.SUCCESS
                }
            }
        case ActionTypeRequestStatus.REQUEST_WRITINGS_FAILURE:
            return {
                ...state,
                request: { ...state.request, status: RequestStatus.FAILURE, error: action.payload }
            }
        default:
            return state;
    }
}