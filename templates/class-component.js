exports = (componentName, includesCss) => `\
import React, {Component} from "react";
${includesCss ? `import "./${componentName}.css";` : ""}

class ${componentName} extends Component {
    state = {}

    render(){
        return (
            
        )
    }
}

export default ${componentName};
`;

module.exports = exports;