import styles from "./PaginationFeedLoader.module.sass";
import ContentLoader from "styled-content-loader"

export const PaginationFeedLoader = () => {
    return (
        <ContentLoader>
            <div className={styles.s}></div>
        </ContentLoader>
    )
}