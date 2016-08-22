/**
 * Created by IlyaLitvinov on 14.08.16.
 */
import * as _ from 'lodash';
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
        return data.filter((item: any) => {
            const contains = item.a && item.a.filter((itemInn: any) => {
                    return itemInn.y === query;
                }).length > 0;

            if (!contains) {
                return false;
            }

            // a - analytics 
            item.a = item.a.reduce((r: Array, item_inn: any) => {
                if (item_inn.y === query) {
                    r.push(item_inn);
                }
                return r;
            }, []);

            return true;
        });
    };
};

const filterByAnalyticsField = () => {
    return <IFilter>(data: any[], field: string) => {
        return _.sortBy(data, 'a[0]' + field).reverse();
    };
};


export {filterByField, filterSearch, filterAvailableDepartments, filterByYear, filterByAnalyticsField};
