/* eslint-disable no-console */

var jsonfile = require('jsonfile');
var file = './package.json';
jsonfile.readFile(file, function(err, obj) {
  var res={};
  Object.keys(obj).forEach( i=>{
    if (i!=="scripts" && i!=="devDependencies"){
      res[i]=obj[i];
    }
  });
  jsonfile.writeFile('./es/package.json', res,{ spaces: 2, EOL: '\r\n' }, function (err) {
    err && console.error(err);
  });
});

var fs = require('fs');

fs.createReadStream('./README.md').pipe(fs.createWriteStream('./es/README.md'));