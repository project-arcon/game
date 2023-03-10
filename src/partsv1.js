// here begin src/partsv1.js
(function () {
  var extend = function (child, parent) {
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
  };

  window.Part = (function () {
    Part.prototype.hp = 10;

    Part.prototype.cost = 10;

    Part.prototype.mass = 40;

    Part.prototype.rot = 0;

    Part.prototype.dir = 0;

    Part.prototype.canRotate = true;

    Part.prototype.flip = true;

    Part.prototype.scale = 1;

    Part.prototype.opacity = 1;

    Part.prototype.flippedSize = function () {
      var xsize, ysize;
      xsize = this.size[0];
      ysize = this.size[1];
      if (this.dir % 2 === 0) {
        return [xsize, ysize];
      } else {
        return [ysize, xsize];
      }
    };

    function Part() {
      this.pos = v2.create();
      this.worldPos = v2.create();
      this.orignalImage = this.image;
    }

    Part.prototype.computeWorldPos = function () {
      v2.set(this.pos, this.worldPos);
      v2.sub(this.worldPos, this.unit.center);
      v2.rotate(this.worldPos, Math.PI + this.unit.rot, this.worldPos);
      return v2.add(this.worldPos, this.unit.pos);
    };

    Part.prototype.draw = function () {
      var alpha, angle, c, flip, id, num, numParts, rot, showDamage, t;
      if (this.pos[0] < 0 && this.flip) {
        flip = -1;
      } else {
        flip = 1;
      }
      if (this.gimble) {
        rot = Math.PI + this.rot;
      } else {
        rot = Math.PI + this.unit.rot;
      }
      angle = (Math.PI * this.dir) / 2;
      rot += angle;
      if (this.canShowDamage && this.image === this.orignalImage) {
        numParts = this.unit.parts.length;
        id = this.unit.id;
        num = this.partNum % numParts;
        showDamage = num / numParts > this.unit.hp / this.unit.maxHP;
        if (showDamage) {
          t = ((this.partNum + id) % 3) + 1;
          this.image = this.orignalImage.replace(".png", ".d" + t + ".png");
        }
      }
      if (this.northWest) {
        if (this.dir === 0 || this.dir === 2) {
          this.image = this.orignalImage;
        } else {
          this.image = this.orignalImage.replace("N", "W");
        }
      }
      alpha = 255;
      if (this.unit.cloakFade > 0) {
        alpha = 255 - this.unit.cloakFade * 200;
      }
      if (this.stripe) {
        baseAtlas.drawSprite(
          "parts/gray-" + this.image,
          this.worldPos,
          [flip, -1],
          rot,
          [255, 255, 255, alpha]
        );
        c = this.unit.color;
        return baseAtlas.drawSprite(
          "parts/red-" + this.image,
          this.worldPos,
          [flip, -1],
          rot,
          [c[0], c[1], c[2], alpha]
        );
      } else if (this.decal) {
        c = this.unit.color;
        return baseAtlas.drawSprite(
          "parts/" + this.image,
          this.worldPos,
          [flip / this.scale, -1 / this.scale],
          rot,
          [c[0], c[1], c[2], alpha * this.opacity]
        );
      } else {
        return baseAtlas.drawSprite(
          "parts/" + this.image,
          this.worldPos,
          [flip, -1],
          rot,
          [255, 255, 255, alpha]
        );
      }
    };

    Part.prototype.tick = function () {};

    return Part;
  })();

  _color = [0, 0, 0, 0];

  window.Engine = (function (superClass) {
    extend(Engine, superClass);

    function Engine() {
      return Engine.__super__.constructor.apply(this, arguments);
    }

    Engine.prototype.trailSize = 0.1;

    Engine.prototype.trailTime = 32;

    Engine.prototype.canRotate = false;

    Engine.prototype.preDraw = function () {
      var ref;
      if (v2.mag(this.unit.vel) > 1) {
        if (!this.trail) {
          this.trail = new Trail(
            this.unit.id,
            this.trailSize,
            this.trailTime,
            this.unit.color,
            this.unit.z
          );
        }
        if ((ref = this.trail) != null) {
          ref.grow(this.worldPos);
        }
        this.trail.color = this.unit.color;
        return (this.trail.z = this.unit.z - 0.0001);
      }
    };

    return Engine;
  })(Part);

  _offset = [0, 0];

  _where = [0, 0];

  _vel = [0, 0];

  window.weaponAim = function (worldPos, range, bulletSpeed, instant, thing) {
    var c,
      check,
      current_time,
      d,
      do_pos,
      j,
      max_time,
      mdown,
      miss,
      mup,
      p,
      predicted_pos,
      th;
    if (instant) {
      p = thing.pos;
      predicted_pos = [p[0] - worldPos[0], p[1] - worldPos[1]];
      th = v2.angle(predicted_pos);
      return [th, v2.mag(predicted_pos) - thing.radius];
    }
    do_pos = (function () {
      return function (t) {
        var v;
        p = thing.pos;
        v = thing.vel;
        return [p[0] - worldPos[0] + v[0] * t, p[1] - worldPos[1] + v[1] * t];
      };
    })();
    check = (function () {
      return function (t) {
        var miss, predicted_range;
        predicted_pos = do_pos(t);
        predicted_range = v2.mag(predicted_pos) - thing.radius;
        miss = Math.abs(predicted_range - bulletSpeed * t);
        return miss;
      };
    })();
    max_time = range / bulletSpeed;
    current_time = 0;
    d = 2;
    miss = check(current_time);
    for (c = j = 0; j < 32; c = ++j) {
      mdown = check(current_time - max_time / d);
      mup = check(current_time + max_time / d);
      if (mdown < miss && mdown < mup) {
        current_time -= max_time / d;
        miss = mdown;
      }
      if (mup < miss && mup < mdown) {
        current_time += max_time / d;
        miss = mup;
      }
      if (miss < 1) {
        break;
      }
      d *= 2;
    }
    if (current_time < 0) {
      current_time = 0;
    }
    predicted_pos = do_pos(current_time);
    th = v2.angle(predicted_pos);
    return [th, v2.mag(predicted_pos) - thing.radius];
  };

  window.Turret = (function (superClass) {
    extend(Turret, superClass);

    Turret.prototype.tab = "weapons";

    Turret.prototype.image = "turret01.png";

    Turret.prototype.gimble = true;

    Turret.prototype.weapon = true;

    Turret.prototype.canRotate = false;

    Turret.prototype.target = null;

    Turret.prototype.bulletCls = types.FlyerBullet;

    Turret.prototype.range = 500;

    Turret.prototype.damage = 0;

    Turret.prototype.energyDamage = 0;

    Turret.prototype.bulletSpeed = 1;

    Turret.prototype.reloadTime = 10;

    Turret.prototype.overshoot = 0.3;

    Turret.prototype.minRange = -1000;

    Turret.prototype.instant = false;

    Turret.prototype.accuracy = 0;

    Turret.prototype.exactRange = false;

    Turret.prototype.arc = 0;

    Turret.prototype.weaponRange = 1;

    Turret.prototype.weaponRangeFlat = 0;

    Turret.prototype.weaponDamage = 1;

    Turret.prototype.weaponEnergyDamage = 1;

    Turret.prototype.weaponSpeed = 1;

    Turret.prototype.weaponReload = 1;

    Turret.prototype.weaponEnergy = 1;

    Turret.prototype.noOverkill = false;

    function Turret() {
      this.canShoot = bind(this.canShoot, this);
      this.reload = 0;
      this.rot = 0;
      this.fireTimer = 0;
      this.pos = v2.create();
      this.worldPos = v2.create();
      this.orignalImage = this.image;
      this._rot = 0;
      this._rot2 = 0;
    }

    Turret.prototype.init = function () {
      var j, len, part, ref, results;
      ref = this.unit.parts;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        part = ref[j];
        if (part.mount && v2.distance(part.pos, this.pos) < 0.1) {
          part.turret = this;
          this.arc = part.arc;
          results.push(
            typeof part.initTurret === "function"
              ? part.initTurret(this)
              : void 0
          );
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Turret.prototype.applyBuffs = function () {
      this.range *= this.weaponRange;
      this.range += this.weaponRangeFlat;
      this.damage *= this.weaponDamage;
      this.energyDamage *= this.weaponDamage;
      this.bulletSpeed *= this.weaponSpeed;
      this.minRange *= 1 + (this.weaponSpeed - 1) / 2;
      this.reloadTime *= this.weaponReload;
      this.shotEnergy *= this.weaponEnergy;
      this.reloadTime = Math.ceil(this.reloadTime);
      this.fireEnergy = this.shotEnergy / this.reloadTime;
      this.projectileSpeed = this.weaponRange / this.weaponSpeed;
      return (this.dps = this.damage / this.reloadTime);
    };

    Turret.prototype.tick = function () {
      var angle, halfArc;
      if (this.reload > 0) {
        this.reload -= 1;
      }
      this.working = this.reload <= 1 && this.unit.energy > this.shotEnergy;
      if (!this.target) {
        this.rot = turnAngle(this.rot, this.unit.rot, 0.075);
      }
      halfArc = ((this.arc / 180) * Math.PI) / 2;
      angle = angleBetween(this.unit.rot, this.rot);
      if (angle > halfArc) {
        this.rot = this.unit.rot + halfArc;
      }
      if (angle < -halfArc) {
        this.rot = this.unit.rot - halfArc;
      }
      if (this.unit.target !== null && this.canShoot(this.unit.target)) {
        this.target = this.unit.target;
        this.fire();
      } else if (this.target !== null && this.canShoot(this.target)) {
        this.fire();
      } else {
        this.findTarget();
        if (this.unit.target !== null && this.canShoot(this.unit.target)) {
          this.target = this.unit.target;
          this.fire();
        } else if (this.target !== null && this.canShoot(this.target)) {
          this.fire();
        }
      }
    };

    Turret.prototype.draw = function () {
      if (this.working) {
        this.image = this.orignalImage;
      } else {
        this.image = this.orignalImage.replace(".png", "Reload.png");
      }
      return Turret.__super__.draw.call(this);
    };

    Turret.prototype.clientTick = function () {
      //vax
      // turret reload fix
      var ditance, ref, target, th;
      if (this.reload > 0) {
        this.reload -= 1;
      }
      if (this.workedBefore === undefined) {
        this.workedBefore = false;
      }
      if (this.working) {
        this.workedBefore = true;
        this.reload = 0;
      } else if (!this.working && this.workedBefore) {
        this.reload = this.reloadTime;
        this.workedBefore = false;
      }
      target = intp.things[this.targetId];
      if (target) {
        (ref = this.aim(target)), (th = ref[0]), (ditance = ref[1]);
        this._rot = th;
      } else {
        return (this._rot = turnAngle(this._rot, this.unit.rot, 0.075));
      }
    };

    Turret.prototype.aim = function (thing) {
      return weaponAim(
        this.worldPos,
        this.range,
        this.bulletSpeed,
        this.instant,
        thing
      );
    };

    Turret.prototype.canShoot = function (other) {
      var aimDistance, arcAngle, distance, ref, th;
      if (!other.unit && !(other.missile && this.hitsMissiles)) {
        return false;
      }
      if (this.instant && other.unit && other.shouldDie()) {
        return false;
      }
      if (
        this.instant &&
        this.hitsMissiles &&
        other.missile &&
        other.life >= other.maxLife
      ) {
        return false;
      }
      if (other.dead || other.applyDamage == null) {
        return false;
      }
      if (this.unit.id === other.id) {
        return false;
      }
      if (this.unit.side === other.side) {
        return false;
      }
      if (other.missile && other.explode === false) {
        return false;
      }
      if (!this.engageCloak && other.cloak > 0 && other.cloaked()) {
        return false;
      }
      distance = v2.distance(this.worldPos, other.pos);
      if (distance > this.range * 2) {
        return false;
      }
      if (this.onlyInRange) {
        if (
          distance + other.radius < this.minRange ||
          distance - other.radius > this.range
        ) {
          return false;
        }
      }
      (ref = this.aim(other)), (th = ref[0]), (aimDistance = ref[1]);
      if (aimDistance < this.minRange || aimDistance > this.range) {
        return false;
      }
      arcAngle = angleBetween(this.unit.rot, th);
      if (!((Math.abs(arcAngle) / Math.PI) * 180 <= this.arc / 2)) {
        return false;
      }
      if (this.noOverkill) {
        if (this.unit.target) {
          if (this.unit.target.id === other.id) {
            return true;
          } else {
            return false;
          }
        }
        if (other.maxHP * 2 < this.damage) {
          return false;
        }
        if (this.energyDamage && other.storeEnergy * 2 < this.energyDamage) {
          return false;
        }
      }
      return true;
    };

    Turret.prototype.findTarget = function () {
      var j, l, len, len1, m, ref, ref1, results, u;
      if (this.unit.target && !this.hitsMissiles) {
        this.target = this.unit.target;
        return;
      }
      this.target = null;
      if (this.hitsMissiles) {
        ref = this.unit.closestEnemyBullets();
        for (j = 0, len = ref.length; j < len; j++) {
          m = ref[j];
          if (this.canShoot(m)) {
            this.target = m;
            break;
          }
        }
        if (this.target) {
          return;
        }
      }
      ref1 = this.unit.closestEnemies();
      results = [];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        u = ref1[l];
        if (this.canShoot(u)) {
          this.target = u;
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Turret.prototype.fire = function () {
      var angleLeft, dist, ref, rot;
      (ref = this.aim(this.target)), (rot = ref[0]), (dist = ref[1]);
      this.rot = turnAngle(this.rot, rot, 1);
      angleLeft = angleBetween(this.rot, rot);
      if (Math.abs(angleLeft) > 0.01) {
        return;
      }
      if (this.reload > 0) {
        return;
      }
      if (this.unit.energy < this.shotEnergy) {
        return;
      }
      this.reload = this.reloadTime;
      this.unit.energy -= this.shotEnergy;
      return this.makeBullet(dist);
    };

    Turret.prototype.makeBullet = function (distance) {
      var exp, particle;
      this.unit.cloak = 0;
      particle = new this.bulletCls();
      sim.things[particle.id] = particle;
      particle.side = this.unit.side;
      particle.life = 0;
      particle.dead = false;
      particle.z = this.unit.z + 0.001;
      particle.turretNum = this.turretNum;
      particle.origin = this.unit;
      particle.weapon = this;
      particle.target = this.target;
      particle.speed = this.bulletSpeed;
      particle.damage = this.damage;
      particle.energyDamage = this.energyDamage;
      particle.hitsMissiles = this.hitsMissiles;
      particle.aoe = this.aoe;
      particle.burnAmount = this.burnAmount;
      v2.set(this.worldPos, particle.pos);
      v2.pointTo(particle.vel, this.rot);
      v2.scale(particle.vel, particle.speed);
      particle.rot = this.rot;
      if (this.instant) {
        particle.targetPos = v2.create(particle.target.pos);
        if (this.target.maxLife) {
          this.target.life = this.target.maxLife;
          this.target.explode = false;
          exp = new types.HitExplosion();
          exp.z = 1000;
          exp.pos = [this.target.pos[0], this.target.pos[1]];
          exp.vel = [0, 0];
          exp.rot = 0;
          exp.radius = 0.5;
          sim.things[exp.id] = exp;
        } else {
          this.target.applyDamage(particle.damage);
        }
      } else if (this.exactRange) {
        particle.maxLife = Math.floor(distance / particle.speed);
        particle.hitPos = v2.create();
        v2.add(particle.hitPos, particle.vel);
        v2.scale(particle.hitPos, distance / particle.speed);
        v2.add(particle.hitPos, particle.pos);
      } else {
        particle.maxLife = Math.floor(
          (this.range / particle.speed) * (1 + this.overshoot)
        );
      }
      return typeof particle.postFire === "function"
        ? particle.postFire()
        : void 0;
    };

    return Turret;
  })(Part);
}.call(this));
