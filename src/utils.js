const path = require("path");

exports.capitalizeString = stringToCapitalize => {
    const trimmedString = stringToCapitalize.trim();
    return trimmedString[0].toUpperCase().concat(trimmedString.substring(1).toLowerCase());
}

exports.updateProperty = (obj, propertyName, propertyValue) => {
    obj[propertyName] = propertyValue;
}

exports.validateAnswer = answer => answer.toLowerCase() === "y" ? true : false;

exports.validatePath = pathToValidate => {
    if(path.basename(pathToValidate) === pathToValidate) return "./";
    else if(path.isAbsolute(pathToValidate)) return path.relative(process.cwd(), pathToValidate);
    else return pathToValidate;
}

module.exports = exports;