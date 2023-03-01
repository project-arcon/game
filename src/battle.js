// here begin src/battle.js
(function () {
  var MAX_ZOOM_IN,
    bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    },
    extend = function (child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    hasProp = {}.hasOwnProperty;

  MAX_ZOOM_IN = 0.5;

  window.GameMode = (function () {
    function GameMode() {}

    GameMode.prototype.toGameSpace = function (point) {
      point[0] = point[0] - window.innerWidth / 2;
      point[1] = window.innerHeight / 2 - point[1];
      v2.scale(point, this.zoom * 2);
      v2.sub(point, this.focus);
      return point;
    };

    GameMode.prototype.fromGameSpace = function (point) {
      point = v2.create(point);
      v2.add(point, this.focus);
      v2.scale(point, 1 / (this.zoom * 2));
      point[0] = point[0] + window.innerWidth / 2;
      point[1] = -point[1] + window.innerHeight / 2;
      return point;
    };

    return GameMode;
  })();

  window.ControlsMode = (function (superClass) {
    extend(ControlsMode, superClass);

    function ControlsMode() {
      this.onzoom = bind(this.onzoom, this);
      this.onkeyup = bind(this.onkeyup, this);
      this.onkeydown = bind(this.onkeydown, this);
      return ControlsMode.__super__.constructor.apply(this, arguments);
    }

    ControlsMode.prototype.keyScroll = [0, 0];

    ControlsMode.prototype.keyZoom = 0;

    ControlsMode.prototype.panLeft = 0;

    ControlsMode.prototype.panRight = 0;

    ControlsMode.prototype.panUp = 0;

    ControlsMode.prototype.panDown = 0;

    ControlsMode.prototype.zoomIn = 0;

    ControlsMode.prototype.zoomOut = 0;

    ControlsMode.prototype.mapBounds = 10000;

    ControlsMode.prototype.onkeydown = function (e) {
      if (settings.key(e, "Pan Map")) {
        this.moving = true;
      } else if (settings.key(e, "Up")) {
        this.panUp = -1;
      } else if (settings.key(e, "Down")) {
        this.panDown = 1;
      } else if (settings.key(e, "Left")) {
        this.panLeft = 1;
      } else if (settings.key(e, "Right")) {
        this.panRight = -1;
      } else if (settings.key(e, "Zoom In")) {
        this.zoomIn = -1;
      } else if (settings.key(e, "Zoom Out")) {
        this.zoomOut = 1;
      } else {
        return;
      }
      return e.preventDefault();
    };

    ControlsMode.prototype.onkeyup = function (e) {
      if (settings.key(e, "Pan Map")) {
        this.moving = false;
      }
      if (settings.key(e, "Up")) {
        this.panUp = 0;
      }
      if (settings.key(e, "Down")) {
        this.panDown = 0;
      }
      if (settings.key(e, "Left")) {
        this.panLeft = 0;
      }
      if (settings.key(e, "Right")) {
        this.panRight = 0;
      }
      if (settings.key(e, "Zoom In")) {
        this.zoomIn = 0;
      }
      if (settings.key(e, "Zoom Out")) {
        this.zoomOut = 0;
      }
      if (settings.key(e, "Focus on Units")) {
        return (this.centerOnUnit = false);
      }
    };

    ControlsMode.prototype.onzoom = function (delta, e) {
      var afterPos, beforePos, z;
      beforePos = this.toGameSpace([e.clientX, e.clientY]);
      z = 0.1;
      this.zoom += delta * settings.speedValue("Zoom Speed") * z;
      if (this.zoom < MAX_ZOOM_IN) {
        this.zoom = MAX_ZOOM_IN;
      }
      if (this.zoom > 10) {
        this.zoom = 10;
      }
      afterPos = this.toGameSpace([e.clientX, e.clientY]);
      this.focus[0] -= beforePos[0] - afterPos[0];
      return (this.focus[1] -= beforePos[1] - afterPos[1]);
    };

    ControlsMode.prototype.controls = function () {
      var a, edge, j, len, numSel, ref, ref1, speed, thing, z;
      if (!commander) {
        return;
      }
      this.keyScroll[0] *= 0.8;
      this.keyScroll[1] *= 0.8;
      a = 10 * this.zoom * settings.speedValue("Scroll Speed");
      this.keyScroll[1] += (this.panUp + this.panDown) * a;
      this.keyScroll[0] += (this.panLeft + this.panRight) * a;
      v2.add(this.focus, this.keyScroll);
      if (v2.mag(this.focus) > this.mapBounds) {
        this.focus[0] -= this.focus[0] * 0.003;
        this.focus[1] -= this.focus[1] * 0.003;
      }
      this.keyZoom *= 0.9;
      z = 0.02;
      this.keyZoom += (this.zoomIn + this.zoomOut) * z * settings.speedValue("Scroll Speed");
      this.zoom += this.keyZoom;
      if (this.zoom < MAX_ZOOM_IN) {
        this.zoom = MAX_ZOOM_IN;
      }
      if (this.zoom > 10) {
        this.zoom = 10;
      }
      numSel = (ref = commander.selection) != null ? ref.length : void 0;
      if (this.centerOnUnit && numSel > 0) {
        this.focus[0] = 0;
        this.focus[1] = 0;
        ref1 = commander.selection;
        for (j = 0, len = ref1.length; j < len; j++) {
          thing = ref1[j];
          this.focus[0] -= thing.pos[0] / numSel;
          this.focus[1] -= thing.pos[1] / numSel;
        }
      }
      if (isFullScreen() && (ui.mode === "battle" || ui.mode === "galaxy")) {
        speed = 20 * this.zoom * settings.speedValue("Scroll Speed");
        edge = 2;
        if (this.screenMouse[0] < edge) {
          this.keyScroll[0] += speed;
        }
        if (this.screenMouse[0] > window.innerWidth - edge) {
          this.keyScroll[0] -= speed;
        }
        if (this.screenMouse[1] < edge) {
          this.keyScroll[1] -= speed;
        }
        if (this.screenMouse[1] > window.innerHeight - edge) {
          return (this.keyScroll[1] += speed);
        }
      }
    };

    return ControlsMode;
  })(GameMode);

  window.BattleMode = (function (superClass) {
    extend(BattleMode, superClass);

    function BattleMode(player1) {
      this.player = player1;
      this.onkeyup = bind(this.onkeyup, this);
      this.onkeydown = bind(this.onkeydown, this);
      this.onmouseup = bind(this.onmouseup, this);
      this.onmousedown = bind(this.onmousedown, this);
      this.ondblclick = bind(this.ondblclick, this);
      this.canvas = document.getElementById("webGL");
      this.selection = document.getElementById("selection");
      this.reset();
    }

    BattleMode.prototype.reset = function () {
      this.selectAt = v2.create();
      this.savedSelections = {};
      this.selecting = false;
      this.moving = false;
      this.drawing = false;
      this.ordering = false;
      this.shiftOrder = false;
      this.panLeft = 0;
      this.panRight = 0;
      this.panUp = 0;
      this.panDown = 0;
      this.zoomIn = 0;
      this.zoomOut = 0;
      this.zoom = 5;
      this.focus = v2.create();
      this.lastMouseMove = 0;
      this.mouse = v2.create();
      this.screenMouse = v2.create();
      this.placeingCls = null;
      this.drawPoints = [];
      this.movePoints = [];
      return (this.orderId = 0);
    };

    BattleMode.prototype.genOrderId = function () {
      var o;
      o = this.orderId;
      this.orderId += 2;
      return o;
    };

    BattleMode.prototype.startNewLocal = function () {
      var base;
      this.reset();
      bubbles.clear();
      ui.go("battle");
      if (window.network != null) {
        if (typeof (base = window.network).close === "function") {
          base.close();
        }
      }
      window.intp = new Interpolator();
      window.sim = new Sim();
      sim.local = true;
      intp.local = true;
      window.network = new Local();
      if (typeof network !== "undefined" && network !== null) {
        network.sendPlayer();
      }
      sim.generateMap(0.5, 1, 0);
      sim.extra = function () {
        if (sim.winningSide) {
          return bubbles.clear();
        }
      };
      return sim.start();
    };

    BattleMode.prototype.startAIChallenge = function (challengeName) {
      var base, player;
      this.reset();
      if (window.network != null) {
        if (typeof (base = window.network).close === "function") {
          base.close();
        }
      }
      window.network = new Local();
      ui.go("battle");
      window.intp = new Interpolator();
      window.sim = new Sim();
      sim.local = true;
      sim.challenge = challengeName;
      intp.local = true;
      intp.theme = sim.theme;
      player = ais.useAi(challengeName, "beta");
      if (typeof network !== "undefined" && network !== null) {
        network.sendPlayer();
      }
      sim.start();
      return (intp.gameEnded = function () {
        if (intp.winningSide === "alpha") {
          if (commander.challenges[challengeName] == null || commander.challenges[challengeName] > sim.step) {
            commander.challenges[challengeName] = sim.step;
          }
          account.rootRealSave();
        }
        return ui.go("challenges");
      });
    };

    BattleMode.prototype.joinServer = function (serverName) {
      //vax
      //keep hotkey groupes and camera pos on rejoin
      if (!(this.server = (rootNet.servers = rootNet.servers) != null ? rootNet.servers[serverName] : void 0)) return console.log("server not found");
      if (serverName !== battleMode.serverName) this.reset();
      this.serverName = serverName;
      if (window.network != null && typeof window.network.close === "function") window.network.close();

      bubbles.clear();
      window.intp = new Interpolator();
      intp.local = false;
      window.sim = intp;
      actionMixer.reset();

      return (window.network = new Connection(this.server.address));
    };

    BattleMode.prototype.joinLocal = function () {
      var base;
      if (!sim.local || sim.galaxyStar || sim.challenge) {
        this.reset();
        this.server = null;
        bubbles.clear();
        if (window.network != null) {
          if (typeof (base = window.network).close === "function") {
            base.close();
          }
        }
        window.network = new Local();
        window.intp = new Interpolator();
        window.sim = new Sim();
        sim.local = true;
        intp.local = true;
        chat.channel = "local";
        sim.generateMap();
      } else {
        sim.winningSide = false;
        sim.state = "waiting";
      }
      ui.go("battleroom");
      return after(0, function () {
        network.sendPlayer();
        return network.send("switchSide", "alpha");
      });
    };

    BattleMode.prototype.onmousemove = function (e) {
      var b, dx, dy, end, endx, endy, id, ifHasFilter, index, j, len, need_tip, now, ref, ref1, ref2, ref3, ref4, selected, start, startx, starty, t, thing, unit, x, y;
      if (!this.player) {
        return;
      }
      this.screenMouse = [e.clientX, e.clientY];
      this.mouse = this.toGameSpace([this.screenMouse[0], this.screenMouse[1]]);
      now = Date.now();
      if (this.lastMouseMove < now - 1000 / 16) {
        this.lastMouseMove = now;
        if (typeof network !== "undefined" && network !== null) {
          network.send("mouseMove", this.mouse, this.selecting || this.ordering);
        }
      }
      if (this.selecting) {
        this.selection.style.display = "block";
        startx = Math.min(this.selectAt[0], e.clientX);
        starty = Math.min(this.selectAt[1], e.clientY);
        endx = Math.max(this.selectAt[0], e.clientX);
        endy = Math.max(this.selectAt[1], e.clientY);
        this.selection.style.left = startx + "px";
        this.selection.style.top = starty + "px";
        this.selection.style.width = -startx + endx + "px";
        this.selection.style.height = -starty + endy + "px";
        start = this.toGameSpace([startx, starty]);
        end = this.toGameSpace([endx, endy]);
        selected = [];
        if (v2.distance([startx, starty], [endx, endy]) < 10) {
          unit = this.closestUnit(start);
          if (unit) {
            selected.push(unit);
          }
        } else {
          ref = intp.things;
          for (id in ref) {
            thing = ref[id];
            if (start[0] < (ref1 = thing.pos[0]) && ref1 < end[0] && start[1] > (ref2 = thing.pos[1]) && ref2 > end[1]) {
              selected.push(thing);
            }
          }
        }
        if (this.selectAdd) {
          ref3 = commander.selection;
          for (j = 0, len = ref3.length; j < len; j++) {
            thing = ref3[j];
            selected.push(thing);
          }
        }
        ifHasFilter = function (selected, fn) {
          var has, k, l, len1, len2, newSelected, t;
          has = false;
          for (k = 0, len1 = selected.length; k < len1; k++) {
            t = selected[k];
            if (fn(t)) {
              has = true;
            }
          }
          if (!has) {
            return selected;
          }
          newSelected = [];
          for (l = 0, len2 = selected.length; l < len2; l++) {
            t = selected[l];
            if (fn(t)) {
              newSelected.push(t);
            }
          }
          return newSelected;
        };
        selected = (function () {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = selected.length; k < len1; k++) {
            t = selected[k];
            if (t.unit) {
              results.push(t);
            }
          }
          return results;
        })();
        selected = ifHasFilter(selected, function (u) {
          return u.owner === commander.id;
        });
        selected.sort(function (a, b) {
          return a.id - b.id;
        });
        this.selectUnitsFake(selected);
      }
      if (this.moving) {
        dx = e.movementX;
        dy = e.movementY;
        if (dx === void 0) {
          dx = e.mozMovementX;
        }
        if (dy === void 0) {
          dy = e.mozMovementY;
        }
        this.focus[0] += dx * this.zoom * 2;
        this.focus[1] -= dy * this.zoom * 2;
      }
      if (this.ordering) {
        this.drawPoints.push(this.toGameSpace([e.clientX, e.clientY]));
      }
      need_tip = null;
      if (e.clientY > window.innerHeight - 84 && !tutor.buildBarHide()) {
        index = Math.floor((e.clientX - window.innerWidth / 2) / 84 + 5);
        if (index >= 0 && index < 10) {
          need_tip = {
            bottom: 84 + 28,
            x: window.innerWidth / 2 + (index - 5) * 84 - 43,
            width: 240,
            stem: "center",
            modeOnly: "battle",
            html: function () {
              var spec, valid;
              spec = commander.buildBar[index];
              valid = commander.validBar[index];
              return unitInfoSmall(spec, valid);
            },
          };
        }
      }
      if (this.tip) {
        b = this.tipBounds;
        x = this.screenMouse[0];
        y = this.screenMouse[1];
        if (x < b.left || x > b.right || y < b.top || y > b.bottom) {
          this.tipBounds = null;
          this.tip = null;
        }
        need_tip = {
          bottom: window.innerHeight - b.top,
          x: (b.left + b.right) / 2 - 140 / 2 + 20,
          width: 160,
          stem: "center",
          modeOnly: "battle",
          html: this.tip,
        };
      }
      if (((ref4 = bubbles.tip) != null ? ref4.x : void 0) !== (need_tip != null ? need_tip.x : void 0)) {
        bubbles.tip = need_tip;
        return onecup.refresh();
      }
    };

    BattleMode.prototype.selectUnitsFake = function (things) {
      var j, len, ref, selected, selectedIds, t;
      selectedIds = [];
      selected = [];
      for (j = 0, len = things.length; j < len; j++) {
        t = things[j];
        if (selectedIds.indexOf(t.id) === -1) {
          selectedIds.push(t.id);
          selected.push(t);
        }
      }
      commander.selection = selected;
      return (ref = intp.players[commander.id]) != null ? (ref.selection = selected) : void 0;
    };

    BattleMode.prototype.selectUnits = function (things) {
      var ids, t;
      ids = (function () {
        var j, len, results;
        results = [];
        for (j = 0, len = things.length; j < len; j++) {
          t = things[j];
          if (intp.things[t.id]) {
            results.push(t.id);
          }
        }
        return results;
      })();
      return this.selectThings(things, ids);
    };

    BattleMode.prototype.selectUnitsIds = function (ids) {
      var id, j, len, t, things;
      things = [];
      for (j = 0, len = ids.length; j < len; j++) {
        id = ids[j];
        t = intp.things[id];
        if (t) {
          things.push(t);
        }
      }
      return this.selectThings(things, ids);
    };

    BattleMode.prototype.selectThings = function (things, ids) {
      var ref;
      commander.selection = things;
      if ((ref = intp.players[commander.number]) != null) {
        ref.selection = things;
      }
      return network.send("playerSelected", ids);
    };

    BattleMode.prototype.ondblclick = function (e) {
      var at, id, j, len, ref, ref1, selected, thing, unit;
      if (e.which !== 1) {
        return;
      }
      at = this.toGameSpace([e.clientX, e.clientY]);
      unit = this.closestUnit(at);
      if (!unit) {
        return;
      }
      selected = [];
      ref = intp.things;
      for (id in ref) {
        thing = ref[id];
        if (JSON.stringify(thing.spec) === JSON.stringify(unit.spec) && thing.owner === unit.owner) {
          selected.push(thing);
        }
      }
      if (e.shiftKey) {
        ref1 = commander.selection;
        for (j = 0, len = ref1.length; j < len; j++) {
          thing = ref1[j];
          selected.push(thing);
        }
      }
      this.selectUnits(selected);
      return (this.selecting = false);
    };

    BattleMode.prototype.onmousedown = function (e) {
      var ref;
      if (e.which === 1) {
        if (e.clientY > window.innerHeight - 84 - 42) {
          return;
        }
      }
      if (!this.player) {
        return;
      }
      if (this.rallyPlacing && (e.which === 1 || e.which === 3)) {
        network.send("setRallyPoint", this.mouse);
        commander.rallyPoint = v2.create(this.mouse);
        if ((ref = intp.players[commander.number]) != null) {
          ref.rallyPoint = v2.create(this.mouse);
        }
        this.rallyPlacing = false;
        onecup.refresh();
        return;
      }
      if (e.which === 1) {
        this.selectAt[0] = e.clientX;
        this.selectAt[1] = e.clientY;
        this.selecting = true;
        this.selectAdd = e.shiftKey;
      }
      if (e.which === 2) {
        this.moving = true;
      }
      if (e.which === 3) {
        this.ordering = true;
        this.shiftOrder = e.shiftKey;
        this.drawPoints = [this.toGameSpace([e.clientX, e.clientY])];
      }
      e.preventDefault();
      return false;
    };

    BattleMode.prototype.onmouseup = function (e) {
      if (!this.player) {
        return;
      }
      this.moving = false;
      this.drawing = false;
      if (this.ordering) {
        this.sendMoveOrder(e.shiftKey);
        this.ordering = false;
      }
      this.drawPoints = [];
      if (this.selecting) {
        window.onmousemove(e);
        this.selecting = false;
        this.selectUnits(commander.selection);
      }
      this.selection.style.display = "none";
      e.preventDefault();
      return false;
    };

    BattleMode.prototype.onkeydown = function (e) {
      var id, j, len, number, ref, ref1, selectedIds, t, thing;
      BattleMode.__super__.onkeydown.call(this, e);
      this.shiftOrder = e.shiftKey;
      if (settings.key(e, "Line Move")) {
        this.drawPoints.push(this.mouse);
        this.ordering = true;
      } else if (settings.key(e, "Select") && !this.selecting) {
        this.selectAt[0] = this.screenMouse[0];
        this.selectAt[1] = this.screenMouse[1];
        this.selecting = true;
        this.selectAdd = e.shiftKey;
      } else if (e.which === 9) {
        this.showOverlay();
      } else if (settings.key(e, "Stop Units")) {
        this.stopOrder();
      } else if (settings.key(e, "Hold Position")) {
        this.holdPositionOrder();
      } else if (settings.key(e, "Self Destruct")) {
        this.selfDestructOrder();
      } else if (settings.key(e, "Focus Fire/Follow")) {
        this.follow = !this.follow;
      } else if (settings.key(e, "Place Rally Point")) {
        this.rallyPlacing = !this.rallyPlacing;
      } else if (settings.key(e, "Remove Rally Point")) {
        network.send("setRallyPoint", [0, 0]);
        commander.rallyPoint = [0, 0];
      } else if (settings.key(e, "Unit Info")) {
        ui.showInfo = !ui.showInfo;
        onecup.refresh();
      } else if (e.which >= 48 && e.which <= 57) {
        number = e.which - 49;
        if (number === -1) {
          number = 9;
        }
        if (e.ctrlKey && e.altKey) {
          this.copySelected(number);
        } else if (e.altKey) {
          if (commander.validBar[number]) {
            network.send("buildRq", number, 1);
          }
        } else if (e.ctrlKey) {
          this.savedSelections[number] = function () {
            var j, len, ref, results;
            ref = this.player.selection;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              t = ref[j];
              results.push(t.id);
            }
            return results;
          }.call(this);
        } else {
          selectedIds = this.savedSelections[number] || [];
          if (selectedIds.length === 0) {
            ref = intp.things;
            for (id in ref) {
              thing = ref[id];
              if (thing.owner === commander.number && thing.spec === commander.buildBar[number]) {
                selectedIds.push(id);
              }
            }
          }
          if (e.shiftKey) {
            ref1 = commander.selection;
            for (j = 0, len = ref1.length; j < len; j++) {
              thing = ref1[j];
              selectedIds.push(thing.id);
            }
          }
          this.selectUnitsIds(selectedIds);
        }
      } else if (settings.key(e, "Focus on Units")) {
        this.centerOnUnit = true;
      } else if (settings.key(e, "Pause") || e.which === 19) {
        sim.paused = !(sim.paused === true);
      } else {
        return;
      }
      return e.preventDefault();
    };

    BattleMode.prototype.onkeyup = function (e) {
      BattleMode.__super__.onkeyup.call(this, e);
      if (this.selecting) {
        this.selection.style.display = "none";
        this.selecting = false;
      }
      if (settings.key(e, "Line Move")) {
        this.sendMoveOrder(e.shiftKey);
        this.ordering = false;
        this.drawing = false;
        this.drawPoints = [];
      }
      if (settings.key(e, "Toggle Roster")) {
        this.hideOverlay();
      }
      if (settings.key(e, "Focus on Units")) {
        this.centerOnUnit = false;
      }
      return (this.shiftOrder = false);
    };

    BattleMode.prototype.stopOrder = function () {
      return network.send("stopOrder");
    };

    BattleMode.prototype.holdPositionOrder = function () {
      return network.send("holdPositionOrder");
    };

    BattleMode.prototype.followOrder = function (unit, shiftKey) {
      var i, id, j, len, ref, results, t;
      id = this.genOrderId();
      network.send("followOrder", unit.id, shiftKey, id);
      ref = commander.selection;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        t = ref[i];
        if (t.owner === commander.number) {
          if (!shiftKey) {
            t.preOrders = [];
          }
          results.push(
            t.preOrders.push({
              type: "Follow",
              targetId: unit.id,
              id: id,
            })
          );
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    BattleMode.prototype.selfDestructOrder = function () {
      return network.send("selfDestructOrder");
    };

    BattleMode.prototype.moveOrder = function (formation, shiftKey) {
      var i, id, j, len, ref, results, t;
      id = this.genOrderId();
      network.send("moveOrder", formation, shiftKey, id);
      ref = commander.selection;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        t = ref[i];
        if (t.owner === commander.number) {
          if (!shiftKey) {
            t.preOrders = [];
          }
          results.push(
            t.preOrders.push({
              type: "Move",
              dest: formation[i],
              id: id,
            })
          );
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    BattleMode.prototype.sendMoveOrder = function (shiftKey) {
      var unit;
      if (this.drawPoints.length === 0) {
        return;
      }
      if (this.follow) {
        this.follow = false;
        unit = this.closestUnit(this.drawPoints[0]);
        if (unit) {
          this.followOrder(unit, shiftKey);
        }
        return;
      }
      return this.moveOrder(this.movePoints, shiftKey);
    };

    BattleMode.prototype.onbuildclick = function (e, index) {
      var number, ref, ref1;
      e.stopPropagation();
      this.buildClicked = true;
      if (buildBar.emptySpec(commander.buildBar[index]) && commander.selection.length === 1) {
        if ((ref = sim.galaxyStar) != null ? ref.noDesignTools : void 0) {
          return;
        }
        this.copySelected(index);
        return;
      }
      if (commander.buildBar[index].length === 0 || !commander.validBar[index]) {
        if ((ref1 = sim.galaxyStar) != null ? ref1.noDesignTools : void 0) {
          return;
        }
        buildBar.selected = index;
        ui.mode = "design";
        return;
      }
      number = 1;
      if (e.shiftKey) {
        number = 5;
      }
      if (e.which === 3 || e.altKey || e.metaKey || e.ctrlkey) {
        number = -number;
      }
      return network.send("buildRq", index, number);
    };

    BattleMode.prototype.computeLineMove = function () {
      var points, selected, totalDistance, u, walkRope;
      selected = commander.selection;
      if (!selected) {
        return;
      }
      selected = (function () {
        var j, len, results;
        results = [];
        for (j = 0, len = selected.length; j < len; j++) {
          u = selected[j];
          if (u.owner === commander.number) {
            results.push(u);
          }
        }
        return results;
      })();
      if (selected.length === 0) {
        return;
      }
      totalDistance = function (points) {
        var distance, j, last, len, point, ref;
        distance = 0;
        last = points[0];
        ref = points.slice(1);
        for (j = 0, len = ref.length; j < len; j++) {
          point = ref[j];
          distance += v2.distance(last, point);
          last = point;
        }
        return distance;
      };
      walkRope = function (points, units, cb) {
        var dir, dist, i, j, last, len, n, point, pos, prev, results, step, stepLeft, total, use;
        total = totalDistance(points);
        if (total === 0 || points.length === 1 || units.length === 1) {
          for (j = 0, len = units.length; j < len; j++) {
            u = units[j];
            cb(points[0], u);
          }
          return;
        }
        step = total / (units.length - 1);
        dir = v2.create();
        pos = v2.create();
        n = 0;
        i = 0;
        stepLeft = 0;
        last = null;
        results = [];
        while (i < units.length) {
          use = function (p) {
            cb(v2.create(p), units[i]);
            stepLeft = step;
            return (i += 1);
          };
          point = points[n];
          if (i === 0) {
            use(point);
            n += 1;
            continue;
          }
          if (i === units.length - 1) {
            use(points[points.length - 1]);
            continue;
          }
          if (n > points.length - 1) {
            use(points[points.length - 1]);
            continue;
          }
          prev = points[n - 1];
          dist = v2.distance(prev, point);
          if (dist === stepLeft) {
            use(point);
            n += 1;
            continue;
          } else if (dist < stepLeft) {
            stepLeft -= dist;
            n += 1;
            continue;
          } else if (dist > stepLeft) {
            v2.set(prev, pos);
            dist = v2.distance(prev, point);
            while (dist > stepLeft) {
              v2.direction(point, prev, dir);
              v2.scale(dir, stepLeft);
              v2.add(pos, dir);
              dist -= stepLeft;
              use(pos);
            }
            n += 1;
            results.push((stepLeft -= dist));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      this.movePoints = [];
      points = this.drawPoints;
      return walkRope(
        points,
        selected,
        (function (_this) {
          return function (point, unit) {
            var angle, pos;
            _this.movePoints.push(point);
            if (_this.shiftOrder && unit.preOrders.length > 0) {
              pos = unit.preOrders.last().dest;
            }
            if (!pos) {
              pos = unit.pos;
            }
            angle = v2.angle(v2.sub(point, pos, v2.create()));
            return baseAtlas.drawSprite("img/arrow01.png", point, [1, 1], angle, [255, 255, 255, 255]);
          };
        })(this)
      );
    };

    BattleMode.prototype.draw = function () {
      var bg_zoom, theme, z;
      baseAtlas.beginSprites(this.focus, this.zoom);
      if (this.follow) {
        control.setCursor("mouseAttack");
      } else {
        control.setCursor("mouse");
      }
      if (intp.theme != null) {
        theme = intp.theme;
      } else {
        theme = mapping.themes[0];
      }
      bg_zoom = Math.max(window.innerWidth, window.innerHeight) / 120;
      z = bg_zoom * this.zoom;
      baseAtlas.drawSprite("img/newbg/fill.png", [-this.focus[0], -this.focus[1]], [z, z], 0, theme.fillColor);
      baseAtlas.drawSprite("img/newbg/gradient.png", [-this.focus[0], -this.focus[1]], [z, z], 0, theme.spotColor);
      intp.draw();
      if (this.drawPoints.length > 0) {
        this.computeLineMove();
      }
      return baseAtlas.finishSprites();
    };

    BattleMode.prototype.tick = function () {
      var ref;
      this.player = commander;
      this.controls();
      if (this.serverToJoin != null && (typeof rootNet !== "undefined" && rootNet !== null ? ((ref = rootNet.servers) != null ? ref[this.serverToJoin] : void 0) : void 0)) {
        this.joinServer(this.serverToJoin);
        return (this.serverToJoin = null);
      }
    };

    BattleMode.prototype.showOverlay = function () {
      var overlay;
      overlay = onecup.lookup("#overlay");
      return overlay != null ? (overlay.style.display = "block") : void 0;
    };

    BattleMode.prototype.hideOverlay = function () {
      var overlay;
      overlay = onecup.lookup("#overlay");
      return overlay != null ? (overlay.style.display = "none") : void 0;
    };

    BattleMode.prototype.closestUnit = function (pos, exact) {
      var dist, id, minDist, minUnit, ref, thing;
      if (exact == null) {
        exact = false;
      }
      minDist = 0;
      minUnit = null;
      ref = intp.things;
      for (id in ref) {
        thing = ref[id];
        if (!thing.unit) {
          continue;
        }
        dist = v2.distance(thing.pos, pos);
        if (dist < 1000) {
          if (!minUnit || minDist > dist) {
            minUnit = thing;
            minDist = dist;
          }
        }
      }
      return minUnit;
    };

    BattleMode.prototype.copySelected = function (index) {
      var copy, spec, unit;
      if (commander.selection.length === 1) {
        unit = commander.selection[0];
        spec = unit.spec;
        copy = new types.Unit(spec);
        copy.aiRules = [];
        if (!sim.local && window.location.href.indexOf("gamedev.html") === -1 && unit.owner !== commander.number) {
          copy.ghostCopy = true;
        }
        buildBar.setSpec(index, copy.toSpec());
        return control.savePlayer();
      }
    };

    return BattleMode;
  })(window.ControlsMode);
}.call(this));
