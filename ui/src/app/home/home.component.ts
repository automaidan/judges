/**
 * HOME PAGE
 *
 * **/
import { Component, Input, OnInit } from '@angular/core';
import {DataTableDirectives} from 'angular2-datatable/datatable';

import { Api } from '../common/services/api.service';


@Component({
    selector: 'home-layout',
    template: require('./home.view.html'),
    styles: [require('./home.css')],
    providers:[Api],
    directives: [DataTableDirectives]
})

export class HomeComponent implements OnInit {
    judgeList: Array<any> = [];
    constructor (private api: Api) {

    }
    ngOnInit () { this.getData(); }

    getData () {
        this.api.getJudges()
            .then(judgeList => {
                this.judgeList = judgeList;
            },
            err => {
                throw new Error(err.message);
            })
    }
    @Input('header') header: string;


}
