export interface FilterCategory {
    type: string,
    filterItems: FilterItem[]
}

export interface FilterItem {
    status: string,
    name: string,
    quantity?: number
}

export interface Position {
    x: number,
    y: number
}

export interface FilterDTO {
    filterCategories: FilterCategory[],
    yearFrom: number,
    yearTo: number
}