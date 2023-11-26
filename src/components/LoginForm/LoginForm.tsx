import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { login } from '../../store/profile/actionsCreators';
import { Profile } from '../../interfaces/profile.inteface';
import { Navigate } from "react-router";
import styles from "./AuthForm.module.sass"
import { profileAuth } from '../../store/profile/selectors';

export const LoginForm = () => {
    const [email, setEmail] = useState<string>("buimax12345@gmail.com");
    const [password, setPassword] = useState<string>("Test!12345");
    const authed = useSelector(profileAuth);
    const dispatch: AppDispatch = useDispatch();

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    }

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const userInfo: Profile = {
            username: "",
            email: email,
            password: password,
            id: ""
        }
        await dispatch(login(userInfo));
    }

    return (
        <>
            <form className={styles.form}>
                {authed ? <Navigate replace to="/" /> :
                    <>
                        <label htmlFor="email" className={styles.loginLabel}>Email*</label>
                        <input type="email" placeholder="Enter your email" className={styles.loginInput} id="email" value={email} onChange={handleChangeEmail} autoFocus />
                        <label htmlFor="password" className={styles.loginLabel}>Password*</label>
                        <input type="password" placeholder="Enter your password" className={styles.loginInput} id="password" value={password} onChange={handleChangePassword} />
                        <button onClick={handleSubmit} className={styles.loginBtn}>Login</button>
                    </>
                }
            </form>
        </>
    )
}