import { Injectable } from "@angular/core";
import { UserResponse } from "./api/user.service";

@Injectable()
export class DataService {
    public roomId: string;
    public user: UserResponse;
    public backtrace: {
        url: string;
        params: any;
    };
}