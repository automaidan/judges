// import { IApi } from '../common/services/api.service';

// const DISPLAYING_LENGTH: number = 25;

interface IJudgesListInterface {
    allJudges: any[];
    getData(): void;
}

export class JudgesListController {
    private _api: any;

    /* @ngInject */
    constructor(Api: any) {
        this._api = Api;
    }

    /** @ngInject */
    getData() {
        console.log('judges loaded');
    }
}
