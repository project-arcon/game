(function () {
  var blue,
    bluebrown,
    chooseNumber,
    chooseOne,
    darkness,
    fadered,
    genBox,
    genClouds,
    genDebree,
    genDodads,
    genRocks,
    genSymetrical,
    grayblue,
    greenbrown,
    greenpurple,
    lemondarkred,
    main,
    moonyellow,
    pinkpurple,
    randomVector,
    tanslate,
    tealwhite,
    whitepurple,
    yellowcyan,
    yellowpuce;

  window.mapping = {};

  chooseNumber = function (n) {
    var i, j;
    i = Math.floor(mr.random() * n) + 1;
    j = i.toString();
    if (j.length === 1) {
      return "0" + j;
    }
    return j;
  };

  chooseOne = function (l) {
    return l[Math.floor(mr.random() * l.length)];
  };

  randomVector = function (v) {
    v[0] = mr.random() - 0.5;
    v[1] = mr.random() - 0.5;
    return v2.norm(v);
  };

  main = {
    rockColor: [63, 85, 96, 255],
    spotColor: [115, 193, 226, 255],
    fillColor: [123, 63, 68, 255],
  };

  grayblue = {
    rockColor: [127, 140, 141, 255],
    spotColor: [189, 195, 199, 255],
    fillColor: [44, 62, 80, 255],
  };

  blue = {
    rockColor: [211, 241, 240, 255],
    spotColor: [24, 203, 193, 255],
    fillColor: [28, 107, 132, 255],
  };

  fadered = {
    rockColor: [34, 32, 86, 255],
    spotColor: [255, 187, 132, 255],
    fillColor: [150, 28, 22, 225],
  };

  tealwhite = {
    rockColor: [209, 202, 185, 255],
    spotColor: [159, 200, 170, 255],
    fillColor: [85, 134, 120, 255],
  };

  whitepurple = {
    rockColor: [23, 41, 117, 255],
    spotColor: [188, 210, 219, 255],
    fillColor: [106, 86, 133, 255],
  };

  darkness = {
    rockColor: [27, 36, 40, 255],
    spotColor: [202, 222, 232, 255],
    fillColor: [48, 62, 75, 255],
  };

  moonyellow = {
    rockColor: [171, 164, 136, 255],
    spotColor: [228, 211, 159, 255],
    fillColor: [55, 81, 92, 255],
  };

  pinkpurple = {
    rockColor: [181, 154, 146, 255],
    spotColor: [220, 171, 169, 255],
    fillColor: [90, 54, 99, 255],
  };

  greenbrown = {
    rockColor: [50, 36, 40, 255],
    spotColor: [178, 188, 170, 255],
    fillColor: [100, 64, 62, 255],
  };

  bluebrown = {
    rockColor: [123, 109, 141, 255],
    spotColor: [132, 153, 177, 255],
    fillColor: [73, 59, 42, 255],
  };

  greenpurple = {
    rockColor: [77, 83, 130, 255],
    spotColor: [140, 186, 128, 255],
    fillColor: [81, 70, 99, 255],
  };

  lemondarkred = {
    rockColor: [193, 188, 106, 255],
    spotColor: [200, 180, 125, 255],
    fillColor: [120, 25, 25, 255],
  };

  tanslate = {
    rockColor: [61, 44, 46, 255],
    spotColor: [173, 144, 136, 255],
    fillColor: [66, 76, 85, 255],
  };

  yellowpuce = {
    rockColor: [230, 155, 46, 255],
    spotColor: [210, 190, 99, 255],
    fillColor: [55, 43, 48, 255],
  };

  yellowcyan = {
    rockColor: [228, 207, 116, 255],
    spotColor: [185, 175, 95, 255],
    fillColor: [60, 133, 111, 255],
  };

  mapping.themes = [main, main, grayblue, blue, fadered, tealwhite, whitepurple, darkness, moonyellow, pinkpurple, greenbrown, bluebrown, greenpurple, lemondarkred, tanslate, yellowpuce];

  mapping.generate = function (seed) {
    var a, fillColor, fns, r, spotColor;
    window.mr = new MTwist(seed);
    sim.things = {};
    switch (sim.startedInServerType) {
      case "survival":
        survival.genSurvival();
        break;
      default:
        genSymetrical();
        break;
    }
    if (true || mr.random() < 0.1) {
      //sim.theme = chooseOne(mapping.themes);
      sim.theme = shuffle(mapping.themes).pop();
    } else {
      a = mr.random();
      spotColor = colors.hsl2rgb([a, 0.5, 0.7, 255]);
      fillColor = colors.hsl2rgb([a + mr.random() * 0.8 - 0.4, 0.3, 0.2, 255]);
      sim.theme = {
        rockColor: spotColor,
        spotColor: spotColor,
        fillColor: fillColor,
      };
    }
    if (sim.makeRocks) {
      fns = [genClouds, genDebree, genRocks, genDodads];
      fns.pop()();
      fns.pop()();
      fns.pop()();
      fns.pop()();
      /*
      fns = shuffle([genClouds, genDebree, genRocks, genDodads]);
      r = mr.random();
      if (r < 0.2) {
        fns.pop()();
        fns.pop()();
        return fns.pop()();
      } else if (r < 0.5) {
        fns.pop()();
        return fns.pop()();
      } else if (r < 0.9) {
        return fns.pop()();
      } else {
        return "nothing";
      }
      */
    }
  };

  mapping.generateWeaponTest = function () {
    var a, genRing, mainSpawn;
    sim.things = {};
    sim.theme = main;
    mainSpawn = a = new types.SpawnPoint();
    a.side = "alpha";
    a.spawn = "alpha";
    a.pos[0] = 0;
    a.pos[1] = 0;
    sim.things[a.id] = a;
    genRing = (function (_this) {
      return function (pos, radius, n, spec) {
        var i, m, ref, results, u, z;
        z = -mr.random() * 6 - 3;
        results = [];
        for (i = m = 0, ref = n; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
          u = new types.Unit(spec);
          u.pos = v2.create(pos);
          u.pos[0] += Math.sin((i / n) * 2 * Math.PI) * radius * 0.8;
          u.pos[1] += Math.cos((i / n) * 2 * Math.PI) * radius * 0.8;
          u.side = "beta";
          u.rot = v2.angle(u.pos) + Math.PI;
          results.push((sim.things[u.id] = u));
        }
        return results;
      };
    })(this);
    genRing([0, 0], 1200, 12, "ExULFRUIERUIExcIExMI");
    genRing([0, 0], 1500, 32, "ExULFRUIERUIExcIExMI");
    return genRing([0, 0], 1800, 64, "ExULFRUIERUIExcIExMI");
  };

  mapping.genTower = function () {
    var _, blocks, forts, i, ref, results, spec, thing, towers, u;
    blocks = ["ExULFRUIERUIExcIExMI", "FBQUExgHGBUJFRAHEBMJEBUJFRgHExAHGBMJ"];
    towers = ["ERQQFxQQEREIFxEIFBcJFBEJERcKFxcKFBQBFBQw", "FBQDERQQFxQQEREIFxEIFBcJFBEJERcKFxcKFBQy", "ERQQFBcJFxQQEREIFxEIFBQDERcKFxcKFBESFBQ4", "ERQQFBcJFxQQEREIFxEIFBQDERcKFxcKFBESFBQ1"];
    forts = [
      "FBQDGRcKEBQPDxcKDxEIGBQPGREIEhcJEhEJFhcJFhEJFBQ3",
      "GREIFBQDEBQPDxcKDxEIGBQPGRcKEhcJEhEJFhcJFhEJFBQz",
      "DRAHDRgHGBQ9EBQ/FBgDEBgPGBgPFBEJFBQDGBADFA8JEBADDRQHGxgHGxQHGxAHEBsJGBsJEA0JGA0JEBAvGBAvFBgwFBQ0",
      "FAwGGBAPEBQGGBQGHBQGDBQGCBQDFBQDFCADFAgDEBAPEBgPGBgPFBgGFBAGFBwGIBQDBBQBFCQDJBQDFAQBBBQvFCQvJBQvFAQvCBQ0IBQ0FBQ0FAg0FCA0",
    ];
    ref = sim.things;
    results = [];
    for (_ in ref) {
      thing = ref[_];
      if (thing.commandPoint) {
        spec = chooseOne(towers);
      } else {
        continue;
      }
      u = new types.Unit(spec);
      u.pos = v2.create(thing.pos);
      u.side = thing.side;
      u.rot = v2.angle(u.pos) + Math.PI;
      sim.things[u.id] = u;
      results.push(
        (function () {
          var m, results1;
          results1 = [];
          for (i = m = 0; m < 6; i = ++m) {
            if (thing.commandPoint) {
              spec = blocks[0];
            } else {
              continue;
            }
            u = new types.Unit(spec);
            u.pos = v2.create(thing.pos);
            u.pos[0] += Math.sin((i / 3) * Math.PI) * thing.radius * 0.8;
            u.pos[1] += Math.cos((i / 3) * Math.PI) * thing.radius * 0.8;
            u.side = thing.side;
            u.rot = Math.PI / 2;
            results1.push((sim.things[u.id] = u));
          }
          return results1;
        })()
      );
    }
    return results;
  };

  genSymetrical = function () {
    var _, a, b, from_center, i, m, mainSpawn, o, pos, ref, ref1, results, t, tooClose;
    mainSpawn = a = new types.SpawnPoint();
    a.side = "alpha";
    a.spawn = "alpha";
    a.pos[0] = -sim.mapScale * 3000;
    a.pos[1] = mr.random() * 3000 - 1500;
    sim.things[a.id] = a;
    b = new types.SpawnPoint();
    b.side = "beta";
    b.spawn = "beta";
    b.pos[0] = sim.mapScale * 3000;
    b.pos[1] = -a.pos[1];
    sim.things[b.id] = b;
    pos = [];
    results = [];
    for (i = m = 0, ref = sim.numComPoints / 2; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
      a = new types.CommandPoint();
      a.z = -0.01;
      if (i === 0) {
        v2.set(mainSpawn.pos, a.pos);
        from_center = v2.mag(a.pos);
        v2.scale(a.pos, (from_center - 1500) / from_center);
      } else {
        for (i = o = 0; o < 10; i = ++o) {
          tooClose = false;
          randomVector(a.pos);
          v2.scale(a.pos, (300 + mr.random() * 2000) * sim.mapScale);
          ref1 = sim.things;
          for (_ in ref1) {
            t = ref1[_];
            if (v2.distance(t.pos, a.pos) < t.radius + a.radius + 100) {
              tooClose = true;
              break;
            }
          }
          if (!tooClose) {
            break;
          }
        }
      }
      sim.things[a.id] = a;
      b = new types.CommandPoint();
      b.z = -0.01;
      b.pos[0] = -a.pos[0];
      b.pos[1] = -a.pos[1];
      a.side = "alpha";
      b.side = "beta";
      results.push((sim.things[b.id] = b));
    }
    return results;
  };

  genClouds = function () {
    var alpha, c, cloud, clouds, i, len, m, n, o, otherCloud, overlaps, ref, results, s, type;
    if (mr.random() < 0.3) {
      c = 0;
    } else {
      c = 255;
    }
    alpha = 15 + 20 * mr.random();
    type = chooseOne(["s", "v", "a", "g"]);
    n = Math.PI * sim.mapScale * sim.mapScale * 8;
    clouds = [];
    results = [];
    for (i = m = 0, ref = n * mr.random(); 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
      cloud = new types.Rock();
      cloud.image = "img/debree/" + type + "cloud" + chooseNumber(4) + ".png";
      randomVector(cloud.pos);
      v2.scale(cloud.pos, mr.random() * 3200 * sim.mapScale);
      overlaps = 0;
      for (o = 0, len = clouds.length; o < len; o++) {
        otherCloud = clouds[o];
        if (v2.distance(cloud.pos, otherCloud.pos) < 1200) {
          overlaps += 1;
        }
      }
      if (overlaps > 2) {
        continue;
      }
      cloud.color = v4.create(sim.theme.rockColor);
      cloud.color[0] = c;
      cloud.color[1] = c;
      cloud.color[2] = c;
      cloud.color[3] = alpha;
      s = 4 + mr.random() * 4;
      cloud.size = [s, s];
      cloud.z = (mr.random() - 0.5) * 200;
      cloud.rot = mr.random() * Math.PI * 2;
      if (mr.random() > 0.5) {
        cloud.z *= 5;
      }
      sim.things[cloud.id] = cloud;
      results.push(clouds.push(cloud));
    }
    return results;
  };

  genRocks = function () {
    var i, m, ref, results, rock;
    results = [];
    for (i = m = 0, ref = sim.numRocks; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
      rock = new types.Rock();
      rock.image = chooseOne([
        "img/rocks/srock01.png",
        "img/rocks/srock02.png",
        "img/rocks/srock03.png",
        "img/rocks/srock04.png",
        "img/rocks/srock05.png",
        "img/rocks/srock06.png",
        "img/rocks/srock07.png",
        "img/rocks/mrock01.png",
        "img/rocks/mrock02.png",
        "img/rocks/mrock03.png",
        "img/rocks/mrock04.png",
        "img/rocks/mrock05.png",
        "img/rocks/mrock06.png",
        "img/rocks/lrock01.png",
        "img/rocks/lrock02.png",
        "img/rocks/lrock03.png",
        "img/rocks/lrock04.png",
        "img/rocks/lrock05.png",
      ]);
      randomVector(rock.pos);
      v2.scale(rock.pos, (300 + mr.random() * 3000) * sim.mapScale);
      rock.color = sim.theme.spotColor;
      rock.rot = 2 * Math.PI * mr.random();
      rock.z = (mr.random() - 0.5) * 200;
      if (rock.z > 0) {
        rock.z += 1;
      }
      results.push((sim.things[rock.id] = rock));
    }
    return results;
  };

  genBox = function () {
    var a, m, results, rock, x, y, z;
    results = [];
    for (x = m = -5; m <= 5; x = ++m) {
      results.push(
        (function () {
          var o, results1;
          results1 = [];
          for (y = o = -5; o <= 5; y = ++o) {
            results1.push(
              (function () {
                var q, results2;
                results2 = [];
                for (z = q = -5; q <= 5; z = ++q) {
                  rock = new types.Rock();
                  a = 1000;
                  rock.pos = [x * a, y * a];
                  rock.z = z * 50;
                  rock.color = [255, 255, 255, 255];
                  rock.image = "img/pip1.png";
                  results2.push((sim.things[rock.id] = rock));
                }
                return results2;
              })()
            );
          }
          return results1;
        })()
      );
    }
    return results;
  };

  genDebree = function () {
    var c, clusterCenter, debree, debreeColor, i, m, n, ref, results;
    debreeColor = sim.theme.spotColor;
    n = Math.PI * sim.mapScale * sim.mapScale * 4;
    results = [];
    for (c = m = 0, ref = n * mr.random(); 0 <= ref ? m < ref : m > ref; c = 0 <= ref ? ++m : --m) {
      clusterCenter = v2.create();
      randomVector(clusterCenter);
      v2.scale(clusterCenter, (300 + mr.random() * 3000) * sim.mapScale);
      if (mr.random() < 0.7) {
        debree = new types.Rock();
        if (mr.random() > 0.2) {
          debree.image = "img/debree/bigdebree" + chooseNumber(12) + ".png";
        } else {
          debree.image = "img/debree/civ" + chooseNumber(5) + ".png";
        }
        v2.add(debree.pos, clusterCenter);
        debree.z = (mr.random() - 0.5) * 200;
        debree.color = debreeColor;
        debree.rot = mr.random() * 2 * Math.PI;
        sim.things[debree.id] = debree;
      }
      results.push(
        (function () {
          var o, ref1, results1;
          results1 = [];
          for (i = o = 0, ref1 = 20 * mr.random(); 0 <= ref1 ? o < ref1 : o > ref1; i = 0 <= ref1 ? ++o : --o) {
            debree = new types.Rock();
            debree.image = "img/debree/debree" + chooseNumber(25) + ".png";
            randomVector(debree.pos);
            v2.scale(debree.pos, mr.random() * 600);
            v2.add(debree.pos, clusterCenter);
            debree.z = (mr.random() - 0.5) * 200;
            debree.color = debreeColor;
            debree.rot = mr.random() * 2 * Math.PI;
            results1.push((sim.things[debree.id] = debree));
          }
          return results1;
        })()
      );
    }
    return results;
  };

  genDodads = function () {
    var _, chooseDodad, dodadColor, genRing, ref, results, single, thing;
    chooseDodad = function () {
      return chooseOne([
        "img/dodads/bigdodad01.png",
        "img/dodads/bigdodad02.png",
        "img/dodads/bigdodad03.png",
        "img/dodads/bigdodad04.png",
        "img/dodads/bigdodad05.png",
        "img/dodads/meddodad01.png",
        "img/dodads/meddodad02.png",
        "img/dodads/meddodad03.png",
        "img/dodads/meddodad04.png",
      ]);
    };
    dodadColor = sim.theme.spotColor;
    genRing = (function (_this) {
      return function (pos, radius) {
        var dodad, i, image, level, m, ref, results, z;
        image = chooseDodad();
        z = -mr.random() * 6 - 3;
        results = [];
        for (level = m = 0, ref = mr.random() * 4; 0 <= ref ? m < ref : m > ref; level = 0 <= ref ? ++m : --m) {
          results.push(
            (function () {
              var o, results1;
              results1 = [];
              for (i = o = 0; o < 6; i = ++o) {
                dodad = new types.Rock();
                dodad.image = image;
                dodad.color = dodadColor;
                dodad.pos = v2.create(pos);
                dodad.pos[0] += Math.sin((i / 3) * Math.PI) * radius * 0.8;
                dodad.pos[1] += Math.cos((i / 3) * Math.PI) * radius * 0.8;
                dodad.rot = ((6 - i) / 3) * Math.PI + Math.PI / 2;
                dodad.z = z - level * 10;
                results1.push((sim.things[dodad.id] = dodad));
              }
              return results1;
            })()
          );
        }
        return results;
      };
    })(this);
    single = (function (_this) {
      return function (pos) {
        var dodad, image;
        image = chooseDodad();
        dodad = new types.Rock();
        dodad.image = image;
        dodad.color = dodadColor;
        dodad.pos = v2.create(pos);
        dodad.rot = mr.random() * 2 * Math.PI;
        dodad.z = -2 + mr.random();
        return (sim.things[dodad.id] = dodad);
      };
    })(this);
    ref = sim.things;
    results = [];
    for (_ in ref) {
      thing = ref[_];
      if (mr.random() < 0.5) {
        continue;
      }
      if (!(thing.spawn || thing.commandPoint)) {
        continue;
      }
      if (mr.random() < 0.5) {
        results.push(genRing(thing.pos, thing.radius * 3));
      } else {
        results.push(single(thing.pos));
      }
    }
    return results;
  };

  mapping.save = function (name) {
    var k, len, m, map, n, num, p, player, ref, ref1, ref2, spec, thing;
    p = function (pos) {
      return [Math.floor(pos[0]), Math.floor(pos[1])];
    };
    map = {};
    map.name = name;
    map.players = {};
    ref = sim.players;
    for (k in ref) {
      player = ref[k];
      map.players[player.id] = {
        name: player.name,
        buildBar: player.buildBar,
        aiRules: player.aiRules,
        color: player.color,
        side: player.side,
      };
    }
    map.things = [];
    ref1 = sim.things;
    for (k in ref1) {
      thing = ref1[k];
      if (thing.unit) {
        num = -1;
        ref2 = player.buildBar;
        for (n = m = 0, len = ref2.length; m < len; n = ++m) {
          spec = ref2[n];
          if (simpleEquals(spec, thing.spec)) {
            num = n;
          }
        }
        map.things.push(["unit", p(thing.pos), thing.side, thing.owner, num, thing.rot]);
      } else if (thing.spawn) {
        map.things.push(["spawnPoint", p(thing.pos), thing.side]);
      } else if (thing.commandPoint) {
        map.things.push(["commandPoint", p(thing.pos), thing.side]);
      }
    }
    console.log(name + " =\n" + csonify(map, 1));
    localStorage["map_" + name] = JSON.stringify(map);
  };

  mapping.load = function (name) {
    var base, id, len, m, map, owner, p, player, ref, ref1, results, thing;
    map = JSON.parse(localStorage["map_" + name]);
    if (window.network != null) {
      if (typeof (base = window.network).close === "function") {
        base.close();
      }
    }
    bubbles.clear();
    window.intp = new Interpolator();
    window.sim = new Sim();
    sim.local = true;
    intp.local = true;
    sim.start();
    window.network = new Local();
    ui.mode = "battle";
    ref = map.players;
    for (id in ref) {
      p = ref[id];
      player = sim.playerJoin({}, id, p.name, p.color, p.buildBar, p.aiRules);
      player.side = p.side;
      player.connected = true;
      player.ready = true;
    }
    sim.things = {};
    ref1 = map.things;
    results = [];
    for (m = 0, len = ref1.length; m < len; m++) {
      p = ref1[m];
      console.log(p);
      if (p[0] === "spawnPoint") {
        thing = new types.SpawnPoint();
        thing.spawn = p[2];
      } else if (p[0] === "commandPoint") {
        thing = new types.CommandPoint();
      } else if (p[0] === "unit") {
        owner = map.players[p[3]];
        thing = new types.Unit(owner.buildBar[p[4]]);
        thing.owner = p[3];
        thing.number = p[4];
        thing.rot = p[5] || 0;
      }
      v2.set(p[1], thing.pos);
      thing.side = p[2];
      results.push((sim.things[thing.id] = thing));
    }
    return results;
  };
}.call(this));
