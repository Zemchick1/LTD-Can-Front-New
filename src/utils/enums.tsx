export enum RequestStatus {
    IDLE = 0,
    LOADING = 1,
    SUCCESS = 2,
    FAILURE = 3,
}

export enum DbCategories {
    BOOK = "book",
    MANGA = "manga",
    COMICS = "comics"
}

export enum PageChange {
    PREV = "prev",
    NEXT = "next"
}

export enum NavMarks {
    POPULAR = "popular",
    GENRES = "genres",
    COLLECTIONS = "collections",
    RANDOM = "random"
}

export enum FilterStatus {
    AND = "AND",
    OR = "OR",
    NOT = "NOT"
}

export enum BookType {
    FICTION = "Fiction",
    NONFICTION = "Non-Fiction"
}