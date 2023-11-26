import styles from "./Home.module.sass"
import { Header } from "../Header/Header"
import { Footer } from "../Footer/Footer"
import { PaginationFeed } from "../PaginationFeed/PaginationFeed"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export const Home = () => {
    const { category } = useParams<string>();
    const [categoryParam, setCategory] = useState<string>("");

    useEffect(() => {
        setCategory(category as string);
    }, [category])

    return (
        <>
            <Header />
            <main className={styles.main}>
                <PaginationFeed category={categoryParam} theme={""}></PaginationFeed>
            </main>
            <Footer />
        </>
    )
}