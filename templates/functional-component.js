exports = (componentName, includesCss) => `\
import React from "react";
${includesCss ? `import "./${componentName}.css";` : ""}

const ${componentName} = props => {
    return (

    )
}

export default ${componentName};
`

module.exports = exports;