// here begin src/galaxy.js
(function() {
  var FREE_AI, LOOSE_TIPS, _offset, bubble_html, doPaths, drawRay, draw_part, galaxyBg, green, onplacement, red, shipsFromAI, users, white,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  eval(onecup["import"]());

  window.easyPlayerBuildBar = [];

  easyPlayerBuildBar[0] = "";

  easyPlayerBuildBar[1] = "";

  easyPlayerBuildBar[2] = "";

  easyPlayerBuildBar[3] = "";

  easyPlayerBuildBar[4] = "";

  easyPlayerBuildBar[5] = "";

  easyPlayerBuildBar[6] = "";

  easyPlayerBuildBar[7] = "";

  easyPlayerBuildBar[8] = "";

  easyPlayerBuildBar[9] = "";

  FREE_AI = ["AlphaSwarm", "CreepingHoard", "BullDogs"];

  LOOSE_TIPS = ["Try using only the parts that you need. The extra cost adds up!", "Try to use only 1 type of weapon, engine, or armor on a given ship. Diversity often makes ships weaker.", "Try going back to eariler designs that worked.", "Stuck? Just try going around this star.", "Remember to capture points. They give you extra money to fight with.", "Try having a cheap and fast ship to capture points with, it will save you a lot of time.", "Click-drag moves are useful for splitting up around the map as well.", "Heavyweight HP is very cheap, but slows you down.", "Try relying on batteries for short range ships, they are very cheap.", "Bigger isn't always better. Don't try to do everything at once", "In general, the more accurate a weapon, the more energy it takes, but it is more guaranteed that the shot will hit"];

  green = [46, 204, 113, 255];

  red = [255, 0, 0, 255];

  white = [255, 255, 255, 255];

  galaxyBg = [11, 25, 46, 255];

  window.GalaxyMode = (function(superClass) {
    extend(GalaxyMode, superClass);

    GalaxyMode.prototype.edit = false;

    GalaxyMode.prototype.test = onecup.params.test;

    GalaxyMode.prototype.difficulty = 1;

    GalaxyMode.prototype.mapBounds = 2100;

    function GalaxyMode() {
      this.onmouseup = bind(this.onmouseup, this);
      this.onmousedown = bind(this.onmousedown, this);
      var k, len, ref, star;
      this.zoom = 1.3;
      this.focus = v2.create();
      this.mouse = v2.create();
      this.screenMouse = v2.create();
      this.starNumber = 0;
      this.starsWon = {};
      this.unlockedParts = [];
      ref = galaxyMap.stars;
      for (k = 0, len = ref.length; k < len; k++) {
        star = ref[k];
        if (star.type === "home") {
          this.focus[0] = -star.pos[0];
          this.focus[1] = -star.pos[1];
        }
      }
    }

    GalaxyMode.prototype.checkGalaxy = function() {
      var data, dup, i, k, l, len, len1, len2, m, n, new_paths, p, path, ref, ref1;
      new_paths = [];
      ref = galaxyMap.paths;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        path = ref[i];
        if (!this.findStar(path[0])) {
          console.log("galaxy path #", i, path[0], "is broken");
          continue;
        }
        if (!this.findStar(path[1])) {
          console.log("galaxy path #", i, path[1], "is broken");
          continue;
        }
        if (path[0] > path[1]) {
          ref1 = [path[1], path[0]], path[0] = ref1[0], path[1] = ref1[1];
        }
        dup = false;
        for (n = l = 0, len1 = new_paths.length; l < len1; n = ++l) {
          p = new_paths[n];
          if (p[0] === path[0] && p[1] === path[1]) {
            console.log("galaxy path #", i, path, "is a duplicate of #", n);
            dup = true;
          }
        }
        if (!dup) {
          new_paths.push(path);
        }
      }
      new_paths = new_paths.sort(function(a, b) {
        return a[0].localeCompare(b[0]);
      });
      data = "";
      for (m = 0, len2 = new_paths.length; m < len2; m++) {
        path = new_paths[m];
        data += "paths.push(['" + path[0] + "', '" + path[1] + "'])\n";
      }
      return console.log(data);
    };

    GalaxyMode.prototype.findStar = function(id) {
      var k, len, ref, star;
      ref = galaxyMap.stars;
      for (k = 0, len = ref.length; k < len; k++) {
        star = ref[k];
        if (star.id === id) {
          return star;
        }
      }
      return null;
    };

    GalaxyMode.prototype.load = function() {
      var galaxy, k, key, len, ref, ref1, star, what;
      galaxy = commander.galaxy;
      if (!galaxy) {
        return;
      }
      if (galaxy.version !== 4) {
        return;
      }
      this.starsWon = galaxy.starsWon;
      ref = this.starsWon;
      for (key in ref) {
        what = ref[key];
        if (what === true) {
          this.starsWon[key] = "commander";
        }
      }
      this.starNumber = galaxy.starNumber;
      this.unlockedParts = galaxy.unlockedParts;
      this.justWon = this.findStar(galaxy.justWonId);
      if (this.justWon) {
        this.focus[0] = -this.justWon.pos[0];
        this.focus[1] = -this.justWon.pos[1];
      }
      ref1 = galaxyMap.stars;
      for (k = 0, len = ref1.length; k < len; k++) {
        star = ref1[k];
        if (this.starsWon[star.id]) {
          this.unlockParts(star);
        }
      }
      return this.hasCurrent = true;
    };

    GalaxyMode.prototype.unlockAll = function() {
      var k, len, ref, results, star;
      ref = galaxyMap.stars;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        star = ref[k];
        results.push(galaxyMode.starsWon[star.id] = "lieutenant");
      }
      return results;
    };

    GalaxyMode.prototype.save = function() {
      var galaxy, ref;
      galaxy = {
        starsWon: this.starsWon,
        justWonId: (ref = this.justWon) != null ? ref.id : void 0,
        unlockedParts: this.unlockedParts,
        starNumber: this.starNumber,
        version: 4
      };
      commander.galaxy = galaxy;
      control.savePlayer();
      return this.hasCurrent = true;
    };

    GalaxyMode.prototype.regenerate = function() {
      var i, k, l, len, len1, m, p, ref, spec;
      insertFleet({
        row: 1
      }, {
        row: 0
      }, true);
      for (i = k = 0; k < 10; i = ++k) {
        commander.fleet[getFleetKey(0, i)] = easyPlayerBuildBar[i];
      }
      commander.fleet.ais[getAIKey(0)] = "Galaxy";
      commander.fleet.selection = {
        row: 0,
        tab: "default"
      };
      fleetMode.currentTab = "default";
      this.unlockedParts = {};
      this.starsWon = {};
      this.justWon = null;
      for (l = 0, len = easyPlayerBuildBar.length; l < len; l++) {
        spec = easyPlayerBuildBar[l];
        ref = fromShort(spec);
        for (m = 0, len1 = ref.length; m < len1; m++) {
          p = ref[m];
          this.unlockedParts[p.type] = true;
        }
      }
      this.starLossUp = null;
      this.starWinUp = null;
      this.galaxyWinUp = null;
      return this.save();
    };

    GalaxyMode.prototype.replaceBuildBar = function(index, spec) {
      var key;
      commander.fleet.selection = {
        row: 0,
        tab: "default"
      };
      key = getFleetKey(0, index);
      if (commander.fleet[key] && commander.fleet[key] !== spec) {
        this.putSomePlaceEmpty(commander.fleet[key]);
      }
      commander.fleet[key] = spec;
      return control.savePlayer();
    };

    GalaxyMode.prototype.putSomePlaceEmpty = function(spec) {
      var col, k, key, l, row;
      if (!spec) {
        return;
      }
      for (row = k = 0; k < 25; row = ++k) {
        for (col = l = 0; l < 10; col = ++l) {
          key = getFleetKey(row, col);
          if (!commander.fleet[key]) {
            commander.fleet[key] = spec;
            return;
          }
        }
      }
    };

    GalaxyMode.prototype.unlockParts = function(star) {
      var k, len, p, ref, results;
      ref = star.unlocks;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        p = ref[k];
        results.push(this.unlockedParts[p] = true);
      }
      return results;
    };

    GalaxyMode.prototype.canReach = function(star) {
      var k, len, path, ref;
      if (this.test) {
        return true;
      }
      if (star.replay === false && this.starsWon[star.id]) {
        return false;
      }
      if (star.type === "home") {
        return true;
      }
      ref = galaxyMap.paths;
      for (k = 0, len = ref.length; k < len; k++) {
        path = ref[k];
        if (path[0] === star.id || path[1] === star.id) {
          if (this.starsWon[path[0]] || this.starsWon[path[1]]) {
            return true;
          }
        }
      }
      return false;
    };

    GalaxyMode.prototype.onmousedown = function(e) {
      var k, len, ref, results, star;
      if (this.popupUp()) {
        return;
      }
      if (e.which === 2) {
        this.moving = true;
        e.preventDefault();
        return;
      }
      ref = galaxyMap.stars;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        star = ref[k];
        if (v2.distance(this.mouse, star.pos) < 32) {
          if (e.which === 3) {
            if (e.shiftKey) {
              results.push(this.connectStar = star);
            } else {
              results.push(this.dragStar = star);
            }
          } else {
            if (this.canReach(star)) {
              results.push(this.fightAt(star));
            } else {
              results.push(void 0);
            }
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    GalaxyMode.prototype.onmouseup = function(e) {
      var j, k, l, len, len1, p, ref, ref1, removed, star;
      this.moving = false;
      if (this.test) {
        if (this.dragStar) {
          this.dragStar.pos = [Math.floor(this.mouse[0]), Math.floor(this.mouse[1])];
          galaxyMap.locations[this.dragStar.id] = this.dragStar.pos;
          this.dragStar = null;
        }
        if (this.connectStar) {
          ref = galaxyMap.stars;
          for (k = 0, len = ref.length; k < len; k++) {
            star = ref[k];
            if (v2.distance(this.mouse, star.pos) < 32) {
              removed = false;
              ref1 = galaxyMap.paths;
              for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
                p = ref1[j];
                if (p[0] === this.connectStar.id && p[1] === star.id || p[1] === this.connectStar.id && p[0] === star.id) {
                  galaxyMap.paths.splice(j, 1);
                  removed = true;
                  break;
                }
              }
              if (!removed) {
                galaxyMap.paths.push([this.connectStar.id, star.id]);
                console.log("connect!");
              }
            }
          }
          return this.connectStar = null;
        }
      }
    };

    GalaxyMode.prototype.toGameSpace = function(point) {
      point[0] = point[0] - window.innerWidth / 2;
      point[1] = (window.innerHeight - point[1]) - window.innerHeight / 2;
      v2.scale(point, this.zoom * 2);
      v2.sub(point, this.focus);
      return point;
    };

    GalaxyMode.prototype.popupUp = function() {
      return this.starLossUp || this.starWinUp || this.galaxyWinUp === "show";
    };

    GalaxyMode.prototype.onmousemove = function(e) {
      var found, k, len, ref, star;
      if (this.popupUp()) {
        return;
      }
      this.screenMouse = [e.clientX, e.clientY];
      this.mouse = this.toGameSpace([this.screenMouse[0], this.screenMouse[1]]);
      if (this.moving) {
        this.focus[0] += e.movementX * this.zoom * 2;
        this.focus[1] -= e.movementY * this.zoom * 2;
      }
      found = false;
      ref = galaxyMap.stars;
      for (k = 0, len = ref.length; k < len; k++) {
        star = ref[k];
        if (v2.distance(this.mouse, star.pos) < 32) {
          found = true;
          if (star !== this.hoverStar) {
            this.hoverStar = star;
            if (star.type === "boss" || this.canReach(star) || this.test) {
              bubbles.tip = {
                thing: star,
                html: bubble_html
              };
            } else {
              bubbles.tip = false;
            }
          }
        }
      }
      if (!found) {
        this.hoverStar = null;
        bubbles.tip = null;
      }
      return onecup.refresh();
    };

    GalaxyMode.prototype.restart = function() {
      var k, len, ref, star;
      this.regenerate();
      ref = galaxyMap.stars;
      for (k = 0, len = ref.length; k < len; k++) {
        star = ref[k];
        if (star.type === "home") {
          ui.mode = "battle";
          this.justWon = star;
          this.fightAt(star);
          return;
        }
      }
    };

    GalaxyMode.prototype.tick = function() {
      return this.controls();
    };

    GalaxyMode.prototype.draw = function() {
      var bg_zoom, cls, color, diff, i, icon, k, l, len, len1, len2, len3, len4, len5, m, name2Star, o, part_name, path, q, r, ref, ref1, ref2, ref3, ref4, s, size, star, to, toPos, userId, x, z;
      battleMode.selection.style.display = "none";
      baseAtlas.beginSprites(this.focus, this.zoom);
      bg_zoom = Math.max(window.innerWidth, window.innerHeight) / 128;
      z = bg_zoom * this.zoom;
      baseAtlas.drawSprite("img/newbg/fill.png", [-this.focus[0], -this.focus[1]], [z, z], 0, galaxyBg);
      baseAtlas.drawSprite("img/bg/galaxy.png", [0, 0], [2, 2], 0);
      if (this.hoverStar) {
        ref = galaxyMap.paths;
        for (k = 0, len = ref.length; k < len; k++) {
          path = ref[k];
          if (path[0] === this.hoverStar.id || path[1] === this.hoverStar.id) {
            if (this.starsWon[path[0]] || this.starsWon[path[1]]) {
              color = green;
            } else {
              color = white;
            }
            drawRay(this.findStar(path[0]).pos, this.findStar(path[1]).pos, color);
          }
        }
      }
      ref1 = galaxyMap.stars;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        star = ref1[l];
        s = .5 + star.difficulty * .5;
        color = white;
        icon = "img/galaxy/star.png";
        if (star.type === "2v2") {
          icon = "img/galaxy/2v2.png";
        }
        if (star.type === "3v3") {
          icon = "img/galaxy/3v3.png";
        }
        if (star.type === "home") {
          s = 2;
        }
        if (star.type === "boss") {
          s = 2;
          color = red;
          icon = "img/galaxy/boss.png";
        }
        if (this.starsWon[star.id]) {
          color = green;
          diff = this.starsWon[star.id];
          icon = "img/galaxy/" + diff + ".png";
        }
        if (star === this.justWon) {
          s = s + Math.sin(Date.now() / 100) * .2;
        }
        baseAtlas.drawSprite(icon, star.pos, [s, -s], 0, color);
        if (star.type === "fort" || star.type === "home") {
          baseAtlas.drawSprite("img/galaxy/fort.png", star.pos, [s, -s], 0, color);
        }
        if (this.test) {
          x = 50;
          ref2 = star.unlocks;
          for (m = 0, len2 = ref2.length; m < len2; m++) {
            part_name = ref2[m];
            cls = parts[part_name];
            if (cls) {
              baseAtlas.drawSprite("parts/" + cls.prototype.image, [star.pos[0] + x, star.pos[1]], [1, -1], 0);
              x += 40;
            }
          }
        }
      }
      if (this.test) {
        name2Star = {};
        ref3 = galaxyMap.stars;
        for (o = 0, len3 = ref3.length; o < len3; o++) {
          s = ref3[o];
          name2Star[s.name] = s;
          s.visit = 0;
        }
        toPos = v2.create();
        for (userId in users) {
          path = users[userId];
          for (i = q = 0, len4 = path.length; q < len4; i = ++q) {
            star = path[i];
            if (star[1] === "won") {
              color = [0, 255, 0, 150];
            } else if (star[1] === "loss") {
              color = [255, 0, 0, 150];
            } else {
              color = [255, 255, 0, 150];
            }
            to = name2Star[star[2]];
            if (!to) {
              console.log("start", star[2]);
              continue;
            }
            v2.set(to.pos, toPos);
            toPos[0] += 8 * Math.floor(to.visit % 10);
            toPos[1] -= 30 + 8 * Math.floor(to.visit / 10);
            to.visit += 1;
            if (i !== path.length - 1) {
              size = [.5, .5];
            } else {
              size = [1, 1];
            }
            size = [.25, .25];
            baseAtlas.drawSprite("img/pip1.png", toPos, size, 0, color);
          }
        }
      }
      if (this.test) {
        ref4 = galaxyMap.paths;
        for (r = 0, len5 = ref4.length; r < len5; r++) {
          path = ref4[r];
          drawRay(this.findStar(path[0]).pos, this.findStar(path[1]).pos, [255, 255, 255, 50]);
        }
      }
      return baseAtlas.finishSprites();
    };

    GalaxyMode.prototype.fightAt = function(star, softRestart) {
      var _, addAI, aiName, k, l, len, len1, len2, m, p, player, ref, ref1, ref2, ref3, sp, u;
      if (softRestart == null) {
        softRestart = false;
      }
      if (!designMode.showAiTools) {
        localStorage.useAi = "false";
      }
      intp.doMapFocus = true;
      onecup.refresh();
      track("start_galaxy_battle", {
        starName: star.name,
        ai: star.ai || (star.alpha + " vs " + star.beta),
        aiMoney: star.aiMoney || 2000,
        starNumber: galaxyMode.starNumber
      });
      bubbles.tip = null;
      battleMode.startNewLocal();
      sim.galaxyStar = star;
      sim.makeRocks = !star.mapNoThings;
      console.log("fight at", star.mapSize, star.mapNumCPs, star.mapSeed);
      sim.generateMap(star.mapSize, star.mapNumCPs, star.mapSeed);
      if (star.type === "fort") {
        mapping.genTower();
      }
      if (typeof star.mapLayout === "function") {
        star.mapLayout();
      }
      network.sendPlayer();
      player = sim.players[0];
      console.log(player);
      switch (commander.galaxyDifficulty) {
        case "lieutenant":
          player.money *= 1.5;
          player.moneyRatio = 1.5;
          break;
        case "commander":
          player.money *= 1.1;
          player.moneyRatio = 1.1;
          break;
        case "captain":
          player.money *= .90;
          player.moneyRatio = .90;
          break;
        case "admiral":
          player.money *= .75;
          player.moneyRatio = .75;
      }
      addAI = function(aiName, side) {
        player = ais.useAi(aiName, side);
        if (side === "beta") {
          player.color = [255, 0, 0, 255];
        }
        if (side === "alpha") {
          player.color = [0, 255, 0, 255];
        }
        if (star.aiMoney) {
          player.money = star.aiMoney;
        } else {
          if (star.size === 1) {
            player.money = 1000;
          }
          if (star.size === 2) {
            player.money = 2000;
          }
          if (star.size === 3) {
            player.money = 3000;
          }
        }
        return player;
      };
      if (star.alpha) {
        ref = star.alpha;
        for (k = 0, len = ref.length; k < len; k++) {
          aiName = ref[k];
          if (aiName !== "Player") {
            addAI(aiName, "alpha");
          }
        }
      }
      if (star.beta) {
        ref1 = star.beta;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          aiName = ref1[l];
          addAI(aiName, "beta");
        }
      }
      if (star.ai) {
        player = addAI(star.ai, "beta");
      }
      if (star.type === "boss") {
        player.color = [255, 0, 0, 255];
        u = new types.Unit(player.buildBar[0]);
        ref2 = sim.things;
        for (_ in ref2) {
          sp = ref2[_];
          if (sp.spawn && sp.side === player.side) {
            u.pos = v2.create(sp.pos);
          }
        }
        u.side = "beta";
        u.rot = v2.angle(u.pos) + Math.PI;
        u.owner = player.number;
        u.number = 0;
        sim.things[u.id] = u;
        sim.winSoon = false;
        sim.victoryConditions = function() {
          var capped, cp, ref3;
          if (this.state !== "running") {
            return;
          }
          if (u.dead && !this.winSoon) {
            this.winSoon = this.step + 16 * 5;
          }
          if (this.winSoon && this.winSoon < this.step) {
            this.winningSide = "alpha";
          }
          capped = true;
          ref3 = sim.things;
          for (_ in ref3) {
            cp = ref3[_];
            if (cp.commandPoint && cp.side === "alpha") {
              capped = false;
            }
          }
          if (capped) {
            this.winningSide = "beta";
          }
          if (this.winningSide) {
            return this.endOfGame();
          }
        };
      }
      if (typeof star.addAIUnits === "function") {
        star.addAIUnits();
      }
      console.log("give design?", softRestart);
      if (!softRestart && star.giveDesign) {
        console.log("give design", star.giveDesignSlot, star.giveDesign);
        buildBar.selected = star.giveDesignSlot;
        galaxyMode.replaceBuildBar(star.giveDesignSlot, star.giveDesign);
        designMode.select(buildBar.selected);
        ref3 = fromShort(star.giveDesign).parts;
        for (m = 0, len2 = ref3.length; m < len2; m++) {
          p = ref3[m];
          galaxyMode.unlockedParts[p.type] = true;
        }
        designMode.fresh = false;
      }
      intp.gameEnded = function() {
        var numbering, prev;
        actionMixer.reset();
        if (intp.winningSide === "alpha") {
          track("won_galaxy_battle", {
            starName: star.name,
            time: sim.step / 16,
            ai: star.ai || (star.alpha + " vs " + star.beta),
            aiMoney: star.aiMoney || 2000,
            starNumber: galaxyMode.starNumber
          });
          galaxyMode.justWon = star;
          numbering = {
            "lieutenant": 1,
            "commander": 2,
            "captain": 3,
            "admiral": 4
          };
          prev = galaxyMode.starsWon[star.id];
          if (!prev || numbering[prev] < numbering[commander.galaxyDifficulty]) {
            galaxyMode.starsWon[star.id] = commander.galaxyDifficulty;
          }
          galaxyMode.unlockParts(galaxyMode.justWon);
          galaxyMode.starNumber += 1;
          galaxyMode.save();
          galaxyMode.starWinUp = true;
        } else {
          track("lost_galaxy_battle", {
            starName: star.name,
            time: sim.step / 16,
            ai: star.ai || (star.alpha + " vs " + star.beta),
            aiMoney: star.aiMoney || 2000,
            starNumber: galaxyMode.starNumber
          });
          star.randomLossTip = choose(LOOSE_TIPS);
          galaxyMode.starLossUp = star;
        }
        ui.mode = "galaxy";
        control.savePlayer();
        return onecup.refresh();
      };
      if (star.startWithDesigner === false) {
        ui.go("battle");
      } else {
        ui.go("design");
      }
    };

    GalaxyMode.prototype.bossCheck = function() {
      var bossesLeft, k, len, ref, star;
      bossesLeft = 0;
      ref = galaxyMap.stars;
      for (k = 0, len = ref.length; k < len; k++) {
        star = ref[k];
        if (star.type === "boss" && !this.starsWon[star.id]) {
          bossesLeft += 1;
        }
      }
      if (bossesLeft === 0 && this.galaxyWinUp !== "closed") {
        this.galaxyWinUp = "show";
        return true;
      }
    };

    return GalaxyMode;

  })(window.ControlsMode);

  _offset = v2.create();

  drawRay = function(a, b, color) {
    var d, image, rot;
    image = "img/laser01.png";
    v2.sub(b, a, _offset);
    rot = v2.angle(_offset);
    d = v2.mag(_offset) / 437;
    v2.scale(_offset, .5);
    v2.add(_offset, a);
    return baseAtlas.drawSprite(image, _offset, [.2, d], rot, color);
  };

  onplacement = function() {
    var pos;
    if (true && e.which === 1) {
      pos = this.toGameSpace([e.x, e.y]);
      return stars.push({
        size: Math.floor(Math.random() * 3) + 1,
        x: pos[0],
        y: pos[1]
      });
    }
  };

  bubble_html = function() {
    var star;
    star = galaxyMode.hoverStar;
    div(function() {
      opacity(".5");
      text_align("right");
      return text(star.name);
    });
    div(function() {
      var ai, k, l, len, len1, ref, ref1;
      margin_bottom(10);
      font_size(20);
      if (star.ai) {
        text("Fight vs " + star.ai);
      }
      if (star.type === "2v2" || star.type === "3v3") {
        text(star.type + " vs ");
        ref = star.alpha;
        for (k = 0, len = ref.length; k < len; k++) {
          ai = ref[k];
          text(" " + ai);
        }
        text(" vs ");
        ref1 = star.beta;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          ai = ref1[l];
          text(" " + ai);
        }
      }
      if (galaxyMode.test) {
        shipsFromAI(star);
      }
      if (star.size === 1) {
        return text(" (hard)");
      } else if (star.size === 2) {
        return text(" (medium)");
      } else if (star.size === 3) {
        return text(" (easy)");
      }
    });
    if (star.about) {
      div(function() {
        padding("10px 0px");
        return text(star.about);
      });
    }
    if (!star.noDesignTools) {
      return div(function() {
        var k, len, part_name, ref, results;
        ref = star.unlocks;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          part_name = ref[k];
          results.push(draw_part(part_name));
        }
        return results;
      });
    }
  };

  shipsFromAI = function(star) {
    return div(function() {
      var ai, aiName, aiNames, k, len, results, spec, unitThumb, x, y;
      if (star.ai) {
        aiNames = [star.ai];
      } else if (star.beta) {
        aiNames = star.beta;
      } else {
        aiNames = [];
      }
      y = 50;
      x = 50;
      results = [];
      for (k = 0, len = aiNames.length; k < len; k++) {
        aiName = aiNames[k];
        ai = ais.all[aiName];
        results.push((function() {
          var l, len1, results1;
          results1 = [];
          for (l = 0, len1 = ai.length; l < len1; l++) {
            spec = ai[l];
            if (spec) {
              unitThumb = buildBar.specToThumb(JSON.stringify(spec));
              results1.push(img({
                src: unitThumb,
                width: 64,
                height: 64
              }));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    });
  };

  draw_part = function(part_name) {
    return div(function() {
      overflow("hidden");
      div(function() {
        float("left");
        display("inline-block");
        background_image("url('parts/" + parts[part_name].prototype.image + "')");
        background_size("auto");
        background_position("center");
        background_repeat("no-repeat");
        width(52);
        return height(52);
      });
      return div(function() {
        width(180);
        float("left");
        font_size(14);
        margin(5);
        span(function() {
          font_weight("bold");
          return text(parts[part_name].prototype.name);
        });
        text(" ");
        return span(function() {
          color("#888");
          return text(parts[part_name].prototype.desc);
        });
      });
    });
  };

  ui.galaxyDifficultyPicker = false;

  window.galaxyView = function() {
    div(function() {
      position("absolute");
      top(0);
      left(0);
      color("white");
      return ui.topButton("menu");
    });
    div(function() {
      var diff, k, len, pickModes, results;
      position("absolute");
      top(0);
      right(0);
      width(64);
      color("white");
      pickModes = ["lieutenant", "commander", "captain", "admiral"];
      if (pickModes.indexOf(commander.galaxyDifficulty) === -1) {
        commander.galaxyDifficulty = "commander";
      }
      ui.topButton(commander.galaxyDifficulty, function() {
        if (ui.galaxyDifficultyPicker) {
          opacity(".2");
        }
        return onclick(function() {
          return ui.galaxyDifficultyPicker = !ui.galaxyDifficultyPicker;
        });
      });
      if (ui.galaxyDifficultyPicker) {
        div(function() {
          padding("20px 0px");
          return text("difficulty");
        });
        results = [];
        for (k = 0, len = pickModes.length; k < len; k++) {
          diff = pickModes[k];
          results.push((function(diff) {
            return ui.topButton(diff, function() {
              return onclick(function() {
                commander.galaxyDifficulty = diff;
                ui.galaxyDifficultyPicker = false;
                return control.savePlayer();
              });
            });
          })(diff));
        }
        return results;
      }
    });
    galaxyMode.bossCheck();
    if (galaxyMode.galaxyWinUp === "show") {
      return galaxyWinPopup();
    } else if (galaxyMode.starLossUp) {
      return starLossPopup();
    } else if (galaxyMode.starWinUp) {
      return starWinPopup();
    }
  };

  window.starLossPopup = function() {
    if (!galaxyMode.starLossUp) {
      return;
    }
    return div(function() {
      position("absolute");
      top(0);
      bottom(0);
      left(0);
      right(0);
      background_color("rgba(0, 0, 0, .2)");
      return div(function() {
        margin("100px auto");
        width(340);
        padding_bottom(30);
        background("rgba(0, 0, 0, .7)");
        color("white");
        div(function() {
          font_size(40);
          padding(20);
          text_align("center");
          return text("DEFEAT");
        });
        div(function() {
          padding(10);
          color("white");
          text_align("center");
          if (galaxyMode.starLossUp.lossTip) {
            return text(galaxyMode.starLossUp.lossTip);
          } else {
            return text(galaxyMode.starLossUp.randomLossTip);
          }
        });
        return div(".hover-white", function() {
          color("white");
          text_align("center");
          padding(20);
          text("CONTINUE");
          return onclick(function() {
            return galaxyMode.starLossUp = null;
          });
        });
      });
    });
  };

  window.starWinPopup = function() {
    if (!galaxyMode.starWinUp) {
      return;
    }
    if (!galaxyMode.justWon) {
      designMode.starWinUp = false;
    }
    bubbles.tip = false;
    return div(function() {
      position("absolute");
      top(0);
      bottom(0);
      left(0);
      right(0);
      background_color("rgba(0, 0, 0, .2)");
      return div(function() {
        margin("100px auto");
        width(340);
        padding_bottom(30);
        background("rgba(0, 0, 0, .7)");
        color("white");
        div(function() {
          font_size(40);
          padding(20);
          text_align("center");
          return text("VICTORY");
        });
        if (galaxyMode.justWon.unlocks.length > 0) {
          div(function() {
            color("rgba(236, 240, 241, 1.0)");
            text_align("center");
            padding(10);
            return text("You have unlocked:");
          });
        }
        div(function() {
          var k, len, part_name, ref;
          padding(30);
          text_align("left");
          if (galaxyMode.justWon) {
            ref = galaxyMode.justWon.unlocks;
            for (k = 0, len = ref.length; k < len; k++) {
              part_name = ref[k];
              draw_part(part_name);
            }
            if (galaxyMode.justWon.type === "boss") {
              return div(function() {
                color("white");
                return text("You have defeated one of the bosses. Kill all of the bosses to win the game!");
              });
            }
          }
        });
        return div(".hover-white", function() {
          color("white");
          text_align("center");
          padding(20);
          text("CONTINUE");
          return onclick(function() {
            return galaxyMode.starWinUp = false;
          });
        });
      });
    });
  };

  window.galaxyWinPopup = function() {
    return div(function() {
      position("absolute");
      top(0);
      bottom(0);
      left(0);
      right(0);
      background_color("rgba(100, 0, 0, .5)");
      return div(function() {
        margin("0px auto");
        width(500);
        padding_bottom(30);
        background("rgba(0, 0, 0, .5)");
        color("white");
        height(window.innerHeight);
        overflow_y("auto");
        div(function() {
          padding_top(40);
          font_size(20);
          color("white");
          text_align("center");
          color("#DDD");
          return text("You have achieved total galactic");
        });
        div(function() {
          font_size(80);
          padding_bottom(20);
          text_align("center");
          return text("VICTORY");
        });
        div(function() {
          text_align("center");
          padding("30px 60px");
          color("white");
          color("#BBB");
          line_height(26);
          text("The galaxy will be forever free and grateful for your contribution. ");
          text("Its citizens will forever know your name. ");
          text("No one can erase what you have accomplished. ");
          br();
          br();
          return text("You are the Istro Commander.");
        });
        div(function() {
          text_align("center");
          padding(10);
          line_height(26);
          color("#BBB");
          div(function() {
            font_size(20);
            text("Credits");
            color("white");
            return br();
          });
          div(function() {
            return text("Code & Art by Andre 'Treeform' von Houck");
          });
          div(function() {
            return text("Design by Oscar 'Saktoth' Evans");
          });
          div(function() {
            return text("Co-Design by Kevin 'RyMarq' Piala");
          });
          div(function() {
            color("white");
            font_size(20);
            br();
            text("Special thanks for testing, AI writing and playing");
            return br();
          });
          return div(function() {
            return text("Godde, Nepthali Celles, Tully Elliston, Nicholas Wylder");
          });
        });
        return div(".hover-white", function() {
          color("white");
          text_align("center");
          padding(20);
          text("Return to Galaxy");
          return onclick(function() {
            ui.mode = "galaxy";
            return galaxyMode.galaxyWinUp = "closed";
          });
        });
      });
    });
  };

  users = {};

  if (onecup.params.test) {
    doPaths = function(type) {
      var req;
      req = new XMLHttpRequest();
      req.open("GET", "/stats/" + type + ".json");
      req.onload = function() {
        var data, k, len, path, starName, stat, ts, userId;
        data = JSON.parse(req.response).table;
        for (k = 0, len = data.length; k < len; k++) {
          stat = data[k];
          userId = stat[0];
          starName = stat[1];
          ts = stat[2];
          path = users[userId];
          if (!path) {
            path = [];
            users[userId] = path;
          }
          path.push([ts, type, starName]);
        }
        for (userId in users) {
          path = users[userId];
          path.sort(function(a, b) {
            return a[0] - b[0];
          });
        }
        return console.log(type, "loded", users);
      };
      return req.send();
    };
    doPaths("start");
    doPaths("won");
    doPaths("loss");
    console.log("users", users);
  }

}).call(this);
;


