const ghpages = require('gh-pages');
ghpages.publish('.', {}, function (err) {
  if (err) {
    console.error(err);
  }
  console.log("Done.")
});
