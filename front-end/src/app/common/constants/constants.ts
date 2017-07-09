const NAVBAR = [
    {
        title: 'Головна',
        state: 'home'
    },
    {
        title: 'Про нас',
        state: 'about'
    },
    {
        title: 'Судді',
        state: 'list'
    },
    {
        title: 'Прокурори',
        state: 'prosecutors'
    },
    {
        title: 'Контакти',
        state: 'contacts'
    },
    {
        title: 'Аналітика',
        state: 'analytics'
    }
];

const SOURCE = '/source';

const URLS = {

    listUrl: `${SOURCE}/judges.json`,
    prosecutorsListUrl: `${SOURCE}/prosecutors.json`,
    listTimeStamp: `${SOURCE}/judges.json.timestamp`,
    dictionaryUrl: `${SOURCE}/dictionary.json`,
    dictionaryTimeStamp: `${SOURCE}/dictionary.json.timestamp`,
    textUrl: `${SOURCE}/texts.json`,
    textTimeStamp: `${SOURCE}/texts.json.timestamp`,
    details: `/profiles/:key.json`,
    regionsDepartments: `${SOURCE}/region-department-mapping.json`,
    prosecutorsRegionsDepartments: `${SOURCE}/prosecutors-region-department-mapping.json`
};

const FILTERS = {
    YEARS: [
        {
            title: '2016',
            key: '2016'
        },
        {
            title: '2015',
            key: '2015'
        },
        {
            title: '2014',
            key: '2014'
        },
        {
            title: '2013',
            key: '2013'
        }
    ],
    STATISTICS: [
        {
            title: 'Найбільший дохід',
            key: 'i',
            unit: '₴',
            limitTo: 50
        },
        {
            title: 'Найбільший дохід сім’ї',
            key: 'fi',
            unit: '₴',
            limitTo: 50
        },
        {
            title: 'Найбільша площа земельних ділянок',
            key: 'l',
            unit: 'м²',
            limitTo: 50
        },
        {
            title: 'Найбільша кількість земельних ділянок',
            key: 'la',
            unit: 'шт',
            limitTo: 50
        },
        {
            title: 'Найбільша площа домівок',
            key: 'h',
            unit: 'м²',
            limitTo: 50
        },
        {
            title: 'Найбільша кількість домівок',
            key: 'ha',
            unit: 'шт',
            limitTo: 50
        },
        {
            title: 'Найбільша площа домівок сім’ї',
            key: 'fh',
            unit: 'м²',
            limitTo: 50
        },
        {
            title: 'Найбільша кількість домівок сім’ї',
            key: 'fha',
            unit: 'шт',
            limitTo: 50
        },
        {
            title: 'Найбільша площа квартир',
            key: 'k',
            unit: 'м²',
            limitTo: 50
        },
        {
            title: 'Найбільша кількість квартир',
            key: 'ka',
            unit: 'шт',
            limitTo: 50
        },
        {
            title: 'Найбільша кількість машин',
            key: 'с',
            unit: 'шт',
            limitTo: 50
        },
        {
            title: 'Найбільше готівки',
            key: 'm',
            unit: '₴',
            limitTo: 50
        },
        {
            title: 'Найбільше грошей в банку',
            key: 'b',
            unit: '₴',
            limitTo: 50
        },
        {
            title: 'Найбільша кількість скарг',
            key: 'j',
            unit: 'шт',
            limitTo: 50
        },
        {
            title: 'Найбільша кількість розглянутих справ',
            key: 'w',
            unit: 'шт',
            limitTo: 50
        }
    ]
};

const ADDITIONAL_SEARCH_FILTERS = [
    {
        title: 'Усі',
        key: 'all'
    },
    {
        title: 'Участь у справах майдану',
        key: '1'
    },
    {
        title: 'Судді політв\'язнів',
        key: '2'
    },
    {
        title: 'У відставці',
        key: '3'
    },
    {
        title: 'Звільнився',
        key: '4'
    },
    {
        title: 'Вигнали',
        key: '5'
    },
    {
        title: 'Кандидати до ВСУ',
        key: '6'
    }
];

const JUDGE = {
    'department': 'd',
    'position': 'p',
    'region': 'r',
    'name': 'n',
    'key': 'k',
    'analytics': 'a',
    'stigma': 's'
};


export {URLS, NAVBAR, FILTERS, JUDGE, ADDITIONAL_SEARCH_FILTERS};

