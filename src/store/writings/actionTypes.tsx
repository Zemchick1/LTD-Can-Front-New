import { RequestStatus } from "../../utils/enums"

export enum ActionTypeRequestStatus {
    REQUEST_WRITINGS_LOADING = RequestStatus.LOADING,
    REQUEST_WRITINGS_SUCCESS = RequestStatus.SUCCESS,
    REQUEST_WRITINGS_FAILURE = RequestStatus.FAILURE
}