(function () {
  var DEBUG,
    _offset,
    _pos,
    _vel,
    isArray,
    validPoint,
    bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };

  DEBUG = 1;

  window.VERSION = 0;

  window.MINOR_VERSION = 1;

  _pos = v2.create();

  _vel = v2.create();

  _offset = v2.create();

  window.rand = function () {
    return Math.random() - 0.5;
  };

  window.rid = function () {
    return Math.random().toString(32).slice(2);
  };

  window.choose = function (list) {
    return list[Math.floor(Math.random() * list.length)];
  };

  window.shuffle = function (list) {
    var e, l, len1, ref, results;
    ref = (function () {
      var len1, m, results1;
      results1 = [];
      for (m = 0, len1 = list.length; m < len1; m++) {
        e = list[m];
        results1.push([Math.random(), e]);
      }
      return results1;
    })().sort();
    results = [];
    for (l = 0, len1 = ref.length; l < len1; l++) {
      e = ref[l];
      results.push(e[1]);
    }
    return results;
  };

  window.types = {};

  window.isFiniteV2Array = function (a) {
    return (Array.isArray(a) || a instanceof Float64Array) && a.length === 2 && Number.isFinite(a[0]) && Number.isFinite(a[1]);
  };

  isArray = function (a) {
    if (Array.isArray(a)) {
      return true;
    }
    if (a instanceof Float64Array) {
      return true;
    }
    return false;
  };

  window.simpleEquals = function (a, b) {
    var e, i, k, l, len1, v;
    if (a === b) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    if (a === void 0 || b === void 0) {
      return false;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (isArray(a) && isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }
      for (i = l = 0, len1 = a.length; l < len1; i = ++l) {
        e = a[i];
        if (!simpleEquals(e, b[i])) {
          return false;
        }
      }
      return true;
    }
    if (typeof a === "object") {
      for (k in a) {
        v = a[k];
        if (!simpleEquals(v, b[k])) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  window.otherSide = function (side) {
    if (side === "alpha") {
      return "beta";
    } else if (side === "beta") {
      return "alpha";
    } else {
      return "alpha";
    }
  };

  validPoint = function (pos) {
    if (typeof pos !== "object") {
      return [0, 0];
    }
    pos[0] = isNaN(pos[0]) ? 0 : Number(pos[0]);
    pos[1] = isNaN(pos[1]) ? 0 : Number(pos[1]);
    return pos;
  };

  window.Sim = (function () {
    Sim.prototype.ticksPerSec = 16;

    Sim.prototype.defaultMoney = 2000;

    Sim.prototype.gainsMoney = true;

    Sim.prototype.makeRocks = true;

    Sim.prototype.state = "waiting";

    Sim.prototype.serverType = "3v3";

    //Sim.prototype.countDown = 1;

    Sim.prototype.lastId = 0;

    Sim.prototype.costLimit = 1000;

    Sim.prototype.aiTestMode = false;

    Sim.prototype.nGamesPlayed = 0;

    Sim.prototype.validTypes = {
      //"sandbox": "sandbox",
      "1v1": "1v1",
      //"1v1r": "1v1r",
      //"1v1t": "1v1t",
      "2v2": "2v2",
      "3v3": "3v3",
      survival: "survival",
    };

    Sim.prototype.say = function (message, rootName) {
      server.say(message, rootName);
      /*
      if (typeof server !== "undefined" && server !== null) {
        return server.say(message);
      } else if (this.local) {
        return chat.lines.push({
          text: message,
          color: "FFFFFF",
          name: "Server",
          server: true,
          channel: "local",
          time: Date.now()
        });
      } else {
        return print(message);
      }
      */
    };

    Sim.prototype.sayToServer = function (key, ...args) {
      this.say(translate(key, this.serverLang, ...args));
    };

    Sim.prototype.sayToServerSpecify = function (rootName, key, ...args) {
      this.say(translate(key, this.serverLang, ...args), rootName);
    };

    Sim.prototype.getPlayerLang = function (name) {
      return playerLangSheet[name];
    };
    Sim.prototype.sayToPlayer = function (p, key, ...args) {
      var lang = this.serverLang;
      if (p instanceof Player) {
        lang = this.getPlayerLang(p.name) ?? "en";
      }
      this.say(translate(key, lang, ...args), p.ws.originRoot);
    };

    Sim.prototype.simTouched = false;

    Sim.prototype.touch = function () {
      if (!this.simTouched) {
        this.simTouched = true;
        this.clearNetState();
        console.log("sim touched");
      }
    };

    Sim.prototype.shouldBeDestroyed = function () {
      if (!sim.simTouched || sim.state !== "waiting") {
        return false;
      }
      for (var l = 0, len = this.players.length; l < len; l++) {
        var player = this.players[l];
        if (!player.ai && player.connected && !player.afk) {
          return false;
        }
      }
      return true;
    };

    Sim.prototype.nid = function () {
      var id;
      id = this.lastId;
      this.lastId += 1;
      return id;
    };

    function Sim() {
      this.victoryConditions = bind(this.victoryConditions, this);
      this.local = false;
      this.players = [];
      this.step = 0;
      this.timeDelta = 0;
      this.winningSide = null;
      this.numBattles = 0;
      this.unitSpaces = {};
      this.projSpaces = {};
      this.zJson = new window.ZJson(prot.commonWords);
      this.timeings = {};
      this.timeStarts = {};
      this.timePath = [];
    }

    Sim.prototype.start = function () {
      var key, p, ref;
      this.net = {};
      this.step = 0;
      this.timeDelta = 0;
      this.winningSide = null;
      this.lastId = 0;
      this.counting = 0;
      this.generateMap();
      if (this.players == null) {
        this.players = {};
      } else {
        ref = this.players;
        for (key in ref) {
          p = ref[key];
          if (p && p.connected) {
            p.reset();
            this.validateBuildBar(p);
          }
        }
      }
      this.winningSide = null;
      this.state = "starting";
      this.regenerateMap();
      this.captures = 0;
      this.deaths = 0;
      this.nGamesPlayed += 1;
      this.clearNetState();
      this.sayToServer("sim.seed_report", this.mapSeed);
      if (this.serverType === "survival") {
        return survival.start(this);
      }
    };

    Sim.prototype.configGame = function (p, config) {
      var l, len1, player, ref;
      print("config game!", config);
      if (this.state !== "waiting") {
        print("Can't set config on game in progress");
        return;
      }
      if (!p.host) {
        print("Can't set config when not a host");
        return;
      }
      if (!this.local) {
        ref = this.players;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          player = ref[l];
          if (player.host) {
            continue;
          }
          player.side = "spectators";
          if (player.ai) {
            player.connected = false;
          }
        }
      }
      if (!this.validTypes[config.type]) {
        print("Config type is not valid");
        return;
      }
      if (this.serverType !== config.type) {
        this.serverType = config.type;
        this.sayToServer("players.config_game", p.name, type);
        if (typeof serverTick === "function") {
          serverTick();
        }
      }
    };

    Sim.prototype.playersPerTeam = function () {
      if (this.serverType.slice(0, 3) === "1v1") {
        return 1;
      }
      if (this.serverType === "2v2") {
        return 2;
      }
      if (this.serverType === "3v3") {
        return 3;
      }
      return 3;
    };

    Sim.prototype.generateMap = function (mapScale, numComPoints, mapSeed) {
      this.mapScale = mapScale != null ? mapScale : 1.5;
      this.numComPoints = numComPoints != null ? numComPoints : 8;
      this.mapSeed = mapSeed;
      this.numRocks = 60 * this.mapScale;
      return this.regenerateMap();
    };

    Sim.prototype.regenerateMap = function () {
      if (this.mapSeed == null) {
        this.mapSeed = Math.floor(Math.random() * 4294967295);
      }
      print("Map seed: " + this.mapSeed);
      return mapping.generate(this.mapSeed);
    };

    Sim.prototype.playerJoin = function (_, pid, name, color, buildBar, aiRules, ai, update) {
      var dcIndex, i, l, len1, len2, m, p, player, ref, ref1;
      if (ai == null) {
        ai = false;
      }
      if (update == null) {
        update = true;
      }
      print("playerJoin", pid, name, color);
      ref = this.players;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        p = ref[l];
        if (p.id === pid) {
          player = p;
          break;
        }
      }
      if (!player) {
        player = new Player(pid);
        player.streek = 0;
        if (this.local) {
          player.side = "alpha";
        } else {
          player.side = "spectators";
        }
        dcIndex = null;
        ref1 = this.players;
        for (i = m = 0, len2 = ref1.length; m < len2; i = ++m) {
          p = ref1[i];
          if (!p.connected && p.side === "spectators") {
            dcIndex = i;
          }
        }
        if (dcIndex === null) {
          player.number = this.players.length;
          this.players.push(player);
        } else {
          player.number = dcIndex;
          this.players[dcIndex] = player;
        }
        if (this.local) {
          this.clearNetState();
        }
      } else if (update) {
        this.clearNetState();
      }
      this.playerEdit(_, pid, name, color, buildBar, aiRules, ai);
      player.lastActiveTime = Date.now();
      player.afk = false;
      return player;
    };

    Sim.prototype.playerEdit = function (_, pid, name, color, buildBar, aiRules, ai) {
      var canEditShips, i, l, len1, m, o, p, player, ref;
      ref = this.players;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        p = ref[l];
        if (p.id === pid) {
          player = p;
          break;
        }
      }
      player.name = name;
      player.color = colors.validate(color);
      player.color[3] = 255;
      player.ai = ai;
      player.aiRules = aiRules;
      if (!player.buildBar) {
        player.buildBar = (function () {
          var m, results;
          results = [];
          for (i = m = 0; m < 10; i = ++m) {
            results.push([]);
          }
          return results;
        })();
      }
      if (!player.validBar) {
        player.validBar = (function () {
          var m, results;
          results = [];
          for (i = m = 0; m < 10; i = ++m) {
            results.push(false);
          }
          return results;
        })();
      }
      player.connected = true;
      if (this.serverType === "1v1t" && this.state !== "waiting" && player.side !== "spectators") {
        for (i = m = 0; m < 10; i = ++m) {
          if (json.dumps(player.buildBar[i]) !== json.dumps(buildBar[i]) && player.side !== "spectators") {
            print("---");
            print(json.dumps(player.buildBar[i]));
            print(json.dumps(buildBar[i]));
          }
        }
        canEditShips = false;
      } else {
        canEditShips = true;
      }
      if (canEditShips) {
        for (i = o = 0; o < 10; i = ++o) {
          player.buildBar[i] = buildBar[i] || null;
        }
        this.validateBuildBar(player);
      }
      player.actions += 1;
      return player;
    };

    Sim.prototype.switchSide = function (player, side) {
      if (!player) {
        return;
      }
      if (player.kickTime > now() - 15000) {
        return;
      }
      if (this.local && !this.galaxyStar && !this.challenge) {
        player.side = side;
        return;
      }
      if (side !== "spectators" && this.numInTeam(side) >= this.playersPerTeam()) {
        return;
      }
      if (this.state !== "waiting") {
        return;
      }
      player.side = side;
      if (side === "spectators") {
        player.streek = 0;
      }
      return (player.lastActiveTime = Date.now());
    };

    Sim.prototype.whoIsHost = function () {
      var haveHost, l, len1, len2, m, p, ref, ref1;
      haveHost = false;
      ref = this.players;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        p = ref[l];
        if (p.host === true && !mxserver.isSuperUser(p)) {
          if (!p.connected || p.side === "spectators") {
            p.host = false;
            haveHost = false;
            break;
          } else {
            haveHost = true;
            break;
          }
        }
      }

      for (l = 0, len1 = ref.length; l < len1; l++) {
        p = ref[l];
        if (mxserver.isSuperUser(p)) {
          p.host = true;
          if (p.connected && p.side !== "spectators") {
            haveHost = true;
          }
          break;
        }
      }

      if (!haveHost) {
        ref1 = this.players;
        for (m = 0, len2 = ref1.length; m < len2; m++) {
          p = ref1[m];
          if (!p.ai && p.connected && p.side !== "spectators" && !mxserver.isSuperUser(p)) {
            p.host = true;
            break;
          }
        }
      }
    };

    Sim.prototype.addAi = function (player, name, side, aiBuildBar) {
      var l, len1, numAi, p, ref, total;
      print("addAI", name, side);
      if (!this.local) {
        if (this.noAIPlayers) {
          return;
        }
        if (side != "alpha" && side != "beta") {
          return;
        }
        if (this.serverType === "1v1r") {
          return;
        }
        if (this.serverType === "1v1t") {
          return;
        }
        if (this.serverType === "1v1") {
          return;
        }
        if (this.numInTeam(side) >= this.playersPerTeam()) {
          print("enough players in team");
          return;
        }
        if (this.state !== "waiting") {
          return;
        }
        total = this.playersPerTeam() * 2;
        numAi = 0;
        ref = this.players;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          p = ref[l];
          if (p.ai && p.connected && p.side !== "spectators") {
            numAi += 1;
          }
        }
        if (numAi === total - 1) {
          print("All players can't be AI");
          return;
        }
      }
      this.sayToServer("players.addai", player.name, name, side);
      return ais.useAiFleet(name, side, aiBuildBar);
    };

    Sim.prototype.kickPlayer = function (p, number) {
      var player;
      if (this.state !== "waiting") {
        return;
      }
      if (!p.host) {
        return;
      }
      player = this.players[number];
      if (player && player.side !== "spectators") {
        var oldSide = player.side;
        if (player.host && !mxserver.isSuperUser(player) && mxserver.isSuperUser(p) && p.side !== "spectator") {
          player.host = false;
          return;
        }

        player.side = "spectators";
        if (!mxserver.isSuperUser(player)) {
          player.kickTime = now();
        }
        if (player.ai) {
          player.connected = false;
        }
        this.sayToServer("players.kicked_from_team", p.name, player.name, oldSide);
      }
    };

    Sim.prototype.kickAllAis = function () {
      var l, len1, player, ref, results;
      if (this.aiTestMode) {
        return;
      }
      ref = this.players;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        player = ref[l];
        if (player.ai) {
          player.connected = false;
          results.push((player.side = "spectators"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Sim.prototype.startGame = function (player, real) {
      if (real == null) {
        real = false;
      }
      /*
      if (this.local) {
        if (this.numInTeam("alpha") === 0 || this.numInTeam("beta") === 0) {
          this.say("Warning: One team has no players. You should add an AI to that team.");
        }
        this.start();
        return;
      }
      */
      if (!player.host) {
        print("A non-host player is trying to start game.");
        return;
      }
      if (this.state !== "waiting") {
        print("Trying to start a game when a game is already in progress. State:", this.state);
        return;
      }
      if (!this.canStart(true)) {
        return;
      }
      this.sayToServer("sim.starting_game");
      return (this.countDown = this.serverType === "sandbox" ? 1 : 16 * 6);
    };

    Sim.prototype.canStart = function (sayStyff) {
      if (sayStyff == null) {
        sayStyff = false;
      }
      if (this.serverType === "survival") {
        return survival.canStart(this);
      }
      if (this.serverType === "sandbox") {
        return true;
      }
      if (this.numInTeam("alpha") !== this.playersPerTeam()) {
        if (sayStyff) {
          this.sayToServer("sim.starting_rejected.team_missing_players", "alpha");
        }
        return false;
      }
      if (this.numInTeam("beta") !== this.playersPerTeam()) {
        if (sayStyff) {
          this.sayToServer("sim.starting_rejected.team_missing_players", "beta");
        }
        return false;
      }
      return true;
    };

    Sim.prototype.validateBuildBar = function (player) {
      var i, l, len1, ref, spec;
      ref = player.buildBar;
      for (i = l = 0, len1 = ref.length; l < len1; i = ++l) {
        spec = ref[i];
        player.validBar[i] = validSpec(player, spec);
      }
    };

    Sim.prototype.moveOrder = function (player, points, additive, orderId) {
      var l, len1, n, ref, results, u;
      if (!player) {
        return;
      }
      if (this.aiOnly) {
        return;
      }
      player.actions += 1;
      n = 0;
      ref = player.selection;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        u = ref[l];
        if (u != null && u.owner === player.number && !u.dead) {
          u.giveOrder(
            {
              id: orderId,
              type: "Move",
              dest: validPoint(points[n]),
              range: 0,
            },
            additive
          );
          n += 1;
          if (n === points.length) {
            n = points.length - 1;
          }
          results.push((u.underPlayerControl = true));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Sim.prototype.followOrder = function (player, unitId, additive, orderId) {
      var l, len1, ref, results, u;
      if (!player) {
        return;
      }
      if (this.aiOnly) {
        return;
      }
      player.actions += 1;
      ref = player.selection;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        u = ref[l];
        if (u.owner === player.number) {
          u.giveOrder(
            {
              id: orderId,
              type: "Follow",
              targetId: unitId,
              noFinish: true,
            },
            additive
          );
          results.push((u.underPlayerControl = true));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Sim.prototype.stopOrder = function (player, additive) {
      var l, len1, ref, results, u;
      if (!player) {
        return;
      }
      if (this.aiOnly) {
        return;
      }
      player.actions += 1;
      ref = player.selection;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        u = ref[l];
        if (u.owner === player.number) {
          results.push(u.stopAndClearOrders());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Sim.prototype.holdPositionOrder = function (player, additive) {
      var l, len1, len2, m, ref, ref1, results, someHolding, u;
      if (!player) {
        return;
      }
      if (this.aiOnly) {
        return;
      }
      player.actions += 1;
      someHolding = false;
      ref = player.selection;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        u = ref[l];
        if (u.owner === player.number && u.holdPosition) {
          someHolding = true;
          break;
        }
      }
      ref1 = player.selection;
      results = [];
      for (m = 0, len2 = ref1.length; m < len2; m++) {
        u = ref1[m];
        if (u.owner === player.number) {
          if (someHolding) {
            results.push((u.holdPosition = false));
          } else {
            results.push((u.holdPosition = !u.holdPosition));
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Sim.prototype.selfDestructOrder = function (player, additive) {
      var l, len1, ref, results, u;
      if (!player) {
        return;
      }
      if (this.aiOnly) {
        return;
      }
      player.actions += 1;
      ref = player.selection;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        u = ref[l];
        if (u.owner === player.number) {
          results.push(u.selfDestruct());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Sim.prototype.setRallyPoint = function (player, point) {
      if (!player) {
        return;
      }
      return (player.rallyPoint = validPoint(point));
    };

    Sim.prototype.buildUnit = function (pid, number, pos) {
      var _, _where, l, len1, player, ref, ref1, spec, totalUnits, u, unit, w;
      player = this.players[pid];
      if (!player) {
        return;
      }
      if (!player.validBar[number]) {
        return;
      }
      totalUnits = 0;
      ref = this.things;
      for (_ in ref) {
        u = ref[_];
        if (u.unit && u.owner === player.number) {
          totalUnits += 1;
        }
      }
      if (totalUnits >= 100) {
        return;
      }
      spec = player.buildBar[number];
      if (player.money < specCost(spec)) {
        return;
      }
      player.actions += 1;
      unit = new types.Unit(spec);
      unit.owner = player.number;
      unit.side = player.side;
      unit.color = player.color.slice(0);
      unit.number = number;
      player.money -= unit.cost;
      this.things[unit.id] = unit;
      if (pos) {
        v2.set(pos, unit.pos);
        unit.rot = v2.angle(unit.pos) + Math.PI;
        ref1 = unit.weapons;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          w = ref1[l];
          w.rot = unit.rot;
        }
      }
      if (player.rallyPoint != null) {
        _where = [0, 0];
        v2.sub(player.rallyPoint, unit.pos, _where);
        unit.rot = v2.angle(_where);
      }
      return unit;
    };

    Sim.prototype.placeUnit = function (pid, name, pos) {
      var cls, player;
      player = this.players[pid];
      if (!player) {
        return;
      }
      cls = types[name];
      if (this.canBuildHere(pos, player.side, cls)) {
        return this.buildUnit(pid, name, pos);
      }
    };

    Sim.prototype.buildRq = function (player, name, number) {
      var i, l, len, m, n, ref, ref1;
      if (!player) {
        return;
      }
      if (number > 0) {
        for (i = l = 0, ref = number; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
          if (player.buildQ.length >= 1000) {
            break;
          }
          player.buildQ.push(name);
        }
      } else if (number < 0) {
        len = player.buildQ.length;
        for (i = m = ref1 = len - 1; ref1 <= -1 ? m < -1 : m > -1; i = ref1 <= -1 ? ++m : --m) {
          if (player.buildQ[i] === name) {
            player.buildQ[i] = null;
            number += 1;
            if (number === 0) {
              break;
            }
          }
        }
        player.buildQ = (function () {
          var len1, o, ref2, results;
          ref2 = player.buildQ;
          results = [];
          for (o = 0, len1 = ref2.length; o < len1; o++) {
            n = ref2[o];
            if (n !== null) {
              results.push(n);
            }
          }
          return results;
        })();
      }
    };

    Sim.prototype.findSpawnPoint = function (side) {
      var _, ref, unit;
      ref = this.things;
      for (_ in ref) {
        unit = ref[_];
        if (unit.spawn === side) {
          return unit;
        }
      }
    };

    Sim.prototype.canBuildHere = function (pos, side, cls) {
      var _, dist, inRange, ref, unit;
      inRange = false;
      ref = this.things;
      for (_ in ref) {
        unit = ref[_];
        if (unit.unit || unit.commandPoint) {
          dist = v2.distance(pos, unit.pos);
          if (unit.unit) {
            if (dist < unit.radius + cls.prototype.radius) {
              return false;
            }
          }
          if (unit.commandPoint) {
            if (unit.side === side && dist < unit.radius) {
              inRange = true;
            }
          }
        }
      }
      return inRange;
    };

    Sim.prototype.mouseMove = function (player, pos, action) {
      if (!player) {
        return;
      }
      player.lastActiveTime = Date.now();
      v2.set(pos, player.mouse);
      return (player.action = action);
    };

    Sim.prototype.playerSelected = function (player, selection) {
      var id, l, len1, ref, ref1, results, t, u;
      if (!player) {
        return;
      }
      ref = player.selection;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        u = ref[l];
        if (u.owner === player.number) {
          u.underPlayerControl = false;
        }
      }
      player.selection = [];
      ref1 = this.things;
      results = [];
      for (id in ref1) {
        t = ref1[id];
        results.push(
          (function () {
            var len2, m, results1;
            results1 = [];
            for (m = 0, len2 = selection.length; m < len2; m++) {
              id = selection[m];
              if (t.id === id) {
                results1.push(player.selection.push(t));
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })()
        );
      }
      return results;
    };

    Sim.prototype.surrender = function (player) {
      if (!player) {
        return;
      }
      if (this.winningSide) {
        return;
      }
      if (this.state !== "running") {
        return;
      }
      if (player.side === "beta") {
        this.winningSide = "alpha";
      } else if (player.side === "alpha") {
        this.winningSide = "beta";
      } else {
        return;
      }
      this.sayToServer("players.surrenders", player.name);
      return this.endOfGame();
    };

    Sim.prototype.checkAfkPlayers = function () {
      var l, len1, player, ref, results;
      ref = this.players;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        player = ref[l];
        if (player.ai) {
          if (player.side !== "spectators") {
            player.afk = false;
            player.connected = true;
          }
        } else if (!player.connected) {
          player.afk = true;
        } else if (player.lastActiveTime < Date.now() - 1000 * 60 * 10) {
          if (this.serverType !== "1v1r" && this.serverType !== "1v1rt") {
            player.afk = true;
          }
        } else {
          this.touch();
          player.afk = false;
        }
      }
      return results;
    };

    Sim.prototype.numInTeam = function (side) {
      var l, len1, num, player, ref;
      num = 0;
      ref = this.players;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        player = ref[l];
        if (player.side === side) {
          num += 1;
        }
      }
      return num;
    };

    Sim.prototype.startingSim = function () {
      if (this.state === "starting") {
        this.state = this.serverType === "sandbox" ? "waiting" : "running";
      }
      if (this.state === "ended") {
        this.state = "waiting";
      }
      if (this.countDown > 0) {
        this.countDown -= 1;
        if (!this.canStart(true)) {
          this.state = "waiting";
          this.countDown = 0;
          return;
        }
        if (this.countDown === 0) {
          this.start();
        }
      }
      if (this.state === "waiting" && this.serverType === "1v1r" && this.canStart() && !this.countDown) {
        this.sayToServer("mode.rank.challenger_appears");
        return (this.countDown = 16 * 6);
      }
    };

    Sim.prototype.simulate = function () {
      var id, l, len1, len2, m, player, ref, ref1, ref2, ref3, ref4, ref5, t, thing;
      this.timeStart("sim");
      this.step += 1;
      this.startingSim();
      this.checkAfkPlayers();
      this.whoIsHost();
      this.timeIt(
        "spacesRebuild",
        (function (_this) {
          return function () {
            return _this.spacesRebuild();
          };
        })(this)
      );
      this.units = [
        function () {
          var ref, results;
          ref = this.things;
          results = [];
          for (id in ref) {
            t = ref[id];
            if (t.unit) {
              results.push(t);
            }
          }
          return results;
        }.call(this),
      ];
      this.bullets = [
        function () {
          var ref, results;
          ref = this.things;
          results = [];
          for (id in ref) {
            t = ref[id];
            if (t.bullet) {
              results.push(t);
            }
          }
          return results;
        }.call(this),
      ];
      this.commandPoint = [
        function () {
          var ref, results;
          ref = this.things;
          results = [];
          for (id in ref) {
            t = ref[id];
            if (t.bullet) {
              results.push(t);
            }
          }
          return results;
        }.call(this),
      ];
      this.timeStart("death");
      ref = this.things;
      for (id in ref) {
        thing = ref[id];
        if (thing.dead) {
          if (typeof thing.postDeath === "function") {
            thing.postDeath();
          }
          delete this.things[id];
        }
      }
      this.timeEnd("death");
      this.timeStart("tick");
      ref1 = this.things;
      for (id in ref1) {
        thing = ref1[id];
        if (typeof thing.tick === "function") {
          thing.tick();
        }
      }
      this.timeEnd("tick");
      this.timeStart("move");
      ref2 = this.things;
      for (id in ref2) {
        thing = ref2[id];
        if (typeof thing.move === "function") {
          thing.move();
        }
      }
      this.timeEnd("move");
      this.timeIt(
        "unitsCollide",
        (function (_this) {
          return function () {
            return _this.unitsCollide();
          };
        })(this)
      );
      if (this.state === "running" || this.serverType === "sandbox") {
        ref3 = this.players;
        for (l = 0, len1 = ref3.length; l < len1; l++) {
          player = ref3[l];
          if (player.side === "alpha" || player.side === "beta") {
            player.tick();
          }
        }
      }
      ref4 = this.players;
      for (m = 0, len2 = ref4.length; m < len2; m++) {
        player = ref4[m];
        if (this.state !== "running" && player.afk) {
          player.side = "spectators";
        }
        if (player.side === null) {
          player.side = "spectators";
        }
      }
      if (this.serverType === "survival") {
        survival.simulate(this);
        survival.victoryConditions(this);
      } else {
        this.victoryConditions();
        if (typeof this.extra === "function") {
          this.extra();
        }
        if ((ref5 = this.galaxyStar) != null) {
          if (typeof ref5.tick === "function") {
            ref5.tick();
          }
        }
      }

      stillThere = false;
      hasAIplayer = false;
      ref1 = this.players;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        player = ref1[l];
        if (player.ai) {
          hasAIplayer = true;
        }
        if (!player.ai && player.connected && !player.afk && player.side !== "spectators") {
          stillThere = true;
        }
      }
      if (!stillThere) {
        if (hasAIplayer) {
          this.kickAllAis();
        }
        if (false && this.serverType !== "sandbox") {
          this.serverType = "sandbox";
          this.start();
        } else {
          ref = this.things;
          for (id in ref) {
            thing = ref[id];
            if (thing.unit) {
              thing.selfDestruct();
            } else if (thing.bullet) {
              thing.explode = false;
              thing.life = thing.maxLife;
            }
          }
        }
      }

      return this.timeEnd("sim");
    };

    Sim.prototype.spacesRebuild = function () {
      var _, ref, results, t;
      this.unitSpaces = {
        alpha: new HSpace(500),
        beta: new HSpace(500),
      };
      this.bulletSpaces = {
        alpha: new HSpace(100),
        beta: new HSpace(100),
      };
      ref = this.things;
      results = [];
      for (_ in ref) {
        t = ref[_];
        if (t.dead) {
          continue;
        }
        if (t.unit) {
          this.unitSpaces[t.side].insert(t);
        }
        if (t.bullet) {
          results.push(this.bulletSpaces[t.side].insert(t));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Sim.prototype.victoryConditions = function () {
      var capped, cappedArr, id, k, l, len1, player, ref, ref1, stillThere, thing;
      if (this.state !== "running") {
        return;
      }
      capped = {};
      ref = this.things;
      for (id in ref) {
        thing = ref[id];
        if (thing.commandPoint) {
          capped[thing.side] = (capped[thing.side] || 0) + 1;
        }
      }
      cappedArr = (function () {
        var results;
        results = [];
        for (k in capped) {
          results.push(k);
        }
        return results;
      })();
      if (cappedArr.length === 0) {
        return;
      }
      if (cappedArr.length === 1 && cappedArr[0] !== "neutral") {
        this.winningSide = cappedArr[0];
      }
      if (this.winningSide) {
        this.endOfGame();
        return;
      }
      if (!this.local && !this.aiTestMode) {
        stillThere = false;
        ref1 = this.players;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          player = ref1[l];
          if (!player.ai && player.connected && !player.afk && player.side !== "spectators") {
            stillThere = true;
          }
        }
        if (!stillThere) {
          this.sayToServer("sim.end_of_game.empty_teams");
          this.winningSide = false;
          this.endOfGame();
        } else if (this.step > 16 * 60 * 30) {
          this.winningSide = false;
          this.endOfGame();
        }
      }
    };

    Sim.prototype.endOfGame = function () {
      var l, len1, player, ref;
      if (this.winningSide) {
        this.sayToServer("sim.gamereport.winner", this.winningSide);
      } else {
        this.sayToServer("sim.gamereport.draw");
      }
      this.sayToServer("sim.gamereport.timer_legacy", parseTime(this.step / 16));
      this.numBattles += 1;
      if (this.numBattles > 100) {
        this.awaitRestart = true;
      }
      if (typeof this.sendGameReport === "function") {
        this.sendGameReport();
      }
      if (this.serverType === "1v1r") {
        ref = this.players;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          player = ref[l];
          if (player.side !== "spectators") {
            if (player.side === this.winningSide) {
              player.streek += 1;
              if (player.streek === 1) {
                this.sayToServer("mode.rank.win_streek_one", player.name);
              } else {
                this.sayToServer("mode.rank.win_streek", player.name, player.streek);
              }
              player.host = true;
            } else {
              player.side = "spectators";
              player.host = false;
              player.streek = 0;
              if (this.winningSide) {
                this.sayToServer("mode.rank.lost_kicked", player.name);
              }
              player.kickTime = now();
            }
          }
        }
      }
      if (this.serverType === "survival") {
        survival.endOfGame(this);
      }
      this.state = "ended";
    };

    Sim.prototype.unitsCollide = function () {
      var _push, distance, force, i, j, k, l, len1, missles, n, ratio, results, t, u, u2, units;
      n = this.step % 2;
      units = function () {
        var ref, results;
        ref = this.things;
        results = [];
        for (k in ref) {
          t = ref[k];
          if (t.unit && !t.fixed && t.active) {
            results.push(t);
          }
        }
        return results;
      }.call(this);
      units.sort(function (a, b) {
        return a.pos[n] - b.pos[n];
      });
      this.axisSort = n;
      this.axisSortedUnits = units;
      missles = function () {
        var ref, results;
        ref = this.things;
        results = [];
        for (k in ref) {
          t = ref[k];
          if (t.missile) {
            results.push(t);
          }
        }
        return results;
      }.call(this);
      missles.sort(function (a, b) {
        return a.pos[n] - b.pos[n];
      });
      this.axisSortedMissles = missles;
      results = [];
      for (i = l = 0, len1 = units.length; l < len1; i = ++l) {
        u = units[i];
        results.push(
          (function () {
            var m, results1;
            results1 = [];
            for (j = m = -4; m <= 4; j = ++m) {
              u2 = units[i + j];
              if (j !== 0 && u2) {
                v2.sub(u.pos, u2.pos, _offset);
                distance = v2.mag(_offset);
                if (distance < 0.001) {
                  _offset = [0, -1];
                  distance = 1;
                }
                if (distance < u.radius + u2.radius) {
                  force = u.radius + u2.radius - distance;
                  ratio = u2.mass / (u.mass + u2.mass);
                  _push = v2.create();
                  v2.scale(_offset, ((ratio * force) / distance) * 0.02, _push);
                  v2.add(u.pos, _push);
                  v2.scale(_offset, ((-(1 - ratio) * force) / distance) * 0.02, _push);
                  results1.push(v2.add(u2.pos, _push));
                } else {
                  results1.push(void 0);
                }
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })()
        );
      }
      return results;
    };

    Sim.prototype.thingFields = [
      "onOrderId",
      "holdPosition",
      "hp",
      "energy",
      "shield",
      "cloak",
      "burn",
      "dead",
      "radius",
      "size",
      "rot",
      "image",
      "warpIn",
      "jump",
      "side",
      "owner",
      "capping",
      "aoe",
      "damage",
      "life",
      "maxLife",
      "turretNum",
      "targetPos",
      "hitPos",
    ];

    Sim.prototype.playerFields = [
      "name",
      "side",
      "afk",
      "host",
      "money",
      "connected",
      "dead",
      "color",
      "mouse",
      "action",
      "buildQ",
      "validBar",
      "ai",
      "apm",
      "capps",
      "kills",
      "unitsBuilt",
      "moneyEarned",
      "rallyPoint",
    ];

    Sim.prototype.simFields = ["serverType", "step", "theme", "state", "winningSide", "countDown"];

    Sim.prototype.send = function () {
      var _,
        changes,
        data,
        e,
        f,
        i,
        id,
        l,
        len1,
        len2,
        len3,
        len4,
        len5,
        len6,
        len7,
        len8,
        m,
        o,
        p,
        packet,
        part,
        partId,
        player,
        predictable,
        q,
        r,
        ref,
        ref1,
        ref10,
        ref11,
        ref12,
        ref13,
        ref2,
        ref3,
        ref4,
        ref5,
        ref6,
        ref7,
        ref8,
        ref9,
        s,
        send,
        splayers,
        sthings,
        t,
        targetId,
        thing,
        v,
        x,
        y,
        z;
      this.timeStart("send");
      this.timeStart("things");
      sthings = [];
      ref = this.things;
      for (id in ref) {
        thing = ref[id];
        changes = [];
        changes.push(["thingId", thing.id]);
        if (thing.net == null) {
          thing.net = s = {};
          changes.push(["name", thing.constructor.name]);
          changes.push(["spec", thing.spec]);
          changes.push(["color", thing.color]);
          changes.push(["z", thing.z]);
        } else if (thing["static"]) {
          continue;
        } else {
          s = thing.net;
        }
        ref1 = this.thingFields;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          f = ref1[l];
          v = thing[f];
          if (v != null && !simpleEquals(s[f], v)) {
            if (isArray(v)) {
              if (s.length !== v.length) {
                s[f] = new Array(v.length);
              }
              for (i = m = 0, len2 = v.length; m < len2; i = ++m) {
                e = v[i];
                s[f][i] = e;
              }
            } else {
              s[f] = v;
            }
            changes.push([f, v]);
          }
        }
        predictable = false;
        if (s.vel != null && s.pos != null) {
          v2.add(s.pos, s.vel, _pos);
          if (v2.distance(_pos, thing.pos) < 0.1) {
            v2.set(_pos, s.pos);
            predictable = true;
          }
        }
        if (!predictable) {
          if (s.vel == null) {
            s.vel = v2.create();
          }
          if (s.pos == null) {
            s.pos = v2.create();
          }
          v2.set(thing.vel, s.vel);
          v2.set(thing.pos, s.pos);
          changes.push(["vel", thing.vel]);
          changes.push(["pos", thing.pos]);
        }
        if (s.targetId !== ((ref2 = thing.target) != null ? ref2.id : void 0)) {
          s.targetId = (ref3 = thing.target) != null ? ref3.id : void 0;
          changes.push(["targetId", s.targetId]);
        }
        if (s.originId !== ((ref4 = thing.origin) != null ? ref4.id : void 0)) {
          s.originId = (ref5 = thing.origin) != null ? ref5.id : void 0;
          changes.push(["originId", s.originId]);
        }
        if (s.followId !== ((ref6 = thing.follow) != null ? ref6.id : void 0)) {
          s.followId = (ref7 = thing.follow) != null ? ref7.id : void 0;
          changes.push(["followId", s.followId]);
        }
        if (this.local) {
          if (s.message !== thing.message) {
            s.message = thing.message;
            changes.push(["message", s.message]);
          }
        }
        if (thing.parts != null) {
          ref8 = thing.parts;
          for (partId = o = 0, len3 = ref8.length; o < len3; partId = ++o) {
            part = ref8[partId];
            changes.push(["partId", partId]);
            s = part.net;
            if (!s) {
              part.net = s = {};
            }
            if (part.working != null && s.working !== part.working) {
              changes.push(["partWorking", part.working]);
              s.working = part.working;
            }
            if (part.weapon) {
              targetId = ((ref9 = part.target) != null ? ref9.id : void 0) || 0;
              if (s.targetId !== targetId) {
                changes.push(["partTargetId", targetId]);
                s.targetId = targetId;
              }
            }
            if (changes[changes.length - 1][0] === "partId") {
              changes.pop();
            }
          }
        }
        if (changes.length > 1) {
          sthings.push(changes);
        }
      }
      this.timeEnd("things");
      this.timeStart("players");
      splayers = [];
      ref10 = this.players;
      for (q = 0, len4 = ref10.length; q < len4; q++) {
        player = ref10[q];
        changes = [];
        changes.push(["playerNumber", player.number]);
        if (player.net == null) {
          player.net = s = {};
        } else {
          s = player.net;
        }
        ref11 = this.playerFields;
        for (r = 0, len5 = ref11.length; r < len5; r++) {
          f = ref11[r];
          v = player[f];
          if (v != null && !simpleEquals(s[f], v)) {
            if (isArray(v)) {
              if (s.length !== v.length) {
                s[f] = new Array(v.length);
              }
              for (i = x = 0, len6 = v.length; x < len6; i = ++x) {
                e = v[i];
                s[f][i] = e;
              }
            } else {
              s[f] = v;
            }
            changes.push([f, v]);
          }
        }
        if (changes.length > 1) {
          splayers.push(changes);
        }
      }
      this.timeEnd("players");
      this.timeStart("other");
      data = {};
      s = this.net;
      if (!s) {
        this.net = s = {};
      }
      ref12 = this.simFields;
      for (y = 0, len7 = ref12.length; y < len7; y++) {
        f = ref12[y];
        if (!simpleEquals(s[f], this[f])) {
          data[f] = this[f];
          s[f] = this[f];
        }
      }
      if (splayers.length > 0) {
        data.players = splayers;
      }
      if (sthings.length > 0) {
        data.things = sthings;
      }
      if (this.fullUpdate) {
        data.fullUpdate = true;
        this.fullUpdate = false;
      }
      if (this.step % 16 === 0) {
        send = false;
        ref13 = this.players;
        /*
        for (z = 0, len8 = ref13.length; z < len8; z++) {
          player = ref13[z];
          if (player.name === "treeform" && player.connected) {
            send = true;
          }
        }
        */
        if (true || send) {
          data.perf = {
            numbers: {
              things: function () {
                var results;
                results = [];
                for (t in this.things) {
                  results.push(t);
                }
                return results;
              }.call(this).length,
              sthings: sthings.length,
              players: function () {
                var i1, len9, ref14, results;
                ref14 = this.players;
                results = [];
                for (i1 = 0, len9 = ref14.length; i1 < len9; i1++) {
                  p = ref14[i1];
                  results.push(p);
                }
                return results;
              }.call(this).length,
              splayers: splayers.length,
              units: function () {
                var ref14, results;
                ref14 = this.things;
                results = [];
                for (_ in ref14) {
                  t = ref14[_];
                  if (t.unit) {
                    results.push(t);
                  }
                }
                return results;
              }.call(this).length,
              bullets: function () {
                var ref14, results;
                ref14 = this.things;
                results = [];
                for (_ in ref14) {
                  t = ref14[_];
                  if (t.bullet) {
                    results.push(t);
                  }
                }
                return results;
              }.call(this).length,
              others: function () {
                var ref14, results;
                ref14 = this.things;
                results = [];
                for (_ in ref14) {
                  t = ref14[_];
                  if (!t.bullet && !t.unit) {
                    results.push(t);
                  }
                }
                return results;
              }.call(this).length,
            },
            timeings: this.timeings,
          };
        }
        this.timeings = {};
      }
      this.timeEnd("other");
      this.timeStart("zJson");
      packet = this.zJson.dumpDv(data);
      this.timeEnd("zJson");
      this.timeEnd("send");
      return packet;
    };

    Sim.prototype.clearNetState = function () {
      var id, l, len1, len2, m, part, player, ref, ref1, ref2, results, thing;
      this.fullUpdate = true;
      delete this.net;
      ref = this.things;
      for (id in ref) {
        thing = ref[id];
        delete thing.net;
        if (thing.parts != null) {
          ref1 = thing.parts;
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            part = ref1[l];
            delete part.net;
          }
        }
      }
      ref2 = this.players;
      results = [];
      for (m = 0, len2 = ref2.length; m < len2; m++) {
        player = ref2[m];
        results.push(delete player.net);
      }
      return results;
    };

    /*
    Sim.prototype.timeings = {};

    Sim.prototype.timeStarts = {};

    Sim.prototype.timePath = [];
    */

    Sim.prototype.timeStart = function (what) {
      this.timePath.push(what);
      return (this.timeStarts[this.timePath.join(">")] = now());
    };

    Sim.prototype.timeEnd = function (what) {
      var delta, key;
      key = this.timePath.join(">");
      if (this.timePath.pop() !== what) {
        throw "timeEnd does not match timeStart";
      }
      delta = now() - this.timeStarts[key];
      if (this.timeings[key] == null) {
        return (this.timeings[key] = delta);
      } else {
        return (this.timeings[key] += delta);
      }
    };

    Sim.prototype.timeIt = function (what, fn) {
      var ret;
      this.timeStart(what);
      ret = fn();
      this.timeEnd(what);
      return ret;
    };

    Sim.prototype.timeReport = function () {
      var bar, i, k, l, ref, ref1, v;
      ref = this.timeings;
      for (k in ref) {
        v = ref[k];
        bar = "";
        for (i = l = 0, ref1 = v; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
          bar += "*";
        }
        print(bar, k, v);
      }
      return (this.timeings = {});
    };

    return Sim;
  })();
}.call(this));
