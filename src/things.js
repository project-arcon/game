/*
General Game Objects live here
 */

(function () {
  var Explosion,
    _color,
    _focus,
    _offset,
    _pos,
    _size,
    _vec,
    anitSideColor,
    sideColor,
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

  _pos = v2.create();

  _vec = v2.create();

  window.drawAllArcs = function (unit) {
    var arc, cur, i, j, l, len, n, pos, range, ref, ref1, ref2, results, th, w, x, y;
    ref = unit.weapons;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      w = ref[j];
      range = w.range;
      arc = w.arc;
      cur = Math.PI * range * 2;
      n = Math.floor(((cur / 40) * arc) / 360);
      for (i = l = ref1 = -n, ref2 = n; ref1 <= ref2 ? l < ref2 : l > ref2; i = ref1 <= ref2 ? ++l : --l) {
        th = (((i / (n * 2)) * arc) / 180) * Math.PI + unit.rot + Math.PI;
        x = Math.sin(-th) * range;
        y = Math.cos(-th) * range;
        pos = [w.worldPos[0] + x, w.worldPos[1] + y];
        baseAtlas.drawSprite("img/arrow02.png", pos, [0.25, 0.25], th + Math.PI, [255, 0, 0, 255]);
      }
      if (w.minRange > 0) {
        cur = Math.PI * w.minRange * 2;
        n = Math.floor(((cur / 40) * arc) / 360);
        results.push(
          (function () {
            var m, ref3, ref4, results1;
            results1 = [];
            for (i = m = ref3 = -n, ref4 = n; ref3 <= ref4 ? m < ref4 : m > ref4; i = ref3 <= ref4 ? ++m : --m) {
              th = (((i / (n * 2)) * arc) / 180) * Math.PI + unit.rot + Math.PI;
              x = Math.sin(-th) * w.minRange;
              y = Math.cos(-th) * w.minRange;
              pos = [w.worldPos[0] + x, w.worldPos[1] + y];
              results1.push(baseAtlas.drawSprite("img/arrow02.png", pos, [0.25, 0.25], th, [255, 0, 0, 255]));
            }
            return results1;
          })()
        );
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  window.drawDottedCircle = function (pos, radius, color) {
    var i, j, n, ref, results, th, x, y;
    n = 40;
    results = [];
    for (i = j = 0, ref = 2 * n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      th = (i / n) * 2 * Math.PI;
      x = Math.sin(th) * radius;
      y = Math.cos(th) * radius;
      results.push(baseAtlas.drawSprite("img/map/spawnSlice.png", [pos[0] + x, pos[1] + y], [Math.min(radius / 500, 0.4), radius / 1000], -th + Math.PI / 2, color));
    }
    return results;
  };

  window.players = {};

  window.Player = (function () {
    Player.prototype.gainsMoney = true;

    Player.prototype.ready = false;

    Player.prototype.actions = 0;

    Player.prototype.apm = 0;

    Player.prototype.capps = 0;

    Player.prototype.kills = 0;

    Player.prototype.unitsBuilt = 0;

    Player.prototype.moneyEarned = 0;

    Player.prototype.moneyRatio = 1;

    Player.prototype.aiRules = null;

    Player.prototype.host = false;

    Player.prototype.ai = false;

    function Player(id1) {
      this.id = id1;
      this.side = this.id;
      this.color = randColor(200);
      this.reset();
    }

    Player.prototype.reset = function () {
      var n;
      this.money = sim.defaultMoney;
      this.mouse = [0, 0];
      this.rallyPoint = [0, 0];
      this.selection = [];
      this.buildQ = [];
      this.validBar = (function () {
        var j, results;
        results = [];
        for (n = j = 0; j < 10; n = ++j) {
          results.push(true);
        }
        return results;
      })();
      this.actions = 0;
      this.apm = 0;
      this.capps = 0;
      this.kills = 0;
      this.unitsBuilt = 0;
      this.moneyEarned = 0;
      return (this.mouseTrail = []);
    };

    Player.prototype.earnMoney = function (amount) {
      amount *= this.moneyRatio;
      this.money += amount;
      return (this.moneyEarned += amount);
    };

    Player.prototype.tick = function () {
      if (sim.step % 16 === 0) {
        if (this.gainsMoney && sim.gainsMoney) {
          this.earnMoney(10);
        }
        this.apm = this.actions / (sim.step / 16 / 60);
      }
      if (this.aiRules) {
        sim.timeIt(
          "ai",
          (function (_this) {
            return function () {
              return doPlayerAIRules(_this);
            };
          })(this)
        );
      }
      return this.wave();
    };

    Player.prototype.wave = function () {
      var build, i, j, len, n, ref, slot, waitTime;
      waitTime = 16 * 2;
      if (sim.step > waitTime && sim.step % 16 === 0) {
        build = false;
        ref = this.buildQ;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          slot = ref[i];
          if (this.rqUnit(slot)) {
            this.buildQ[i] = null;
            build = true;
          } else {
            break;
          }
        }
        if (build) {
          return (this.buildQ = function () {
            var l, len1, ref1, results;
            ref1 = this.buildQ;
            results = [];
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              n = ref1[l];
              if (n !== null) {
                results.push(n);
              }
            }
            return results;
          }.call(this));
        }
      }
    };

    Player.prototype.rqUnit = function (slot) {
      var spawn, unit;
      if (sim.serverType === "survival" && this.side === "beta") {
        unit = survival.rqUnit(sim, this.number, slot);
      } else {
        spawn = sim.findSpawnPoint(this.side);
        if (spawn) {
          unit = sim.buildUnit(this.number, slot, spawn.pos);
          if (unit) {
            v2.random(unit.pos);
            v2.scale(unit.pos, 100 + Math.random() * (spawn.radius - 100));
            v2.add(unit.pos, spawn.pos);
          }
        }
      }
      if (unit) {
        this.unitsBuilt += 1;
        if (this.rallyPoint[0] !== 0 && this.rallyPoint[1] !== 0) {
          unit.setOrder({
            type: "Move",
            dest: this.rallyPoint,
            rally: true,
          });
        }
        return unit;
      }
      return null;
    };

    Player.prototype.draw = function () {
      var angle, arc, arcRad, color, cur, drawIt, i, j, len, n, other, range, ref, ref1, ref2, results, t, th, x, y;
      if (!ui.show) {
        return;
      }
      if ((ref = sim.galaxyStar) != null) {
        if (typeof ref.draw === "function") {
          ref.draw();
        }
      }
      if (battleMode.rallyPlacing) {
        baseAtlas.drawSprite("img/unitBar/rallyPoint.png", battleMode.mouse, [1, 1], 0);
      } else if (commander.rallyPoint && commander.rallyPoint[0] !== 0 && commander.rallyPoint[1] !== 0) {
        baseAtlas.drawSprite("img/unitBar/rallyPoint.png", commander.rallyPoint, [1, 1], 0);
      }
      if (!this.selection) {
        return;
      }
      ref1 = this.selection;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        t = ref1[j];
        if (t.dead) {
          continue;
        }
        color = this.color;
        if (typeof t.drawSelection === "function") {
          t.drawSelection(color);
        }
        if (this.selection.length === 1) {
          if (t.weapons) {
            drawAllArcs(t);
          }
          if (t.jump > t.minJump) {
            results.push(drawDottedCircle(t.pos, t.jump, [0, 0, 0, 125]));
          } else {
            results.push(void 0);
          }
        } else {
          if (((ref2 = t.weapons) != null ? ref2.length : void 0) > 0) {
            range = t.weaponRange;
            arc = t.weaponArc;
            cur = Math.PI * range * 2;
            n = Math.floor(((cur / 80) * arc) / 360);
            results.push(
              function () {
                var l, len1, m, ref3, ref4, ref5, results1;
                results1 = [];
                for (i = l = ref3 = -n, ref4 = n; ref3 <= ref4 ? l < ref4 : l > ref4; i = ref3 <= ref4 ? ++l : --l) {
                  th = (((i / (n * 2)) * arc) / 180) * Math.PI + t.rot + Math.PI;
                  x = Math.sin(-th) * range;
                  y = Math.cos(-th) * range;
                  _pos[0] = t.pos[0] + x;
                  _pos[1] = t.pos[1] + y;
                  drawIt = true;
                  ref5 = this.selection;
                  for (m = 0, len1 = ref5.length; m < len1; m++) {
                    other = ref5[m];
                    if (other.unit && other.id !== t.id && other.owner === t.owner) {
                      if (other.weapons != null && other.weapons.length > 0) {
                        v2.sub(_pos, other.pos, _vec);
                        if (v2.mag(_vec) < other.weaponRange) {
                          angle = v2.angle(_vec);
                          arcRad = (other.weaponArc / 180) * Math.PI;
                          if (Math.abs(angleBetween(angle, other.rot)) < arcRad / 2) {
                            drawIt = false;
                            break;
                          }
                        }
                      }
                    }
                  }
                  if (drawIt) {
                    results1.push(baseAtlas.drawSprite("img/arrow02.png", _pos, [0.5, 0.5], th + Math.PI, [255, 0, 0, 255]));
                  } else {
                    results1.push(void 0);
                  }
                }
                return results1;
              }.call(this)
            );
          } else {
            results.push(void 0);
          }
        }
      }
      return results;
    };

    return Player;
  })();

  _color = [0, 0, 0, 0];

  window.Trail = (function () {
    function Trail(parentId, trailSize, trailTime, color1, z) {
      this.parentId = parentId;
      this.trailSize = trailSize;
      this.trailTime = trailTime;
      this.color = color1;
      if (typeof intp === "undefined" || intp === null) {
        return;
      }
      this.trail = [];
      this.id = sim.nid();
      intp.trails[this.id] = this;
      this.z = z - 0.0001;
    }

    Trail.prototype.grow = function (pos) {
      if (typeof intp === "undefined" || intp === null) {
        return;
      }
      if (this.trail.length === 0 || v2.distance(this.trail[this.trail.length - 1][0], pos) > 2) {
        return this.trail.push([[pos[0], pos[1]], intp.smoothStep]);
      }
    };

    Trail.prototype.draw = function () {
      var alive, j, len, p, ref, ref1, results, s, t;
      while (this.trail.length > 0 && intp.smoothStep - this.trail[0][1] > this.trailTime) {
        this.trail.shift();
      }
      _color[0] = 155 + (this.color[0] / 255) * 100;
      _color[1] = 155 + (this.color[1] / 255) * 100;
      _color[2] = 155 + (this.color[2] / 255) * 100;
      _color[3] = 0;
      s = this.trailSize;
      ref = this.trail;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        (ref1 = ref[j]), (p = ref1[0]), (t = ref1[1]);
        alive = (intp.smoothStep - t) / this.trailTime;
        if (alive < 1 && alive > 0) {
          _color[3] = 255 - 255 * alive;
        } else {
          _color[3] = 0;
        }
        results.push(baseAtlas.drawSprite("img/fire02.png", p, [s, s], 0, _color));
      }
      return results;
    };

    return Trail;
  })();

  window.Particle = (function () {
    Particle.prototype.image = null;

    Particle.prototype.size = [0.1, 0.1];

    Particle.prototype.maxLife = 60;

    Particle.prototype.radius = 1;

    function Particle() {
      this.id = sim.nid();
      this.color = [255, 255, 255, 255];
      this.life = 0;
      this.dead = false;
      this.z = Math.random();
      this.pos = v2.create();
      this.vel = v2.create();
      this._pos = v2.create();
      this._pos2 = v2.create();
      this.rot = 0;
      if (this.sound) {
        playSound(this.sound, this.soundVolume);
      }
    }

    Particle.prototype.move = function () {
      if (this.dead) {
        return;
      }
      v2.add(this.pos, this.vel);
      this.life += 1;
      if (this.life > this.maxLife) {
        return (this.dead = true);
      }
    };

    Particle.prototype.draw = function () {
      if (this.dead) {
        return;
      }
      return baseAtlas.drawSprite(this.image, this.pos, this.size, this.rot, this.color);
    };

    return Particle;
  })();

  Explosion = (function (superClass) {
    extend(Explosion, superClass);

    function Explosion() {
      return Explosion.__super__.constructor.apply(this, arguments);
    }

    Explosion.prototype.image = "img/unitBar/pip1.png";

    Explosion.prototype.maxLife = 30;

    Explosion.prototype.radius = 2;

    Explosion.prototype.sound = "sounds/weapons/thud2.wav";

    Explosion.prototype.soundVolume = 0.1;

    Explosion.prototype.draw = function () {
      var fade, s;
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      s = 0.1 + fade * fade * this.radius;
      this.color[3] = (1 - fade) * 255;
      return baseAtlas.drawSprite(this.image, this.pos, [s, s], this.rot, this.color);
    };

    return Explosion;
  })(Particle);

  window.Bullet = (function (superClass) {
    extend(Bullet, superClass);

    Bullet.prototype.image = "img/unitBar/pip1.png";

    Bullet.prototype.damage = 1;

    Bullet.prototype.speed = 10;

    Bullet.prototype.size = [1, 1];

    Bullet.prototype.bullet = true;

    Bullet.prototype.radius = 10;

    Bullet.prototype.hitsMultiple = false;

    Bullet.prototype.hitExplosion = "HitExplosion";

    Bullet.prototype.side = null;

    Bullet.prototype.hitsCloak = false;

    function Bullet() {
      Bullet.__super__.constructor.call(this);
      actionMixer.action += 0.05;
    }

    Bullet.prototype.applyDamage = function () {
      return (this.dead = true);
    };

    Bullet.prototype.move = function () {
      if (this.dead) {
        return;
      }
      v2.add(this.pos, this.vel);
      return (this.life += 1);
    };

    Bullet.prototype.tick = function () {
      var exp;
      if (this.life > this.maxLife) {
        this.dead = true;
        return;
      }
      if (this.explode === false) {
        this.dead = true;
        return;
      }
      this.scan();
      if (this.dead) {
        exp = new types[this.hitExplosion]();
        exp.z = 1000;
        exp.pos = [this.pos[0], this.pos[1]];
        if (this.t !== null) {
          v2.add(exp.pos, v2.scale(this.vel, this.t));
        }
        exp.vel = [0, 0];
        exp.rot = 0;
        exp.radius = 0.75;
        return (sim.things[exp.id] = exp);
      }
    };

    Bullet.prototype.scan = function () {
      sim.unitSpaces[otherSide(this.side)].findInRange(
        this.pos,
        this.radius + this.speed + 500,
        (function (_this) {
          return function (unit) {
            if (_this.collide(unit)) {
              _this.hitUnit(unit);
              if (_this.hitsMultiple) {
                return false;
              }
              return true;
            }
            return false;
          };
        })(this)
      );
      if (this.hitsMissiles) {
        return sim.bulletSpaces[otherSide(this.side)].findInRange(
          this.pos,
          this.radius + this.speed + 100,
          (function (_this) {
            return function (missle) {
              if (missle.missile && _this.collide(missle)) {
                _this.hitMissle(missle);
                if (_this.hitsMultiple) {
                  return false;
                }
                return true;
              }
              return false;
            };
          })(this)
        );
      }
    };

    Bullet.prototype.hitUnit = function (thing) {
      thing.applyDamage(this.damage);
      if (this.energyDamage) {
        thing.applyEnergyDamage(this.energyDamage);
      }
      if (!this.hitsMultiple) {
        return (this.dead = true);
      }
    };

    Bullet.prototype.hitMissle = function (thing) {
      thing.life = thing.maxLife;
      return (thing.explode = false);
    };

    Bullet.prototype._collide = function (thing) {
      var distance, speed;
      distance = v2.distance(this.pos, thing.pos);
      speed = v2.mag(thing.vel) + v2.mag(this.vel);
      return distance < thing.radius;
    };

    Bullet.prototype.collide = function (thing) {
      var c, distance, r, speed, t1, t2, ta, tb, tc, v;
      if (!this.hitsCloak && thing.cloak && thing.cloaked()) {
        return false;
      }
      distance = v2.distance(this.pos, thing.pos);
      if (distance < thing.radius + this.radius) {
        return true;
      }
      speed = v2.mag(thing.vel) + v2.mag(this.vel);
      if (distance > thing.radius + this.radius + speed) {
        return false;
      }
      this.t = null;
      c = [0, 0];
      v2.sub(this.pos, thing.pos, c);
      v = [0, 0];
      v2.sub(this.vel, thing.vel, v);
      r = this.radius + thing.radius;
      ta = -(c[0] * v[0] + c[1] * v[1]);
      tb = Math.sqrt(r * r * (v[0] * v[0] + v[1] * v[1]) - Math.pow(c[0] * v[1] - c[1] * v[0], 2));
      tc = v[0] * v[0] + v[1] * v[1];
      t1 = (ta - tb) / tc;
      t2 = (ta + tb) / tc;
      if (t1 > 0 && t1 < t2) {
        this.t = t1;
      }
      if (t2 > 0 && t2 < t1) {
        this.t = t2;
      }
      if (this.t !== null) {
        return this.t > 0 && this.t < 1;
      }
      return false;
    };

    Bullet.prototype.__collide = function (thing) {
      var distance, j, len, part, ref, speed;
      if (!this.hitsCloak && thing.cloak && thing.cloaked()) {
        return false;
      }
      speed = v2.mag(thing.vel) + v2.mag(this.vel);
      if (distance > thing.radius + this.radius + speed) {
        return false;
      }
      distance = v2.distance(this.pos, thing.pos);
      if (distance < thing.radius + this.radius) {
        ref = thing.parts;
        for (j = 0, len = ref.length; j < len; j++) {
          part = ref[j];
          distance = v2.distance(this.pos, part.worldPos) - this.radius - 10;
          if (distance < 0) {
            return true;
          }
        }
      }
      return false;
    };

    return Bullet;
  })(Particle);

  _offset = v2.create();

  window.LaserBullet = (function (superClass) {
    extend(LaserBullet, superClass);

    function LaserBullet() {
      return LaserBullet.__super__.constructor.apply(this, arguments);
    }

    LaserBullet.prototype.image = "img/laser01.png";

    LaserBullet.prototype.size = [1, 1];

    LaserBullet.prototype.color = [179, 207, 255, 255];

    LaserBullet.prototype.speed = 2000;

    LaserBullet.prototype.damage = 2.5;

    LaserBullet.prototype.maxLife = 3;

    LaserBullet.prototype.drawLength = 437;

    LaserBullet.prototype.move = function () {};

    LaserBullet.prototype.tick = function () {
      if (this.dead) {
        return;
      }
      this.life += 1;
      if (this.life > this.maxLife) {
        return (this.dead = true);
      }
    };

    LaserBullet.prototype.draw = function () {
      var d, rot, w;
      if (this.target) {
        v2.set(this.target.pos, this.targetPos);
      }
      if (this.origin) {
        w = this.origin.weapons[this.turretNum || 0];
        if (w) {
          v2.set(w.worldPos, this.pos);
        }
      }
      v2.sub(this.targetPos, this.pos, _offset);
      rot = v2.angle(_offset);
      d = v2.mag(_offset) / this.drawLength;
      v2.scale(_offset, 0.5);
      v2.add(_offset, this.pos);
      if (w) {
        w.rot = rot;
      }
      return baseAtlas.drawSprite(this.image, _offset, [this.size[0], d], rot, this.color);
    };

    return LaserBullet;
  })(Bullet);

  types.FlackExplosion = (function (superClass) {
    extend(FlackExplosion, superClass);

    function FlackExplosion() {
      return FlackExplosion.__super__.constructor.apply(this, arguments);
    }

    FlackExplosion.prototype.image = "img/fire02.png";

    FlackExplosion.prototype.maxLife = 3;

    FlackExplosion.prototype.radius = 2;

    FlackExplosion.prototype.sound = "sounds/weapons/thud1.wav";

    FlackExplosion.prototype.soundVolume = 0.1;

    FlackExplosion.prototype.draw = function () {
      var fade, s;
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      s = this.radius / 2;
      this.color[3] = (1 - Math.pow(fade, 2)) * 80;
      return baseAtlas.drawSprite(this.image, this.pos, [s, s], this.rot, this.color);
    };

    return FlackExplosion;
  })(Explosion);

  window.AoeBullet = (function (superClass) {
    extend(AoeBullet, superClass);

    function AoeBullet() {
      return AoeBullet.__super__.constructor.apply(this, arguments);
    }

    AoeBullet.prototype.image = "img/unitBar/pip1.png";

    AoeBullet.prototype.size = [1, 1];

    AoeBullet.prototype.color = [100, 100, 100, 255];

    AoeBullet.prototype.speed = 30;

    AoeBullet.prototype.aoe = 50;

    AoeBullet.prototype.damage = 3;

    AoeBullet.prototype.explode = true;

    AoeBullet.prototype.explodeClass = "AoeExplosion";

    AoeBullet.prototype.move = function () {
      if (this.dead) {
        return;
      }
      return v2.add(this.pos, this.vel);
    };

    AoeBullet.prototype.tick = function () {
      var exp;
      this.life += 1;
      if (this.life > this.maxLife) {
        this.dead = true;
        if (this.explode) {
          exp = new types[this.explodeClass]();
          exp.z = 1000;
          exp.pos = [this.hitPos[0], this.hitPos[1]];
          exp.vel = [0, 0];
          exp.rot = 0;
          exp.aoe = this.aoe;
          exp.side = this.side;
          exp.damage = this.damage;
          return (sim.things[exp.id] = exp);
        }
      }
    };

    return AoeBullet;
  })(Bullet);

  window.StraightMissile = (function (superClass) {
    extend(StraightMissile, superClass);

    function StraightMissile() {
      return StraightMissile.__super__.constructor.apply(this, arguments);
    }

    StraightMissile.prototype.trailSize = 0.1;

    StraightMissile.prototype.trailTime = 94;

    StraightMissile.prototype.draw = function () {
      if (!this.trail) {
        this.trail = new Trail(this.id, this.trailSize, this.trailTime, this.color, this.z);
      }
      this.trail.grow(this.pos);
      this.trail.z = this.z - 0.0001;
      return StraightMissile.__super__.draw.call(this);
    };

    return StraightMissile;
  })(Bullet);

  window.TrackingMissile = (function (superClass) {
    extend(TrackingMissile, superClass);

    function TrackingMissile() {
      return TrackingMissile.__super__.constructor.apply(this, arguments);
    }

    TrackingMissile.prototype.image = "img/unitBar/pip1.png";

    TrackingMissile.prototype.size = [1, 1];

    TrackingMissile.prototype.color = [0, 0, 0, 255];

    TrackingMissile.prototype.speed = 15;

    TrackingMissile.prototype.damage = 8;

    TrackingMissile.prototype.radius = 10;

    TrackingMissile.prototype.missile = true;

    TrackingMissile.prototype.trailSize = 0.1;

    TrackingMissile.prototype.trailTime = 94;

    TrackingMissile.prototype.draw = function () {
      if (!this.trail) {
        this.trail = new Trail(this.id, this.trailSize, this.trailTime, this.color, this.z);
      }
      this.trail.grow(this.pos);
      this.trail.z = this.z - 0.0001;
      return TrackingMissile.__super__.draw.call(this);
    };

    TrackingMissile.prototype.move = function () {
      if (this.dead) {
        return;
      }
      if (this.target && !this.target.dead && !this.target.cloaked()) {
        v2.sub(this.target.pos, this.pos, this.vel);
        v2.norm(this.vel);
        v2.scale(this.vel, this.speed);
      }
      v2.add(this.pos, this.vel);
      this.rot = v2.angle(this.vel);
      return (this.life += 1);
    };

    TrackingMissile.prototype.tick = function () {
      var exp;
      if (this.life > this.maxLife) {
        this.dead = true;
        return;
      }
      sim.unitSpaces[otherSide(this.side)].findInRange(
        this.pos,
        this.radius + this.speed + 500,
        (function (_this) {
          return function (unit) {
            if (_this.collide(unit)) {
              _this.hitUnit(unit);
              return true;
            }
            return false;
          };
        })(this)
      );
      if (this.dead) {
        exp = new types.HitExplosion();
        exp.z = 1000;
        exp.pos = [this.pos[0], this.pos[1]];
        exp.vel = [0, 0];
        exp.rot = 0;
        exp.radius = 0.5;
        return (sim.things[exp.id] = exp);
      }
    };

    return TrackingMissile;
  })(Bullet);

  types.Debree = (function (superClass) {
    extend(Debree, superClass);

    function Debree() {
      return Debree.__super__.constructor.apply(this, arguments);
    }

    Debree.prototype.image = null;

    Debree.prototype.maxLife = 16 * 5;

    Debree.prototype.radius = 2;

    Debree.prototype.size = [1, 1];

    Debree.prototype.tick = function () {
      return (this.rot += this.vrot);
    };

    Debree.prototype.draw = function () {
      var fade;
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      this.color[3] = Math.floor((1 - fade) * 255);
      return baseAtlas.drawSprite(this.image, this.pos, this.size, this.rot, this.color);
    };

    return Debree;
  })(Particle);

  types.HitExplosion = (function (superClass) {
    extend(HitExplosion, superClass);

    HitExplosion.prototype.image = "img/fire02.png";

    HitExplosion.prototype.maxLife = 30;

    HitExplosion.prototype.radius = 2;

    HitExplosion.prototype.sound = "sounds/weapons/thud1.wav";

    HitExplosion.prototype.soundVolume = 0.1;

    function HitExplosion() {
      this.frame = 0;
      this.hitImage = "parts/hit" + choose([1, 2, 3, 4, 5]) + ".png";
      this.rot = Math.random() * Math.PI * 2;
      HitExplosion.__super__.constructor.call(this);
      actionMixer.action += 0.5;
    }

    HitExplosion.prototype.draw = function () {
      var fade, s;
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      s = 0.1 + fade * fade * this.radius;
      this.color[3] = (1 - fade) * 255;
      baseAtlas.drawSprite(this.image, this.pos, [s, s], this.rot, this.color);
      if (this.frame < 4) {
        s = 1;
        this.color[3] = 255 / (1 + this.frame);
        baseAtlas.drawSprite(this.hitImage, this.pos, [s, s], this.rot, this.color);
      }
      return (this.frame += 1);
    };

    return HitExplosion;
  })(Explosion);

  types.SmallHitExplosion = (function (superClass) {
    extend(SmallHitExplosion, superClass);

    SmallHitExplosion.prototype.sound = "sounds/weapons/thud4.wav";

    function SmallHitExplosion() {
      this.frame = 0;
      this.hitImage = "parts/hitAuto" + choose([1, 2, 3]) + ".png";
      this.rot = Math.random() * Math.PI * 2;
      SmallHitExplosion.__super__.constructor.call(this);
      actionMixer.action += 0.5;
    }

    SmallHitExplosion.prototype.draw = function () {
      var s;
      if (this.dead) {
        return;
      }
      if (this.frame < 4) {
        s = 1;
        this.color[3] = 255 / (1 + this.frame);
        baseAtlas.drawSprite(this.hitImage, this.pos, [s, s], this.rot, this.color);
      }
      return (this.frame += 1);
    };

    return SmallHitExplosion;
  })(Explosion);

  types.RingHitExplosion = (function (superClass) {
    extend(RingHitExplosion, superClass);

    RingHitExplosion.prototype.image = "img/fire02.png";

    RingHitExplosion.prototype.maxLife = 30;

    function RingHitExplosion() {
      RingHitExplosion.__super__.constructor.call(this);
      this.frame = 0;
    }

    RingHitExplosion.prototype.draw = function () {
      var deb, j, n;
      RingHitExplosion.__super__.draw.call(this);
      if (this.frame === 0) {
        for (n = j = 1; j < 5; n = ++j) {
          deb = new types.Debree();
          deb.image = "parts/fireSpinPart" + n + ".png";
          deb.z = this.z + rand() * 0.01;
          deb.pos = [0, 0];
          deb.vel = [0, 0];
          v2.set(this.pos, deb.pos);
          deb.vel[0] = 60 * rand();
          deb.vel[1] = 60 * rand();
          deb.rot = 0;
          deb.vrot = rand();
          deb.maxLife = 16;
          deb._pos = v2.create(deb.pos);
          deb._pos2 = v2.create(deb.pos);
          deb.rot = deb.rot;
          deb._rot = deb.rot;
          deb._rot2 = deb.rot;
          intp.particles[deb.id] = deb;
        }
      }
      return (this.frame += 1);
    };

    return RingHitExplosion;
  })(Explosion);

  types.ShipExplosion = (function (superClass) {
    extend(ShipExplosion, superClass);

    ShipExplosion.prototype.image = "img/fire02.png";

    ShipExplosion.prototype.maxLife = 15;

    ShipExplosion.prototype.radius = 2;

    ShipExplosion.prototype.sound = "sounds/weapons/explode1.wav";

    ShipExplosion.prototype.soundVolume = 0.1;

    function ShipExplosion(sound) {
      this.sound = sound;
      ShipExplosion.__super__.constructor.call(this);
      actionMixer.action += 0.5;
    }

    ShipExplosion.prototype.draw = function () {
      var fade, s;
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      s = Math.pow(this.radius, 1.3) / 100;
      this.color[3] = (1 - fade) * 255;
      return baseAtlas.drawSprite(this.image, this.pos, [s, s], this.rot, this.color);
    };

    return ShipExplosion;
  })(Explosion);

  types.AoeExplosion = (function (superClass) {
    extend(AoeExplosion, superClass);

    function AoeExplosion() {
      return AoeExplosion.__super__.constructor.apply(this, arguments);
    }

    AoeExplosion.prototype.image = "img/point02.png";

    AoeExplosion.prototype.maxLife = 10;

    AoeExplosion.prototype.radius = 2;

    AoeExplosion.prototype.sound = "sounds/weapons/thud3.wav";

    AoeExplosion.prototype.soundVolume = 0.5;

    AoeExplosion.prototype.damage = 0;

    AoeExplosion.prototype.aoe = 0;

    AoeExplosion.prototype.tick = function () {
      if (!this.damaged) {
        this.damaged = true;
        return sim.unitSpaces[otherSide(this.side)].findInRange(
          this.pos,
          this.aoe + 500,
          (function (_this) {
            return function (unit) {
              var distance, fallOff;
              distance = Math.max(v2.distance(_this.pos, unit.pos) - unit.radius, 0);
              if (distance < _this.aoe) {
                fallOff = 1 - distance / _this.aoe;
                if (typeof unit.applyDamage === "function") {
                  unit.applyDamage(_this.damage * fallOff);
                }
                if (_this.energyDamage > 1) {
                  if (typeof unit.applyEnergyDamage === "function") {
                    unit.applyEnergyDamage(_this.energyDamage * fallOff);
                  }
                }
                if (_this.burnAmount > 1) {
                  if (typeof unit.applyBurnAmount === "function") {
                    unit.applyBurnAmount(_this.burnAmount * fallOff);
                  }
                }
              }
              return false;
            };
          })(this)
        );
      }
    };

    AoeExplosion.prototype.draw = function () {
      var fade, s;
      if (this.dead) {
        return;
      }
      fade = Math.min(1, this.life / this.maxLife);
      s = (this.aoe / 512) * this.radius;
      this.color[3] = (1 - fade) * 50;
      return baseAtlas.drawSprite(this.image, this.pos, [s, s], this.rot, this.color);
    };

    return AoeExplosion;
  })(Explosion);

  types.FrameExplosion = (function (superClass) {
    extend(FrameExplosion, superClass);

    FrameExplosion.prototype.image = "img/fx/fire1/f#.png";

    FrameExplosion.prototype.nFrames = 8;

    FrameExplosion.prototype.maxLife = 16;

    FrameExplosion.prototype.radius = 2;

    FrameExplosion.prototype.sound = "sounds/weapons/explode1.wav";

    FrameExplosion.prototype.soundVolume = 0.1;

    function FrameExplosion() {
      FrameExplosion.__super__.constructor.call(this);
    }

    FrameExplosion.prototype.draw = function () {
      var fade, frame, image, intFrame, s, tweenFrame;
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      s = 3;
      this.color = [255, 255, 255, 210];
      if (this.loopFrames) {
        frame = (this.life % this.nFrames) + 1;
        intFrame = Math.floor(frame);
        image = this.image.replace("#", intFrame);
        return baseAtlas.drawSprite(image, this.pos, [s, s], this.rot, this.color);
      } else {
        frame = (this.life / this.maxLife) * this.nFrames + 1;
        intFrame = Math.floor(frame);
        if (intFrame < this.nFrames) {
          tweenFrame = frame - intFrame;
          image = this.image.replace("#", intFrame);
          return baseAtlas.drawSprite(image, this.pos, [s, s], this.rot, this.color);
        }
      }
    };

    return FrameExplosion;
  })(Explosion);

  _focus = v2.create();

  _size = v2.create();

  types.Rock = (function () {
    Rock.prototype.image = "img/unitBar/pip1.png";

    Rock.prototype.size = [1, 1];

    Rock.prototype["static"] = true;

    Rock.prototype.maxHP = 1000;

    function Rock() {
      this.image = "img/rocks/srock01.png";
      if (typeof sim !== "undefined" && sim !== null) {
        this.color = sim.theme.fillColor;
      }
      this.id = sim.nid();
      this.dead = false;
      this.hp = this.maxHP;
      this.pos = v2.create([0, 0]);
      this.vel = v2.create([0, 0]);
      this.rot = 0;
      this.size = v2.create([1, 1]);
    }

    Rock.prototype.move = function () {};

    Rock.prototype.draw = function () {
      return baseAtlas.drawSprite(this.image, this.pos, [this.size[0], -this.size[0]], this.rot, this.color, this.z);
    };

    return Rock;
  })();

  sideColor = function (side) {
    var color, mySide;
    mySide = typeof commander !== "undefined" && commander !== null ? commander.side : void 0;
    if (mySide !== "beta") {
      mySide = "alpha";
    }
    if (mySide === side) {
      color = [230, 230, 230, 255];
    } else {
      color = [20, 20, 20, 255];
    }
    return color;
  };

  anitSideColor = function (side) {
    var color, mySide;
    mySide = typeof commander !== "undefined" && commander !== null ? commander.side : void 0;
    if (mySide === "spectators") {
      mySide = "alpha";
    }
    if (mySide !== side) {
      color = [230, 230, 230, 255];
    } else {
      color = [20, 20, 20, 255];
    }
    return color;
  };

  types.CommandPoint = (function () {
    CommandPoint.prototype.image = "img/point02.png";

    CommandPoint.prototype.sliceImage = "img/map/slice02.png";

    CommandPoint.prototype.maxHP = 1000;

    CommandPoint.prototype.size = [1, 1];

    CommandPoint.prototype.maxHP = 1000;

    CommandPoint.prototype.radius = 250;

    CommandPoint.prototype.commandPoint = true;

    CommandPoint.prototype.capping = 0;

    CommandPoint.prototype.maxCapp = 10;

    function CommandPoint() {
      this.id = sim.nid();
      this.dead = false;
      this.z = 0.01;
      this.hp = this.maxHP;
      this.pos = v2.create(0, 0);
      this.vel = [0, 0];
      this.rot = 0;
      this.color = [255, 255, 255, 255];
      this.side = "neutral";
      this.capping = 0;
    }

    CommandPoint.prototype.tick = function () {
      var _, distance, id, j, k, len, p, player, playerOnPoint, ref, ref1, results, sides, thing;
      if (sim.state !== "running") {
        return;
      }
      if (sim.step % 16 === 0) {
        if (this.side !== null) {
          ref = sim.players;
          for (_ in ref) {
            p = ref[_];
            if (p && p.side === this.side) {
              if (p.gainsMoney && sim.gainsMoney) {
                p.earnMoney(1);
              }
            }
          }
        }
        sides = {};
        playerOnPoint = [];
        ref1 = sim.things;
        for (id in ref1) {
          thing = ref1[id];
          if (thing.unit && thing.canCapture) {
            distance = v2.distance(this.pos, thing.pos);
            if (distance < this.radius) {
              sides[thing.side] = true;
              player = sim.players[thing.owner];
              if (player) {
                playerOnPoint.push(player);
              }
            }
          }
        }
        sides = (function () {
          var results;
          results = [];
          for (k in sides) {
            results.push(k);
          }
          return results;
        })();
        if (sides.length === 1 && this.side !== sides[0]) {
          this.capping += 1;
          if (this.capping >= this.maxCapp) {
            this.side = sides[0];
            sim.captures += 1;
            this.capping = 0;
            this.bonus(this.side, 100);
            results = [];
            for (j = 0, len = playerOnPoint.length; j < len; j++) {
              p = playerOnPoint[j];
              results.push((p.capps += 1));
            }
            return results;
          }
        } else {
          if (this.capping > 0) {
            return (this.capping -= 1);
          }
        }
      }
    };

    CommandPoint.prototype.bonus = function (side, amount) {
      var _, p, ref, results;
      ref = sim.players;
      results = [];
      for (_ in ref) {
        p = ref[_];
        if (p.side === this.side) {
          if (p.gainsMoney && sim.gainsMoney) {
            results.push(p.earnMoney(amount));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    CommandPoint.prototype.draw = function () {
      var color, i, j, ref, results, th, x, y;
      if (sim.theme) {
        color = sideColor(this.side);
        baseAtlas.drawSprite(this.image, this.pos, this.size, this.rot, color);
        if (this.capping > 0) {
          color = anitSideColor(this.side);
          results = [];
          for (i = j = 0, ref = this.maxCapp; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            if (this.capping < i) {
              break;
            }
            th = (i / this.maxCapp) * 2 * Math.PI;
            x = this.pos[0] + Math.sin(th) * (this.radius + 50);
            y = this.pos[1] + Math.cos(th) * (this.radius + 50);
            results.push(baseAtlas.drawSprite(this.sliceImage, [x, y], [1, 1], Math.PI - th, color));
          }
          return results;
        }
      }
    };

    return CommandPoint;
  })();

  types.SpawnPoint = (function () {
    SpawnPoint.prototype.image = "";

    SpawnPoint.prototype.sliceImage = "img/map/spawnSlice.png";

    SpawnPoint.prototype.maxHP = 1000;

    SpawnPoint.prototype.size = [1, 1];

    SpawnPoint.prototype.maxHP = 1000;

    SpawnPoint.prototype["static"] = true;

    SpawnPoint.prototype.radius = 400;

    SpawnPoint.prototype.spawn = true;

    SpawnPoint.prototype.side = null;

    function SpawnPoint() {
      this.id = sim.nid();
      this.dead = false;
      this.z = 0.01;
      this.hp = this.maxHP;
      this.pos = v2.create(0, 0);
      this.vel = [0, 0];
      this.rot = 0;
      this.color = [255, 255, 255, 255];
      this.side = "neutral";
    }

    SpawnPoint.prototype.draw = function () {
      var color, i, j, max, ref, results, th, to, x, y;
      if (!sim.theme) {
        return;
      }
      color = sideColor(this.side);
      max = 20;
      to = ((sim.step - 8) / (16 * 2)) * 20;
      results = [];
      for (i = j = 0, ref = max; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (to < i) {
          break;
        }
        th = (i / max) * 2 * Math.PI;
        x = this.pos[0] + Math.sin(th) * (this.radius + 50);
        y = this.pos[1] + Math.cos(th) * (this.radius + 50);
        results.push(baseAtlas.drawSprite(this.sliceImage, [x, y], [1, 1], Math.PI / 2 - th, color));
      }
      return results;
    };

    return SpawnPoint;
  })();
}.call(this));
