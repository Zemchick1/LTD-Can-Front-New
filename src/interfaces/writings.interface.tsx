import { FilterCategory } from "./filter.interface"

export interface Writing {
    id?: string,
    title: string,
    author: string[],
    year: number,
    description: string,
    pages: number,
    cover: string,
    genre: string[],
    tags: string[],
    prequelId?: string,
    sequelId?: string,
    chapters?: Chapter[],
    type: string,
    isbn?: string,
    language: string,
    era: string,
    approximateDate: boolean
}

export interface Serie {
    id: string,
    author: string[],
    writings: Writing[]
}

export interface Chapter {
    id: string,
    name: string,
    link: string
}

export interface SearchResult {
    books: Writing[],
    filter: FilterCategory[]
}