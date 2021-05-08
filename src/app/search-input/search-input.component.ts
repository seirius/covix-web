import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'search-input',
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

    @Output()
    public onSearch = new EventEmitter<string>();

    public search: string;

    constructor() { }

    ngOnInit(): void {
    }

    public onSubmit(): void {
        this.onSearch.next(this.search);
    }

}
