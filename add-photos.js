//requiring path and fs modules
const path = require("path");
const fs = require("fs");
const fspromises = require("fs/promises");
//joining path of directory
const directoryPath = path.join(__dirname, "photos");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(async function (file) {
    // Do whatever you want to do with the file
    const key = file.split(".")[0];
    console.log(key);

    if (!key) {
      return;
    }

    // || key === "bodnar_serhii_bohdanovych" || key === "britanchyuk_volodimir_vasilovich"
    let isExists;
    try {
        isExists = await fspromises.access(`./profiles/${key}.json`);
    } 
    catch (e) {
        isExists = false;
    }
    if (!isExists) {
        return;
    }

    const data = await fspromises.readFile(
      `./profiles/${key}.json`,
      { encoding: "utf8" }
    );
    const dataObj = JSON.parse(data);
    dataObj["Фото"] = `https://prosud.info/photos/${file}`;
    await fspromises.writeFile(
      `./profiles/${key}.json`,
      JSON.stringify(dataObj)
    );
  });
});
