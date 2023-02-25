/*
zjson - binary json sirelizer with some strange features

* It does hte basic json to bin and bin to json
* You can Diffs and send thouse instead
* You can add a Strings table
    list wich both ends need to agree on
    usuly used for keys that are present in every msg
 */

(function () {
  var COLLECT_STATS, MAX16, MAX32, MAX8, toHex;

  Number.prototype.isInt = function (n) {
    return n !== "" && !isNaN(n) && Math.round(n) === n;
  };

  Number.prototype.isFloat = function (n) {
    return n !== "" && !isNaN(n) && Math.round(n) !== n;
  };

  MAX8 = 256;

  MAX16 = 256 * 256;

  MAX32 = 256 * 256 * 256 * 256;

  COLLECT_STATS = true;

  window.commonZJsonStrings = {};

  window.commonZJsonStringsGet = function () {
    var k, list;
    list = [];
    for (k in commonZJsonStrings) {
      if (commonZJsonStrings[k] > 2) {
        list.push(k);
      }
    }
    return console.log(list.sort().join("\n"));
  };

  window.commonZJsonBytePattrns = {};

  window.commonZJsonBytePattrnsGet = function () {
    var e, j, k, len, list, ref, results, v;
    list = [];
    for (k in commonZJsonBytePattrns) {
      v = commonZJsonBytePattrns[k];
      list.push([k, v]);
    }
    list = list.sort(function (a, b) {
      return b[1] - a[1];
    });
    ref = list.slice(0, 256);
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      e = ref[j];
      results.push(console.log(e[0], e[1]));
    }
    return results;
  };

  window.ZJson = (function () {
    ZJson.prototype.JSON_MARK = 90;

    ZJson.prototype.JSON_DIFF_MARK = 91;

    ZJson.prototype.OBJECT_MARK8 = 0x10;

    ZJson.prototype.OBJECT_MARK16 = 0x11;

    ZJson.prototype.ARRAY_MARK8 = 0x20;

    ZJson.prototype.ARRAY_MARK16 = 0x21;

    ZJson.prototype.ARRAY0_MARK = 0x22;

    ZJson.prototype.ARRAY1_MARK = 0x23;

    ZJson.prototype.ARRAY2_MARK = 0x24;

    ZJson.prototype.ARRAY3_MARK = 0x25;

    ZJson.prototype.ARRAY4_MARK = 0x26;

    ZJson.prototype.STRING_MARK8 = 0x30;

    ZJson.prototype.STRING_MARK16 = 0x31;

    ZJson.prototype.STRING_MARK32 = 0x54;

    ZJson.prototype.STRING_TABLE_MARK = 0x32;

    ZJson.prototype.NUMBER_MARK8 = 0x40;

    ZJson.prototype.NUMBER_MARK16 = 0x41;

    ZJson.prototype.NUMBER_MARK32 = 0x42;

    ZJson.prototype.NUMBER_MARK32F = 0x43;

    ZJson.prototype.BOOL_TRUE_MARK = 0x50;

    ZJson.prototype.BOOL_FALSE_MARK = 0x51;

    ZJson.prototype.NULL_MARK = 0x52;

    ZJson.prototype.UNDEFINED_MARK = 0x53;

    function ZJson(strTable) {
      var i, j, len, str;
      if (strTable == null) {
        strTable = null;
      }
      this.buffSize = 1024 * 1024;
      this.buffer = new ArrayBuffer(this.buffSize);
      this.dv = new DataView(this.buffer);
      this.str2num = new Map();
      this.num2str = new Map();
      if (strTable) {
        for (i = j = 0, len = strTable.length; j < len; i = ++j) {
          str = strTable[i];
          this.str2num.set(str, i);
          this.num2str.set(i, str);
        }
        if (i > MAX16) {
          throw "Too many strings in the string table";
        }
      }
    }

    ZJson.prototype.dumpDv = function (json) {
      try {
        var buf, dv, end, i, j, ref;
        this.i = 0;
        this.dumpNode(json);
        end = "END";
        this.dv.setUint8(this.i, end.charCodeAt(0));
        this.i += 1;
        this.dv.setUint8(this.i, end.charCodeAt(1));
        this.i += 1;
        this.dv.setUint8(this.i, end.charCodeAt(2));
        this.i += 1;
        buf = new ArrayBuffer(this.i);
        dv = new DataView(buf);
        for (i = j = 0, ref = this.i; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          dv.setUint8(i, this.dv.getUint8(i));
        }
        return dv;
      } catch (e) {
        print("ERROR JSON");
        print(json);
        throw e;
      }
    };

    ZJson.prototype.dumpNode = function (json) {
      var e, i, j, k, l, len, length, num, ref, results, results1, results2, v;
      try {
        if (json === null) {
          this.dv.setUint8(this.i, this.NULL_MARK);
          this.i += 1;
          return;
        }
        if (json === void 0) {
          this.dv.setUint8(this.i, this.UNDEFINED_MARK);
          this.i += 1;
          return;
        }
        switch (typeof json) {
          case "object":
            if (json.length != null) {
              length = json.length;
              if (length === 0) {
                this.dv.setUint8(this.i, this.ARRAY0_MARK);
                this.i += 1;
              } else if (length === 1) {
                this.dv.setUint8(this.i, this.ARRAY1_MARK);
                this.i += 1;
              } else if (length === 2) {
                this.dv.setUint8(this.i, this.ARRAY2_MARK);
                this.i += 1;
              } else if (length === 3) {
                this.dv.setUint8(this.i, this.ARRAY3_MARK);
                this.i += 1;
              } else if (length === 4) {
                this.dv.setUint8(this.i, this.ARRAY4_MARK);
                this.i += 1;
              } else if (length < MAX8) {
                this.dv.setUint8(this.i, this.ARRAY_MARK8);
                this.i += 1;
                this.dv.setUint8(this.i, length);
                this.i += 1;
              } else if (length < MAX16) {
                this.dv.setUint8(this.i, this.ARRAY_MARK16);
                this.i += 1;
                this.dv.setUint16(this.i, length);
                this.i += 2;
              } else {
                throw "Array size of " + length + " not supproted";
              }
              results = [];
              for (j = 0, len = json.length; j < len; j++) {
                e = json[j];
                results.push(this.dumpNode(e));
              }
              return results;
            } else {
              length = 0;
              for (k in json) {
                v = json[k];
                length += 1;
              }
              if (length < MAX8) {
                this.dv.setUint8(this.i, this.OBJECT_MARK8);
                this.i += 1;
                this.dv.setUint8(this.i, length);
                this.i += 1;
              } else if (length < MAX16) {
                this.dv.setUint8(this.i, this.OBJECT_MARK16);
                this.i += 1;
                this.dv.setUint16(this.i, length);
                this.i += 2;
              } else {
                throw "Object size of " + length + " not supproted";
              }
              results1 = [];
              for (k in json) {
                v = json[k];
                this.dumpNode(k);
                results1.push(this.dumpNode(v));
              }
              return results1;
            }
            break;
          case "number":
            if (Math.round(json) === json && json > 0 && json < 256 * 256 * 256 * 256) {
              if (json < MAX8) {
                this.dv.setUint8(this.i, this.NUMBER_MARK8);
                this.i += 1;
                this.dv.setUint8(this.i, json);
                return (this.i += 1);
              } else if (json < MAX16) {
                this.dv.setUint8(this.i, this.NUMBER_MARK16);
                this.i += 1;
                this.dv.setUint16(this.i, json);
                return (this.i += 2);
              } else if (json < MAX32) {
                this.dv.setUint8(this.i, this.NUMBER_MARK32);
                this.i += 1;
                this.dv.setUint32(this.i, json);
                return (this.i += 4);
              } else {
                throw "Invalid number integer " + json + " not supported";
              }
            } else {
              this.dv.setUint8(this.i, this.NUMBER_MARK32F);
              this.i += 1;
              this.dv.setFloat32(this.i, json);
              return (this.i += 4);
            }
            break;
          case "string":
            num = this.str2num.get(json);
            if (num != null) {
              this.dv.setUint8(this.i, this.STRING_TABLE_MARK);
              this.i += 1;
              this.dv.setUint16(this.i, num);
              return (this.i += 2);
            } else {
              if (COLLECT_STATS) {
                commonZJsonStrings[json] = (commonZJsonStrings[json] || 0) + 1;
              }
              length = json.length;
              if (length < MAX8) {
                this.dv.setUint8(this.i, this.STRING_MARK8);
                this.i += 1;
                this.dv.setUint8(this.i, json.length);
                this.i += 1;
              } else if (length < MAX16) {
                this.dv.setUint8(this.i, this.STRING_MARK16);
                this.i += 1;
                this.dv.setUint16(this.i, json.length);
                this.i += 2;
              } else if (length < MAX32) {
                this.dv.setUint8(this.i, this.STRING_MARK32);
                this.i += 1;
                this.dv.setUint32(this.i, json.length);
                this.i += 2;
              } else {
                throw "String size of " + length + " not supproted";
              }
              results2 = [];
              for (i = l = 0, ref = length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
                this.dv.setUint8(this.i, json.charCodeAt(i));
                results2.push((this.i += 1));
              }
              return results2;
            }
            break;
          case "boolean":
            if (json === true) {
              this.dv.setUint8(this.i, this.BOOL_TRUE_MARK);
              return (this.i += 1);
            } else {
              this.dv.setUint8(this.i, this.BOOL_FALSE_MARK);
              return (this.i += 1);
            }
            break;
          default:
            throw "Type " + typeof json + " not supported";
        }
      } catch (e) {
        console.error("THE NUMBER IS " + String(this.i + " " + String(e) + " " + String(i) + " " + String(j) + " " + String(k) + " " + String(l)));
        throw e;
      }
    };

    ZJson.prototype.loadDv = function (dv) {
      var json;
      this.i = 0;
      json = this.loadNode(dv);

      /*
      if COLLECT_STATS
           * look at common byte patterns
          bp = commonZJsonBytePattrns
          for i in [0...dv.byteLength]
              for pattern in [1...4]
                  if i + pattern < dv.byteLength
                      arr = []
                      for n in [0...pattern]
                          arr.push(dv.getUint8(i + n))
                      key = arr.join(",")
                      bp[key] = (bp[key] or 0) + 1
       */
      return json;
    };

    ZJson.prototype.loadNode = function (dv) {
      var count, e, i, j, json, k, l, length, m, mark, num, ref, ref1, ref2, v;
      mark = dv.getUint8(this.i);
      this.i += 1;
      switch (mark) {
        case 0:
          throw "Zero mark error";
          break;
        case this.ARRAY_MARK8:
        case this.ARRAY_MARK16:
        case this.ARRAY0_MARK:
        case this.ARRAY1_MARK:
        case this.ARRAY2_MARK:
        case this.ARRAY3_MARK:
        case this.ARRAY4_MARK:
          if (mark === this.ARRAY0_MARK) {
            length = 0;
          } else if (mark === this.ARRAY1_MARK) {
            length = 1;
          } else if (mark === this.ARRAY2_MARK) {
            length = 2;
          } else if (mark === this.ARRAY3_MARK) {
            length = 3;
          } else if (mark === this.ARRAY4_MARK) {
            length = 4;
          } else if (mark === this.ARRAY_MARK8) {
            length = dv.getUint8(this.i);
            this.i += 1;
          } else if (mark === this.ARRAY_MARK16) {
            length = dv.getUint16(this.i);
            this.i += 2;
          } else {
            throw "Arrays mark error" + mark;
          }
          json = [];
          for (count = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; count = 0 <= ref ? ++j : --j) {
            e = this.loadNode(dv);
            json.push(e);
          }
          return json;
        case this.OBJECT_MARK8:
        case this.OBJECT_MARK16:
          if (mark === this.OBJECT_MARK8) {
            length = dv.getUint8(this.i);
            this.i += 1;
          } else if (mark === this.OBJECT_MARK16) {
            length = dv.getUint16(this.i);
            this.i += 2;
          } else {
            throw "Objext mark error";
          }
          json = {};
          for (count = l = 0, ref1 = length; 0 <= ref1 ? l < ref1 : l > ref1; count = 0 <= ref1 ? ++l : --l) {
            k = this.loadNode(dv);
            v = this.loadNode(dv);
            json[k] = v;
          }
          return json;
        case this.STRING_TABLE_MARK:
          num = dv.getUint16(this.i);
          this.i += 2;
          return this.num2str.get(num);
        case this.STRING_MARK8:
        case this.STRING_MARK16:
        case this.STRING_MARK32:
          if (mark === this.STRING_MARK8) {
            length = dv.getUint8(this.i);
            this.i += 1;
          } else if (mark === this.STRING_MARK16) {
            length = dv.getUint16(this.i);
            this.i += 2;
          } else if (mark === this.STRING_MARK32) {
            length = dv.getUint32(this.i);
            this.i += 4;
          } else {
            throw "String mark error";
          }
          json = "";
          for (i = m = 0, ref2 = length; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
            json += String.fromCharCode(dv.getUint8(this.i));
            this.i += 1;
          }
          return json;
        case this.NUMBER_MARK8:
          json = dv.getUint8(this.i);
          this.i += 1;
          return json;
        case this.NUMBER_MARK16:
          json = dv.getUint16(this.i);
          this.i += 2;
          return json;
        case this.NUMBER_MARK32:
          json = dv.getUint32(this.i);
          this.i += 4;
          return json;
        case this.NUMBER_MARK32F:
          json = dv.getFloat32(this.i);
          this.i += 4;
          return json;
        case this.BOOL_TRUE_MARK:
          return true;
        case this.BOOL_FALSE_MARK:
          return false;
        case this.NULL_MARK:
          return null;
        case this.UNDEFINED_MARK:
          return void 0;
        default:
          throw "Mark " + mark + " unkown";
      }
    };

    return ZJson;
  })();

  toHex = function (number, n) {
    var hex;
    if (n == null) {
      n = 4;
    }
    hex = number.toString(16);
    while (hex.length < n) {
      hex = "0" + hex;
    }
    return hex;
  };

  window.hexDisplay = function (dv) {
    var address, ascii, byte, bytes, i, j, r, results;
    i = 0;
    results = [];
    while (i < dv.byteLength) {
      address = toHex(i, 4);
      bytes = [];
      ascii = [];
      for (r = j = 0; j < 16; r = ++j) {
        if (i >= dv.byteLength) {
          bytes.push("  ");
          ascii.push(" ");
        } else {
          byte = dv.getUint8(i);
          bytes.push(toHex(byte, 2));
          if (20 < byte && byte < 128) {
            ascii.push(String.fromCharCode(byte));
          } else {
            ascii.push(".");
          }
        }
        i += 1;
      }
      results.push(console.log(address + "   " + bytes.join(" ") + "   " + ascii.join("")));
    }
    return results;
  };
}.call(this));
