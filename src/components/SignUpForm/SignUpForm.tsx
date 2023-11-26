import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { register } from "../../store/profile/actionsCreators"
import styles from "../LoginForm/AuthForm.module.sass"
import { AppDispatch } from "../../store";
import { Profile } from "../../interfaces/profile.inteface";

type DynamicObject = Record<string, string>;

export const SignUpForm = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setName] = useState<string>("")
    const [validationErrors, setValidationErrors] = useState<DynamicObject>({});
    const dispatch: AppDispatch = useDispatch()
    const navigate = useNavigate();

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    }

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    }

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    }

    const validate = (): boolean => {
        const errors: DynamicObject = validationErrors;
        let validation = true;

        // eslint-disable-next-line
        if (!/^(?:(?:[^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|\".+?\")@(?:(?:\[(?:\d{1,3}\.){3}\d{1,3}\])|(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/i.test(email)) {
            errors["email"] = "Incorrect email";
            validation = false;
        }
        if (!/(?=.*\d)/.test(password)) {
            errors["passwordDigit"] = "Incorrect password";
            validation = false;
        }
        if (!/(?=.*[!@#$%^&*])/.test(password)) {
            errors["passwordSymbol"] = "Incorrect password";
            validation = false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            errors["passwordCase"] = "Incorrect password";
            validation = false;
        }
        if (!/^.{8,25}$/.test(password)) {
            errors["passwordLength"] = "Incorrect password";
            validation = false;
        }

        setValidationErrors(errors);
        return validation;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const userInfo: Profile = {
            username: username,
            email: email,
            id: "",
            password: password
        }

        const authed = await dispatch(register(userInfo));
        console.log(authed)
        if (authed === true) {
            navigate("/", { replace: true });
        }
    }

    return (
        <div className="sign-screen">
            <form className={styles.form}>
                <label htmlFor="username" className={styles.loginLabel}>Username*</label>
                <input type="text" data-testid="name" placeholder="Enter your name" className={styles.loginInput} id="username" value={username} onChange={(event) => { handleChangeName(event) }} autoFocus required />
                <label htmlFor="email" className={styles.loginLabel}>Email*</label>
                <input type="email" data-testid="email" placeholder="Enter your email" className={styles.loginInput} id="email" value={email} onChange={(event) => { handleChangeEmail(event) }} required />
                {validationErrors["email"] && <p>{validationErrors["email"]}</p>}
                <label htmlFor="password" className={styles.loginLabel}>Password*</label>
                <input type="password" data-testid="password" placeholder="Enter your password" className={styles.loginInput} id="password" value={password} onChange={(event) => { handleChangePassword(event) }} required />
                {Object.keys(validationErrors).some(key => key !== "email") &&
                    <div>
                        <p className={`${validationErrors["passwordLength"] ? styles.invalid : styles.valid}`}>Must be at from 8 to 25 characters</p>
                        <p className={`${validationErrors["passwordDigit"] ? styles.invalid : styles.valid}`}>Must include a digit</p>
                        <p className={`${validationErrors["passwordSymbol"] ? styles.invalid : styles.valid}`}>Must include a special character</p>
                        <p className={`${validationErrors["passwordCase"] ? styles.invalid : styles.valid}`}>Must include lowercase and uppercase character</p>
                    </div>
                }
                <button type="submit" onClick={handleSubmit} className={styles.loginBtn}>Create account</button>
            </form>
            <div>
                <p className={styles.loginText}>
                    Already have an account?
                    <Link to='/login' className={styles.loginLink}>Log in</Link>
                </p>
            </div>
        </div>
    )
}

