// here begin src/account.js
(function () {
  var afterTimeout, isValidEmail, isValidName, spacer;

  eval(onecup["import"]());

  window.account = {};

  afterTimeout = function (ms, fn) {
    return setTimeout(fn, ms);
  };

  account.signedIn = false;

  account.wating = false;

  account.error = false;

  account.autoSigningIn = false;

  account.name = typeof steam !== "undefined" && steam !== null ? steam.name : void 0;

  account.load = function () {
    var c;
    c = db.load("commander");
    if (c) {
      account.name = c.name;
      account.color = c.color;
      account.email = c.email;
      account.token = c.token;
    } else {
      account.color = choose(colors.nice);
    }
    if (onecup.params.token && onecup.params.email) {
      account.token = onecup.params.token;
      account.email = onecup.params.email;
      account.passworedReset = true;
      if (onecup.params.token) {
        if (typeof history !== "undefined" && history !== null) {
          history.pushState({}, "game", location.pathname);
        }
      }
    }
  };

  account.connectedToRoot = function () {
    return new Fingerprint2().get(function (result, components) {
      account.fingerprint = result;
      if (account.token && account.email) {
        account.autoSigningIn = true;
        account.signin();
        return (account.authTab = "Sign In");
      }
    });
  };

  account.fix = function () {
    var buildBar, fk, fv, i, j, l, len, m, n, o, part, ref, ref1, ref2, ref3, results, ship, specParts, unit;
    if (!commander.buildBar) {
      commander.buildBar = ["", "", "", "", "", "", "", "", "", ""];
    }
    if (!Array.isArray(commander.buildBar) || commander.buildBar.length !== 10) {
      buildBar = ["", "", "", "", "", "", "", "", "", ""];
      if (typeof commander.buildBar === "object") {
        for (i = j = 0; j < 10; i = ++j) {
          ship = commander.buildBar[i];
          if (ship) {
            buildBar[i] = ship;
          }
        }
      }
      commander.buildBar = buildBar;
    }
    if ((ref = commander.aiRules) != null ? (ref.length = 10) : void 0) {
      for (i = l = 0; l < 10; i = ++l) {
        if (((ref1 = commander.aiRules[i]) != null ? ref1.length : void 0) > 0 && commander.buildBar[i]) {
          unit = new types.Unit(commander.buildBar[i]);
          if (unit.aiRules.length > 0) {
            break;
          }
          specParts = [];
          ref2 = unit.parts;
          for (m = 0, len = ref2.length; m < len; m++) {
            part = ref2[m];
            specParts.push({
              pos: [part.pos[0], part.pos[1]],
              type: part.constructor.name,
              dir: part.dir,
            });
          }
          console.log(i + ": add AI rules to build bar", commander.aiRules[i], commander.buildBar[i]);
          commander.buildBar[i] = toShort({
            parts: specParts,
            name: unit.name,
            aiRules: commander.aiRules[i],
          });
        }
        commander.aiRules[i] = [];
      }
    }
    if (!commander.galaxy) {
      commander.galaxy = {};
    }
    if (!commander.settings) {
      commander.settings = {};
    }
    if (commander.settings["Follow Units"]) {
      commander.settings["Focus Fire/Follow"] = commander.settings["Follow Units"];
      delete commander.settings["Follow Units"];
    }
    if (!commander.buildQ) {
      commander.buildQ = [];
    }
    if (!commander.selection) {
      commander.selection = [];
    }
    if (!commander.validBar) {
      commander.validBar = [true, true, true, true, true, true, true, true, true, true];
    }
    if (!commander.fleet) {
      commander.fleet = {};
    }
    if (!commander.fleet.ais) {
      commander.fleet.ais = {};
    }
    if (!commander.fleet.tabs) {
      commander.fleet.tabs = ["default"];
    }
    if (!commander.fleet.selection) {
      commander.fleet.selection = {
        row: 0,
        tab: null,
      };
    }
    for (i = n = 0; n < 10; i = ++n) {
      if (!commander.fleet["0," + i] && commander.buildBar[i]) {
        commander.fleet["0," + i] = commander.buildBar[i];
      }
    }
    if (!commander.friends) {
      commander.friends = {};
    }
    if (!commander.mutes) {
      commander.mutes = {};
    }
    if (!commander.id) {
      commander.id = rid();
    }
    account.lastRootSave = deepCopy(account.simpleCommander());
    for (i = o = 0; o < 10; i = ++o) {
      account.lastRootSaveBuildBar[i] = commander.buildBar[i];
    }
    ref3 = commander.fleet;
    results = [];
    for (fk in ref3) {
      fv = ref3[fk];
      results.push((account.lastRootSaveFleet[fk] = JSON.stringify(fv)));
    }
    return results;
  };

  account.simpleCommander = function () {
    return {
      email: commander.email,
      token: commander.token,
      id: commander.id,
      name: commander.name,
      color: commander.color,
      faction: commander.faction,
      friends: commander.friends,
      version: window.VERSION + "." + window.MINOR_VERSION,
      buildBar: commander.buildBar,
      fleet: commander.fleet,
      aiRules: commander.aiRules,
      galaxyDifficulty: commander.galaxyDifficulty,
      galaxy: commander.galaxy,
      challenges: commander.challenges,
      settings: commander.settings,
      mutes: commander.mutes,
      friends: commander.friends,
    };
  };

  account.save = function () {
    var i, j, key, ref, ref1, ref2, row, simpleCommander, tab;
    for (i = j = 0; j < 10; i = ++j) {
      (ref = commander.fleet.selection), (row = (ref1 = ref.row) != null ? ref1 : 0), (tab = (ref2 = ref.tab) != null ? ref2 : null);
      key = getFleetKey(row, i, tab);
      commander.buildBar[i] = commander.fleet[key] || "";
    }
    if (typeof network !== "undefined" && network !== null) {
      network.sendPlayer(false);
    }
    commander.ts = Date.now();
    simpleCommander = account.simpleCommander();
    delete simpleCommander.fleet;
    return db.save("commander", simpleCommander);
  };

  account.lastRootSave = {};

  account.lastRootSaveBuildBar = {};

  account.lastRootSaveFleet = {};

  account.rootSave = function () {
    if (typeof internal !== "undefined" && internal !== null) {
      if (account.rootSaveTimeout) {
        clearTimeout(account.rootSaveTimeout);
      }
      return (account.rootSaveTimeout = setTimeout(account.rootRealSave, 30 * 1000));
    } else {
      if (account.rootSaveTimeout) {
        clearTimeout(account.rootSaveTimeout);
      }
      return (account.rootSaveTimeout = setTimeout(account.rootRealSave, 5 * 1000));
    }
  };

  account.rootRealSave = function () {
    var buildBar, fk, fleet, fv, i, j, jsonSpec, k, playerDiff, ref, thisRootSave, update, v;
    thisRootSave = account.simpleCommander();
    playerDiff = {};
    update = false;
    for (k in thisRootSave) {
      v = thisRootSave[k];
      if (k === "buildBar") {
        buildBar = {};
        for (i = j = 0; j < 10; i = ++j) {
          if (thisRootSave.buildBar[i] !== account.lastRootSaveBuildBar[i]) {
            account.lastRootSaveBuildBar[i] = thisRootSave.buildBar[i];
            buildBar[i] = thisRootSave.buildBar[i];
          }
        }
        playerDiff.buildBar = buildBar;
      } else if (k === "fleet") {
        fleet = {};
        ref = thisRootSave.fleet;
        for (fk in ref) {
          fv = ref[fk];
          jsonSpec = JSON.stringify(fv);
          if (jsonSpec !== account.lastRootSaveFleet[fk]) {
            account.lastRootSaveFleet[fk] = jsonSpec;
            fleet[fk] = fv;
            update = true;
          }
        }
        if (update) {
          playerDiff.fleet = fleet;
        }
      } else {
        if (JSON.stringify(v) === account.lastRootSave[k]) {
          delete thisRootSave[k];
        } else {
          account.lastRootSave[k] = JSON.stringify(v);
          playerDiff[k] = v;
          update = true;
        }
      }
    }
    if (!update) {
      return;
    }
    return rootNet.send("savePlayer", playerDiff);
  };

  account.closeAndSave = function (e) {
    account.savingToServer = true;
    account.rootRealSave();
    if (window.reloading) {
      return rootNet.send("ping", "windowReload");
    } else {
      return rootNet.send("ping", "windowClose");
    }
  };

  window.onbeforeunload = function (e) {
    if (account.signedIn === false || rootNet.websocket.readyState !== WebSocket.OPEN) {
      return;
    }
    if (account.needsToClose) {
      return;
    }
    if (typeof internal !== "undefined" && internal !== null) {
      account.closeAndSave(e);
      account.needsToClose = true;
      return (e.returnValue = false);
    }
  };

  account.signin = function () {
    account.waiting = true;
    account.error = "";
    if (!account.token && account.password) {
      account.token = account.hashPass(account.password);
    }
    return rootNet.send("authSignIn", {
      email: account.email,
      token: account.token,
      fingerprint: account.fingerprint,
      steamid: typeof steam !== "undefined" && steam !== null ? steam.id : void 0,
    });
  };

  account.authError = function (message) {
    console.log("account.authError", message);
    account.error = message;
    account.waiting = false;
    account.autoSigningIn = false;
    return (account.signedIn = false);
  };

  account.signinReply = function (rootPlayer) {
    account.waiting = false;
    account.error = false;
    account.autoSigningIn = false;
    if (commander) {
      account.fix();
      account.save();
      account.rootSave();
    } else {
      window.commander = rootPlayer;
      account.fix();
      account.save();
    }
    account.name = commander.name;
    account.color = commander.color;
    account.email = commander.email;
    account.token = commander.token;
    account.signedIn = true;
    if (typeof network !== "undefined" && network !== null) {
      network.sendPlayer();
    }
    galaxyMode.load();
    if (typeof rootNet !== "undefined" && rootNet !== null) {
      rootNet.sendMode();
    }
    if (account.passworedReset) {
      console.log("go to password reset");
      ui.mode = "reset";
      return (account.passworedReset = false);
    }
  };

  account.merge = function (a, b) {
    var aHas, aNeeds, aNeedsList, bship, j, k, l, len, len1, m, n, ref, ref1, ref2, ref3, ref4, ref5, ship, star, x, xy, y;
    console.log("saving players to player backup");
    try {
      db.save("commander.A", a);
    } catch (error) {}
    try {
      db.save("commander.B", b);
    } catch (error) {}
    if (!a.buildBar) {
      a.buildBar = ["", "", "", "", "", "", "", "", "", ""];
    }
    if (!b.buildBar) {
      b.buildBar = ["", "", "", "", "", "", "", "", "", ""];
    }
    if (!a.fleet) {
      a.fleet = {};
    }
    if (!b.fleet) {
      b.fleet = {};
    }
    aHas = {};
    ref = a.buildBar;
    for (j = 0, len = ref.length; j < len; j++) {
      ship = ref[j];
      if (ship) {
        aHas[ship] = true;
      }
    }
    ref1 = a.fleet;
    for (xy in ref1) {
      ship = ref1[xy];
      if (ship) {
        aHas[ship] = true;
      }
    }
    aNeeds = {};
    ref2 = b.buildBar;
    for (l = 0, len1 = ref2.length; l < len1; l++) {
      bship = ref2[l];
      if (bship && !aHas[bship]) {
        aNeeds[bship] = true;
      }
    }
    ref3 = b.fleet;
    for (xy in ref3) {
      bship = ref3[xy];
      if (bship && !aHas[bship]) {
        aNeeds[bship] = true;
      }
    }
    aNeedsList = (function () {
      var results;
      results = [];
      for (bship in aNeeds) {
        results.push(bship);
      }
      return results;
    })();
    console.log("merging players extra " + aNeedsList.length + " ships found");
    for (x = m = 1; m < 100; x = ++m) {
      if (aNeedsList.length === 0) {
        break;
      }
      for (y = n = 0; n <= 10; y = ++n) {
        if (aNeedsList.length === 0) {
          break;
        }
        if (!a.fleet[x + "," + y]) {
          a.fleet[x + "," + y] = aNeedsList.pop();
        }
      }
    }
    if (!a.galaxy) {
      a.galaxy = {};
    }
    if ((ref4 = b.galaxy) != null ? ref4.starsWon : void 0) {
      ref5 = b.galaxy.starsWon;
      for (k in ref5) {
        star = ref5[k];
        if (a.galaxy[k] == null) {
          console.log("add star", k);
          a.galaxy[k] = star;
        }
      }
    }
    return a;
  };

  account.register = function () {
    account.waiting = true;
    account.error = "";
    console.log("register", [account.name, account.email, account.password]);
    if (!isValidName(account.name)) {
      account.error = "Please use ASCII letters and numbers for name";
      return;
    }
    if (!isValidEmail(account.email)) {
      account.error = "Invalid Email";
      return;
    }
    if (!account.password) {
      account.error = "Enter a password";
      return;
    }
    account.token = account.hashPass(account.password);
    return rootNet.send("authRegister", {
      name: account.name,
      color: account.color,
      email: account.email,
      token: account.token,
      fingerprint: account.fingerprint,
    });
  };

  account.forogtPasswordEmallMeLink = function () {
    if (!isValidEmail(account.email)) {
      account.error = "Invalid Email";
      return;
    }
    return rootNet.send("authEmailLink", account.email.toLowerCase());
  };

  account.changePassword = function () {
    var tokenNew, tokenOld;
    account.waiting = false;
    account.error = "";
    tokenOld = account.hashPass(account.oldPassword);
    tokenNew = account.hashPass(account.newPassword);
    if (onecup.params.token) {
      tokenOld = onecup.params.token;
    }
    console.log("change pass", account.oldPassword, account.newPassword);
    rootNet.send("authChangePassword", tokenOld, tokenNew);
    commander.token = tokenNew;
    return account.save();
  };

  account.hashPass = function (pass) {
    return sha1("fhs2:" + account.email + ":" + pass);
  };

  css(".bigtab", function () {
    display("inline-block");
    width(200);
    font_size(30);
    line_height(45);
    padding("10px 20px");
    margin("10px 20px 0px 20px");
    border_radius("5px 5px 0px 0px");
    background_color("rgba(255,255,255,.2)");
    return css(":hover", function () {
      return background_color("rgba(0,0,0,.5)");
    });
  });

  isValidEmail = function (email) {
    var re;
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  isValidName = function (name) {
    var re;
    re = /^[A-Za-z0-9]+$/;
    return re.test(name);
  };

  account.authTab = "Sign In";

  account.signinOrRegisterMenu = function () {
    return ui.menuFrame("#signinorregister", function () {
      padding_top(280);
      padding_bottom(280);
      if (!rootNet) {
        div(function () {
          padding(20);
          background_color("rgba(0,255,0,.25)");
          text_align("center");
          return text("starting to connect to server");
        });
        return;
      }
      if (rootNet.websocket.readyState === WebSocket.CONNECTING) {
        div(function () {
          padding(20);
          background_color("rgba(0,255,0,.25)");
          text_align("center");
          return text("connecting to server");
        });
        return;
      }
      if (rootNet.websocket.readyState === WebSocket.CLOSED) {
        div(".hover-red", function () {
          padding(20);
          text_align("center");
          text("Failed to connect to main server. ");
          text("Click here to retry.");
          return onclick(function () {
            return rootNet.connect();
          });
        });
        return;
      }
      if (account.autoSigningIn) {
        div(function () {
          padding(20);
          background_color("rgba(0,255,0,.25)");
          text_align("center");
          return text("Signing in...");
        });
        return;
      }
      div(function () {
        var tab;
        text_align("center");
        height(75);
        tab = function (name, fn) {
          return div(".bigtab", function () {
            if (account.authTab === name) {
              background_color("rgba(0,0,0,.25)");
            }
            onclick(function () {
              return (account.authTab = name);
            });
            return text(name);
          });
        };
        tab("Register");
        return tab("Sign In");
      });
      return div(function () {
        padding_top(20);
        padding_bottom(100);
        background_color("rgba(0,0,0,.25)");
        if (account.error) {
          div(function () {
            padding(20);
            font_size(20);
            background_color("rgba(255,0,0,.2)");
            return text(account.error);
          });
        }
        if (account.authTab === "Sign In") {
          account.loginFields(account.signin);
          button(".button", function () {
            display("block");
            margin_top(10);
            text_align("left");
            padding(20);
            font_size(30);
            color("white");
            width("100%");
            border("none");
            text_align("center");
            if (account.waiting) {
              text("...");
              return opacity(".5");
            } else {
              text("Sign In");
              return onclick(function () {
                account.forgotPasswordSent = false;
                return account.signin();
              });
            }
          });
          div(function () {
            return height(100);
          });
          button(".button", function () {
            display("block");
            margin_top(10);
            text_align("left");
            padding(20);
            font_size(30);
            color("white");
            width("100%");
            border("none");
            text_align("center");
            if (account.forgotPasswordSent === true) {
              return text("Sent Forgot password email.");
            } else {
              text("Forgot password. Email me a new one.");
              return onclick(function () {
                account.forgotPasswordSent = true;
                return account.forogtPasswordEmallMeLink();
              });
            }
          });
        }
        if (account.authTab === "Register") {
          account.colorNameField();
          account.loginFields(account.register);
          return button(".button", function () {
            display("block");
            margin_top(10);
            text_align("left");
            padding(20);
            font_size(30);
            color("white");
            width("100%");
            border("none");
            text_align("center");
            text("Register");
            return onclick(function () {
              return account.register();
            });
          });
        }
      });
    });
  };

  account.loginFields = function (onEnter) {
    input(
      "#email.full",
      {
        type: "text",
        value: account.email,
        placeholder: "Email",
      },
      function () {
        return oninput(function (e) {
          return (account.email = e.target.value.toLowerCase());
        });
      }
    );
    return input(
      "#password.full",
      {
        type: "password",
        value: account.password,
        placeholder: "Password",
      },
      function () {
        oninput(function (e) {
          account.password = e.target.value;
          return (account.token = null);
        });
        return onkeydown(function (e) {
          if (e.which === 13) {
            return onEnter();
          }
        });
      }
    );
  };

  account.factionField = function () {
    return input(
      "#email.full",
      {
        type: "text",
        value: commander.faction || "",
        placeholder: "faction",
      },
      function () {
        oninput(function (e) {
          var faction;
          faction = e.target.value.toUpperCase().slice(0, 4);
          faction = faction.replace(/[^A-Za-z0-9]/g, "");
          e.target.value = faction;
          return (commander.faction = faction);
        });
        return onblur(function (e) {
          return account.rootSave();
        });
      }
    );
  };

  account.colorOpen = false;

  account.colorNameField = function (op) {
    div(function () {
      margin("10px 0px");
      position("relative");
      background_color("rgba(0,0,0,.3)");
      height(75);
      input(
        {
          type: "text",
          value: account.name,
          placeholder: "Nick Name",
          maxlength: 16,
          disabled: op != null ? op.disabled : void 0,
        },
        function () {
          position("absolute");
          top(0);
          left(0);
          padding("20px 20px 20px 80px");
          font_size(30);
          color("white");
          width("100%");
          background_color("transparent");
          border("none");
          onblur(function (e) {
            e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
            return (account.name = e.target.value);
          });
          return oninput(function (e) {
            e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
            return (account.name = e.target.value);
          });
        }
      );
      return div(function () {
        position("absolute");
        top(0);
        left(0);
        width(55);
        height(55);
        margin(10);
        border_radius(15);
        border("2px solid white");
        box_shadow("0 0 7px rgba(255,255,255,.5), inset 0 0 3px 2px rgba(0,0,0,.5)");
        background_color(colors.cssRgba(account.color));
        return onclick(function () {
          return (account.colorOpen = !account.colorOpen);
        });
      });
    });
    if (account.colorOpen) {
      div(function () {
        var c, j, len, ref, results;
        padding("0px 20px");
        text_align("center");
        ref = colors.nice;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          results.push(
            (function (c) {
              return div(function () {
                display("inline-block");
                width(32);
                height(32);
                margin(5);
                border_radius(8);
                if (account.color === c) {
                  border("2px solid white");
                  box_shadow("0 0 7px rgba(255,255,255,.5), inset 0 0 3px 2px rgba(0,0,0,.5)");
                } else {
                  box_shadow("0 0 3px 2px rgba(0,0,0,.5), inset 0 0 7px rgba(255,255,255,.5)");
                }
                background_color(colors.cssRgba(c));
                return onclick(function () {
                  account.color = c;
                  account.changedColor();
                  return (account.colorOpen = false);
                });
              });
            })(c)
          );
        }
        return results;
      });
      return input(
        "#color",
        {
          type: "text",
          value: colors.toHex(account.color),
          placeholder: "Color",
        },
        function () {
          display("block");
          margin("10px 0px");
          padding(20);
          font_size(30);
          color("white");
          width("100%");
          background_color("rgba(0,0,0,.3)");
          border("none");
          onkeypress(function (e) {
            if (e.which === 13) {
              e.target.blur();
              return (account.colorOpen = false);
            }
          });
          return onchange(function (e) {
            account.color = colors.fromHex(e.target.value);
            return account.changedColor();
          });
        }
      );
    }
  };

  account.changedColor = function () {
    if (account.signedIn) {
      commander.color = account.color;
      account.save();
      return account.rootSave();
    }
  };

  spacer = function () {
    return div(function () {
      return height(60);
    });
  };

  account.changePasswordToggle = false;

  account.profileMenu = function () {
    account.colorNameField({
      disabled: true,
    });
    account.factionField();
    spacer();
    button(".red", function () {
      text("Change Password");
      return onclick(function () {
        return (account.changePasswordToggle = !account.changePasswordToggle);
      });
    });
    div(function () {
      if (account.error) {
        padding(20);
        font_size(30);
        background_color("rgba(255,0,0,.2)");
        return text(account.error);
      }
    });
    if (account.changePasswordToggle) {
      input(
        ".full",
        {
          type: "password",
          value: account.oldPassword,
          placeholder: "Current Password",
        },
        function () {
          return onchange(function (e) {
            return (account.oldPassword = e.target.value);
          });
        }
      );
      input(
        ".full",
        {
          type: "password",
          value: account.newPassword,
          placeholder: "New Password",
        },
        function () {
          return onchange(function (e) {
            return (account.newPassword = e.target.value);
          });
        }
      );
      button(".red", function () {
        text("Change");
        return onclick(function () {
          account.changePassword();
          return (account.changePasswordToggle = false);
        });
      });
    }
    spacer();
    return button(".red", function () {
      text("Sign out");
      return onclick(function () {
        localStorage.clear();
        return location.reload();
      });
    });
  };

  account.checkEmail = function () {
    return ui.inScreen("menu", "Email", function () {
      overflow("hidden");
      return div(function () {
        padding(20);
        return text("Email with a link has been sent to you. Please click that link.");
      });
    });
  };

  account.settingsResetPassword = function () {
    return ui.inScreen("menu", "Change Password", function () {
      padding_bottom(100);
      overflow_y("scroll");
      input(
        ".full",
        {
          type: "password",
          value: account.newPassword,
          placeholder: "New Password",
        },
        function () {
          return onchange(function (e) {
            return (account.newPassword = e.target.value);
          });
        }
      );
      return button(".red", function () {
        text("Change");
        return onclick(function () {
          account.changePassword();
          return (ui.mode = "menu");
        });
      });
    });
  };
}.call(this));
