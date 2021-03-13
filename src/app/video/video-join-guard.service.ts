import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { DataService } from "../data.service";

@Injectable()
export class VideoJoinGuard {

    constructor(
        private router: Router,
        private dataService: DataService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.dataService.username && this.dataService.roomId) {
            return true;
        }
        const { id } = route.queryParams;
        if (!id) {
            this.router.navigate(["/new-room"]);
            return false;
        }
        this.router.navigate(["/join-room"], { queryParams: { id } });
        return true;
    }

}