export interface ITableBodyRowModel {
	title: string,
	valueByYears: any[]
}

export interface ITableHeadRowModel {
	title: string,
	years: string[]
}

export interface ITableModel {
	head: ITableHeadRowModel;
	body: any[];
}

