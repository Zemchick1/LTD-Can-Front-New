import { RootState } from "..";

export const profileAuth = (state: RootState) => (state.profile?.authed);
export const profileInfo = (state: RootState) => (state.profile?.userInfo);
export const profileCategory = (state: RootState) => (state.profile?.defaultCategory);
export const profileNavMarks = (state: RootState) => (state.profile?.navMarks);
export const profileLanguage = (state: RootState) => (state.profile?.language);