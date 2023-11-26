import { DbCategories } from "../../utils/enums";
import { renderWithProviders } from "../../utils/test.utils";
import { SearchBar } from "./SearchBar";
import { cleanup, fireEvent } from "@testing-library/react";

describe("searchbar tests", () => {
    afterEach(cleanup);
    it("changes search input", async () => {
        const { getByRole } = renderWithProviders(<SearchBar category={DbCategories.BOOK} />);

        const searchBar = getByRole("textbox") as HTMLInputElement;
        fireEvent.change(searchBar, { target: { value: 'Test' } });

        expect(searchBar.value).toBe('Test');
    })
})
