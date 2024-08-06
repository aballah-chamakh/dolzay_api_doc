const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');


function listDirectories(source) {
    return fs.readdirSync(source).filter(name => {
      return fs.lstatSync(path.join(source, name)).isDirectory();
    });
}

const modules = listDirectories("./src")
const mainOpenApiFile = 'src/dz_api.yaml';
let openApiDoc = yaml.load(fs.readFileSync(mainOpenApiFile, 'utf8'));

openApiDoc.paths = {};
openApiDoc.components.schemas = {};
openApiDoc.components.examples = {};


for(let i=0;i<modules.length;i++) {

    let moduleName = modules[i]
    if(moduleName == "lock"){
        continue ; 
    }

    let modulePaths = yaml.load(fs.readFileSync('src/'+moduleName+'/paths.yaml', 'utf8'));
    openApiDoc.paths = {...openApiDoc.paths,...modulePaths};

    let moduleSchemas = yaml.load(fs.readFileSync('src/'+moduleName+'/schemas.yaml', 'utf8'));
    openApiDoc.components.schemas = {...openApiDoc.components.schemas,...moduleSchemas};

    let moduleExamples = yaml.load(fs.readFileSync('src/'+moduleName+'/examples.yaml', 'utf8'));
    openApiDoc.components.examples = {...openApiDoc.components.examples,...moduleExamples};

 }




// Write the combined OpenAPI file back to disk
console.log(openApiDoc)
fs.writeFileSync(mainOpenApiFile, yaml.dump(openApiDoc));

console.log('OpenAPI document updated successfully.');
