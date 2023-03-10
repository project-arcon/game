// here begin src/partsloader.js
(function () {
  window.all_unit_comps = {};

  window.unit_comp = (function () {
    unit_comp.prototype.parent_unit = null;

    function unit_comp(parent_unit) {
      this.parent_unit = parent_unit;
      this.init();
    }

    unit_comp.prototype.init = function () {};

    unit_comp.prototype.tick = function () {};

    unit_comp.prototype.postTick = function () {};

    unit_comp.prototype.postDeath = function () {};

    return unit_comp;
  })();

  all_unit_comps.energy = (function (superClass) {
    extend(energy, superClass);

    energy.prototype.init = function () {
      parent_unit.max_energy_capacity = 0;
      parent_unit.energy = 0;
      parent_unit.energy_gen_rate = 0;
    }

    energy.prototype.tick = function () {
      parent_unit.energy =
        Math.max(
          parent_unit.energy_gen_rate * 48,
          Math.min(
            parent_unit.max_energy_capacity,
            parent_unit.energy + parent_unit.energy_gen_rate
          )
        );
    };

    return energy;
  })(unit_comp);

  all_part_comps.cloak = (function (superClass) {
    extend(cloak, superClass);

    cloak.prototype.init = function () {
    }

    cloak.prototype.tick = function () {
    };

    return cloak;
  })(unit_comp);

}.call(this));
