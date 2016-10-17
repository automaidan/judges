const NAVBAR = [
  {
    title : 'Головна',
    state : 'home'
  },
  {
    title : 'Про нас',
    state : 'about'
  },
  {
    title : 'Судді',
    state : 'list'
  },
  {
    title : 'Контакти',
    state : 'contacts'
  },
  {
    title : 'Аналітика',
    state : 'analytics'
  }
];

const SOURCE = '/source';

const URLS = {

  listUrl : `${SOURCE}/judges.json`,
  listTimeStamp : `${SOURCE}/judges.json.timestamp`,
  dictionaryUrl : `${SOURCE}/dictionary.json`,
  dictionaryTimeStamp : `${SOURCE}/dictionary.json.timestamp`,
  textUrl : `${SOURCE}/texts.json`,
  textTimeStamp : `${SOURCE}/texts.json.timestamp`,
  details : `/judges/:key.json`,
  regionsDepartments: `${SOURCE}/region-department-mapping.json`
};

const FILTERS = {
    YEARS: [
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
            unit: '₴'
        },
        {
            title: 'Найбільший дохід сім’ї',
            key: 'm',
            unit: '₴'
        },
        {
            title: 'Найбільша площа земельних ділянок',
            key: 'l',
            unit: 'м²'
        },
        {
            title: 'Найбільша кількість земельних ділянок',
            key: 'z',
            unit: 'шт'
        },
        {
            title: 'Найбільша площа домівок',
            key: 'h',
            unit: 'м²'
        },
        {
            title: 'Найбільша кількість домівок',
            key: 'e',
            unit: 'шт'
        },
        {
            title: 'Найбільша площа домівок сім’ї',
            key: 'd',
            unit: 'м²'
        },
        {
            title: 'Найбільша кількість домівок сім’ї',
            key: 'o',
            unit: 'шт'
        },
        {
            title: 'Найбільша площа квартир',
            key: 'f',
            unit: 'м²'
        },
        {
            title: 'Найбільша кількість квартир',
            key: 't',
            unit: 'шт'
        },
        {
            title: 'Найбільша кількість машин',
            key: 'с',
            unit: 'шт'
        },
        {
            title: 'Найбільше грошей в банку',
            key: 'b',
            unit: '₴'
        },
        {
            title: 'Найбільша кількість скарг',
            key: 'j',
            unit: 'шт'
        },
        {
            title: 'Найбільша кількість розглянутих справ',
            key: 'w',
            unit: 'шт'
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


export { URLS, NAVBAR, FILTERS, JUDGE, ADDITIONAL_SEARCH_FILTERS};

