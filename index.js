const fs = require("fs"),
      readLine = require("readline").createInterface({
          input: process.stdin,
          output: process.stdout
      }),
      createClassCompTemplate = require("./templates/class-component"),
      createFuncCompTemplate = require("./templates/functional-component");

readLine.setPrompt("> ");

const askToProceed = answer => {
    switch(answer.toLowerCase()){
        case "y": return startFileCreation();
        case "n": return terminateApp();
        default: readLine.prompt();
    }
}

const addJsAndCssFiles = ({componentName, basePath, includesCss, isClassBased}) => {
    const jsFileText = isClassBased ? createClassCompTemplate(componentName, includesCss) : createFuncCompTemplate(componentName, includesCss);
    fs.writeFile(`${basePath}/${componentName}.js`, jsFileText, error => {
        if(error) throw error;
        if(includesCss){
            fs.open(`${basePath}/${componentName}.css`, "a", () => {
                console.log(`Folder: "${componentName}" created successfully`);
                process.exit(0);
            });
        }
        else {
            console.log(`Folder: "${componentName}" created successfully`);
            process.exit(0);
        }
    });
}

//Configure the folder stucture and create it's respective js and css file
const configureFolderStructure = (componentName, basePath) => {
    if(!componentName || !basePath) throw new Error("The component name and the folder path are required");

    const folderStructure = {
        componentName,
        basePath
    };

    readLine.question("Do you want it to be a class based component? (Y/N)", isClassBased => {
        const classBasedAnswer = isClassBased.toLowerCase() === "y" ? true : false;
        folderStructure.isClassBased = classBasedAnswer;

        readLine.question("Do you want it to include a css file? (Y/N)", includesCss => {
            const includesCssAnswer = includesCss.toLowerCase() === "y" ? true : false;
            folderStructure.includesCss = includesCssAnswer;
            addJsAndCssFiles(folderStructure);
        })
    })
}

const createFolderStructure = componentName => {
    try {
        componentName = componentName && componentName.trim();
        if(!componentName) throw new Error("Component name is required");
        const folderPath = `./components/${componentName}`;
        fs.mkdir(folderPath, error => {
            if(error){
                if(error.code === "EEXIST") throw new Error("Folder exists already");
                else throw new Error("Failed to create the folder");
            }
            else configureFolderStructure(componentName, folderPath);
        });
    }
    catch(error){
        console.log("Error: ", error);
        process.exit(1);
    }
}

const startFileCreation = () => {
    readLine.off("line", askToProceed);
    readLine.question("Enter your component's name: ", createFolderStructure);
}

const terminateApp = () => {
    console.log("See you later");
    process.exit(0);
}

readLine.question("Do you wish to create a new component? (Y/N) ", askToProceed);
readLine.on("line", askToProceed);