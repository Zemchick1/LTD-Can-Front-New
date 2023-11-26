import { Writing } from "../../../interfaces/writings.interface";
import { useEffect, useState } from "react";
import styles from "./SearchItem.module.sass";
import { AppDispatch } from "../../../store";
import { useDispatch } from "react-redux";
import { getImage } from "../../../store/helper/actionCreators";
import defaultCover from "../../../assets/images/foodBanner.jpg"
import { useNavigate, useParams } from "react-router-dom";
import queryString from 'query-string';

export const SearchItem = ({ writing }: { writing: Writing }) => {
    const [image, setImage] = useState<string>("");
    const { category } = useParams();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            const imageURL: string = await dispatch(getImage(writing.cover));
            setImage(imageURL);
        }

        fetchImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    const viewWriting = (): void => {
        const writingParam = queryString.stringify(writing);
        navigate(`/${category}/writing/${writing.id}?${writingParam}`);
    }

    return (
        <div className={styles.writing} onClick={viewWriting}>
            <div className={styles.image}>
                <img alt="cover" src={image ? image : defaultCover}></img>
            </div>
            <div className={styles.info}>
                <h2 className={styles.title}>{writing.title}</h2>
                <div className={styles.tagList}>
                    {writing.tags.map((tag) => {
                        return <span className={styles.tag} key={tag}>{tag}</span>
                    })}
                </div>
                <p className={styles.description}>{writing.description}</p>
            </div>
        </div>
    )
}