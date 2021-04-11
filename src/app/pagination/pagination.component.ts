import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    @Input()
    public pages = 0;

    @Input()
    public currentPage = 1;

    @Input()
    public offset = 1;

    @Output()
    public selectedPage = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void {
    }

    public get range(): number[] {
        let start = this.currentPage - this.offset - 1;
        if (start < 0) {
            start = 0;
        }
        let end = this.currentPage + this.offset;
        if (end - 1 === this.pages) {
            end = undefined;
        }
        return [...Array(this.pages).keys()]
        .slice(start, end)
        .map(n => n + 1);
    }

    public click(page: number) {
        this.currentPage = page;
        this.selectedPage.emit(this.currentPage);
    }

    public move(forward = true) {
        let tempPage = this.currentPage + (forward ? 1 : -1);
        if (tempPage < 1) {
            tempPage = 1;
        } else if (tempPage > this.pages) {
            tempPage = this.pages;
        }
        this.currentPage = tempPage;
        this.selectedPage.emit(this.currentPage);
    }

    public edges(first = true) {
        this.currentPage = first ? 1 : this.pages;
        this.selectedPage.emit(this.currentPage);
    }

}
