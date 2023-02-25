(function () {
  var hex, j, len, ref;

  window.colors = {};

  colors.nice = [];

  colors.niceHex = [
    "D24D57",
    "F22613",
    "D91E18",
    "96281B",
    "EF4836",
    "D64541",
    "C0392B",
    "CF000F",
    "E74C3C",
    "DB0A5B",
    "F64747",
    "F1A9A0",
    "D2527F",
    "E08283",
    "F62459",
    "E26A6A",
    "DCC6E0",
    "663399",
    "674172",
    "AEA8D3",
    "913D88",
    "9A12B3",
    "BF55EC",
    "BE90D4",
    "8E44AD",
    "9B59B6",
    "446CB3",
    "E4F1FE",
    "4183D7",
    "59ABE3",
    "81CFE0",
    "52B3D9",
    "C5EFF7",
    "22A7F0",
    "3498DB",
    "2C3E50",
    "19B5FE",
    "336E7B",
    "22313F",
    "6BB9F0",
    "1E8BC3",
    "3A539B",
    "34495E",
    "67809F",
    "2574A9",
    "1F3A93",
    "89C4F4",
    "4B77BE",
    "5C97BF",
    "4ECDC4",
    "A2DED0",
    "87D37C",
    "90C695",
    "26A65B",
    "03C9A9",
    "68C3A3",
    "65C6BB",
    "1BBC9B",
    "1BA39C",
    "66CC99",
    "BADA55",
    "36D7B7",
    "C8F7C5",
    "86E2D5",
    "2ECC71",
    "16a085",
    "3FC380",
    "019875",
    "03A678",
    "4DAF7C",
    "2ABB9B",
    "00B16A",
    "1E824C",
    "049372",
    "26C281",
    "F5D76E",
    "F7CA18",
    "F4D03F",
    "e9d460",
    "FDE3A7",
    "F89406",
    "EB9532",
    "E87E04",
    "F4B350",
    "F2784B",
    "EB974E",
    "F5AB35",
    "D35400",
    "F39C12",
    "F9690E",
    "F9BF3B",
    "F27935",
    "E67E22",
    "ececec",
    "6C7A89",
    "D2D7D3",
    "EEEEEE",
    "BDC3C7",
    "ECF0F1",
    "95A5A6",
    "DADFE1",
    "ABB7B7",
    "F2F1EF",
    "BFBFBF",
  ];

  colors.validate = function (a) {
    if (typeof a !== "object") {
      return [255, 255, 255, 255];
    }
    var b, i, j, ref;
    b = [0, 0, 0, 0];
    for (i = j = 0; j < 4; i = ++j) {
      if (Number.isInteger(a[i]) && 0 <= (ref = a[i]) && ref < 256) {
        b[i] = Math.floor(a[i]);
      }
    }
    return b;
  };

  colors.brightness = function (c) {
    return (c[0] + c[1] + c[2]) / 3;
  };

  colors.copy = function (c) {
    return [c[0], c[1], c[2], c[3]];
  };

  colors.blackOrWhite = function (c) {
    if ((c[0] + c[1] + c[2]) / 3 > 128) {
      return [0, 0, 0, 255];
    } else {
      return [255, 255, 255, 255];
    }
  };

  colors.hsl2rgb = function (c) {
    var a, b, g, h, hue2rgb, l, p, q, r, s;
    (h = c[0]), (s = c[1]), (l = c[2]), (a = c[3]);
    if (s === 0) {
      r = g = b = l;
    } else {
      hue2rgb = function (p, q, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      };
      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
  };

  colors.rgb2hsl = function (c) {
    var a, b, d, g, h, l, max, min, r, s;
    (r = c[0]), (g = c[1]), (b = c[2]), (a = c[3]);
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h, s, l, a];
  };

  colors.fromHex = function (c) {
    var a, b, g, r;
    r = parseInt(c.slice(0, 2), 16);
    g = parseInt(c.slice(2, 4), 16);
    b = parseInt(c.slice(4, 6), 16);
    a = 255;
    return colors.validate([r, g, b, a]);
  };

  colors.toHex = function (c) {
    var chr;
    chr = function (i) {
      if (!i) {
        return "00";
      }
      i = i.toString(16);
      if (i.length === 1) {
        i = "0" + i;
      }
      return i;
    };
    return chr(c[0]) + chr(c[1]) + chr(c[2]);
  };

  colors.cssRgba = function (c) {
    return "rgba(" + (c[0] || 0) + "," + (c[1] || 0) + "," + (c[2] || 0) + "," + (c[3] || 255) + ")";
  };

  ref = colors.niceHex;
  for (j = 0, len = ref.length; j < len; j++) {
    hex = ref[j];
    colors.nice.push(colors.fromHex(hex));
  }
}.call(this));
