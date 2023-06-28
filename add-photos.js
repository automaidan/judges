//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const fspromises = require('fs/promises');
//joining path of directory 
const directoryPath = path.join(__dirname, 'photos');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(async function (file) {
        // Do whatever you want to do with the file
        console.log(file.split('.')[0]);
        const data = await fspromises.readFile(`./profiles/${file.split('.')[0]}.json`, { encoding: 'utf8' });
        data['Фото'] = `https://prosud.info/photos/${file}`;
        await fspromises.writeFile(`./profiles/${file.split('.')[0]}.json`, JSON.stringify(data));
    });
});