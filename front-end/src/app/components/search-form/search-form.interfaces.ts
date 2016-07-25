export interface IJudge {
	d: string;
	p: string;
	n: string;
	k: string;
	r: string;
}

export interface ISearchFormController {
	judges: any[];
	api: any;
	searchQuery: string;
	state?: any;
}