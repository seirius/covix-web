import { Injectable } from "@angular/core";

@Injectable()
export class DataService {
    public roomId: string;
    public username: string;
    public backtrace: {
        url: string;
        params: any;
    };
    public clientId: string;
}