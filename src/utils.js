(function () {
  var stats,
    slice = [].slice,
    hasProp = {}.hasOwnProperty;

  window.print = function () {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return console.log.apply(console, args);
  };

  window.choose = function (list) {
    return list[Math.floor(Math.random() * list.length)];
  };

  window.chooseInt = function (a, b) {
    return Math.floor(a + Math.random() * (b - a));
  };

  window.json = {
    dumps: JSON.stringify,
    loads: JSON.parse,
  };

  window.deepCopy = function (src) {
    var i, j, key, len, ret, thing;
    if (Array.isArray(src)) {
      ret = [];
      for (i = j = 0, len = src.length; j < len; i = ++j) {
        thing = src[i];
        ret[i] = deepCopy(thing);
      }
      return ret;
    }
    if (typeof src === "object") {
      ret = {};
      for (key in src) {
        if (!hasProp.call(src, key)) continue;
        ret[key] = deepCopy(src[key]);
      }
      return ret;
    }
    return src;
  };

  window.deepEq = function (a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  window.formatTime = function (t) {
    var minutes, seconds;
    t = Math.floor(t);
    seconds = t % 60;
    minutes = Math.floor(t / 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  };

  window.track = function (name, kargs) {
    var xhr;
    if (!kargs) {
      kargs = {};
    }
    console.log("track:", name, JSON.stringify(kargs));
    if (window.location && window.location.href.indexOf("gamedev.html") !== -1) {
      return;
    }
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://andrelytics.com/track");
    kargs.name = "game_" + name;
    kargs.api_key = "pub_H4TvK8mxcRPextxxIHOhtstH7YRCAHM2";
    kargs.user_iden = typeof commander !== "undefined" && commander !== null ? commander.id : void 0;
    kargs.user_name = typeof commander !== "undefined" && commander !== null ? commander.name : void 0;
    kargs.version = window.VERSION + "." + MINOR_VERSION;
    return xhr.send(JSON.stringify(kargs));
  };

  window.after = function (ms, fn) {
    return setTimeout(fn, ms);
  };

  window.doAfter = function (ms, fn) {
    return setTimeout(fn, ms);
  };

  window.now = function () {
    var n, ref, s;
    if (typeof process !== "undefined" && process !== null) {
      (ref = process.hrtime()), (s = ref[0]), (n = ref[1]);
      //return (s * 1000000 + n / 1000) / 1000;
      return s * 1000 + n / 1000000;
    } else {
      return performance.now();
    }
  };

  window.ab2str = function (buf) {
    var bufView, i, j, ref, str;
    str = "";
    bufView = new Uint8Array(buf);
    for (i = j = 0, ref = bufView.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      str += String.fromCharCode(bufView[i]);
    }
    return str;
  };

  window.str2ab = function (str) {
    var buf, bufView, i, j, ref;
    buf = new ArrayBuffer(str.length);
    bufView = new Uint8Array(buf);
    for (i = j = 0, ref = str.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  window.dv2str = function (dv) {
    var i, j, ref, str;
    str = "";
    for (i = j = 0, ref = dv.byteLength; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      str += String.fromCharCode(dv.getUint8(i));
    }
    return str;
  };

  window.str2dv = function (str) {
    return new DataView(str2ab(str));
  };

  window.strBuff = function (buf) {
    var j, len, n, str, u8;
    str = "";
    u8 = new Uint8Array(buf);
    for (j = 0, len = u8.length; j < len; j++) {
      n = u8[j];
      str += n + " ";
    }
    return str;
  };

  window.randColor = function (a) {
    return [Math.floor(a + (255 - a) * Math.random()), Math.floor(a + (255 - a) * Math.random()), Math.floor(a + (255 - a) * Math.random()), 255];
  };

  window.stats = stats = {
    fps: {},
    net: {},
    sim: {},
  };

  stats.fpsAdd = function (n) {
    if (n == null) {
      n = 1;
    }
    return stats.add(stats.fps, n);
  };

  stats.netAdd = function (n) {
    if (n == null) {
      n = 1;
    }
    return stats.add(stats.net, n);
  };

  stats.simAdd = function (n) {
    if (n == null) {
      n = 1;
    }
    return stats.add(stats.sim, n);
  };

  stats.add = function (frames, n) {
    var sec;
    sec = Math.floor(Date.now() / 1000);
    if (frames[sec] != null) {
      return (frames[sec] += n);
    } else {
      return (frames[sec] = n);
    }
  };

  stats.draw = function () {
    if (!control.perf) {
      return;
    }
    stats.drawFrames(stats.fps, 10, 60, 160);
    stats.drawFrames(stats.sim, 1, 16, 320);
    return stats.drawFrames(stats.net, 1024 * 10, 1024, 720);
  };

  stats.drawFrames = function (frames, div, max, yadj) {
    var color, j, nFrames, results, sec, sx, sy, x, y;
    sec = Math.floor(Date.now() / 1000);
    results = [];
    for (x = j = 0; j < 31; x = ++j) {
      sx = -x * 16 + window.innerWidth - 20;
      sy = window.innerHeight - yadj;
      nFrames = frames[sec - 30 + x] || 0;
      color = [255, 255, 255, 100];
      results.push(
        (function () {
          var k, ref, results1;
          results1 = [];
          for (y = k = 0, ref = Math.ceil(nFrames / div); 0 <= ref ? k < ref : k > ref; y = 0 <= ref ? ++k : --k) {
            results1.push(baseAtlas.drawSprite("parts/sel1x1.png", [sx, sy - y * 16], [0.5, 0.5], 0, color));
          }
          return results1;
        })()
      );
    }
    return results;
  };

  window.sha1 = function (msg) {
    fcc = String.fromCharCode;
    function rotl(n, s) {
      return (n << s) | (n >>> (32 - s));
    }
    function tohex(i) {
      for (var h = "", s = 28; ; s -= 4) {
        h += ((i >>> s) & 0xf).toString(16);
        if (!s) return h;
      }
    }
    var H0 = 0x67452301,
      H1 = 0xefcdab89,
      H2 = 0x98badcfe,
      H3 = 0x10325476,
      H4 = 0xc3d2e1f0,
      M = 0x0ffffffff;
    var i,
      t,
      W = new Array(80),
      ml = msg.length,
      wa = new Array();
    msg += fcc(0x80);
    while (msg.length % 4) msg += fcc(0);
    for (i = 0; i < msg.length; i += 4) wa.push((msg.charCodeAt(i) << 24) | (msg.charCodeAt(i + 1) << 16) | (msg.charCodeAt(i + 2) << 8) | msg.charCodeAt(i + 3));
    while (wa.length % 16 != 14) wa.push(0);
    wa.push(ml >>> 29), wa.push((ml << 3) & M);
    for (var bo = 0; bo < wa.length; bo += 16) {
      for (i = 0; i < 16; i++) W[i] = wa[bo + i];
      for (i = 16; i <= 79; i++) W[i] = rotl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      var A = H0,
        B = H1,
        C = H2,
        D = H3,
        E = H4;
      for (i = 0; i <= 19; i++) (t = (rotl(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) & M), (E = D), (D = C), (C = rotl(B, 30)), (B = A), (A = t);
      for (i = 20; i <= 39; i++) (t = (rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & M), (E = D), (D = C), (C = rotl(B, 30)), (B = A), (A = t);
      for (i = 40; i <= 59; i++) (t = (rotl(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8f1bbcdc) & M), (E = D), (D = C), (C = rotl(B, 30)), (B = A), (A = t);
      for (i = 60; i <= 79; i++) (t = (rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & M), (E = D), (D = C), (C = rotl(B, 30)), (B = A), (A = t);
      H0 = (H0 + A) & M;
      H1 = (H1 + B) & M;
      H2 = (H2 + C) & M;
      H3 = (H3 + D) & M;
      H4 = (H4 + E) & M;
    }
    return tohex(H0) + tohex(H1) + tohex(H2) + tohex(H3) + tohex(H4);
  };

  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}.call(this));
