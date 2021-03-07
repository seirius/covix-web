import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public links = [
        { title: "New Room", fragment: "new-room" },
    ];

    constructor(
        public route: ActivatedRoute
    ) { }

}
