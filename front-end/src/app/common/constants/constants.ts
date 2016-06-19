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
  textUrl : `${SOURCE}/text.json`,
  textTimeStamp : `${SOURCE}/dictionary.json.timestamp`
};

debugger;
export { URLS, NAVBAR };

