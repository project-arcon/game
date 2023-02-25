(function () {
  var diffVec,
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

  diffVec = v2.create();

  window.Interpolator = (function (superClass) {
    extend(Interpolator, superClass);

    Interpolator.prototype.sound = true;

    Interpolator.prototype.fast = false;

    function Interpolator() {
      this.think = bind(this.think, this);
      this.step = 0;
      this.smoothStep;
      this.advanceStep;
      this.firstUpdate = true;
      this.things = {};
      this.players = [];
      this.particles = {};
      this.trails = {};
      this.avgFrame = 9;
      this.lastFrame = 0;
      this.stepTime = now();
      this.t = now();
      this.avgDt = 1 / 60;
      this.avgTime = 1000 / 16;
      this.allMessages = [];
      this.dataQ = [];
      this.wait = 0;
      this.prevWait = 2;
      this.state = "waiting";
      this.pref = {};
      this.zJson = new window.ZJson(prot.commonWords);
    }

    Interpolator.prototype.gameStarted = function () {
      if (!commander) {
        return;
      }
      this.players = [];
      this.things = {};
      this.particles = {};
      this.trails = {};
      this.winningSide = null;
      track("start");
      if (!sim.galaxyStar && !sim.local) {
        if (commander.side !== "spectators") {
          ui.go("battle");
        }
        if (ui.mode === "battleroom" || ui.mode === "quickscore") {
          ui.go("battle");
        }
      }
      return (commander.selection = []);
    };

    Interpolator.prototype.focusMap = function () {
      var _, dist, maxDist, ref, thing;
      maxDist = 0;
      ref = sim.things;
      for (_ in ref) {
        thing = ref[_];
        dist = v2.mag(thing.pos);
        if (dist > maxDist) {
          maxDist = dist;
        }
      }
      battleMode.focus = [0, 0];
      return (battleMode.zoom = maxDist / 1000);
    };

    Interpolator.prototype.gameEnded = function () {
      actionMixer.reset();
      if (!sim.local) {
        if (commander.side !== "spectators") {
          ui.go("quickscore");
        }
        if (ui.mode === "battle") {
          ui.go("quickscore");
        }
      }
      return this.uploadReplay();
    };

    Interpolator.prototype.drawThingsList = function () {
      var _, particle, ref, ref1, ref2, thing, things;
      things = [];
      ref = this.things;
      for (_ in ref) {
        thing = ref[_];
        things.push(thing);
      }
      ref1 = this.particles;
      for (_ in ref1) {
        particle = ref1[_];
        things.push(particle);
      }
      ref2 = this.trails;
      for (_ in ref2) {
        particle = ref2[_];
        things.push(particle);
      }
      return things;
    };

    Interpolator.prototype.draw = function () {
      var ai, color, i, j, l, len, len1, len2, len3, m, o, p, player, q, ref, ref1, ref2, thing, things;
      this.advance();
      if (typeof sim !== "undefined" && sim !== null ? sim.ais : void 0) {
        ref = sim.ais;
        for (j = 0, len = ref.length; j < len; j++) {
          ai = ref[j];
          ai.draw();
        }
      }
      things = this.drawThingsList();
      things.sort(function (a, b) {
        return a.z - b.z;
      });
      for (l = 0, len1 = things.length; l < len1; l++) {
        thing = things[l];
        thing.draw();
      }
      color = [0, 0, 0, 0];
      ref1 = this.players;
      for (o = 0, len2 = ref1.length; o < len2; o++) {
        player = ref1[o];
        if (!player) {
          continue;
        }
        if (player.name !== (typeof commander !== "undefined" && commander !== null ? commander.name : void 0) && player.side !== "spectators" && player.side !== "dead" && player.connected) {
          if (player.mouse[0] !== 0 && player.mouse[1] !== 0 && player._mouse) {
            m = [0, 0];
            color = [player.color[0], player.color[1], player.color[2], 255];
            v2.lerp(player._mouse, player.mouse, this.smoothFactor, m);
            player.mouseTrail.push(m);
            while (player.mouseTrail.length > 10) {
              player.mouseTrail.shift();
            }
            ref2 = player.mouseTrail;
            for (i = q = 0, len3 = ref2.length; q < len3; i = ++q) {
              p = ref2[i];
              color[3] = 255 / (10 - i + 1);
              baseAtlas.drawSprite("img/pip1.png", p, [1, 1], 0, color);
            }
            if (player.action) {
              baseAtlas.drawSprite("img/pip1.png", m, [2, 2], 0, player.color);
            }
          }
        }
        if (player.name === (typeof commander !== "undefined" && commander !== null ? commander.name : void 0)) {
          player.selection = commander.selection;
          player.draw();
        }
      }

      /*  * uncomment this to debug
      for _, t of intp.things
          #baseAtlas.drawSprite("img/pip1.png", t._pos2,  [1,1], 0, [0,255,0,100])
          #baseAtlas.drawSprite("img/pip1.png", t._pos, [1,1], 0, [255,0,0,100])
          if t.unit
              for p in t.testIntp
                  baseAtlas.drawSprite("img/pip1.png", p, [.2,.2], 0, [255,0,0,100])
              #for p in t.testStep
               *    baseAtlas.drawSprite("img/pip1.png", p, [.4,.4], 0, [0,255,0,100])
       */
    };

    Interpolator.prototype.advance = function () {
      if (this.fast) {
        return this.advanceSnap();
      } else {
        return this.advanceSmooth();
      }
    };

    Interpolator.prototype.advanceSnap = function () {
      var i, id, j, len, ref, ref1, thing, weapon;
      this.t = now();
      this.smoothFactor = 1;
      ref = this.things;
      for (id in ref) {
        thing = ref[id];
        v2.set(thing._pos, thing.pos);
        thing.rot = thing._rot;
        if (thing.weapons != null) {
          ref1 = thing.weapons;
          for (i = j = 0, len = ref1.length; j < len; i = ++j) {
            weapon = ref1[i];
            weapon.rot = weapon._rot;
          }
        }
      }
      return null;
    };

    Interpolator.prototype.advanceSmooth = function () {
      var a, angleDiff, difference, expectedLastStep, i, id, j, jumpDiff, len, part, ref, ref1, ref2, thing, timeLastStep;
      this.t = now();

      /*  * uncomment this to debug
       * instant
      if @dataQ.length > 0
          @process(@dataQ.pop())
       */
      if (this.dataQ.length > 0) {
        timeLastStep = this.t - this.stepTime;
        expectedLastStep = 1000 / 16;
        difference = timeLastStep / expectedLastStep;
        if (difference > 1 - this.dataQ.length * 0.1) {
          this.process(this.dataQ.pop());
        }
      }

      /*  * uncomment this to debug
       * high jitter
      if @dataQ.length > 16
          timeLastStep = @t - @stepTime
          expectedLastStep = 1000/16
          faster = 0
          if @dataQ.length > 16
              faster = (@dataQ.length-16)
          console.log "difference", timeLastStep, expectedLastStep, @dataQ.length, faster
          if timeLastStep > expectedLastStep - faster
              @process(@dataQ.pop())
       */
      this.lastFrame += 1;
      a = this.lastFrame / this.avgFrame;
      this.smoothFactor = a;
      this.smoothStep = this.step + a;
      if (a > 1) {
        a = 1;
      }
      if (a < 0) {
        a = 0;
      }
      if (this.smoothFactor > 10) {
        this.smoothFactor = 10;
      }
      ref = this.things;
      for (id in ref) {
        thing = ref[id];
        thing.pos[0] = thing._pos2[0] + (thing._pos[0] - thing._pos2[0]) * a;
        thing.pos[1] = thing._pos2[1] + (thing._pos[1] - thing._pos2[1]) * a;
        angleDiff = angleBetween(thing._rot2, thing._rot);
        thing.rot = thing._rot2 + angleDiff * a;
        if (thing.parts != null) {
          ref1 = thing.parts;
          for (i = j = 0, len = ref1.length; j < len; i = ++j) {
            part = ref1[i];
            angleDiff = angleBetween(part._rot2, part._rot);
            part.rot = part._rot2 + angleDiff * a;
          }
        }
        if (thing.jump != null) {
          jumpDiff = thing._jump2 - thing._jump;
          thing.jump = thing._jump + jumpDiff * a;
          if (thing.jump >= thing._jump2) {
            thing._jump = thing.jump = thing._jump2;
          }
        }
      }
      ref2 = this.particles;
      for (id in ref2) {
        thing = ref2[id];
        thing.pos[0] = thing._pos2[0] + (thing._pos[0] - thing._pos2[0]) * a;
        thing.pos[1] = thing._pos2[1] + (thing._pos[1] - thing._pos2[1]) * a;
        angleDiff = angleBetween(thing._rot2, thing._rot);
        thing.rot = thing._rot2 + angleDiff * a;
      }
      return null;
    };

    Interpolator.prototype.replay = "off";

    Interpolator.prototype.recordReplay = function () {
      this.replay = "recording";
      return (this.replayFrames = []);
    };

    Interpolator.prototype.uploadReplay = function () {
      var data, frame;
      if (this.replay === "recording") {
        this.replay = "off";
        data = JSON.stringify(
          function () {
            var j, len, ref, results;
            ref = this.replayFrames;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              frame = ref[j];
              results.push(dv2str(frame));
            }
            return results;
          }.call(this)
        );
        localStorage.replay = data;
      }
    };

    Interpolator.prototype.playReplay = function () {
      var data, frame;
      this.players = [];
      this.things = {};
      this.particles = {};
      this.winningSide = null;
      this.replay = "playing";
      this.replayStep = 0;
      data = localStorage.replay;
      this.replayFrames = (function () {
        var j, len, ref, results;
        ref = JSON.parse(data);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          frame = ref[j];
          results.push(str2dv(frame));
        }
        return results;
      })();
      return (this.local = false);
    };

    Interpolator.prototype.recv = function (data) {
      this.dataQ.unshift(data);
      while (this.dataQ.length > 32) {
        this.process(this.dataQ.pop());
      }
      return stats.simAdd();
    };

    Interpolator.prototype.think = function () {};

    Interpolator.prototype.debugDraw = function () {
      var j, l, ref, ref1, results, x;
      for (x = j = 0, ref = this.prevWait; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
        baseAtlas.drawSprite("img/pip1.png", [20 + x * 40 - window.innerWidth, window.innerHeight - 120], [1, 1], 0, [0, 0, 0, 255]);
      }
      results = [];
      for (x = l = 0, ref1 = this.dataQ.length; 0 <= ref1 ? l < ref1 : l > ref1; x = 0 <= ref1 ? ++l : --l) {
        results.push(baseAtlas.drawSprite("img/pip1.png", [20 + x * 40 - window.innerWidth, window.innerHeight - 120], [1, 1], 0, [255, 255, 255, 255]));
      }
      return results;
    };

    Interpolator.prototype.process = function (data) {
      var _,
        dt,
        id,
        j,
        k,
        kv,
        l,
        len,
        len1,
        len2,
        len3,
        len4,
        len5,
        len6,
        len7,
        len8,
        n,
        newObj,
        newThing,
        number,
        o,
        p,
        part,
        player,
        q,
        r,
        ref,
        ref1,
        ref10,
        ref11,
        ref12,
        ref13,
        ref14,
        ref2,
        ref3,
        ref4,
        ref5,
        ref6,
        ref7,
        ref8,
        ref9,
        s,
        selection,
        t,
        thing,
        trail,
        u,
        unit,
        v,
        w,
        y,
        z;
      if (this.replay === "recording") {
        this.replayFrames.push(packet);
      }
      t = now();
      dt = t - this.stepTime;
      this.avgTime = this.avgTime * 0.9 + dt * 0.1;
      this.stepTime = t;
      this.avgFrame = this.avgFrame * 0.9 + this.lastFrame * 0.1;
      this.lastFrame = 0;
      if (intp.players.length === 0 && !data.fullUpdate && commander) {
        print("waiting for full update");
        return;
      }
      intp.advanceStep = 0;
      if (data.fullUpdate) {
        intp.step = data.step;
      } else if (data.step != null) {
        if (intp.step + 1 === data.step) {
          intp.step += 1;
          intp.advanceStep = 1;
        } else {
          print("Over step, what about full update?");
          return;
        }
      }
      if (data.winningSide) {
        intp.winningSide = data.winningSide;
        onecup.refresh();
      }
      if (data.state) {
        intp.state = data.state;
        onecup.refresh();
      }
      if (intp.state === "starting") {
        this.gameStarted();
      }
      if (intp.state === "ended") {
        this.gameEnded();
      }
      if (data.serverType) {
        intp.serverType = data.serverType;
        onecup.refresh();
      }
      if (data.theme) {
        intp.theme = data.theme;
      }
      if (intp.countDown === 5 * 16 && !sim.local) {
        onecup.refresh();
      }
      if (data.countDown != null) {
        intp.countDown = data.countDown;
        if (intp.countDown % 16 === 0 && intp.state === "waiting") {
          onecup.refresh();
        }
      }
      designMode.locked = intp.serverType === "1v1t" && intp.state === "running" && commander.side !== "spectators";
      if (data.perf) {
        intp.perf = data.perf;
        if (control.perf) {
          onecup.refresh();
        }
      }
      ref = intp.things;
      for (_ in ref) {
        thing = ref[_];
        v2.add(thing._pos, thing.vel);
        v2.set(thing.pos, thing._pos2);
        thing._rot2 = thing.rot;
        if (thing.parts != null) {
          ref1 = thing.parts;
          for (j = 0, len = ref1.length; j < len; j++) {
            part = ref1[j];
            part._rot2 = part.rot;
          }
        }
      }
      ref2 = intp.players;
      for (l = 0, len1 = ref2.length; l < len1; l++) {
        player = ref2[l];
        player._mouse = player.mouse;
      }
      if (data.things) {
        ref3 = data.things;
        for (o = 0, len2 = ref3.length; o < len2; o++) {
          t = ref3[o];
          thing = null;
          part = null;
          newObj = false;
          for (q = 0, len3 = t.length; q < len3; q++) {
            kv = t[q];
            (k = kv[0]), (v = kv[1]);
            switch (k) {
              case "thingId":
                thing = intp.things[v];
                if (!thing) {
                  thing = {
                    dummy: true,
                  };
                  newObj = true;
                }
                thing.id = v;
                part = null;
                newObj = false;
                break;
              case "spec":
                if (thing.dummy) {
                  newThing = new types[thing.name](v);
                  newThing.id = thing.id;
                  newThing.name = thing.name;
                  intp.things[newThing.id] = newThing;
                  thing = newThing;
                  newObj = true;
                }
                break;
              case "pos":
                if (newObj || thing._pos == null) {
                  thing.pos = v2.create(v);
                  thing._pos = v2.create(thing.pos);
                  thing._pos2 = v2.create(thing.pos);
                } else {
                  v2.set(v, thing._pos);
                }
                break;
              case "rot":
                if (newObj) {
                  thing.rot = v;
                  thing._rot = thing.rot;
                  thing._rot2 = thing.rot;
                  if (thing.weapons) {
                    ref4 = thing.weapons;
                    for (r = 0, len4 = ref4.length; r < len4; r++) {
                      w = ref4[r];
                      w.rot = thing.rot;
                      w._rot = thing.rot;
                      w._rot2 = thing.rot;
                    }
                  }
                } else {
                  thing._rot = v;
                }
                break;
              case "jump":
                thing._jump = thing._jump2 || v;
                thing.jump = thing._jump2 = v;
                break;
              case "dead":
                thing.dead = v;
                if (thing.dead) {
                  if (typeof thing.createDebree === "function") {
                    thing.createDebree();
                  }
                }
                break;
              case "partId":
                if (thing.parts) {
                  part = thing.parts[v];
                  newObj = false;
                } else {
                  part = {};
                }
                break;
              case "partWorking":
                part.working = v;
                break;
              case "partTargetId":
                part.targetId = v;
                break;
              case "orders":
                thing.orders = v;
                if (thing.preOrders) {
                  thing.preOrders = thing.preOrders.filter(function (order) {
                    return order.step + 16 * 5 < sim.step;
                  });
                }
                break;
              default:
                thing[k] = v;
            }
          }
        }
      }
      if (data.players) {
        ref5 = data.players;
        for (s = 0, len5 = ref5.length; s < len5; s++) {
          p = ref5[s];
          player = null;
          for (u = 0, len6 = p.length; u < len6; u++) {
            kv = p[u];
            (k = kv[0]), (v = kv[1]);
            if (k === "playerNumber") {
              while (intp.players.length <= v) {
                intp.players.push(new Player());
              }
              player = intp.players[v];
              player.number = v;
            } else {
              player[k] = v;
            }
            if ((k === "buildQ" || k === "validBar") && commander.name === player.name) {
              onecup.refresh();
            }
          }
        }
      }
      ref6 = intp.things;
      for (_ in ref6) {
        thing = ref6[_];
        if (thing.targetId) {
          thing.target = intp.things[thing.targetId];
        }
        if (thing.originId) {
          thing.origin = intp.things[thing.originId];
        }
      }
      ref7 = this.things;
      for (id in ref7) {
        thing = ref7[id];
        if (typeof thing.clientTick === "function") {
          thing.clientTick();
        }
        if (thing.dead) {
          delete this.things[id];
        }
      }
      ref8 = this.players;
      for (number = y = 0, len7 = ref8.length; y < len7; number = ++y) {
        player = ref8[number];
        if (typeof commander !== "undefined" && commander !== null && (player != null ? player.ai : void 0) === false && commander.name === (player != null ? player.name : void 0)) {
          if (player.side) {
            commander.side = player.side;
          }
          if (player.money) {
            commander.money = player.money;
          }
          if (player.selection) {
            commander.selection = player.selection;
          }
          if (player.buildQ) {
            commander.buildQ = player.buildQ;
          }
          if (player.validBar) {
            commander.validBar = player.validBar;
          }
          if (player.rallyPoint) {
            commander.rallyPoint = player.rallyPoint;
          }
          commander.number = number;
          if (player.host != null) {
            commander.host = player.host;
          }
        }
        if (!player.name) {
          player.name = "no name";
        }
        if (!player.side) {
          player.side = "spectators";
        }
        if (!player.color) {
          player.color = [255, 0, 0, 255];
        }
      }
      ref9 = this.particles;
      for (id in ref9) {
        thing = ref9[id];
        if (thing.dead) {
          delete this.particles[id];
          continue;
        }
        if (!thing._pos) {
          thing._pos = v2.create(thing.pos);
        }
        if (!thing._pos2) {
          thing._pos2 = v2.create(thing.pos);
        }
        v2.set(thing.pos, thing._pos2);
        thing._rot2 = thing.rot;
        if (this.advanceStep === 1) {
          if (typeof thing.tick === "function") {
            thing.tick();
          }
          if (typeof thing.move === "function") {
            thing.move();
          }
        }
        v2.set(thing.pos, thing._pos);
        thing._rot = thing.rot;
      }
      ref10 = this.trails;
      for (id in ref10) {
        trail = ref10[id];
        if (trail.trail.length === 0 && this.things[trail.parentId] == null) {
          delete this.trails[id];
        }
      }
      if (this.state === "starting") {
        this.focusMap();
        this.state = "running";
        onecup.refresh();
      }
      if (this.state === "ended") {
        this.state = "waiting";
        onecup.refresh();
        if (this.winningSide === false) {
          playSound("sounds/drone/draw.wav");
        } else if (this.winningSide === (typeof commander !== "undefined" && commander !== null ? commander.side : void 0)) {
          playSound("sounds/drone/victory.wav");
        } else {
          playSound("sounds/drone/defeat.wav");
        }
        onecup.refresh();
      }
      if ((ref11 = onecup.lookup("#money-text")) != null) {
        ref11.innerHTML = buildBar.moneyText();
      }
      if ((ref12 = onecup.lookup("#money-income")) != null) {
        ref12.innerHTML = buildBar.moneyIncomeText();
      }
      buildBar.updateUnitBubble();
      if (typeof commander !== "undefined" && commander !== null ? commander.selection : void 0) {
        selection = [];
        ref13 = commander.selection;
        for (n = z = 0, len8 = ref13.length; z < len8; n = ++z) {
          unit = ref13[n];
          thing = this.things[unit.id];
          if (thing) {
            selection.push(thing);
          }
        }
        commander.selection = selection;
      }
      if (localStorage.useAi === "true" && localStorage.aiGrid === "true") {
        if (ui.mode === "battle" && (typeof commander !== "undefined" && commander !== null ? ((ref14 = commander.selection) != null ? ref14.length : void 0) : void 0) > 0) {
          return onecup.refresh();
        }
      }
    };

    return Interpolator;
  })(window.Sim);
}.call(this));
