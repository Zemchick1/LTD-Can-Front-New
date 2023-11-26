import styles from "./WritingView.module.sass";
import defaultCover from "../../assets/images/foodBanner.jpg"
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getImage } from "../../store/helper/actionCreators";
import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import { Writing } from "../../interfaces/writings.interface";

export const WritingView = () => {
    const [image, setImage] = useState<string>("");
    const dispatch: AppDispatch = useDispatch();
    const { writingId } = useParams();
    const location = useLocation();
    const writing: Writing = queryString.parse(location.search) as unknown as Writing;

    useEffect(() => {
        console.log(writing);
        console.log(writingId)
        const fetchImages = async () => {
            const imageURL: string = await dispatch(getImage(writing.cover));
            setImage(imageURL);
        }

        fetchImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    return (
        <>
            <div className={styles.main}>
                <img alt="cover" src={image ? image : defaultCover} />
                <div>view</div>
            </div>
        </>
    )
}