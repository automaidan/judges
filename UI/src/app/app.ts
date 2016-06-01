import { Component } from '@angular/core';
import './src/app/app.html';

export class Hero {
    id: number;
    name: string;
}

@Component({
    selector: 'app',//Meta data which tells Angular how to create and use component
    providers: [],
    template: require(),
    styles: [`
        * {
            margin:0;
            padding: 0;
        }
        body {
            font-family: sans-serif;
        }
        
        .header {
            text-align: center;
            box-shadow: 1px 1px 1px rgba(1, 10, 21, 0.89);
        }
    `]
})


export class AppComponent {
    title = "Hero";
    hero: Hero = {
        id: 1,
        name: "Windstorm"
    };
    testArr = ["test1", "test", "asdasd"];
}