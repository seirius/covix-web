import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface SaveUser {
    username: string;
    clientId?: string;
}

export interface UserResponse {
    id: string;
    username: string;
    clientId: string;
    createdAt: number;
}

export interface UpdateUserClientID {
    clientId: string;
    username: string;
}

@Injectable()
export class UserService {

    constructor(
        private readonly httpClient: HttpClient
    ) {}

    public saveUser(args: SaveUser): Promise<UserResponse> {
        return this.httpClient
        .post<UserResponse>("/api/user", args)
        .toPromise();
    }

    public getUser(username: string): Promise<UserResponse> {
        return this.httpClient
        .get<UserResponse>(`/api/user`, {
            params: { username }
        })
        .toPromise();
    }

    public getFreeUsers(): Promise<UserResponse[]> {
        return this.httpClient
        .get<UserResponse[]>("/api/user/free")
        .toPromise();
    }

    public updateClientId(args: UpdateUserClientID): Promise<void> {
        return this.httpClient
        .put<void>(`/api/user/${args.username}/client-id`, { clientId: args.clientId })
        .toPromise();
    }

    public deleteUser(username: string): Promise<void> {
        return this.httpClient
        .delete<void>(`/api/user/${username}`)
        .toPromise();
    }

}