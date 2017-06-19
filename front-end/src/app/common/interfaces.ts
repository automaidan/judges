export interface IDropDownOption {
    title: string;
    key: string;
}

export interface IDropDownAction {
    (region: IDropDownOption, filterType?: string): void;
}

export interface IDropDownList extends Array<IDropDownOption> {
}
