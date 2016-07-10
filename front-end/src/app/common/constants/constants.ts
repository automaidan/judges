const NAVBAR = [
  {
    title : 'Про нас',
    state : 'about'
  },
  {
    title : 'Головна',
    state : 'home'
  },
  {
    title : 'Судді',
    state : 'list'
  }
];

const SOURCE = '/source';

const URLS = {

  listUrl : `${SOURCE}/judges.json`,
  dictionaryUrl : `${SOURCE}/dictionary.json`,
  dictionaryTimeStamp : `${SOURCE}/dictionary.json.timestamp`,
  textUrl : `${SOURCE}/texts.json`,
  textTimeStamp : `${SOURCE}/dictionary.json.timestamp`,
  details : `/judges/:key.json`
};


export { URLS, NAVBAR };

