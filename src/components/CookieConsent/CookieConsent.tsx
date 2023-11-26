import styles from "./CookieConsent.module.sass";
import { useCookies } from "react-cookie";

export const CookieConsent = () => {
    const [, setCookies] = useCookies(["cookieConsent"]);

    const giveCookieConsent = (): void => {
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        setCookies("cookieConsent", true, { path: "/", expires: new Date(expirationDate) });
    }

    return (
        <>
            <div className={styles.cookieBanner}>
                WE STEAL YOUR DATA MUAHAAHAHA!1!!
                <button className={styles.acceptBtn} onClick={giveCookieConsent}>Accept</button>
            </div>
        </>
    )
}