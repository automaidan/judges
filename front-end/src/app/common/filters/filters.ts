/**
 * Created by IlyaLitvinov on 14.08.16.
 */
/** @ngInject */

interface IFilter {
	(data: any[], query: string, objectKey?: string): any[];
}
const filterByField = () => {
	return <IFilter>(data: any[], query: string, objectKey: string) => {
		return data.filter((item: any) => {
			return new RegExp(query, 'i').test(item[objectKey]);
		});
	};
};

const filterSearch = () => {
	return <IFilter>(data: any[], query: any) => {
		return data.filter((item: any) => {
			return new RegExp(query, 'i').test(item.n)
				|| new RegExp(query, 'i').test(item.d);
		});
	};
};

const filterAvailableDepartments = () => {
	return <IFilter>(data: any[], query: string) => {
		const _query: string[] = query.split(' ');

		let returned = null;

		if (_query && _query[1] === 'область') {
			returned = data.filter((item: string) => {
				return new RegExp(query[0], 'i').test(item);
			});
		}
	};
};

const filterByYear = () => {
	return <IFilter>(data: any[], query: number) => {
		var t = data.filter((item: any) => {
			return item.a && item.a.filter((itemInn: any) => {
				return itemInn.y === query;
			});
		});
	};
};


export { filterByField, filterSearch, filterAvailableDepartments, filterByYear };
