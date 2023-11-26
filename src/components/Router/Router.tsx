import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { profileCategory } from "../../store/profile/selectors"
import { Home } from "../Home/Home"
import { LoginForm } from "../LoginForm/LoginForm"
import { SearchPage } from "../SearchPage/SearchPage"
import { SignUpForm } from "../SignUpForm/SignUpForm"
import { WritingView } from "../WritingView/WritingView"
import { useEffect } from "react"
import { AppDispatch, store } from "../../store"
import { mergeProfileState } from "../../store/profile/actionsCreators"
import { compareObjectKeys } from "../../store/helper/actionCreators"
import { initialState } from "../../store/profile/reducer"
import { WritingsAddition } from "../WritingsAddition/WritingsAddition"

export const Router = () => {
    const category = useSelector(profileCategory);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (!compareObjectKeys(store.getState().profile, initialState)) {
            dispatch(mergeProfileState());
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={`/${category}`} />} />
                <Route path=":category" element={<Home />} />
                <Route path=":category/search" element={<SearchPage />}>
                    <Route index element={<SearchPage />} />
                    <Route path=":searchTextParam" element={<SearchPage />} />
                </Route>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signUp" element={<SignUpForm />} />
                <Route path=":category/writing">
                    <Route index element={<WritingView />} />
                    <Route path=":writingId" element={<WritingView />} />
                </Route>
                <Route path=":category/addition" element={<WritingsAddition />} />
                <Route path='*' element={<h3>Error 404</h3>} />
            </Routes>
        </BrowserRouter>
    )
}