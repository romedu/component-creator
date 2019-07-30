const fs = require("fs"),
      path = require("path"),
      createClassCompTemplate = require("./templates/class-component"),
      createFuncCompTemplate = require("./templates/functional-component"),
      savedConfig = require("./config/configuration"),
      defaultConfig = require("./config/default-config"),
      cliEmitter = require("./cli-emitter"),
      [,,flagPassed] = process.argv;

const createFolderStructure = componentConfig => {
    const {componentName, basePath} = componentConfig;
    console.log("Creating component....");

    try {
        fs.mkdirSync(`${basePath}/${componentName}`);
        addJsAndCssFiles(componentConfig);
    }
    catch(error){
        console.log(error.code);
        if(error.code === "EEXIST") console.error("Error: ", "A folder with the same already exist within the specified location");
        else if(error.code === "ENOENT") console.error("Error: ", `Failed to find the specified path: ${basePath}`);
        else console.error("Error: ", "Internal server error");
        process.exit(1);
    }
}

const addJsAndCssFiles = ({componentName, basePath, isStateful, includesCssFile, isClassBased}) => {
    const componentPath = path.normalize(`${process.cwd()}/${basePath}/${componentName}/${componentName}`),
          jsFileText = isClassBased ? createClassCompTemplate(componentName, isStateful, includesCssFile) 
                                    : createFuncCompTemplate(componentName, isStateful, includesCssFile);
   
    try {
        fs.writeFileSync(`${componentPath}.js`, jsFileText);
        if(includesCssFile) fs.openSync(`${componentPath}.css`, "a");
        console.log(`Component "${componentName}" created successfully, you can find it in: ${componentPath}`);
        process.exit(0);   
    }
    catch(error){
        console.log(error);
        fs.rmdir(`${basePath}/${componentName}`, error => {
            if(error) console.error("Error: ", "Internal server error"); 
            process.exit(1);
        });
    }
}

exports.listenConfigCompletion = function(){
    cliEmitter.once("completeConfig", () => {
        let componentConfig;
    
        if(flagPassed === "--yes" || flagPassed === "-y"){
            let {componentName} = savedConfig;
            componentConfig = Object.assign(defaultConfig, {componentName});
        }
        else componentConfig = savedConfig;
    
        createFolderStructure(componentConfig);
    })
}

module.exports = exports;