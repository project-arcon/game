window.editorUI_Hook = window.editorUI_Hook || {
  editorUI: window.editorUI,
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

(function () {
  eval(onecup["import"]());

  statsForNerds = false;
  ui.confirms = {
    rotateParts: false,
  };

  flip = function () {
    let unit = JSON.parse(commander.buildBar[buildBar.selected]),
      i;
    for (i = 0; i < unit.parts.length; i++) if (parts[unit.parts[i].type].prototype.canRotate) unit.parts[i].dir = -1e31;
    return (commander.buildBar[buildBar.selected] = JSON.stringify(unit));
  };

  hoverTip = function (message) {
    return onmouseover(function (e) {
      designMode.smallTipBounds = e.target.getBoundingClientRect();
      return (designMode.smallTip = message);
    });
  };

  ui.smallTip = function () {
    return div("#smalltip", function () {
      position("absolute");
      top(-1000);
      max_width(401);
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

  ui.confirm = function (fn, togglefn) {
    return div(function () {
      position("absolute");
      top(200);
      width(200);
      left("50%");
      transform("translate(-50%, 0)");
      color("white");
      overflow("hidden");
      text_align("center");
      padding(20);
      z_index("100");
      background_color("rgba(0,0,0,.4)");
      div(function () {
        background_color("rgba(160,0,0,.6)");
        margin(10);
        padding(10);
        text("close");
        return onclick(function () {
          togglefn();
        });
      });
      return div(function () {
        background_color("rgba(0,160,0,.6)");
        margin(10);
        padding(10);
        text("confirm");
        return onclick(function () {
          togglefn();
          return fn();
        });
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
      width(220);
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

  ui.weaponInfo = function (w, extra) {
    var dps, ref, ref1, rt;
    div(function () {
      font_size(14);
      text(w.name);
      height(20);
      return margin_bottom(10);
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

    cell("energy.png", ((w.shotEnergy / w.damage) * 100).toFixed(0) + "e/d", "energy per 100dmg");

    cell("range.png", w.range.toFixed(1) + "m", "weapon range");
    cell("reload.png", (w.reloadTime / 16).toFixed(2) + "s", "reload time");
    cell("energy.png", "-" + w.shotEnergy.toFixed(1) + "-E", "energy per shot");
    if (w.fireEnergy) {
      cell("energy.png", "-" + (w.fireEnergy * 16).toFixed(1) + "-E", "energy per second");
    }
    if (!w.instant) {
      cell("speed.png", (w.bulletSpeed * 16).toFixed(0) + "m/s", "speed of the projectile");
      cell("speed.png", w.projectileSpeed.toFixed(2) + "s", "time for projectile to hit max range");
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

  ui.editorButtons = function () {
    after(() => {
      const e = onecup.lookup('[style="position:relative;display:inline-block;width:40px;height:40px;padding:10px"')[0]?.parentElement;
      if (e) e.style.display = "none";
    });

    return div(function () {
      var editorButton;
      position("absolute");
      right(260);
      top(80);
      width(620.01);
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
                src: "img/ui/" + icon,
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
      if (designMode.showAiTools) {
        editorButton("ai.png", "AI mode", function () {
          if (localStorage.useAi === "true") {
            background("rgba(255,0,0,.2)");
          }
          return onclick(function () {
            if (localStorage.useAi !== "true") {
              localStorage.useAi = "true";
            } else {
              localStorage.useAi = "false";
              designMode.aiEdit = false;
            }
            return designMode.save();
          });
        });
        if (localStorage.useAi === "true") {
          editorButton("aiRules.png", "AI editor", function () {
            if (designMode.aiEdit) {
              background("rgba(0,0,0,.2)");
            }
            return onclick(function () {
              return (designMode.aiEdit = !designMode.aiEdit);
            });
          });
          if (intp.local) {
            editorButton("aiBubbles.png", "AI debugging bubbles", function () {
              if (localStorage.aiGrid === "true") {
                background("rgba(0,0,0,.2)");
              }
              return onclick(function () {
                if (localStorage.aiGrid !== "true") {
                  return (localStorage.aiGrid = "true");
                } else {
                  return (localStorage.aiGrid = "false");
                }
              });
            });
          }
        }
      }
      if (account.hasDLCBonus()) {
        editorButton("reload.png", "Rota parts", function () {
          if (ui.confirms.rotateParts) {
            background("rgba(0,0,0,.2)");
          }
          return onclick(function () {
            return (ui.confirms.rotateParts = !ui.confirms.rotateParts);
          });
        });
      }
      editorButton("symmetry.png", "Symmetry", function () {
        if (designMode.symmetryMode) {
          background("rgba(0,0,0,.2)");
        }
        return onclick(function () {
          return (designMode.symmetryMode = !designMode.symmetryMode);
        });
      });
      editorButton("share.png", "Share", function () {
        if (designMode.showShareBox) {
          background("rgba(0,0,0,.2)");
        }
        return onclick(function () {
          return (designMode.showShareBox = !designMode.showShareBox);
        });
      });
      return editorButton("clear.png", "Delete", function () {
        return onclick(function () {
          return (designMode.clearQ = true);
        });
      });
    });
  };

  ui.unitInfo = function () {
    after(() => {
      let e = onecup.lookup('[placeholder="Name your ship"]')[0]?.parentElement;
      if (e) e.style.display = "none";
      else e = onecup.lookup('[style="display:block;background-color:rgba(0,0,0,.4);border:none;width:240px;padding:10px;font-size:16px;color:rgba(255,255,255,.1)"]')[0]?.parentElement;
      if (e) e.style.display = "none";
    });

    div(function () {
      var u;
      u = designMode.unit;
      return div("#unitInfo", function () {
        position("absolute");
        top(64 + 50);
        right(0);
        bottom(84);
        width(240);
        background_color("rgba(0,0,0,.4)");
        color("#DDD");
        overflow_y("auto");

        div(function () {
          img(
            {
              src: "img/ui/range.png",
              width: 20,
              height: 20,
            },
            function () {
              display("block");
              float("left");
              return margin_right(10);
            }
          );

          padding(5);
          if (statsForNerds) background_color("rgba(255,255,255,.2)");
          else background_color("rgba(0,0,0,.2)");

          text("stats for nerds");
          return onclick(function () {
            statsForNerds = !statsForNerds;
          });
        });

        input(
          {
            placeholder: "ship name",
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
          padding(10.01);
          padding_left(20);

          cell("dps.png", (16 * u.weaponDPS).toFixed(1) + "dps", "damage per second from all weapons");
          cell("armor.png", u.hp.toFixed(0) + "HP", "total armor hit points");
          if (u.shield && !designMode.showHitBox) cell("shield.png", u.shield + "sh", "+ shield hit points");
          if (u.shield && designMode.showHitBox && u.maxShield > 1) {
            u.maxShield -= 1;
            cell("shield.png", u.shield + "sh", "+ shield hit points");
          }
          cell("range.png", u.weaponRange.toFixed(0) + "m", "max range of weapons");
          cell("speed.png", (u.maxSpeed * 16).toFixed(1) + "m/s", "max unit move speed");
          if (u.jumpDistance) cell("jump.png", u.jumpDistance.toFixed(0) + "m", "jump distance (in meters)");
          cell("turnSpeed.png", (((u.turnSpeed * 16) / Math.PI) * 180).toFixed(1) + "&deg;/s", "turn rate");
          cell("mass.png", u.mass.toFixed(1) + "T", "ship total mass");
          cell("arc360.png", u.radius.toFixed(3) + "m", "ship size");
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
            divider_small();
          }
          powerBar(u);
          divider_small();

          cell("energyGen.png", "+" + (u.genEnergy * 16).toFixed(0) + "-E", "energy generated per second");
          cell("energyMove.png", (u.moveEnergy * 16).toFixed(0) + "-E", "energy needed to move per second");
          cell("energyStorage.png", u.storeEnergy.toFixed(0) + "-E", "battery capacity");
          cell("energyFire.png", (u.fireEnergy * 16).toFixed(0) + "-E", "energy needed to fire all weapons per second");

          divider();
          u.weapons.sort(function (a, b) {
            return b.dps - a.dps;
          });
          ref = u.weapons;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            w = ref[j];
            ui.weaponInfo(w, false);
            results.push(divider());
          }
          return results;
        });
      });
    });
  };

  ui.statsForNerds = function () {
    div(function () {
      var u;
      u = designMode.unit;
      return div("#statsForNerds", function () {
        position("absolute");

        top(186);
        left("50%");
        transform("translate(-50%, 0)");

        width(330);
        height(80);

        background("rgba(0,0,0,.5)");
        //border_radius('0px 0px 10px 10px');
        color("white");
        return div(function () {
          padding(10);
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
          if (u.weapon_energy) cell("damage.png", (u.weapon_energy * 16).toFixed(0) + "-E", "energy needed to fire weapons");
          if (u.cloak_energy) cell("cloak.png", u.cloak_energy + "-E", "energy needed to cloak");
          if (u.cloak_count) cell("cloak.png", (u.mass / (168 * u.cloak_count)).toFixed(2) + "s", "time to cloak");

          if (u.jump_energy) cell("jump.png", u.jump_energy + "-E", "energy needed to jump");
          if (u.pd_energy) cell("antiMissle.png", (u.pd_energy * 16).toFixed(0) + "-E", "energy needed to fire all PD");
        });
      });
    });
  };

  window.editorUI = () => {
    window.editorUI_Hook.editorUI();
    ui.editorButtons();
    ui.unitInfo();
    if (statsForNerds) ui.statsForNerds();
    if (ui.confirms.rotateParts) {
      ui.confirm(flip, function toggle() {
        ui.confirms.rotateParts = !ui.confirms.rotateParts;
      });
    }

    after(() => {
      const e = onecup.lookup('[id="smalltip"]')[0];
      if (e?.style.maxWidth == "400px" && e?.style.display == "") e.style.display = "none";
    });

    ui.smallTip();

    tip = onecup.lookup('[id="smalltip"]')[1];
    if (tip != null && designMode.uiMouse) {
      x = designMode.uiMouse[0];
      y = designMode.uiMouse[1];
      if (!designMode.smallTip) {
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
}.call(this));
