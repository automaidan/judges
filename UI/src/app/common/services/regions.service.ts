/**
 * Created by IlyaLitvinov on 05.06.16.
 */
/**
 * Judges service
 *
 **/
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable }     from 'rxjs/Observable';

@Injectable()

export class JudgesModel {
    constructor (private http: Http) {}
    private allJudgesUrl = '/source/all-ukraine-judges-csv-links.json';// URL to web API

    getHeroes (): Observable<Hero[]> {
        return this.http.get(this.heroesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
}
