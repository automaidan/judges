const crawler = require('./crawler');

// crawler({ Name: 'Мороз Ігор Миколайович' })
crawler({
  Name: 'коваленко олександр вікторович',
  Position: 'Голова Господарського суду Сумської області',
  Region: 'Сумська область',
})
  .then((result) => {
    console.log(result);
  });

