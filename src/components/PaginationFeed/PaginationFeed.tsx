import { WRITINGS_ON_PAGE } from "../../utils/const";
import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./PaginationFeed.module.sass"
import { Writing } from "../../interfaces/writings.interface";
import { WritingItem } from "../WritingItem/WritingItem";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { PageChange } from "../../utils/enums";
import { getWritingFeed } from "../../store/writings/actionsCreators";
import { PaginationFeedLoader } from "./PaginationFeedLoader/PaginationFeedLoader";

export const PaginationFeed = ({ category, theme }: { category: string, theme: string }) => {
    const [firstWritingOfPage, setFirstWriting] = useState<number>(0);
    const [writings, setWritings] = useState<Writing[]>([]);
    const [currentWritings, setCurrentWritings] = useState<Writing[]>([]);
    const [replacingWritings, setReplacingWritings] = useState<Writing[]>([]);
    const [transition, setTransition] = useState<string>("");
    const dispatch: AppDispatch = useDispatch();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [distance, setDistance] = useState<number>(0);
    const [selectedAnimation, setAnimation] = useState<CSSProperties | undefined>(undefined);
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchWritings = async () => {
            setLoading(true);
            const writings: Writing[] = await dispatch(getWritingFeed(category, "")).then((writings) => { setLoading(false); return writings });
            setWritings(writings);
        }

        fetchWritings();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [category])

    const handlePageChange = (pageChange: string): void => {
        calculateDistance();

        if (pageChange === PageChange.PREV) {
            const newPageStart = firstWritingOfPage - WRITINGS_ON_PAGE;

            if (newPageStart < 0) {
                const difference = Math.abs(newPageStart);
                const newPage = [...writings?.slice(writings.length - difference, writings.length), ...writings?.slice(0, firstWritingOfPage)];
                setReplacingWritings(newPage);
                setFirstWriting(writings.length - difference);
            } else if (firstWritingOfPage === 0) {
                const newPage = writings?.slice(writings.length - WRITINGS_ON_PAGE, writings.length);
                setReplacingWritings(newPage);
                setFirstWriting(writings.length - WRITINGS_ON_PAGE);
            } else {
                const newPage = writings?.slice(newPageStart, newPageStart + WRITINGS_ON_PAGE);
                setReplacingWritings(newPage);
                setFirstWriting(newPageStart);
            }

            const selectedAnimation: CSSProperties = {
                animation: "leftToRightOut 0.75s ease-in-out",
                position: "relative"
            };
            setAnimation(selectedAnimation);
        } else if (pageChange === PageChange.NEXT) {
            const newPageStart = firstWritingOfPage + WRITINGS_ON_PAGE;

            if ((newPageStart + WRITINGS_ON_PAGE > writings.length) && (newPageStart < writings.length)) {
                const difference = newPageStart + WRITINGS_ON_PAGE - writings.length;
                const newPage = [...writings?.slice(newPageStart, writings.length), ...writings?.slice(0, difference)];
                setReplacingWritings(newPage);
                setFirstWriting(newPageStart);
            } else if (writings.length - WRITINGS_ON_PAGE === firstWritingOfPage) {
                const newPage = writings?.slice(0, WRITINGS_ON_PAGE - 1);
                setReplacingWritings(newPage);
                setFirstWriting(0);
            } else if (newPageStart > writings.length) {
                const difference = newPageStart - writings.length;
                const newPage = writings?.slice(difference, difference + WRITINGS_ON_PAGE);
                setReplacingWritings(newPage);
                setFirstWriting(difference);
            } else {
                const newPage = writings?.slice(newPageStart, newPageStart + WRITINGS_ON_PAGE);
                setReplacingWritings(newPage);
                setFirstWriting(newPageStart);
                console.log(newPageStart)
            }

            const selectedAnimation: CSSProperties = {
                animation: "rightToLeftOut 0.75s ease-in-out",
                position: "relative"
            };
            setAnimation(selectedAnimation);
        }

        setTransition(pageChange);
    }

    const calculateDistance = () => {
        const page = pageRef.current;
        let pageWidth = 0;
        let distancePixels = 0;

        if (page) {
            pageWidth = page.offsetWidth;
            const writings = Array.from(page.children);
            const writingsWidths = writings.map((writing) => (writing as HTMLDivElement).offsetWidth);
            const totawritingsWidths = writingsWidths.reduce((total, width) => total + width, 0);

            distancePixels = (pageWidth - totawritingsWidths) / (writings.length - 1);
        }

        setDistance(distancePixels + pageWidth);
    }

    const keyframes = `
    @keyframes leftToRightIn {
        0% { left: -${distance}px }
        100% { left: 0px }
    }
    
    @keyframes leftToRightOut {
        0% { left: 0px }
        100% { left: ${distance}px }
    }

    @keyframes rightToLeftIn {
        0% { right: -${distance}px }
        100% { right: 0px }
    }

    @keyframes rightToLeftOut {
        0% { right: 0px }
        100% { right: ${distance}px }
    }
    `

    return (
        <div className={styles.pagination}>
            <style>{keyframes}</style>
            {false ?
                <PaginationFeedLoader />
                :
                <>
                    <h2 className={styles.title}>{theme}kek</h2>
                    {isLoading}
                    <div className={styles.paginationButtons}>
                        <div className={styles.feedBtns}>
                            <button className={styles.feedBtn}>View all</button>
                            <button className={styles.feedBtn}>Get random</button>
                        </div>
                        <div className={styles.pageBtns}>
                            <button onClick={() => handlePageChange(PageChange.PREV)} disabled={transition.length !== 0 && true} className={styles.pageBtn}>left</button>
                            <button onClick={() => handlePageChange(PageChange.NEXT)} disabled={transition.length !== 0 && true} className={styles.pageBtn}>right</button>
                        </div>
                    </div>
                    <div className={styles.feed}>
                        <div style={selectedAnimation}
                            className={styles.page} ref={pageRef} onAnimationEnd={() => setAnimation(undefined)}>
                            {currentWritings?.map((writing) => {
                                return (
                                    <WritingItem writing={writing} key={writing.id} />
                                )
                            })}
                        </div>
                        {transition === PageChange.PREV &&
                            <div className={styles.page} style={{
                                position: "absolute",
                                animation: `0.75s ease-in-out leftToRightIn`,
                            }} onAnimationEnd={() => { setCurrentWritings(replacingWritings); setTransition("") }}>
                                {replacingWritings?.map((writing) => {
                                    return (
                                        <WritingItem writing={writing} key={writing.id} />
                                    )
                                })}
                            </div>}
                        {transition === PageChange.NEXT &&
                            <div className={styles.page} style={{
                                position: "absolute",
                                animation: "0.75s ease-in-out rightToLeftIn",
                            }} onAnimationEnd={() => { setCurrentWritings(replacingWritings); setTransition("") }}>
                                {replacingWritings?.map((writing) => {
                                    return (
                                        <WritingItem writing={writing} key={writing.id} />
                                    )
                                })}
                            </div>}
                    </div>
                </>
            }
        </div >
    )
}