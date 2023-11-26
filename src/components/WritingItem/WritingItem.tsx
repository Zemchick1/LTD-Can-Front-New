import { useEffect, useState } from "react"
import { Writing } from "../../interfaces/writings.interface"
import { getImage } from "../../store/helper/actionCreators"
import styles from "./WritingItem.module.sass"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { NavLink } from "react-router-dom"

export const WritingItem = ({ writing }: { writing: Writing }) => {
    const [image, setImage] = useState<string>("");
    const [imageFetched, setImageFetched] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const fetchImages = async () => {
            const imageURL: string = await dispatch(getImage(writing.cover));
            setImageFetched(true);
            setImage(imageURL);
        }

        fetchImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    return (
        <NavLink to={`/writing/${writing.id}`} className={styles.writing}>
            {imageFetched ? <img src={image} alt="cover" className={styles.img}></img> : <div className={styles.img}></div>}
            <h2>{writing.title}</h2>
            <h4>{writing.author}</h4>
            <h4>{writing.year}</h4>
        </NavLink>
    )
}