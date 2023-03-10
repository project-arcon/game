// here begin src/partsloader.js
(function () {
  window.partsV2 ??= {};

  window.PartV2 = (function () {
    PartV2.prototype.config = "";
    PartV2.prototype.rot = 0;
    PartV2.prototype.dir = 0;
    PartV2.prototype.flip = true;
    PartV2.prototype.scale = 1;
    PartV2.prototype.opacity = 1;
    PartV2.prototype.comps = [];
    PartV2.prototype.flippedSize = function () {
      var xsize, ysize;
      xsize = this.size[0];
      ysize = this.size[1];
      if (this.dir % 2 === 0) {
        return [xsize, ysize];
      } else {
        return [ysize, xsize];
      }
    };
    function PartV2(part_id) {
      this.pos = v2.create();
      this.worldPos = v2.create();
      this.orignalImage = this.image;

      var part_config = partsV2[part_id]; // ?? partsV2["arcon:missing_part"];

      if (!part_config) {
        return undefined;
      }

      this.id = part_config.id;
      this.cost = part_config.cost;
      this.hp = part_config.hp;
      this.mass = part_config.mass;
      this.size = part_config.size;
      for (const comp_name in part_config.components) {
        const comp_property = part_config.components[comp_name];
        this.NewComp(comp_name, comp_property);
      }
    }
    PartV2.prototype.BuildOnUnit = function () {
      this.unit.cost += this.cost || 0;
      this.unit.hp += this.hp || 0;
      this.unit.mass += this.mass || 0;
      this.RunAllComp((comp) => {
        comp.BuildOnUnit();
      });
      /*
      this.RunForComp("wing", (comp) => {
        this.unit.turnSpeed += comp.turn_rate;
      });
      this.RunForComp("thruster", (comp) => {
        thrust += comp.thrust;
      });
      this.RunForComp("energy", (comp) => {
        this.unit.genEnergy += comp.energy_generate || 0;
        this.unit.storeEnergy += comp.energy_capacity || 0;
      });
      this.RunForComp("shield", (comp) => {
        this.unit.genShield += comp.shield_generate || 0;
        this.unit.shield += comp.shield_capacity || 0;
      });
      this.RunForComp("jump_drive", (comp) => {
        this.unit.jumpCount += comp.jump_drives_count || 0;
      });
      this.RunForComp("supercapital_bridge", (comp) => {
        this.unit.limitBonus += comp.limit_bonus || 0;
      });
      if (this.arc && this.unit.weaponArc < this.arc) {
        this.unit.weaponArc = this.arc;
      }
      if (this.arc && (this.unit.minArc === 0 || this.unit.minArc > this.arc)) {
        this.unit.minArc = this.arc;
      }
      this.RunForComp("transfer", (comp) => {
        if (comp.range > this.unit.maxRange) {
          this.unit.maxRange = comp.range;
        }
      });
      if (p.type === "StasisField") {
        stasisRange =
          this.range + v2.distance(this.pos, this.unit.center) + 100;
        if (stasisRange > this.unit.maxRange) {
          this.unit.maxRange = stasisRange;
        }
      }
      */
    };
    PartV2.prototype.NewComp = function (comp_name, comp_property) {
      if (all_part_comps[comp_name]) {
        this.comps.push(new all_part_comps[comp_name](this, comp_property));
      }
    };
    PartV2.prototype.RunAllComp = function (func) {
      this.comps.forEach((comp) => {
        func(comp);
      });
    };
    PartV2.prototype.RunForComp = function (comp_name, func) {
      this.RunAllComp((comp) => {
        if (comp.name === comp_name) {
          func(comp);
        }
      });
    };
    PartV2.prototype.computeWorldPos = function () {
      v2.set(this.pos, this.worldPos);
      v2.sub(this.worldPos, this.unit.center);
      v2.rotate(this.worldPos, Math.PI + this.unit.rot, this.worldPos);
      return v2.add(this.worldPos, this.unit.pos);
    };

    PartV2.prototype.tick = function () {
      for (const comp_type in this.comps) {
        const comp = this.comps[comp_type];
        if (typeof comp.tick === "function") {
          comp.tick();
        }
      }
    };

    PartV2.prototype.postTick = function () {
      for (const comp_type in this.comps) {
        const comp = this.comps[comp_type];
        if (typeof comp.postTick === "function") {
          comp.postTick();
        }
      }
    };

    PartV2.prototype.postDeath = function () {
      for (const comp_type in this.comps) {
        const comp = this.comps[comp_type];
        if (typeof comp.postDeath === "function") {
          comp.postDeath();
        }
      }
    };

    PartV2.prototype.draw = function () {
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
      if (this.ghostCopy) {
        alpha = 170;
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

    return PartV2;
  })();

  window.PartConfig = (function () {
    PartConfig.prototype.id = "";
    PartConfig.prototype.cost = 0;
    PartConfig.prototype.hp = 0;
    PartConfig.prototype.mass = 0;
    PartConfig.prototype.size = [1, 1];
    PartConfig.prototype.layer = "soild";
    PartConfig.prototype.paintable = false;
    PartConfig.prototype.rotatable = true;
    PartConfig.prototype.disabled = true;
    PartConfig.prototype.components = {};

    function PartConfig(id) {
      this.id = id;
    }
    return PartConfig;
  })();

  window.PartDescriber = (function () {
    PartDescriber.prototype.id = "";
    PartDescriber.prototype.sprite = {};
    PartDescriber.prototype.canFlip = true;
    PartDescriber.prototype.translateKeyName = null;
    PartDescriber.prototype.translateKeyDesc = null;
    PartDescriber.prototype.translateKeyBlurb = null;
    PartConfig.prototype.scale = 1;
    PartConfig.prototype.opacity = 1;

    function PartDescriber(id) {
      this.id = id;
    }
    return PartDescriber;
  })();
}.call(this));
