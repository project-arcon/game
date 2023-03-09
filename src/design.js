// here begin src/design.js
(function () {
  var NxN,
    SIZE,
    aiEditScreen,
    backToGalaxyButton,
    cell,
    divider,
    dragWhite,
    drawAddRule,
    drawAiParts,
    drawPart,
    drawParts,
    drawRule,
    drawRuleDD,
    drawRuleNumber,
    drawTab,
    editorButtons,
    finishDesignButton,
    has,
    hoverInfo,
    hoverTip,
    isBuildRule,
    lockScreen,
    partThumb,
    partThumbCache,
    powerBar,
    shareBox,
    smallTip,
    unitInfo,
    weaponInfo,
    white,
    bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };

  eval(onecup["import"]());

  NxN = 24;

  SIZE = 20;

  white = [255, 255, 255, 255];

  dragWhite = [255, 255, 255, 200];

  window.DesignMode = (function () {
    //DesignMode.prototype.tab = "weapons";
    DesignMode.prototype.tab = null;

    DesignMode.prototype.hoverOverPart = null;

    DesignMode.prototype.hoverOverParts = null;

    DesignMode.prototype.draggingPart = null;

    DesignMode.prototype.draggingPart2 = null;

    //DesignMode.prototype.hoverTipPart = null;

    DesignMode.prototype.hoverTipParts = null;

    DesignMode.prototype.wiggle = 0;

    DesignMode.prototype.aiEdit = false;

    DesignMode.prototype.showAiTools = true;

    DesignMode.prototype.locked = false;

    DesignMode.prototype.showHiddenParts = false;

    DesignMode.prototype.outsidePartsPlacement = false;

    DesignMode.prototype.overlapPartsPlacement = false;

    DesignMode.prototype.hideBackground = false;

    DesignMode.prototype.manualLocked = false;

    DesignMode.prototype.disableBadPartsFlash = false;

    DesignMode.prototype.advanced_build_tool = false;

    function DesignMode() {
      this.draw = bind(this.draw, this);
      var badParts, ref;
      this.zoom = 0.5;
      this.focus = v2.create();
      this.draggingPart = null;
      this.draggingPart2 = null;
      this.mouse = [0, 0];
      this.pos = [0, 0];
      this.unit = new types.Unit("{}");
      this.dragUnit = new types.Unit("{}");
      (ref = computeGrid(commander, this.unit)), (this.grid = ref[0]), (badParts = ref[1]);
      this.fresh = true;
      this.hoverOverParts = [];
      this.hoverTipParts = [];
    }

    DesignMode.prototype.fromSpec = function (spec) {
      this.unit = new types.Unit(spec);
      return this.refresh();
    };

    DesignMode.prototype.clear = function () {
      this.unit = new types.Unit("{}");
      buildBar.setSpec(buildBar.selected, "");
      control.savePlayer();
      return this.refresh();
    };

    DesignMode.prototype.partSpec = function () {
      return this.unit.toSpec();
    };

    DesignMode.prototype.toGameSpace = function (point) {
      point[0] = point[0] - window.innerWidth / 2;
      point[1] = window.innerHeight - point[1] - window.innerHeight / 2;
      v2.scale(point, this.zoom * 2);
      v2.sub(point, this.focus);
      return point;
    };

    DesignMode.prototype.rotatePart = function (part, way) {
      if (way == null) {
        way = 1;
      }
      if (part.canRotate) {
        part.dir = (4 + part.dir + way) % 4;
      } else {
        this.wiggle = 10 * way;
      }
      return part;
    };

    DesignMode.prototype.shiftShip = function (shift) {
      var j, len, p, ref;
      ref = this.unit.parts;
      for (j = 0, len = ref.length; j < len; j++) {
        p = ref[j];
        v2.add(p.pos, shift);
      }
      this.save();
      return this.refresh();
    };

    DesignMode.prototype.onkeyup = function (e) {
      if (this.draggingPart) {
        if (settings.key(e, "Zoom In")) {
          this.draggingPart = this.rotatePart(this.draggingPart, 1);
        }
        if (settings.key(e, "Zoom Out")) {
          return (this.draggingPart = this.rotatePart(this.draggingPart, -1));
        }
      } else if (document.activeElement === document.body) {
        if (!this.disabledEditing()) {
          if (settings.key(e, "Up")) {
            this.shiftShip([0, SIZE]);
          }
          if (settings.key(e, "Down")) {
            this.shiftShip([0, -SIZE]);
          }
          if (settings.key(e, "Left")) {
            this.shiftShip([-SIZE, 0]);
          }
          if (settings.key(e, "Right")) {
            return this.shiftShip([SIZE, 0]);
          }
        }
      }
    };

    DesignMode.prototype.onmousemove = function (e) {
      var b, x, y;
      this.mouse = this.toGameSpace([e.clientX, e.clientY]);
      this.uiMouse = [e.clientX, e.clientY];
      if (designMode.smallTipBounds) {
        b = designMode.smallTipBounds;
        x = this.uiMouse[0];
        y = this.uiMouse[1];
        if (x < b.left || x > b.right || y < b.top || y > b.bottom) {
          designMode.smallTipBounds = null;
          return (designMode.smallTip = null);
        }
      }
    };

    DesignMode.prototype.disabledEditing = function () {
      return designMode.aiEdit || /*designMode.locked || */ designMode.showShareBox || designMode.showShareBoxJson || designMode.manualLocked;
    };

    DesignMode.prototype.onmousedown = function (e) {
      var className, j, len, p, part, ref, ref1, ref2, symmetryPos;
      if (this.disabledEditing()) {
        return;
      }
      if (e.which === 3 && this.draggingPart) {
        this.draggingPart = this.rotatePart(this.draggingPart);
        return;
      }
      if (this.draggingPart) {
        return;
      }
      if (this.hoverOverPart) {
        if (e.shiftKey) {
          className = this.hoverOverPart.constructor.name;
          this.draggingPart = new parts[className]();
          this.draggingPart.pos = v2.create(this.hoverOverPart.pos);
          this.draggingPart.dir = this.hoverOverPart.dir;
          this.dragUnit.parts = [this.draggingPart];
          this.draggingPart.unit = this.dragUnit;
          return;
        } else {
          this.draggingPart = this.hoverOverPart;
          this.dragUnit.parts = [this.draggingPart];
          if (this.symmetryMode) {
            symmetryPos = v2.create(this.draggingPart.pos);
            symmetryPos[0] *= -1;
            ref = this.unit.parts;
            for (j = 0, len = ref.length; j < len; j++) {
              part = ref[j];
              if (v2.distance(part.pos, symmetryPos) < 0.1 && part.constructor.name === this.draggingPart.constructor.name && part !== this.draggingPart) {
                this.draggingPart2 = part;
                this.dragUnit.parts.push(this.draggingPart2);
                break;
              }
            }
          }
          this.unit.parts = function () {
            var l, len1, ref1, results;
            ref1 = this.unit.parts;
            results = [];
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              p = ref1[l];
              if (p !== this.draggingPart && p !== this.draggingPart2) {
                results.push(p);
              }
            }
            return results;
          }.call(this);
          if (e.altKey && !((ref1 = sim.galaxyStar) != null ? ref1.noDesignTools : void 0)) {
            this.draggingPart = null;
            this.draggingPart2 = null;
            this.dragUnit.parts = [];
            this.save();
            return;
          }
        }
        e.preventDefault();
      }
      if (((ref2 = sim.galaxyStar) != null ? ref2.noDesignTools : void 0) === true) {
        onecup.refresh();
      }
      return this.save();
    };

    DesignMode.prototype.onmouseup = function (e) {
      var placePart, ref;
      if (e.which === 3 && this.draggingPart) {
        return;
      }
      if (this.draggingPart) {
        if (this.outsidePartsPlacement || (Math.abs(this.pos[0]) < NxN * SIZE * 0.5 && Math.abs(this.pos[1]) < NxN * SIZE * 0.5)) {
          placePart = (function (_this) {
            return function (part) {
              var p, ref;
              part.pos = v2.create(part.pos);
              if (!((ref = sim.galaxyStar) != null ? ref.noDesignTools : void 0)) {
                _this.unit.parts = function () {
                  var j, len, ref1, results;
                  ref1 = this.unit.parts;
                  if (this.overlapPartsPlacement) {
                    return ref1;
                  }
                  results = [];
                  for (j = 0, len = ref1.length; j < len; j++) {
                    p = ref1[j];
                    if (v2.distance(part.pos, p.pos) < 0.1 && part.constructor.name === p.constructor.name) {
                      continue;
                    }
                    results.push(p);
                  }
                  return results;
                }.call(_this);
              }
              _this.unit.parts.push(part);
              return (part.unit = _this.unit);
            };
          })(this);
          placePart(this.draggingPart);
          if (this.symmetryMode && this.draggingPart2) {
            placePart(this.draggingPart2);
          }
          playSound("sounds/ui/flick.wav");
        } else {
          if (((ref = sim.galaxyStar) != null ? ref.noDesignTools : void 0) === true) {
            onecup.refresh();
            return;
          }
          playSound("sounds/ui/shake.wav");
        }
        this.refresh();
        this.save();
        this.draggingPart = null;
        this.dragUnit.parts = [];
        e.preventDefault();
        return onecup.refresh();
      }
    };

    DesignMode.prototype.refresh = function () {
      this.refreshGrid();
      return onecup.refresh();
    };

    DesignMode.prototype.onbuildclick = function (e, index) {
      return this.select(index);
    };

    DesignMode.prototype.select = function (index) {
      buildBar.selected = index;
      this.fromSpec(commander.buildBar[index]);
      return this.refresh();
    };

    DesignMode.prototype.save = function () {
      var spec;
      spec = this.partSpec();
      if (commander.side === "spectators") {
        commander.validBar[buildBar.selected] = validSpec(commander, spec);
      }
      buildBar.setSpec(buildBar.selected, spec);
      return control.savePlayer();
    };

    DesignMode.prototype.tick = function () {};

    DesignMode.prototype.refreshGrid = function () {
      var badPart, badParts, j, len, p, partScore, ref;
      partScore = function (part) {
        if (part.damage) {
          return 1000 + part.damage;
        } else if (part.decal) {
          return 100;
        } else {
          return 0;
        }
      };
      this.unit.parts.sort(function (a, b) {
        return partScore(a) - partScore(b);
      });
      this.unit.parts.forEach((p) => (p.ghostCopy = false));
      (ref = computeGrid(commander, this.unit)), (this.grid = ref[0]), (badParts = ref[1]);
    };

    DesignMode.prototype.warpIn = 0;

    DesignMode.prototype.draw = function () {
      var adjustAndDrawUnit, bg_zoom, className, color, flip, hoverOverPart, j, l, len, len1, len2, m, part, partNum, ref, ref1, ref2, row, s, size, t, th, tip, x, xoff, y, yoff, z;
      if (designMode.locked) {
        this.draggingPart = null;
        this.hoverOverPart = null;
      }
      baseAtlas.beginSprites(this.focus, this.zoom);
      if (this.fresh) {
        this.select(buildBar.selected);
        this.fresh = false;
      }
      color = commander.color;
      bg_zoom = Math.max(window.innerWidth, window.innerHeight) / 128;
      z = bg_zoom * this.zoom;
      baseAtlas.drawSprite("img/newbg/fill.png", [-this.focus[0], -this.focus[1]], [z, z], 0, this.hideBackground ? [0, 0, 0, 0] : mapping.themes[0].fillColor);
      baseAtlas.drawSprite("img/newbg/gradient.png", [-this.focus[0], -this.focus[1]], [z, z], 0, this.hideBackground ? [0, 0, 0, 0] : mapping.themes[0].spotColor);
      hoverOverPart = null;
      var hoverOverParts = [];
      ref = this.unit.parts;
      for (partNum = j = 0, len = ref.length; j < len; partNum = ++j) {
        part = ref[partNum];
        part.working = true;
        size = part.flippedSize();
        x = Math.abs(part.pos[0] - this.mouse[0]) < (size[0] / 2) * SIZE;
        y = Math.abs(part.pos[1] - this.mouse[1]) < (size[1] / 2) * SIZE;
        if (x && y) {
          hoverOverPart = part;
          hoverOverParts.push(part);
        }
      }
      if (this.hoverOverPart !== hoverOverPart) {
        this.hoverOverPart = hoverOverPart;
        onecup.refresh();
      }
      if (hoverOverParts.length > 0) {
        this.hoverTipParts = hoverOverParts.reverse();
        onecup.refresh();
      }
      adjustAndDrawUnit = function (unit) {
        var l, len1, ref1, weapon;
        unit.rot = Math.PI;
        ref1 = unit.weapons;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          weapon = ref1[l];
          weapon.rot = Math.PI;
        }
        unit.computeCenter();
        unit.pos[0] = unit.center[0];
        unit.pos[1] = unit.center[1];
        unit.warpIn = 1;
        unit.shield = unit.maxShield;
        unit.jump = 40;
        unit.color = commander.color;
        return unit.draw();
      };
      adjustAndDrawUnit(this.unit);
      adjustAndDrawUnit(this.dragUnit);
      if (ui.show) {
        ref1 = this.grid;
        for (x = l = 0, len1 = ref1.length; l < len1; x = ++l) {
          row = ref1[x];
          for (y = m = 0, len2 = row.length; m < len2; y = ++m) {
            t = row[y];
            if (t.bad && !this.hideHoverInfo && !this.disableBadPartsFlash) {
              color = [255, 0, 0, 80 + Math.sin(Date.now() / 300) * 80];
            } else if (t.exhaust) {
              color = [255, 255, 255, 65];
            } else if (t.attach && !t.solid) {
              color = [0, 255, 0, 35];
            } else if (t.solid) {
              continue;
            } else if (NxN / 2 - 1 <= x && x <= NxN / 2 && NxN / 2 - 1 <= y && y <= NxN / 2) {
              color = [0, 0, 0, 50];
            } else {
              color = [0, 0, 0, 25];
            }
            baseAtlas.drawSprite("parts/sel1x1.png", [(x - NxN / 2) * SIZE + SIZE / 2, (y - NxN / 2) * SIZE + SIZE / 2], [0.8, 0.8], 0, color);
          }
        }
      }
      if (this.draggingPart) {
        this.draggingPart.rot = Math.PI;
        this.draggingPart.working = true;
        if (this.mouse[0] < 0 && this.draggingPart.flip) {
          flip = -1;
        } else {
          flip = 1;
        }
        s = SIZE;
        if (this.draggingPart.size[0] % 2 === 1) {
          xoff = 0.5 * s;
        } else {
          xoff = 0;
        }
        if (this.draggingPart.size[1] % 2 === 1) {
          yoff = 0.5 * s;
        } else {
          yoff = 0;
        }
        if (this.draggingPart.dir % 2 === 1) {
          (ref2 = [yoff, xoff]), (xoff = ref2[0]), (yoff = ref2[1]);
        }
        this.pos = [Math.floor(this.mouse[0] / s) * s + xoff, Math.floor(this.mouse[1] / s) * s + yoff];
        this.wiggle *= 0.9;
        th = Math.sin(this.wiggle / 50);
        v2.set(this.pos, this.draggingPart.worldPos);
        v2.set(this.pos, this.draggingPart.pos);
        if (this.draggingPart.adjacent) {
          s = 35 / 255;
          baseAtlas.drawSprite("img/point02.png", [this.pos[0], this.pos[1]], [s, s], 0, white);
        }
      }
      if (designMode.symmetryMode) {
        if (this.draggingPart && !this.draggingPart2) {
          className = this.draggingPart.constructor.name;
          this.draggingPart2 = new parts[className]();
          this.draggingPart2.unit = this.dragUnit;
          this.dragUnit.parts.push(this.draggingPart2);
        }
        if (this.draggingPart && this.draggingPart2) {
          v2.set(this.draggingPart.worldPos, this.draggingPart2.worldPos);
          v2.set(this.draggingPart.pos, this.draggingPart2.pos);
          this.draggingPart2.worldPos[0] *= -1;
          this.draggingPart2.pos[0] *= -1;
          this.draggingPart2.rot = this.draggingPart.rot;
          this.draggingPart2.working = this.draggingPart.working;
          if (this.draggingPart.noFlip) {
            this.draggingPart2.dir = (1 + this.draggingPart.dir) % 4;
          } else {
            this.draggingPart2.dir = (4 - this.draggingPart.dir) % 4;
          }
        }
        if (!this.draggingPart && this.draggingPart2) {
          this.dragUnit.parts = [];
          this.draggingPart2 = null;
        }
      }
      baseAtlas.finishSprites();
      tip = onecup.lookup("#smalltip");
      if (tip != null && designMode.uiMouse) {
        x = designMode.uiMouse[0];
        y = designMode.uiMouse[1];
        if (!this.smallTip) {
          x = -1000;
          y = -1000;
        }
        if (x > window.innerWidth - 400) {
          x -= 10;
          tip.style.left = null;
          tip.style.right = window.innerWidth - x + "px";
        } else {
          x += 20;
          tip.style.left = x + "px";
          tip.style.right = null;
        }
        return (tip.style.top = y + 10 + "px");
      }
    };

    return DesignMode;
  })();

  partThumbCache = {};

  partThumb = function (part) {
    var imageDataUrl, k, scale;
    k = part.prototype.constructor.name + commander.color;
    if (!partThumbCache[k]) {
      baseAtlas.startOffscreenFrame();
      scale = 0.5 * part.prototype.scale;
      if (part.prototype.size[0] === 4 || part.prototype.size[1] === 4) {
        scale *= 1.5;
      }
      baseAtlas.beginSprites([0, 0], scale, [0, 0, -baseAtlas.rtt.width, baseAtlas.rtt.height]);
      if (part.prototype.stripe) {
        baseAtlas.drawSprite("parts/gray-" + part.prototype.image, [0, 0], [-1, 1], 0, white);
        baseAtlas.drawSprite("parts/red-" + part.prototype.image, [0, 0], [-1, 1], 0, commander.color);
      } else if (part.prototype.decal) {
        baseAtlas.drawSprite("parts/" + part.prototype.image, [0, 0], [-1, 1], 0, commander.color);
      } else if (part.prototype.vblock) {
        vscale = part.prototype.vscale;
        baseAtlas.drawSprite("vparts/" + part.prototype.image, [0, 0], [-vscale, vscale], 0, white);
      } else if (part.prototype.vturret) {
        vscale = part.prototype.vscale;
        vimage = part.prototype.image;
        if (part.prototype.has_ready) vimage = part.prototype.image.replace("reload.png", "ready.png");
        baseAtlas.drawSprite("vparts/" + vimage, [0, 0], [-vscale, vscale], 0, white);
        baseAtlas.drawSprite("vparts/" + part.prototype.image.replace("reload.png", "bloom.png"), [0, 0], [-vscale, vscale], 0, commander.color);
      } else {
        baseAtlas.drawSprite("parts/" + part.prototype.image, [0, 0], [-1, 1], 0, white);
      }
      baseAtlas.finishSprites(false);
      imageDataUrl = baseAtlas.endOffscreenFrame();
      partThumbCache[k] = imageDataUrl;
      return imageDataUrl;
    }
    return partThumbCache[k];
  };

  hoverTip = function (message) {
    return onmouseover(function (e) {
      designMode.smallTipBounds = e.target.getBoundingClientRect();
      return (designMode.smallTip = message);
    });
  };

  window.editorUI = function () {
    var ref;
    if (designMode.unit.spec !== commander.buildBar[buildBar.selected]) {
      designMode.unit = new types.Unit(commander.buildBar[buildBar.selected]);
      buildBar.setSpec(buildBar.selected, designMode.partSpec());
      designMode.refreshGrid();
    }
    if (!designMode.unit) {
      designMode.select(buildBar.selected);
      designMode.fresh = false;
    }
    if (sim.galaxyStar && commander.galaxyDifficulty !== "captain" && commander.galaxyDifficulty !== "admiral") {
      designMode.aiEdit = false;
      designMode.showAiTools = false;
    } else {
      designMode.showAiTools = true;
    }
    /*
    if (((ref = sim.galaxyStar) != null ? ref.noDesignTools : void 0) === true) {
      issueInfo();
      finishDesignButton();
      backToGalaxyButton();
      return;
    }
    */
    if (!ui.chatToggle) {
      unitInfo();
      editorButtons();
    }
    buildBar.draw();
    if (!designMode.hideHoverInfo) {
      div(function () {
        var pr;
        position("absolute");
        left(250);
        top(75);
        width(220);
        hoverInfo();
        issueInfo();
      });
    }
    if (designMode.aiEdit) {
      aiEditScreen();
      drawAiParts();
    } else {
      drawParts();
    }
    smallTip();
    if (designMode.showShareBox) {
      shareBox();
    }
    if (designMode.showShareBoxJson) {
      shareBoxJson();
    }
    if (designMode.locked) {
      return lockScreen();
    }
  };

  shareBox = function () {
    return textarea(function () {
      position("absolute");
      top(innerHeight / 2 - 300 / 2);
      left(innerWidth / 2 - 300 / 2);
      padding(20);
      color("white");
      font_size(6);
      width(300);
      height(300);
      background_color("rgba(0,0,0,.8)");
      resize("none");
      text("ship" + btoa(designMode.unit.toSpec()));
      return oninput(function (e) {
        var spec, unit;
        if (e.target.value.slice(0, 4) === "ship") {
          try {
            spec = atob(e.target.value.slice(4));
          } catch (error) {}
          if (spec && spec[0] === "{") {
            unit = new types.Unit(spec);
            if (unit.parts && unit.parts.length > 0) {
              designMode.unit = unit;
              designMode.refresh();
            }
          }
        }
        return designMode.save();
      });
    });
  };

  shareBoxJson = function () {
    div(function () {
      var aiRuleSet, index, j, l, len, len1, results, rule;
      position("absolute");
      top(130);
      bottom(84);
      left(300);
      right(300);
      background("rgba(0,0,0,.7)");
      //padding(50);
      overflow_x("hidden");
      overflow_y("hidden");
      textarea(
        {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          spellcheck: "false",
        },
        function () {
          //position("absolute");
          //top(innerHeight / 2 - 900 / 2);
          //left(innerWidth / 2 - 900 / 2);
          padding(50);
          border("none");
          color("white");
          font_size(14);
          font_family("Consolas, 'Courier New', monospace");
          width("100%");
          height("100%");
          //width(900);
          //height(900);

          //top(130);
          //bottom(84);
          //left(300);
          //right(300);
          background("rgba(0,0,0,.0)");
          //padding(50);

          //background_color("rgba(0,0,0,.8)");
          resize("none");
          text(
            JSON.stringify(JSON.parse(designMode.unit.toSpec()), null, 2)
              .replace(/,(?=[\n])/g, ", ")
              .replace(/(\n {5,}|\n {4,}(?=(\}|\])))/g, "")
              .replace(/ (?=[\n])/g, "")
          );
          return oninput(function (e) {
            var spec, unit;
            try {
              spec = e.target.value;
            } catch (error) {}
            if (spec && spec[0] === "{") {
              unit = new types.Unit(spec);
              if (unit.parts && unit.parts.length > 0) {
                designMode.unit = unit;
                designMode.refresh();
              }
            }
            return designMode.save();
          });
        }
      );
    });
  };

  lockScreen = function () {
    return div(function () {
      position("absolute");
      top(64);
      left(0);
      right(0);
      bottom(84);
      background_color("rgba(0,0,0,.8)");
      return div(function () {
        position("absolute");
        top(200);
        right(0);
        left(0);
        height(100);
        line_height(100);
        background_color("rgba(200,0,0,.6)");
        color("white");
        text_align("center");
        return text("You can't edit ships in 1v1 tournament mode");
      });
    });
  };

  finishDesignButton = function () {
    if (!hasIssue(commander, designMode.unit.spec) && designMode.draggingPart === null) {
      return div(function () {
        var quarterWidth;
        quarterWidth = window.innerWidth / 4;
        position("absolute");
        left(quarterWidth);
        width(quarterWidth * 2);
        top(0);
        height(64);
        overflow("hidden");
        text_align("center");
        background_color("rgba(0,0,0,.6)");
        color("white");
        line_height(64);
        font_size(18);
        return div(".hover-black", function () {
          position("absolute");
          top(0);
          left(0);
          right(0);
          bottom(0);
          onclick(function () {
            return (ui.mode = "battle");
          });
          return text("Click here to start the battle.");
        });
      });
    }
  };

  backToGalaxyButton = function () {
    return div(function () {
      position("absolute");
      top(0);
      left(0);
      return img(
        ".hover-black",
        {
          src: "img/ui/back.png",
          width: 64,
          height: 64,
        },
        function () {
          position("absolute");
          top(0);
          left(0);
          return onclick(function () {
            return ui.go("galaxy");
          });
        }
      );
    });
  };

  smallTip = function () {
    return div("#smalltip", function () {
      position("absolute");
      top(-1000);
      max_width(400);
      background_color("rgba(0,0,0,.6)");
      padding(5);
      color("white");
      if (designMode.smallTip) {
        return raw(designMode.smallTip);
      }
    });
  };

  cell = function (icon, readout, tip) {
    return div(".cell", function () {
      display("inline-block");
      width(90);
      height(20);
      margin("0 10px 10px 0");
      font_size(12);
      line_height(20);
      vertical_align("middle");
      img(
        {
          src: "img/ui/" + icon,
          width: 20,
          height: 20,
        },
        function () {
          display("block");
          float("left");
          return margin_right(10);
        }
      );
      raw(readout);
      return onmouseover(function (e) {
        designMode.smallTipBounds = e.target.getBoundingClientRect();
        return (designMode.smallTip = readout + " " + tip);
      });
    });
  };

  divider = function () {
    return div(function () {
      width("100%");
      height(20);
      return margin_bottom(10);
    });
  };

  divider_small = function () {
    return div(function () {
      width("100%");
      height(10);
      return margin_bottom(5);
    });
  };

  window.unitInfoSmall = function (spec, valid) {
    var u;
    if (valid == null) {
      valid = true;
    }
    u = buildBar.specToUnit(spec);
    if (u.parts.length === 0) {
      div(function () {
        var ref;
        text_align("center");
        if (((ref = commander.selection) != null ? ref.length : void 0) === 1) {
          return text("Click here to copy selected unit");
        } else {
          return text("Click here to design a unit");
        }
      });
      return;
    }
    div(function () {
      text_align("center");
      padding_bottom(15);
      if (!u.name) {
        text("Build Unit");
      } else {
        text(u.name);
      }
      return text(" $" + u.cost);
    });

    var unitCostLimit = sim.costLimit + u.limitBonus;
    var buildCostAccu = Math.ceil(u.cost <= unitCostLimit ? u.cost : u.cost * (0.5 + (0.5 * u.cost) / unitCostLimit));

    cell("cost.png", "$" + buildCostAccu);
    cell("stripes.png", hasIssueUnit(commander, u) === null ? "Valid" : "Invalid");

    cell("dps.png", (16 * u.weaponDPS).toFixed(1) + "dps");
    cell("armor.png", u.hp.toFixed(0) + "HP");
    cell("range.png", u.weaponRange.toFixed(0) + "m");
    cell("speed.png", (u.maxSpeed * 16).toFixed(1) + "m/s");
    cell("arc.png", u.weaponArc + "&deg;");
    cell("turnSpeed.png", (((u.turnSpeed * 16) / Math.PI) * 180).toFixed(1) + "&deg;/s");
    return powerBar(u);
  };

  unitInfo = function () {
    var u;
    u = designMode.unit;
    div(function () {
      position("absolute");
      top(64);
      right(0);
      width(240);
      height(50);
      background_color("rgba(0,0,0,.1)");
      color("#DDD");
      padding(10);
      padding_top(10);
      text_align("right");
      nbsp(3);
      return span(function () {
        font_size(24);
        return text("$" + u.cost);
      });
    });
    div(function () {
      position("absolute");
      top(64 + 50);
      right(0);
      bottom(84);
      width(240);
      background_color("rgba(0,0,0,.4)");
      color("#DDD");
      overflow_x("hidden");
      overflow_y("auto");
      input(
        {
          placeholder: "Name your ship",
          value: designMode.unit.name,
        },
        function () {
          display("block");
          background_color("rgba(0,0,0,.4)");
          border("none");
          width(240);
          padding(10);
          font_size(16);
          color("white");
          return oninput(function (e) {
            designMode.unit.name = e.target.value;
            return designMode.save();
          });
        }
      );
      return div(function () {
        var j, len, ref, results, w;
        padding(10);
        padding_left(20);

        var unitCostLimit = sim.costLimit + u.limitBonus;
        var buildCostAccu = Math.ceil(u.cost <= unitCostLimit ? u.cost : u.cost * (0.5 + (0.5 * u.cost) / unitCostLimit));
        var overnormal = (u.cost > unitCostLimit ? (100 * buildCostAccu) / u.cost : 100).toFixed(2);

        div(function () {
          font_size(10.5);
          color("rgba(255,255,255,.5)");
          text(md5(u.spec));
          onmouseover(function (e) {
            designMode.smallTipBounds = e.target.getBoundingClientRect();
            return (designMode.smallTip = "unit spec md5");
          });
          return margin_bottom(10);
        });
        cell("count.png", u.parts.length, "parts on unit");
        cell("count.png", u.aiRules.length, "ai rules on unit");

        cell("dps.png", (16 * u.weaponDPS).toFixed(1) + "dps", "damage per second from all weapons");
        cell("armor.png", u.hp.toFixed(0) + "HP", "total armor hit points");
        if (u.shield) {
          cell("shield.png", u.shield + "sh", "+ shield hit points");
        }
        cell("range.png", u.weaponRange.toFixed(0) + "m", "max range of weapons");
        cell("speed.png", (u.maxSpeed * 16).toFixed(1) + "m/s", "max unit move speed");
        if (u.jumpDistance) {
          cell("jump.png", u.jumpDistance.toFixed(0) + "m", "jump distance (in meters)");
        }
        cell("turnSpeed.png", (((u.turnSpeed * 16) / Math.PI) * 180).toFixed(1) + "&deg;/s", "turn rate");
        cell("mass.png", u.mass.toFixed(1) + "T", "ship total mass");
        cell("arc360.png", u.radius.toFixed(1) + "m", "ship size");
        // map weapons
        u.burst = 0;
        u.pd_energy = 0;
        u.weapon_energy = 0;
        u.weapons.map((x) => {
          if (x.image === "turHex2.png") u.pd_energy += x.fireEnergy;
          else {
            u.weapon_energy += x.fireEnergy;
            u.burst += x.damage;
          }
        });
        if (u.fireEnergy) {
          divider_small();
          cell("window.png", ((u.weaponDPS * u.hp) / u.cost).toFixed(2) + " brawl ", "value");
          cell("fullscreen.png", (u.burst / u.weapons.length / 10).toFixed(2) + " burst ", "value");
          cell("energyFire.png", u.burst.toFixed(1) + " burst", " dmg");
        }
        divider_small();
        powerBar(u);
        cell("energyGen.png", "+" + (u.genEnergy * 16).toFixed(0) + "E", "energy generated per second");
        cell("energyMove.png", (u.moveEnergy * 16).toFixed(0) + "E", "energy needed to move per second");
        cell("energyStorage.png", u.storeEnergy.toFixed(0) + "E", "battery capacity");
        cell("energyFire.png", (u.fireEnergy * 16).toFixed(0) + "E", "energy needed to fire all weapons per second");
        divider_small();
        // map parts
        u.shield_energy = 0;
        u.cloak_energy = 0;
        u.cloak_count = 0;
        u.jump_energy = 0;
        u.parts.map((x) => {
          switch (x.name) {
            case "Cloak Generator":
              u.cloak_count++;
              u.cloak_energy += x.useEnergy * 16;
              break;
            case "Jump Engine":
              u.jump_energy += x.useEnergy * 16;
              break;
            case "Shield Capacitor":
            case "Advanced Shield Generator":
            case "Heavy Shield Generator":
              u.shield_energy += x.useEnergy * 16;
              break;
          }
        });
        if (u.shield_energy) cell("shield.png", u.shield_energy + "-E", "energy needed to regen shields per second");
        if (u.weapon_energy) cell("damage.png", (u.weapon_energy * 16).toFixed(0) + "-E", "energy needed to fire weapons per second");
        if (u.cloak_energy) cell("cloak.png", u.cloak_energy + "-E", "energy needed to cloak");
        if (u.cloak_count) cell("cloak.png", (u.mass / (168 * u.cloak_count)).toFixed(2) + "s", "time to cloak");

        if (u.jump_energy) cell("jump.png", u.jump_energy + "-E", "energy needed to jump");
        if (u.pd_energy) cell("antiMissle.png", (u.pd_energy * 16).toFixed(0) + "-E", "energy needed to fire all PD per second");
        divider_small();
        u.weapons.sort(function (a, b) {
          return b.dps - a.dps;
        });
        ref = u.weapons;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          w = ref[j];
          div(function () {
            float("right");
            return text("$" + w.cost);
          });
          weaponInfo(w, false);
          results.push(divider());
        }
        return results;
      });
    });
  };

  powerBar = function (u) {
    return div(".cell", function () {
      var firePer, genPer, max, movePer, moveWidth, s, tip, w;
      u.shield_energy = 0;
      u.cloak_energy = 0;
      u.cloak_count = 0;
      u.jump_energy = 0;
      u.parts.map((x) => {
        switch (x.name) {
          case "Cloak Generator":
            u.cloak_count++;
            u.cloak_energy += x.useEnergy;
            break;
          case "Jump Engine":
            u.jump_energy += x.useEnergy;
            break;
          case "Shield Capacitor":
          case "Advanced Shield Generator":
          case "Heavy Shield Generator":
            u.shield_energy += x.useEnergy;
            break;
        }
      });
      position("relative");
      display("inline-block");
      width(200);
      height(20);
      margin("0 10px 10px 0");
      font_size(12);
      line_height(20);
      vertical_align("middle");
      genPer = ((100 * u.genEnergy * 160) / u.storeEnergy).toFixed(1);
      movePer = ((100 * u.moveEnergy * 160) / u.storeEnergy).toFixed(1);
      firePer = ((100 * u.fireEnergy * 160) / u.storeEnergy).toFixed(1);
      shieldPer = ((100 * u.shield_energy * 160) / u.storeEnergy).toFixed(1);
      tip =
        "In 10 seconds: <br>\n" +
        genPer +
        "% will be regenerated <br>\n" +
        movePer +
        "% will be used up while moving <br>\n" +
        firePer +
        "% will be used up while firing <br>\n" +
        shieldPer +
        "% will be used up while regening shield <br>";
      onmouseover(function (e) {
        designMode.smallTipBounds = e.target.getBoundingClientRect();
        return (designMode.smallTip = tip);
      });
      img(
        {
          src: "img/ui/energy.png",
          width: 20,
          height: 20,
        },
        function () {
          display("block");
          float("left");
          return margin_right(10);
        }
      );
      w = 150;
      s = 160;
      max = Math.max(Math.max(s * u.genEnergy, u.storeEnergy), s * u.moveEnergy + s * u.fireEnergy + s * u.shield_energy);
      div(function () {
        position("absolute");
        top(3);
        left(31);
        height(12);
        width(Math.floor((s * w * u.genEnergy) / max));
        return background("#9BBCE2");
      });
      div(function () {
        position("absolute");
        top(2);
        left(30);
        height(14);
        width(Math.floor((w * u.storeEnergy) / max));
        return border("1px solid white");
      });
      moveWidth = Math.floor((s * w * u.moveEnergy) / max) - 5;
      if (moveWidth < 0) {
        moveWidth = 0;
      }
      div(function () {
        position("absolute");
        top(5);
        left(30 + 3);
        height(8);
        width(moveWidth);
        background("#C6EDA0");
        return border("1px solid white");
      });
      div(function () {
        position("absolute");
        top(5);
        left(30 + 5 + Math.max(moveWidth, 2));
        height(8);
        width(Math.floor((s * w * u.fireEnergy) / max) - 4);
        background("#E59090");
        return border("1px solid white");
      });
      fireWidth = Math.floor((s * w * u.fireEnergy) / max) - 5;
      if (fireWidth < 0) {
        fireWidth = 0;
      }
      return div(function () {
        position("absolute");
        top(5);
        left(30 + 7 + Math.max(moveWidth, 2) + Math.max(fireWidth, 2));
        height(8);
        width(Math.floor((s * w * u.shield_energy) / max) - 4);
        background("#FFFFFF");
        return border("1px solid white");
      });
    });
  };

  weaponInfo = function (w, extra) {
    var dps, ref, ref1, rt;
    div(function () {
      font_size(14);
      text(w.name);
      height(20);
      //return margin_bottom(10);
      return margin_bottom(0);
    });
    div(function () {
      font_size(10.5);
      color("rgba(255,255,255,.5)");
      text(w.constructor.name);
      return margin_bottom(0);
    });
    div(function () {
      font_size(10.5);
      color("rgba(255,255,255,.5)");
      text(
        typeof w.pos === "undefined" || typeof w.unit === "undefined"
          ? "Preview"
          : "#" + w.unit.parts.indexOf(w) + " pos: " + w.pos + " dir: " + w.dir + " flip: " + (w.pos[0] < 0 && w.flip ? "-1" : "+1")
      );
      return margin_bottom(extra ? 0 : 10);
    });
    if (extra) {
      div(function () {
        font_size(12);
        margin_bottom(10);
        return text(w.desc);
      });
      cell("armor.png", w.hp + "hp", "- adds hit points");
      cell("mass.png", w.mass.toFixed(1) + "T", "- adds mass");
    }
    rt = Math.max(w.reloadTime, 1);
    dps = w.dps || w.damage / rt;
    cell("dps.png", (16 * dps).toFixed(1) + "dps", "damage per second");
    if ((ref = w.bulletCls) != null ? ref.prototype.hitsMultiple : void 0) {
      cell("multihit.png", "MultiHit", "passes through and hits multiple ships");
    }
    cell("damage.png", w.damage.toFixed(1) + "d", "damage per shot");
    cell("range.png", w.range.toFixed(1) + "m", "weapon range");
    cell("reload.png", (w.reloadTime / 16).toFixed(2) + "s", "reload time");
    cell("energy.png", "-" + w.shotEnergy.toFixed(1) + "E", "energy per shot");
    if (w.fireEnergy) {
      cell("energy.png", "-" + (w.fireEnergy * 16).toFixed(1) + "E", "energy per second");
    }
    if (!w.instant) {
      cell("speed.png", (w.bulletSpeed * 16).toFixed(0) + "m/s", "speed of the projectile");
      cell("speed.png", (w.range / (w.bulletSpeed * 16)).toFixed(2) + "s", "time for projectile to hit max range");
    }
    if (w.aoe) {
      cell("aoe.png", w.aoe + "m", "area of effect");
    }
    if (w.instant) {
      cell("instant.png", "instant", "- instahit weapon");
    }
    if (w.exactRange) {
      cell("exactRange.png", "exact", "timed explosion");
    }
    if ((ref1 = w.bulletCls) != null ? ref1.prototype.missile : void 0) {
      cell("missle.png", "Missile", "- can be shot down by point defence");
    }
    if (w.hitsMissiles) {
      cell("antiMissle.png", "PD", "points defence, can shoot down missiles");
    }
    if (w.energyDamage) {
      cell("energyDamage.png", ((16 * w.energyDamage) / rt).toFixed(1) + "dps", "amount of energy drain per second");
    }
    if (w.energyDamage) {
      cell("energyDamage.png", w.energyDamage.toFixed(1) + "d", "amount of energy drain per shot");
    }
    if (w.dealsBurnDamage) {
      cell("burnDps.png", (16 * dps * w.burnAmount).toFixed(1) + "dps", "burn damage per second");
      cell("burnDamage.png", (w.damage * w.burnAmount).toFixed(1) + "d", "burn damage per shot");
      cell("burnDps.png", "3%", "of burn as damage per second");
    }
    if (w.minRange > 0) {
      return cell("minrange.png", w.minRange.toFixed(1) + "m", "minimum range");
    }
  };

  editorButtons = function () {
    return div(function () {
      var editorButton;
      position("absolute");
      right(260);
      top(80);
      width(620);
      text_align("right");
      color("#DDD");
      padding(0);
      editorButton = function (icon, tip, fn) {
        return div(".hover-black", function () {
          position("relative");
          display("inline-block");
          width(40);
          height(40);
          padding(10);
          if (icon) {
            img(
              {
                src: icon,
                width: 20,
                height: 20,
              },
              function () {
                position("absolute");
                top(10);
                return left(10);
              }
            );
          }
          if (tip) {
            hoverTip(tip);
          }
          return fn();
        });
      };
      if (designMode.clearQ) {
        editorButton(null, null, function () {
          padding("10px 0px");
          width(60);
          text_align("center");
          background("rgba(255,0,0,.2)");
          text("clear");
          return onclick(function () {
            designMode.clear();
            return (designMode.clearQ = false);
          });
        });
        editorButton(null, null, function () {
          padding("10px 0px");
          width(60);
          text_align("center");
          text("cancel");
          return onclick(function () {
            return (designMode.clearQ = false);
          });
        });
        return;
      }
      editorButton("img/ui/topbar/chat.png", "Hide hover info", function () {
        if (designMode.hideHoverInfo) {
          background(hasIssue(commander, designMode.unit.spec) ? "rgba(255,0,0,.2)" : "rgba(0,0,0,.2)");
        }
        return onclick(function () {
          //designMode.hoverTipPart = null;
          designMode.hoverTipParts = [];
          return (designMode.hideHoverInfo = !designMode.hideHoverInfo);
        });
      });
      /*editorButton("img/ui/topbar/chat.png", "Disable bad parts flash", function () {
        if (designMode.disableBadPartsFlash) {
          background(hasIssue(commander, designMode.unit.spec) ? "rgba(255,0,0,.2)" : "rgba(0,0,0,.2)");
        }
        return onclick(function () {
          return (designMode.disableBadPartsFlash = !designMode.disableBadPartsFlash);
        });
      });*/
      editorButton("img/ui/aiRules.png", "AI editor", function () {
        if (designMode.aiEdit) {
          background("rgba(0,0,0,.2)");
        }
        return onclick(function () {
          designMode.tab = null;
          designMode.showShareBox = false;
          designMode.showShareBoxJson = false;
          return (designMode.aiEdit = !designMode.aiEdit);
        });
      });
      if (designMode.advanced_build_tool) {
        editorButton("img/ui/stripes.png", "Hide background", function () {
          if (designMode.hideBackground) {
            background("rgba(0,0,0,.2)");
          }
          return onclick(function () {
            return (designMode.hideBackground = !designMode.hideBackground);
          });
        });
        editorButton("img/ui/build.png", "Allows outside parts placement", function () {
          if (designMode.outsidePartsPlacement) {
            background("rgba(0,0,0,.2)");
          }
          return onclick(function () {
            return (designMode.outsidePartsPlacement = !designMode.outsidePartsPlacement);
          });
        });
        editorButton("img/ui/armor2.png", "Allows overlap parts placement", function () {
          if (designMode.overlapPartsPlacement) {
            background("rgba(0,0,0,.2)");
          }
          return onclick(function () {
            return (designMode.overlapPartsPlacement = !designMode.overlapPartsPlacement);
          });
        });
        editorButton("img/ui/decloak.png", "Show hidden parts", function () {
          if (designMode.showHiddenParts) {
            background("rgba(0,0,0,.2)");
          }
          return onclick(function () {
            return (designMode.showHiddenParts = !designMode.showHiddenParts);
          });
        });
      }
      editorButton("img/ui/symmetry.png", "Symmetry", function () {
        if (designMode.symmetryMode) {
          background("rgba(0,0,0,.2)");
        }
        return onclick(function () {
          return (designMode.symmetryMode = !designMode.symmetryMode);
        });
      });
      editorButton("img/ui/share.png", "Raw spec (base64 shipey)", function () {
        if (designMode.showShareBox) {
          background("rgba(0,0,0,.2)");
        }
        return onclick(function () {
          designMode.showShareBoxJson = false;
          designMode.aiEdit = false;
          return (designMode.showShareBox = !designMode.showShareBox);
        });
      });
      editorButton("img/ui/share.png", "Raw spec (JSON)", function () {
        if (designMode.showShareBoxJson) {
          background("rgba(0,0,0,.2)");
        }
        return onclick(function () {
          designMode.showShareBox = false;
          designMode.aiEdit = false;
          return (designMode.showShareBoxJson = !designMode.showShareBoxJson);
        });
      });
      if (designMode.advanced_build_tool) {
        editorButton("img/ui/delete.png", "Lock", function () {
          if (designMode.manualLocked) {
            background("rgba(255,0,0,.2)");
          }
          return onclick(function () {
            designMode.manualLocked = !designMode.manualLocked;
          });
        });
      }
      return editorButton("img/ui/clear.png", "Delete", function () {
        return onclick(function () {
          return (designMode.clearQ = true);
        });
      });
    });
  };

  window.issueInfo = function () {
    var issue, u, warning;
    u = designMode.unit;
    issue = hasIssue(commander, u.spec);
    var warnings = [];
    if (u.spec.length >= 6) {
      if (intp.serverType === "1v1t" && u.aiRules.length > 0) {
        warnings.push("No AI in 1v1 tournament mode.");
      }
      if (u.storeEnergy !== 0 && u.moveEnergy * 160 > u.storeEnergy) {
        if (u.maxSpeed * 16 > 250) {
          warnings.push("Thrusters using too much energy, remove thrusters.");
        } else {
          warnings.push("Not enough energy for thrusters.");
        }
      }
      if (u.storeEnergy !== 0 && u.fireEnergy * 16 * 2 > u.storeEnergy) {
        warnings.push("Not enough energy for weapons, add batteries.");
      }
      if (u.maxSpeed !== 0 && u.maxSpeed < 5) {
        warnings.push("Movement speed is very slow, reduce weight.");
      }
      if (u.turnSpeed < 0.02) {
        warnings.push("Turn speed is very slow, add wings.");
      }
      if (u.jumpDistance >= u.minJump && u.jumpDistance < 100) {
        warnings.push("Low jump distance.");
      }
    }
    if (issue) {
      div(function () {
        pointer_events("none");
        position("relative");
        //width(300);
        width(220);
        font_size(12);
        margin("0px auto");
        //top(75);
        //text_align("center");
        text_align("left");
        background_color("rgba(255,0,0,.5)");
        color("#EEE");
        padding(10);
        padding_left(15);
        raw(issue);
      });
      //return;
    }
    if (warnings.length > 0) {
      var warning = warnings.join("<br>");
      return div(function () {
        pointer_events("none");
        position("relative");
        //width(300);
        width(220);
        font_size(12);
        margin("0px auto");
        //top(75);
        text_align("center");
        text_align("left");
        background_color("rgba(0, 0, 0, .5)");
        color("white");
        padding(10);
        padding_left(15);
        //return text("Note: ", warning);
        raw(warning);
      });
    }
  };

  hoverInfo = function () {
    var parts = designMode.hoverTipParts;
    if (designMode.draggingPart) {
      parts = [designMode.draggingPart];
    }
    if (parts.length < 1) {
      return;
    }
    if (designMode.aiEdit) {
      return;
    }
    if (designMode.showShareBoxJson) {
      return;
    }
    div("#hoverInfo", function () {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i >= 5) {
          div(function () {
            width(220);
            background_color("rgba(0,0,0,.5)");
            color("#DDD");
            padding(10);
            font_size(14);
            text("... and " + (parts.length - i) + " more.");
          });
          break;
        }
        div(function () {
          var pr;
          //position("absolute");
          //left(250);
          //top(75);
          width(220);
          background_color("rgba(0,0,0,.5)");
          color("#DDD");
          padding(10);
          div(function () {
            float("right");
            return text("$" + part.cost);
          });
          if (part.bulletCls) {
            weaponInfo(part, true);
            return;
          }
          div(function () {
            font_size(14);
            text(part.name);
            height(20);
            //return margin_bottom(10);
            return margin_bottom(0);
          });
          div(function () {
            font_size(10.5);
            color("rgba(255,255,255,.5)");
            text(part.constructor.name);
            return margin_bottom(0);
          });
          div(function () {
            font_size(10.5);
            color("rgba(255,255,255,.5)");
            text(
              typeof part.pos === "undefined" || typeof part.unit === "undefined"
                ? "Preview"
                : "#" + part.unit.parts.indexOf(part) + " pos: " + part.pos + " dir: " + part.dir + " flip: " + (part.pos[0] < 0 && part.flip ? "-1" : "+1")
            );
            return margin_bottom(0);
          });
          div(function () {
            font_size(12);
            margin_bottom(10);
            return text(part.desc);
          });
          if (!part.decal) {
            cell("armor.png", part.hp + "hp", "armor hit points");
            cell("mass.png", part.mass.toFixed(1) + "T", "mass");
          }
          if (part.thrust) {
            cell("speed.png", (part.thrust * 16).toFixed(0) + "kN", "thrust (in kilonewtons)");
          }
          if (part.turnSpeed) {
            cell("turnSpeed.png", ((part.turnSpeed / Math.PI) * 180).toFixed(0) + "&deg;/s", "+ turn speed (slowed down by mass)");
          }
          if (part.jumpCount) {
            cell("jump.png", (part.jumpCount * 500).toFixed(0) + "m", "jump distance (in meters)");
          }
          pr = function (percent) {
            if (percent > 0) {
              return "+" + percent + "%";
            } else {
              return percent + "%";
            }
          };
          if (part.weaponRange) {
            cell("range.png", pr(part.weaponRange), "range");
          }
          if (part.weaponRangeFlat) {
            cell("range.png", "+" + part.weaponRangeFlat + "m", "flat range");
          }
          if (part.weaponDamage) {
            cell("damage.png", pr(part.weaponDamage), "damage per hit");
          }
          if (part.weaponSpeed) {
            cell("speed.png", pr(part.weaponSpeed), "projectile speed");
          }
          if (part.weaponReload) {
            cell("reload.png", pr(part.weaponReload), "reload time");
          }
          if (part.weaponEnergy) {
            cell("energy.png", pr(part.weaponEnergy), "energy usage");
          }
          if (part.adjacent) {
            cell("stripes.png", "-15%", "reduced effectiveness per additional adjacent weapon");
          }
          if (part.genShield) {
            cell("shield.png", "+" + part.genShield * 16 + "sh/s", "recharges shield");
          }
          if (part.shield) {
            cell("shield.png", part.shield + "sh", "+ shield hit points");
          }
          if (part.energyLine) {
            cell("energyStorage.png", part.energyLine * 100 + "%", "energy storage threshold for regeneration");
          }
          if (part.range) {
            cell("range.png", part.range + "m", "range");
          }
          if (part.trasferEnergy) {
            cell("energy.png", "-" + part.trasferEnergy * 16 + "E/s", "amount transfer per second per ship");
          }
          if (part.slow) {
            cell("speed.png", "-" + part.slow * 20 + "%", "Slows down ships in range");
            cell("decloak.png", "Decloaks", "units in range");
          }
          if (part.genCloak) {
            cell("cloak.png", "+" + part.genCloak * 16 * 2 + "T/s", "mass cloaked per second");
            cell("cloakMass.png", part.genCloak * 16 * 5 + "T", "while moving");
          }
          if (part.explodes) {
            if (part.damage) {
              cell("damage.png", part.damage + "d", "damage per explosion");
            }
            if (part.aoe) {
              cell("range.png", part.aoe + "m", "area of effect");
            }
            if (part.energyDamage) {
              cell("energyDamage.png", part.energyDamage + "d", "amount of energy drain per explosion");
            }
          }
          if (part.genEnergy) {
            cell("energyGen.png", "+" + part.genEnergy * 16 + "E", "generates energy");
          }
          if (part.storeEnergy) {
            cell("energyStorage.png", part.storeEnergy + "E", "stores energy");
          }
          if (part.useEnergy) {
            cell("energy.png", "-" + part.useEnergy * 16 + "E/s", "uses energy");
          }
          if (part.arc) {
            cell("arc.png", part.arc + "°", "firing arc");
          }
          if (part.rangeBuffMul) {
            cell("range.png", pr(-100 + part.rangeBuffMul * 100), "range");
          }
          if (part.burnAmount) {
            cell("burnDamage.png", (part.damage * part.burnAmount).toFixed(1) + "d", "burn damage per warhead");
            return cell("burnDps.png", "3%", "of burn as damage per second");
          }
        });
      }
    });
  };

  has = function (a, b) {
    if (a && b) {
      return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
    }
  };

  drawParts = function () {
    var minParts, p, totalParts;
    minParts = 3 * 8;
    if (sim.galaxyStar) {
      totalParts = 0;
      for (p in galaxyMode.unlockedParts) {
        totalParts += 1;
      }
    } else {
      totalParts = 100;
    }
    div("#partTabs", function () {
      position("absolute");
      top(64);
      left(0);
      width(240);
      color("#DDD");
      height(100);
      if (totalParts > minParts) {
        div(function () {
          drawTab("weapons", "dps.png");
          drawTab("energy", "energy.png");
          drawTab("armor1", "armor.png");
          drawTab("armor2", "armor3.png");
          return drawTab("armor3", "armor2.png");
        });
        return div(function () {
          drawTab("engines", "speed.png");
          drawTab("defence", "minrange.png");
          drawTab("decal", "decals.png");
          drawTab("letters", "letters.png");
          return drawTab("stripes", "stripes.png");
        });
      }
    });
    return div("#partArea", function () {
      var clsName, part, results;
      position("absolute");
      top(64 + 100);
      left(0);
      bottom(84);
      width(240);
      background_color("rgba(0,0,0,.4)");
      padding(10);
      overflow_y("auto");
      results = [];
      for (clsName in parts) {
        part = parts[clsName];
        if (totalParts > minParts) {
          if (part.prototype.tab !== designMode.tab) {
            continue;
          }
        }
        results.push(drawPart(clsName, part));
      }
      return results;
    });
  };

  drawAiParts = function () {
    div(function () {
      position("absolute");
      top(64);
      height(50);
      left(0);
      width(240);
      color("#DDD");
      drawTab("energy", "build.png");
      drawTab("engines", "movement.png");
      drawTab("weapons", "offence.png");
      return drawTab("armor", "defence.png");
    });
    return div(function () {
      var j, len, results, rule, rules;
      position("absolute");
      top(64 + 50);
      bottom(84);
      left(0);
      width(240);
      background_color("rgba(0,0,0,.4)");
      padding(10);
      overflow_y("auto");
      if (allAiRules[designMode.tab] == null) {
        designMode.tab = "energy";
      }
      rules = allAiRules[designMode.tab];
      results = [];
      for (j = 0, len = rules.length; j < len; j++) {
        rule = rules[j];
        results.push(drawAddRule(rule));
      }
      return results;
    });
  };

  drawAddRule = function (rule) {
    return div(function () {
      background_color("rgba(0,0,0,.4)");
      margin(5);
      return div(".hover-black", function () {
        var count, i, j, len, part, parts, rule_text;
        padding(5);
        color("white");
        rule_text = ais.isInvalidRule(rule) ? "invalid" : rule[0];
        parts = rule_text.split(/([\#\?\*]|\@\w+)/);
        count = 1;
        for (i = j = 0, len = parts.length; j < len; i = ++j) {
          part = parts[i];
          if (part === "#" || part === "?" || part === "*" || part[0] === "@") {
            span(function () {
              text(rule[count]);
              padding("1px 2px 1px 2px");
              border("1px solid #f39c12");
              background("rgba(0,0,0,.4)");
              color("#f39c12");
              return font_size(12);
            });
            count += 1;
          } else {
            span(function () {
              return text(part);
            });
          }
        }
        return onclick(function () {
          if (!designMode.unit.aiRules) {
            designMode.unit.aiRules = [];
          }
          designMode.unit.aiRules.push(
            (function (func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor(),
                result = func.apply(child, args);
              return Object(result) === result ? result : child;
            })(Array, rule, function () {})
          );
          return designMode.save();
        });
      });
    });
  };

  drawTab = function (name, pic) {
    return div(function () {
      position("relative");
      display("inline-block");
      width(48);
      height(50);
      background_color("rgba(0,0,0,.4)");
      img(
        {
          src: "img/ui/" + pic,
          width: 20,
          height: 20,
        },
        function () {
          return margin("15px 14px 0px 14px");
        }
      );
      if (designMode.tab !== name) {
        opacity(".3");
      }
      return onclick(function () {
        return (designMode.tab = name);
      });
    });
  };

  drawPart = function (clsName, part) {
    if (!designMode.showHiddenParts) {
      if (part.prototype.hide || part.prototype.disable) {
        return;
      }
      if (part.prototype.faction && part.prototype.faction !== commander.faction) {
        return;
      }
    }
    return div(".unitpic", function () {
      var image, j, len, ref, unlockName;
      position("relative");
      display("inline-block");
      width(52 + 16);
      height(52 + 16);
      margin(0);
      border_radius(5);
      overflow("hidden");
      if (sim.galaxyStar) {
        if (galaxyMode.justWon) {
          ref = galaxyMode.justWon.unlocks;
          for (j = 0, len = ref.length; j < len; j++) {
            unlockName = ref[j];
            if (clsName === unlockName) {
              animation("innerGlowPulse 1.2s infinite");
              animation_direction("alternate");
              div(function () {
                width(70);
                position("absolute");
                right(-23);
                top(5);
                text_align("center");
                transform("rotate(45deg)");
                font_size(12);
                color("white");
                background_color("red");
                return text("new");
              });
            }
          }
        }
      }
      image = partThumb(part);
      background_image("url('" + image + "')");
      background_size(52 + 16);
      background_position("center");
      background_repeat("no-repeat");
      onmouseover(function (e) {
        return (designMode.hoverTipParts = [part.prototype]);
      });
      return onmousedown(function (e) {
        designMode.draggingPart = new part();
        designMode.draggingPart.unit = designMode.dragUnit;
        v2.set(designMode.pos, designMode.draggingPart.worldPos);
        v2.set(designMode.pos, designMode.draggingPart.pos);
        designMode.dragUnit.parts = [designMode.draggingPart];
        return e.preventDefault();
      });
    });
  };

  isBuildRule = function (rule) {
    if (ais.isInvalidRule(rule)) {
      return false;
    }
    var j, len, r, ref;
    ref = allAiRules["energy"];
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      if (r[0] === rule[0]) {
        return true;
      }
    }
    return false;
  };

  aiEditScreen = function () {
    return div("#unitAiRules" + buildBar.selected, function () {
      var aiRuleSet, index, j, l, len, len1, results, rule;
      position("absolute");
      top(130);
      bottom(84);
      left(300);
      right(300);
      background("rgba(0,0,0,.7)");
      padding(50);
      overflow_y("auto");
      aiRuleSet = designMode.unit.aiRules;
      if (aiRuleSet.length > 0) {
        for (index = j = 0, len = aiRuleSet.length; j < len; index = ++j) {
          rule = aiRuleSet[index];
          if (!isBuildRule(rule)) {
            drawRule(rule, index);
          }
        }
        div(function () {
          return height(20);
        });
        results = [];
        for (index = l = 0, len1 = aiRuleSet.length; l < len1; index = ++l) {
          rule = aiRuleSet[index];
          if (isBuildRule(rule)) {
            results.push(drawRule(rule, index));
          } else {
            results.push(void 0);
          }
        }
        return results;
      } else {
        return div(function () {
          color("gray");
          return text("no rules yet, add some rules from the side");
        });
      }
    });
  };

  drawRuleNumber = function (rule, index, count) {
    return input(
      {
        type: "text",
        value: rule[count],
      },
      function () {
        display("inline-block");
        padding("2px 4px 2px 4px");
        border("1px solid #f39c12");
        background("rgba(0,0,0,.4)");
        color("#f39c12");
        font_size(16);
        text_align("center");
        line_height(20);
        width(60);
        vertical_align("baseline");
        return oninput(function (e) {
          rule[count] = parseInt(e.target.value);
          return designMode.save();
        });
      }
    );
  };

  drawRuleDD = function (rule, index, count, options, w) {
    return div(function () {
      var j, len, type;
      display("inline-block");
      padding("3px 4px 1px 4px");
      border("1px solid #f39c12");
      background("rgba(0,0,0,.4)");
      color("#f39c12");
      font_size(16);
      line_height(20);
      vertical_align("baseline");
      for (j = 0, len = options.length; j < len; j++) {
        type = options[j];
        if (type.toLowerCase() === rule[count].toLowerCase()) {
          text(type);
        }
      }
      return onclick(function (e) {
        return (ui.rmenu = {
          id: rid(),
          pos: [e.clientX, e.clientY],
          html: function () {
            var l, len1, results;
            results = [];
            for (l = 0, len1 = options.length; l < len1; l++) {
              type = options[l];
              results.push(
                (function (type) {
                  return div(".hover-red", function () {
                    padding("4px 8px");
                    text(type);
                    return onmousedown(function () {
                      var ddopen;
                      rule[count] = type;
                      designMode.save();
                      return (ddopen = null);
                    });
                  });
                })(type)
              );
            }
            return results;
          },
        });
      });
    });
  };

  drawRule = function (rule, index) {
    var aiRuleSet;
    aiRuleSet = designMode.unit.aiRules;
    return div(function () {
      var count, i, j, len, part, parts, rule_text;
      position("relative");
      background("rgba(0,0,0,.4)");
      padding("5px 10px");
      color("white");
      margin(10);
      padding_left(40);
      padding_right(40);
      min_height(40);
      line_height(36);
      vertical_align("baseline");
      rule_text = ais.isInvalidRule(rule) ? "invalid" : rule[0];
      if (!ais.goodRule(rule)) {
        background_color("rgba(255,0,0,.5)");
      }
      if (rule_text === "Code Block") {
        textarea(function () {
          border("none");
          background("rgba(0,0,0,.4)");
          padding(4);
          font_family("monospace");
          font_size(14);
          color("white");
          width("100%");
          height(200);
          return text(rule[1]);
        });
      } else {
        parts = rule_text.split(/(\#|\@\w+)/);
        count = 1;
        for (i = j = 0, len = parts.length; j < len; i = ++j) {
          part = parts[i];
          if (part === "#") {
            drawRuleNumber(rule, index, count);
            count += 1;
          } else if (part[0] === "@") {
            drawRuleDD(rule, index, count, ais[part.slice(1)] ?? [], 120);
            count += 1;
          } else {
            span(function () {
              return text(part);
            });
          }
        }
      }
      img(
        ".hover-fade",
        {
          src: "img/ui/upVote.png",
          width: 14,
          height: 14,
        },
        function () {
          position("absolute");
          top(4);
          left(10);
          return onclick(function () {
            if (index > 0) {
              aiRuleSet.splice(index, 0, aiRuleSet.splice(index - 1, 1)[0]);
              return designMode.save();
            }
          });
        }
      );
      img(
        ".hover-fade",
        {
          src: "img/ui/downVote.png",
          width: 14,
          height: 14,
        },
        function () {
          position("absolute");
          bottom(4);
          left(10);
          return onclick(function () {
            if (index < aiRuleSet.length - 1) {
              aiRuleSet.splice(index, 0, aiRuleSet.splice(index + 1, 1)[0]);
              return designMode.save();
            }
          });
        }
      );
      return img(
        ".hover-fade",
        {
          src: "img/ui/delete.png",
          width: 28,
          height: 28,
        },
        function () {
          position("absolute");
          top(6);
          right(6);
          return onclick(function () {
            aiRuleSet.splice(index, 1);
            return designMode.save();
          });
        }
      );
    });
  };
}.call(this));
