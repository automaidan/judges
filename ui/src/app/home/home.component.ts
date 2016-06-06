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
    regions: any = [];
    constructor (private api: Api) {

    }
    ngOnInit () { this.getRegions(); }

    getRegions () {
        this.api.getRegions()
            .then(regions => {
                this.regions = regions;
            },
            err => {

            })
    }
    @Input('header') header: string;


}
