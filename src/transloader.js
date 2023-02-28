(function () {
  window.translateSheet = window.translateSheet ?? {};

  var keys = ["de", "en", "es", "fr", "ja", "ko", "ru", "zh", "zh-Hant"];
  var files = ["strings", "parts"];
  keys.forEach((key) => {
    files.forEach((file) => {
      delete require.cache[require.resolve(`../langs/${key}/${file}.json`)];
    });
  });
  keys.forEach((key) => {
    translateSheet[key] = {};
    files.forEach((file) => {
      translateSheet[key] = { ...translateSheet[key], ...require(`../langs/${key}/${file}.json`) };
    });
  });

}.call(this));
