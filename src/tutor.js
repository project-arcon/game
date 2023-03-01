// here begin src/tutor.js
(function() {
  var Tutorial,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  eval(onecup["import"]());

  window.tutor = new (Tutorial = (function() {
    function Tutorial() {
      this.tick = bind(this.tick, this);
      this.buildBarHide = bind(this.buildBarHide, this);
      this.lastTipFiredTime = Date.now();
      this.tips = [];
      this.firedTips = {};
      this.buildBarShow = false;
      if (localStorage.firedTips) {
        this.firedTips = JSON.parse(localStorage.firedTips);
      }
    }

    Tutorial.prototype.reset = function() {
      this.lastTipFired = Date.now();
      this.firedTips = {};
      return delete localStorage.firedTips;
    };

    Tutorial.prototype.buildBarHide = function() {
      var _, cappedPoints, playerUnits, ref, ref1, t;
      if (ui.mode !== "battle") {
        return false;
      }
      if (((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (sim.step < 16 * 5) {
        return true;
      }
      if (this.buildBarShow) {
        return false;
      }
      playerUnits = 0;
      cappedPoints = 0;
      ref1 = sim.things;
      for (_ in ref1) {
        t = ref1[_];
        if (t.commandPoint && t.side === commander.side) {
          cappedPoints += 1;
        }
        if (t.unit && t.side === commander.side) {
          playerUnits += 1;
        }
      }
      if (playerUnits === 0) {
        this.buildBarShow = true;
        return false;
      }
      if (cappedPoints > 1) {
        this.buildBarShow = true;
        return false;
      }
      return true;
    };

    Tutorial.prototype.add = function(tipCls) {
      return tutor.tips.push(new tipCls());
    };

    Tutorial.prototype.done = function(tip) {
      this.firedTips[tip.name] = true;
      localStorage.firedTips = JSON.stringify(this.firedTips);
      this.lastTipFiredTime = Date.now();
      tutor.bubble = null;
      tutor.currentTip = null;
      return onecup.refresh();
    };

    Tutorial.prototype.tick = function() {
      var i, len, ref, results, tip;
      return;
      if (!intp.local) {
        return;
      }
      if (this.lastTipFiredTime > Date.now() - 15000 && tutor.bubble === null) {
        return;
      }
      tutor.bubble = null;
      ref = this.tips;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        tip = ref[i];
        if (this.firedTips[tip.name]) {
          continue;
        }
        this.currentTip = tip;
        if (this.currentTip.tick()) {
          onecup.refresh();
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Tutorial.prototype.noUnitsLeft = function() {
      var k, ref, thing;
      ref = sim.things;
      for (k in ref) {
        thing = ref[k];
        if (thing.unit && thing.side === commander.side) {
          return false;
        }
      }
      return true;
    };

    Tutorial.prototype.findEnemyCp = function() {
      var _, cp, ref, thing;
      cp = null;
      ref = sim.things;
      for (_ in ref) {
        thing = ref[_];
        if (thing.commandPoint === true && thing.side !== commander.side) {
          if (!cp || cp.pos[0] > thing.pos[0]) {
            cp = thing;
          }
        }
      }
      return cp;
    };

    Tutorial.prototype.findMyUnit = function() {
      var k, ref, thing, unit;
      unit = null;
      ref = sim.things;
      for (k in ref) {
        thing = ref[k];
        if (thing.unit && thing.side === commander.side) {
          unit = thing;
          break;
        }
      }
      return unit;
    };

    return Tutorial;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "panning";

    _Class.prototype.tick = function() {
      var ref;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (v2.mag(battleMode.focus) > 500) {
        tutor.done(this);
        return false;
      }
      tutor.bubble = {
        image: ["img/ui/tips/pan.png", 300, 300],
        x: "50%",
        y: "50%"
      };
      return true;
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "unzoom";

    _Class.prototype.tick = function() {
      var ref;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (battleMode.zoom > .7 && battleMode.zoom < 9) {
        return false;
      }
      tutor.bubble = {
        image: ["img/ui/tips/zoom.png", 300, 300],
        x: "50%",
        y: "50%"
      };
      return true;
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "unpan";

    _Class.prototype.tick = function() {
      var ref;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (v2.mag(battleMode.focus) < 2500) {
        return false;
      }
      tutor.bubble = {
        image: ["img/ui/tips/pan.png", 300, 300],
        x: "50%",
        y: "50%"
      };
      return true;
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "zoom";

    _Class.prototype.tick = function() {
      var ref;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (battleMode.zoom < 4 || battleMode.zoom > 6) {
        tutor.done(this);
        return false;
      }
      tutor.bubble = {
        image: ["img/ui/tips/zoom.png", 300, 300],
        x: "50%",
        y: "50%"
      };
      return true;
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "movement";

    _Class.prototype.tick = function() {
      var i, j, len, len1, ref, ref1, ref2, selected, u;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (tutor.noUnitsLeft()) {
        return false;
      }
      ref1 = commander.selection;
      for (i = 0, len = ref1.length; i < len; i++) {
        u = ref1[i];
        if (u.side === "alpha" && v2.mag(commander.selection[0].vel) > 1) {
          tutor.done(this);
          return false;
        }
      }
      if (!battleMode.selecting) {
        ref2 = commander.selection;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          u = ref2[j];
          if (u.side === "alpha") {
            selected = true;
          }
        }
      }
      if (selected) {
        return tutor.bubble = {
          image: ["img/ui/tips/move.png", 300, 300],
          thing: tutor.findMyUnit()
        };
      } else {
        return tutor.bubble = {
          image: ["img/ui/tips/drag.png", 300, 300],
          thing: tutor.findMyUnit()
        };
      }
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "capping";

    _Class.prototype.tick = function() {
      var _, closeCP, cp, i, len, noUnits, ref, ref1, ref2, ref3, selected, u, unit;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (tutor.noUnitsLeft()) {
        return false;
      }
      closeCP = null;
      ref1 = sim.things;
      for (_ in ref1) {
        cp = ref1[_];
        if (cp.commandPoint === true && cp.side !== commander.side) {
          noUnits = true;
          ref2 = sim.things;
          for (_ in ref2) {
            unit = ref2[_];
            if (unit.unit && unit.side !== commander.side && v2.distance(unit.pos, cp.pos) < cp.radius) {
              noUnits = false;
            }
          }
          if (noUnits && (!closeCP || closeCP.pos[0] > cp.pos[0])) {
            closeCP = cp;
          }
        }
      }
      if (!closeCP) {
        return false;
      }
      if (!battleMode.selecting) {
        ref3 = commander.selection;
        for (i = 0, len = ref3.length; i < len; i++) {
          u = ref3[i];
          if (u.side === "alpha") {
            selected = true;
          }
        }
      }
      if (closeCP.capping) {
        return tutor.bubble = {
          image: ["img/ui/tips/waitcap.png", 300, 300],
          thing: closeCP
        };
      } else if (selected) {
        return tutor.bubble = {
          image: ["img/ui/tips/capping.png", 300, 300],
          thing: closeCP
        };
      } else {
        return tutor.bubble = {
          image: ["img/ui/tips/drag.png", 300, 300],
          thing: tutor.findMyUnit()
        };
      }
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "attack";

    _Class.prototype.tick = function() {
      var cp, i, len, ref, ref1, selected, u;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (tutor.noUnitsLeft()) {
        return false;
      }
      cp = tutor.findEnemyCp();
      if (!battleMode.selecting) {
        ref1 = commander.selection;
        for (i = 0, len = ref1.length; i < len; i++) {
          u = ref1[i];
          if (u.side === "alpha") {
            selected = true;
          }
        }
      }
      if (selected) {
        return tutor.bubble = {
          image: ["img/ui/tips/attack.png", 300, 300],
          thing: cp
        };
      } else {
        return tutor.bubble = {
          image: ["img/ui/tips/drag.png", 300, 300],
          thing: tutor.findMyUnit()
        };
      }
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "build";

    _Class.prototype.tick = function() {
      var ref;
      if (ui.mode !== "battle" || ((ref = sim.galaxyStar) != null ? ref.type : void 0) !== "home") {
        return false;
      }
      if (battleMode.buildClicked) {
        tutor.done(this);
        return false;
      }
      return tutor.bubble = {
        x: "25%",
        bottom: 84,
        message: "You build ships with the build bar down here. Click on a ship to build it."
      };
    };

    return _Class;

  })());

  tutor.add((function() {
    function _Class() {}

    _Class.prototype.name = "buildQ";

    _Class.prototype.time = 0;

    _Class.prototype.tick = function() {
      if (ui.mode !== "battle") {
        return false;
      }
      if (commander.buildQ.length > 1) {
        tutor.bubble = {
          x: "25%",
          bottom: 84,
          message: "When you don't have enough money, ships queue up to be build later. You can right click to cancel."
        };
        this.time += 1;
        if (this.time > 16 * 15) {
          tutor.done(this);
        }
        return true;
      }
    };

    return _Class;

  })());


  /*
  defineTip class
      name: "editorIntro"
  
      check: ->
          if ui.mode == "design"
              @fire()
  
      fire: ->
          tutor.fired(this)
          bubbles.add
              x: "40%"
              y: "40%"
              message: "This is the ship editor. Here you can create any ship you like. A big part of the game is creating cool new designs. (click me to close)"
              modeOnly: "design"
  
  defineTip class
      name: "editorDrag"
  
      check: ->
          if ui.mode == "design"
              @fire()
  
      condition: -> designMode.draggedAPart
  
      fire: ->
          tutor.fired(this)
          bubbles.add
              x: 120
              y: 300
              message: "You can drag parts from here. On to the ship."
              close: => @condition()
              modeOnly: "design"
  
  defineTip class
      name: "editorDelete"
  
      check: ->
          if ui.mode == "design"
              @fire()
  
      condition: -> designMode.deletedAPart
  
      fire: ->
          tutor.fired(this)
          bubbles.add
              x: 320
              y: "60%"
              message: "To remove parts simply drag them off the design grid."
              close: => @condition()
              modeOnly: "design"
   */

}).call(this);
;


