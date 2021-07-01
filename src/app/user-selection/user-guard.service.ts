import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { DataService } from "../data.service";

@Injectable()
export class UserGuard {

    constructor(
        private router: Router,
        private dataService: DataService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.dataService.user?.username) {
            return true;
        }
        this.dataService.backtrace = {
            url: route.routeConfig.path,
            params: route.queryParams
        };
        this.router.navigate(["/users"]);
        return true;
    }

}