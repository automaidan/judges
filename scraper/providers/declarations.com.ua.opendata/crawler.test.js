const crawler = require('./crawler');

// crawler({ Name: 'Мороз Ігор Миколайович' })
crawler({ Name: 'порошенко петро олексійович' })
  .then((result) => {
    console.log(result);
  });

