const crawler = require('./crawler');

// crawler({ Name: 'Мороз Ігор Миколайович' })
crawler({
  "Department": "Шепетівська місцева прокуратура Хмельницької області",
  "Region": "Хмельницька область",
  "Position": "Прокурор Шепетівської місцевої прокуратури Хмельницької області",
  "Name": "Бойко Тетяна Миколаївна",
  type: 'prosecutor',
})
  .then((result) => {
    console.log(result);
  });

