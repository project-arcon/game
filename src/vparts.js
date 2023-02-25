const v_parts = [
  {
    prototype: "Reactor2x2",
    image_name: "reactor_2x2",
    image_link: "https://i.ibb.co/7tzqBQX/react.png",
  },
  {
    prototype: "Solar2x2",
    image_name: "solar_2x2",
    image_link: "https://i.ibb.co/FXM5jX8/battery.png",
  },
];

const v_parts_names = ["2x2 Reactor", "2x2 Solar Panel"];

for (let i = 0; i < v_parts.length; i++) {
  const part = v_parts[i];
  imgloader.addImage(`parts/${part.image_name}.png`, part.image_link);
  parts[part.prototype].prototype.image = part.image_name + ".png";
}

setTimeout(() => {
  imgloader.combineImages();
}, 100);

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
  if (this.stripe) {
    baseAtlas.drawSprite("parts/gray-" + this.image, this.worldPos, [flip, -1], rot, [255, 255, 255, alpha]);
    c = this.unit.color;
    return baseAtlas.drawSprite("parts/red-" + this.image, this.worldPos, [flip, -1], rot, [c[0], c[1], c[2], alpha]);
  } else if (this.decal) {
    c = this.unit.color;
    return baseAtlas.drawSprite("parts/" + this.image, this.worldPos, [flip / this.scale, -1 / this.scale], rot, [c[0], c[1], c[2], alpha * this.opacity]);
  } else if (v_parts_names.includes(this.name)) {
    //this.scale = 1;
    return baseAtlas.drawSprite("parts/" + this.image, this.worldPos, [flip, -1], rot, [255, 255, 255, alpha]);
  } else {
    return baseAtlas.drawSprite("parts/" + this.image, this.worldPos, [flip, -1], rot, [255, 255, 255, alpha]);
  }
};
