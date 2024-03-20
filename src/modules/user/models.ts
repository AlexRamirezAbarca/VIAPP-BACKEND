export interface GetUsers {
    id:         number;
    first_name: string;
    last_name:  string;
    email:      string;
    user_name:  string;
    status:     number;
}

export interface UpdateStatusUserI {
    user_id: number;
    status:     number;
}
