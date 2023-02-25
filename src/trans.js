(function () {
  window.translateSheet = {};

  var keys = ["de", "en", "es", "fr", "ja", "ko", "ru", "zh", "zh-Hant"];
  keys.forEach((key) => {
    delete require.cache[require.resolve("../langs/" + key + "/strings.json")];
  });
  keys.forEach((key) => {
    translateSheet[key] = require("../langs/" + key + "/strings.json");
  });

  window.translate = function (key, language, ...args) {
    if (language == undefined) {
      language = "en";
    }
    if (translateSheet[language] == undefined || translateSheet[language][key] == undefined) {
      language = "en";
    }
    var result = translateSheet[language][key];
    if (result == undefined) {
      return key;
    }
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      result = result.replace(new RegExp("(?<!\\\\)\\{" + String(i + 1) + "\\}", "g"), String(arg));
    }
    result = result.replace(new RegExp("\\\\\\{([0-9]+)\\}", "g"), "{$1}");
    return result;
  };
}.call(this));
