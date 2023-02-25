(function () {
  window.mxserver = {};

  mxserver.superusers = [];
  mxserver.blockedusers = [];

  mxserver.isSuperUser = function (player) {
    return mxserver.superusers.includes(player?.name);
  };

  mxserver.isBlockedUser = function (player) {
    return mxserver.blockedusers.includes(player?.name);
  };

  //RGB 0~255
  //H 0~360
  //SV 0~1
  mxserver.RGBToHSV = function (R, G, B) {
    var hue, saturation, value;
    var max = Math.max(R, Math.max(G, B));
    var min = Math.min(R, Math.min(G, B));

    var d = R === min ? G - B : B === min ? R - G : B - R;
    var h = R === min ? 3 : B === min ? 1 : 5;
    hue = 60 * (h - d / (max - min));

    //hue = color.GetHue();
    saturation = max == 0 ? 0 : 1 - (1 * min) / max;
    value = max / 255;
    return [hue, saturation, value];
  };
  mxserver.HSVToRGB = function (hue, saturation, value) {
    var R, G, B;
    var hi = Math.floor(hue / 60) % 6;
    var f = hue / 60 - Math.floor(hue / 60);

    value = value * 255;
    var v = value;
    var p = value * (1 - saturation);
    var q = value * (1 - f * saturation);
    var t = value * (1 - (1 - f) * saturation);

    if (hi === 0) {
      R = v;
      G = t;
      B = p;
    } else if (hi === 1) {
      R = q;
      G = v;
      B = p;
    } else if (hi === 2) {
      R = p;
      G = v;
      B = t;
    } else if (hi === 3) {
      R = p;
      G = q;
      B = v;
    } else if (hi === 4) {
      R = t;
      G = p;
      B = v;
    } else {
      R = v;
      G = p;
      B = q;
    }
    return [R, G, B, 255];
  };

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
