// here begin src/db.js
(function() {
  window.db = {};

  db.save = function(key, value) {
    var data;
    data = JSON.stringify(value);
    return localStorage[key] = data;
  };

  db.load = function(key) {
    var data;
    if (!localStorage[key]) {
      return void 0;
    }
    try {
      data = JSON.parse(localStorage[key]);
    } catch (error) {}
    return data;
  };

}).call(this);
;


