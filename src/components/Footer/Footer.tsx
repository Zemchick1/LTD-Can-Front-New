import styles from "./Footer.module.sass"

export const Footer = () => {
    return (
        <footer>
            <div className={styles.socials}></div>
            <p className={styles.copyright}></p>
        </footer>
    )
}