import { SimpleErrorResponse } from "./errorFactory";

export class ServerError extends Error {
    type: string;
    constructor({ message, type }: SimpleErrorResponse) {
        super(message);
        this.name = "ServerError";
        this.type = type;
    }
}