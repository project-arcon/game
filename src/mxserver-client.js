// here begin src/mxserver-client.js
(function () {
  window.isSuperUser = (p) => !p.ai;

  window.parseTime = function (rawsec) {
    if (typeof rawsec !== "number" || !Number.isFinite(rawsec)) {
      return;
    }
    rawsec = Math.abs(rawsec);

    var sec = rawsec % 60;
    var min = Math.floor(rawsec / 60) % 60;
    var hour = Math.floor(rawsec / 3600) % 60;
    var day = Math.floor(rawsec / 86400);
    return (day > 0 ? day + " days " : "") + (day > 0 || hour > 0 ? hour + " hours " : "") + (day > 0 || hour > 0 || min > 0 ? min + " minutes " : "") + sec.toFixed(3) + " seconds";
  };
}.call(this));
