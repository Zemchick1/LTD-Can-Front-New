export interface Profile {
    username: string,
    email: string,
    id: string,
    password?: string,
}

export interface NavMark {
    name: string,
    link?: string,
    menu?: NavMark[]
}

export interface CookieConsent {
    necessary: boolean
}