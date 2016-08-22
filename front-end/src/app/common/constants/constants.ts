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
  // },
  // {
  //   title : 'Аналітика',
  //   state : 'analytics'
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

const FILTERS = [
    {
        title: 'Найбільший дохід',
        key: 'i'
    },
    {
        title: 'Найбільший дохід сім’ї',
        key: 'm'
    },
    {
        title: 'Найбільша площа земельних ділянок',
        key: 'l'
    },
    {
        title: 'Найбільша кількість земельних ділянк',
        key: 'z'
    },
    {
        title: 'Найбільша площа домівок',
        key: 'h'
    },
    {
        title: 'Найбільша кількість домівок',
        key: 'e'
    },
    {
        title: 'Найбільша площа квартир',
        key: 'f'
    },
    {
        title: 'Найбільша кількість квартир',
        key: 't'
    },
    {
        title: 'Найбільша кількість машин',
        key: 'с'
    },
    {
        title: 'Найбільше грошей в банку',
        key: 'b'
    },
    {
        title: 'Найбільша кількість скарг',
        key: 'j'
    },
    {
        title: 'Найбільша кількість розглянутих справ',
        key: 'w'
    }
];


export { URLS, NAVBAR, FILTERS };

