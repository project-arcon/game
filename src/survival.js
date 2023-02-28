(function () {
  window.survival = {};

  survival.firstWave = 10;

  survival.waveFreq = 30;

  survival.numComPoints = 12;

  survival.startAIMoney = 1500;

  survival.waveAIMoneyMul = 500;

  survival.waveAIPow = 1.2;

  survival.start = function (sim) {
    var key, p, ref, results;
    sim.waveNum = 0;
    sim.sayToServer("mode.survival.first_wave", survival.firstWave);
    sim.alentiveCountDown = 16 * survival.firstWave;
    ref = sim.players;
    results = [];
    for (key in ref) {
      p = ref[key];
      if (p && p.connected) {
        if (p.side === "beta") {
          p.money = 1;
          //p.moneyRatio = 0;
          p.gainsMoney = 0;
        }
        if (p.side === "alpha") {
          p.money = 2000;
          //p.moneyRatio = 1;
          results.push((p.gainsMoney = 1));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  survival.endOfGame = function (sim) {
    var key, p, ref, results;
    sim.sayToServer("mode.survival.report", sim.waveNum);
    sim.alentiveCountDown = 0;

    /*
     * Remove ships in the case there are too many and cause lag
    for id, object of sim.things
        if object.unit
            object.selfDestruct()
     */
    ref = sim.players;
    results = [];
    for (key in ref) {
      p = ref[key];
      if (p /* && p.connected */) {
        //if (p.moneyRatio === 0) {
        //  results.push(p.moneyRatio = 1);
        if (!p.gainsMoney) {
          results.push((p.gainsMoney = 1));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  survival.canStart = function (sim) {
    return sim.numInTeam("alpha") > 0 && sim.numInTeam("beta") > 0;
  };

  survival.simulate = function (sim) {
    var aiMoney, betaPlayerCount, j, len, p, ref;
    if (sim.state === "running") {
      if ((sim.step / 16 - survival.firstWave) % survival.waveFreq === 0) {
        sim.waveNum += 1;
        aiMoney = Math.floor(survival.startAIMoney + Math.pow(survival.waveAIPow, sim.waveNum) * survival.waveAIMoneyMul);
        sim.sayToServer("mode.survival.wave", sim.waveNum, aiMoney);
        sim.alentiveCountDown = 16 * survival.waveFreq;
        betaPlayerCount = sim.players.filter(function (p) {
          return p.side === "beta";
        }).length;
        ref = sim.players;
        for (j = 0, len = ref.length; j < len; j++) {
          p = ref[j];
          if (p.side === "beta") {
            p.money = Math.round(aiMoney);
          }
        }
      }
    }
  };

  survival.victoryConditions = function (sim) {
    var capped, cappedArr, id, j, k, len, player, ref, ref1, stillThere, thing;
    if (sim.state !== "running") {
      return;
    }
    capped = {};
    ref = sim.things;
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
    if (cappedArr.length === 1 && cappedArr[0] === "beta") {
      sim.winningSide = cappedArr[0];
    }
    if (sim.winningSide) {
      sim.endOfGame();
      return;
    }
    if (!sim.local && !sim.aiTestMode) {
      stillThere = false;
      ref1 = sim.players;
      for (j = 0, len = ref1.length; j < len; j++) {
        player = ref1[j];
        if (!player.ai && player.connected && !player.afk && player.side !== "spectators") {
          stillThere = true;
        }
      }
      if (!stillThere) {
        sim.sayToServer("sim.end_of_game.empty_teams");
        sim.winningSide = false;
        sim.endOfGame();
      }
    }
  };

  survival.genSurvival = function () {
    var cp, i, j, ref, results, spawn, th;
    spawn = new types.SpawnPoint();
    spawn.side = "alpha";
    spawn.spawn = "alpha";
    spawn.pos = v2.create([0, 0]);
    sim.things[spawn.id] = spawn;
    cp = function (r, th, side) {
      var point;
      point = new types.CommandPoint();
      point.z = -0.01;
      point.pos[0] = Math.cos(th) * r * sim.mapScale;
      point.pos[1] = Math.sin(th) * r * sim.mapScale;
      point.side = side;
      return (sim.things[point.id] = point);
    };
    results = [];
    for (i = j = 0, ref = survival.numComPoints; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      th = (i * Math.PI * 2) / survival.numComPoints;
      if (i % 2 === 0) {
        results.push(cp(1320, th, "beta"));
      } else {
        results.push(cp(960, th, "alpha"));
      }
    }
    return results;
  };

  survival.rqUnit = function (sim, number, slot) {
    var pos, th;
    th = Math.random() * Math.PI * 2;
    pos = v2.scale(v2.pointTo([], th), 2000 * sim.mapScale);
    return sim.buildUnit(number, slot, pos);
  };
}.call(this));
