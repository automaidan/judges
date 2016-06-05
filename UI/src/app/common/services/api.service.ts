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

@Injectable()

export class Api {
    constructor (private http: Http) {}
    private allJudgesUrl = '/source/all-ukraine-judges-csv-links.json';// URL to web API

    private extractData(res: Response) {
        debugger;
        let body = res.json();
        return body.data || { };
    }

    getHeroes (): Promise<Regions[]> {
        return this.http.get(this.allJudgesUrl)
            .toPromise()
            .then(this.extractData)
            .catch((error:any) => {
                debugger;
            });
    }

}
