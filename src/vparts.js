const vblocks = {
  Reactor1x1: {
    image: "reactor_1x1.png",
    vscale: 0.318,
  },
  Reactor1x2: {
    image: "reactor_1x2.png",
    vscale: 0.318,
  },
  Reactor2x1: {
    image: "reactor_2x1.png",
    vscale: 0.318,
  },
  Reactor2x2: {
    image: "reactor_2x2.png",
    vscale: 0.318,
  },
  Solar1x1: {
    image: "solar_1x1.png",
    vscale: 0.318,
  },
  Solar2x2: {
    image: "solar_2x2.png",
    vscale: 0.318,
  },
  Solar3x3: {
    image: "solar_3x3.png",
    vscale: 0.318,
  },
  Battery1x1: {
    image: "battery_1x1.png",
    vscale: 0.318,
  },
  Battery2x1: {
    image: "battery_2x1.png",
    vscale: 0.318,
  },
  Battery1x2: {
    image: "battery_1x2.png",
    vscale: 0.318,
  },
  Battery2x2: {
    image: "battery_2x2.png",
    vscale: 0.318,
  },
};
const vturrets = {
  PDTurret: {
    image: "l.pd_reload.png",
    has_ready: false,
    vscale: 0.48,
  },
  HeavyPDTurret: {
    image: "h.pd_reload.png",
    has_ready: false,
    vscale: 0.38,
  },
  RingTurret: {
    image: "ring_reload.png",
    has_ready: true,
    vscale: 0.42,
  },
  //RamTurret: "turWavePush.png",
  TorpTurret: {
    image: "torp_reload.png",
    has_ready: true,
    vscale: 0.48,
  },
  MissileTurret: {
    image: "missile_reload.png",
    has_ready: true,
    vscale: 0.48,
  },
  //ArtilleryTurret: "turLong1.png",
  //SidewinderTurret: "turMine.png",
  PlasmaTurret: {
    image: "plasma_reload.png",
    has_ready: true,
    vscale: 0.52,
  },
  LightPlasmaTurret: {
    image: "gatling_reload.png",
    has_ready: true,
    vscale: 0.52,
  },
  LightBeamTurret: {
    image: "l.beam_reload.png",
    has_ready: false,
    vscale: 0.48,
  },
  HeavyBeamTurret: {
    image: "h.beam_reload.png",
    has_ready: false,
    vscale: 0.48,
  },
  FlackTurret: {
    image: "flak_reload.png",
    has_ready: true,
    vscale: 0.38,
  },
  //SniperGun: "turSnipe1.png",
  EMPGun: {
    image: "emp_reload.png",
    has_ready: true,
    vscale: 0.44,
  },
  //EMPGun2: "turFizzleGun.png",
  //BombGun: "turBomb.png",
  AutoTurret: {
    image: "auto_cannon_reload.png",
    has_ready: false,
    vscale: 0.38,
  },
  //Shotgun: "turAutoCannon.png",
  //MachineGun: "turAutoCannon.png",
  TeslaTurret: {
    image: "tesla_reload.png",
    has_ready: true,
    vscale: 0.52,
  },
  //WavePullTurret: "turWavePull.png",
  //WavePushTurret: "turWavePush.png",
  //FlameTurret: "turFlame.png"
};

for (const i in vblocks) {
  const vpart = vblocks[i];
  const part = parts[i];
  part.prototype.image = vpart.image;

  part.prototype.vscale = vpart.vscale;
  part.prototype.vblock = true;
}

for (const i in vturrets) {
  const vpart = vturrets[i];
  const part = parts[i];
  part.prototype.image = vpart.image;
  part.prototype.has_ready = vpart.has_ready;

  part.prototype.vscale = vpart.vscale;
  part.prototype.vturret = true;
}

Part.prototype.draw = function () {
  var alpha, angle, c, flip, id, num, numParts, rot, showDamage, t;
  if (this.pos[0] < 0 && this.flip) flip = -1;
  else flip = 1;
  if (this.gimble) rot = Math.PI + this.rot;
  else rot = Math.PI + this.unit.rot;
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
  if (this.vblock) {
    if (this.pos[0] < 0 && this.flip) flip = -this.vscale;
    else flip = this.vscale;
    return baseAtlas.drawSprite("vparts/" + this.image, this.worldPos, [flip, -this.vscale], rot, [255, 255, 255, alpha]);
  } //
  else if (this.vturret) {
    c = this.unit.color;
    if (this.pos[0] < 0 && this.flip) flip = -this.vscale;
    else flip = this.vscale;
    if (this.has_ready && this.working) baseAtlas.drawSprite("vparts/" + this.image.replace("reload.png", "ready.png"), this.worldPos, [flip, -this.vscale], rot, [255, 255, 255, alpha]);
    else baseAtlas.drawSprite("vparts/" + this.image, this.worldPos, [flip, -this.vscale], rot, [255, 255, 255, alpha]);
    if (this.working) return baseAtlas.drawSprite("vparts/" + this.image.replace("reload.png", "bloom.png"), this.worldPos, [flip, -this.vscale], rot, [c[0], c[1], c[2], alpha * this.opacity]);
  }

  if (this.stripe) {
    baseAtlas.drawSprite("parts/gray-" + this.image, this.worldPos, [flip, -1], rot, [255, 255, 255, alpha]);
    c = this.unit.color;
    return baseAtlas.drawSprite("parts/red-" + this.image, this.worldPos, [flip, -1], rot, [c[0], c[1], c[2], alpha]);
  } else if (this.decal) {
    c = this.unit.color;
    return baseAtlas.drawSprite("parts/" + this.image, this.worldPos, [flip / this.scale, -1 / this.scale], rot, [c[0], c[1], c[2], alpha * this.opacity]);
  } else {
    return baseAtlas.drawSprite("parts/" + this.image, this.worldPos, [flip, -1], rot, [255, 255, 255, alpha]);
  }
};

Turret.prototype.draw = function () {
  if (this.vblock || this.vturret) return Turret.__super__.draw.call(this);
  if (this.working) {
    this.image = this.orignalImage;
  } else {
    this.image = this.orignalImage.replace(".png", "Reload.png");
  }
  return Turret.__super__.draw.call(this);
};

parts["RingTurret"].prototype.draw = function () {
  if (this.working) {
    this.spin += 0.01 * this.damage;
  } else {
    this.spin += 0.001 * this.damage;
  }
  Turret.__super__.draw.call(this);
  c = this.unit.color;
  alpha = 255;
  if (this.unit.cloakFade > 0) {
    alpha = 255 - this.unit.cloakFade * 200;
  }
  return baseAtlas.drawSprite("parts/" + "fizzleMineEnergy.png", this.worldPos, [1.2, 1.2], this.spin, [255, 255, 255, alpha]);
};

parts["TeslaTurret"].prototype.spriteIndex = 0;
parts["TeslaTurret"].prototype.spriteTimer = 0;

parts["TeslaTurret"].prototype.draw = function () {
  Turret.__super__.draw.call(this);
  if (!this.working) return;

  // Update the spriteTimer variable based on the damage
  this.spriteTimer += 1;
  if (this.spriteTimer >= (120 * 4) / this.damage) {
    // Change the sprite every 60 frames (1 second)
    this.spriteTimer = 0;
    // Choose a sprite based on the damage and update the spriteIndex variable
    var spriteIndex = Math.floor(Math.random() * 4);
    this.spriteIndex = spriteIndex;
  }

  c = this.unit.color;
  // Choose the sprite based on the spriteIndex and draw it without adding any rotation
  var spriteName = "tesla_zap" + (this.spriteIndex + 1);
  var rotation = (0.0001 * (Math.random() * this.damage)) / 8; // Scale the random angle by a factor of PI/8 to reduce the amount of rotation
  alpha = 255;
  if (this.unit.cloakFade > 0) {
    alpha = 255 - this.unit.cloakFade * 200;
  }
  return baseAtlas.drawSprite("vparts/" + spriteName + ".png", this.worldPos, [this.vscale, this.vscale], rotation, [255, 255, 255, alpha]);
};
