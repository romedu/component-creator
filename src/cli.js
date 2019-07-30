const [,,flagPassed] = process.argv,
      helpTemplate = require("./templates/help"),
      {version: appVersion} = require("../package"),
      {startConfiguration} = require("./component-config"),
      {listenConfigCompletion} = require("./create-component");

if(flagPassed === "--help" || flagPassed === "-h"){
    console.log(helpTemplate);
    process.exit(1);
}
else if(flagPassed === "--version" || flagPassed === "-v"){
    console.log(appVersion);
    process.exit(1);
}
else {
    listenConfigCompletion();
    startConfiguration();
}