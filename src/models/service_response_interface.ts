import { Response } from "express";

export interface ServiceResponseI {
    statusCode?: number,
    data?: any,
    message?: string,
    res: Response | null
}

export interface MysqlErrorI {
    error: 1 | 0,
    message?: string
}

export interface ErrorI {
    error: 1 | 0,
    message?: string
    statusCode?: number,
}