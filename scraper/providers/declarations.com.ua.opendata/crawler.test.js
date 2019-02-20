const crawler = require('./crawler');

// crawler({ Name: 'Мороз Ігор Миколайович' })
crawler({
  "Department":"Чернігівський окружний адміністративний суд",
  "Region":"Чернігівська область",
  "Position":"Суддя Чернігівського окружного адміністративного суду",
  "Name":"Соломко Ірина Іванівна",
  type: 'judge',
})
  .then((result) => {
    console.log(result);
  });

