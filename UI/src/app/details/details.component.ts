/**
 * DETAILS PAGE
 *
 * **/
import { Component, Input } from '@angular/core';

@Component({
    selector: 'details-layout',
    template: require('./home.view.html'),
    styles: [require('./home.css')]
})

export class HomeComponent {
    @Input('header') header: string;
    @Input('test') testName: string;
}
