/**
 * Created by IlyaLitvinov on 14.08.16.
 */
import {sortBy, filter, includes}  from 'lodash';
/** @ngInject */

interface IFilter {
    (data: any[], query: string, objectKey?: string): any[];
}
const filterByField = () => {
    return <IFilter>(data: any[], query: string, objectKey: string) => {
        return new Promise((resolve: Function) => {
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

const filterByYear = () => {
    return <IFilter>(data: any[], query: number) => {
        return new Promise((resolve: Function) => {
            const _data = data.filter((item: any) => {
                const contains = item.a && item.a.filter((itemInn: any) => {
                        return itemInn.y === query;
                    }).length > 0;
                if (!contains) {
                    return false;
                }

                // a - analytics
                item.a = item.a.reduce((r: Array<any>, item_inn: any) => {
                    if (item_inn.y === query) {
                        r.push(item_inn);
                    }
                    return r;
                }, []);

                return true;
            });
            resolve(_data);
        });
    };
};

const filterByAnalyticsField = () => {
    return <IFilter>(data: Array<Object>, field: string, limitTo: number = 10) => {
        return sortBy(data, (judge: any) => {
            return -judge.a[0][field] || 0;
        })
            .splice(0, limitTo)
            .reduce((reduced: any, item: any) => {
                item.a = parseFloat(item.a[0][field]);
                if (item.a) {
                    reduced.push(item);
                }
                return reduced;
            }, []);
    };
};

const filterWhoHasStigma = () => {
    return <IFilter>(data: any[], stigma: string) => {
        return filter(data, (judge: any) => {
            return judge.s && includes('' + judge.s, stigma);
        });
    };
};


export {filterByField, filterSearch, filterByYear, filterByAnalyticsField, filterWhoHasStigma};
