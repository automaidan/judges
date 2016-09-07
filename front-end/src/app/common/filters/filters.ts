/**
 * Created by IlyaLitvinov on 14.08.16.
 */
import { sortBy }  from 'lodash';
/** @ngInject */

interface IFilter {
    (data: any[], query: string, objectKey?: string): any[];
}
const filterByField = () => {
    return <IFilter>(data: any[], query: string, objectKey: string) => {
        return new Promise((resolve, rej) => {
            const _data = data.filter((item: any) => {
                return new RegExp(query, 'i').test(item[objectKey]);
            });

            resolve(_data);
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

// const filterAvailableDepartments = () => {
//     return <IFilter>(data: any[], query: string) => {
//         return new Promise((resolve, rej) => {
//             const _query: string[] = query.split(' ');
//
//             let returned = null;
//
//             if (_query && _query[1] === 'область') {
//                 returned = data.filter((item: string) => {
//                     return new RegExp(query[0], 'i').test(item);
//                 });
//             }
//
//
//         });
//     }
// };

const filterByYear = () => {
    return <IFilter>(data: any[], query: number) => {
        return new Promise((resolve, rej) => {
            const _data = data.filter((item: any) => {
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
            resolve(_data);
        })
    };
};

const filterByAnalyticsField = () => {
    return <IFilter>(data: any[], field: string) => {
        return sortBy(data, (judge: any) => {
                return -judge.a[0][field] || 0
            })
            .splice(0, 9)
            .map((item) => {
                item.a = item.a[0][field];
                return item
            });
    };
};


export { filterByField, filterSearch, filterByYear, filterByAnalyticsField };
