// here begin src/settings.js
(function () {
  var drawKey, drawSlider, humanView, keyCharToCode, keyCodeToChar, settingsControls, settingsMisc, settingsSound, settingsTab, spacer;

  eval(onecup["import"]());

  window.settings = {};

  css(".tab", function () {
    display("inline-block");
    padding("10px 20px");
    margin("10px 10px 0px 10px");
    border_radius("5px 5px 0px 0px");
    background_color("rgba(255,255,255,.2)");
    return css(":hover", function () {
      return background_color("rgba(0,0,0,.5)");
    });
  });

  css("input.full", function () {
    margin("10px 0px");
    display("block");
    padding(20);
    font_size(30);
    color("white");
    width("100%");
    background_color("rgba(0,0,0,.3)");
    return border("none");
  });

  css("button.full", function () {
    display("block");
    width("100%");
    padding(20);
    text_align("center");
    color("white");
    border("none");
    font_size(16);
    return background_color("rgba(0,0,0,.1)");
  });

  css("button.full:hover", function () {
    return background_color("rgba(0,0,0,.4)");
  });

  css("button.red", function () {
    display("block");
    width("100%");
    padding(20);
    text_align("center");
    color("white");
    border("none");
    font_size(16);
    return background_color("rgba(255,0,0,.1)");
  });

  css("button.red:hover", function () {
    return background_color("rgba(255,0,0,.4)");
  });

  spacer = function () {
    return div(function () {
      return height(60);
    });
  };

  settingsTab = "Profile";

  ui.settingsMain = function () {
    ui.quickOptions();
    return ui.inScreen("menu", "Settings", function () {
      var tabFn;
      padding_bottom(100);
      overflow_y("scroll");
      tabFn = null;
      div(function () {
        var tab;
        background_color("rgba(255,255,255,.2)");
        text_align("center");
        tab = function (name, fn) {
          return div(".tab", function () {
            if (settingsTab === name) {
              background_color("rgba(0,0,0,.5)");
              tabFn = fn;
            }
            onclick(function () {
              return (settingsTab = name);
            });
            return text(name);
          });
        };
        tab("Profile", function () {
          return account.profileMenu();
        });
        tab("Controls", function () {
          return settingsControls();
        });
        tab("Sounds", function () {
          return settingsSound();
        });
        return tab("Misc", function () {
          return settingsMisc();
        });
      });
      return typeof tabFn === "function" ? tabFn() : void 0;
    });
  };

  window.DEFAULT_SETTINGS = {
    Select: {
      keys: [
        {
          mouse: true,
          which: 1,
        },
        {
          which: 66,
        },
      ],
    },
    "Line Move": {
      keys: [
        {
          mouse: true,
          which: 3,
        },
        {
          which: 86,
        },
      ],
    },
    "Pan Map": {
      keys: [
        {
          mouse: true,
          which: 2,
        },
        {
          which: 32,
        },
      ],
    },
    "Zoom In": {
      keys: [
        {
          which: 81,
        },
        null,
      ],
    },
    "Zoom Out": {
      keys: [
        {
          which: 69,
        },
        null,
      ],
    },
    Up: {
      keys: [
        {
          which: 87,
        },
        {
          which: 38,
        },
      ],
    },
    Left: {
      keys: [
        {
          which: 65,
        },
        {
          which: 37,
        },
      ],
    },
    Down: {
      keys: [
        {
          which: 83,
        },
        {
          which: 40,
        },
      ],
    },
    Right: {
      keys: [
        {
          which: 68,
        },
        {
          which: 39,
        },
      ],
    },
    "Stop Units": {
      keys: [
        {
          which: 88,
        },
        null,
      ],
    },
    "Hold Position": {
      keys: [
        {
          which: 90,
        },
        null,
      ],
    },
    "Focus Fire/Follow": {
      keys: [
        {
          which: 70,
        },
        null,
      ],
    },
    "Place Rally Point": {
      keys: [
        {
          which: 71,
        },
        null,
      ],
    },
    "Remove Rally Point": {
      keys: [
        {
          shiftKey: true,
          which: 71,
        },
        null,
      ],
    },
    "Self Destruct": {
      keys: [
        {
          ctrlKey: true,
          which: 88,
        },
        null,
      ],
    },
    "Focus on Units": {
      keys: [
        {
          which: 67,
        },
        null,
      ],
    },
    Pause: {
      keys: [
        {
          which: 80,
        },
        null,
      ],
    },
    "Toggle Roster": {
      keys: [
        {
          which: 9,
        },
        null,
      ],
    },
    "Toggle UI": {
      keys: [
        {
          ctrlKey: true,
          which: 79,
        },
        null,
      ],
    },
    Back: {
      keys: [
        {
          which: 192,
        },
        null,
      ],
    },
    "Unit Info": {
      keys: [
        {
          which: 73,
        },
        null,
      ],
    },
    "Zoom Speed": {
      value: 0.25,
      speed: true,
    },
    "Scroll Speed": {
      value: 0.25,
      speed: true,
    },
    "Master Volume": {
      value: 0.1,
      sound: true,
    },
    "Music Volume": {
      value: 0.5,
      sound: true,
    },
    "FX Volume": {
      value: 0.8,
      sound: true,
    },
    "Ambient Volume": {
      value: 0.4,
      sound: true,
    },
  };

  settings.save = function () {
    return control.savePlayer();
  };

  settings.key = function (e, name) {
    var binding, j, key, len, ref, ref1;
    binding = typeof commander !== "undefined" && commander !== null ? ((ref = commander.settings) != null ? ref[name] : void 0) : void 0;
    if (!binding) {
      binding = DEFAULT_SETTINGS[name];
    }
    if (!binding) {
      throw "Looking for binding " + name + " but its not in DEFAULT_SETTINGS";
    }
    ref1 = binding.keys;
    for (j = 0, len = ref1.length; j < len; j++) {
      key = ref1[j];
      if (
        key &&
        key.altKey === (e.altKey || void 0) &&
        key.ctrlKey === (e.ctrlKey || void 0) &&
        key.metaKey === (e.metaKey || void 0) &&
        (key.shiftKey === (e.shiftKey || void 0) || key.shiftKey === void 0) &&
        key.which === e.which
      ) {
        return true;
      }
    }
    return false;
  };

  settings.soundValue = function (name) {
    var ref, volume;
    volume = typeof commander !== "undefined" && commander !== null ? ((ref = commander.settings) != null ? ref[name] : void 0) : void 0;
    if (!volume) {
      return DEFAULT_SETTINGS[name].value;
    }
    return volume.value;
  };

  settings.speedValue = function (name) {
    var ref, volume;
    volume = typeof commander !== "undefined" && commander !== null ? ((ref = commander.settings) != null ? ref[name] : void 0) : void 0;
    if (!volume) {
      return DEFAULT_SETTINGS[name].value;
    }
    return volume.value;
  };

  settingsSound = function () {
    var name, thing;
    h2(function () {
      padding(10);
      return text("Sound");
    });
    p(function () {
      padding(20);
      return text("I would really like to thank 99sounds.org for providing royalty free sounds to use throughout the game.");
    });
    for (name in DEFAULT_SETTINGS) {
      thing = DEFAULT_SETTINGS[name];
      if (thing.sound) {
        drawSlider(name);
      }
    }
    return button(".red", function () {
      margin_top(80);
      padding(20);
      text_align("center");
      text("Reset to default volume levels");
      return onclick(function () {
        var j, k, len, ref;
        ref = ["Master Volume", "Music Volume", "FX Volume", "Ambient Volume"];
        for (j = 0, len = ref.length; j < len; j++) {
          k = ref[j];
          commander.settings[k] = DEFAULT_SETTINGS[k];
        }
        return settings.save();
      });
    });
  };

  settingsControls = function () {
    var name, thing;
    h2(function () {
      padding(10);
      return text("Speed");
    });
    for (name in DEFAULT_SETTINGS) {
      thing = DEFAULT_SETTINGS[name];
      if (thing.speed) {
        drawSlider(name);
      }
    }
    h2(function () {
      padding(10);
      return text("Key Bindings");
    });
    p(function () {
      padding(20);
      return text("Sorry, due to this being HTML5 game key codes can be really odd");
    });
    div(function () {
      var results;
      results = [];
      for (name in DEFAULT_SETTINGS) {
        thing = DEFAULT_SETTINGS[name];
        if (thing.keys) {
          results.push(drawKey(name));
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    return button(".red", function () {
      margin_top(80);
      padding(20);
      text_align("center");
      text("Reset to default settings");
      return onclick(function () {
        commander.settings = {};
        return settings.save();
      });
    });
  };

  keyCodeToChar = {
    8: "Backspace",
    9: "Tab",
    13: "Enter",
    16: "Shift",
    17: "Ctrl",
    18: "Alt",
    19: "Pause/Break",
    20: "Caps Lock",
    27: "Esc",
    32: "Space",
    33: "Page Up",
    34: "Page Down",
    35: "End",
    36: "Home",
    37: "Left",
    38: "Up",
    39: "Right",
    40: "Down",
    45: "Insert",
    46: "Delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    91: "Windows",
    93: "Right Click",
    96: "Numpad 0",
    97: "Numpad 1",
    98: "Numpad 2",
    99: "Numpad 3",
    100: "Numpad 4",
    101: "Numpad 5",
    102: "Numpad 6",
    103: "Numpad 7",
    104: "Numpad 8",
    105: "Numpad 9",
    106: "Numpad *",
    107: "Numpad +",
    109: "Numpad -",
    110: "Numpad .",
    111: "Numpad /",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "Num Lock",
    145: "Scroll Lock",
    182: "My Computer",
    183: "My Calculator",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
  };

  keyCharToCode = {
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    "Pause/Break": 19,
    "Caps Lock": 20,
    Esc: 27,
    Space: 32,
    "Page Up": 33,
    "Page Down": 34,
    End: 35,
    Home: 36,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    Insert: 45,
    Delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    Windows: 91,
    "Right Click": 93,
    "Numpad 0": 96,
    "Numpad 1": 97,
    "Numpad 2": 98,
    "Numpad 3": 99,
    "Numpad 4": 100,
    "Numpad 5": 101,
    "Numpad 6": 102,
    "Numpad 7": 103,
    "Numpad 8": 104,
    "Numpad 9": 105,
    "Numpad *": 106,
    "Numpad +": 107,
    "Numpad -": 109,
    "Numpad .": 110,
    "Numpad /": 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    "Num Lock": 144,
    "Scroll Lock": 145,
    "My Computer": 182,
    "My Calculator": 183,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222,
  };

  humanView = function (key) {
    var full;
    if (!key || !key.which) {
      return "";
    }
    if (!key.mouse) {
      full = keyCodeToChar[key.which];
      if (!full) {
        full = "#" + key.which;
      }
    } else {
      full = "Mouse-#" + key.which;
    }
    if (key.shiftKey) {
      full = "Shift-" + full;
    }
    if (key.ctrlKey) {
      full = "Ctrl-" + full;
    }
    if (key.altKey) {
      full = "Alt-" + full;
    }
    if (key.metaKey) {
      full = "Meta-" + full;
    }
    return full;
  };

  settings.humanViewBinding = function (name) {
    var binding, ref;
    binding = typeof commander !== "undefined" && commander !== null ? ((ref = commander.settings) != null ? ref[name] : void 0) : void 0;
    if (!binding) {
      binding = DEFAULT_SETTINGS[name];
    }
    if (!binding) {
      return "unbound";
    }
    if (binding.keys[0]) {
      return humanView(binding.keys[0]);
    } else if (binding.keys[1]) {
      return humanView(binding.keys[1]);
    } else {
      return "unbound";
    }
  };

  drawKey = function (name) {
    var binding, clean, ref;
    binding = typeof commander !== "undefined" && commander !== null ? ((ref = commander.settings) != null ? ref[name] : void 0) : void 0;
    if (!binding) {
      binding = deepCopy(DEFAULT_SETTINGS[name]);
    }
    clean = function (d) {
      var k, newd, v;
      newd = {};
      for (k in d) {
        v = d[k];
        if (v) {
          newd[k] = v;
        }
      }
      return newd;
    };
    return div(function () {
      var i, j, len, ref1, results;
      padding("5px 20px");
      div(function () {
        display("inline-block");
        width(150);
        return text(name);
      });
      ref1 = [0, 1];
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        i = ref1[j];
        results.push(
          (function (i) {
            return input(
              {
                type: "text",
                value: humanView(binding.keys[i]),
              },
              function () {
                width(100);
                margin_left(20);
                padding("2px 4px");
                border("1px solid #f39c12");
                background("rgba(0,0,0,.4)");
                color("#f39c12");
                font_size(16);
                text_align("center");
                onkeydown(function (e) {
                  console.log("key down", e);
                  if (e.which === 27) {
                    binding.keys[i] = null;
                  } else {
                    binding.keys[i] = clean({
                      mouse: false,
                      altKey: e.altKey,
                      ctrlKey: e.ctrlKey,
                      metaKey: e.metaKey,
                      shiftKey: e.shiftKey,
                      which: e.which,
                    });
                  }
                  commander.settings[name] = binding;
                  e.currentTarget.value = humanView(binding.keys[i]);
                  e.preventDefault();
                  return settings.save();
                });
                return onmousedown(function (e) {
                  if (document.activeElement === e.currentTarget) {
                    binding.keys[i] = clean({
                      mouse: true,
                      altKey: e.altKey,
                      ctrlKey: e.ctrlKey,
                      metaKey: e.metaKey,
                      shiftKey: e.shiftKey,
                      which: e.which,
                    });
                    commander.settings[name] = binding;
                    e.currentTarget.value = humanView(binding.keys[i]);
                    e.preventDefault();
                    return settings.save();
                  }
                });
              }
            );
          })(i)
        );
      }
      return results;
    });
  };

  drawSlider = function (name) {
    var ref, slider;
    slider = typeof commander !== "undefined" && commander !== null ? ((ref = commander.settings) != null ? ref[name] : void 0) : void 0;
    if (!slider) {
      slider = DEFAULT_SETTINGS[name];
    }
    if (!slider) {
      throw "Looking for setting " + name;
    }
    return div(function () {
      padding("5px 20px");
      height(30);
      div(function () {
        display("inline-block");
        width(150);
        return text(name);
      });
      return div(function () {
        margin_left(20);
        display("inline-block");
        width(220);
        height(10);
        overflow("hidden");
        background_color("rgba(0,0,0,.4)");
        onmousedown(function (e) {
          var rect, scrollLeft, scrollWidth, setValue;
          rect = e.target.getBoundingClientRect();
          scrollLeft = rect.left;
          scrollWidth = 220;
          setValue = function (e) {
            var value;
            value = (e.pageX - scrollLeft) / scrollWidth;
            value = Math.min(Math.max(value, 0), 1);
            return (commander.settings[name] = {
              value: value,
            });
          };
          setValue(e);
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
            setValue(e);
            return settings.save();
          };
          return (document.onmousemove = function (e) {
            setValue(e);
            return onecup.refresh();
          });
        });
        return div(function () {
          width(Math.floor(220 * slider.value));
          height(10);
          return background_color("#f39c12");
        });
      });
    });
  };

  settingsMisc = function () {
    h2(function () {
      padding(10);
      return text("Misc");
    });
    div(function () {
      padding(10);
      h3(function () {
        return text("Credits");
      });
      br();
      div(function () {
        return text("Code & Art by Andre 'Treeform' von Houck");
      });
      div(function () {
        return text("Design by Oscar 'Saktoth' Evans");
      });
      div(function () {
        return text("Co-Design by Kevin 'RyMarq' Piala");
      });
      br();
      h3(function () {
        return text("Special thanks");
      });
      br();
      return div(function () {
        return text("R26, Jacob Enerio, Godde, Nepthali Celles, Tully Elliston, Nicholas Wylder");
      });
    });
    br();
    br();
    div(function () {
      padding(10);
      return text("You can reset your campaign here. All progress will be cleared and you will start from the beginning");
    });
    button(".red", function () {
      padding(20);
      text_align("center");
      text("Reset Campaign");
      return onclick(function () {
        galaxyMode.restart();
        return ui.go("galaxy");
      });
    });
    br();
    br();
    div(function () {
      padding(10);
      return text("You can stop chat from appearing in single player. Great for recording or focusing on what you are doing");
    });
    button(".full", function () {
      padding(20);
      text_align("center");
      if (localStorage.chatSilent !== "true") {
        text("Silent Mode Off");
      } else {
        text("Silent Mode On");
      }
      return onclick(function () {
        if (localStorage.chatSilent === "true") {
          return (localStorage.chatSilent = "false");
        } else {
          return (localStorage.chatSilent = "true");
        }
      });
    });
    br();
    br();
    div(function () {
      padding(10);
      return text("Istrolid is built on a lot of open source software:");
    });
    return button(".red", function () {
      padding(20);
      text_align("center");
      text("View Licenses");
      return onclick(function () {
        var licenseTextUrl;
        licenseTextUrl = "http://www.istrolid.com/licenses.txt";
        if (typeof internal !== "undefined" && internal !== null) {
          return internal.openBrowser(licenseTextUrl);
        } else {
          return window.open(licenseTextUrl, "_blank");
        }
      });
    });
  };
}.call(this));
