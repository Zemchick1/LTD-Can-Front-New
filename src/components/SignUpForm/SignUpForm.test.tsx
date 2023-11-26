import { renderWithProviders } from "../../utils/test.utils";
import { cleanup, fireEvent } from "@testing-library/react";
import { SignUpForm } from "./SignUpForm";

describe("sign up form tests", () => {
    afterEach(cleanup);
    it("changes inputs", async () => {
        const { getByTestId } = renderWithProviders(<SignUpForm />);

        const name = getByTestId("name") as HTMLInputElement;
        fireEvent.change(name, { target: { value: 'Test' } });
        expect(name.value).toBe('Test');

        const password = getByTestId("password") as HTMLInputElement;
        fireEvent.change(password, { target: { value: 'Test' } });
        expect(password.value).toBe('Test');

        const email = getByTestId("email") as HTMLInputElement;
        fireEvent.change(email, { target: { value: 'Test' } });
        expect(email.value).toBe('Test');
    })
})
