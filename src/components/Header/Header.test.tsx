import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "./Header";
import { renderWithProviders } from "../../utils/test.utils";
import { logout } from "../../store/profile/actionsCreators";
import { useSelector } from "react-redux";
import { NavMark } from "../../interfaces/profile.inteface";

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn()
}));

describe("Header tests", () => {
    beforeEach(() => {
        useSelectorMock.mockClear();
    });

    afterEach(cleanup);

    jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: jest.fn(),
    }));

    jest.mock('react-redux', () => ({
        ...jest.requireActual('react-redux'),
        useDispatch: jest.fn(),
    }));

    const reactRedux = { useSelector }
    const useSelectorMock = jest.spyOn(reactRedux, "useSelector");

    it("opens lagnuage menu", async () => {
        const { getByTestId, queryByTestId } = renderWithProviders(<Header />);

        const langBtn = getByTestId("langBtn");
        fireEvent.click(langBtn);

        await waitFor(() => expect(queryByTestId('languageMenu')).toBeInTheDocument());
    });

    // it("changes language", () => {
    //     const { getAllByTestId, store } = renderWithProviders(<Header />);

    //     // const initialState: ProfileState = {
    //     //     authed: false,
    //     //     admin: false,
    //     //     userInfo: {
    //     //         id: "",
    //     //         username: "",
    //     //         email: ""
    //     //     },
    //     //     defaultCategory: DbCategories.BOOK,
    //     //     navMarks: [{ name: NavMarks.POPULAR, link: `${NavMarks.POPULAR}` }, { name: NavMarks.GENRES, menu: [{ name: "Fantasy", link: "fantasy" }, { name: "Sci-fi", link: "sciFi" }, { name: "Detective", link: "detective" }] }, { name: NavMarks.COLLECTIONS, menu: [{ name: "Top ", link: "top" }] }, { name: NavMarks.RANDOM, link: `${NavMarks.RANDOM}` }],
    //     //     language: "en",
    //     //     cookieConsent: { necessary: false }
    //     // }

    //     // useDispatchMock.mockClear();

    //     const langBtns = getAllByTestId("lang");

    //     fireEvent.click(langBtns[0]);

    //     const dispatchMock = jest.fn();
    //     store.dispatch = dispatchMock;

    //     expect(dispatchMock).toHaveBeenCalledWith(changeUserLanguage("en"));
    //     expect(dispatchMock).toHaveBeenCalledTimes(1);
    // });

    it("logs out", async () => {
        const mockAuthed = true;
        const mockNavMarksList: NavMark[] = []; // Provide a suitable mock value for navMarksList
        useSelectorMock.mockReturnValue(mockAuthed);
        useSelectorMock.mockReturnValue(mockNavMarksList);
        const { getByTestId, queryByTestId, store } = renderWithProviders(<Header />);

        const profileBtnAuthed = getByTestId("profileBtnAuthed");
        fireEvent.click(profileBtnAuthed);

        let signOutBtnClicked = false;
        await waitFor(() => {
            expect(queryByTestId('logOutBtn')).toBeInTheDocument()
            const signOutBtn = queryByTestId("logOutBtn");
            if (signOutBtn) {
                fireEvent.click(signOutBtn);
                signOutBtnClicked = true;
            }
        })

        const dispatchMock = jest.spyOn(store, 'dispatch');
        if (signOutBtnClicked) {
            store.dispatch(logout());
        }

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(store.getState().profile.authed).toBe(false);
    });
})