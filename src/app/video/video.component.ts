import { Component, OnInit } from '@angular/core';
import videojs from "video.js";

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    public videoOptions: videojs.PlayerOptions = {
        autoplay: true,
        controls: true,
        sources: [
            {
                src: "/api/video",
                type: "video/mp4"
            }
        ]
    };

    constructor() { }

    ngOnInit(): void {
    }

}
