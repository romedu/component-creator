exports = (componentName, isStateful, includesCss) => `\
import React, {Component} from "react"; ${includesCss ? `\nimport "./${componentName}.css";` : ""}

class ${componentName} extends Component { ${isStateful ? "\n    state = {}\n" : ""}
    render(){
        return (
            
        )
    }
}

export default ${componentName};
`;

module.exports = exports;