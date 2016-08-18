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
  details : `/judges/:key.json`
};

const FILTERS = {
  byIncomes: [
    {
      title: 'Cамый большой доход',
      key: '1'
    },
    {
      title: 'самый большой доход членов семье',
      key: '2'
    },
    {
      title: 'самый большой земельный участок',
      key: '3'
    },
    {
      title: 'самый большой дом',
      key: '4'
    },
    {
      title: 'самая большая квартира',
      key: '5'
    },
    {
      title: 'наибольшее количество квартир',
      key: '6'
    }
  ]

};


export { URLS, NAVBAR };

