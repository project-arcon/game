// here begin src/arcon.js
(function () {
  var dpr,
    globalErrors,
    isFirefox,
    keymap,
    updateQ,
    bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };

  window.baseAtlas = null;

  window.intp = null;

  window.sim = null;

  window.network = null;

  window.commander = null;

  dpr = window.devicePixelRatio;

  isFirefox = typeof InstallTrigger !== "undefined";

  keymap = {
    38: "up",
    40: "down",
    39: "left",
    37: "right",
    33: "pageUp",
    34: "pageDown",
    87: "up",
    83: "down",
    68: "left",
    65: "right",
    69: "pageUp",
    81: "pageDown",
  };

  updateQ = [];

  globalErrors = 0;

  window.onerror = function (msg, url, line, col, e) {
    globalErrors += 1;
    if (globalErrors < 10) {
      return track("error", {
        message: msg,
        url: url,
        line: line,
        col: col,
        stack: e != null ? e.stack : void 0,
      });
    }
  };

  window.Control = (function () {
    Control.prototype.jitter = 0;

    Control.prototype.perf = false;

    Control.prototype.setCursor = function (type) {
      return (document.body.style.cursor = "-webkit-image-set(url('img/ui/mouses/" + type + ".png') 1x, url('img/ui/mouses/" + type + "@2x.png') 2x) 2 2, auto");
    };

    function Control() {
      this.simInterval = bind(this.simInterval, this);
      this.clearMessage = bind(this.clearMessage, this);
      this.tick = bind(this.tick, this);
      var fn1, i, len, onevent, ref;
      this.setCursor("mouse");
      this.backgroundMode = menuMode;
      this.mode = menuMode;
      this.mouse = [0, 0];
      this.observer = {};
      this.keys = {};
      ref = ["onmousemove", "ondblclick", "onmousedown", "onmouseup", "onwheel"];
      fn1 = (function (_this) {
        return function (onevent) {
          return (window[onevent] = function (e) {
            var base, bounds, d, idToHide, ref1, ref2, rmenuDiv, x, y;
            if (onevent === "onmousedown") {
              if (e.target.type === "text" || e.target.type === "password" || e.target.tagName === "P") {
                return true;
              } else {
                if ((ref1 = document.activeElement) != null) {
                  if (typeof ref1.blur === "function") {
                    ref1.blur();
                  }
                }
              }
              if (ui.rmenu) {
                idToHide = ui.rmenu.id;
                after(100, function () {
                  var ref2;
                  if (idToHide === ((ref2 = ui.rmenu) != null ? ref2.id : void 0)) {
                    ui.rmenu = null;
                    return onecup.refresh();
                  }
                });
              }
              _this.mouseDown = true;
            }
            if (onevent === "onmouseup") {
              _this.mouseDown = false;
            }
            if (onevent === "onmousemove") {
              _this.mouse[0] = e.clientX;
              _this.mouse[1] = e.clientY;
              if (typeof ui !== "undefined" && ui !== null ? ui.rmenu : void 0) {
                rmenuDiv = onecup.lookup("#rmenu");
                if (rmenuDiv) {
                  bounds = rmenuDiv.getBoundingClientRect();
                  (ref2 = _this.mouse), (x = ref2[0]), (y = ref2[1]);
                  d = 100;
                  if (x < bounds.left - d || x > bounds.left + bounds.width + d || y > bounds.top + bounds.height + d || y < bounds.top - d) {
                    ui.rmenu = null;
                    onecup.refresh();
                  }
                }
              }
            }
            return typeof (base = _this.mode)[onevent] === "function" ? base[onevent](e) : void 0;
          });
        };
      })(this);
      for (i = 0, len = ref.length; i < len; i++) {
        onevent = ref[i];
        fn1(onevent);
      }
      account.load();
      window.onwheel = (function (_this) {
        return function (e) {
          var base, delta;
          if (e.target.tagName === "P") {
            return;
          }
          if (isFirefox) {
            delta = e.deltaY;
          } else {
            delta = e.deltaY / 20;
          }
          return typeof (base = _this.mode).onzoom === "function" ? base.onzoom(delta, e) : void 0;
        };
      })(this);
      window.onkeydown = (function (_this) {
        return function (e) {
          var base, ref1;
          if (e.target.type === "text") {
            return;
          }
          if (e.target.type === "password") {
            return;
          }
          if (e.target.nodeName === "TEXTAREA") {
            return;
          }
          if (e.which === 8) {
            e.preventDefault();
          }
          _this.keys[e.which] = true;
          _this.keys[keymap[e.which]] = true;
          if (e.which === 13) {
            ui.chatting = true;
            setTimeout(function () {
              var ref1;
              return (ref1 = document.getElementById("chat")) != null ? ref1.focus() : void 0;
            }, 100);
            onecup.refresh();
          }
          if (settings.key(e, "Toggle UI")) {
            ui.show = !ui.show;
            onecup.refresh();
            console.log("ui hide");
          }
          if (e.shiftKey && e.which === 220) {
            control.perf = !control.perf;
            onecup.refresh();
          }
          if (settings.key(e, "Back")) {
            _this.escape();
          }
          if (e.which === 116) {
            window.reloading = true;
            location.reload();
          }
          if (e.which === 85) {
            if (((ref1 = window.location) != null ? ref1.href.indexOf("dev.istrolid.com") : void 0) !== -1) {
              window.testAction();
            }
          }
          return typeof (base = _this.mode).onkeydown === "function" ? base.onkeydown(e) : void 0;
        };
      })(this);
      window.onkeyup = (function (_this) {
        return function (e) {
          var base;
          _this.keys[e.which] = false;
          _this.keys[keymap[e.which]] = false;
          return typeof (base = _this.mode).onkeyup === "function" ? base.onkeyup(e) : void 0;
        };
      })(this);
      window.oncontextmenu = (function (_this) {
        return function (e) {
          return false;
        };
      })(this);
    }

    Control.prototype.tick = function () {
      if (ui.mode !== ui.oldMode) {
        ui.oldMode = ui.mode;
        if (typeof rootNet !== "undefined" && rootNet !== null) {
          rootNet.sendMode();
        }
      }
      if (chat.channel !== chat.oldChannel) {
        chat.oldChannel = chat.channel;
        if (typeof rootNet !== "undefined" && rootNet !== null) {
          rootNet.sendMode();
        }
      }
      this.trySimInterval();
      actionMixer.tick();
      baseAtlas.startFrame();
      this.backgroundMode.draw();
      this.backgroundMode.tick();
      if (this.backgroundMode !== this.mode) {
        this.mode.draw();
      }
      baseAtlas.beginSprites([0, 0], 1);
      stats.fpsAdd();
      stats.draw();
      baseAtlas.finishSprites();
      this.mode.tick();
      bubbles.tick();
      tutor.tick();
      return requestAnimationFrame(this.tick);
    };

    Control.prototype.escape = function () {
      ui.mode = "battle";
      onecup.refresh();
    };

    Control.prototype.savePlayer = function () {
      account.save();
      return account.rootSave();
    };

    Control.prototype.clearMessage = function () {
      return (this.message = "");
    };

    Control.prototype.lastSimInterval = 0;

    Control.prototype.cheatSimInterval = -12;

    Control.prototype.trySimInterval = function () {
      var rightNow;
      rightNow = now();
      if (this.lastSimInterval + 1000 / 16 + this.cheatSimInterval <= rightNow) {
        this.lastSimInterval = rightNow;
        return this.simInterval();
      }
    };

    Control.prototype.simInterval = function () {
      /* TODO, fix the replay system
      if intp?.playReplay
          frame = localStorage["one"].split("\n")[sim.step]
          frame = JSON.parse(frame)
          if frame?.step == 1
              sim.things = {}
              intp.things = {}
          intp.recv(frame)
          sim.step += 1
       */
      var fn, frame, galaxyAway, localAway, packet, popQ, step;
      if (typeof intp !== "undefined" && intp !== null ? intp.local : void 0) {
        packet = sim.send();
        step = sim.step;
        galaxyAway = sim.galaxyStar && ui.mode !== "battle";
        //localAway = ui.mode !== "battle" && intp.state === "running";
        if (!galaxyAway && !sim.paused) {
          // !localAway &&
          sim.simulate();
        } else {
          sim.startingSim();
        }
        fn = function () {
          var data;
          stats.netAdd(packet.byteLength);
          data = intp.zJson.loadDv(packet);
          return intp.recv(data);
        };
        updateQ.unshift(fn);
        popQ = function () {
          fn = updateQ.pop();
          return fn();
        };
        setTimeout(popQ, Math.random() * control.jitter);
      }
      if ((typeof intp !== "undefined" && intp !== null ? intp.replay : void 0) === "playing") {
        frame = intp.replayFrames[intp.replayStep];
        if (frame) {
          intp.recv(frame);
          intp.replayStep += 1;
        }
      }
      if (intp) {
        return intp.think();
      }
    };

    return Control;
  })();

  window.startInitialSandbox = function () {
    window.bubbles.clear();
    if (window.network != null && typeof window.network === "function") window.network.base.close();
    window.intp = new Interpolator();
    window.sim = new Sim();
    sim.serverType = "sandbox";
    sim.local = true;
    intp.local = true;
    intp.theme = sim.theme;
    sim.start();
    window.network = new Local();

    const all_ais = Object.keys(ais.all);
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      const random_ai = all_ais[Math.floor(Math.random() * all_ais.length)];
      ais.useAi(random_ai, "alpha");
    }
    for (let i = 0; i < count; i++) {
      const random_ai = all_ais[Math.floor(Math.random() * all_ais.length)];
      ais.useAi(random_ai, "beta");
    }
    actionMixer.reset();
  };

  window.onload = function () {
    var rootAddress, ua;
    ua = detect.parse(navigator.userAgent);
    if (!initGL()) {
      ui.mode = "error";
      ui.error = "webGL";
      return;
    }
    window.actionMixer = new ActionMixer();
    actionMixer.reset();
    window.battleMode = new BattleMode();
    window.galaxyMode = new GalaxyMode();
    window.designMode = new DesignMode();
    window.fleetMode = new FleetMode();
    window.menuMode = new MenuMode();
    window.control = new Control();
    window.sim = new Sim();
    window.intp = new Interpolator();
    window.baseAtlas = new Atlas();
    baseAtlas.loadAtlas(atlas);
    rootAddress = "ws://192.9.182.115:8080"; //"ws://localhost:8080";
    window.rootNet = new RootConnection(rootAddress);
    window.network = new Local();
    battleMode.serverToJoin = onecup.params.server;
    control.tick();
    startInitialSandbox();
    control.backgroundMode = battleMode;
    return (ui.loaded = true);
  };
}.call(this));
