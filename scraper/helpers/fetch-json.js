'use strict';
const fetch = require('node-fetch');
const _ = require('lodash');
const Promise = require('bluebird');
module.exports = function searchDeclaration(link) {
  return fetch(link, {'user-agent': 'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))'})
    .then(response => response.text())
    .then(data => {
      // Error may occurs
      /*
       <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
       <html xmlns="http://www.w3.org/1999/xhtml">
       <head>
       <meta http-equiv="content-type" content="text/html; charset=utf-8" />
       <meta http-equiv="content-language" content="uk" />
       <meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />
       <title>504: Шлюз не відповідає</title>
       <style type="text/css">
       body { background-color:#ffffff; color:#404040; font-size:10px; margin:150px auto 50px auto; padding:0; font-family:Verdana,Arial,Tahoma; }
       h1 { font-size:56px; color:#404040; text-align:center; font-weight:normal; margin:0; padding:0; }
       h1 span { color:#ffffff; background-color:#808080; padding:5px 14px 5px 12px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); }
       </style>
       </head>
       <body>
       <h1><span>504</span> Шлюз не відповідає</h1>
       </body>
       </html>
       */
      if (_.includes(data, 'Шлюз не відповідає') || _.includes(data, '<span>Помилка 503</span>')) {
        return module.exports(link);
      }

      try {
        return JSON.parse(data)
      } catch (err) {
        console.log(err);
        console.log('...But, I gotta keep trying, and never give up!');
        return module.exports(link);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log('...But, I gotta keep trying, and never give up!');
      return Promise.delay(1500).then(() => module.exports(link));
    })
}
;
