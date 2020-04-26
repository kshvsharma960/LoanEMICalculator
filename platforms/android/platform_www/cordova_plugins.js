cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com.pollfish.cordova.pollfishplugin",
      "file": "plugins/com.pollfish.cordova/www/pollfishplugin.js",
      "pluginId": "com.pollfish.cordova",
      "clobbers": [
        "pollfishplugin"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "com.pollfish.cordova": "0.0.7"
  };
});