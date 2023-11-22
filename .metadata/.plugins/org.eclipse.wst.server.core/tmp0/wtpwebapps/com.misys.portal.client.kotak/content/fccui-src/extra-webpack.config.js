const CircularDependencyPlugin = require('circular-dependency-plugin')
module.exports = {
    optimization: {
       concatenateModules: false
    },
    plugins: [
        new CircularDependencyPlugin({
          failOnError: true,
        }),
    ]
};