// here begin src/partsloader.js
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

  window.all_part_comps = {};

  window.part_comp = (function () {
    part_comp.prototype.parent_part = null;
    part_comp.prototype.parent_unit = {
      get getter() {
        return this.parent_part.unit;
      },
    };
    part_comp.prototype.comp_property = {};

    function part_comp(parent_part, comp_property) {
      this.parent_part = parent_part;
      this.comp_property = comp_property;
      this.init();
    }

    part_comp.prototype.init = function () {};

    part_comp.prototype.BuildOnUnit = function () {};

    part_comp.prototype.tick = function () {};

    part_comp.prototype.postTick = function () {};

    part_comp.prototype.postDeath = function () {};

    return part_comp;
  })();

  all_part_comps.wing = (function (superClass) {
    extend(wing, superClass);

    wing.prototype.worked = 0;

    wing.prototype.init = function () {
      this.turn_rate = this.comp_property.turn_rate ?? 0;
    };

    wing.prototype.BuildOnUnit = function () {
      this.parent_unit.turnSpeed += this.turn_rate;
    };

    return wing;
  })(part_comp);

  all_part_comps.cloak_generator = (function (superClass) {
    extend(cloak_generator, superClass);

    (cloak_generator.prototype.cloak_generate = 5.25),
      (cloak_generator.prototype.energy_use = 23.75);
    cloak_generator.prototype.worked = 0;

    cloak_generator.prototype.init = function () {
      this.cloak_generate = this.comp_property.cloak_generate ?? 800;
      this.energy_use = this.comp_property.energy_use ?? 60;
    };

    cloak_generator.prototype.tick = function () {
      if (
        this.parent_unit.energy > this.energy_use &&
        this.parent_unit.cloak < this.parent_unit.mass
      ) {
        if (this.parent_unit.cloak > this.parent_unit.mass / 2) {
          this.parent_unit.energy -=
            this.energy_use *
            (Math.min(
              this.parent_unit.mass - this.parent_unit.cloak,
              this.cloak_generate
            ) /
              this.cloak_generate);
        }
        this.parent_unit.cloak += this.cloak_generate;
        if (this.parent_unit.cloak > this.parent_unit.mass) {
          this.parent_unit.cloak = this.parent_unit.mass;
        }
      }
    };

    return cloak_generator;
  })(part_comp);

  all_part_comps.energy_transfer = (function (superClass) {
    extend(energy_transfer, superClass);

    energy_transfer.prototype.range = 800;
    energy_transfer.prototype.trasferEnergy = 60;
    energy_transfer.prototype.worked = 0;
    energy_transfer.prototype.rate = 1; // was 16

    energy_transfer.prototype.init = function () {
      this.range = this.comp_property.range ?? 800;
      this.trasferEnergy = this.comp_property.trasferEnergy ?? 60;
      this.parent_unit.energyCasterPower =
        (this.parent_unit.energyCasterPower || 0) + 1;
      this.parent_unit.energyCaster = true;
    };

    energy_transfer.prototype.tick = function () {};

    energy_transfer.prototype.postTick = function () {
      sim.timeStart("energy_transfer");
      this.worked = Math.max(this.worked - 1, 0);
      var amount, distance, giveTo, i, j, len, len1, ref, ref1, thing;
      if ((sim.step + this.parent_unit.id) % this.rate === 0) {
        if (this.parent_unit.energy > (100 * this.rate) / 16) {
          giveTo = [];
          ref = this.parent_unit.closestFriends();
          for (i = 0, len = ref.length; i < len; i++) {
            thing = ref[i];
            if (thing.energy < thing.storeEnergy && thing.energy > -1) {
              if (
                thing.energyCaster &&
                thing.energy / thing.storeEnergy >
                  this.parent_unit.energy / this.parent_unit.storeEnergy
              ) {
                continue;
              }
              distance = v2.distance(this.parent_unit.pos, thing.pos);
              if (distance < this.range) {
                giveTo.push(thing);
              }
            }
          }
          ref1 = shuffle(giveTo);
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            thing = ref1[j];
            amount = thing.storeEnergy - thing.energy;
            var limit = this.trasferEnergy * this.rate;
            if (amount > limit) {
              amount = limit;
            }
            if (amount > this.parent_unit.energy) {
              amount = this.parent_unit.energy;
            }
            thing.energy += amount;
            this.parent_unit.energy -= amount;
            this.worked = 16;
          }
        }
      }
      this.working = this.worked > 0;
      sim.timeEnd("energy_transfer");
      return;
    };

    energy_transfer.prototype.BuildOnUnit = function () {
      if (this.range > this.parent_unit.maxRange) {
        this.parent_unit.maxRange = this.range;
      }
    };

    energy_transfer.prototype.draw = function () {
      var r;
      energy_transfer.__super__.draw.call(this);
      if (this.working) {
        r = (this.range + 40) / 255;
        return baseAtlas.drawSprite(
          "img/point02.png",
          this.parent_unit.pos,
          [r, r],
          0,
          [255, 255, 255, 10]
        );
      }
    };

    return energy_transfer;
  })(part_comp);
}.call(this));
