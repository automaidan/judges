/**
 * Created by IlyaLitvinov on 05.06.16.
 */
/**
 * Judges service
 *
 **/
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Regions } from '../models/regions.model';

interface response {
    res: Object
}

@Injectable()
export class Api {
    constructor (private http: Http) {

    }
    private judges:Array<any> = JSON.parse(localStorage.getItem('judges')) || [];
    private allJudgesUrl = '/source/judges.json';// URL to web API

    private extractData(response) {
        localStorage.setItem('judges', response._body);
        this.judges = response.json();
        debugger;
        return this.judges;
    }

    getJudges (): Promise<Regions[]> {
        debugger;
        if(this.judges.length === 0) {
            return this.http.get(this.allJudgesUrl)
                .toPromise()
                .then(this.extractData)
                .catch((error:any) => {
                });
        }
        return new Promise((resolve, reject) => {
            resolve(this.judges);
        });

    }

}
