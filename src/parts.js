(function () {
  var AiPart,
    Battery,
    Faction,
    HArmor,
    ModPart,
    ShadowArmor,
    UArmor,
    VArmor,
    VShadowArmor,
    Wing,
    _a,
    _b,
    _wave,
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
    hasProp = {}.hasOwnProperty,
    indexOf =
      [].indexOf ||
      function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
          if (i in this && this[i] === item) return i;
        }
        return -1;
      },
    bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };

  window.parts = {};

  parts.Mount360 = (function (superClass) {
    extend(Mount360, superClass);

    function Mount360() {
      return Mount360.__super__.constructor.apply(this, arguments);
    }

    Mount360.prototype.name = "360 Turret Mount";

    Mount360.prototype.desc = "Use this to mount weapons.";

    Mount360.prototype.hp = 10;

    Mount360.prototype.cost = 36;

    Mount360.prototype.image = "mount360.png";

    Mount360.prototype.mount = true;

    Mount360.prototype.arc = 360;

    Mount360.prototype.attach = true;

    Mount360.prototype.size = [2, 2];

    Mount360.prototype.mass = 30;

    Mount360.prototype.stripe = true;

    Mount360.prototype.tab = "weapons";

    Mount360.prototype.canRotate = false;

    return Mount360;
  })(Part);

  parts.Mount270 = (function (superClass) {
    extend(Mount270, superClass);

    function Mount270() {
      return Mount270.__super__.constructor.apply(this, arguments);
    }

    Mount270.prototype.name = "270 Turret Mount";

    Mount270.prototype.desc = "Use this to mount weapons.";

    Mount270.prototype.hp = 20;

    Mount270.prototype.cost = 21;

    Mount270.prototype.image = "mount300.png";

    Mount270.prototype.arc = 270;

    Mount270.prototype.size = [2, 2];

    Mount270.prototype.mass = 10;

    return Mount270;
  })(parts.Mount360);

  parts.Mount180 = (function (superClass) {
    extend(Mount180, superClass);

    function Mount180() {
      return Mount180.__super__.constructor.apply(this, arguments);
    }

    Mount180.prototype.name = "200 Turret Mount";

    Mount180.prototype.desc = "Use this to mount weapons.";

    Mount180.prototype.hp = 20;

    Mount180.prototype.cost = 12;

    Mount180.prototype.image = "mount180.png";

    Mount180.prototype.arc = 200;

    Mount180.prototype.size = [2, 2];

    Mount180.prototype.mass = 10;

    return Mount180;
  })(parts.Mount360);

  parts.Mount90 = (function (superClass) {
    extend(Mount90, superClass);

    function Mount90() {
      return Mount90.__super__.constructor.apply(this, arguments);
    }

    Mount90.prototype.name = "90 Turret Mount";

    Mount90.prototype.desc = "Use this to mount weapons.";

    Mount90.prototype.hp = 10;

    Mount90.prototype.cost = 9;

    Mount90.prototype.image = "mount90.png";

    Mount90.prototype.arc = 90;

    Mount90.prototype.size = [2, 2];

    Mount90.prototype.mass = 5;

    return Mount90;
  })(parts.Mount360);

  parts.Mount30 = (function (superClass) {
    extend(Mount30, superClass);

    function Mount30() {
      return Mount30.__super__.constructor.apply(this, arguments);
    }

    Mount30.prototype.name = "30 Turret Mount";

    Mount30.prototype.desc = "Use this to mount weapons.";

    Mount30.prototype.hp = 5;

    Mount30.prototype.cost = 3;

    Mount30.prototype.image = "mount30.png";

    Mount30.prototype.arc = 30;

    Mount30.prototype.size = [2, 2];

    Mount30.prototype.mass = 5;

    return Mount30;
  })(parts.Mount360);

  parts.Mount360Micro = (function (superClass) {
    extend(Mount360Micro, superClass);

    function Mount360Micro() {
      return Mount360Micro.__super__.constructor.apply(this, arguments);
    }

    Mount360Micro.prototype.name = "Micro 360 Turret Mount";

    Mount360Micro.prototype.desc = "A cheaper lighter 360 mount that has only 75% of the range of mounted weapons.";

    Mount360Micro.prototype.hp = 20;

    Mount360Micro.prototype.cost = 15;

    Mount360Micro.prototype.image = "mount360short.png";

    Mount360Micro.prototype.mount = true;

    Mount360Micro.prototype.arc = 360;

    Mount360Micro.prototype.attach = true;

    Mount360Micro.prototype.size = [2, 2];

    Mount360Micro.prototype.mass = 5;

    Mount360Micro.prototype.rangeBuffMul = 0.75;

    Mount360Micro.prototype.initTurret = function (turret) {
      return (turret.range *= this.rangeBuffMul);
    };

    return Mount360Micro;
  })(parts.Mount360);

  parts.Mount10Range = (function (superClass) {
    extend(Mount10Range, superClass);

    function Mount10Range() {
      return Mount10Range.__super__.constructor.apply(this, arguments);
    }

    Mount10Range.prototype.name = "Spinal Turret Mount";

    Mount10Range.prototype.desc = "A narrow angle forward mount that grants a large flat range bonus range.";

    Mount10Range.prototype.hp = 1;

    Mount10Range.prototype.cost = 20;

    Mount10Range.prototype.image = "mount10range.png";

    Mount10Range.prototype.mount = true;

    Mount10Range.prototype.arc = 20;

    Mount10Range.prototype.attach = true;

    Mount10Range.prototype.size = [2, 4];

    Mount10Range.prototype.mass = 60;

    Mount10Range.prototype.weaponRangeFlat = 500;

    Mount10Range.prototype.weaponEnergy = 25;

    Mount10Range.prototype.initTurret = function (turret) {
      turret.weaponRangeFlat += this.weaponRangeFlat;
      return (turret.weaponEnergy *= 1 + this.weaponEnergy / 100);
    };

    return Mount10Range;
  })(parts.Mount360);

  parts.Mount10Demi = (function (superClass) {
    extend(Mount10Demi, superClass);

    function Mount10Demi() {
      return Mount10Demi.__super__.constructor.apply(this, arguments);
    }

    Mount10Demi.prototype.name = "Demispinal Turret Mount";

    Mount10Demi.prototype.desc = "A smaller narrow angle forward mount that grants a moderate flat range bonus.";

    Mount10Demi.prototype.hp = 1;

    Mount10Demi.prototype.cost = 7;

    Mount10Demi.prototype.image = "mount10wide.png";

    Mount10Demi.prototype.mount = true;

    Mount10Demi.prototype.arc = 20;

    Mount10Demi.prototype.attach = true;

    Mount10Demi.prototype.size = [4, 2];

    Mount10Demi.prototype.mass = 15;

    Mount10Demi.prototype.weaponRangeFlat = 250;

    Mount10Demi.prototype.weaponEnergy = 10;

    Mount10Demi.prototype.initTurret = function (turret) {
      turret.weaponRangeFlat += this.weaponRangeFlat;
      return (turret.weaponEnergy *= 1 + this.weaponEnergy / 100);
    };

    return Mount10Demi;
  })(parts.Mount360);

  parts.DroneBody = (function (superClass) {
    extend(DroneBody, superClass);

    function DroneBody() {
      return DroneBody.__super__.constructor.apply(this, arguments);
    }

    DroneBody.prototype.name = "DroneBody";

    DroneBody.prototype.desc = "An independent drone with the mounted weapon.";

    DroneBody.prototype.hp = 5;

    DroneBody.prototype.cost = 15;

    DroneBody.prototype.image = "droneBody.png";

    DroneBody.prototype.mount = true;

    DroneBody.prototype.arc = 360;

    DroneBody.prototype.attach = false;

    DroneBody.prototype.solid = false;

    DroneBody.prototype.size = [4, 4];

    DroneBody.prototype.mass = 10;

    DroneBody.prototype.stripe = false;

    DroneBody.prototype.disable = true;

    return DroneBody;
  })(parts.Mount360);

  parts.Pad2x2 = (function (superClass) {
    extend(Pad2x2, superClass);

    function Pad2x2() {
      return Pad2x2.__super__.constructor.apply(this, arguments);
    }

    Pad2x2.prototype.name = "Fighter pad";

    Pad2x2.prototype.desc = "Allows fighters to land and repair.";

    Pad2x2.prototype.hp = 10;

    Pad2x2.prototype.cost = 36;

    Pad2x2.prototype.image = "pad2x2.png";

    Pad2x2.prototype.attach = true;

    Pad2x2.prototype.size = [2, 2];

    Pad2x2.prototype.mass = 30;

    Pad2x2.prototype.tab = "armor";

    Pad2x2.prototype.disable = true;

    return Pad2x2;
  })(Part);

  HArmor = (function (superClass) {
    extend(HArmor, superClass);

    function HArmor() {
      return HArmor.__super__.constructor.apply(this, arguments);
    }

    HArmor.prototype.name = "Heavyweight Armor";

    HArmor.prototype.desc = "Adds HP but also adds a lot of weight, making a ship slower.";

    HArmor.prototype.canShowDamage = true;

    HArmor.prototype.paintable = true;

    HArmor.prototype.tab = "armor1";

    return HArmor;
  })(Part);

  parts.HArmor2x2 = (function (superClass) {
    extend(HArmor2x2, superClass);

    function HArmor2x2() {
      return HArmor2x2.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2.prototype.hp = 64;

    HArmor2x2.prototype.cost = 8;

    HArmor2x2.prototype.image = "HArmor2x2.png";

    HArmor2x2.prototype.size = [2, 2];

    HArmor2x2.prototype.mass = 40;

    return HArmor2x2;
  })(HArmor);

  parts.HArmor1x2 = (function (superClass) {
    extend(HArmor1x2, superClass);

    function HArmor1x2() {
      return HArmor1x2.__super__.constructor.apply(this, arguments);
    }

    HArmor1x2.prototype.name = "Heavyweight Armor";

    HArmor1x2.prototype.hp = 32;

    HArmor1x2.prototype.cost = 4;

    HArmor1x2.prototype.image = "HArmor1x2.png";

    HArmor1x2.prototype.size = [1, 2];

    HArmor1x2.prototype.mass = 20;

    return HArmor1x2;
  })(HArmor);

  parts.HArmor1x1 = (function (superClass) {
    extend(HArmor1x1, superClass);

    function HArmor1x1() {
      return HArmor1x1.__super__.constructor.apply(this, arguments);
    }

    HArmor1x1.prototype.name = "Heavyweight Armor";

    HArmor1x1.prototype.hp = 16;

    HArmor1x1.prototype.cost = 2;

    HArmor1x1.prototype.image = "HArmor1x1.png";

    HArmor1x1.prototype.size = [1, 1];

    HArmor1x1.prototype.mass = 10;

    return HArmor1x1;
  })(HArmor);

  parts.HArmor2x1 = (function (superClass) {
    extend(HArmor2x1, superClass);

    function HArmor2x1() {
      return HArmor2x1.__super__.constructor.apply(this, arguments);
    }

    HArmor2x1.prototype.name = "Heavyweight Armor";

    HArmor2x1.prototype.hp = 32;

    HArmor2x1.prototype.cost = 4;

    HArmor2x1.prototype.image = "HArmor2x1.png";

    HArmor2x1.prototype.size = [2, 1];

    HArmor2x1.prototype.mass = 20;

    return HArmor2x1;
  })(HArmor);

  parts.HArmor1x1Angle = (function (superClass) {
    extend(HArmor1x1Angle, superClass);

    function HArmor1x1Angle() {
      return HArmor1x1Angle.__super__.constructor.apply(this, arguments);
    }

    HArmor1x1Angle.prototype.name = "Heavyweight Armor";

    HArmor1x1Angle.prototype.hp = 8;

    HArmor1x1Angle.prototype.cost = 1;

    HArmor1x1Angle.prototype.image = "HArmor1x1Angle.png";

    HArmor1x1Angle.prototype.size = [1, 1];

    HArmor1x1Angle.prototype.mass = 5;

    return HArmor1x1Angle;
  })(HArmor);

  parts.HArmor1x1AngleBack = (function (superClass) {
    extend(HArmor1x1AngleBack, superClass);

    function HArmor1x1AngleBack() {
      return HArmor1x1AngleBack.__super__.constructor.apply(this, arguments);
    }

    HArmor1x1AngleBack.prototype.name = "Heavyweight Armor";

    HArmor1x1AngleBack.prototype.hp = 8;

    HArmor1x1AngleBack.prototype.cost = 1;

    HArmor1x1AngleBack.prototype.image = "HArmor1x1AngleBack.png";

    HArmor1x1AngleBack.prototype.size = [1, 1];

    HArmor1x1AngleBack.prototype.mass = 5;

    return HArmor1x1AngleBack;
  })(HArmor);

  parts.HArmor2x2Angle = (function (superClass) {
    extend(HArmor2x2Angle, superClass);

    function HArmor2x2Angle() {
      return HArmor2x2Angle.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2Angle.prototype.name = "Heavyweight Armor";

    HArmor2x2Angle.prototype.hp = 64;

    HArmor2x2Angle.prototype.cost = 8;

    HArmor2x2Angle.prototype.image = "HArmor2x2Angle.png";

    HArmor2x2Angle.prototype.size = [2, 2];

    HArmor2x2Angle.prototype.mass = 40;

    return HArmor2x2Angle;
  })(HArmor);

  parts.HArmor2x2AngleBack = (function (superClass) {
    extend(HArmor2x2AngleBack, superClass);

    function HArmor2x2AngleBack() {
      return HArmor2x2AngleBack.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2AngleBack.prototype.name = "Heavyweight Armor";

    HArmor2x2AngleBack.prototype.hp = 64;

    HArmor2x2AngleBack.prototype.cost = 8;

    HArmor2x2AngleBack.prototype.image = "HArmor2x2AngleBack.png";

    HArmor2x2AngleBack.prototype.size = [2, 2];

    HArmor2x2AngleBack.prototype.mass = 40;

    return HArmor2x2AngleBack;
  })(HArmor);

  parts.HArmor2x2Front1 = (function (superClass) {
    extend(HArmor2x2Front1, superClass);

    function HArmor2x2Front1() {
      return HArmor2x2Front1.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2Front1.prototype.hp = 56;

    HArmor2x2Front1.prototype.mass = 35;

    HArmor2x2Front1.prototype.cost = 7;

    HArmor2x2Front1.prototype.image = "HArmor2x2Front1.png";

    HArmor2x2Front1.prototype.size = [2, 2];

    return HArmor2x2Front1;
  })(HArmor);

  parts.HArmor2x2Front2 = (function (superClass) {
    extend(HArmor2x2Front2, superClass);

    function HArmor2x2Front2() {
      return HArmor2x2Front2.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2Front2.prototype.hp = 48;

    HArmor2x2Front2.prototype.mass = 30;

    HArmor2x2Front2.prototype.cost = 6;

    HArmor2x2Front2.prototype.image = "HArmor2x2Front2.png";

    HArmor2x2Front2.prototype.size = [2, 2];

    return HArmor2x2Front2;
  })(HArmor);

  parts.HArmor1x2Font1 = (function (superClass) {
    extend(HArmor1x2Font1, superClass);

    function HArmor1x2Font1() {
      return HArmor1x2Font1.__super__.constructor.apply(this, arguments);
    }

    HArmor1x2Font1.prototype.hp = 24;

    HArmor1x2Font1.prototype.mass = 15;

    HArmor1x2Font1.prototype.cost = 3;

    HArmor1x2Font1.prototype.image = "HArmor1x2Font1.png";

    HArmor1x2Font1.prototype.size = [2, 1];

    return HArmor1x2Font1;
  })(HArmor);

  parts.HArmor1x2Front2 = (function (superClass) {
    extend(HArmor1x2Front2, superClass);

    function HArmor1x2Front2() {
      return HArmor1x2Front2.__super__.constructor.apply(this, arguments);
    }

    HArmor1x2Front2.prototype.hp = 16;

    HArmor1x2Front2.prototype.mass = 10;

    HArmor1x2Front2.prototype.cost = 2;

    HArmor1x2Front2.prototype.image = "HArmor1x2Front2.png";

    HArmor1x2Front2.prototype.size = [2, 1];

    return HArmor1x2Front2;
  })(HArmor);

  parts.HArmor2x2Back1 = (function (superClass) {
    extend(HArmor2x2Back1, superClass);

    function HArmor2x2Back1() {
      return HArmor2x2Back1.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2Back1.prototype.hp = 56;

    HArmor2x2Back1.prototype.mass = 35;

    HArmor2x2Back1.prototype.cost = 7;

    HArmor2x2Back1.prototype.image = "HArmor2x2Back1.png";

    HArmor2x2Back1.prototype.size = [2, 2];

    return HArmor2x2Back1;
  })(HArmor);

  parts.HArmor2x2Back2 = (function (superClass) {
    extend(HArmor2x2Back2, superClass);

    function HArmor2x2Back2() {
      return HArmor2x2Back2.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2Back2.prototype.hp = 48;

    HArmor2x2Back2.prototype.mass = 30;

    HArmor2x2Back2.prototype.cost = 6;

    HArmor2x2Back2.prototype.image = "HArmor2x2Back2.png";

    HArmor2x2Back2.prototype.size = [2, 2];

    return HArmor2x2Back2;
  })(HArmor);

  parts.HArmor1x2Back1 = (function (superClass) {
    extend(HArmor1x2Back1, superClass);

    function HArmor1x2Back1() {
      return HArmor1x2Back1.__super__.constructor.apply(this, arguments);
    }

    HArmor1x2Back1.prototype.hp = 24;

    HArmor1x2Back1.prototype.mass = 15;

    HArmor1x2Back1.prototype.cost = 3;

    HArmor1x2Back1.prototype.image = "HArmor1x2Back1.png";

    HArmor1x2Back1.prototype.size = [2, 1];

    return HArmor1x2Back1;
  })(HArmor);

  parts.HArmor1x2Back2 = (function (superClass) {
    extend(HArmor1x2Back2, superClass);

    function HArmor1x2Back2() {
      return HArmor1x2Back2.__super__.constructor.apply(this, arguments);
    }

    HArmor1x2Back2.prototype.hp = 16;

    HArmor1x2Back2.prototype.mass = 10;

    HArmor1x2Back2.prototype.cost = 2;

    HArmor1x2Back2.prototype.image = "HArmor1x2Back2.png";

    HArmor1x2Back2.prototype.size = [2, 1];

    return HArmor1x2Back2;
  })(HArmor);

  parts.HArmor2x2Curved = (function (superClass) {
    extend(HArmor2x2Curved, superClass);

    function HArmor2x2Curved() {
      return HArmor2x2Curved.__super__.constructor.apply(this, arguments);
    }

    HArmor2x2Curved.prototype.hp = 64;

    HArmor2x2Curved.prototype.mass = 40;

    HArmor2x2Curved.prototype.cost = 8;

    HArmor2x2Curved.prototype.image = "HArmor2x2Curved.png";

    HArmor2x2Curved.prototype.size = [2, 2];

    HArmor2x2Curved.prototype.dlc = "Curves and Shadows";

    return HArmor2x2Curved;
  })(HArmor);

  parts.HArmor2x1Curved = (function (superClass) {
    extend(HArmor2x1Curved, superClass);

    function HArmor2x1Curved() {
      return HArmor2x1Curved.__super__.constructor.apply(this, arguments);
    }

    HArmor2x1Curved.prototype.hp = 16;

    HArmor2x1Curved.prototype.mass = 10;

    HArmor2x1Curved.prototype.cost = 2;

    HArmor2x1Curved.prototype.image = "HArmor2x1Curved.png";

    HArmor2x1Curved.prototype.size = [2, 1];

    return HArmor2x1Curved;
  })(HArmor);

  parts.HArmor1x2Curved = (function (superClass) {
    extend(HArmor1x2Curved, superClass);

    function HArmor1x2Curved() {
      return HArmor1x2Curved.__super__.constructor.apply(this, arguments);
    }

    HArmor1x2Curved.prototype.hp = 16;

    HArmor1x2Curved.prototype.mass = 10;

    HArmor1x2Curved.prototype.cost = 2;

    HArmor1x2Curved.prototype.image = "HArmor1x2Curved.png";

    HArmor1x2Curved.prototype.size = [1, 2];

    return HArmor1x2Curved;
  })(HArmor);

  ShadowArmor = (function (superClass) {
    extend(ShadowArmor, superClass);

    function ShadowArmor() {
      return ShadowArmor.__super__.constructor.apply(this, arguments);
    }

    ShadowArmor.prototype.dlc = "Curves and Shadows";

    ShadowArmor.prototype.northWest = true;

    ShadowArmor.prototype.canShowDamage = false;

    return ShadowArmor;
  })(HArmor);

  parts.ShadowNArmor2x2Angle = (function (superClass) {
    extend(ShadowNArmor2x2Angle, superClass);

    function ShadowNArmor2x2Angle() {
      return ShadowNArmor2x2Angle.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor2x2Angle.prototype.hp = 64;

    ShadowNArmor2x2Angle.prototype.mass = 40;

    ShadowNArmor2x2Angle.prototype.cost = 8;

    ShadowNArmor2x2Angle.prototype.image = "ShadowNArmor2x2Angle.png";

    ShadowNArmor2x2Angle.prototype.size = [2, 2];

    return ShadowNArmor2x2Angle;
  })(ShadowArmor);

  parts.ShadowNArmor2x2 = (function (superClass) {
    extend(ShadowNArmor2x2, superClass);

    function ShadowNArmor2x2() {
      return ShadowNArmor2x2.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor2x2.prototype.hp = 64;

    ShadowNArmor2x2.prototype.mass = 40;

    ShadowNArmor2x2.prototype.cost = 8;

    ShadowNArmor2x2.prototype.image = "ShadowNArmor2x2.png";

    ShadowNArmor2x2.prototype.size = [2, 2];

    return ShadowNArmor2x2;
  })(ShadowArmor);

  parts.ShadowNArmor2x1 = (function (superClass) {
    extend(ShadowNArmor2x1, superClass);

    function ShadowNArmor2x1() {
      return ShadowNArmor2x1.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor2x1.prototype.hp = 32;

    ShadowNArmor2x1.prototype.mass = 20;

    ShadowNArmor2x1.prototype.cost = 4;

    ShadowNArmor2x1.prototype.image = "ShadowNArmor2x1.png";

    ShadowNArmor2x1.prototype.size = [2, 1];

    return ShadowNArmor2x1;
  })(ShadowArmor);

  parts.ShadowNArmor1x1 = (function (superClass) {
    extend(ShadowNArmor1x1, superClass);

    function ShadowNArmor1x1() {
      return ShadowNArmor1x1.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor1x1.prototype.hp = 16;

    ShadowNArmor1x1.prototype.mass = 10;

    ShadowNArmor1x1.prototype.cost = 2;

    ShadowNArmor1x1.prototype.image = "ShadowNArmor1x1.png";

    ShadowNArmor1x1.prototype.size = [1, 1];

    return ShadowNArmor1x1;
  })(ShadowArmor);

  parts.ShadowNArmor1x2 = (function (superClass) {
    extend(ShadowNArmor1x2, superClass);

    function ShadowNArmor1x2() {
      return ShadowNArmor1x2.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor1x2.prototype.hp = 32;

    ShadowNArmor1x2.prototype.mass = 20;

    ShadowNArmor1x2.prototype.cost = 4;

    ShadowNArmor1x2.prototype.image = "ShadowNArmor1x2.png";

    ShadowNArmor1x2.prototype.size = [1, 2];

    return ShadowNArmor1x2;
  })(ShadowArmor);

  parts.ShadowNArmor2x2Curve = (function (superClass) {
    extend(ShadowNArmor2x2Curve, superClass);

    function ShadowNArmor2x2Curve() {
      return ShadowNArmor2x2Curve.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor2x2Curve.prototype.hp = 64;

    ShadowNArmor2x2Curve.prototype.mass = 40;

    ShadowNArmor2x2Curve.prototype.cost = 8;

    ShadowNArmor2x2Curve.prototype.image = "ShadowNArmor2x2Curve.png";

    ShadowNArmor2x2Curve.prototype.size = [2, 2];

    return ShadowNArmor2x2Curve;
  })(ShadowArmor);

  parts.ShadowNArmor1x1Angle = (function (superClass) {
    extend(ShadowNArmor1x1Angle, superClass);

    function ShadowNArmor1x1Angle() {
      return ShadowNArmor1x1Angle.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor1x1Angle.prototype.hp = 8;

    ShadowNArmor1x1Angle.prototype.mass = 5;

    ShadowNArmor1x1Angle.prototype.cost = 1;

    ShadowNArmor1x1Angle.prototype.image = "ShadowNArmor1x1Angle.png";

    ShadowNArmor1x1Angle.prototype.size = [1, 1];

    return ShadowNArmor1x1Angle;
  })(ShadowArmor);

  parts.ShadowNArmor1x1Corner = (function (superClass) {
    extend(ShadowNArmor1x1Corner, superClass);

    function ShadowNArmor1x1Corner() {
      return ShadowNArmor1x1Corner.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor1x1Corner.prototype.hp = 16;

    ShadowNArmor1x1Corner.prototype.mass = 10;

    ShadowNArmor1x1Corner.prototype.cost = 2;

    ShadowNArmor1x1Corner.prototype.image = "ShadowNArmor1x1Corner.png";

    ShadowNArmor1x1Corner.prototype.size = [1, 1];

    return ShadowNArmor1x1Corner;
  })(ShadowArmor);

  parts.ShadowNArmor1x1CornerInner = (function (superClass) {
    extend(ShadowNArmor1x1CornerInner, superClass);

    function ShadowNArmor1x1CornerInner() {
      return ShadowNArmor1x1CornerInner.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor1x1CornerInner.prototype.hp = 16;

    ShadowNArmor1x1CornerInner.prototype.mass = 10;

    ShadowNArmor1x1CornerInner.prototype.cost = 2;

    ShadowNArmor1x1CornerInner.prototype.image = "ShadowNArmor1x1CornerInner.png";

    ShadowNArmor1x1CornerInner.prototype.size = [1, 1];

    return ShadowNArmor1x1CornerInner;
  })(ShadowArmor);

  parts.ShadowNArmor2x1Curved = (function (superClass) {
    extend(ShadowNArmor2x1Curved, superClass);

    function ShadowNArmor2x1Curved() {
      return ShadowNArmor2x1Curved.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor2x1Curved.prototype.hp = 16;

    ShadowNArmor2x1Curved.prototype.mass = 10;

    ShadowNArmor2x1Curved.prototype.cost = 2;

    ShadowNArmor2x1Curved.prototype.image = "ShadowNArmor2x1Curved.png";

    ShadowNArmor2x1Curved.prototype.size = [2, 1];

    return ShadowNArmor2x1Curved;
  })(ShadowArmor);

  parts.ShadowNArmor1x2Curved = (function (superClass) {
    extend(ShadowNArmor1x2Curved, superClass);

    function ShadowNArmor1x2Curved() {
      return ShadowNArmor1x2Curved.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor1x2Curved.prototype.hp = 16;

    ShadowNArmor1x2Curved.prototype.mass = 10;

    ShadowNArmor1x2Curved.prototype.cost = 2;

    ShadowNArmor1x2Curved.prototype.image = "ShadowNArmor1x2Curved.png";

    ShadowNArmor1x2Curved.prototype.size = [1, 2];

    return ShadowNArmor1x2Curved;
  })(ShadowArmor);

  parts.ShadowNArmor1x2Font1 = (function (superClass) {
    extend(ShadowNArmor1x2Font1, superClass);

    function ShadowNArmor1x2Font1() {
      return ShadowNArmor1x2Font1.__super__.constructor.apply(this, arguments);
    }

    ShadowNArmor1x2Font1.prototype.hp = 24;

    ShadowNArmor1x2Font1.prototype.mass = 15;

    ShadowNArmor1x2Font1.prototype.cost = 3;

    ShadowNArmor1x2Font1.prototype.image = "ShadowNArmor1x2Font1.png";

    ShadowNArmor1x2Font1.prototype.size = [2, 1];

    return ShadowNArmor1x2Font1;
  })(ShadowArmor);

  UArmor = (function (superClass) {
    extend(UArmor, superClass);

    function UArmor() {
      return UArmor.__super__.constructor.apply(this, arguments);
    }

    UArmor.prototype.name = "Ultralight Armor";

    UArmor.prototype.desc = "Minimizes weight and size, great for fighters, but is more expensive than other armors.";

    UArmor.prototype.tab = "armor3";

    UArmor.prototype.paintable = true;

    return UArmor;
  })(Part);

  parts.UArmor1x1 = (function (superClass) {
    extend(UArmor1x1, superClass);

    function UArmor1x1() {
      return UArmor1x1.__super__.constructor.apply(this, arguments);
    }

    UArmor1x1.prototype.hp = 18;

    UArmor1x1.prototype.cost = 10;

    UArmor1x1.prototype.image = "UArmor1x1.png";

    UArmor1x1.prototype.size = [1, 1];

    UArmor1x1.prototype.mass = 1;

    return UArmor1x1;
  })(UArmor);

  parts.UArmor1x2 = (function (superClass) {
    extend(UArmor1x2, superClass);

    function UArmor1x2() {
      return UArmor1x2.__super__.constructor.apply(this, arguments);
    }

    UArmor1x2.prototype.hp = 36;

    UArmor1x2.prototype.cost = 20;

    UArmor1x2.prototype.image = "UArmor1x2.png";

    UArmor1x2.prototype.size = [1, 2];

    UArmor1x2.prototype.mass = 2;

    return UArmor1x2;
  })(UArmor);

  parts.UArmor2x1 = (function (superClass) {
    extend(UArmor2x1, superClass);

    function UArmor2x1() {
      return UArmor2x1.__super__.constructor.apply(this, arguments);
    }

    UArmor2x1.prototype.name = "Ultralight Armor";

    UArmor2x1.prototype.hp = 36;

    UArmor2x1.prototype.cost = 20;

    UArmor2x1.prototype.image = "UArmor2x1.png";

    UArmor2x1.prototype.size = [2, 1];

    UArmor2x1.prototype.mass = 2;

    return UArmor2x1;
  })(UArmor);

  parts.UArmor1x1Angle = (function (superClass) {
    extend(UArmor1x1Angle, superClass);

    function UArmor1x1Angle() {
      return UArmor1x1Angle.__super__.constructor.apply(this, arguments);
    }

    UArmor1x1Angle.prototype.name = "Ultralight Armor";

    UArmor1x1Angle.prototype.hp = 9;

    UArmor1x1Angle.prototype.cost = 5;

    UArmor1x1Angle.prototype.image = "UArmor1x1Angle.png";

    UArmor1x1Angle.prototype.size = [1, 1];

    UArmor1x1Angle.prototype.mass = 0.5;

    return UArmor1x1Angle;
  })(UArmor);

  parts.UArmor1x1AngleBack = (function (superClass) {
    extend(UArmor1x1AngleBack, superClass);

    function UArmor1x1AngleBack() {
      return UArmor1x1AngleBack.__super__.constructor.apply(this, arguments);
    }

    UArmor1x1AngleBack.prototype.hp = 9;

    UArmor1x1AngleBack.prototype.cost = 5;

    UArmor1x1AngleBack.prototype.image = "UArmor1x1AngleBack.png";

    UArmor1x1AngleBack.prototype.size = [1, 1];

    UArmor1x1AngleBack.prototype.mass = 0.5;

    return UArmor1x1AngleBack;
  })(UArmor);

  parts.UArmor2x2 = (function (superClass) {
    extend(UArmor2x2, superClass);

    function UArmor2x2() {
      return UArmor2x2.__super__.constructor.apply(this, arguments);
    }

    UArmor2x2.prototype.hp = 72;

    UArmor2x2.prototype.cost = 40;

    UArmor2x2.prototype.image = "UArmor2x2.png";

    UArmor2x2.prototype.size = [2, 2];

    UArmor2x2.prototype.mass = 4;

    return UArmor2x2;
  })(UArmor);

  parts.UArmor1x2Notch1 = (function (superClass) {
    extend(UArmor1x2Notch1, superClass);

    function UArmor1x2Notch1() {
      return UArmor1x2Notch1.__super__.constructor.apply(this, arguments);
    }

    UArmor1x2Notch1.prototype.hp = 36;

    UArmor1x2Notch1.prototype.cost = 20;

    UArmor1x2Notch1.prototype.image = "UArmor1x2Notch1.png";

    UArmor1x2Notch1.prototype.size = [1, 2];

    UArmor1x2Notch1.prototype.mass = 2;

    UArmor1x2Notch1.prototype.dlc = "Curves and Shadows";

    return UArmor1x2Notch1;
  })(UArmor);

  parts.UArmor1x2Notch2 = (function (superClass) {
    extend(UArmor1x2Notch2, superClass);

    function UArmor1x2Notch2() {
      return UArmor1x2Notch2.__super__.constructor.apply(this, arguments);
    }

    UArmor1x2Notch2.prototype.hp = 36;

    UArmor1x2Notch2.prototype.cost = 20;

    UArmor1x2Notch2.prototype.image = "UArmor1x2Notch2.png";

    UArmor1x2Notch2.prototype.size = [1, 2];

    UArmor1x2Notch2.prototype.mass = 2;

    UArmor1x2Notch2.prototype.dlc = "Curves and Shadows";

    return UArmor1x2Notch2;
  })(UArmor);

  parts.UArmor1x1Notch1 = (function (superClass) {
    extend(UArmor1x1Notch1, superClass);

    function UArmor1x1Notch1() {
      return UArmor1x1Notch1.__super__.constructor.apply(this, arguments);
    }

    UArmor1x1Notch1.prototype.hp = 18;

    UArmor1x1Notch1.prototype.cost = 10;

    UArmor1x1Notch1.prototype.image = "UArmor1x1Notch1.png";

    UArmor1x1Notch1.prototype.size = [1, 1];

    UArmor1x1Notch1.prototype.mass = 1;

    UArmor1x1Notch1.prototype.dlc = "Curves and Shadows";

    return UArmor1x1Notch1;
  })(UArmor);

  parts.UArmor1x1Notch2 = (function (superClass) {
    extend(UArmor1x1Notch2, superClass);

    function UArmor1x1Notch2() {
      return UArmor1x1Notch2.__super__.constructor.apply(this, arguments);
    }

    UArmor1x1Notch2.prototype.hp = 18;

    UArmor1x1Notch2.prototype.cost = 10;

    UArmor1x1Notch2.prototype.image = "UArmor1x1Notch2.png";

    UArmor1x1Notch2.prototype.size = [1, 1];

    UArmor1x1Notch2.prototype.mass = 1;

    UArmor1x1Notch2.prototype.dlc = "Curves and Shadows";

    return UArmor1x1Notch2;
  })(UArmor);

  parts.UArmor1x1Spike = (function (superClass) {
    extend(UArmor1x1Spike, superClass);

    function UArmor1x1Spike() {
      return UArmor1x1Spike.__super__.constructor.apply(this, arguments);
    }

    UArmor1x1Spike.prototype.hp = 9;

    UArmor1x1Spike.prototype.cost = 5;

    UArmor1x1Spike.prototype.image = "UArmor1x1Spike.png";

    UArmor1x1Spike.prototype.size = [1, 1];

    UArmor1x1Spike.prototype.mass = 0.5;

    UArmor1x1Spike.prototype.dlc = "Curves and Shadows";

    return UArmor1x1Spike;
  })(UArmor);

  VArmor = (function (superClass) {
    extend(VArmor, superClass);

    function VArmor() {
      return VArmor.__super__.constructor.apply(this, arguments);
    }

    VArmor.prototype.name = "Volumetric Armor";

    VArmor.prototype.desc = "Balanced in cost and weight, but takes up more space than other armours.";

    VArmor.prototype.tab = "armor2";

    VArmor.prototype.canShowDamage = true;

    VArmor.prototype.paintable = true;

    return VArmor;
  })(Part);

  parts.VArmor1x2SideBar = (function (superClass) {
    extend(VArmor1x2SideBar, superClass);

    function VArmor1x2SideBar() {
      return VArmor1x2SideBar.__super__.constructor.apply(this, arguments);
    }

    VArmor1x2SideBar.prototype.hp = 10;

    VArmor1x2SideBar.prototype.cost = 2;

    VArmor1x2SideBar.prototype.image = "VArmor1x2SideBar.png";

    VArmor1x2SideBar.prototype.size = [1, 2];

    VArmor1x2SideBar.prototype.mass = 3;

    return VArmor1x2SideBar;
  })(VArmor);

  parts.VArmor1x2SideBarFilled = (function (superClass) {
    extend(VArmor1x2SideBarFilled, superClass);

    function VArmor1x2SideBarFilled() {
      return VArmor1x2SideBarFilled.__super__.constructor.apply(this, arguments);
    }

    VArmor1x2SideBarFilled.prototype.hp = 10;

    VArmor1x2SideBarFilled.prototype.cost = 2;

    VArmor1x2SideBarFilled.prototype.image = "VArmor1x2SideBarFilled.png";

    VArmor1x2SideBarFilled.prototype.size = [1, 2];

    VArmor1x2SideBarFilled.prototype.mass = 3;

    return VArmor1x2SideBarFilled;
  })(VArmor);

  parts.VArmor1x2IBeam = (function (superClass) {
    extend(VArmor1x2IBeam, superClass);

    function VArmor1x2IBeam() {
      return VArmor1x2IBeam.__super__.constructor.apply(this, arguments);
    }

    VArmor1x2IBeam.prototype.hp = 10;

    VArmor1x2IBeam.prototype.cost = 2;

    VArmor1x2IBeam.prototype.image = "VArmor1x2IBeam.png";

    VArmor1x2IBeam.prototype.size = [1, 2];

    VArmor1x2IBeam.prototype.mass = 3;

    return VArmor1x2IBeam;
  })(VArmor);

  parts.VArmor1x2Corner4 = (function (superClass) {
    extend(VArmor1x2Corner4, superClass);

    function VArmor1x2Corner4() {
      return VArmor1x2Corner4.__super__.constructor.apply(this, arguments);
    }

    VArmor1x2Corner4.prototype.hp = 10;

    VArmor1x2Corner4.prototype.cost = 2;

    VArmor1x2Corner4.prototype.image = "VArmor1x2Corner4.png";

    VArmor1x2Corner4.prototype.size = [1, 2];

    VArmor1x2Corner4.prototype.mass = 3;

    return VArmor1x2Corner4;
  })(VArmor);

  parts.VArmor1x2End = (function (superClass) {
    extend(VArmor1x2End, superClass);

    function VArmor1x2End() {
      return VArmor1x2End.__super__.constructor.apply(this, arguments);
    }

    VArmor1x2End.prototype.hp = 10;

    VArmor1x2End.prototype.cost = 2;

    VArmor1x2End.prototype.image = "VArmor1x2End.png";

    VArmor1x2End.prototype.size = [1, 2];

    VArmor1x2End.prototype.mass = 3;

    return VArmor1x2End;
  })(VArmor);

  parts.VArmor1x1Corner1 = (function (superClass) {
    extend(VArmor1x1Corner1, superClass);

    function VArmor1x1Corner1() {
      return VArmor1x1Corner1.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1Corner1.prototype.hp = 5;

    VArmor1x1Corner1.prototype.cost = 1;

    VArmor1x1Corner1.prototype.image = "VArmor1x1Corner1.png";

    VArmor1x1Corner1.prototype.size = [1, 1];

    VArmor1x1Corner1.prototype.mass = 1.5;

    return VArmor1x1Corner1;
  })(VArmor);

  parts.VArmor1x1Corner2 = (function (superClass) {
    extend(VArmor1x1Corner2, superClass);

    function VArmor1x1Corner2() {
      return VArmor1x1Corner2.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1Corner2.prototype.hp = 5;

    VArmor1x1Corner2.prototype.cost = 1;

    VArmor1x1Corner2.prototype.image = "VArmor1x1Corner2.png";

    VArmor1x1Corner2.prototype.size = [1, 1];

    VArmor1x1Corner2.prototype.mass = 1.5;

    return VArmor1x1Corner2;
  })(VArmor);

  parts.VArmor1x1Corner3 = (function (superClass) {
    extend(VArmor1x1Corner3, superClass);

    function VArmor1x1Corner3() {
      return VArmor1x1Corner3.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1Corner3.prototype.hp = 10;

    VArmor1x1Corner3.prototype.cost = 2;

    VArmor1x1Corner3.prototype.image = "VArmor1x1Corner3.png";

    VArmor1x1Corner3.prototype.size = [1, 2];

    VArmor1x1Corner3.prototype.mass = 3;

    return VArmor1x1Corner3;
  })(VArmor);

  parts.VArmor1x1Hook = (function (superClass) {
    extend(VArmor1x1Hook, superClass);

    function VArmor1x1Hook() {
      return VArmor1x1Hook.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1Hook.prototype.hp = 10;

    VArmor1x1Hook.prototype.cost = 2;

    VArmor1x1Hook.prototype.image = "VArmor1x1Hook.png";

    VArmor1x1Hook.prototype.size = [1, 2];

    VArmor1x1Hook.prototype.mass = 3;

    return VArmor1x1Hook;
  })(VArmor);

  parts.VArmor1x1CornerBack = (function (superClass) {
    extend(VArmor1x1CornerBack, superClass);

    function VArmor1x1CornerBack() {
      return VArmor1x1CornerBack.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1CornerBack.prototype.hp = 10;

    VArmor1x1CornerBack.prototype.cost = 2;

    VArmor1x1CornerBack.prototype.image = "VArmor1x1CornerBack.png";

    VArmor1x1CornerBack.prototype.size = [1, 2];

    VArmor1x1CornerBack.prototype.mass = 3;

    return VArmor1x1CornerBack;
  })(VArmor);

  parts.VArmor2x2 = (function (superClass) {
    extend(VArmor2x2, superClass);

    function VArmor2x2() {
      return VArmor2x2.__super__.constructor.apply(this, arguments);
    }

    VArmor2x2.prototype.hp = 20;

    VArmor2x2.prototype.cost = 4;

    VArmor2x2.prototype.image = "VArmor2x2.png";

    VArmor2x2.prototype.size = [2, 2];

    VArmor2x2.prototype.mass = 6;

    return VArmor2x2;
  })(VArmor);

  parts.VArmor1x2 = (function (superClass) {
    extend(VArmor1x2, superClass);

    function VArmor1x2() {
      return VArmor1x2.__super__.constructor.apply(this, arguments);
    }

    VArmor1x2.prototype.hp = 10;

    VArmor1x2.prototype.cost = 2;

    VArmor1x2.prototype.image = "VArmor1x2.png";

    VArmor1x2.prototype.size = [1, 2];

    VArmor1x2.prototype.mass = 3;

    return VArmor1x2;
  })(VArmor);

  parts.VArmor1x1 = (function (superClass) {
    extend(VArmor1x1, superClass);

    function VArmor1x1() {
      return VArmor1x1.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1.prototype.hp = 5;

    VArmor1x1.prototype.cost = 1;

    VArmor1x1.prototype.image = "VArmor1x1.png";

    VArmor1x1.prototype.size = [1, 1];

    VArmor1x1.prototype.mass = 1.5;

    return VArmor1x1;
  })(VArmor);

  parts.VArmor1x1Angle = (function (superClass) {
    extend(VArmor1x1Angle, superClass);

    function VArmor1x1Angle() {
      return VArmor1x1Angle.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1Angle.prototype.hp = 5;

    VArmor1x1Angle.prototype.cost = 1;

    VArmor1x1Angle.prototype.image = "VArmor1x1Angle.png";

    VArmor1x1Angle.prototype.size = [1, 1];

    VArmor1x1Angle.prototype.mass = 1.5;

    return VArmor1x1Angle;
  })(VArmor);

  parts.VArmor2x2Angle = (function (superClass) {
    extend(VArmor2x2Angle, superClass);

    function VArmor2x2Angle() {
      return VArmor2x2Angle.__super__.constructor.apply(this, arguments);
    }

    VArmor2x2Angle.prototype.hp = 20;

    VArmor2x2Angle.prototype.cost = 4;

    VArmor2x2Angle.prototype.image = "VArmor2x2Angle.png";

    VArmor2x2Angle.prototype.size = [2, 2];

    VArmor2x2Angle.prototype.mass = 6;

    return VArmor2x2Angle;
  })(VArmor);

  parts.VArmor2x2Curve = (function (superClass) {
    extend(VArmor2x2Curve, superClass);

    function VArmor2x2Curve() {
      return VArmor2x2Curve.__super__.constructor.apply(this, arguments);
    }

    VArmor2x2Curve.prototype.hp = 20;

    VArmor2x2Curve.prototype.cost = 4;

    VArmor2x2Curve.prototype.image = "VArmor2x2Curve.png";

    VArmor2x2Curve.prototype.size = [2, 2];

    VArmor2x2Curve.prototype.mass = 6;

    VArmor2x2Curve.prototype.dlc = "Curves and Shadows";

    return VArmor2x2Curve;
  })(VArmor);

  parts.VArmor1x1Curve = (function (superClass) {
    extend(VArmor1x1Curve, superClass);

    function VArmor1x1Curve() {
      return VArmor1x1Curve.__super__.constructor.apply(this, arguments);
    }

    VArmor1x1Curve.prototype.hp = 5;

    VArmor1x1Curve.prototype.cost = 1;

    VArmor1x1Curve.prototype.image = "VArmor1x1Curve.png";

    VArmor1x1Curve.prototype.size = [1, 1];

    VArmor1x1Curve.prototype.mass = 1.5;

    VArmor1x1Curve.prototype.dlc = "Curves and Shadows";

    return VArmor1x1Curve;
  })(VArmor);

  parts.VArmor2x1Curved = (function (superClass) {
    extend(VArmor2x1Curved, superClass);

    function VArmor2x1Curved() {
      return VArmor2x1Curved.__super__.constructor.apply(this, arguments);
    }

    VArmor2x1Curved.prototype.hp = 10;

    VArmor2x1Curved.prototype.cost = 2;

    VArmor2x1Curved.prototype.image = "VArmor2x1Curved.png";

    VArmor2x1Curved.prototype.size = [2, 1];

    VArmor2x1Curved.prototype.mass = 3;

    VArmor2x1Curved.prototype.dlc = "Curves and Shadows";

    return VArmor2x1Curved;
  })(VArmor);

  parts.VArmor1x2Curved = (function (superClass) {
    extend(VArmor1x2Curved, superClass);

    function VArmor1x2Curved() {
      return VArmor1x2Curved.__super__.constructor.apply(this, arguments);
    }

    VArmor1x2Curved.prototype.hp = 10;

    VArmor1x2Curved.prototype.cost = 2;

    VArmor1x2Curved.prototype.image = "VArmor1x2Curved.png";

    VArmor1x2Curved.prototype.size = [1, 2];

    VArmor1x2Curved.prototype.mass = 3;

    VArmor1x2Curved.prototype.dlc = "Curves and Shadows";

    return VArmor1x2Curved;
  })(VArmor);

  parts.VArmor2x2Curved = (function (superClass) {
    extend(VArmor2x2Curved, superClass);

    function VArmor2x2Curved() {
      return VArmor2x2Curved.__super__.constructor.apply(this, arguments);
    }

    VArmor2x2Curved.prototype.hp = 20;

    VArmor2x2Curved.prototype.cost = 4;

    VArmor2x2Curved.prototype.image = "VArmor2x2Curved.png";

    VArmor2x2Curved.prototype.size = [2, 2];

    VArmor2x2Curved.prototype.mass = 6;

    VArmor2x2Curved.prototype.dlc = "Curves and Shadows";

    return VArmor2x2Curved;
  })(VArmor);

  VShadowArmor = (function (superClass) {
    extend(VShadowArmor, superClass);

    function VShadowArmor() {
      return VShadowArmor.__super__.constructor.apply(this, arguments);
    }

    VShadowArmor.prototype.name = "Volumetric Shadow Armor";

    VShadowArmor.prototype.dlc = "Curves and Shadows";

    VShadowArmor.prototype.northWest = true;

    VShadowArmor.prototype.canShowDamage = false;

    return VShadowArmor;
  })(VArmor);

  parts.VShadowNArmor2x2Angle = (function (superClass) {
    extend(VShadowNArmor2x2Angle, superClass);

    function VShadowNArmor2x2Angle() {
      return VShadowNArmor2x2Angle.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor2x2Angle.prototype.hp = 20;

    VShadowNArmor2x2Angle.prototype.mass = 6;

    VShadowNArmor2x2Angle.prototype.cost = 4;

    VShadowNArmor2x2Angle.prototype.image = "VShadowNArmor2x2Angle.png";

    VShadowNArmor2x2Angle.prototype.size = [2, 2];

    return VShadowNArmor2x2Angle;
  })(VShadowArmor);

  parts.VShadowNArmor2x2 = (function (superClass) {
    extend(VShadowNArmor2x2, superClass);

    function VShadowNArmor2x2() {
      return VShadowNArmor2x2.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor2x2.prototype.hp = 20;

    VShadowNArmor2x2.prototype.mass = 6;

    VShadowNArmor2x2.prototype.cost = 4;

    VShadowNArmor2x2.prototype.image = "VShadowNArmor2x2.png";

    VShadowNArmor2x2.prototype.size = [2, 2];

    return VShadowNArmor2x2;
  })(VShadowArmor);

  parts.VShadowNArmor2x1 = (function (superClass) {
    extend(VShadowNArmor2x1, superClass);

    function VShadowNArmor2x1() {
      return VShadowNArmor2x1.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor2x1.prototype.hp = 10;

    VShadowNArmor2x1.prototype.mass = 3;

    VShadowNArmor2x1.prototype.cost = 2;

    VShadowNArmor2x1.prototype.image = "VShadowNArmor2x1.png";

    VShadowNArmor2x1.prototype.size = [2, 1];

    return VShadowNArmor2x1;
  })(VShadowArmor);

  parts.VShadowNArmor1x1 = (function (superClass) {
    extend(VShadowNArmor1x1, superClass);

    function VShadowNArmor1x1() {
      return VShadowNArmor1x1.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor1x1.prototype.hp = 5;

    VShadowNArmor1x1.prototype.mass = 1.5;

    VShadowNArmor1x1.prototype.cost = 1;

    VShadowNArmor1x1.prototype.image = "VShadowNArmor1x1.png";

    VShadowNArmor1x1.prototype.size = [1, 1];

    return VShadowNArmor1x1;
  })(VShadowArmor);

  parts.VShadowNArmor1x2 = (function (superClass) {
    extend(VShadowNArmor1x2, superClass);

    function VShadowNArmor1x2() {
      return VShadowNArmor1x2.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor1x2.prototype.hp = 10;

    VShadowNArmor1x2.prototype.mass = 3;

    VShadowNArmor1x2.prototype.cost = 2;

    VShadowNArmor1x2.prototype.image = "VShadowNArmor1x2.png";

    VShadowNArmor1x2.prototype.size = [1, 2];

    return VShadowNArmor1x2;
  })(VShadowArmor);

  parts.VShadowNArmor2x2Curve = (function (superClass) {
    extend(VShadowNArmor2x2Curve, superClass);

    function VShadowNArmor2x2Curve() {
      return VShadowNArmor2x2Curve.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor2x2Curve.prototype.hp = 20;

    VShadowNArmor2x2Curve.prototype.mass = 6;

    VShadowNArmor2x2Curve.prototype.cost = 4;

    VShadowNArmor2x2Curve.prototype.image = "VShadowNArmor2x2Curve.png";

    VShadowNArmor2x2Curve.prototype.size = [2, 2];

    return VShadowNArmor2x2Curve;
  })(VShadowArmor);

  parts.VShadowNArmor1x1Angle = (function (superClass) {
    extend(VShadowNArmor1x1Angle, superClass);

    function VShadowNArmor1x1Angle() {
      return VShadowNArmor1x1Angle.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor1x1Angle.prototype.hp = 5;

    VShadowNArmor1x1Angle.prototype.mass = 1.5;

    VShadowNArmor1x1Angle.prototype.cost = 1;

    VShadowNArmor1x1Angle.prototype.image = "VShadowNArmor1x1Angle.png";

    VShadowNArmor1x1Angle.prototype.size = [1, 1];

    return VShadowNArmor1x1Angle;
  })(VShadowArmor);

  parts.VShadowNArmor1x1Corner = (function (superClass) {
    extend(VShadowNArmor1x1Corner, superClass);

    function VShadowNArmor1x1Corner() {
      return VShadowNArmor1x1Corner.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor1x1Corner.prototype.hp = 5;

    VShadowNArmor1x1Corner.prototype.mass = 1.5;

    VShadowNArmor1x1Corner.prototype.cost = 1;

    VShadowNArmor1x1Corner.prototype.image = "VShadowNArmor1x1Corner.png";

    VShadowNArmor1x1Corner.prototype.size = [1, 1];

    return VShadowNArmor1x1Corner;
  })(VShadowArmor);

  parts.VShadowNArmor1x1CornerInner = (function (superClass) {
    extend(VShadowNArmor1x1CornerInner, superClass);

    function VShadowNArmor1x1CornerInner() {
      return VShadowNArmor1x1CornerInner.__super__.constructor.apply(this, arguments);
    }

    VShadowNArmor1x1CornerInner.prototype.hp = 5;

    VShadowNArmor1x1CornerInner.prototype.mass = 1.5;

    VShadowNArmor1x1CornerInner.prototype.cost = 1;

    VShadowNArmor1x1CornerInner.prototype.image = "VShadowNArmor1x1CornerInner.png";

    VShadowNArmor1x1CornerInner.prototype.size = [1, 1];

    return VShadowNArmor1x1CornerInner;
  })(VShadowArmor);

  parts.Reactor2x2 = (function (superClass) {
    extend(Reactor2x2, superClass);

    function Reactor2x2() {
      return Reactor2x2.__super__.constructor.apply(this, arguments);
    }

    Reactor2x2.prototype.name = "2x2 Reactor";

    Reactor2x2.prototype.desc = "Use this to power your ship. Reactors are heavy and expensive.";

    Reactor2x2.prototype.hp = 60;

    Reactor2x2.prototype.cost = 100;

    Reactor2x2.prototype.mass = 100;

    Reactor2x2.prototype.genEnergy = 62.5;

    Reactor2x2.prototype.storeEnergy = 8000;

    Reactor2x2.prototype.image = "Reactor2x2.png";

    Reactor2x2.prototype.attach = true;

    Reactor2x2.prototype.size = [2, 2];

    Reactor2x2.prototype.tab = "energy";

    return Reactor2x2;
  })(Part);

  parts.Reactor1x2 = (function (superClass) {
    extend(Reactor1x2, superClass);

    function Reactor1x2() {
      return Reactor1x2.__super__.constructor.apply(this, arguments);
    }

    Reactor1x2.prototype.name = "1x2 Reactor";

    Reactor1x2.prototype.hp = 30;

    Reactor1x2.prototype.cost = 50;

    Reactor1x2.prototype.mass = 50;

    Reactor1x2.prototype.genEnergy = 15.5;

    Reactor1x2.prototype.storeEnergy = 20000;

    Reactor1x2.prototype.image = "Reactor1x2.png";

    Reactor1x2.prototype.size = [1, 2];

    return Reactor1x2;
  })(parts.Reactor2x2);

  parts.Reactor2x1 = (function (superClass) {
    extend(Reactor2x1, superClass);

    function Reactor2x1() {
      return Reactor2x1.__super__.constructor.apply(this, arguments);
    }

    Reactor2x1.prototype.name = "2x1 Reactor";

    Reactor2x1.prototype.hp = 30;

    Reactor2x1.prototype.cost = 50;

    Reactor2x1.prototype.mass = 50;

    Reactor2x1.prototype.genEnergy = 15.5;

    Reactor2x1.prototype.storeEnergy = 20000;

    Reactor2x1.prototype.image = "Reactor2x1.png";

    Reactor2x1.prototype.size = [2, 1];

    return Reactor2x1;
  })(parts.Reactor2x2);

  parts.Reactor1x1 = (function (superClass) {
    extend(Reactor1x1, superClass);

    function Reactor1x1() {
      return Reactor1x1.__super__.constructor.apply(this, arguments);
    }

    Reactor1x1.prototype.name = "1x1 Reactor";

    Reactor1x1.prototype.hp = 15;

    Reactor1x1.prototype.cost = 25;

    Reactor1x1.prototype.mass = 10;

    Reactor1x1.prototype.genEnergy = 10;

    Reactor1x1.prototype.storeEnergy = 2000;

    Reactor1x1.prototype.image = "Reactor1x1.png";

    Reactor1x1.prototype.size = [1, 1];

    return Reactor1x1;
  })(parts.Reactor2x2);

  parts.Solar1x1 = (function (superClass) {
    extend(Solar1x1, superClass);

    function Solar1x1() {
      return Solar1x1.__super__.constructor.apply(this, arguments);
    }

    Solar1x1.prototype.name = "1x1 Solar Panel";

    Solar1x1.prototype.desc = "Use this to power your ship. Solar panels are light but don't generate much energy.";

    Solar1x1.prototype.hp = 0;

    Solar1x1.prototype.cost = 4;

    Solar1x1.prototype.mass = 2.5;

    Solar1x1.prototype.genEnergy = 3;

    Solar1x1.prototype.storeEnergy = 0;

    Solar1x1.prototype.flip = false;

    Solar1x1.prototype.image = "solar1x1.png";

    Solar1x1.prototype.size = [1, 1];

    return Solar1x1;
  })(parts.Reactor2x2);

  parts.Solar2x2 = (function (superClass) {
    extend(Solar2x2, superClass);

    function Solar2x2() {
      return Solar2x2.__super__.constructor.apply(this, arguments);
    }

    Solar2x2.prototype.name = "2x2 Solar Panel";

    Solar2x2.prototype.hp = 0;

    Solar2x2.prototype.cost = 16;

    Solar2x2.prototype.mass = 10;

    Solar2x2.prototype.genEnergy = 12;

    Solar2x2.prototype.storeEnergy = 0;

    Solar2x2.prototype.flip = false;

    Solar2x2.prototype.image = "solar2x2.png";

    Solar2x2.prototype.size = [2, 2];

    return Solar2x2;
  })(parts.Solar1x1);

  parts.Solar3x3 = (function (superClass) {
    extend(Solar3x3, superClass);

    function Solar3x3() {
      return Solar3x3.__super__.constructor.apply(this, arguments);
    }

    Solar3x3.prototype.name = "3x3 Solar Panel";

    Solar3x3.prototype.hp = 0;

    Solar3x3.prototype.cost = 36;

    Solar3x3.prototype.mass = 22.5;

    Solar3x3.prototype.genEnergy = 3 * 9;

    Solar3x3.prototype.storeEnergy = 0;

    Solar3x3.prototype.flip = false;

    Solar3x3.prototype.image = "solar3x3.png";

    Solar3x3.prototype.size = [3, 3];

    return Solar3x3;
  })(parts.Solar1x1);

  parts.EnergyTransfer = (function (superClass) {
    extend(EnergyTransfer, superClass);

    function EnergyTransfer() {
      return EnergyTransfer.__super__.constructor.apply(this, arguments);
    }

    EnergyTransfer.prototype.name = "Energy Transfer";

    EnergyTransfer.prototype.desc = "Gives energy to units in 800m range. Gives 960e per ship.";

    EnergyTransfer.prototype.hp = 10;

    EnergyTransfer.prototype.cost = 30;

    EnergyTransfer.prototype.mass = 30;

    EnergyTransfer.prototype.image = "EnergyTransfer.png";

    EnergyTransfer.prototype.attach = true;

    EnergyTransfer.prototype.size = [2, 2];

    EnergyTransfer.prototype.tab = "energy";

    EnergyTransfer.prototype.range = 800;

    EnergyTransfer.prototype.trasferEnergy = 60;

    EnergyTransfer.prototype.init = function () {
      return (this.unit.energyCaster = true);
    };

    EnergyTransfer.prototype.tick = function () {
      var amount, distance, giveTo, i, j, len, len1, ref, ref1, results, thing;
      if ((sim.step + this.unit.id) % 16 === 0 && this.unit.energy > 100) {
        this.working = false;
        giveTo = [];
        ref = this.unit.closestFriends();
        for (i = 0, len = ref.length; i < len; i++) {
          thing = ref[i];
          if (thing.energy < thing.storeEnergy && thing.energy > -1) {
            if (thing.energyCaster && thing.energy / thing.storeEnergy > this.unit.energy / this.unit.storeEnergy) {
              continue;
            }
            distance = v2.distance(this.unit.pos, thing.pos);
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
          if (amount > this.trasferEnergy * 16) {
            amount = this.trasferEnergy * 16;
          }
          if (amount > this.unit.energy) {
            amount = this.unit.energy;
          }
          thing.energy += amount;
          this.unit.energy -= amount;
          results.push((this.working = true));
        }
        return results;
      }
    };

    EnergyTransfer.prototype.draw = function () {
      var r;
      EnergyTransfer.__super__.draw.call(this);
      if (this.working) {
        r = (this.range + 40) / 255;
        return baseAtlas.drawSprite("img/point02.png", this.unit.pos, [r, r], 0, [255, 255, 255, 10]);
      }
    };

    return EnergyTransfer;
  })(Part);

  parts.StasisField = (function (superClass) {
    extend(StasisField, superClass);

    function StasisField() {
      return StasisField.__super__.constructor.apply(this, arguments);
    }

    StasisField.prototype.name = "Stasis Field";

    StasisField.prototype.desc = "Slows and decloaks enemy ships. Drains 2% user's cloak/second.";

    StasisField.prototype.hp = 30;

    StasisField.prototype.cost = 25;

    StasisField.prototype.mass = 6;

    StasisField.prototype.image = "StasisField.png";

    StasisField.prototype.attach = true;

    StasisField.prototype.size = [2, 2];

    StasisField.prototype.tab = "defence";

    StasisField.prototype.range = 290;

    StasisField.prototype.maxSlow = 2.5;

    StasisField.prototype.slow = 2.5;

    StasisField.prototype.working = false;

    StasisField.prototype.tick = function () {
      var distance, i, len, other, ref, results, speed;
      this.working = false;
      this.stasisPos = [this.worldPos[0] + Math.sin(this.unit.rot) * 100, this.worldPos[1] - Math.cos(this.unit.rot) * 100];
      if (this.unit.cloak > 0) {
        this.unit.cloak = this.unit.cloak * 0.99875;
      }
      ref = this.unit.closestEnemies();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        other = ref[i];
        if (other.slowed === true) {
          continue;
        }
        distance = v2.distance(this.stasisPos, other.pos);
        if (distance < other.radius + this.range) {
          other.jump -= 30;
          if (other.jump < 0) {
            other.jump = 0;
          }
          other.cloak -= 20;
          if (other.cloak < 0) {
            other.cloak = 0;
          }
          this.unit.cloak = 0;
          speed = v2.mag(other.vel);
          if (speed > this.maxSlow) {
            v2.scale(other.vel, 0.85);
          }
          this.working = true;
          results.push((other.slowed = true));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    StasisField.prototype.draw = function () {
      var a, r;
      StasisField.__super__.draw.call(this);
      if (this.working) {
        a = 100;
      } else {
        a = 25;
      }
      r = (this.range + 40) / 255;
      return baseAtlas.drawSprite("img/point02.png", [this.worldPos[0] + Math.sin(this.unit.rot) * 100, this.worldPos[1] - Math.cos(this.unit.rot) * 100], [r, r], 0, [0, 0, 0, a]);
    };

    return StasisField;
  })(Part);

  parts.SupercapitalBridge = (function (superClass) {
    extend(SupercapitalBridge, superClass);

    function SupercapitalBridge() {
      return SupercapitalBridge.__super__.constructor.apply(this, arguments);
    }

    SupercapitalBridge.prototype.name = "Supercapital Bridge";

    SupercapitalBridge.prototype.desc = "Extends a ships cost limit by $500.";

    SupercapitalBridge.prototype.hp = 100;

    SupercapitalBridge.prototype.cost = 100;

    SupercapitalBridge.prototype.mass = 500;

    SupercapitalBridge.prototype.image = "pad4x4.png";

    SupercapitalBridge.prototype.attach = true;

    SupercapitalBridge.prototype.size = [4, 4];

    SupercapitalBridge.prototype.tab = "defence";

    SupercapitalBridge.prototype.limitBonus = 500;

    SupercapitalBridge.prototype.hide = true;

    SupercapitalBridge.prototype.disable = true;

    return SupercapitalBridge;
  })(Part);

  parts.ShieldGen2x2 = (function (superClass) {
    extend(ShieldGen2x2, superClass);

    function ShieldGen2x2() {
      return ShieldGen2x2.__super__.constructor.apply(this, arguments);
    }

    ShieldGen2x2.prototype.name = "Heavy Shield Generator";

    ShieldGen2x2.prototype.desc = "A powerful shield generator that guzzles energy.";

    ShieldGen2x2.prototype.hp = 0;

    ShieldGen2x2.prototype.cost = 50;

    ShieldGen2x2.prototype.mass = 40;

    ShieldGen2x2.prototype.genShield = 1;

    ShieldGen2x2.prototype.useEnergy = 110;

    ShieldGen2x2.prototype.energyLine = 0.5;

    ShieldGen2x2.prototype.shield = 25;

    ShieldGen2x2.prototype.image = "Shield2x2.png";

    ShieldGen2x2.prototype.attach = true;

    ShieldGen2x2.prototype.size = [2, 2];

    ShieldGen2x2.prototype.tab = "defence";

    ShieldGen2x2.prototype.tick = function () {
      if (this.unit.energy > this.useEnergy && this.unit.energy > this.unit.storeEnergy * this.energyLine) {
        this.unit.energy -= this.useEnergy * Math.max(0, Math.min(1, (this.unit.maxShield - this.unit.shield) / this.genShield));
        return (this.unit.shield += this.genShield);
      }
    };

    return ShieldGen2x2;
  })(Part);

  parts.ShieldGen2x1 = (function (superClass) {
    extend(ShieldGen2x1, superClass);

    function ShieldGen2x1() {
      return ShieldGen2x1.__super__.constructor.apply(this, arguments);
    }

    ShieldGen2x1.prototype.name = "Advanced Shield Generator";

    ShieldGen2x1.prototype.desc = "An efficient, light-weight shield generator.";

    ShieldGen2x1.prototype.hp = 0;

    ShieldGen2x1.prototype.cost = 30;

    ShieldGen2x1.prototype.mass = 1;

    ShieldGen2x1.prototype.genShield = 0.1;

    ShieldGen2x1.prototype.useEnergy = 9;

    ShieldGen2x1.prototype.energyLine = 0.4;

    ShieldGen2x1.prototype.shield = 20;

    ShieldGen2x1.prototype.image = "Shield2x1.png";

    ShieldGen2x1.prototype.size = [2, 1];

    return ShieldGen2x1;
  })(parts.ShieldGen2x2);

  parts.ShieldGen1x1 = (function (superClass) {
    extend(ShieldGen1x1, superClass);

    function ShieldGen1x1() {
      return ShieldGen1x1.__super__.constructor.apply(this, arguments);
    }

    ShieldGen1x1.prototype.name = "Shield Capacitor";

    ShieldGen1x1.prototype.desc = "Allows stronger shields with limited regeneration assistance.";

    ShieldGen1x1.prototype.hp = 5;

    ShieldGen1x1.prototype.cost = 10;

    ShieldGen1x1.prototype.mass = 5.5;

    ShieldGen1x1.prototype.genShield = 0.04;

    ShieldGen1x1.prototype.useEnergy = 0.5;

    ShieldGen1x1.prototype.energyLine = 0.99;

    ShieldGen1x1.prototype.shield = 9;

    ShieldGen1x1.prototype.image = "Shield1x1.png";

    ShieldGen1x1.prototype.size = [1, 1];

    return ShieldGen1x1;
  })(parts.ShieldGen2x2);

  parts.CloakGenerator = (function (superClass) {
    extend(CloakGenerator, superClass);

    function CloakGenerator() {
      return CloakGenerator.__super__.constructor.apply(this, arguments);
    }

    CloakGenerator.prototype.name = "Cloak Generator";

    CloakGenerator.prototype.desc = "Cloaks 167T/second while stationary. Keeps 420T cloaked while moving.";

    CloakGenerator.prototype.cost = 25;

    CloakGenerator.prototype.mass = 60;

    CloakGenerator.prototype.hp = 5;

    CloakGenerator.prototype.image = "CloakGenerator.png";

    CloakGenerator.prototype.tab = "defence";

    CloakGenerator.prototype.attach = true;

    CloakGenerator.prototype.size = [2, 2];

    CloakGenerator.prototype.genCloak = 84 / 16;

    CloakGenerator.prototype.useEnergy = 380 / 16;

    CloakGenerator.prototype.tick = function () {
      if (this.unit.energy > this.useEnergy && this.unit.cloak < this.unit.mass) {
        if (this.unit.cloak > this.unit.mass / 2) {
          this.unit.energy -= this.useEnergy;
        }
        this.unit.cloak += this.genCloak;
        if (this.unit.cloak > this.unit.mass) {
          return (this.unit.cloak = this.unit.mass);
        }
      }
    };

    return CloakGenerator;
  })(Part);

  Battery = (function (superClass) {
    extend(Battery, superClass);

    function Battery() {
      return Battery.__super__.constructor.apply(this, arguments);
    }

    Battery.prototype.name = "Battery";

    Battery.prototype.desc = "Batteries store energy and come with a full charge to power your ship.";

    Battery.prototype.tab = "energy";

    Battery.prototype.paintable = true;

    return Battery;
  })(Part);

  parts.Battery1x2 = (function (superClass) {
    extend(Battery1x2, superClass);

    function Battery1x2() {
      return Battery1x2.__super__.constructor.apply(this, arguments);
    }

    Battery1x2.prototype.hp = 10;

    Battery1x2.prototype.cost = 20;

    Battery1x2.prototype.mass = 20;

    Battery1x2.prototype.storeEnergy = 16000;

    Battery1x2.prototype.image = "Battery1x2.png";

    Battery1x2.prototype.attach = true;

    Battery1x2.prototype.size = [1, 2];

    return Battery1x2;
  })(Battery);

  parts.Battery1x1 = (function (superClass) {
    extend(Battery1x1, superClass);

    function Battery1x1() {
      return Battery1x1.__super__.constructor.apply(this, arguments);
    }

    Battery1x1.prototype.name = "Battery";

    Battery1x1.prototype.hp = 5;

    Battery1x1.prototype.cost = 10;

    Battery1x1.prototype.mass = 10;

    Battery1x1.prototype.storeEnergy = 8000;

    Battery1x1.prototype.image = "Battery1x1.png";

    Battery1x1.prototype.size = [1, 1];

    return Battery1x1;
  })(Battery);

  parts.Battery2x1 = (function (superClass) {
    extend(Battery2x1, superClass);

    function Battery2x1() {
      return Battery2x1.__super__.constructor.apply(this, arguments);
    }

    Battery2x1.prototype.name = "Battery";

    Battery2x1.prototype.hp = 10;

    Battery2x1.prototype.cost = 20;

    Battery2x1.prototype.mass = 20;

    Battery2x1.prototype.storeEnergy = 16000;

    Battery2x1.prototype.image = "Battery2x1.png";

    Battery2x1.prototype.size = [2, 1];

    return Battery2x1;
  })(Battery);

  parts.Battery2x2 = (function (superClass) {
    extend(Battery2x2, superClass);

    function Battery2x2() {
      return Battery2x2.__super__.constructor.apply(this, arguments);
    }

    Battery2x2.prototype.name = "Battery";

    Battery2x2.prototype.hp = 20;

    Battery2x2.prototype.cost = 40;

    Battery2x2.prototype.mass = 40;

    Battery2x2.prototype.storeEnergy = 32000;

    Battery2x2.prototype.image = "Battery2x2.png";

    Battery2x2.prototype.size = [2, 2];

    return Battery2x2;
  })(Battery);

  parts.Engine05 = (function (superClass) {
    extend(Engine05, superClass);

    function Engine05() {
      return Engine05.__super__.constructor.apply(this, arguments);
    }

    Engine05.prototype.name = "Battleship Thruster";

    Engine05.prototype.desc = "An ultra-heavy thruster to provide a minimum speed for the heaviest ships.";

    Engine05.prototype.trailTime = 6;

    Engine05.prototype.trailSize = 0.4;

    Engine05.prototype.hp = 0;

    Engine05.prototype.cost = 80;

    Engine05.prototype.mass = 700;

    Engine05.prototype.thrust = 1000;

    Engine05.prototype.turnSpeed = 1;

    Engine05.prototype.image = "engine05.png";

    Engine05.prototype.size = [2, 2];

    Engine05.prototype.useEnergy = 30;

    Engine05.prototype.exhaust = true;

    Engine05.prototype.attach = true;

    Engine05.prototype.disable = true;

    Engine05.prototype.stripe = true;

    Engine05.prototype.tab = "engines";

    return Engine05;
  })(Engine);

  parts.Engine09 = (function (superClass) {
    extend(Engine09, superClass);

    function Engine09() {
      return Engine09.__super__.constructor.apply(this, arguments);
    }

    Engine09.prototype.name = "Large Bulk Thruster";

    Engine09.prototype.desc = "Low energy thruster for high mass. Rated for 0-150 m/s ";

    Engine09.prototype.trailTime = 6;

    Engine09.prototype.trailSize = 0.2;

    Engine09.prototype.hp = 0;

    Engine09.prototype.cost = 47;

    Engine09.prototype.mass = 135;

    Engine09.prototype.thrust = 271;

    Engine09.prototype.turnSpeed = 1;

    Engine09.prototype.image = "engine09.png";

    Engine09.prototype.size = [2, 2];

    Engine09.prototype.useEnergy = 4;

    Engine09.prototype.exhaust = true;

    Engine09.prototype.attach = true;

    Engine09.prototype.stripe = true;

    Engine09.prototype.tab = "engines";

    return Engine09;
  })(Engine);

  parts.Engine02 = (function (superClass) {
    extend(Engine02, superClass);

    function Engine02() {
      return Engine02.__super__.constructor.apply(this, arguments);
    }

    Engine02.prototype.name = "Bulk Thruster";

    Engine02.prototype.desc = "Low energy thruster for high mass. Rated for 0-125 m/s ";

    Engine02.prototype.trailTime = 6;

    Engine02.prototype.trailSize = 0.2;

    Engine02.prototype.hp = 0;

    Engine02.prototype.cost = 35;

    Engine02.prototype.mass = 100;

    Engine02.prototype.thrust = 200;

    Engine02.prototype.turnSpeed = 1;

    Engine02.prototype.image = "engine02.png";

    Engine02.prototype.size = [1, 3];

    Engine02.prototype.useEnergy = 3;

    Engine02.prototype.exhaust = true;

    Engine02.prototype.attach = true;

    Engine02.prototype.stripe = true;

    Engine02.prototype.tab = "engines";

    return Engine02;
  })(Engine);

  parts.Engine01 = (function (superClass) {
    extend(Engine01, superClass);

    function Engine01() {
      return Engine01.__super__.constructor.apply(this, arguments);
    }

    Engine01.prototype.name = "Cruiser Thruster";

    Engine01.prototype.desc = "Efficient thruster for medium ships. Rated for 100-350 m/s";

    Engine01.prototype.trailTime = 6;

    Engine01.prototype.trailSize = 0.26;

    Engine01.prototype.hp = 0;

    Engine01.prototype.cost = 65;

    Engine01.prototype.mass = 60;

    Engine01.prototype.thrust = 270;

    Engine01.prototype.turnSpeed = 4;

    Engine01.prototype.image = "engine01.png";

    Engine01.prototype.size = [1, 3];

    Engine01.prototype.useEnergy = 13;

    Engine01.prototype.exhaust = true;

    Engine01.prototype.attach = true;

    Engine01.prototype.stripe = true;

    Engine01.prototype.tab = "engines";

    return Engine01;
  })(Engine);

  parts.Engine08 = (function (superClass) {
    extend(Engine08, superClass);

    function Engine08() {
      return Engine08.__super__.constructor.apply(this, arguments);
    }

    Engine08.prototype.name = "Compact Cruiser Thruster";

    Engine08.prototype.desc = "Efficient thruster for medium ships. Rated for 100-350 m/s";

    Engine08.prototype.trailTime = 6;

    Engine08.prototype.trailSize = 0.26;

    Engine08.prototype.hp = 0;

    Engine08.prototype.cost = 44;

    Engine08.prototype.mass = 40;

    Engine08.prototype.thrust = 180;

    Engine08.prototype.turnSpeed = 4;

    Engine08.prototype.image = "engine08.png";

    Engine08.prototype.size = [2, 1];

    Engine08.prototype.useEnergy = 9;

    Engine08.prototype.exhaust = true;

    Engine08.prototype.attach = true;

    Engine08.prototype.stripe = true;

    Engine08.prototype.tab = "engines";

    return Engine08;
  })(Engine);

  parts.Engine04 = (function (superClass) {
    extend(Engine04, superClass);

    function Engine04() {
      return Engine04.__super__.constructor.apply(this, arguments);
    }

    Engine04.prototype.name = "Scout Thruster";

    Engine04.prototype.desc = "The smallest thruster available. Rated for 100-400 m/s";

    Engine04.prototype.trailTime = 64;

    Engine04.prototype.trailSize = 0.1;

    Engine04.prototype.hp = 0;

    Engine04.prototype.cost = 20;

    Engine04.prototype.mass = 15;

    Engine04.prototype.thrust = 90;

    Engine04.prototype.turnSpeed = 1;

    Engine04.prototype.image = "engine04.png";

    Engine04.prototype.size = [1, 2];

    Engine04.prototype.useEnergy = 10;

    Engine04.prototype.exhaust = true;

    Engine04.prototype.attach = true;

    Engine04.prototype.stripe = true;

    Engine04.prototype.tab = "engines";

    return Engine04;
  })(Engine);

  parts.Engine043Long = (function (superClass) {
    extend(Engine043Long, superClass);

    function Engine043Long() {
      return Engine043Long.__super__.constructor.apply(this, arguments);
    }

    Engine043Long.prototype.size = [2, 1];

    Engine043Long.prototype.image = "engine04long.png";

    return Engine043Long;
  })(parts.Engine04);

  parts.Engine06 = (function (superClass) {
    extend(Engine06, superClass);

    function Engine06() {
      return Engine06.__super__.constructor.apply(this, arguments);
    }

    Engine06.prototype.hp = 0;

    Engine06.prototype.cost = 55;

    Engine06.prototype.mass = 60;

    Engine06.prototype.thrust = 157;

    Engine06.prototype.turnSpeed = 3;

    Engine06.prototype.image = "engine06.png";

    Engine06.prototype.size = [2, 2];

    Engine06.prototype.useEnergy = 25;

    Engine06.prototype.exhaust = true;

    Engine06.prototype.attach = true;

    Engine06.prototype.hide = true;

    Engine06.prototype.disable = true;

    Engine06.prototype.stripe = true;

    Engine06.prototype.tab = "engines";

    return Engine06;
  })(Engine);

  parts.Engine03 = (function (superClass) {
    extend(Engine03, superClass);

    function Engine03() {
      return Engine03.__super__.constructor.apply(this, arguments);
    }

    Engine03.prototype.name = "Fighter Thruster";

    Engine03.prototype.desc = "A light thruster good for fast ships. Rated for 250+ m/s";

    Engine03.prototype.trailTime = 64;

    Engine03.prototype.trailSize = 0.13;

    Engine03.prototype.hp = 0;

    Engine03.prototype.cost = 45;

    Engine03.prototype.mass = 15;

    Engine03.prototype.thrust = 135;

    Engine03.prototype.turnSpeed = 1;

    Engine03.prototype.image = "engine03.png";

    Engine03.prototype.size = [1, 2];

    Engine03.prototype.useEnergy = 12;

    Engine03.prototype.exhaust = true;

    Engine03.prototype.attach = true;

    Engine03.prototype.stripe = true;

    Engine03.prototype.tab = "engines";

    return Engine03;
  })(Engine);

  parts.Engine03Long = (function (superClass) {
    extend(Engine03Long, superClass);

    function Engine03Long() {
      return Engine03Long.__super__.constructor.apply(this, arguments);
    }

    Engine03Long.prototype.size = [2, 1];

    Engine03Long.prototype.image = "engine03long.png";

    return Engine03Long;
  })(parts.Engine03);

  parts.Engine07 = (function (superClass) {
    extend(Engine07, superClass);

    function Engine07() {
      return Engine07.__super__.constructor.apply(this, arguments);
    }

    Engine07.prototype.name = "Interceptor Afterburner";

    Engine07.prototype.desc = "A huge inefficient thruster. Burns a lot of energy to make ships move very fast. ";

    Engine07.prototype.trailTime = 64;

    Engine07.prototype.hp = 0;

    Engine07.prototype.cost = 145;

    Engine07.prototype.mass = 80;

    Engine07.prototype.thrust = 900;

    Engine07.prototype.turnSpeed = 4;

    Engine07.prototype.image = "engine07.png";

    Engine07.prototype.size = [2, 2];

    Engine07.prototype.trailSize = 0.22;

    Engine07.prototype.useEnergy = 169;

    Engine07.prototype.exhaust = true;

    Engine07.prototype.attach = true;

    Engine07.prototype.stripe = true;

    Engine07.prototype.tab = "engines";

    return Engine07;
  })(Engine);

  parts.JumpEngine = (function (superClass) {
    extend(JumpEngine, superClass);

    function JumpEngine() {
      return JumpEngine.__super__.constructor.apply(this, arguments);
    }

    JumpEngine.prototype.name = "Jump Engine";

    JumpEngine.prototype.desc = "Allows you to perform short jumps. Drains some energy and 2% cloak per second.";

    JumpEngine.prototype.trailTime = 0;

    JumpEngine.prototype.hp = 50;

    JumpEngine.prototype.cost = 50;

    JumpEngine.prototype.mass = 15;

    JumpEngine.prototype.jumpCount = 3;

    JumpEngine.prototype.rechargeRate = 775;

    JumpEngine.prototype.thrust = 0;

    JumpEngine.prototype.turnSpeed = 0;

    JumpEngine.prototype.useEnergy = 10;

    JumpEngine.prototype.exhaust = false;

    JumpEngine.prototype.image = "engineJump.png";

    JumpEngine.prototype.size = [2, 1];

    JumpEngine.prototype.trailSize = 0;

    JumpEngine.prototype.attach = true;

    JumpEngine.prototype.stripe = true;

    JumpEngine.prototype.tab = "engines";

    JumpEngine.prototype.tick = function () {
      if (this.unit.energy >= this.useEnergy) {
        this.unit.energy -= this.useEnergy;
        if (this.unit.jump < this.unit.jumpDistance) {
          this.unit.jump = Math.min(this.unit.jump + this.rechargeRate / this.unit.mass, this.unit.jumpDistance);
        }
        if (this.unit.cloak > 0) {
          this.unit.cloak = this.unit.cloak * 0.99875;
        }
      }
      return (this.working = this.unit.jump >= this.unit.minJump);
    };

    JumpEngine.prototype.draw = function () {
      JumpEngine.__super__.draw.call(this);
      if (this.working) {
        return baseAtlas.drawSprite("parts/engineJumpPip.png", this.worldPos, [1, 1], this.unit.rot);
      }
    };

    return JumpEngine;
  })(Engine);

  Wing = (function (superClass) {
    extend(Wing, superClass);

    function Wing() {
      return Wing.__super__.constructor.apply(this, arguments);
    }

    Wing.prototype.name = "Wing";

    Wing.prototype.desc = "Adds turn rate to your units, more wings make ships turn faster.";

    Wing.prototype.tab = "engines";

    Wing.prototype.stripe = true;

    Wing.prototype.attach = false;

    Wing.prototype.canShowDamage = true;

    return Wing;
  })(Part);

  parts.Wing2x2 = (function (superClass) {
    extend(Wing2x2, superClass);

    function Wing2x2() {
      return Wing2x2.__super__.constructor.apply(this, arguments);
    }

    Wing2x2.prototype.hp = 16;

    Wing2x2.prototype.cost = 32;

    Wing2x2.prototype.mass = 8;

    Wing2x2.prototype.turnSpeed = 30;

    Wing2x2.prototype.image = "Wing2x2.png";

    Wing2x2.prototype.size = [2, 2];

    return Wing2x2;
  })(Wing);

  parts.Wing1x2 = (function (superClass) {
    extend(Wing1x2, superClass);

    function Wing1x2() {
      return Wing1x2.__super__.constructor.apply(this, arguments);
    }

    Wing1x2.prototype.hp = 8;

    Wing1x2.prototype.cost = 16;

    Wing1x2.prototype.mass = 4;

    Wing1x2.prototype.turnSpeed = 15;

    Wing1x2.prototype.image = "Wing1x2.png";

    Wing1x2.prototype.size = [1, 2];

    return Wing1x2;
  })(Wing);

  parts.Wing2x1 = (function (superClass) {
    extend(Wing2x1, superClass);

    function Wing2x1() {
      return Wing2x1.__super__.constructor.apply(this, arguments);
    }

    Wing2x1.prototype.hp = 6;

    Wing2x1.prototype.cost = 12;

    Wing2x1.prototype.mass = 3;

    Wing2x1.prototype.turnSpeed = 11.25;

    Wing2x1.prototype.image = "Wing2x1.png";

    Wing2x1.prototype.size = [2, 1];

    return Wing2x1;
  })(Wing);

  parts.Wing1x1Angle = (function (superClass) {
    extend(Wing1x1Angle, superClass);

    function Wing1x1Angle() {
      return Wing1x1Angle.__super__.constructor.apply(this, arguments);
    }

    Wing1x1Angle.prototype.hp = 4;

    Wing1x1Angle.prototype.cost = 8;

    Wing1x1Angle.prototype.mass = 2;

    Wing1x1Angle.prototype.turnSpeed = 7.5;

    Wing1x1Angle.prototype.image = "Wing1x1Angle.png";

    Wing1x1Angle.prototype.size = [1, 1];

    return Wing1x1Angle;
  })(Wing);

  parts.Wing1x1Round = (function (superClass) {
    extend(Wing1x1Round, superClass);

    function Wing1x1Round() {
      return Wing1x1Round.__super__.constructor.apply(this, arguments);
    }

    Wing1x1Round.prototype.hp = 4;

    Wing1x1Round.prototype.cost = 8;

    Wing1x1Round.prototype.mass = 2;

    Wing1x1Round.prototype.turnSpeed = 7.5;

    Wing1x1Round.prototype.image = "Wing1x1Round.png";

    Wing1x1Round.prototype.size = [1, 1];

    return Wing1x1Round;
  })(Wing);

  parts.Wing1x1Notch = (function (superClass) {
    extend(Wing1x1Notch, superClass);

    function Wing1x1Notch() {
      return Wing1x1Notch.__super__.constructor.apply(this, arguments);
    }

    Wing1x1Notch.prototype.hp = 0;

    Wing1x1Notch.prototype.cost = 4;

    Wing1x1Notch.prototype.mass = 0.1;

    Wing1x1Notch.prototype.turnSpeed = 3.15;

    Wing1x1Notch.prototype.image = "Wing1x1Notch.png";

    Wing1x1Notch.prototype.size = [1, 1];

    return Wing1x1Notch;
  })(Wing);

  types.PDLaserBullet = (function (superClass) {
    extend(PDLaserBullet, superClass);

    function PDLaserBullet() {
      return PDLaserBullet.__super__.constructor.apply(this, arguments);
    }

    PDLaserBullet.prototype.image = "parts/fireBeamLarge.png";

    PDLaserBullet.prototype.sound = "sounds/weapons/lightPD.wav";

    PDLaserBullet.prototype.size = [0.3, 0.3];

    PDLaserBullet.prototype.color = [179, 207, 255, 255];

    return PDLaserBullet;
  })(LaserBullet);

  parts.PDTurret = (function (superClass) {
    extend(PDTurret, superClass);

    function PDTurret() {
      return PDTurret.__super__.constructor.apply(this, arguments);
    }

    PDTurret.prototype.name = "Point Defence";

    PDTurret.prototype.desc = "Point defence laser. Counters missiles.";

    PDTurret.prototype.hp = 10;

    PDTurret.prototype.cost = 5;

    PDTurret.prototype.image = "turHex2.png";

    PDTurret.prototype.size = [2, 2];

    PDTurret.prototype.range = 400;

    PDTurret.prototype.reloadTime = 40;

    PDTurret.prototype.trackSpeed = 25;

    PDTurret.prototype.bulletCls = types.PDLaserBullet;

    PDTurret.prototype.shotEnergy = 1100;

    PDTurret.prototype.instant = true;

    PDTurret.prototype.mass = 10;

    PDTurret.prototype.bulletSpeed = 2000;

    PDTurret.prototype.damage = 18;

    PDTurret.prototype.maxLife = 0.5;

    PDTurret.prototype.hitsMissiles = true;

    return PDTurret;
  })(Turret);

  types.HeavyPDBullet = (function (superClass) {
    extend(HeavyPDBullet, superClass);

    function HeavyPDBullet() {
      return HeavyPDBullet.__super__.constructor.apply(this, arguments);
    }

    HeavyPDBullet.prototype.image = "parts/fireHex1.png";

    HeavyPDBullet.prototype.sound = "sounds/weapons/heavyPD.wav";

    HeavyPDBullet.prototype.size = [0.7, 0.7];

    HeavyPDBullet.prototype.color = [179, 207, 255, 255];

    HeavyPDBullet.prototype.radius = 12;

    HeavyPDBullet.prototype.hitsMultiple = true;

    HeavyPDBullet.prototype.hitUnit = function (thing) {
      thing.applyDamage(this.damage);
      if (this.energyDamage) {
        thing.applyEnergyDamage(this.energyDamage);
      }
      return (this.dead = true);
    };

    return HeavyPDBullet;
  })(Bullet);

  parts.HeavyPDTurret = (function (superClass) {
    extend(HeavyPDTurret, superClass);

    function HeavyPDTurret() {
      return HeavyPDTurret.__super__.constructor.apply(this, arguments);
    }

    HeavyPDTurret.prototype.name = "Heavy Point Defence Turret";

    HeavyPDTurret.prototype.desc = "Point defence turret. Hits multiple projectiles. Counters missiles.";

    HeavyPDTurret.prototype.hp = 10;

    HeavyPDTurret.prototype.cost = 5;

    HeavyPDTurret.prototype.image = "turHex1.png";

    HeavyPDTurret.prototype.size = [2, 2];

    HeavyPDTurret.prototype.reloadTime = 52;

    HeavyPDTurret.prototype.trackSpeed = 90;

    HeavyPDTurret.prototype.bulletCls = types.HeavyPDBullet;

    HeavyPDTurret.prototype.range = 405;

    HeavyPDTurret.prototype.shotEnergy = 250 * 16;

    HeavyPDTurret.prototype.mass = 30;

    HeavyPDTurret.prototype.bulletSpeed = 55;

    HeavyPDTurret.prototype.damage = 60;

    HeavyPDTurret.prototype.hitsMissiles = true;

    return HeavyPDTurret;
  })(Turret);

  types.RingBullet = (function (superClass) {
    extend(RingBullet, superClass);

    function RingBullet() {
      return RingBullet.__super__.constructor.apply(this, arguments);
    }

    RingBullet.prototype.image = "parts/fireRing.png";

    RingBullet.prototype.sound = "sounds/weapons/zingg.wav";

    RingBullet.prototype.hitExplosion = "RingHitExplosion";

    RingBullet.prototype.size = [1, 1];

    RingBullet.prototype.color = [179, 207, 255, 255];

    return RingBullet;
  })(Bullet);

  parts.RingTurret = (function (superClass) {
    extend(RingTurret, superClass);

    function RingTurret() {
      return RingTurret.__super__.constructor.apply(this, arguments);
    }

    RingTurret.prototype.name = "Fusion Ring";

    RingTurret.prototype.desc = "Close ranged burst weapon.";

    RingTurret.prototype.hp = 10;

    RingTurret.prototype.cost = 5;

    RingTurret.prototype.image = "turRing.png";

    RingTurret.prototype.size = [2, 2];

    RingTurret.prototype.reloadTime = 80;

    RingTurret.prototype.trackSpeed = 90;

    RingTurret.prototype.bulletCls = types.RingBullet;

    RingTurret.prototype.range = 330;

    RingTurret.prototype.shotEnergy = 250 * 16;

    RingTurret.prototype.mass = 20;

    RingTurret.prototype.bulletSpeed = 35;

    RingTurret.prototype.damage = 100;

    RingTurret.prototype.spin = 0;

    RingTurret.prototype.draw = function () {
      if (this.working) {
        this.spin += 0.001 * this.damage;
        this.image = "turRing.png";
      } else {
        this.spin += 0.0001 * this.damage;
        this.image = "turRingReload.png";
      }
      return baseAtlas.drawSprite("parts/" + this.image, this.worldPos, [1, 1], this.spin);
    };

    return RingTurret;
  })(Turret);

  types.RamBullet = (function (superClass) {
    extend(RamBullet, superClass);

    function RamBullet() {
      return RamBullet.__super__.constructor.apply(this, arguments);
    }

    RamBullet.prototype.image = "parts/fireWavePull.png";

    RamBullet.prototype.sound = "sounds/weapons/WavePull.wav";

    RamBullet.prototype.size = [0.5, 0.5];

    RamBullet.prototype.color = [179, 207, 255, 255];

    RamBullet.prototype.radius = 30;

    RamBullet.prototype.direction = -1;

    RamBullet.prototype.waveEffect = 300;

    RamBullet.prototype.hitUnit = function (unit) {
      var amount, dot, p;
      unit.applyDamage(this.damage);
      p = (this.waveEffect * this.damage) / unit.mass;
      v2.norm(this.vel, _wave);
      v2.scale(_wave, -this.direction);
      dot = v2.dot(unit.vel, _wave);
      amount = 0;
      if (dot < p) {
        amount = p;
      }
      v2.scale(_wave, amount);
      v2.add(unit.vel, _wave);
      return (this.dead = true);
    };

    return RamBullet;
  })(Bullet);

  parts.RamTurret = (function (superClass) {
    extend(RamTurret, superClass);

    function RamTurret() {
      return RamTurret.__super__.constructor.apply(this, arguments);
    }

    RamTurret.prototype.name = "Kinetic Ram";

    RamTurret.prototype.desc = "Knocks a target back with speed depending on its mass.";

    RamTurret.prototype.hp = 10;

    RamTurret.prototype.cost = 5;

    RamTurret.prototype.image = "turWavePush.png";

    RamTurret.prototype.size = [2, 2];

    RamTurret.prototype.reloadTime = 96;

    RamTurret.prototype.trackSpeed = 90;

    RamTurret.prototype.bulletCls = types.RamBullet;

    RamTurret.prototype.range = 125;

    RamTurret.prototype.shotEnergy = 1200;

    RamTurret.prototype.mass = 10;

    RamTurret.prototype.bulletSpeed = 35;

    RamTurret.prototype.damage = 80;

    RamTurret.prototype.hide = true;

    RamTurret.prototype.disable = true;

    return RamTurret;
  })(Turret);

  types.TorpBullet = (function (superClass) {
    extend(TorpBullet, superClass);

    function TorpBullet() {
      return TorpBullet.__super__.constructor.apply(this, arguments);
    }

    TorpBullet.prototype.image = "parts/fireTorp1.png";

    TorpBullet.prototype.sound = "sounds/weapons/torp2.wav";

    TorpBullet.prototype.size = [1, 1];

    TorpBullet.prototype.radius = 25;

    TorpBullet.prototype.missile = true;

    TorpBullet.prototype.trailTime = 46;

    TorpBullet.prototype.trailSize = 0.06;

    return TorpBullet;
  })(StraightMissile);

  parts.TorpTurret = (function (superClass) {
    extend(TorpTurret, superClass);

    function TorpTurret() {
      return TorpTurret.__super__.constructor.apply(this, arguments);
    }

    TorpTurret.prototype.name = "Torpedo Launcher";

    TorpTurret.prototype.desc = "Launches torpedos that move in straight line.";

    TorpTurret.prototype.hp = 15;

    TorpTurret.prototype.cost = 5;

    TorpTurret.prototype.image = "turTorp.png";

    TorpTurret.prototype.size = [2, 2];

    TorpTurret.prototype.reloadTime = 52;

    TorpTurret.prototype.trackSpeed = 45;

    TorpTurret.prototype.bulletCls = types.TorpBullet;

    TorpTurret.prototype.range = 1250;

    TorpTurret.prototype.shotEnergy = 1100;

    TorpTurret.prototype.mass = 10;

    TorpTurret.prototype.bulletSpeed = 16;

    TorpTurret.prototype.damage = 24;

    return TorpTurret;
  })(Turret);

  types.MissileBullet = (function (superClass) {
    extend(MissileBullet, superClass);

    function MissileBullet() {
      return MissileBullet.__super__.constructor.apply(this, arguments);
    }

    MissileBullet.prototype.image = "parts/fireMis1.png";

    MissileBullet.prototype.sound = "sounds/weapons/torp1.wav";

    MissileBullet.prototype.size = [0.8, 0.8];

    MissileBullet.prototype.color = [0, 0, 0, 255];

    MissileBullet.prototype.missile = true;

    MissileBullet.prototype.tracking = true;

    return MissileBullet;
  })(TrackingMissile);

  parts.MissileTurret = (function (superClass) {
    extend(MissileTurret, superClass);

    function MissileTurret() {
      return MissileTurret.__super__.constructor.apply(this, arguments);
    }

    MissileTurret.prototype.name = "Missile Launcher";

    MissileTurret.prototype.desc = "Launches tracking missiles that chase targets.";

    MissileTurret.prototype.onlyInRange = true;

    MissileTurret.prototype.hp = 10;

    MissileTurret.prototype.cost = 5;

    MissileTurret.prototype.image = "turMissile.png";

    MissileTurret.prototype.size = [2, 2];

    MissileTurret.prototype.reloadTime = 31;

    MissileTurret.prototype.trackSpeed = 45;

    MissileTurret.prototype.bulletCls = types.MissileBullet;

    MissileTurret.prototype.range = 1000;

    MissileTurret.prototype.shotEnergy = 2650;

    MissileTurret.prototype.mass = 20;

    MissileTurret.prototype.bulletSpeed = 19;

    MissileTurret.prototype.damage = 27;

    MissileTurret.prototype.radius = 40;

    MissileTurret.prototype.overshoot = 0.5;

    return MissileTurret;
  })(Turret);

  types.ArtilleryExplosion = (function (superClass) {
    extend(ArtilleryExplosion, superClass);

    function ArtilleryExplosion() {
      return ArtilleryExplosion.__super__.constructor.apply(this, arguments);
    }

    ArtilleryExplosion.prototype.sound = "sounds/weapons/thud3.wav";

    ArtilleryExplosion.prototype.soundVolume = 0.2;

    ArtilleryExplosion.prototype.maxLife = 10;

    ArtilleryExplosion.prototype.draw = function () {
      var color, fade, s;
      ArtilleryExplosion.__super__.draw.call(this);
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      s = this.radius / 2;
      color = [255, 255, 255, (1 - Math.pow(fade, 2)) * 180];
      return baseAtlas.drawSprite("img/fire02.png", this.pos, [s, s], this.rot, color);
    };

    return ArtilleryExplosion;
  })(types.AoeExplosion);

  types.ArtilleryBullet = (function (superClass) {
    extend(ArtilleryBullet, superClass);

    function ArtilleryBullet() {
      return ArtilleryBullet.__super__.constructor.apply(this, arguments);
    }

    ArtilleryBullet.prototype.image = "parts/fireLong1.png";

    ArtilleryBullet.prototype.sound = [
      "sounds/weapons/artillery-1.wav",
      "sounds/weapons/artillery-2.wav",
      "sounds/weapons/artillery-3.wav",
      "sounds/weapons/artillery-4.wav",
      "sounds/weapons/artillery-5.wav",
    ];

    ArtilleryBullet.prototype.color = [255, 240, 244, 255];

    ArtilleryBullet.prototype.size = [1, 1];

    ArtilleryBullet.prototype.missile = true;

    ArtilleryBullet.prototype.explodeClass = "ArtilleryExplosion";

    ArtilleryBullet.prototype.draw = function () {
      var color, dist, size;
      ArtilleryBullet.__super__.draw.call(this);
      if (this.hitPos) {
        dist = Math.min(v2.distance(this.pos, this.hitPos), 1000);
        size = (Math.pow(1.003, -dist) * this.aoe) / 162;
        color = [255, 0, 0, 80];
        baseAtlas.drawSprite("img/point02.png", this.hitPos, [this.aoe / 256, this.aoe / 256], 0, color);
        baseAtlas.drawSprite("img/fire02.png", this.hitPos, [size * 2, size * 2], 0, color);
      }
    };

    return ArtilleryBullet;
  })(AoeBullet);

  parts.ArtilleryTurret = (function (superClass) {
    extend(ArtilleryTurret, superClass);

    function ArtilleryTurret() {
      return ArtilleryTurret.__super__.constructor.apply(this, arguments);
    }

    ArtilleryTurret.prototype.name = "Artillery Gun";

    ArtilleryTurret.prototype.desc = "Launches a slow moving shell that explodes at the targeted area.";

    ArtilleryTurret.prototype.onlyInRange = false;

    ArtilleryTurret.prototype.hp = 10;

    ArtilleryTurret.prototype.cost = 5;

    ArtilleryTurret.prototype.image = "turLong1.png";

    ArtilleryTurret.prototype.size = [2, 2];

    ArtilleryTurret.prototype.reloadTime = 89;

    ArtilleryTurret.prototype.trackSpeed = 25;

    ArtilleryTurret.prototype.bulletCls = types.ArtilleryBullet;

    ArtilleryTurret.prototype.exactRange = true;

    ArtilleryTurret.prototype.range = 1700;

    ArtilleryTurret.prototype.minRange = 675;

    ArtilleryTurret.prototype.shotEnergy = 4100;

    ArtilleryTurret.prototype.mass = 65;

    ArtilleryTurret.prototype.bulletSpeed = 9;

    ArtilleryTurret.prototype.damage = 120;

    ArtilleryTurret.prototype.aoe = 210;

    return ArtilleryTurret;
  })(Turret);

  types.SidewinderBullet = (function (superClass) {
    extend(SidewinderBullet, superClass);

    function SidewinderBullet() {
      return SidewinderBullet.__super__.constructor.apply(this, arguments);
    }

    SidewinderBullet.prototype.image = "parts/fireMine.png";

    SidewinderBullet.prototype.sound = "sounds/weapons/torp4.wav";

    SidewinderBullet.prototype.soundVolume = 0.05;

    SidewinderBullet.prototype.size = [0.8, 0.8];

    SidewinderBullet.prototype.color = [0, 0, 0, 255];

    SidewinderBullet.prototype.missile = true;

    SidewinderBullet.prototype.tracking = true;

    SidewinderBullet.prototype.turnVel = [1, 1];

    SidewinderBullet.prototype.trailTime = 32;

    SidewinderBullet.prototype.trailSize = 0.12;

    SidewinderBullet.prototype.tick = function () {
      var minDistance, minUnit;
      SidewinderBullet.__super__.tick.call(this);
      if ((sim.step + this.id) % 4 === 0) {
        if (!this.target || this.target.dead || this.target.cloaked()) {
          minDistance = 0;
          minUnit = null;
          sim.unitSpaces[otherSide(this.side)].findInRange(
            this.pos,
            500,
            (function (_this) {
              return function (unit) {
                var dist;
                dist = v2.distance(unit.pos, _this.pos);
                if (minUnit === null || dist < minDistance) {
                  if (!unit.cloaked()) {
                    minUnit = unit;
                    minDistance = dist;
                  }
                }
                return false;
              };
            })(this)
          );
          if (minUnit) {
            return (this.target = minUnit);
          }
        }
      }
    };

    SidewinderBullet.prototype.move = function () {
      if (this.dead) {
        return;
      }
      if (this.target && !this.target.dead && !this.target.cloaked()) {
        this.dist = v2.distance(this.target.pos, this.pos);
        v2.sub(this.target.pos, this.pos, this.vel);
      }
      v2.norm(this.vel);
      this.rot = v2.angle(this.vel);
      if (this.direction === 0) {
        this.turnVel[0] = -Math.cos(this.rot) * 2;
        this.turnVel[1] = -Math.sin(this.rot) * 2;
      }
      if (this.direction === 1) {
        this.turnVel[0] = Math.cos(this.rot) * 2;
        this.turnVel[1] = Math.sin(this.rot) * 2;
      }
      v2.scale(this.turnVel, Math.max(0.01, (this.maxLife - this.life * 2) / this.maxLife), this.turnVel);
      v2.scale(this.vel, Math.max(0.01, (this.life * 2) / this.maxLife), this.vel);
      v2.add(this.vel, this.turnVel);
      v2.scale(this.vel, this.speed);
      v2.add(this.pos, this.vel);
      this.rot = v2.angle(this.vel);
      return (this.life += 1);
    };

    return SidewinderBullet;
  })(TrackingMissile);

  parts.SidewinderTurret = (function (superClass) {
    extend(SidewinderTurret, superClass);

    function SidewinderTurret() {
      return SidewinderTurret.__super__.constructor.apply(this, arguments);
    }

    SidewinderTurret.prototype.name = "Sidewinder Missile";

    SidewinderTurret.prototype.desc = "Sidewinder is a slow moving tracking missile.";

    SidewinderTurret.prototype.onlyInRange = true;

    SidewinderTurret.prototype.hp = 15;

    SidewinderTurret.prototype.cost = 10;

    SidewinderTurret.prototype.image = "turMine.png";

    SidewinderTurret.prototype.size = [2, 2];

    SidewinderTurret.prototype.reloadTime = 80;

    SidewinderTurret.prototype.trackSpeed = 45;

    SidewinderTurret.prototype.bulletCls = types.SidewinderBullet;

    SidewinderTurret.prototype.range = 800;

    SidewinderTurret.prototype.shotEnergy = 1950;

    SidewinderTurret.prototype.mass = 7.5;

    SidewinderTurret.prototype.bulletSpeed = 20;

    SidewinderTurret.prototype.damage = 38;

    SidewinderTurret.prototype.radius = 40;

    SidewinderTurret.prototype.overshoot = 0.5;

    SidewinderTurret.prototype.volley = 2;

    SidewinderTurret.prototype.volleyDelay = 1;

    SidewinderTurret.prototype.spread = [1, -1];

    SidewinderTurret.prototype.ticks = SidewinderTurret.volleyDelay;

    SidewinderTurret.prototype.shots = 0;

    SidewinderTurret.prototype.tick = function () {
      SidewinderTurret.__super__.tick.call(this);
      this.ticks -= 1;
      if (this.ticks <= 0) {
        this.ticks = this.volleyDelay;
        if (this.shots > 0) {
          return this.makeRealBullet(this.shots % 2);
        }
      }
    };

    SidewinderTurret.prototype.makeRealBullet = function (direction) {
      var particle;
      this.shots -= 1;
      particle = new this.bulletCls();
      sim.things[particle.id] = particle;
      particle.side = this.unit.side;
      particle.life = 0;
      particle.dead = false;
      particle.z = this.unit.z + 0.001;
      particle.turretNum = this.turretNum;
      particle.origin = this.unit;
      particle.target = this.target;
      particle.direction = direction;
      particle.speed = this.bulletSpeed;
      particle.damage = this.damage / 2;
      particle.maxLife = (this.range / particle.speed) * 1.5;
      v2.set(this.worldPos, particle.pos);
      v2.pointTo(particle.vel, this.rot);
      v2.scale(particle.vel, particle.speed);
      return (particle.rot = this.rot);
    };

    SidewinderTurret.prototype.makeBullet = function (distance) {
      this.unit.cloak = 0;
      this.shots = this.volley;
      return (this.ticks = 0);
    };

    return SidewinderTurret;
  })(Turret);

  types.PlasmaBullet = (function (superClass) {
    extend(PlasmaBullet, superClass);

    function PlasmaBullet() {
      return PlasmaBullet.__super__.constructor.apply(this, arguments);
    }

    PlasmaBullet.prototype.image = "parts/fireShot1.png";

    PlasmaBullet.prototype.sound = "sounds/weapons/blaster2.wav";

    PlasmaBullet.prototype.size = [0.6, 0.6];

    PlasmaBullet.prototype.color = [179, 207, 255, 255];

    return PlasmaBullet;
  })(Bullet);

  parts.PlasmaTurret = (function (superClass) {
    extend(PlasmaTurret, superClass);

    function PlasmaTurret() {
      return PlasmaTurret.__super__.constructor.apply(this, arguments);
    }

    PlasmaTurret.prototype.name = "Plasma Turret";

    PlasmaTurret.prototype.desc = "Fires powerful long range projectiles.";

    PlasmaTurret.prototype.hp = 10;

    PlasmaTurret.prototype.cost = 5;

    PlasmaTurret.prototype.image = "turPlasma.png";

    PlasmaTurret.prototype.size = [2, 2];

    PlasmaTurret.prototype.reloadTime = 52;

    PlasmaTurret.prototype.trackSpeed = 25;

    PlasmaTurret.prototype.bulletCls = types.PlasmaBullet;

    PlasmaTurret.prototype.range = 820;

    PlasmaTurret.prototype.shotEnergy = 100 * 48;

    PlasmaTurret.prototype.mass = 40;

    PlasmaTurret.prototype.bulletSpeed = 20;

    PlasmaTurret.prototype.damage = 53;

    return PlasmaTurret;
  })(Turret);

  types.LightPlasmaBullet = (function (superClass) {
    extend(LightPlasmaBullet, superClass);

    function LightPlasmaBullet() {
      return LightPlasmaBullet.__super__.constructor.apply(this, arguments);
    }

    LightPlasmaBullet.prototype.image = "parts/fireShot1.png";

    LightPlasmaBullet.prototype.sound = "sounds/weapons/blaster2.wav";

    LightPlasmaBullet.prototype.size = [0.6, 0.6];

    LightPlasmaBullet.prototype.color = [179, 207, 255, 255];

    return LightPlasmaBullet;
  })(Bullet);

  parts.LightPlasmaTurret = (function (superClass) {
    extend(LightPlasmaTurret, superClass);

    function LightPlasmaTurret() {
      return LightPlasmaTurret.__super__.constructor.apply(this, arguments);
    }

    LightPlasmaTurret.prototype.hide = true;

    LightPlasmaTurret.prototype.disable = true;

    LightPlasmaTurret.prototype.name = "Light Plasma Turret";

    LightPlasmaTurret.prototype.desc = "Fires a moderate long range projectile.";

    LightPlasmaTurret.prototype.hp = 10;

    LightPlasmaTurret.prototype.cost = 5;

    LightPlasmaTurret.prototype.image = "turPlasma.png";

    LightPlasmaTurret.prototype.size = [2, 2];

    LightPlasmaTurret.prototype.reloadTime = 64;

    LightPlasmaTurret.prototype.trackSpeed = 25;

    LightPlasmaTurret.prototype.bulletCls = types.LightPlasmaBullet;

    LightPlasmaTurret.prototype.range = 950;

    LightPlasmaTurret.prototype.shotEnergy = 1700;

    LightPlasmaTurret.prototype.mass = 10;

    LightPlasmaTurret.prototype.bulletSpeed = 22;

    LightPlasmaTurret.prototype.damage = 26;

    return LightPlasmaTurret;
  })(Turret);

  types.LightBeam = (function (superClass) {
    extend(LightBeam, superClass);

    function LightBeam() {
      return LightBeam.__super__.constructor.apply(this, arguments);
    }

    LightBeam.prototype.image = "parts/fireBeamLarge.png";

    LightBeam.prototype.sound = "sounds/weapons/beam2.wav";

    LightBeam.prototype.size = [0.5, 0.5];

    LightBeam.prototype.color = [179, 207, 255, 255];

    return LightBeam;
  })(LaserBullet);

  parts.LightBeamTurret = (function (superClass) {
    extend(LightBeamTurret, superClass);

    function LightBeamTurret() {
      return LightBeamTurret.__super__.constructor.apply(this, arguments);
    }

    LightBeamTurret.prototype.name = "Light Beam";

    LightBeamTurret.prototype.desc = "Close range beam weapon.";

    LightBeamTurret.prototype.hp = 10;

    LightBeamTurret.prototype.cost = 5;

    LightBeamTurret.prototype.image = "turBeam2.png";

    LightBeamTurret.prototype.size = [2, 2];

    LightBeamTurret.prototype.reloadTime = 7;

    LightBeamTurret.prototype.trackSpeed = 25;

    LightBeamTurret.prototype.bulletCls = types.LightBeam;

    LightBeamTurret.prototype.range = 350;

    LightBeamTurret.prototype.instant = true;

    LightBeamTurret.prototype.shotEnergy = 80 * 7;

    LightBeamTurret.prototype.mass = 5;

    LightBeamTurret.prototype.bulletSpeed = 15;

    LightBeamTurret.prototype.damage = 9;

    LightBeamTurret.prototype.maxLife = 8;

    return LightBeamTurret;
  })(Turret);

  types.HeavyBeam = (function (superClass) {
    extend(HeavyBeam, superClass);

    function HeavyBeam() {
      return HeavyBeam.__super__.constructor.apply(this, arguments);
    }

    HeavyBeam.prototype.image = "parts/fireBeamLarge.png";

    HeavyBeam.prototype.sound = "sounds/weapons/beam4.wav";

    HeavyBeam.prototype.size = [1, 1];

    HeavyBeam.prototype.color = [179, 207, 255, 255];

    return HeavyBeam;
  })(LaserBullet);

  parts.HeavyBeamTurret = (function (superClass) {
    extend(HeavyBeamTurret, superClass);

    function HeavyBeamTurret() {
      return HeavyBeamTurret.__super__.constructor.apply(this, arguments);
    }

    HeavyBeamTurret.prototype.name = "Heavy Beam";

    HeavyBeamTurret.prototype.desc = "Mid range beam weapon.";

    HeavyBeamTurret.prototype.hp = 10;

    HeavyBeamTurret.prototype.cost = 5;

    HeavyBeamTurret.prototype.image = "turBeam1.png";

    HeavyBeamTurret.prototype.size = [2, 2];

    HeavyBeamTurret.prototype.reloadTime = 40;

    HeavyBeamTurret.prototype.trackSpeed = 25;

    HeavyBeamTurret.prototype.bulletCls = types.HeavyBeam;

    HeavyBeamTurret.prototype.shotEnergy = 5000;

    HeavyBeamTurret.prototype.instant = true;

    HeavyBeamTurret.prototype.range = 610;

    HeavyBeamTurret.prototype.mass = 40;

    HeavyBeamTurret.prototype.bulletSpeed = 2000;

    HeavyBeamTurret.prototype.damage = 38;

    HeavyBeamTurret.prototype.maxLife = 0.5;

    return HeavyBeamTurret;
  })(Turret);

  types.FlackExplosion = (function (superClass) {
    extend(FlackExplosion, superClass);

    function FlackExplosion() {
      return FlackExplosion.__super__.constructor.apply(this, arguments);
    }

    FlackExplosion.prototype.maxLife = 10;

    FlackExplosion.prototype.sound = null;

    FlackExplosion.prototype.draw = function () {
      var color, fade, s;
      FlackExplosion.__super__.draw.call(this);
      FlackExplosion.__super__.draw.call(this);
      if (this.dead) {
        return;
      }
      fade = this.life / this.maxLife;
      s = this.aoe / 80;
      color = [255, 255, 255, (1 - Math.pow(fade, 2)) * 180];
      return baseAtlas.drawSprite("parts/fireFlackExp1.png", this.pos, [s, s], this.rot, color);
    };

    return FlackExplosion;
  })(types.AoeExplosion);

  types.FlackBullet = (function (superClass) {
    extend(FlackBullet, superClass);

    function FlackBullet() {
      return FlackBullet.__super__.constructor.apply(this, arguments);
    }

    FlackBullet.prototype.image = "parts/fireFlack1.png";

    FlackBullet.prototype.sound = "sounds/weapons/zingg.wav";

    FlackBullet.prototype.color = [255, 240, 244, 255];

    FlackBullet.prototype.size = [1, 1];

    FlackBullet.prototype.explodeClass = "FlackExplosion";

    return FlackBullet;
  })(AoeBullet);

  parts.FlackTurret = (function (superClass) {
    extend(FlackTurret, superClass);

    function FlackTurret() {
      return FlackTurret.__super__.constructor.apply(this, arguments);
    }

    FlackTurret.prototype.name = "Heavy Flak";

    FlackTurret.prototype.desc = "Anti-fighter weapon that explodes with AoE at the targeted area.";

    FlackTurret.prototype.hp = 10;

    FlackTurret.prototype.cost = 5;

    FlackTurret.prototype.image = "turFlack.png";

    FlackTurret.prototype.size = [2, 2];

    FlackTurret.prototype.reloadTime = 16;

    FlackTurret.prototype.trackSpeed = 25;

    FlackTurret.prototype.bulletCls = types.FlackBullet;

    FlackTurret.prototype.range = 460;

    FlackTurret.prototype.mass = 30;

    FlackTurret.prototype.shotEnergy = 50 * 32;

    FlackTurret.prototype.exactRange = true;

    FlackTurret.prototype.bulletSpeed = 27;

    FlackTurret.prototype.damage = 18;

    FlackTurret.prototype.aoe = 210;

    return FlackTurret;
  })(Turret);

  types.SniperLaser = (function (superClass) {
    extend(SniperLaser, superClass);

    SniperLaser.prototype.image = "parts/hit1.png";

    SniperLaser.prototype.sound = "sounds/weapons/blaster2.wav";

    SniperLaser.prototype.size = [2, 2];

    SniperLaser.prototype.color = [179, 207, 255, 255];

    function SniperLaser() {
      SniperLaser.__super__.constructor.call(this);
      this.hitOnce = {};
    }

    SniperLaser.prototype.draw = function () {
      if (this.dead) {
        return;
      }
      return baseAtlas.drawSprite(this.image, this.pos, this.size, this.rot + intp.t, this.color);
    };

    SniperLaser.prototype.hitUnit = function (unit) {
      if (!this.hitOnce[unit.id]) {
        unit.applyDamage(this.damage);
        return (this.hitOnce[unit.id] = true);
      }
    };

    return SniperLaser;
  })(Bullet);

  parts.SniperGun = (function (superClass) {
    extend(SniperGun, superClass);

    function SniperGun() {
      return SniperGun.__super__.constructor.apply(this, arguments);
    }

    SniperGun.prototype.hide = true;

    SniperGun.prototype.disable = true;

    SniperGun.prototype.name = "Sniper Gun";

    SniperGun.prototype.desc = "Fires a sniper round with high DPS. Its only good at max range and requires massive banks. The sniper ship must not be moving, and it has 18% chance of firing in any one second.";

    SniperGun.prototype.hp = 10;

    SniperGun.prototype.cost = 5;

    SniperGun.prototype.image = "turSnipe1.png";

    SniperGun.prototype.size = [2, 2];

    SniperGun.prototype.reloadTime = 120;

    SniperGun.prototype.trackSpeed = 25;

    SniperGun.prototype.bulletCls = types.SniperLaser;

    SniperGun.prototype.shotEnergy = 100000;

    SniperGun.prototype.range = 1700;

    SniperGun.prototype.minRange = 300;

    SniperGun.prototype.mass = 80;

    SniperGun.prototype.bulletSpeed = 15;

    SniperGun.prototype.damage = 500;

    SniperGun.prototype.hitsMultiple = true;

    SniperGun.prototype.hitsCloak = true;

    SniperGun.prototype.fire = function () {
      if (this.unit.vel[0] === 0 && this.unit.vel[1] === 0 && Math.random() < 0.1) {
        return SniperGun.__super__.fire.call(this);
      }
    };

    return SniperGun;
  })(Turret);

  types.EMPOrb = (function (superClass) {
    extend(EMPOrb, superClass);

    function EMPOrb() {
      return EMPOrb.__super__.constructor.apply(this, arguments);
    }

    EMPOrb.prototype.image = "parts/fireEnergyBall.png";

    EMPOrb.prototype.sound = "sounds/weapons/blaster1.wav";

    EMPOrb.prototype.soundVolume = 0.05;

    EMPOrb.prototype.size = [1, 1];

    EMPOrb.prototype.color = [179, 207, 255, 255];

    EMPOrb.prototype.draw = function () {
      if (this.dead) {
        return;
      }
      return baseAtlas.drawSprite(this.image, this.pos, this.size, this.rot + intp.t, this.color);
    };

    return EMPOrb;
  })(Bullet);

  parts.EMPGun = (function (superClass) {
    extend(EMPGun, superClass);

    function EMPGun() {
      return EMPGun.__super__.constructor.apply(this, arguments);
    }

    EMPGun.prototype.name = "EMP Gun";

    EMPGun.prototype.desc = "Fires an EMP orb that drains energy from targets and deals low damage.";

    EMPGun.prototype.hp = 10;

    EMPGun.prototype.cost = 5;

    EMPGun.prototype.image = "turEMP.png";

    EMPGun.prototype.size = [2, 2];

    EMPGun.prototype.reloadTime = 61;

    EMPGun.prototype.trackSpeed = 25;

    EMPGun.prototype.bulletCls = types.EMPOrb;

    EMPGun.prototype.shotEnergy = 3600;

    EMPGun.prototype.range = 620;

    EMPGun.prototype.mass = 2;

    EMPGun.prototype.bulletSpeed = 36;

    EMPGun.prototype.damage = 24;

    EMPGun.prototype.energyDamage = 4200;

    return EMPGun;
  })(Turret);

  types.EMPOrb2 = (function (superClass) {
    extend(EMPOrb2, superClass);

    function EMPOrb2() {
      return EMPOrb2.__super__.constructor.apply(this, arguments);
    }

    EMPOrb2.prototype.image = "parts/fizzleMine.png";

    EMPOrb2.prototype.sound = "sounds/weapons/blaster1.wav";

    EMPOrb2.prototype.soundVolume = 0.05;

    EMPOrb2.prototype.size = [1, 1];

    EMPOrb2.prototype.color = [179, 207, 255, 255];

    EMPOrb2.prototype.split = 0;

    EMPOrb2.prototype.clientTick = function () {
      var exp, exp2;
      if (this.life > this.maxLife / 4 && this.split === 0) {
        exp = new types.Debree();
        exp.image = "parts/fizzleMinePart.png";
        exp.z = this.z + rand() * 0.01;
        exp.pos = v2.create(this.pos);
        exp.rot = this.rot;
        exp.vel[0] = Math.cos(this.rot) * 3;
        exp.vel[1] = Math.sin(this.rot) * 3;
        exp.vrot = 0;
        intp.particles[exp.id] = exp;
        exp2 = new types.Debree();
        exp2.image = "parts/fizzleMinePart.png";
        exp2.z = exp.z;
        exp2.pos = v2.create(this.pos);
        v2.set(exp.vel, exp2.vel);
        v2.scale(exp2.vel, -1);
        exp2.rot = exp.rot + Math.PI;
        exp2.vrot = 0;
        intp.particles[exp2.id] = exp2;
        return (this.split = 1);
      }
    };

    EMPOrb2.prototype.draw = function () {
      var image;
      if (this.dead) {
        return;
      }
      if (this.life > this.maxLife / 4 && this.split === 0) {
        image = "img/fire02.png";
      } else if (this.life > this.maxLife / 4) {
        image = "parts/fizzleMineEnergy.png";
      } else {
        image = this.image;
      }
      return baseAtlas.drawSprite(image, this.pos, this.size, this.rot + intp.t, this.color);
    };

    EMPOrb2.prototype.postFire = function () {
      this.maxLife += 24;
      this._slowVel = v2.create(this.vel);
      return v2.scale(this._slowVel, 0.2);
    };

    EMPOrb2.prototype.move = function () {
      if (this.dead) {
        return;
      }
      if (this.life > this.maxLife / 4) {
        return v2.add(this.pos, this.vel);
      } else {
        return v2.add(this.pos, this._slowVel);
      }
    };

    EMPOrb2.prototype.tick = function () {
      var exp;
      if (this.life < this.maxLife / 4) {
        this.life += Math.round(Math.random());
      } else {
        this.life += 1;
        this.scan();
      }
      if (this.life > this.maxLife) {
        this.dead = true;
      }
      if (this.dead) {
        exp = new types[this.hitExplosion]();
        exp.z = 1000;
        exp.pos = [this.pos[0], this.pos[1]];
        if (this.t !== null) {
          v2.add(exp.pos, v2.scale(this.vel, this.t));
        }
        exp.vel = [0, 0];
        exp.rot = 0;
        exp.radius = 1;
        return (sim.things[exp.id] = exp);
      }
    };

    return EMPOrb2;
  })(Bullet);

  parts.EMPGun2 = (function (superClass) {
    extend(EMPGun2, superClass);

    function EMPGun2() {
      return EMPGun2.__super__.constructor.apply(this, arguments);
    }

    EMPGun2.prototype.name = "Orb Launcher";

    EMPGun2.prototype.desc = "Deploys an orb that launches out after a second, at high speed.";

    EMPGun2.prototype.hp = 10;

    EMPGun2.prototype.cost = 5;

    EMPGun2.prototype.image = "turFizzleGun.png";

    EMPGun2.prototype.size = [2, 2];

    EMPGun2.prototype.reloadTime = 32;

    EMPGun2.prototype.trackSpeed = 25;

    EMPGun2.prototype.bulletCls = types.EMPOrb2;

    EMPGun2.prototype.shotEnergy = 1400;

    EMPGun2.prototype.range = 1400;

    EMPGun2.prototype.minRange = 450;

    EMPGun2.prototype.mass = 20;

    EMPGun2.prototype.bulletSpeed = 44;

    EMPGun2.prototype.damage = 8;

    EMPGun2.prototype.energyDamage = 0;

    EMPGun2.prototype.disable = false;

    return EMPGun2;
  })(Turret);

  types.BombExplosion = (function (superClass) {
    extend(BombExplosion, superClass);

    function BombExplosion() {
      return BombExplosion.__super__.constructor.apply(this, arguments);
    }

    BombExplosion.prototype.maxLife = 10;

    BombExplosion.prototype.sound = "sounds/weapons/thud3.wav";

    BombExplosion.prototype.soundVolume = 0.25;

    BombExplosion.prototype.draw = function () {
      var ex, i, n, results;
      BombExplosion.__super__.draw.call(this);
      if (this.life === 0) {
        results = [];
        for (n = i = 1; i < 15; n = ++i) {
          ex = new types.Debree();
          ex.image = "parts/fireFlame" + chooseInt(1, 4) + ".png";
          ex.z = this.z + rand() * 0.01;
          ex.pos = [0, 0];
          ex.vel = [0, 0];
          v2.set(this.pos, ex.pos);
          v2.scale(v2.random(ex.vel), Math.random() * 6);
          ex.rot = rand() * Math.PI * 2;
          ex.vrot = rand();
          ex.maxLife = 16;
          ex._pos = v2.create(ex.pos);
          ex._pos2 = v2.create(ex.pos);
          ex.rot = ex.rot;
          ex._rot = ex.rot;
          ex._rot2 = ex.rot;
          results.push((intp.particles[ex.id] = ex));
        }
        return results;
      }
    };

    return BombExplosion;
  })(types.AoeExplosion);

  types.Bomb = (function (superClass) {
    extend(Bomb, superClass);

    function Bomb() {
      return Bomb.__super__.constructor.apply(this, arguments);
    }

    Bomb.prototype.image = "parts/bombDormant.png";

    Bomb.prototype.sound = "sounds/weapons/wewewee.wav";

    Bomb.prototype.soundVolume = 0.03;

    Bomb.prototype.size = [1, 1];

    Bomb.prototype.color = [255, 255, 255, 255];

    Bomb.prototype.explodeClass = "BombExplosion";

    Bomb.prototype.trailSize = 0.1;

    Bomb.prototype.trailTime = 32;

    Bomb.prototype.postFire = function () {
      this.maxLife += 28;
      this._slowVel = v2.create(this.vel);
      return v2.scale(this._slowVel, 0);
    };

    Bomb.prototype.move = function () {
      if (this.dead) {
        return;
      }
      if (this.life > 28) {
        return v2.add(this.pos, this.vel);
      } else {
        return v2.add(this.pos, this._slowVel);
      }
    };

    Bomb.prototype.tick = function () {
      var exp;
      this.life += 1;
      if (this.life > this.maxLife) {
        this.dead = true;
        if (this.explode) {
          exp = new types.BombExplosion();
          exp.z = 1000;
          exp.pos = [this.pos[0], this.pos[1]];
          exp.vel = [0, 0];
          exp.rot = 0;
          exp.aoe = this.aoe;
          exp.side = this.side;
          exp.damage = this.damage;
          return (sim.things[exp.id] = exp);
        }
      }
    };

    Bomb.prototype.draw = function () {
      var color, dist, size;
      if (!this.trail) {
        this.trail = new Trail(this.id, this.trailSize, this.trailTime, this.color, this.z);
      }
      this.trail.grow(this.pos);
      Bomb.__super__.draw.call(this);
      this.z = 1;
      this.trail.z = 1 - 0.0001;
      if (this.life === 28) {
        this.image = "parts/bombActive.png";
        playSound("sounds/weapons/wizzzz.wav");
      }
      if (this.hitPos) {
        dist = Math.min(v2.distance(this.pos, this.hitPos), 1000);
        size = (Math.pow(1.003, -dist) * this.aoe) / 162;
        color = [255, 0, 0, 80];
        baseAtlas.drawSprite("img/point02.png", this.hitPos, [this.aoe / 256, this.aoe / 256], 0, color);
        baseAtlas.drawSprite("img/fire02.png", this.hitPos, [size * 2, size * 2], 0, color);
      }
    };

    return Bomb;
  })(AoeBullet);

  parts.BombGun = (function (superClass) {
    extend(BombGun, superClass);

    function BombGun() {
      return BombGun.__super__.constructor.apply(this, arguments);
    }

    BombGun.prototype.name = "Phase Bomb Launcher";

    BombGun.prototype.desc = "Fires a powerful mid-range but easy to dodge projectile.";

    BombGun.prototype.hp = 10;

    BombGun.prototype.cost = 5;

    BombGun.prototype.image = "turBomb.png";

    BombGun.prototype.size = [2, 2];

    BombGun.prototype.reloadTime = 57;

    BombGun.prototype.trackSpeed = 25;

    BombGun.prototype.bulletCls = types.Bomb;

    BombGun.prototype.shotEnergy = 3500;

    BombGun.prototype.range = 650;

    BombGun.prototype.mass = 22;

    BombGun.prototype.bulletSpeed = 16;

    BombGun.prototype.damage = 150;

    BombGun.prototype.onlyInRange = true;

    BombGun.prototype.exactRange = true;

    BombGun.prototype.aoe = 100;

    return BombGun;
  })(Turret);

  types.AutoBullet = (function (superClass) {
    extend(AutoBullet, superClass);

    function AutoBullet() {
      return AutoBullet.__super__.constructor.apply(this, arguments);
    }

    AutoBullet.prototype.image = "parts/fireAuto.png";

    AutoBullet.prototype.sound = "sounds/weapons/autocannon.wav";

    AutoBullet.prototype.size = [0.6, 0.6];

    AutoBullet.prototype.color = [179, 207, 255, 255];

    AutoBullet.prototype.hitExplosion = "SmallHitExplosion";

    return AutoBullet;
  })(Bullet);

  parts.AutoTurret = (function (superClass) {
    extend(AutoTurret, superClass);

    function AutoTurret() {
      return AutoTurret.__super__.constructor.apply(this, arguments);
    }

    AutoTurret.prototype.name = "Auto Cannon";

    AutoTurret.prototype.desc = "Fires five bullets in rapid bursts.";

    AutoTurret.prototype.hp = 15;

    AutoTurret.prototype.cost = 10;

    AutoTurret.prototype.image = "turAutoCannon.png";

    AutoTurret.prototype.size = [2, 2];

    AutoTurret.prototype.reloadTime = 42;

    AutoTurret.prototype.trackSpeed = 25;

    AutoTurret.prototype.bulletCls = types.AutoBullet;

    AutoTurret.prototype.range = 560;

    AutoTurret.prototype.shotEnergy = 355 * 5;

    AutoTurret.prototype.mass = 8;

    AutoTurret.prototype.bulletSpeed = 40;

    AutoTurret.prototype.damage = 8 * 5;

    AutoTurret.prototype.fired = 10;

    AutoTurret.prototype.volley = 5;

    AutoTurret.prototype.spread = [0, 0.1, -0.1, 0.2, -0.2];

    AutoTurret.prototype.tick = function () {
      AutoTurret.__super__.tick.call(this);
      if (this.fired < 10) {
        if (this.fired % 2 === 0) {
          this.rot += this.spread[this.fired / 2];
          this.makeRealBullet();
        }
        this.fired += 1;
        return (this.working = true);
      }
    };

    AutoTurret.prototype.makeBullet = function (distance) {
      this.unit.cloak = 0;
      return (this.fired = 0);
    };

    AutoTurret.prototype.makeRealBullet = function () {
      var particle;
      particle = new this.bulletCls();
      sim.things[particle.id] = particle;
      particle.side = this.unit.side;
      particle.life = 0;
      particle.dead = false;
      particle.z = this.unit.z + 0.001;
      particle.turretNum = this.turretNum;
      particle.origin = this.unit;
      particle.target = this.target;
      particle.speed = this.bulletSpeed;
      particle.damage = this.damage / 5;
      particle.maxLife = (this.range / particle.speed) * 1.5;
      v2.set(this.worldPos, particle.pos);
      v2.pointTo(particle.vel, this.rot);
      v2.scale(particle.vel, particle.speed);
      return (particle.rot = this.rot);
    };

    return AutoTurret;
  })(Turret);

  types.ShotgunBullet = (function (superClass) {
    extend(ShotgunBullet, superClass);

    function ShotgunBullet() {
      return ShotgunBullet.__super__.constructor.apply(this, arguments);
    }

    ShotgunBullet.prototype.image = "parts/fireAuto.png";

    ShotgunBullet.prototype.sound = "sounds/weapons/autocannon.wav";

    ShotgunBullet.prototype.size = [0.6, 0.6];

    ShotgunBullet.prototype.color = [179, 207, 255, 255];

    ShotgunBullet.prototype.hitExplosion = "SmallHitExplosion";

    return ShotgunBullet;
  })(Bullet);

  parts.Shotgun = (function (superClass) {
    extend(Shotgun, superClass);

    function Shotgun() {
      return Shotgun.__super__.constructor.apply(this, arguments);
    }

    Shotgun.prototype.name = "Shotgun";

    Shotgun.prototype.desc = "Fires five bullets in rapid bursts.";

    Shotgun.prototype.hp = 10;

    Shotgun.prototype.cost = 5;

    Shotgun.prototype.image = "turAutoCannon.png";

    Shotgun.prototype.size = [2, 2];

    Shotgun.prototype.reloadTime = 96;

    Shotgun.prototype.trackSpeed = 25;

    Shotgun.prototype.bulletCls = types.AutoBullet;

    Shotgun.prototype.range = 450;

    Shotgun.prototype.shotEnergy = 355 * 5;

    Shotgun.prototype.mass = 15;

    Shotgun.prototype.bulletSpeed = 30;

    Shotgun.prototype.damage = 8 * 9;

    Shotgun.prototype.fired = 9;

    Shotgun.prototype.volley = 9;

    Shotgun.prototype.spread = [0, 0.25, -0.25, 0.5, -0.5, 0.75, -0.75, 1, -1];

    Shotgun.prototype.hide = true;

    Shotgun.prototype.disable = true;

    Shotgun.prototype.tick = function () {
      Shotgun.__super__.tick.call(this);
      if (this.fired < 9) {
        if (this.fired % 1 === 0) {
          this.rot += this.spread[this.fired / 1];
          this.makeRealBullet();
        }
        this.fired += 1;
        return (this.working = true);
      }
    };

    Shotgun.prototype.makeBullet = function (distance) {
      this.unit.cloak = 0;
      return (this.fired = 0);
    };

    Shotgun.prototype.makeRealBullet = function () {
      var particle;
      particle = new this.bulletCls();
      sim.things[particle.id] = particle;
      particle.side = this.unit.side;
      particle.life = 0;
      particle.dead = false;
      particle.z = this.unit.z + 0.001;
      particle.turretNum = this.turretNum;
      particle.origin = this.unit;
      particle.target = this.target;
      particle.speed = this.bulletSpeed;
      particle.damage = this.damage / 5;
      particle.maxLife = (this.range / particle.speed) * 1.5;
      v2.set(this.worldPos, particle.pos);
      v2.pointTo(particle.vel, this.rot);
      v2.scale(particle.vel, particle.speed);
      return (particle.rot = this.rot);
    };

    return Shotgun;
  })(Turret);

  types.MachineBullet = (function (superClass) {
    extend(MachineBullet, superClass);

    function MachineBullet() {
      return MachineBullet.__super__.constructor.apply(this, arguments);
    }

    MachineBullet.prototype.image = "parts/fireBeamSmall.png";

    MachineBullet.prototype.sound = "sounds/weapons/autocannon.wav";

    MachineBullet.prototype.size = [0.6, 0.6];

    MachineBullet.prototype.color = [179, 207, 255, 255];

    MachineBullet.prototype.hitExplosion = "SmallHitExplosion";

    return MachineBullet;
  })(Bullet);

  parts.MachineGun = (function (superClass) {
    extend(MachineGun, superClass);

    function MachineGun() {
      return MachineGun.__super__.constructor.apply(this, arguments);
    }

    MachineGun.prototype.name = "Machine Gun";

    MachineGun.prototype.desc = "Fires fast bullets.";

    MachineGun.prototype.hp = 10;

    MachineGun.prototype.cost = 5;

    MachineGun.prototype.image = "turAutoCannon.png";

    MachineGun.prototype.size = [2, 2];

    MachineGun.prototype.reloadTime = 5;

    MachineGun.prototype.trackSpeed = 25;

    MachineGun.prototype.bulletCls = types.MachineBullet;

    MachineGun.prototype.range = 780;

    MachineGun.prototype.shotEnergy = 200;

    MachineGun.prototype.mass = 10;

    MachineGun.prototype.bulletSpeed = 100;

    MachineGun.prototype.damage = 4;

    MachineGun.prototype.hide = true;

    MachineGun.prototype.disable = true;

    MachineGun.prototype.makeBullet = function (distance) {
      this.rot += (Math.random() - 0.5) * 0.3;
      return MachineGun.__super__.makeBullet.call(this);
    };

    return MachineGun;
  })(Turret);

  types.TeslaBolt = (function (superClass) {
    extend(TeslaBolt, superClass);

    function TeslaBolt() {
      return TeslaBolt.__super__.constructor.apply(this, arguments);
    }

    TeslaBolt.prototype.image = "parts/zap1.png";

    TeslaBolt.prototype.sound = "sounds/weapons/tesla2.wav";

    TeslaBolt.prototype.size = [0.6, 0.6];

    TeslaBolt.prototype.color = [179, 207, 255, 255];

    TeslaBolt.prototype.drawLength = 250;

    return TeslaBolt;
  })(LaserBullet);

  parts.TeslaTurret = (function (superClass) {
    extend(TeslaTurret, superClass);

    function TeslaTurret() {
      return TeslaTurret.__super__.constructor.apply(this, arguments);
    }

    TeslaTurret.prototype.name = "Tesla Turret";

    TeslaTurret.prototype.desc = "Fires lighting bolts that arc between units.";

    TeslaTurret.prototype.hp = 10;

    TeslaTurret.prototype.cost = 5;

    TeslaTurret.prototype.image = "turTesla.png";

    TeslaTurret.prototype.size = [2, 2];

    TeslaTurret.prototype.reloadTime = 10;

    TeslaTurret.prototype.trackSpeed = 25;

    TeslaTurret.prototype.bulletCls = types.TeslaBolt;

    TeslaTurret.prototype.range = 540;

    TeslaTurret.prototype.bounceRange = 400;

    TeslaTurret.prototype.shotEnergy = 1375;

    TeslaTurret.prototype.mass = 40;

    TeslaTurret.prototype.damage = 11;

    TeslaTurret.prototype.instant = true;

    TeslaTurret.prototype.bulletSpeed = 2000;

    TeslaTurret.prototype.maxLife = 1;

    TeslaTurret.prototype.makeBullet = function (distance) {
      var i, id, len, ref, results, unit;
      this.unit.cloak = 0;
      this.zapped = [];
      this.zap(this.worldPos, this.target);
      ref = this.zapped;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        id = ref[i];
        unit = sim.things[id];
        results.push(unit.applyDamage(this.damage / this.zapped.length));
      }
      return results;
    };

    TeslaTurret.prototype.zap = function (from, unit) {
      var closestUnit, minD, particle, range;
      this.zapped.push(unit.id);
      particle = new this.bulletCls();
      particle.image = "parts/zap" + Math.floor(Math.random() * 4 + 1) + ".png";
      sim.things[particle.id] = particle;
      particle.side = this.unit.side;
      particle.life = 0;
      particle.dead = false;
      particle.z = this.unit.z + 0.001;
      if (this.zapped.length === 1) {
        particle.turretNum = this.turretNum;
        particle.origin = this.unit;
        unit.applyEnergyDamage(this.energyDamage);
      } else {
        particle.sound = null;
      }
      particle.target = unit;
      v2.set(from, particle.pos);
      particle.targetPos = v2.create(particle.target.pos);
      if (this.zapped.length === 10) {
        return;
      }
      range = this.bounceRange;
      minD = range;
      closestUnit = null;
      sim.unitSpaces[otherSide(this.unit.side)].findInRange(
        unit.pos,
        range + 500,
        (function (_this) {
          return function (other) {
            var d, ref;
            if (other.cloakFade === 0 && ((ref = other.id), indexOf.call(_this.zapped, ref) < 0)) {
              d = v2.distance(unit.pos, other.pos) - other.radius;
              if (d < 0) {
                d = 0;
              }
              if (d < minD) {
                minD = d;
                closestUnit = other;
              }
            }
            return false;
          };
        })(this)
      );
      if (closestUnit) {
        return this.zap(unit.pos, closestUnit);
      }
    };

    return TeslaTurret;
  })(Turret);

  _wave = v2.create();

  _a = v2.create();

  _b = v2.create();

  types.WavePullArch = (function (superClass) {
    extend(WavePullArch, superClass);

    WavePullArch.prototype.image = "parts/fireWavePull.png";

    WavePullArch.prototype.sound = "sounds/weapons/WavePull.wav";

    WavePullArch.prototype.size = [0.5, 0.5];

    WavePullArch.prototype.color = [179, 207, 255, 255];

    WavePullArch.prototype.radius = 30;

    WavePullArch.prototype.maxRadius = 100;

    WavePullArch.prototype.direction = 1;

    WavePullArch.prototype.waveEffect = 0.55;

    WavePullArch.prototype.hitsMultiple = true;

    WavePullArch.prototype.hitsCloak = true;

    function WavePullArch() {
      this.size = v2.create([0.5, 0.5]);
      this.hitOnce = {};
      WavePullArch.__super__.constructor.call(this);
    }

    WavePullArch.prototype.draw = function () {
      this.color[3] = 128 * (1 - this.radius / this.maxRadius);
      this.size[0] = this.radius / 100;
      this.size[1] = this.radius / 100;
      return WavePullArch.__super__.draw.call(this);
    };

    WavePullArch.prototype.tick = function () {
      WavePullArch.__super__.tick.call(this);
      this.radius += (this.maxRadius - 30) / this.maxLife;
      if (this.radius > this.maxRadius) {
        return (this.radius = this.maxRadius);
      }
    };

    WavePullArch.prototype.hitUnit = function (unit) {
      var amount, dot, p;
      if (!this.hitOnce[unit.id]) {
        unit.applyDamage(this.damage);
        this.hitOnce[unit.id] = true;
      }
      p = this.waveEffect * this.damage;
      v2.norm(this.vel, _wave);
      v2.scale(_wave, -this.direction);
      dot = v2.dot(unit.vel, _wave);
      amount = 0;
      if (dot < p) {
        amount = p;
      }
      v2.scale(_wave, amount);
      return v2.add(unit.vel, _wave);
    };

    return WavePullArch;
  })(Bullet);

  parts.WavePullTurret = (function (superClass) {
    extend(WavePullTurret, superClass);

    function WavePullTurret() {
      return WavePullTurret.__super__.constructor.apply(this, arguments);
    }

    WavePullTurret.prototype.name = "Gravity Pull Wave";

    WavePullTurret.prototype.desc = "Projects a gravity wave that pulls and damages as it passes through units.";

    WavePullTurret.prototype.hp = 10;

    WavePullTurret.prototype.cost = 5;

    WavePullTurret.prototype.image = "turWavePull.png";

    WavePullTurret.prototype.size = [2, 2];

    WavePullTurret.prototype.reloadTime = 64;

    WavePullTurret.prototype.trackSpeed = 90;

    WavePullTurret.prototype.bulletCls = types.WavePullArch;

    WavePullTurret.prototype.range = 850;

    WavePullTurret.prototype.shotEnergy = 1200;

    WavePullTurret.prototype.mass = 10;

    WavePullTurret.prototype.bulletSpeed = 35;

    WavePullTurret.prototype.damage = 4;

    WavePullTurret.prototype.multiHit = true;

    return WavePullTurret;
  })(Turret);

  types.WavePushArch = (function (superClass) {
    extend(WavePushArch, superClass);

    function WavePushArch() {
      return WavePushArch.__super__.constructor.apply(this, arguments);
    }

    WavePushArch.prototype.image = "parts/fireWavePush.png";

    WavePushArch.prototype.sound = "sounds/weapons/WavePush.wav";

    WavePushArch.prototype.direction = -1;

    WavePushArch.prototype.maxRadius = 100;

    WavePushArch.prototype.waveEffect = 0.55;

    return WavePushArch;
  })(types.WavePullArch);

  parts.WavePushTurret = (function (superClass) {
    extend(WavePushTurret, superClass);

    function WavePushTurret() {
      return WavePushTurret.__super__.constructor.apply(this, arguments);
    }

    WavePushTurret.prototype.name = "Gravity Push Wave";

    WavePushTurret.prototype.desc = "Projects a gravity wave that pushes and damages as it passes through units.";

    WavePushTurret.prototype.image = "turWavePush.png";

    WavePushTurret.prototype.bulletCls = types.WavePushArch;

    WavePushTurret.prototype.range = 775;

    WavePushTurret.prototype.damage = 5;

    WavePushTurret.prototype.multiHit = true;

    return WavePushTurret;
  })(parts.WavePullTurret);

  types.FlameBulletGhost = (function (superClass) {
    extend(FlameBulletGhost, superClass);

    function FlameBulletGhost() {
      return FlameBulletGhost.__super__.constructor.apply(this, arguments);
    }

    FlameBulletGhost.prototype.draw = function () {
      this.color[0] = Math.max(0, 255 - (260 * this.radius) / this.maxRadius);
      this.color[1] = Math.max(0, 255 - (440 * this.radius) / this.maxRadius);
      this.color[2] = Math.max(0, 255 - (700 * this.radius) / this.maxRadius);
      this.color[3] = 64 * (1.2 - this.radius / this.maxRadius);
      this.size[0] = this.radius / 100;
      this.size[1] = this.radius / 100;
      return FlameBulletGhost.__super__.draw.call(this);
    };

    FlameBulletGhost.prototype.tick = function () {
      FlameBulletGhost.__super__.tick.call(this);
      this.radius += (this.maxRadius - 3) / this.maxLife;
      if (this.radius > this.maxRadius) {
        return (this.radius = this.maxRadius);
      }
    };

    FlameBulletGhost.prototype.scan = function () {
      return null;
    };

    return FlameBulletGhost;
  })(Bullet);

  types.FlameBullet = (function (superClass) {
    extend(FlameBullet, superClass);

    FlameBullet.prototype.image = "parts/fireFlame1.png";

    FlameBullet.prototype.sound = "sounds/weapons/fireFlame.wav";

    FlameBullet.prototype.size = [0.7, 0.7];

    FlameBullet.prototype.color = [179, 207, 255, 255];

    FlameBullet.prototype.radius = 2;

    FlameBullet.prototype.maxRadius = 64;

    FlameBullet.prototype.hitsMultiple = true;

    FlameBullet.prototype.hitsCloak = true;

    FlameBullet.prototype.createGhost = 0;

    FlameBullet.prototype.originPos = [0, 0];

    function FlameBullet() {
      FlameBullet.__super__.constructor.call(this);
      this.hitOnce = {};
    }

    FlameBullet.prototype.draw = function () {
      var ex, ref, s, w;
      this.createGhost += 1;
      if (this.life < 2 && this.createGhost % 3 === 0) {
        if (this.origin) {
          w = (ref = this.origin.weapons) != null ? ref[this.turretNum || 0] : void 0;
          if (w) {
            v2.set(w.worldPos, this.originPos);
            ex = new types.FlameBulletGhost();
            ex.main = false;
            ex.image = "parts/fireFlame" + chooseInt(1, 4) + ".png";
            ex.z = this.z + rand() * 0.01;
            ex.pos = v2.create(this.originPos);
            ex.vel = v2.create(this.vel);
            s = 0.3 + 0.4 * Math.random();
            ex.size = [s, s];
            ex.radius = this.radius * 5;
            ex.maxRadius = this.maxRadius * 5;
            ex.rot = rand() * Math.PI * 2;
            ex.vrot = 0;
            ex.maxLife = this.maxLife;
            ex._pos = v2.create(ex.pos);
            ex._pos2 = v2.create(ex.pos);
            ex.rot = ex.rot;
            ex._rot = ex.rot;
            ex._rot2 = ex.rot;
            intp.particles[ex.id] = ex;
          }
        }
      }
      this.color[0] = Math.max(0, 255 - (260 * this.radius) / this.maxRadius);
      this.color[1] = Math.max(0, 255 - (440 * this.radius) / this.maxRadius);
      this.color[2] = Math.max(0, 255 - (700 * this.radius) / this.maxRadius);
      this.color[3] = 64 * (1.2 - this.radius / this.maxRadius);
      this.size[0] = this.radius * 0.1;
      this.size[1] = this.radius * 0.1;
      return FlameBullet.__super__.draw.call(this);
    };

    FlameBullet.prototype.tick = function () {
      FlameBullet.__super__.tick.call(this);
      this.radius += (this.maxRadius - 30) / this.maxLife;
      if (this.radius > this.maxRadius) {
        return (this.radius = this.maxRadius);
      }
    };

    FlameBullet.prototype.hitUnit = function (unit) {
      var maxBurn;
      if (!this.hitOnce[unit.id]) {
        unit.applyDamage(this.damage);
        maxBurn = (unit.hp + unit.shield) * 1.0;
        if (unit.burn < maxBurn) {
          unit.burn += this.burnAmount * this.damage;
          if (unit.burn > maxBurn) {
            unit.burn = maxBurn;
          }
        }
        return (this.hitOnce[unit.id] = true);
      }
    };

    FlameBullet.prototype.postFire = function () {
      v2.add(this.pos, this.vel);
      v2.add(this.pos, this.vel);
      this.z += 10;
      this.rot = Math.PI * 2 * Math.random();
      return (this.image = "parts/fireFlame" + chooseInt(1, 4) + ".png");
    };

    return FlameBullet;
  })(Bullet);

  parts.FlameTurret = (function (superClass) {
    extend(FlameTurret, superClass);

    function FlameTurret() {
      return FlameTurret.__super__.constructor.apply(this, arguments);
    }

    FlameTurret.prototype.name = "Flamethrower";

    FlameTurret.prototype.desc = "Fires a flame that lights units on fire that deals burn damage over time.";

    FlameTurret.prototype.hp = 10;

    FlameTurret.prototype.cost = 3;

    FlameTurret.prototype.image = "turFlame.png";

    FlameTurret.prototype.size = [2, 2];

    FlameTurret.prototype.reloadTime = 8;

    FlameTurret.prototype.trackSpeed = 90;

    FlameTurret.prototype.bulletCls = types.FlameBullet;

    FlameTurret.prototype.range = 360;

    FlameTurret.prototype.shotEnergy = 400;

    FlameTurret.prototype.mass = 14;

    FlameTurret.prototype.bulletSpeed = 16;

    FlameTurret.prototype.damage = 3;

    FlameTurret.prototype.dealsBurnDamage = true;

    FlameTurret.prototype.burnAmount = 7;

    FlameTurret.prototype.disable = false;

    return FlameTurret;
  })(Turret);

  parts.AOEWarhead = (function (superClass) {
    extend(AOEWarhead, superClass);

    function AOEWarhead() {
      return AOEWarhead.__super__.constructor.apply(this, arguments);
    }

    AOEWarhead.prototype.name = "Explosive Warhead";

    AOEWarhead.prototype.desc = "Kamikaze warhead dealing damage within an area";

    AOEWarhead.prototype.hp = 0;

    AOEWarhead.prototype.cost = 6;

    AOEWarhead.prototype.mass = 10;

    AOEWarhead.prototype.image = "AOEWarhead.png";

    AOEWarhead.prototype.attach = true;

    AOEWarhead.prototype.size = [2, 2];

    AOEWarhead.prototype.aoe = 390;

    AOEWarhead.prototype.life = 16;

    AOEWarhead.prototype.damage = 16;

    AOEWarhead.prototype.tab = "defence";

    AOEWarhead.prototype.explodes = true;

    AOEWarhead.prototype.init = function () {
      return (this.unit.warhead = true);
    };

    AOEWarhead.prototype.tick = function () {
      var i, len, other, ref, results;
      if (this.unit.warheadTest !== sim.step && this.unit.shapeDamage == null) {
        this.unit.warheadTest = sim.step;
        ref = this.unit.closestEnemies();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          other = ref[i];
          if (v2.distance(other.pos, this.unit.pos) < this.unit.radius + other.radius + 50) {
            results.push((this.unit.hp = 0));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    AOEWarhead.prototype.postDeath = function () {
      var exp;
      exp = new types.AoeExplosion();
      exp.side = this.unit.side;
      exp.z = 1000;
      exp.pos = v2.create(this.worldPos);
      exp.vel = [0, 0];
      exp.rot = 0;
      exp.maxLife = this.life;
      exp.damage = this.damage;
      exp.aoe = this.aoe;
      exp.radius = 2;
      sim.things[exp.id] = exp;
    };

    return AOEWarhead;
  })(Part);

  parts.EMPWarhead = (function (superClass) {
    extend(EMPWarhead, superClass);

    function EMPWarhead() {
      return EMPWarhead.__super__.constructor.apply(this, arguments);
    }

    EMPWarhead.prototype.name = "EMP Warhead";

    EMPWarhead.prototype.desc = "Kamikaze EMP blast draining energy within an area";

    EMPWarhead.prototype.hp = 0;

    EMPWarhead.prototype.cost = 15;

    EMPWarhead.prototype.mass = 5;

    EMPWarhead.prototype.image = "empField.png";

    EMPWarhead.prototype.attach = true;

    EMPWarhead.prototype.size = [2, 2];

    EMPWarhead.prototype.aoe = 300;

    EMPWarhead.prototype.life = 16;

    EMPWarhead.prototype.energyDamage = 6000;

    EMPWarhead.prototype.tab = "defence";

    EMPWarhead.prototype.explodes = true;

    EMPWarhead.prototype.init = function () {
      return (this.unit.warhead = true);
    };

    EMPWarhead.prototype.tick = function () {
      var i, len, other, ref, results;
      if (this.unit.warheadTest !== sim.step && this.unit.shapeDamage == null) {
        this.unit.warheadTest = sim.step;
        ref = this.unit.closestEnemies();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          other = ref[i];
          if (v2.distance(other.pos, this.unit.pos) < this.unit.radius + other.radius + 50) {
            results.push((this.unit.hp = 0));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    EMPWarhead.prototype.postDeath = function () {
      var exp;
      exp = new types.AoeExplosion();
      exp.side = this.unit.side;
      exp.image = "parts/zaphit" + chooseInt(1, 3) + ".png";
      exp.z = 1000;
      exp.pos = v2.create(this.worldPos);
      exp.vel = [0, 0];
      exp.rot = rand() * 100;
      exp.maxLife = this.life;
      exp.energyDamage = this.energyDamage;
      exp.aoe = this.aoe;
      exp.radius = 8;
      sim.things[exp.id] = exp;
    };

    return EMPWarhead;
  })(Part);

  parts.FlameWarhead = (function (superClass) {
    extend(FlameWarhead, superClass);

    function FlameWarhead() {
      return FlameWarhead.__super__.constructor.apply(this, arguments);
    }

    FlameWarhead.prototype.hide = true;

    FlameWarhead.prototype.disable = true;

    FlameWarhead.prototype.name = "Flame Warhead";

    FlameWarhead.prototype.desc = "Kamikaze flame blast applying burn damage within an area";

    FlameWarhead.prototype.hp = 0;

    FlameWarhead.prototype.cost = 5;

    FlameWarhead.prototype.mass = 5;

    FlameWarhead.prototype.image = "decals/Symbol15.png";

    FlameWarhead.prototype.attach = true;

    FlameWarhead.prototype.size = [2, 2];

    FlameWarhead.prototype.aoe = 250;

    FlameWarhead.prototype.life = 25;

    FlameWarhead.prototype.damage = 5;

    FlameWarhead.prototype.burnAmount = 10;

    FlameWarhead.prototype.tab = "defence";

    FlameWarhead.prototype.explodes = true;

    FlameWarhead.prototype.init = function () {
      return (this.unit.warhead = true);
    };

    FlameWarhead.prototype.tick = function () {
      var i, len, other, ref, results;
      if (this.unit.warheadTest !== sim.step && this.unit.shapeDamage == null) {
        this.unit.warheadTest = sim.step;
        ref = this.unit.closestEnemies();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          other = ref[i];
          if (v2.distance(other.pos, this.unit.pos) < this.unit.radius + other.radius + 50) {
            results.push((this.unit.hp = 0));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    FlameWarhead.prototype.postDeath = function () {
      var exp;
      exp = new types.AoeExplosion();
      exp.side = this.unit.side;
      exp.image = "parts/fireFlame" + chooseInt(1, 4) + ".png";
      exp.z = 1000;
      exp.pos = v2.create(this.worldPos);
      exp.vel = [0, 0];
      exp.rot = rand() * 100;
      exp.maxLife = this.life;
      exp.color[0] = 233;
      exp.color[1] = 146;
      exp.color[2] = 86;
      exp.damage = this.damage;
      exp.burnAmount = this.burnAmount * this.damage;
      exp.aoe = this.aoe;
      exp.radius = 8;
      sim.things[exp.id] = exp;
    };

    return FlameWarhead;
  })(Part);

  parts.ShapedWarhead = (function (superClass) {
    extend(ShapedWarhead, superClass);

    function ShapedWarhead() {
      return ShapedWarhead.__super__.constructor.apply(this, arguments);
    }

    ShapedWarhead.prototype.name = "Shaped Warhead";

    ShapedWarhead.prototype.desc = "Explodes on impact dealing instant damage";

    ShapedWarhead.prototype.hp = 25;

    ShapedWarhead.prototype.cost = 5;

    ShapedWarhead.prototype.mass = 25;

    ShapedWarhead.prototype.image = "ShapedWarhead.png";

    ShapedWarhead.prototype.attach = true;

    ShapedWarhead.prototype.size = [2, 2];

    ShapedWarhead.prototype.aoe = 110;

    ShapedWarhead.prototype.damage = 90;

    ShapedWarhead.prototype.doesShapedDamage = true;

    ShapedWarhead.prototype.explodes = true;

    ShapedWarhead.prototype.tab = "defence";

    ShapedWarhead.prototype.init = function () {
      var i, len, part, ref, results;
      this.unit.warhead = true;
      if (this.unit.shapeDamage == null) {
        this.unit.shapeDamage = 0;
        ref = this.unit.parts;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          part = ref[i];
          if (part.doesShapedDamage) {
            results.push((this.unit.shapeDamage += this.damage));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    ShapedWarhead.prototype.tick = function () {
      var i, len, other, ref, results;
      if (this.unit.warheadTest !== sim.step) {
        this.unit.warheadTest = sim.step;
        ref = this.unit.closestEnemies();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          other = ref[i];
          if ((other.maxHP + other.maxShield) * 2 < this.unit.shapeDamage) {
            continue;
          }
          if (v2.distance(other.pos, this.unit.pos) > other.radius + this.unit.radius) {
            continue;
          }
          results.push((this.unit.hp = 0));
        }
        return results;
      }
    };

    ShapedWarhead.prototype.postDeath = function () {
      var exp;
      exp = new types.AoeExplosion();
      exp.side = this.unit.side;
      exp.z = 1000;
      exp.pos = v2.create(this.worldPos);
      exp.vel = [0, 0];
      exp.rot = 0;
      exp.maxLife = this.life;
      exp.damage = this.damage;
      exp.aoe = this.aoe;
      exp.radius = 2;
      sim.things[exp.id] = exp;
    };

    return ShapedWarhead;
  })(Part);

  ModPart = (function (superClass) {
    extend(ModPart, superClass);

    function ModPart() {
      this.effected_weapons = bind(this.effected_weapons, this);
      return ModPart.__super__.constructor.apply(this, arguments);
    }

    ModPart.prototype.adjacent = true;

    ModPart.prototype.attach = true;

    ModPart.prototype.size = [2, 2];

    ModPart.prototype.weaponRange = 0;

    ModPart.prototype.weaponRangeFlat = 0;

    ModPart.prototype.weaponDamage = 0;

    ModPart.prototype.weaponSpeed = 0;

    ModPart.prototype.weaponReload = 0;

    ModPart.prototype.weaponEnergy = 0;

    ModPart.prototype.stripe = true;

    ModPart.prototype.tab = "weapons";

    ModPart.prototype.effected_weapons = function () {
      var effected, i, len, ref, w;
      effected = [];
      ref = this.unit.weapons;
      for (i = 0, len = ref.length; i < len; i++) {
        w = ref[i];
        if (v2.distance(w.pos, this.pos) < 45) {
          effected.push(w);
        }
      }
      return effected;
    };

    ModPart.prototype.init = function () {
      var effect, i, len, results, w, ws;
      ws = this.effected_weapons();
      effect = (1 / 0.85) * Math.pow(0.85, ws.length);
      results = [];
      for (i = 0, len = ws.length; i < len; i++) {
        w = ws[i];
        w.weaponRange *= 1 + (this.weaponRange / 100) * effect;
        w.weaponRangeFlat += this.weaponRangeFlat * effect;
        w.weaponDamage *= 1 + (this.weaponDamage / 100) * effect;
        w.weaponSpeed += (this.weaponSpeed / 100) * effect;
        w.weaponReload *= 1 + (this.weaponReload / 100) * effect;
        results.push((w.weaponEnergy *= 1 + (this.weaponEnergy / 100) * effect));
      }
      return results;
    };

    return ModPart;
  })(Part);

  parts.TargetingMod = (function (superClass) {
    extend(TargetingMod, superClass);

    function TargetingMod() {
      return TargetingMod.__super__.constructor.apply(this, arguments);
    }

    TargetingMod.prototype.name = "Targeting Subsystem";

    TargetingMod.prototype.desc = "Increaces range of adjacent weapons at cost of reload rate. -15% effect for each supported weapon.";

    TargetingMod.prototype.hp = 10;

    TargetingMod.prototype.cost = 20;

    TargetingMod.prototype.mass = 30;

    TargetingMod.prototype.image = "TargetingMod.png";

    TargetingMod.prototype.weaponRange = 20;

    TargetingMod.prototype.weaponReload = 30;

    TargetingMod.prototype.weaponRangeFlat = 80;

    return TargetingMod;
  })(ModPart);

  parts.DamageMod = (function (superClass) {
    extend(DamageMod, superClass);

    function DamageMod() {
      return DamageMod.__super__.constructor.apply(this, arguments);
    }

    DamageMod.prototype.name = "Overcharger";

    DamageMod.prototype.desc = "Increases damage of adjacent weapons at cost of reload rate. -15% effect for each supported weapon";

    DamageMod.prototype.cost = 10;

    DamageMod.prototype.mass = 10;

    DamageMod.prototype.image = "DamageMod.png";

    DamageMod.prototype.weaponDamage = 30;

    DamageMod.prototype.weaponReload = 15;

    return DamageMod;
  })(ModPart);

  parts.ReloaderMod = (function (superClass) {
    extend(ReloaderMod, superClass);

    function ReloaderMod() {
      return ReloaderMod.__super__.constructor.apply(this, arguments);
    }

    ReloaderMod.prototype.name = "Reloader";

    ReloaderMod.prototype.desc = "Decreases reload time of adjacent weapons. -15% effect for each supported weapon";

    ReloaderMod.prototype.cost = 25;

    ReloaderMod.prototype.mass = 10;

    ReloaderMod.prototype.image = "ReloaderMod.png";

    ReloaderMod.prototype.weaponReload = -34;

    return ReloaderMod;
  })(ModPart);

  parts.BulletSpeedMod = (function (superClass) {
    extend(BulletSpeedMod, superClass);

    function BulletSpeedMod() {
      return BulletSpeedMod.__super__.constructor.apply(this, arguments);
    }

    BulletSpeedMod.prototype.name = "Speed Coils";

    BulletSpeedMod.prototype.desc = "Adds flat range and flat % bullet speed to adjacent weapons at cost of reload rate. -15% effect for each supported weapon.";

    BulletSpeedMod.prototype.cost = 5;

    BulletSpeedMod.prototype.mass = 1;

    BulletSpeedMod.prototype.hp = 5;

    BulletSpeedMod.prototype.image = "BulletSpeedMod.png";

    BulletSpeedMod.prototype.weaponSpeed = 50;

    BulletSpeedMod.prototype.weaponReload = 15;

    BulletSpeedMod.prototype.weaponRangeFlat = 50;

    return BulletSpeedMod;
  })(ModPart);

  parts.DampenerMod = (function (superClass) {
    extend(DampenerMod, superClass);

    function DampenerMod() {
      return DampenerMod.__super__.constructor.apply(this, arguments);
    }

    DampenerMod.prototype.name = "Dampener";

    DampenerMod.prototype.desc = "Decreases energy usage of adjacent weapons at the cost of bullet speed. -15% effect for each supported weapon.";

    DampenerMod.prototype.cost = 5;

    DampenerMod.prototype.mass = 5;

    DampenerMod.prototype.hp = 10;

    DampenerMod.prototype.image = "dampener.png";

    DampenerMod.prototype.weaponSpeed = -8;

    DampenerMod.prototype.weaponEnergy = -26.5;

    return DampenerMod;
  })(ModPart);

  AiPart = (function (superClass) {
    extend(AiPart, superClass);

    function AiPart() {
      return AiPart.__super__.constructor.apply(this, arguments);
    }

    AiPart.prototype.hp = 0;

    AiPart.prototype.hide = true;

    AiPart.prototype.name = "Missile Only AI";

    AiPart.prototype.desc = "Makes the adjacent turrets shoot only at missiles if close to missile ships. (does not work yet)";

    AiPart.prototype.cost = 5;

    AiPart.prototype.image = "ai01.png";

    AiPart.prototype.attach = true;

    AiPart.prototype.adjacent = true;

    AiPart.prototype.size = [1, 1];

    AiPart.prototype.mass = 1;

    AiPart.prototype.stripe = true;

    AiPart.prototype.tab = "weapons";

    return AiPart;
  })(Part);

  parts.Ai1 = (function (superClass) {
    extend(Ai1, superClass);

    function Ai1() {
      return Ai1.__super__.constructor.apply(this, arguments);
    }

    Ai1.prototype.hp = 0;

    Ai1.prototype.hide = true;

    Ai1.prototype.name = "Missile Only AI";

    Ai1.prototype.desc = "Makes the adjacent turrets shoot only at missiles if close to missile ships. (does not work yet)";

    Ai1.prototype.cost = 5;

    Ai1.prototype.image = "ai01.png";

    Ai1.prototype.attach = true;

    Ai1.prototype.adjacent = true;

    Ai1.prototype.size = [1, 1];

    Ai1.prototype.mass = 1;

    Ai1.prototype.stripe = true;

    Ai1.prototype.tab = "weapons";

    Ai1.prototype.disable = true;

    return Ai1;
  })(AiPart);

  parts.OverKillAi = (function (superClass) {
    extend(OverKillAi, superClass);

    function OverKillAi() {
      this.effected_weapons = bind(this.effected_weapons, this);
      return OverKillAi.__super__.constructor.apply(this, arguments);
    }

    OverKillAi.prototype.hide = false;

    OverKillAi.prototype.name = "No Overkill";

    OverKillAi.prototype.desc = "Makes the adjacent turrets not shoot if it would kill an enemy twice in one shot.";

    OverKillAi.prototype.cost = 1;

    OverKillAi.prototype.hp = 4;

    OverKillAi.prototype.image = "OverKillAi.png";

    OverKillAi.prototype.attach = true;

    OverKillAi.prototype.adjacent = true;

    OverKillAi.prototype.size = [1, 1];

    OverKillAi.prototype.mass = 1;

    OverKillAi.prototype.effected_weapons = function () {
      var effected, i, len, ref, w;
      effected = [];
      ref = this.unit.weapons;
      for (i = 0, len = ref.length; i < len; i++) {
        w = ref[i];
        if (v2.distance(w.pos, this.pos) < 45) {
          effected.push(w);
        }
      }
      return effected;
    };

    OverKillAi.prototype.init = function () {
      var i, len, results, w, ws;
      ws = this.effected_weapons();
      results = [];
      for (i = 0, len = ws.length; i < len; i++) {
        w = ws[i];
        results.push((w.noOverkill = true));
      }
      return results;
    };

    return OverKillAi;
  })(AiPart);

  parts.Ai3 = (function (superClass) {
    extend(Ai3, superClass);

    function Ai3() {
      return Ai3.__super__.constructor.apply(this, arguments);
    }

    Ai3.prototype.name = "Accurate AI";

    Ai3.prototype.desc = "Makes the adjacent turrets shoot only at targets is sure really to hit. (does not work yet)";

    Ai3.prototype.cost = 50;

    Ai3.prototype.image = "ai09.png";

    Ai3.prototype.attach = true;

    Ai3.prototype.adjacent = true;

    Ai3.prototype.size = [1, 1];

    Ai3.prototype.mass = 10;

    Ai3.prototype.disable = true;

    return Ai3;
  })(AiPart);

  parts.Ai4 = (function (superClass) {
    extend(Ai4, superClass);

    function Ai4() {
      return Ai4.__super__.constructor.apply(this, arguments);
    }

    Ai4.prototype.name = "AOE AI";

    Ai4.prototype.desc = "Makes the adjacent turrets shoot in the middle of groups trying to hit it with AOE damage. (does not work yet)";

    Ai4.prototype.cost = 50;

    Ai4.prototype.image = "ai03.png";

    Ai4.prototype.attach = true;

    Ai4.prototype.adjacent = true;

    Ai4.prototype.size = [1, 1];

    Ai4.prototype.mass = 10;

    Ai4.prototype.disable = true;

    return Ai4;
  })(AiPart);

  parts.SymbolDecal1 = (function (superClass) {
    extend(SymbolDecal1, superClass);

    function SymbolDecal1() {
      return SymbolDecal1.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal1.prototype.name = "Insignia";

    SymbolDecal1.prototype.desc = "Place this on your ship to show off your affiliation.";

    SymbolDecal1.prototype.hp = 0;

    SymbolDecal1.prototype.decal = true;

    SymbolDecal1.prototype.cost = 0;

    SymbolDecal1.prototype.image = "decals/Symbol1.png";

    SymbolDecal1.prototype.size = [2, 2];

    SymbolDecal1.prototype.mass = 0;

    SymbolDecal1.prototype.tab = "decal";

    SymbolDecal1.prototype.dlc = "Paint Job";

    SymbolDecal1.prototype.opacity = 1;

    return SymbolDecal1;
  })(Part);

  parts.SymbolDecal2 = (function (superClass) {
    extend(SymbolDecal2, superClass);

    function SymbolDecal2() {
      return SymbolDecal2.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal2.prototype.image = "decals/Symbol2.png";

    return SymbolDecal2;
  })(parts.SymbolDecal1);

  parts.SymbolDecal3 = (function (superClass) {
    extend(SymbolDecal3, superClass);

    function SymbolDecal3() {
      return SymbolDecal3.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal3.prototype.image = "decals/Symbol3.png";

    return SymbolDecal3;
  })(parts.SymbolDecal1);

  parts.SymbolDecal4 = (function (superClass) {
    extend(SymbolDecal4, superClass);

    function SymbolDecal4() {
      return SymbolDecal4.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal4.prototype.image = "decals/Symbol4.png";

    return SymbolDecal4;
  })(parts.SymbolDecal1);

  parts.SymbolDecal5 = (function (superClass) {
    extend(SymbolDecal5, superClass);

    function SymbolDecal5() {
      return SymbolDecal5.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal5.prototype.image = "decals/Symbol5.png";

    return SymbolDecal5;
  })(parts.SymbolDecal1);

  parts.SymbolDecal6 = (function (superClass) {
    extend(SymbolDecal6, superClass);

    function SymbolDecal6() {
      return SymbolDecal6.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal6.prototype.image = "decals/Symbol6.png";

    return SymbolDecal6;
  })(parts.SymbolDecal1);

  parts.SymbolDecal7 = (function (superClass) {
    extend(SymbolDecal7, superClass);

    function SymbolDecal7() {
      return SymbolDecal7.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal7.prototype.image = "decals/Symbol7.png";

    return SymbolDecal7;
  })(parts.SymbolDecal1);

  parts.SymbolDecal8 = (function (superClass) {
    extend(SymbolDecal8, superClass);

    function SymbolDecal8() {
      return SymbolDecal8.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal8.prototype.image = "decals/Symbol8.png";

    return SymbolDecal8;
  })(parts.SymbolDecal1);

  parts.SymbolDecal9 = (function (superClass) {
    extend(SymbolDecal9, superClass);

    function SymbolDecal9() {
      return SymbolDecal9.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal9.prototype.image = "decals/Symbol9.png";

    return SymbolDecal9;
  })(parts.SymbolDecal1);

  parts.SymbolDecal10 = (function (superClass) {
    extend(SymbolDecal10, superClass);

    function SymbolDecal10() {
      return SymbolDecal10.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal10.prototype.image = "decals/Symbol10.png";

    return SymbolDecal10;
  })(parts.SymbolDecal1);

  parts.SymbolDecal11 = (function (superClass) {
    extend(SymbolDecal11, superClass);

    function SymbolDecal11() {
      return SymbolDecal11.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal11.prototype.image = "decals/Symbol11.png";

    return SymbolDecal11;
  })(parts.SymbolDecal1);

  parts.SymbolDecal12 = (function (superClass) {
    extend(SymbolDecal12, superClass);

    function SymbolDecal12() {
      return SymbolDecal12.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal12.prototype.image = "decals/Symbol12.png";

    return SymbolDecal12;
  })(parts.SymbolDecal1);

  parts.SymbolDecal13 = (function (superClass) {
    extend(SymbolDecal13, superClass);

    function SymbolDecal13() {
      return SymbolDecal13.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal13.prototype.image = "decals/Symbol13.png";

    return SymbolDecal13;
  })(parts.SymbolDecal1);

  parts.SymbolDecal14 = (function (superClass) {
    extend(SymbolDecal14, superClass);

    function SymbolDecal14() {
      return SymbolDecal14.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal14.prototype.image = "decals/Symbol14.png";

    return SymbolDecal14;
  })(parts.SymbolDecal1);

  parts.SymbolDecal15 = (function (superClass) {
    extend(SymbolDecal15, superClass);

    function SymbolDecal15() {
      return SymbolDecal15.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal15.prototype.image = "decals/Symbol15.png";

    return SymbolDecal15;
  })(parts.SymbolDecal1);

  parts.SymbolDecal16 = (function (superClass) {
    extend(SymbolDecal16, superClass);

    function SymbolDecal16() {
      return SymbolDecal16.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal16.prototype.image = "decals/Symbol16.png";

    return SymbolDecal16;
  })(parts.SymbolDecal1);

  parts.SymbolDecal17 = (function (superClass) {
    extend(SymbolDecal17, superClass);

    function SymbolDecal17() {
      return SymbolDecal17.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal17.prototype.image = "decals/Symbol17.png";

    return SymbolDecal17;
  })(parts.SymbolDecal1);

  parts.SymbolDecal18 = (function (superClass) {
    extend(SymbolDecal18, superClass);

    function SymbolDecal18() {
      return SymbolDecal18.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal18.prototype.image = "decals/Symbol18.png";

    return SymbolDecal18;
  })(parts.SymbolDecal1);

  parts.SymbolDecal19 = (function (superClass) {
    extend(SymbolDecal19, superClass);

    function SymbolDecal19() {
      return SymbolDecal19.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal19.prototype.image = "decals/Symbol19.png";

    return SymbolDecal19;
  })(parts.SymbolDecal1);

  parts.SymbolDecal20 = (function (superClass) {
    extend(SymbolDecal20, superClass);

    function SymbolDecal20() {
      return SymbolDecal20.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal20.prototype.image = "decals/Symbol20.png";

    return SymbolDecal20;
  })(parts.SymbolDecal1);

  parts.SymbolDecal21 = (function (superClass) {
    extend(SymbolDecal21, superClass);

    function SymbolDecal21() {
      return SymbolDecal21.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal21.prototype.image = "decals/Symbol21.png";

    return SymbolDecal21;
  })(parts.SymbolDecal1);

  parts.SymbolDecal22 = (function (superClass) {
    extend(SymbolDecal22, superClass);

    function SymbolDecal22() {
      return SymbolDecal22.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal22.prototype.image = "decals/Symbol22.png";

    return SymbolDecal22;
  })(parts.SymbolDecal1);

  parts.SymbolDecal23 = (function (superClass) {
    extend(SymbolDecal23, superClass);

    function SymbolDecal23() {
      return SymbolDecal23.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal23.prototype.image = "decals/Symbol23.png";

    return SymbolDecal23;
  })(parts.SymbolDecal1);

  parts.SymbolDecal24 = (function (superClass) {
    extend(SymbolDecal24, superClass);

    function SymbolDecal24() {
      return SymbolDecal24.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal24.prototype.image = "decals/Symbol24.png";

    return SymbolDecal24;
  })(parts.SymbolDecal1);

  parts.SymbolDecal25 = (function (superClass) {
    extend(SymbolDecal25, superClass);

    function SymbolDecal25() {
      return SymbolDecal25.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal25.prototype.image = "decals/Symbol25.png";

    return SymbolDecal25;
  })(parts.SymbolDecal1);

  parts.SymbolDecal26 = (function (superClass) {
    extend(SymbolDecal26, superClass);

    function SymbolDecal26() {
      return SymbolDecal26.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal26.prototype.image = "decals/Symbol26.png";

    return SymbolDecal26;
  })(parts.SymbolDecal1);

  parts.SymbolDecal27 = (function (superClass) {
    extend(SymbolDecal27, superClass);

    function SymbolDecal27() {
      return SymbolDecal27.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal27.prototype.image = "decals/Symbol27.png";

    return SymbolDecal27;
  })(parts.SymbolDecal1);

  parts.SymbolDecal28 = (function (superClass) {
    extend(SymbolDecal28, superClass);

    function SymbolDecal28() {
      return SymbolDecal28.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal28.prototype.image = "decals/Symbol28.png";

    return SymbolDecal28;
  })(parts.SymbolDecal1);

  parts.SymbolDecal29 = (function (superClass) {
    extend(SymbolDecal29, superClass);

    function SymbolDecal29() {
      return SymbolDecal29.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal29.prototype.image = "decals/Symbol29.png";

    SymbolDecal29.prototype.disable = true;

    return SymbolDecal29;
  })(parts.SymbolDecal1);

  parts.SymbolDecal30 = (function (superClass) {
    extend(SymbolDecal30, superClass);

    function SymbolDecal30() {
      return SymbolDecal30.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal30.prototype.image = "decals/Symbol30.png";

    SymbolDecal30.prototype.disable = true;

    return SymbolDecal30;
  })(parts.SymbolDecal1);

  parts.SymbolDecal31 = (function (superClass) {
    extend(SymbolDecal31, superClass);

    function SymbolDecal31() {
      return SymbolDecal31.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal31.prototype.image = "decals/Symbol31.png";

    SymbolDecal31.prototype.disable = true;

    return SymbolDecal31;
  })(parts.SymbolDecal1);

  parts.SymbolDecal32 = (function (superClass) {
    extend(SymbolDecal32, superClass);

    function SymbolDecal32() {
      return SymbolDecal32.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal32.prototype.image = "decals/Symbol32.png";

    SymbolDecal32.prototype.disable = true;

    return SymbolDecal32;
  })(parts.SymbolDecal1);

  parts.SymbolDecal33 = (function (superClass) {
    extend(SymbolDecal33, superClass);

    function SymbolDecal33() {
      return SymbolDecal33.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal33.prototype.image = "decals/Symbol33.png";

    SymbolDecal33.prototype.disable = true;

    return SymbolDecal33;
  })(parts.SymbolDecal1);

  parts.SymbolDecal34 = (function (superClass) {
    extend(SymbolDecal34, superClass);

    function SymbolDecal34() {
      return SymbolDecal34.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal34.prototype.image = "decals/Symbol34.png";

    SymbolDecal34.prototype.disable = true;

    return SymbolDecal34;
  })(parts.SymbolDecal1);

  parts.SymbolDecal35 = (function (superClass) {
    extend(SymbolDecal35, superClass);

    function SymbolDecal35() {
      return SymbolDecal35.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal35.prototype.image = "decals/Symbol35.png";

    SymbolDecal35.prototype.disable = true;

    return SymbolDecal35;
  })(parts.SymbolDecal1);

  parts.SymbolDecal36 = (function (superClass) {
    extend(SymbolDecal36, superClass);

    function SymbolDecal36() {
      return SymbolDecal36.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal36.prototype.image = "decals/Symbol36.png";

    SymbolDecal36.prototype.disable = true;

    return SymbolDecal36;
  })(parts.SymbolDecal1);

  parts.SymbolDecal37 = (function (superClass) {
    extend(SymbolDecal37, superClass);

    function SymbolDecal37() {
      return SymbolDecal37.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal37.prototype.image = "decals/Symbol37.png";

    SymbolDecal37.prototype.disable = true;

    return SymbolDecal37;
  })(parts.SymbolDecal1);

  parts.SymbolDecal38 = (function (superClass) {
    extend(SymbolDecal38, superClass);

    function SymbolDecal38() {
      return SymbolDecal38.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal38.prototype.image = "decals/Symbol38.png";

    SymbolDecal38.prototype.disable = true;

    return SymbolDecal38;
  })(parts.SymbolDecal1);

  parts.SymbolDecal39 = (function (superClass) {
    extend(SymbolDecal39, superClass);

    function SymbolDecal39() {
      return SymbolDecal39.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal39.prototype.image = "decals/Symbol39.png";

    SymbolDecal39.prototype.disable = true;

    return SymbolDecal39;
  })(parts.SymbolDecal1);

  parts.SymbolDecal40 = (function (superClass) {
    extend(SymbolDecal40, superClass);

    function SymbolDecal40() {
      return SymbolDecal40.__super__.constructor.apply(this, arguments);
    }

    SymbolDecal40.prototype.image = "decals/Symbol40.png";

    SymbolDecal40.prototype.disable = true;

    return SymbolDecal40;
  })(parts.SymbolDecal1);

  parts.Stripe1x1 = (function (superClass) {
    extend(Stripe1x1, superClass);

    function Stripe1x1() {
      return Stripe1x1.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1.prototype.name = "Stripe";

    Stripe1x1.prototype.desc = "Stripes make your ships cool.";

    Stripe1x1.prototype.size = [1, 1];

    Stripe1x1.prototype.image = "decals/Stripe1x1.png";

    Stripe1x1.prototype.tab = "stripes";

    Stripe1x1.prototype.opacity = 1;

    return Stripe1x1;
  })(parts.SymbolDecal1);

  parts.Stripe1x1Corner = (function (superClass) {
    extend(Stripe1x1Corner, superClass);

    function Stripe1x1Corner() {
      return Stripe1x1Corner.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Corner.prototype.size = [1, 1];

    Stripe1x1Corner.prototype.image = "decals/Stripe1x1Corner.png";

    return Stripe1x1Corner;
  })(parts.Stripe1x1);

  parts.Stripe1x2 = (function (superClass) {
    extend(Stripe1x2, superClass);

    function Stripe1x2() {
      return Stripe1x2.__super__.constructor.apply(this, arguments);
    }

    Stripe1x2.prototype.size = [1, 2];

    Stripe1x2.prototype.image = "decals/Stripe1x2.png";

    return Stripe1x2;
  })(parts.Stripe1x1);

  parts.Stripe2x1 = (function (superClass) {
    extend(Stripe2x1, superClass);

    function Stripe2x1() {
      return Stripe2x1.__super__.constructor.apply(this, arguments);
    }

    Stripe2x1.prototype.size = [2, 1];

    Stripe2x1.prototype.image = "decals/Stripe2x1.png";

    return Stripe2x1;
  })(parts.Stripe1x1);

  parts.Stripe2x2 = (function (superClass) {
    extend(Stripe2x2, superClass);

    function Stripe2x2() {
      return Stripe2x2.__super__.constructor.apply(this, arguments);
    }

    Stripe2x2.prototype.size = [2, 2];

    Stripe2x2.prototype.image = "decals/Stripe2x2.png";

    return Stripe2x2;
  })(parts.Stripe1x1);

  parts.Stripe2x2Corner = (function (superClass) {
    extend(Stripe2x2Corner, superClass);

    function Stripe2x2Corner() {
      return Stripe2x2Corner.__super__.constructor.apply(this, arguments);
    }

    Stripe2x2Corner.prototype.size = [2, 2];

    Stripe2x2Corner.prototype.image = "decals/Stripe2x2Corner.png";

    return Stripe2x2Corner;
  })(parts.Stripe1x1);

  parts.Stripe2x2Round = (function (superClass) {
    extend(Stripe2x2Round, superClass);

    function Stripe2x2Round() {
      return Stripe2x2Round.__super__.constructor.apply(this, arguments);
    }

    Stripe2x2Round.prototype.size = [2, 2];

    Stripe2x2Round.prototype.image = "decals/Stripe2x2Round.png";

    return Stripe2x2Round;
  })(parts.Stripe1x1);

  parts.StripeDouble2x1 = (function (superClass) {
    extend(StripeDouble2x1, superClass);

    function StripeDouble2x1() {
      return StripeDouble2x1.__super__.constructor.apply(this, arguments);
    }

    StripeDouble2x1.prototype.size = [2, 1];

    StripeDouble2x1.prototype.image = "decals/StripeDouble2x1.png";

    return StripeDouble2x1;
  })(parts.Stripe1x1);

  parts.StripeDouble2x2 = (function (superClass) {
    extend(StripeDouble2x2, superClass);

    function StripeDouble2x2() {
      return StripeDouble2x2.__super__.constructor.apply(this, arguments);
    }

    StripeDouble2x2.prototype.size = [2, 2];

    StripeDouble2x2.prototype.image = "decals/StripeDouble2x2.png";

    return StripeDouble2x2;
  })(parts.Stripe1x1);

  parts.Stripe1x1Slash = (function (superClass) {
    extend(Stripe1x1Slash, superClass);

    function Stripe1x1Slash() {
      return Stripe1x1Slash.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Slash.prototype.size = [1, 1];

    Stripe1x1Slash.prototype.image = "decals/Stripe1x1Slash.png";

    Stripe1x1Slash.prototype.dlc = "Curves and Shadows";

    return Stripe1x1Slash;
  })(parts.Stripe1x1);

  parts.Stripe1x1SlashInside = (function (superClass) {
    extend(Stripe1x1SlashInside, superClass);

    function Stripe1x1SlashInside() {
      return Stripe1x1SlashInside.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1SlashInside.prototype.size = [1, 1];

    Stripe1x1SlashInside.prototype.image = "decals/Stripe1x1SlashInside.png";

    Stripe1x1SlashInside.prototype.dlc = "Curves and Shadows";

    return Stripe1x1SlashInside;
  })(parts.Stripe1x1);

  parts.Stripe2x2Slash = (function (superClass) {
    extend(Stripe2x2Slash, superClass);

    function Stripe2x2Slash() {
      return Stripe2x2Slash.__super__.constructor.apply(this, arguments);
    }

    Stripe2x2Slash.prototype.size = [2, 2];

    Stripe2x2Slash.prototype.image = "decals/Stripe2x2Slash.png";

    Stripe2x2Slash.prototype.dlc = "Curves and Shadows";

    return Stripe2x2Slash;
  })(parts.Stripe1x1);

  parts.Stripe2x2End = (function (superClass) {
    extend(Stripe2x2End, superClass);

    function Stripe2x2End() {
      return Stripe2x2End.__super__.constructor.apply(this, arguments);
    }

    Stripe2x2End.prototype.size = [2, 2];

    Stripe2x2End.prototype.image = "decals/Stripe2x2End.png";

    Stripe2x2End.prototype.dlc = "Curves and Shadows";

    return Stripe2x2End;
  })(parts.Stripe1x1);

  parts.Stripe1x1Fill1 = (function (superClass) {
    extend(Stripe1x1Fill1, superClass);

    function Stripe1x1Fill1() {
      return Stripe1x1Fill1.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Fill1.prototype.size = [1, 1];

    Stripe1x1Fill1.prototype.image = "decals/Stripe1x1Fill1.png";

    Stripe1x1Fill1.prototype.dlc = "Curves and Shadows";

    return Stripe1x1Fill1;
  })(parts.Stripe1x1);

  parts.Stripe1x1Fill2 = (function (superClass) {
    extend(Stripe1x1Fill2, superClass);

    function Stripe1x1Fill2() {
      return Stripe1x1Fill2.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Fill2.prototype.size = [1, 1];

    Stripe1x1Fill2.prototype.image = "decals/Stripe1x1Fill2.png";

    Stripe1x1Fill2.prototype.dlc = "Curves and Shadows";

    return Stripe1x1Fill2;
  })(parts.Stripe1x1);

  parts.Stripe1x1Fill3 = (function (superClass) {
    extend(Stripe1x1Fill3, superClass);

    function Stripe1x1Fill3() {
      return Stripe1x1Fill3.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Fill3.prototype.size = [1, 1];

    Stripe1x1Fill3.prototype.image = "decals/Stripe1x1Fill3.png";

    Stripe1x1Fill3.prototype.dlc = "Curves and Shadows";

    return Stripe1x1Fill3;
  })(parts.Stripe1x1);

  parts.Stripe1x1Fill4 = (function (superClass) {
    extend(Stripe1x1Fill4, superClass);

    function Stripe1x1Fill4() {
      return Stripe1x1Fill4.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Fill4.prototype.size = [1, 1];

    Stripe1x1Fill4.prototype.image = "decals/Stripe1x1Fill4.png";

    Stripe1x1Fill4.prototype.dlc = "Curves and Shadows";

    return Stripe1x1Fill4;
  })(parts.Stripe1x1);

  parts.Stripe1x1Fill5 = (function (superClass) {
    extend(Stripe1x1Fill5, superClass);

    function Stripe1x1Fill5() {
      return Stripe1x1Fill5.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Fill5.prototype.size = [1, 1];

    Stripe1x1Fill5.prototype.image = "decals/Stripe1x1Fill5.png";

    Stripe1x1Fill5.prototype.dlc = "Curves and Shadows";

    return Stripe1x1Fill5;
  })(parts.Stripe1x1);

  parts.Stripe1x1Fill6 = (function (superClass) {
    extend(Stripe1x1Fill6, superClass);

    function Stripe1x1Fill6() {
      return Stripe1x1Fill6.__super__.constructor.apply(this, arguments);
    }

    Stripe1x1Fill6.prototype.size = [1, 1];

    Stripe1x1Fill6.prototype.image = "decals/Stripe1x1Fill6.png";

    Stripe1x1Fill6.prototype.dlc = "Curves and Shadows";

    return Stripe1x1Fill6;
  })(parts.Stripe1x1);

  parts.LetterA = (function (superClass) {
    extend(LetterA, superClass);

    function LetterA() {
      return LetterA.__super__.constructor.apply(this, arguments);
    }

    LetterA.prototype.name = "Lettering";

    LetterA.prototype.desc = "Mark your ships.";

    LetterA.prototype.image = "decals/letterA.png";

    LetterA.prototype.tab = "letters";

    LetterA.prototype.flip = false;

    LetterA.prototype.opacity = 1;

    return LetterA;
  })(parts.SymbolDecal1);

  parts.LetterB = (function (superClass) {
    extend(LetterB, superClass);

    function LetterB() {
      return LetterB.__super__.constructor.apply(this, arguments);
    }

    LetterB.prototype.image = "decals/letterB.png";

    return LetterB;
  })(parts.LetterA);

  parts.LetterC = (function (superClass) {
    extend(LetterC, superClass);

    function LetterC() {
      return LetterC.__super__.constructor.apply(this, arguments);
    }

    LetterC.prototype.image = "decals/letterC.png";

    return LetterC;
  })(parts.LetterA);

  parts.LetterD = (function (superClass) {
    extend(LetterD, superClass);

    function LetterD() {
      return LetterD.__super__.constructor.apply(this, arguments);
    }

    LetterD.prototype.image = "decals/letterD.png";

    return LetterD;
  })(parts.LetterA);

  parts.LetterE = (function (superClass) {
    extend(LetterE, superClass);

    function LetterE() {
      return LetterE.__super__.constructor.apply(this, arguments);
    }

    LetterE.prototype.image = "decals/letterE.png";

    return LetterE;
  })(parts.LetterA);

  parts.LetterF = (function (superClass) {
    extend(LetterF, superClass);

    function LetterF() {
      return LetterF.__super__.constructor.apply(this, arguments);
    }

    LetterF.prototype.image = "decals/letterF.png";

    return LetterF;
  })(parts.LetterA);

  parts.LetterG = (function (superClass) {
    extend(LetterG, superClass);

    function LetterG() {
      return LetterG.__super__.constructor.apply(this, arguments);
    }

    LetterG.prototype.image = "decals/letterG.png";

    return LetterG;
  })(parts.LetterA);

  parts.LetterH = (function (superClass) {
    extend(LetterH, superClass);

    function LetterH() {
      return LetterH.__super__.constructor.apply(this, arguments);
    }

    LetterH.prototype.image = "decals/letterH.png";

    return LetterH;
  })(parts.LetterA);

  parts.LetterI = (function (superClass) {
    extend(LetterI, superClass);

    function LetterI() {
      return LetterI.__super__.constructor.apply(this, arguments);
    }

    LetterI.prototype.image = "decals/letterI.png";

    return LetterI;
  })(parts.LetterA);

  parts.LetterJ = (function (superClass) {
    extend(LetterJ, superClass);

    function LetterJ() {
      return LetterJ.__super__.constructor.apply(this, arguments);
    }

    LetterJ.prototype.image = "decals/letterJ.png";

    return LetterJ;
  })(parts.LetterA);

  parts.LetterK = (function (superClass) {
    extend(LetterK, superClass);

    function LetterK() {
      return LetterK.__super__.constructor.apply(this, arguments);
    }

    LetterK.prototype.image = "decals/letterK.png";

    return LetterK;
  })(parts.LetterA);

  parts.LetterL = (function (superClass) {
    extend(LetterL, superClass);

    function LetterL() {
      return LetterL.__super__.constructor.apply(this, arguments);
    }

    LetterL.prototype.image = "decals/letterL.png";

    return LetterL;
  })(parts.LetterA);

  parts.LetterM = (function (superClass) {
    extend(LetterM, superClass);

    function LetterM() {
      return LetterM.__super__.constructor.apply(this, arguments);
    }

    LetterM.prototype.image = "decals/letterM.png";

    return LetterM;
  })(parts.LetterA);

  parts.LetterN = (function (superClass) {
    extend(LetterN, superClass);

    function LetterN() {
      return LetterN.__super__.constructor.apply(this, arguments);
    }

    LetterN.prototype.image = "decals/letterN.png";

    return LetterN;
  })(parts.LetterA);

  parts.LetterO = (function (superClass) {
    extend(LetterO, superClass);

    function LetterO() {
      return LetterO.__super__.constructor.apply(this, arguments);
    }

    LetterO.prototype.image = "decals/letterO.png";

    return LetterO;
  })(parts.LetterA);

  parts.LetterP = (function (superClass) {
    extend(LetterP, superClass);

    function LetterP() {
      return LetterP.__super__.constructor.apply(this, arguments);
    }

    LetterP.prototype.image = "decals/letterP.png";

    return LetterP;
  })(parts.LetterA);

  parts.LetterQ = (function (superClass) {
    extend(LetterQ, superClass);

    function LetterQ() {
      return LetterQ.__super__.constructor.apply(this, arguments);
    }

    LetterQ.prototype.image = "decals/letterQ.png";

    return LetterQ;
  })(parts.LetterA);

  parts.LetterR = (function (superClass) {
    extend(LetterR, superClass);

    function LetterR() {
      return LetterR.__super__.constructor.apply(this, arguments);
    }

    LetterR.prototype.image = "decals/letterR.png";

    return LetterR;
  })(parts.LetterA);

  parts.LetterS = (function (superClass) {
    extend(LetterS, superClass);

    function LetterS() {
      return LetterS.__super__.constructor.apply(this, arguments);
    }

    LetterS.prototype.image = "decals/letterS.png";

    return LetterS;
  })(parts.LetterA);

  parts.LetterT = (function (superClass) {
    extend(LetterT, superClass);

    function LetterT() {
      return LetterT.__super__.constructor.apply(this, arguments);
    }

    LetterT.prototype.image = "decals/letterT.png";

    return LetterT;
  })(parts.LetterA);

  parts.LetterU = (function (superClass) {
    extend(LetterU, superClass);

    function LetterU() {
      return LetterU.__super__.constructor.apply(this, arguments);
    }

    LetterU.prototype.image = "decals/letterU.png";

    return LetterU;
  })(parts.LetterA);

  parts.LetterV = (function (superClass) {
    extend(LetterV, superClass);

    function LetterV() {
      return LetterV.__super__.constructor.apply(this, arguments);
    }

    LetterV.prototype.image = "decals/letterV.png";

    return LetterV;
  })(parts.LetterA);

  parts.LetterW = (function (superClass) {
    extend(LetterW, superClass);

    function LetterW() {
      return LetterW.__super__.constructor.apply(this, arguments);
    }

    LetterW.prototype.image = "decals/letterW.png";

    return LetterW;
  })(parts.LetterA);

  parts.LetterX = (function (superClass) {
    extend(LetterX, superClass);

    function LetterX() {
      return LetterX.__super__.constructor.apply(this, arguments);
    }

    LetterX.prototype.image = "decals/letterX.png";

    return LetterX;
  })(parts.LetterA);

  parts.LetterY = (function (superClass) {
    extend(LetterY, superClass);

    function LetterY() {
      return LetterY.__super__.constructor.apply(this, arguments);
    }

    LetterY.prototype.image = "decals/letterY.png";

    return LetterY;
  })(parts.LetterA);

  parts.LetterZ = (function (superClass) {
    extend(LetterZ, superClass);

    function LetterZ() {
      return LetterZ.__super__.constructor.apply(this, arguments);
    }

    LetterZ.prototype.image = "decals/letterZ.png";

    return LetterZ;
  })(parts.LetterA);

  parts.LetterPound = (function (superClass) {
    extend(LetterPound, superClass);

    function LetterPound() {
      return LetterPound.__super__.constructor.apply(this, arguments);
    }

    LetterPound.prototype.image = "decals/letterPound.png";

    return LetterPound;
  })(parts.LetterA);

  parts.LetterDot = (function (superClass) {
    extend(LetterDot, superClass);

    function LetterDot() {
      return LetterDot.__super__.constructor.apply(this, arguments);
    }

    LetterDot.prototype.image = "decals/letterDot.png";

    return LetterDot;
  })(parts.LetterA);

  parts.Letter0 = (function (superClass) {
    extend(Letter0, superClass);

    function Letter0() {
      return Letter0.__super__.constructor.apply(this, arguments);
    }

    Letter0.prototype.image = "decals/letter0.png";

    return Letter0;
  })(parts.LetterA);

  parts.Letter1 = (function (superClass) {
    extend(Letter1, superClass);

    function Letter1() {
      return Letter1.__super__.constructor.apply(this, arguments);
    }

    Letter1.prototype.image = "decals/letter1.png";

    return Letter1;
  })(parts.LetterA);

  parts.Letter2 = (function (superClass) {
    extend(Letter2, superClass);

    function Letter2() {
      return Letter2.__super__.constructor.apply(this, arguments);
    }

    Letter2.prototype.image = "decals/letter2.png";

    return Letter2;
  })(parts.LetterA);

  parts.Letter3 = (function (superClass) {
    extend(Letter3, superClass);

    function Letter3() {
      return Letter3.__super__.constructor.apply(this, arguments);
    }

    Letter3.prototype.image = "decals/letter3.png";

    return Letter3;
  })(parts.LetterA);

  parts.Letter4 = (function (superClass) {
    extend(Letter4, superClass);

    function Letter4() {
      return Letter4.__super__.constructor.apply(this, arguments);
    }

    Letter4.prototype.image = "decals/letter4.png";

    return Letter4;
  })(parts.LetterA);

  parts.Letter5 = (function (superClass) {
    extend(Letter5, superClass);

    function Letter5() {
      return Letter5.__super__.constructor.apply(this, arguments);
    }

    Letter5.prototype.image = "decals/letter5.png";

    return Letter5;
  })(parts.LetterA);

  parts.Letter6 = (function (superClass) {
    extend(Letter6, superClass);

    function Letter6() {
      return Letter6.__super__.constructor.apply(this, arguments);
    }

    Letter6.prototype.image = "decals/letter6.png";

    return Letter6;
  })(parts.LetterA);

  parts.Letter7 = (function (superClass) {
    extend(Letter7, superClass);

    function Letter7() {
      return Letter7.__super__.constructor.apply(this, arguments);
    }

    Letter7.prototype.image = "decals/letter7.png";

    return Letter7;
  })(parts.LetterA);

  parts.Letter8 = (function (superClass) {
    extend(Letter8, superClass);

    function Letter8() {
      return Letter8.__super__.constructor.apply(this, arguments);
    }

    Letter8.prototype.image = "decals/letter8.png";

    return Letter8;
  })(parts.LetterA);

  parts.Letter9 = (function (superClass) {
    extend(Letter9, superClass);

    function Letter9() {
      return Letter9.__super__.constructor.apply(this, arguments);
    }

    Letter9.prototype.image = "decals/letter9.png";

    return Letter9;
  })(parts.LetterA);

  Faction = (function (superClass) {
    extend(Faction, superClass);

    function Faction() {
      return Faction.__super__.constructor.apply(this, arguments);
    }

    Faction.prototype.name = "Faction Insignia";

    Faction.prototype.desc = "Place this in your ship to show off your faction affiliation.";

    Faction.prototype.hp = 4;

    Faction.prototype.cost = 1;

    Faction.prototype.size = [2, 2];

    Faction.prototype.mass = 1;

    Faction.prototype.tab = "decal";

    Faction.prototype.opacity = 1;

    Faction.prototype.faction = "DEV";

    Faction.prototype.image = "factions/DEV.png";

    Faction.prototype.disable = true;

    return Faction;
  })(Part);

  parts.Faction1 = (function (superClass) {
    extend(Faction1, superClass);

    function Faction1() {
      return Faction1.__super__.constructor.apply(this, arguments);
    }

    Faction1.prototype.faction = "DEV";

    Faction1.prototype.image = "factions/DEV.png";

    return Faction1;
  })(Faction);

  parts.Faction2 = (function (superClass) {
    extend(Faction2, superClass);

    function Faction2() {
      return Faction2.__super__.constructor.apply(this, arguments);
    }

    Faction2.prototype.faction = "MOD";

    Faction2.prototype.image = "factions/MOD.png";

    return Faction2;
  })(Faction);

  parts.Faction3 = (function (superClass) {
    extend(Faction3, superClass);

    function Faction3() {
      return Faction3.__super__.constructor.apply(this, arguments);
    }

    Faction3.prototype.faction = "KC";

    Faction3.prototype.image = "factions/KC.png";

    return Faction3;
  })(Faction);

  parts.Faction4 = (function (superClass) {
    extend(Faction4, superClass);

    function Faction4() {
      return Faction4.__super__.constructor.apply(this, arguments);
    }

    Faction4.prototype.faction = "AUTO";

    Faction4.prototype.image = "factions/AUTO.png";

    return Faction4;
  })(Faction);

  parts.Faction5 = (function (superClass) {
    extend(Faction5, superClass);

    function Faction5() {
      return Faction5.__super__.constructor.apply(this, arguments);
    }

    Faction5.prototype.faction = "SIEG";

    Faction5.prototype.image = "factions/SIEG.png";

    return Faction5;
  })(Faction);

  parts.Faction6 = (function (superClass) {
    extend(Faction6, superClass);

    function Faction6() {
      return Faction6.__super__.constructor.apply(this, arguments);
    }

    Faction6.prototype.faction = "ISOI";

    Faction6.prototype.image = "factions/ISOI.png";

    return Faction6;
  })(Faction);

  parts.Faction7 = (function (superClass) {
    extend(Faction7, superClass);

    function Faction7() {
      return Faction7.__super__.constructor.apply(this, arguments);
    }

    Faction7.prototype.faction = "TKKA";

    Faction7.prototype.image = "factions/TKKA.png";

    return Faction7;
  })(Faction);

  window.tablePart = function () {
    var _, cls, dps, part, ref, ref1, ref2, ref3, table, tps;
    tps = Sim.prototype.ticksPerSec;
    table = [];
    for (_ in parts) {
      cls = parts[_];
      part = new cls();
      if (part.bulletCls) {
        continue;
      }
      table.push({
        name: part.constructor.name,
        image: part.image,
        cost: part.cost,
        hp: part.hp / part.cost,
        mass: part.mass / part.cost,
        genEnergy: part.genEnergy / part.cost,
        useEnergy: part.useEnergy / part.cost,
        storeEnergy: part.storeEnergy / part.cost,
        shield: part.shield / part.cost,
        genShield: part.genShield / part.cost,
        speed: part.speed / part.cost,
        turnSpeed: part.turnSpeed / part.cost,
      });
    }
    console.table(table);
    table = [];
    for (_ in parts) {
      cls = parts[_];
      part = new cls();
      if (part.bulletCls) {
        dps = ((ref = part.bulletCls) != null ? ref.prototype.damage : void 0) / part.reloadTime;
        table.push({
          name: part.name,
          image: part.image,
          hp: part.hp,
          cost: part.cost,
          cost_ty: (dps * (part.range - part.minRange)) / 30,
          mass: part.mass,
          useEnergy: part.useEnergy,
          dps: dps,
          damage: (ref1 = part.bulletCls) != null ? ref1.prototype.damage : void 0,
          reload: part.reloadTime,
          bulletSpeed: !part.instant ? ((ref2 = part.bulletCls) != null ? ref2.prototype.speed : void 0) : 40,
          range: part.range,
          minRange: part.minRange,
          aoe: part.aoe,
          instant: part.instant ? "yes" : void 0,
          exactRange: part.exactRange ? "yes" : void 0,
          missile: ((ref3 = part.bulletCls) != null ? ref3.prototype.missile : void 0) ? "yes" : void 0,
          hitsMissiles: part.hitsMissiles ? "yes*" : void 0,
        });
      }
    }
    return console.table(table);
  };
}.call(this));
