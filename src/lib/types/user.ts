export type User = {
    username: string
    data?: {
        exercises?: {[key: string]: {answers: number, date: string}}
    }
}