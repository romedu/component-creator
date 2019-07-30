exports = (componentName, isStateful, includesCss) => `\
import React${isStateful ? ", { useState }" : ""} from "react"; ${includesCss ? `\nimport "./${componentName}.css";` : ""}

const ${componentName} = props => { ${isStateful ? "\n    const [state, setState] = useState({});\n" : ""}
    return (

    )
}

export default ${componentName};
`

module.exports = exports;