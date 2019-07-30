const fs = require("fs"),
      readLineModule = require("readline"),
      flagPassed = process.argv[2],
      utils = require("./utils"),
      cliEmitter = require("./cli-emitter"),
      defaultConfig = require("./config/default-config"),
      componentConfig = require("./config/configuration"),
      readLine = readLineModule.createInterface({
          input: process.stdin,
          output: process.stdout
      });

exports.startConfiguration = function(){
    if(flagPassed === "--reset" || flagPassed === "-r"){
        componentConfig = Object.assign({}, defaultConfig);
        return saveConfiguration(true, false);
    }

    readLine.question("Enter your component's name: ", answerComponentName);
}

function answerComponentName(componentName){
    utils.updateProperty(componentConfig, "componentName", utils.capitalizeString(componentName));

    if(flagPassed === "--previous" || flagPassed === "-p") return askIfUpdateConfig("n");
    else if(flagPassed === "--yes" || flagPassed === "-y") return saveConfiguration(false, true);

    readLine.question("Do you want to update the component configuration? (Y/N) ", answerIfUpdateConfig);
}

function answerIfUpdateConfig(answer){
    const isUpdatingConfig = utils.validateAnswer(answer);
    if(isUpdatingConfig) readLine.question("Do you want the component in the current location? (Y/N) ", answerIfUpdatePath);
    else saveConfiguration(false, true); // Only the component name will be updated, therefore the message shouldn't display
}

function answerIfUpdatePath(answer){
    const useDefaultPath = answer.toLowerCase() === "y" ? true : false;
    if(useDefaultPath){
        utils.updateProperty(componentConfig, "basePath", "./");
        askClosedQuestions();
    }
    else readLine.question("Type in a relative path to your desired location: ", updatePath);
}

function updatePath(newPath){
    utils.updateProperty(componentConfig, "basePath", utils.validatePath(newPath));
    askClosedQuestions();
}

function askClosedQuestions(currentIndex = 0){
    const closedQuestions = [
        {
            question: "Do you want it to be a class based component? (Y/N) ",
            propertyToUpdate: "isClassBased"
        },
        {
            question: "Do you want it to manage it's own state? (Y/N) ",
            propertyToUpdate: "isStateful"
        },
        {
            question: "Do you want it to include a css file? (Y/N) ",
            propertyToUpdate: "includesCssFile"
        }
    ];

    if(currentIndex < closedQuestions.length){
        const {question, propertyToUpdate} = closedQuestions[currentIndex];
        readLine.question(question, answer => {
            utils.updateProperty(componentConfig, propertyToUpdate, utils.validateAnswer(answer));
            askClosedQuestions(currentIndex + 1);
        });
    }
    else saveConfiguration(true, true);
}

function saveConfiguration(logMessage, isCreating){
    const parsedConfig = JSON.stringify(componentConfig, null, 4);
    fs.writeFile(`${__dirname}/config/configuration.json`, parsedConfig, error => {
        if(error) throw new Error("Failed to configure the component");
        if(logMessage) console.log("Component configuration saved");
        if(isCreating) cliEmitter.emit("completeConfig");
        else process.exit(1);
    })
}

module.exports = exports;