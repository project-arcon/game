// here begin src/galaxydata.js
(function() {
  var _pos, designSwapper, drawIncome, j, l, len, len1, mkTip, mkUnit, partName, paths, puzzleRule, puzzleRuleWindow, ref, ring, star, stars, tickIncome, unlocks;

  eval(onecup["import"]());

  window.galaxyMap = {};

  stars = galaxyMap.stars = [];

  paths = galaxyMap.paths = [];

  _pos = new v2.create();

  drawIncome = function() {
    var m;
    return galaxyMap.moneyRain = (function() {
      var j, len, ref, results;
      ref = galaxyMap.moneyRain;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        m = ref[j];
        baseAtlas.drawSprite("img/tips/money" + m.amount + ".png", m.pos, [1, -1], 0, m.color);
        m.pos[1] += 4;
        m.color[3] *= .98;
        if (m.color[3] < 10) {
          continue;
        }
        results.push(m);
      }
      return results;
    })();
  };

  tickIncome = function() {
    var _, m, ref, results, t;
    if (sim.step % 16 === 0) {
      ref = sim.things;
      results = [];
      for (_ in ref) {
        t = ref[_];
        if (t.commandPoint) {
          if (t.beforeSide === "beta" && t.side === "alpha") {
            m = {
              amount: 100,
              pos: v3.create(),
              color: [255, 255, 255, 255]
            };
            v2.add(m.pos, t.pos);
            galaxyMap.moneyRain.push(m);
          } else if (t.side === "alpha") {
            m = {
              amount: 1,
              pos: v3.create(),
              color: [255, 255, 255, 255]
            };
            v2.add(m.pos, t.pos);
            galaxyMap.moneyRain.push(m);
          }
          t.beforeSide = t.side;
        }
        if (t.spawn && t.side === "alpha") {
          m = {
            amount: 10,
            pos: v3.create(),
            color: [255, 255, 255, 255]
          };
          v2.add(m.pos, t.pos);
          results.push(galaxyMap.moneyRain.push(m));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  mkTip = function(img, x, y) {
    var tip;
    tip = new types.Rock();
    tip.z = 0;
    tip.rot = 0;
    tip.scale = [1, 1];
    tip.color = [255, 255, 255, 255];
    tip.image = img;
    tip.pos = [x, y];
    sim.things[tip.id] = tip;
    return tip;
  };

  mkUnit = function(spec, pos, side, number) {
    var u;
    if (number == null) {
      number = 0;
    }
    console.log("spec", spec);
    u = new types.Unit(spec);
    u.pos = v2.create(pos);
    u.side = side;
    u.rot = -Math.PI / 2;
    u.number = number;
    sim.things[u.id] = u;
    return u;
  };

  ring = (function(_this) {
    return function(spec, n, radius, ox, oy, offset, side) {
      var i, j, ref, results, x, y;
      if (ox == null) {
        ox = 0;
      }
      if (oy == null) {
        oy = 0;
      }
      if (offset == null) {
        offset = 0;
      }
      if (side == null) {
        side = "beta";
      }
      results = [];
      for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        x = Math.sin((offset + i) / n * 2 * Math.PI) * radius;
        y = Math.cos((offset + i) / n * 2 * Math.PI) * radius;
        results.push(mkUnit(spec, [x + ox, y + oy], side));
      }
      return results;
    };
  })(this);

  puzzleRuleWindow = function(label, body) {
    return div("#puzzleRuleWindow", function() {
      position("absolute");
      top(160);
      left((window.innerWidth - 500) / 2);
      background("rgba(0,0,0,0.5)");
      color("white");
      padding(10);
      width(500);
      div(function() {
        text(label);
        padding("4px 0px");
        return font_size(18);
      });
      return div(function() {
        margin_left(5);
        galaxyMap.designMeetsCriteria = true;
        return body();
      });
    });
  };

  puzzleRule = function(rule) {
    return div(function() {
      padding("4px 0px");
      span(function() {
        display("inline-block");
        border_radius(3);
        margin_right(5);
        width(44);
        text_align("center");
        color("white");
        if (rule.formula) {
          text("pass");
          return background("rgba(0, 255, 0, 0.4)");
        } else {
          text("need");
          background("rgba(255, 0, 0, 0.4)");
          return galaxyMap.designMeetsCriteria = false;
        }
      });
      return text(rule.label);
    });
  };

  designSwapper = function() {
    var name, what;
    onecup.preload("img/ui/tips/basicDrag.png");
    onecup.preload("img/ui/tips/basicEngine.png");
    onecup.preload("img/ui/tips/basicReactor.png");
    onecup.preload("img/ui/tips/basicWeapon.png");
    onecup.preload("img/ui/tips/basicReactor.png");
    onecup.preload("img/ui/tips/basicMount.png");
    onecup.preload("img/ui/tips/basicArmor.png");
    onecup.preload("img/ui/tips/basicWing.png");
    onecup.preload("img/ui/tips/basicBattery.png");
    if (ui.mode === "design") {
      img({
        src: "img/ui/tips/designArrow.png",
        draggable: false,
        width: 100,
        height: 100
      }, function() {
        position("absolute");
        top(window.innerHeight / 2 - 110);
        return left(window.innerWidth / 2 + 150);
      });
      what = "Drag";
      if (designMode.draggingPart) {
        name = designMode.draggingPart.constructor.name;
        console.log("dragging part?", name);
        switch (name) {
          case "Engine04":
            what = "Engine";
            break;
          case "Reactor2x1":
            what = "Reactor";
            break;
          case "LightBeamTurret":
            what = "Weapon";
            break;
          case "Reactor2x1":
            what = "Reactor";
            break;
          case "Mount90":
            what = "Mount";
            break;
          case "HArmor1x2":
            what = "Armor";
            break;
          case "Wing1x1Round":
            what = "Wing";
            break;
          case "Battery1x1":
            what = "Battery";
        }
      }
      img({
        src: "img/ui/tips/basic" + what + ".png",
        draggable: false,
        width: 200,
        height: 200
      }, function() {
        position("absolute");
        top(window.innerHeight / 2 - 110 + 50);
        return left(window.innerWidth / 2 + 150 + 50);
      });
      return false;
    }
  };

  stars.push({
    id: 'kiusd6o',
    name: "Homeworld",
    type: "home",
    about: "This is your planet. Your origin.",
    ai: "StaticAI",
    difficulty: 1,
    noDesignTools: true,
    mapSize: 0.8576046077068895,
    mapNumCPs: 4,
    barTips: true,
    noDesignTools: true,
    unlocks: ["LightBeamTurret", "Mount90", "Engine04", "Reactor2x1"],
    giveDesignSlot: 0,
    giveDesign: "FBQEFA8SFwodEQodFBQ2",
    mapSeed: 2344,
    replay: false,
    mapLayout: function() {
      var a, cp, r;
      buildBar.show = false;
      sim.things = {};
      intp.things = {};
      sim.theme = {
        rockColor: [63, 85, 96, 255],
        spotColor: [115, 193, 226, 255],
        fillColor: [123, 63, 68, 255]
      };
      r = 1000;
      a = new types.SpawnPoint();
      a.side = "alpha";
      a.spawn = "alpha";
      a.pos = [-3000, 0];
      sim.things[a.id] = a;
      mkTip("img/tips/dragBig@2x.png", -3000, 0);
      mkTip("img/tips/move@2x.png", -2200, 0);
      mkTip("img/tips/pan@2x.png", -1500, 0);
      mkTip("img/tips/zoom@2x.png", -500, 0);
      cp = new types.CommandPoint();
      cp.side = "alpha";
      cp.pos = [0, -1e100];
      sim.things[cp.id] = cp;
      cp = new types.CommandPoint();
      cp.side = "beta";
      cp.pos = [-1000, 600];
      sim.things[cp.id] = cp;
      mkTip("img/tips/capping@2x.png", -1000, 600).cappingTip = true;
      cp = new types.CommandPoint();
      cp.side = "beta";
      cp.pos = [100, -600];
      sim.things[cp.id] = cp;
      mkTip("img/tips/attack@2x.png", 100, -600).cappingTip = true;
      mkUnit('GBhIEBBJGBBJEBhIERQHFxQHFBQ8FBcSExAdFRAd', [100, -600], "beta");
      cp = new types.CommandPoint();
      cp.side = "beta";
      cp.pos = [1600, 0];
      sim.things[cp.id] = cp;
      mkTip("img/tips/win@2x.png", 1600, 0).cappingTip = true;
      return mkUnit('FxQHFRAdGBhIERQHEBBJEBhIExAdFBcSGBBJFBQDFBQ1', [1600, 0], "beta");
    },
    tick: function() {
      var j, n, results;
      if (sim.step === 1) {
        results = [];
        for (n = j = 0; j < 6; n = ++j) {
          results.push(sim.players[0].rqUnit(0));
        }
        return results;
      }
    },
    draw: function() {
      var _, cp, enemyUnits, myCP, myUnits, p, playerUnits, ref, ref1, ref2, ref3, ref4, results, t, u;
      playerUnits = 0;
      ref = sim.things;
      for (_ in ref) {
        t = ref[_];
        if (t.unit && t.side === commander.side) {
          playerUnits += 1;
        }
      }
      if (playerUnits === 0) {
        battleMode.focus[0] = battleMode.focus[0] * .95 + 3000 * .05;
        battleMode.focus[1] = battleMode.focus[1] * .95 + 0 * .05;
        battleMode.zoom = battleMode.zoom * .95 + 1.4 * .05;
      }
      if (!buildBar.show && sim.step > 16 * 15) {
        if (playerUnits === 0) {
          ref1 = sim.player;
          for (_ in ref1) {
            p = ref1[_];
            if (p.id === commander.id) {
              p.money = 1000;
            }
          }
          buildBar.show = true;
          onecup.refresh();
        }
      }
      ref2 = sim.things;
      results = [];
      for (_ in ref2) {
        t = ref2[_];
        if (t.cappingTip) {
          enemyUnits = false;
          myUnits = false;
          ref3 = sim.things;
          for (_ in ref3) {
            u = ref3[_];
            if (u.unit && v2.distance(t.pos, u.pos) < 250) {
              if (u.side === "beta") {
                enemyUnits = true;
              }
              if (u.side === "alpha") {
                myUnits = true;
              }
            }
          }
          myCP = null;
          ref4 = sim.things;
          for (_ in ref4) {
            cp = ref4[_];
            if (cp.commandPoint && v2.distance(t.pos, cp.pos) < 500) {
              myCP = cp;
            }
          }
          if (enemyUnits) {
            results.push(t.image = "img/tips/attack@2x.png");
          } else if (myUnits && (myCP != null ? myCP.capping : void 0) > 0) {
            results.push(t.image = "img/tips/waitcap@2x.png");
          } else if ((myCP != null ? myCP.side : void 0) === "alpha") {
            results.push(t.image = "img/tips/win@2x.png");
          } else {
            results.push(t.image = "img/tips/capping@2x.png");
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    ui: function() {
      var imgSrc;
      designSwapper();
      if (ui.mode === "battle") {
        control.mode = battleMode;
        buildBar.draw(!buildBar.show);
        if (!buildBar.show) {
          div(function() {
            position("absolute");
            top(0);
            right(0);
            color("white");
            return ui.topButton("controls", function() {
              if (ui.contorlHelpToggle) {
                background_color("rgba(255,255,255,.6)");
              }
              return onclick(function() {
                return ui.contorlHelpToggle = !ui.contorlHelpToggle;
              });
            });
          });
          div(function() {
            position("absolute");
            top(0);
            left(0);
            color("white");
            return ui.topButton("menu");
          });
        }
        if (buildBar.show) {
          if (commander.buildQ.length > 0 && commander.money < 600) {
            imgSrc = "img/ui/tips/qued.png";
          } else {
            imgSrc = "img/ui/tips/buildbar.png";
          }
          img({
            src: imgSrc,
            width: 300,
            height: 100
          }, function() {
            position("absolute");
            bottom(84);
            return left(window.innerWidth / 2 - 84 * 5 - 60);
          });
        }
        return true;
      }
      return false;
    }
  });

  galaxyMap.moneyRain = [];

  stars.push({
    id: 'ocef3t',
    name: "Shi",
    about: "Mobile Targets",
    lossTip: "Don't let the enemy capture all the command points.",
    ai: "Targets",
    aiMoney: 150,
    difficulty: 1,
    mapSize: 0.7,
    mapNumCPs: 4,
    mapNoThings: true,
    barTips: true,
    noDesignTools: true,
    unlocks: ["Wing1x1Round", "HArmor1x2"],
    giveDesignSlot: 0,
    giveDesign: "GRQHDxcuFQ4dEw4dDxIHFBESFBQEGRkuFBQ2",
    mapSeed: 1233,
    guard: 'GBBJGBhIDBZIEBBJEBhIHBZIDBJJHBJJDxQQGRQQFxQHERQHFBQDFRAdExAdFBQ1',
    mapLayout: function() {
      var a, cp;
      sim.things = {};
      intp.things = {};
      sim.theme = {
        rockColor: [63, 85, 96, 255],
        spotColor: [115, 193, 226, 255],
        fillColor: [123, 63, 68, 255]
      };
      a = new types.SpawnPoint();
      a.side = "alpha";
      a.spawn = "alpha";
      a.pos = [-2000, 0];
      sim.things[a.id] = a;
      a = new types.SpawnPoint();
      a.side = "beta";
      a.spawn = "beta";
      a.pos = [2000, 0];
      sim.things[a.id] = a;
      cp = new types.CommandPoint();
      cp.side = "alpha";
      cp.pos = [-1000, -1000];
      sim.things[cp.id] = cp;
      cp = new types.CommandPoint();
      cp.side = "alpha";
      cp.pos = [-1000, 1000];
      sim.things[cp.id] = cp;
      cp = new types.CommandPoint();
      cp.side = "beta";
      cp.pos = [1000, -1000];
      sim.things[cp.id] = cp;
      mkUnit(this.guard, [1000, -1000], "beta", 2);
      cp = new types.CommandPoint();
      cp.side = "beta";
      cp.pos = [1000, 1000];
      sim.things[cp.id] = cp;
      return mkUnit(this.guard, [1000, 1000], "beta", 2);
    },
    draw: function() {
      var _, ref, u;
      drawIncome();
      ref = intp.things;
      for (_ in ref) {
        u = ref[_];
        if (u.unit && u.side === "beta" && u.spec !== this.guard) {
          baseAtlas.drawSprite("img/tips/fire@2x.png", [u.pos[0], u.pos[1] - 200], [1, -1], 0);
        }
        if (u.unit && u.side === "beta" && u.spec === this.guard) {
          baseAtlas.drawSprite("img/tips/stop@2x.png", [u.pos[0] - 400, u.pos[1]], [1, -1], 0);
        }
      }
    },
    tick: function() {
      return tickIncome();
    },
    ui: function() {
      var imgSrc;
      designSwapper();
      if (ui.mode === "battle") {
        if (commander.buildQ.length > 0 && commander.money < 600) {
          imgSrc = "img/ui/tips/qued.png";
          img({
            src: imgSrc,
            width: 300,
            height: 100
          }, function() {
            position("absolute");
            bottom(84);
            return left(window.innerWidth / 2 - 84 * 5 - 60);
          });
        }
      }
      return false;
    }
  });

  _pos = new v2.create();

  stars.push({
    id: 'j2ui0n8',
    name: "Eioneus",
    about: "Long range, forward-facing Plasma.",
    lossTip: "Dodgey is weak from the rear.",
    ai: "Dodgey",
    aiMoney: 1000,
    difficulty: 1,
    mapSize: 0.73,
    mapNumCPs: 4,
    mapNoThings: true,
    barTips: true,
    unlocks: ["PlasmaTurret"],
    giveDesignSlot: 0,
    giveDesign: "FBESERcuFBQEEw4dFxQHFQ4dERQHFxcuDwwdGQwdFBsSCBo2",
    mapSeed: 9934,
    draw: function() {
      return drawIncome();
    },
    tick: function() {
      return tickIncome();
    },
    ui: function() {
      designSwapper();
      return false;
    }
  });

  stars.push({
    id: 'amqfcv',
    name: "Punar",
    about: "Light, mobile fighters.",
    lossTip: "Don't let fighters take the map, push them off and hold the control points to win.",
    ai: "Fighter",
    aiMoney: 1200,
    difficulty: 1,
    mapSize: 0.8,
    mapNumCPs: 4,
    unlocks: ["Battery1x1"],
    giveDesignSlot: 1,
    giveDesign: "FBQEEw4dERUuFxUXDxEXFw4dGxcuFBQ2",
    mapSeed: 5564,
    hasDesignCriteria: true,
    ui: function() {
      designSwapper();
      if (ui.mode === "design") {
        puzzleRuleWindow("Design a fighter:", function() {
          puzzleRule({
            label: "Costs bellow $85 ($" + designMode.unit.cost + ")",
            formula: designMode.unit.cost < 85
          });
          puzzleRule({
            label: "DPS above 20dps (" + ((designMode.unit.weaponDPS * 16).toFixed(1)) + "dps)",
            formula: designMode.unit.weaponDPS * 16 > 20
          });
          return puzzleRule({
            label: "Movement speed above 300m/s (" + ((designMode.unit.maxSpeed * 16).toFixed(1)) + "m/s)",
            formula: designMode.unit.maxSpeed * 16 > 300
          });
        });
      }
      return false;
    }
  });

  stars.push({
    id: 'kvfgni1',
    name: "Lymax",
    about: "High firepower basic cruisers.",
    lossTip: "Ensure you spend all your income on fielding ships.",
    ai: "Novice",
    aiMoney: 1000,
    difficulty: 1,
    mapSize: 0.7,
    mapNumCPs: 4,
    mapNoThings: true,
    unlocks: ["HArmor2x2Angle", "HArmor2x2AngleBack"],
    giveDesignSlot: 2,
    giveDesign: "GQwHDRAHFxgHFBcSEhQEFhQEDxQHEBAEGRQHERgHFBoEGBAEDwwHGxAHEg0SFAsSFg0SExAHFRAH",
    mapSeed: 8876,
    hasDesignCriteria: true,
    draw: function() {
      return drawIncome();
    },
    tick: function() {
      return tickIncome();
    },
    ui: function() {
      designSwapper();
      if (ui.mode === "design") {
        puzzleRuleWindow("Design a cruiser that:", function() {
          puzzleRule({
            label: "Can sustain it's movement. (" + designMode.unit.moveEnergy + "E - " + designMode.unit.genEnergy + "E)",
            formula: designMode.unit.moveEnergy < designMode.unit.genEnergy
          });
          puzzleRule({
            label: "Has more than 1.5 Health / $ (" + ((designMode.unit.maxHP / designMode.unit.cost).toFixed(1)) + "HP/$)",
            formula: designMode.unit.maxHP / designMode.unit.cost > 1.5
          });
          return puzzleRule({
            label: "Movement speed above 90m/s (" + ((designMode.unit.maxSpeed * 16).toFixed(1)) + "m/s)",
            formula: designMode.unit.maxSpeed * 16 > 90
          });
        });
      }
      return false;
    }
  });

  stars.push({
    id: '89m4glg',
    name: "Nero",
    about: "High HP, slower battleships.",
    lossTip: "Ensure you spend all your income on fielding ships.",
    ai: "Tank",
    aiMoney: 1200,
    difficulty: 1,
    mapSize: 0.7,
    mapNumCPs: 4,
    mapNoThings: true,
    unlocks: ["PlasmaTurret"],
    giveDesignSlot: 3,
    giveDesign: "DRAHEBAEGhRIEBhIGBhIChJIFxQHHhJIFBYEExoHERQHDhRIGBAEGxAHFRoHFBMSFQ4HFBESEw4HDgxJCg5JGgxJHg5J",
    mapSeed: 2231,
    hasDesignCriteria: true,
    draw: function() {
      return drawIncome();
    },
    tick: function() {
      return tickIncome();
    },
    ui: function() {
      designSwapper();
      if (ui.mode === "design") {
        puzzleRuleWindow("Design a battleship that:", function() {
          puzzleRule({
            label: "Can fire for 10 seconds. (" + ((designMode.unit.energy / (designMode.unit.fireEnergy * 16)).toFixed(1)) + "s)",
            formula: designMode.unit.energy / (designMode.unit.fireEnergy * 16) > 10
          });
          puzzleRule({
            label: "Has more than 1 Health / $ (" + ((designMode.unit.maxHP / designMode.unit.cost).toFixed(1)) + "HP/$)",
            formula: designMode.unit.maxHP / designMode.unit.cost > 1
          });
          puzzleRule({
            label: "DPS above 65dps (" + ((designMode.unit.weaponDPS * 16).toFixed(1)) + "dps)",
            formula: designMode.unit.weaponDPS * 16 > 65
          });
          return puzzleRule({
            label: "Movement speed above 55m/s (" + ((designMode.unit.maxSpeed * 16).toFixed(1)) + "m/s)",
            formula: designMode.unit.maxSpeed * 16 > 55
          });
        });
      }
      return false;
    }
  });

  stars.push({
    id: 'lq82oro',
    name: "Soyulos",
    about: "Torpedo Cruisers.",
    lossTip: "Torpman has ranged torpedoes, avoid them.",
    ai: "TorpMan",
    aiMoney: 1000,
    difficulty: 1,
    mapSize: 0.8,
    mapNumCPs: 4,
    mapNoThings: true,
    unlocks: ["Mount270"],
    mapSeed: 5666
  });

  stars.push({
    id: 'o2fash',
    name: "Antin",
    about: "",
    ai: "Yarki",
    aiMoney: 1400,
    difficulty: 1,
    mapSize: 0.7212449601385742,
    mapNumCPs: 4,
    unlocks: ["VArmor1x2IBeam", "VArmor1x2Corner4", "VArmor1x1Corner2"],
    mapSeed: 9876
  });

  stars.push({
    id: 'rg75pdo',
    name: "Chronos",
    about: "Anti-fighter Flak ships",
    lossTip: "BatteryRam runs on batteries, and has no staying power to chew through armour.",
    ai: "BatteryRam",
    aiMoney: 1000,
    difficulty: 1,
    mapSize: 0.8,
    mapNumCPs: 4,
    unlocks: ["FlackTurret"],
    mapSeed: 4554
  });

  stars.push({
    id: 'iifg0h',
    name: "Noptri",
    about: "Fighter Swarm",
    lossTip: "Holding your home point with a large amount of firepower is important vs an aggressive swarm.",
    ai: "AlphaSwarm",
    aiMoney: 2000,
    difficulty: 1,
    mapSize: 0.7797135706990956,
    mapNumCPs: 4,
    unlocks: ["UArmor1x1Angle", "UArmor1x1AngleBack"],
    mapSeed: 2345
  });

  stars.push({
    id: 'j56hbdo',
    name: "Amurru",
    about: "Armoured Fighter Swarm",
    lossTip: "Batteries eventually run down, while reactors provide continuous power to weapons and engines.",
    ai: "BetaSwarm",
    aiMoney: 1800,
    difficulty: 1,
    mapSize: 0.7170660080853849,
    mapNumCPs: 4,
    unlocks: ["Wing1x1Notch", "HArmor1x1Angle", "HArmor1x1AngleBack"],
    mapSeed: 9883
  });

  stars.push({
    id: 'klhsi6',
    name: "Angel Falls",
    about: "AutoCannon Fighters",
    ai: "BladeRanger",
    aiMoney: 1800,
    difficulty: 1,
    mapSize: 1.1,
    mapNumCPs: 6,
    unlocks: ["AutoTurret"],
    mapSeed: 8754
  });

  stars.push({
    id: 'ifb162o',
    name: "Zephyr",
    about: "",
    ai: "Kornine",
    aiMoney: 1800,
    difficulty: 1,
    mapSize: 0.6678998027695343,
    mapNumCPs: 4,
    unlocks: ["EnergyTransfer", "Reactor2x2"],
    mapSeed: 2355
  });

  stars.push({
    id: 'lples3g',
    name: "Kini",
    about: "",
    ai: "TurtleFence",
    aiMoney: 2000,
    difficulty: 1,
    mapSize: 0.8099276877008378,
    mapNumCPs: 4,
    unlocks: ["ShieldGen1x1"],
    mapSeed: 4532
  });

  stars.push({
    id: 'kb83bsg',
    name: "Serpi",
    about: "",
    ai: "FighterBomber",
    difficulty: 1,
    mapSize: 0.8482277991715819,
    mapNumCPs: 4,
    unlocks: ["Engine03"],
    mapSeed: 9938
  });

  stars.push({
    id: 'nhq4sdg',
    name: "Minnus",
    about: "",
    ai: "LightShower",
    difficulty: 2,
    mapSize: 1.3014241704717278,
    mapNumCPs: 6,
    unlocks: ["TargetingMod"],
    mapSeed: 1788
  });

  stars.push({
    id: 'i1ocdqo',
    name: "Orion",
    about: "Point Defense to shoot down projectiles.",
    lossTip: "Point Defense only works against Torpedoes, Missiles and Artillery.",
    ai: "PointDefender",
    difficulty: 2,
    mapSize: 1,
    mapNumCPs: 5,
    unlocks: ["PDTurret"],
    mapSeed: 2334,
    mapLayout: function() {
      var _, cp, ref, results, u;
      ref = sim.things;
      results = [];
      for (_ in ref) {
        cp = ref[_];
        if (cp.commandPoint) {
          if (cp.side === "alpha") {
            u = mkUnit('FBQBFBEYGBBJEBBJEBhIGBhIERQWFxQWFBcYFBQv', [cp.pos[0], cp.pos[1] + 170], cp.side);
            u.rot += Math.PI;
            u.color = [20, 200, 20, 255];
            u = mkUnit('FBQBFBEYGBBJEBBJEBhIGBhIERQWFxQWFBcYFBQv', [cp.pos[0], cp.pos[1] - 170], cp.side);
            u.rot += Math.PI;
            u.color = [20, 200, 20, 255];
            u = mkUnit('FBQBFBEYGBBJEBBJEBhIGBhIERQWFxQWFBcYFBQv', [cp.pos[0] + 170, cp.pos[1]], cp.side);
            u.rot += Math.PI;
            u.color = [20, 200, 20, 255];
            u = mkUnit('FBQBFBEYGBBJEBBJEBhIGBhIERQWFxQWFBcYFBQv', [cp.pos[0] - 170, cp.pos[1]], cp.side);
            u.rot += Math.PI;
            results.push(u.color = [20, 200, 20, 255]);
          } else {
            results.push(u = mkUnit('GBoEFx0XDx0KGR0KGxsKDRsKEBoEFB8SFBwEFx8KFBkSER0XER8KDRlGDxdGGRdGGxlGFBUYERVGFxVGEhcJFhcJEBoyGBoyFBwy', cp.pos, cp.side));
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    ui: function() {
      designSwapper();
      if (ui.mode === "design") {
        puzzleRuleWindow("Design a battleship that:", function() {
          puzzleRule({
            label: "At least 2000m range (" + (designMode.unit.weaponRange.toFixed(1)) + "m)",
            formula: designMode.unit.weaponRange > 2000
          });
          puzzleRule({
            label: "DPS above 10dps (" + ((designMode.unit.weaponDPS * 16).toFixed(1)) + "dps)",
            formula: designMode.unit.weaponDPS * 16 > 10
          });
          return puzzleRule({
            label: "Energy greater then weapon drain. (" + ((designMode.unit.genEnergy * 16).toFixed(1)) + "E > " + ((designMode.unit.fireEnergy * 16).toFixed(1)) + "E)",
            formula: designMode.unit.genEnergy > designMode.unit.fireEnergy
          });
        });
      }
      return false;
    }
  });

  stars.push({
    id: '0rn9hbo',
    name: "Calius",
    about: "Hit and Run torpedo destroyers",
    ai: "RocketMan",
    difficulty: 2,
    mapSize: 0.8087868114933371,
    mapNumCPs: 5,
    unlocks: ["TorpTurret"],
    mapSeed: 1436
  });

  stars.push({
    id: '7dcrjg',
    name: "Boliz",
    about: "Battery powered fighters.",
    ai: "Cython",
    difficulty: 2,
    mapSize: 0.8,
    mapNumCPs: 4,
    unlocks: ["Wing1x2", "Battery2x1"],
    mapSeed: 7865
  });

  stars.push({
    id: 'pj6hlio',
    name: "Orome",
    about: "",
    ai: "Waxon",
    difficulty: 2,
    mapSize: 1.1186667210422456,
    mapNumCPs: 6,
    unlocks: ["ShieldGen2x1"],
    mapSeed: 8764
  });

  stars.push({
    id: 'fkjv44',
    name: "Delphini",
    about: "Important stellar library guarded by two generals.",
    ai: "BaitandMissile",
    difficulty: 2,
    mapSize: 1.288371010031551,
    mapNumCPs: 6,
    unlocks: ["MissileTurret"],
    mapSeed: 9865
  });

  stars.push({
    id: 'hj440sg',
    name: "Vortu",
    about: "",
    ai: "CubeCollective",
    difficulty: 2,
    mapSize: 1.0952299905009568,
    mapNumCPs: 6,
    unlocks: ["Engine01"],
    mapSeed: 5564
  });

  stars.push({
    id: '45k6uko',
    name: "Jenai",
    about: "Powerful but sluggish battleships.",
    lossTip: "SlowPoke can only shoot forward.",
    ai: "Slowpoke",
    difficulty: 2,
    mapSize: 0.7,
    mapNumCPs: 6,
    mapNoThings: true,
    unlocks: ["HArmor2x1", "Engine02"],
    mapSeed: 8855,
    draw: function() {
      var k, ref, results, unit;
      ref = intp.things;
      results = [];
      for (k in ref) {
        unit = ref[k];
        if (unit.unit && unit.side !== commander.side) {
          results.push(drawAllArcs(unit));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    ui: function() {
      if (ui.mode === "design") {
        img({
          src: "img/ui/tips/designChange.png",
          width: 400,
          height: 100
        }, function() {
          position("absolute");
          bottom(84);
          return left(window.innerWidth / 2 - 84 * 5 + 10);
        });
      }
      return false;
    }
  });

  stars.push({
    id: '3dmjdro',
    name: "Bani",
    about: "",
    ai: "AlphaStriker",
    difficulty: 2,
    mapSize: 0.7085130656138062,
    mapNumCPs: 4,
    unlocks: ["DamageMod"],
    mapSeed: 8933
  });

  stars.push({
    id: 'tnad808',
    name: "Mali",
    about: "",
    ai: "SuperBelfry",
    difficulty: 2,
    mapSize: 0.6735611163312569,
    mapNumCPs: 4,
    unlocks: ["ShieldGen2x2"],
    mapSeed: 6543
  });

  stars.push({
    id: 'gdgnd2o',
    name: "Lyra Acallaris",
    about: "Naturally occurring gravity waves in this system caused the inhabitants to harness their power and to develop gravity weapons.",
    ai: "WaveMotion",
    difficulty: 2,
    mapSize: 1.1048907704651356,
    mapNumCPs: 6,
    unlocks: ["WavePullTurret", "WavePushTurret"],
    mapSeed: 8732
  });

  stars.push({
    id: 'avrm6p',
    name: "Angith",
    about: "",
    ai: "DarkStar",
    difficulty: 3,
    mapSize: 1.2582162277773024,
    mapNumCPs: 6,
    unlocks: ["HArmor1x1", "CloakGenerator"],
    mapSeed: 9045
  });

  stars.push({
    id: 'fd08nfg',
    name: "Tabiz",
    about: "",
    ai: "FireFly",
    aiMoney: 2600,
    difficulty: 3,
    mapSize: 1.2976905869320035,
    mapNumCPs: 6,
    unlocks: ["Engine07"],
    mapSeed: 7234
  });

  stars.push({
    id: '6kn69oo',
    name: "Chani",
    about: "",
    ai: "Sidewinder",
    aiMoney: 2800,
    difficulty: 3,
    mapSize: 1.2164454489946366,
    mapNumCPs: 6,
    unlocks: ["HArmor1x2Front2", "HArmor1x2Back2", "SidewinderTurret"],
    mapSeed: 1256
  });

  stars.push({
    id: 's3255c',
    name: "Aker",
    about: "",
    type: "fort",
    ai: "FlamethrowerArmadillo",
    difficulty: 2,
    mapSize: 0.7285537156043573,
    mapNumCPs: 4,
    unlocks: ["HArmor1x2Font1", "HArmor2x2Front1", "FlameTurret"],
    mapSeed: 9883
  });

  stars.push({
    id: 'cjph01g',
    name: "Kaylis",
    about: "",
    ai: "Orbiter",
    difficulty: 2,
    mapSize: 0.6785172562580556,
    mapNumCPs: 12,
    aiMoney: 2200,
    unlocks: ["Wing2x1", "Solar1x1", "Solar2x2", "Solar3x3"],
    mapSeed: 1342
  });

  stars.push({
    id: 'gru669o',
    name: "Apep",
    about: "",
    ai: "BladeRanger",
    aiMoney: 2100,
    difficulty: 2,
    mapSize: 0.8578058236045762,
    mapNumCPs: 6,
    unlocks: ["VArmor1x1Corner1", "VArmor1x1Corner3", "VArmor1x1Hook"],
    mapSeed: 3444
  });

  stars.push({
    id: 'ockunt8',
    name: "Irmo",
    about: "",
    ai: "BattleStar",
    difficulty: 3,
    mapSize: 1.6373389302752912,
    mapNumCPs: 6,
    unlocks: ["HArmor2x2Front2", "HArmor2x2Back2"],
    mapSeed: 3455
  });

  stars.push({
    id: '45ucun8',
    name: "Antaris",
    about: "",
    ai: "Electro",
    difficulty: 2,
    mapSize: 0.8022207571892067,
    mapNumCPs: 4,
    unlocks: ["EMPGun"],
    mapSeed: 3345
  });

  stars.push({
    id: 'lbrgh6',
    name: "Massgib",
    about: "",
    ai: "BullDogs",
    difficulty: 2,
    type: "fort",
    mapSize: 0.863845500536263,
    mapNumCPs: 4,
    unlocks: ["Mount30"],
    mapSeed: 4555,
    aiMoney: 1400
  });

  stars.push({
    id: '63t1isg',
    name: "Korak Labs",
    about: "Some of the largest detonations happend here.",
    ai: "NukeSwarm",
    aiMoney: 5000,
    difficulty: 2,
    mapSize: 1,
    mapNumCPs: 6,
    unlocks: ["AOEWarhead"],
    mapSeed: 4333
  });

  stars.push({
    id: '637tk68',
    name: "Kono Testing Grounds",
    about: "Many nuclear tests have left the space irradiated.",
    ai: "NukeSwarm",
    aiMoney: 15000,
    difficulty: 2,
    mapSize: 1.2,
    mapNumCPs: 8,
    unlocks: ["ShapedWarhead"],
    mapSeed: 9022
  });

  stars.push({
    id: 'k4nnvl8',
    name: "Librae",
    about: "",
    ai: "Furia",
    difficulty: 2,
    mapSize: 1.2664555584080517,
    aiMoney: 2500,
    mapNumCPs: 6,
    unlocks: ["Mount360"],
    mapSeed: 9111
  });

  stars.push({
    id: 'rqvuj08',
    name: "Alki",
    about: "",
    ai: "Belfry",
    difficulty: 2,
    mapSize: 1.0320802667178213,
    mapNumCPs: 6,
    unlocks: ["RingTurret"],
    mapSeed: 3422
  });

  stars.push({
    id: '9kq7oug',
    name: "Tannis",
    about: "",
    ai: "LazerBlade",
    aiMoney: 2800,
    difficulty: 3,
    mapSize: 1.1704251921735704,
    mapNumCPs: 6,
    unlocks: ["Reactor1x2"],
    mapSeed: 9877
  });

  stars.push({
    id: '31t2obg',
    name: "Pegasi",
    about: "",
    ai: "ThePounder",
    difficulty: 3,
    mapSize: 1.0324680821038783,
    mapNumCPs: 6,
    unlocks: ["BombGun"],
    mapSeed: 7666
  });

  stars.push({
    id: 'g710q5',
    name: "Eridu",
    about: "",
    ai: "CreepingHoard",
    difficulty: 3,
    mapSize: 1.4514648726675659,
    mapNumCPs: 8,
    unlocks: ["Wing1x1Angle", "Mount10Range"],
    mapSeed: 7123
  });

  stars.push({
    id: 'rdlm558',
    name: "Dou",
    about: "",
    ai: "Yarki",
    aiMoney: 2600,
    difficulty: 2,
    mapSize: 0.6138879344332963,
    mapNumCPs: 4,
    unlocks: ["Wing2x2"],
    mapSeed: 3422
  });

  stars.push({
    id: '0v1jtk8',
    name: "Prani",
    about: "",
    type: "fort",
    ai: "Razorback",
    difficulty: 2,
    mapSize: 0.8728945788927376,
    mapNumCPs: 4,
    unlocks: ["UArmor1x2", "UArmor2x1"],
    mapSeed: 3422
  });

  stars.push({
    id: '90i41rg',
    name: "Galli",
    about: "",
    type: "fort",
    ai: "Liberty",
    difficulty: 2,
    mapSize: 1.301776747405529,
    mapNumCPs: 6,
    unlocks: ["HArmor2x2"],
    mapSeed: 7722
  });

  stars.push({
    id: 'cucp8o',
    name: "Cerberi",
    about: "",
    type: "2v2",
    alpha: ["Player", "CreepingHoard"],
    beta: ["BullDogs", "Orblin"],
    difficulty: 2,
    mapSize: 1.1530530820600688,
    mapNumCPs: 6,
    unlocks: ["Battery1x2", "HeavyPDTurret"],
    mapSeed: 3322
  });

  stars.push({
    id: '4acnhu8',
    name: "Boyar Denz",
    about: "",
    ai: "Anubis",
    difficulty: 2,
    mapSize: 1.2120997282676398,
    mapNumCPs: 6,
    unlocks: ["ReloaderMod"],
    mapSeed: 9003
  });

  stars.push({
    id: '0kgoj8',
    name: "Octantis",
    about: "",
    ai: "Rearguard",
    aiMoney: 2200,
    difficulty: 2,
    mapSize: 1.3513613959774375,
    mapNumCPs: 6,
    unlocks: ["Mount360Micro"],
    mapSeed: 8753,
    ui: function() {
      designSwapper();
      if (ui.mode === "design") {
        puzzleRuleWindow("Design a bomber:", function() {
          var j, len, ref, shotEnergy, w;
          puzzleRule({
            label: "Weapon damage grater then $306 ($" + (designMode.unit.weaponDamage.toFixed(1)) + "d)",
            formula: designMode.unit.weaponDamage > 306
          });
          puzzleRule({
            label: "Movement speed above 300m/s (" + ((designMode.unit.maxSpeed * 16).toFixed(1)) + "m/s)",
            formula: designMode.unit.maxSpeed * 16 > 300
          });
          shotEnergy = 0;
          ref = designMode.unit.weapons;
          for (j = 0, len = ref.length; j < len; j++) {
            w = ref[j];
            shotEnergy += w.shotEnergy;
          }
          return puzzleRule({
            label: "More then double weapon energy ($" + ((designMode.unit.storeEnergy / shotEnergy).toFixed(2)) + ")",
            formula: designMode.unit.storeEnergy / shotEnergy > 2
          });
        });
      }
      return false;
    }
  });

  stars.push({
    id: 'esjo00o',
    name: "Aethaldus",
    about: "",
    ai: "RushDown",
    difficulty: 2,
    mapSize: 0.606543418765068,
    mapNumCPs: 4,
    unlocks: ["Reactor1x1"],
    mapSeed: 221
  });

  stars.push({
    id: '4ofptho',
    name: "Polystratus",
    about: "",
    ai: "Micor",
    difficulty: 2,
    mapSize: 1.2934446890838445,
    mapNumCPs: 6,
    unlocks: ["Mount180"],
    mapSeed: 5433
  });

  stars.push({
    id: 'rnro1eo',
    name: "Hemithea",
    about: "",
    ai: "SiegeCore",
    aiMoney: 2000,
    difficulty: 3,
    mapSize: 1.328067924361676,
    mapNumCPs: 6,
    unlocks: ["ArtilleryTurret"],
    mapSeed: 5223
  });

  stars.push({
    id: 'r85ucl',
    name: "Pavo",
    about: "",
    ai: "AssaultandBattery",
    difficulty: 3,
    mapSize: 1.587393354368396,
    mapNumCPs: 8,
    unlocks: ["Battery2x2"],
    mapSeed: 4555
  });

  stars.push({
    id: 'no4s0bo',
    name: "Aldebaran",
    about: "The armies are gathering. This will be a battle to remmber.",
    alpha: ["Player", "CreepingHoard", "MBT"],
    beta: ["Furia", "CreepingHoard", "BullDogs"],
    type: "3v3",
    difficulty: 3,
    mapSize: 1.7243340934859588,
    mapNumCPs: 8,
    unlocks: ["UArmor1x1"],
    mapSeed: 2344
  });

  stars.push({
    id: 'bd1s1jo',
    name: "Cronark",
    about: "",
    ai: "LongPoint",
    difficulty: 2,
    mapSize: 0.7398028523661195,
    mapNumCPs: 4,
    unlocks: ["BulletSpeedMod"],
    mapSeed: 9002
  });

  stars.push({
    id: 'o6n3l68',
    name: "Augria",
    about: "",
    ai: "Dreadnaught",
    difficulty: 2,
    mapSize: 1.3617570428177714,
    mapNumCPs: 6,
    unlocks: ["VArmor1x2End", "VArmor1x1CornerBack"],
    mapSeed: 6677
  });

  stars.push({
    id: 'tn19i28',
    name: "Orithyia",
    about: "",
    ai: "DoomTrain",
    difficulty: 2,
    mapSize: 1.0143948028795422,
    mapNumCPs: 6,
    unlocks: ["HArmor2x2Back1", "HArmor1x2Back1"],
    mapSeed: 6377
  });

  stars.push({
    id: 'u72hl0o',
    name: "Porphyrion",
    about: "",
    ai: "SparkShower",
    difficulty: 2,
    mapSize: 1.219316438306123,
    mapNumCPs: 6,
    unlocks: ["TeslaTurret"],
    mapSeed: 3555
  });

  stars.push({
    id: 'e0100v8',
    name: "Omega",
    about: "",
    ai: "Ficon",
    aiMoney: 2500,
    difficulty: 2,
    mapSize: 1.0045061607845127,
    mapNumCPs: 6,
    unlocks: ["VArmor1x2SideBar", "VArmor1x2SideBarFilled"],
    mapSeed: 6754
  });

  stars.push({
    id: 'obh98f',
    name: "Sagitta",
    about: "",
    ai: "BeamMan",
    difficulty: 2,
    mapSize: 1.2050061562098562,
    mapNumCPs: 6,
    unlocks: ["HeavyBeamTurret"],
    mapSeed: 5673
  });

  stars.push({
    id: 'tb74kro',
    name: "Drakon",
    about: "",
    alpha: ["Player", "CreepingHoard"],
    beta: ["Razorback", "FighterBomber"],
    type: "2v2",
    difficulty: 2,
    mapSize: 1.2595503549091518,
    mapNumCPs: 6,
    unlocks: ["OverKillAi"],
    mapSeed: 9873
  });

  stars.push({
    id: 'qki9tjg',
    name: "Tarandi",
    about: "Here sits of one the bosses.",
    ai: "Tempest",
    type: "boss",
    difficulty: 3,
    mapSize: 1,
    mapNumCPs: 6,
    unlocks: [],
    mapSeed: 3773
  });

  stars.push({
    id: '161kekg',
    name: "Perkunas",
    about: "Here is one of the bosses. You must kill all of them to win the game.",
    ai: "MasterMind",
    type: "boss",
    difficulty: 1.5,
    mapSize: 2,
    mapNumCPs: 8,
    unlocks: [],
    mapSeed: 3441,
    addAIUnits: function() {
      var _, cp, ref, results, u;
      ref = sim.things;
      results = [];
      for (_ in ref) {
        cp = ref[_];
        if (cp.commandPoint) {
          if (cp.side === "beta") {
            u = mkUnit(sim.players[1].buildBar[9], [cp.pos[0], cp.pos[1]], cp.side);
            u.owner = 1;
            results.push(u.rot = Math.PI / 4);
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  });

  stars.push({
    id: 'er44698',
    name: "Leporis",
    about: "Here is one of the bosses. You must kill all of them to win the game.",
    ai: "DeathStrike",
    type: "boss",
    difficulty: 2,
    mapSize: 1.1906210828572512,
    mapNumCPs: 6,
    unlocks: [],
    mapSeed: 345,
    addAIUnits: function() {
      var _, cp, ref, results, u;
      ref = sim.things;
      results = [];
      for (_ in ref) {
        cp = ref[_];
        if (cp.commandPoint) {
          if (cp.side === "beta") {
            u = mkUnit(sim.players[1].buildBar[9], [cp.pos[0], cp.pos[1]], cp.side);
            u.owner = 1;
            results.push(u.rot = Math.PI / 4);
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  });

  stars.push({
    id: '3nkf8s8',
    name: "Lachesis",
    about: "Here is one of the bosses. You must kill all of them to win the game.",
    ai: "SwarmLord",
    type: "boss",
    difficulty: 3,
    mapSize: 1.2775459574535488,
    mapNumCPs: 6,
    unlocks: [],
    mapSeed: 1455
  });

  stars.push({
    id: 'b9hhch8',
    name: "Sceptri",
    about: "Here is one of the bosses. You must kill all of them to win the game.",
    ai: "Zeus",
    type: "boss",
    difficulty: 3,
    mapSize: 1.365885538328439,
    mapNumCPs: 6,
    unlocks: [],
    mapSeed: 8677
  });

  galaxyMap["export"] = function() {
    return console.log("galaxyMap.locations = " + (JSON.stringify(galaxyMap.locations)) + "\ngalaxyMap.paths = " + (JSON.stringify(galaxyMap.paths)));
  };

  galaxyMap.locations = {
    "kiusd6o": [1223, -1494],
    "ocef3t": [1300, -1340],
    "j2ui0n8": [1450, -1190],
    "amqfcv": [1509, -983],
    "kvfgni1": [1684, -760],
    "89m4glg": [1532, -729],
    "lq82oro": [1508, -519],
    "rg75pdo": [1623, -322],
    "nhq4sdg": [1049, -602],
    "i1ocdqo": [970, -339],
    "0rn9hbo": [792, -374],
    "iifg0h": [1649, -138],
    "j56hbdo": [1517, -126],
    "7dcrjg": [1113, -178],
    "klhsi6": [1733, -36],
    "lples3g": [551, 169],
    "o2fash": [1773, -390],
    "ifb162o": [1407, 338],
    "pj6hlio": [356, -282],
    "fkjv44": [-235, 382],
    "hj440sg": [-205, -312],
    "45k6uko": [663, -285],
    "3dmjdro": [943, 213],
    "tnad808": [366, -916],
    "gdgnd2o": [593, -88],
    "avrm6p": [-841, 440],
    "fd08nfg": [-64, 727],
    "6kn69oo": [419, 1191],
    "s3255c": [415, 46],
    "cjph01g": [25, 585],
    "gru669o": [-8, 39],
    "ockunt8": [-1127, -654],
    "45ucun8": [536, -736],
    "lbrgh6": [661, -454],
    "63t1isg": [-523, -1208],
    "637tk68": [-749, -1136],
    "k4nnvl8": [95, 1110],
    "rqvuj08": [283, 619],
    "9kq7oug": [-1543, 34],
    "31t2obg": [-1627, 386],
    "g710q5": [-1476, 1032],
    "rdlm558": [63, -596],
    "0v1jtk8": [-365, -664],
    "90i41rg": [-925, 31],
    "cucp8o": [-568, 716],
    "4acnhu8": [23, 445],
    "0kgoj8": [794, 172],
    "esjo00o": [-430, 217],
    "4ofptho": [767, 401],
    "kb83bsg": [1274, 494],
    "rnro1eo": [182, -1115],
    "r85ucl": [674, 593],
    "no4s0bo": [-1622, 694],
    "bd1s1jo": [-143, -1212],
    "o6n3l68": [-784, -334],
    "tn19i28": [-525, -150],
    "u72hl0o": [109, -406],
    "e0100v8": [336, 223],
    "obh98f": [293, 425],
    "tb74kro": [-258, 1012],
    "qki9tjg": [-1269, 1360],
    "161kekg": [-1394, -581],
    "er44698": [-319, 1258],
    "3nkf8s8": [-1739, 118],
    "b9hhch8": [696, 1172]
  };

  galaxyMap.paths = [["kiusd6o", "ocef3t"], ["ocef3t", "j2ui0n8"], ["j2ui0n8", "amqfcv"], ["amqfcv", "89m4glg"], ["amqfcv", "kvfgni1"], ["lq82oro", "rg75pdo"], ["0v1jtk8", "ockunt8"], ["161kekg", "ockunt8"], ["31t2obg", "no4s0bo"], ["31t2obg", "9kq7oug"], ["3nkf8s8", "9kq7oug"], ["637tk68", "63t1isg"], ["6kn69oo", "b9hhch8"], ["6kn69oo", "k4nnvl8"], ["avrm6p", "no4s0bo"], ["avrm6p", "cucp8o"], ["g710q5", "qki9tjg"], ["g710q5", "no4s0bo"], ["iifg0h", "rg75pdo"], ["iifg0h", "klhsi6"], ["iifg0h", "j56hbdo"], ["j56hbdo", "rg75pdo"], ["nhq4sdg", "nhq4sdg"], ["i1ocdqo", "i1ocdqo"], ["lq82oro", "7dcrjg"], ["7dcrjg", "j56hbdo"], ["o2fash", "klhsi6"], ["bd1s1jo", "rnro1eo"], ["i1ocdqo", "0rn9hbo"], ["j56hbdo", "ifb162o"], ["45ucun8", "rdlm558"], ["o6n3l68", "0v1jtk8"], ["kvfgni1", "lq82oro"], ["89m4glg", "lq82oro"], ["89m4glg", "nhq4sdg"], ["kvfgni1", "o2fash"], ["kvfgni1", "rg75pdo"], ["nhq4sdg", "i1ocdqo"], ["lbrgh6", "0rn9hbo"], ["lbrgh6", "45ucun8"], ["45ucun8", "tnad808"], ["rnro1eo", "tnad808"], ["bd1s1jo", "63t1isg"], ["obh98f", "4acnhu8"], ["4acnhu8", "fkjv44"], ["fkjv44", "esjo00o"], ["ifb162o", "3dmjdro"], ["3dmjdro", "0kgoj8"], ["klhsi6", "ifb162o"], ["0kgoj8", "lples3g"], ["lples3g", "e0100v8"], ["e0100v8", "obh98f"], ["3dmjdro", "4ofptho"], ["s3255c", "e0100v8"], ["s3255c", "gdgnd2o"], ["gdgnd2o", "45k6uko"], ["45k6uko", "lbrgh6"], ["u72hl0o", "hj440sg"], ["gdgnd2o", "pj6hlio"], ["pj6hlio", "u72hl0o"], ["hj440sg", "tn19i28"], ["rdlm558", "0v1jtk8"], ["4acnhu8", "gru669o"], ["gru669o", "hj440sg"], ["rdlm558", "bd1s1jo"], ["rdlm558", "hj440sg"], ["ifb162o", "kb83bsg"], ["kb83bsg", "3dmjdro"], ["o6n3l68", "ockunt8"], ["o6n3l68", "tn19i28"], ["rqvuj08", "fd08nfg"], ["o6n3l68", "90i41rg"], ["90i41rg", "avrm6p"], ["90i41rg", "9kq7oug"], ["r85ucl", "rqvuj08"], ["tb74kro", "er44698"], ["tb74kro", "k4nnvl8"], ["tb74kro", "cucp8o"], ["esjo00o", "cucp8o"], ["4ofptho", "r85ucl"], ["4acnhu8", "cjph01g"], ["esjo00o", "tn19i28"]];

  unlocks = {};

  for (j = 0, len = stars.length; j < len; j++) {
    star = stars[j];
    star.pos = galaxyMap.locations[star.id];
    if (!star.pos) {
      console.log("star without position", star.name);
    }
    if (!star.mapSeed) {
      console.log("star without mapSeed", star.name);
    }
    ref = star.unlocks;
    for (l = 0, len1 = ref.length; l < len1; l++) {
      partName = ref[l];
      if (!parts[partName]) {
        console.error("Part is not valid " + partName + " at " + star.name);
      }
      if (unlocks[partName] != null) {
        console.error("Part already unlocked " + partName + " at " + star.name);
      } else {
        unlocks[partName] = true;
      }
    }
  }

}).call(this);
;


