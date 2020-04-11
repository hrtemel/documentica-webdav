const editJsonFile = require("edit-json-file");
 
let file = editJsonFile(`${__dirname}/../es/package.json`);
 
file.set("dependencies", {});

file.save();
 