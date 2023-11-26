import { Footer } from "../Footer/Footer"
import { Header } from "../Header/Header"
import defaultCover from "../../assets/images/foodBanner.jpg"
import styles from "./WritingsAddition.module.sass"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BookType } from "../../utils/enums"
import Select, { GroupBase, MenuListProps, MultiValue, SingleValue, StylesConfig, components } from 'react-select';
import { addWriting, findInputResults, fetchSeriesBookList } from "../../store/writings/actionsCreators"
import { AppDispatch } from "../../store"
import { useDispatch } from "react-redux"

type Option = {
    value: string,
    label: string
}

type DynamicObject = Record<string, string>;

const initOptions: Option[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
];

export const WritingsAddition = () => {
    const [image, setImage] = useState<string>("");
    const [series, setSeries] = useState<SingleValue<Option>>();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isbn, setIsbn] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [pages, setPages] = useState<string>("");
    const [year, setYear] = useState<number>(0);
    const [era, setEra] = useState<string>("CE");
    const [prequel, setPrequel] = useState<string>("");
    const [sequel, setSequel] = useState<string>("");
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedGenres, setGenres] = useState<MultiValue<Option>>([]);
    const [selectedTags, setTags] = useState<MultiValue<Option>>([]);
    const [selectedAuthors, setAuthors] = useState<MultiValue<Option>>([]);
    const [selectedLitGenres, setLitGenres] = useState<MultiValue<Option>>([]);
    const [selectedLang, setLang] = useState<SingleValue<Option>>();
    const [genreInput, setGenreInput] = useState<string>("");
    const [tagInput, setTagInput] = useState<string>("");
    const [authorsInput, setAuthorsInput] = useState<string>("");
    const [litGenreInput, setLitGenreInput] = useState<string>("");
    const [seriesInput, setSeriesInput] = useState<string>("");
    const [langInput, setLangInput] = useState<string>("");
    const [seriesBookList, setSeriesBookList] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<DynamicObject>({});
    const [approximateDate, setApproximateDate] = useState<boolean>(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
    const { category } = useParams();
    const dispatch: AppDispatch = useDispatch();

    const uploadImage = (): void => {
        setImage("");
    }

    useEffect(() => {
        const getSeriesBookList = async () => {
            const bookList = await dispatch(fetchSeriesBookList((series as Option).value, category as string));
            setSeriesBookList(bookList);
        }

        if (series) {
            getSeriesBookList();
        }
        // eslint-disable-next-line
    }, [series]);

    const delayDebounceFn = (input: string, variation: string): string[] => {
        let res: string[] = [];
        const delayDebouncer = setTimeout(async () => {
            res = await dispatch((findInputResults(input, variation, category as string)));
            return res;
        }, 500)

        setTimeoutId(delayDebouncer);
        return res;
    }

    const handleOptions = (input: string, variation: string): void => {
        clearTimeout(timeoutId);
        const res: string[] = delayDebounceFn(input, variation);

        if (res.length > 0) {
            const options = res.map((value) => { return { value: value.toLowerCase(), label: value } });
            setOptions(options);
        }

        switch (variation) {
            case "title":
                setTitle(input);
                break;
            case "authors":
                setAuthorsInput(input);
                break;
            case "description":
                setDescription(input);
                break;
            case "genres":
                setGenreInput(input);
                break;
            case "tags":
                setTagInput(input);
                break;
            case "litGenres":
                setLitGenreInput(input);
                break;
            case "isbn":
                setIsbn(input);
                break;
            case "series":
                setSeriesInput(input);
                break;
            case "lang":
                setLangInput(input);
                break;
            default:
                return;
        }
        setOptions(initOptions);
    }

    const chooseOption = (newSelections: MultiValue<Option> | SingleValue<Option>, variation: string) => {
        switch (variation) {
            case "authors":
                setAuthors(newSelections as MultiValue<Option>);
                break;
            case "genres":
                setGenres(newSelections as MultiValue<Option>);
                break;
            case "tags":
                setTags(newSelections as MultiValue<Option>);
                break;
            case "litGenres":
                setLitGenres(newSelections as MultiValue<Option>);
                break;
            case "series":
                setSeries(newSelections as SingleValue<Option>);
                break;
            case "lang":
                setLang(newSelections as SingleValue<Option>);
                break;
            default:
                return;
        }
    }

    const handleAddWriting = (): void => {
        const writing = { title: title, author: selectedAuthors.map((selection) => selection.value), year: year, description: description, pages: parseInt(pages), cover: "", genre: selectedGenres.map((selection) => selection.value), tags: selectedTags.map((selection) => selection.value), type: type, isbn: isbn, language: selectedLang?.value as string, prequel: prequel, sequel: sequel, era: era, approximateDate: approximateDate };
        addWriting(writing, category as string);
    }

    const customAddNewMenuList = (props: MenuListProps<Option, true, GroupBase<Option>>) => {
        return (
            <components.MenuList {...props}>
                {props.children}
                <div className={styles.addNew}>Add new author</div>
            </components.MenuList>
        )
    }

    const customSelectStyles: StylesConfig<Option, true, GroupBase<Option>> = {
        option: (provided: any, state: any) => ({
            ...provided,
            background: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : 'white',
            color: state.isSelected ? 'white' : 'black',
        })
    }

    const selectType = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setType(event.target.value);
    }

    const handleInputNumbers = (event: React.ChangeEvent<HTMLInputElement>, variation: string): void => {
        const value: string = event.target.value;
        const errors: DynamicObject = validationErrors;

        if (/^[1-9]\d*$/.test(value) || value.length === 0) {
            switch (variation) {
                case "pages":
                    setPages(value);
                    break;
                case "year":
                    if ((parseInt(value) > new Date().getFullYear() && era === "CE") || (parseInt(value) > 2600 && era === "BCE")) {
                        errors["year"] = "Wrong year";
                        setValidationErrors(errors);
                        console.log("Number cannot exceed current year");
                        break;
                    } else {
                        setYear(parseInt(value));
                        break;
                    }
                default:
                    return;
            }
        }
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.imagePlaceholder} onClick={uploadImage}>
                    <img alt="cover" src={image ? image : defaultCover} />
                    {/*TODO Show on hover button */}
                </div>
                <form className={styles.form}>
                    <label htmlFor="title">*Title</label>
                    <input id="title" type="text" onChange={(event) => handleOptions(event.target.value, "title")} required />

                    <label htmlFor="authors">*Authors</label>
                    <Select className={styles.select} placeholder={""} isMulti value={selectedAuthors} id="authors"
                        onChange={(selection) => chooseOption(selection, "authors")}
                        onInputChange={(input) => handleOptions(input, "authors")}
                        options={options} menuIsOpen={authorsInput.trim() !== ""}
                        noOptionsMessage={({ inputValue }) => inputValue && "No results found"}
                        components={{ MenuList: customAddNewMenuList }}
                        styles={customSelectStyles} required />

                    <label htmlFor="type">*{category} Type</label>
                    <select id="type" name="type" onChange={selectType} required>
                        <option value={BookType.FICTION}>{BookType.FICTION}</option>
                        <option value={BookType.NONFICTION}>{BookType.NONFICTION}</option>
                    </select>

                    <label htmlFor="litGenre">*Literature Genre</label>
                    <Select className={styles.select} placeholder={""} isMulti value={selectedLitGenres} id="litGenres"
                        onChange={(selection) => chooseOption(selection, "litGenres")}
                        onInputChange={(input) => handleOptions(input, "litGenres")}
                        options={options} menuIsOpen={litGenreInput.trim() !== ""}
                        noOptionsMessage={({ inputValue }) => inputValue && "No results found"}
                        styles={customSelectStyles} required />

                    <label htmlFor="genres">Genres</label>
                    <Select className={styles.select} placeholder={""} isMulti value={selectedGenres} id="genres"
                        onChange={(selection) => chooseOption(selection, "genres")}
                        onInputChange={(input) => handleOptions(input, "genres")}
                        options={options} menuIsOpen={genreInput.trim() !== ""}
                        noOptionsMessage={({ inputValue }) => inputValue && "No results found"}
                        styles={customSelectStyles} />

                    <label htmlFor="tags">Tags</label>
                    <Select className={styles.select} placeholder={""} isMulti value={selectedTags} id="tags"
                        onChange={(selection) => chooseOption(selection, "tags")}
                        onInputChange={(input) => { handleOptions(input, "tags") }}
                        options={options} menuIsOpen={tagInput.trim() !== ""}
                        noOptionsMessage={({ inputValue }) => inputValue && "No results found"}
                        styles={customSelectStyles} />

                    <label htmlFor="description">Description</label>
                    <input id="description" type="text" onChange={(event) => handleOptions(event.target.value, "description")} />

                    <label htmlFor="isbn">ISBN</label>
                    <input id="isbn" type="text" onChange={(event) => handleOptions(event.target.value, "isbn")} />

                    <label htmlFor="series">Series</label>
                    <Select className={styles.select} placeholder={""} isMulti={false} value={series} id="series"
                        onChange={(selection) => chooseOption(selection, "series")}
                        onInputChange={(input) => handleOptions(input, "series")}
                        options={options} menuIsOpen={seriesInput.trim() !== ""}
                        noOptionsMessage={({ inputValue }) => inputValue && "No results found"}
                        styles={customSelectStyles} />
                    {series &&
                        <>
                            <label htmlFor="prequel">Prequel</label>
                            <select id="prequel" value={prequel} onChange={(event) => setPrequel(event.target.value)}>
                                {seriesBookList && seriesBookList.map((book) => {
                                    return (
                                        <option value={book} key={book}>{book}</option>
                                    )
                                })}
                            </select>
                            <label htmlFor="sequel">Sequel</label>
                            <select id="sequel" value={sequel} onChange={(event) => setSequel(event.target.value)}>
                                {seriesBookList && seriesBookList.map((book) => {
                                    return (
                                        <option value={book} key={book}>{book}</option>
                                    )
                                })}
                            </select>
                        </>}

                    <label htmlFor="pages">*Number of Pages</label>
                    <input id="pages" type="text" value={pages} onChange={(event) => handleInputNumbers(event, "pages")} required />

                    <label htmlFor="time">Listening Time</label>
                    <input id="time" type="date" />

                    <label htmlFor="pubDate">Publication Date</label>
                    <div>
                        <input id="pubDate" type="text" onChange={(event) => handleInputNumbers(event, "year")} value={year} />
                        <select id="pubDate" onChange={(event) => setEra(event.target.value)} value={era}>
                            <option value={"BCE"}>BCE</option>
                            <option value={"CE"}>CE</option>
                        </select>

                        <input type="checkbox" id="approximate" onClick={() => setApproximateDate(!approximateDate)} />
                        <label htmlFor="approximate">Approximate Date</label>

                        {validationErrors["year"] && <p>{validationErrors["year"]}</p>}
                    </div>

                    <label htmlFor="lang">*Language</label>
                    <Select className={styles.select} placeholder={""} isMulti={false} value={series} id="lang"
                        onChange={(selection) => chooseOption(selection, "lang")}
                        onInputChange={(input) => handleOptions(input, "lang")}
                        options={options} menuIsOpen={langInput.trim() !== ""}
                        noOptionsMessage={({ inputValue }) => inputValue && "No results found"}
                        styles={customSelectStyles} />

                    <label htmlFor="where">Where to Read</label>
                    <input id="where" />

                    <button onClick={handleAddWriting}>Add Book</button>
                </form>
            </main >
            <Footer />
        </>
    )
}