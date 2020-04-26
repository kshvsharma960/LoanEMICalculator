cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.pollfish.cordova/www/pollfishplugin.js",
        "id": "com.pollfish.cordova.pollfishplugin",
        "pluginId": "com.pollfish.cordova",
        "clobbers": [
            "pollfishplugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.4",
    "com.pollfish.cordova": "0.0.7"
}
// BOTTOM OF METADATA
});