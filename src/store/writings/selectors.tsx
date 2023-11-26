import { RootState } from "..";
import { RequestStatus } from "../../utils/enums";

export const writingsLoading = (state: RootState) => (state.writings?.request.status === RequestStatus.LOADING);
export const writingsError = (state: RootState) => (state.writings?.request.error);