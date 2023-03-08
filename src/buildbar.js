// here begin src/buildbar.js
(function () {
  var drawBuildButton, info, lastInfoTime, leftMenu, rightMenu, specToUnitMap, standAlone;

  eval(onecup["import"]());

  window.buildBar = {};

  buildBar.selected = 0;

  css(".unitpic", function () {
    width(84);
    height(84);
    padding(10);
    return transition("background-color .2s");
  });

  css(".unitpic:hover", function () {
    return background_color("rgba(255,255,255,.4)");
  });

  standAlone = function () {
    return ui.path[0] === "design" || ui.path[0] === "fleet";
  };

  ui.topButton = function (mode, fn, icon) {
    if (!icon) icon = mode;
    return div(".hover-black", function () {
      display("inline-block");
      height(64);
      width(64);
      position("relative");
      img(
        {
          src: "img/ui/topbar/" + icon + ".png",
          width: 44,
          height: 44,
        },
        function () {
          top(0);
          left(10);
          return position("absolute");
        }
      );
      div(function () {
        position("absolute");
        line_height(12);
        font_size(12);
        text_align("center");
        width(64);
        top(44);
        return text(mode);
      });
      if (fn != null) {
        return fn();
      } else {
        if (ui.mode === mode) {
          background_color("rgba(255,255,255,.6)");
          return onclick(function () {
            return ui.go("battle");
          });
        } else {
          return onclick(function () {
            return ui.go(mode);
          });
        }
      }
    });
  };

  ui.barButton = function (mode) {
    height(84);
    width(84);
    if (mode === ui.mode) {
      background_color("rgba(255,255,255,.6)");
      onclick(function () {
        return ui.go("battle");
      });
    } else {
      onclick(function () {
        return ui.go(mode);
      });
    }
    img(
      {
        src: "img/ui/" + mode + ".png",
        width: 64,
        height: 64,
      },
      function () {
        position("absolute");
        top(0);
        return left(10);
      }
    );
    return div(function () {
      position("absolute");
      line_height(12);
      font_size(12);
      text_align("center");
      width(84);
      top(59);
      color("white");
      return text(mode);
    });
  };

  leftMenu = function () {
    ui.topButton("menu");
    if (!sim.galaxyStar) {
      ui.topButton("multiplayer");
      return ui.topButton("battleroom");
    }
  };

  rightMenu = function () {
    if (sim.galaxyStar != null) {
      ui.topButton("restart", function () {
        return onclick(function () {
          return (ui.mode = "restart");
        });
      });
    } else {
      ui.topButton(
        "reconnect",
        function () {
          return onclick(function () {
            return battleMode.rejoinServer();
          });
        },
        "restart"
      );
    }
    ui.topButton("chat", function () {
      if (ui.chatToggle) {
        background_color("rgba(255,255,255,.6)");
      }
      return onclick(function () {
        return (ui.chatToggle = !ui.chatToggle);
      });
    });
    return ui.topButton("controls", function () {
      if (ui.contorlHelpToggle) {
        background_color("rgba(255,255,255,.6)");
      }
      return onclick(function () {
        return (ui.contorlHelpToggle = !ui.contorlHelpToggle);
      });
    });
  };

  buildBar.draw = function (folded) {
    if (folded == null) {
      folded = false;
    }
    if (!commander || !commander.buildBar) {
      return;
    }
    div(function () {
      position("absolute");
      if (folded) {
        top(-64 - 48);
      } else {
        top(0);
      }
      left(0);
      right(0);
      height(64);
      if (intp.serverType === "1v1r" || intp.serverType === "1v1t") {
        background_color("rgba(100,0,0,.6)");
      } else {
        background_color("rgba(0,0,0,.6)");
      }
      color("white");
      line_height(64);
      font_size(18);
      div(function () {
        position("absolute");
        left(0);
        width(300);
        return leftMenu();
      });
      div(".hover-black", function () {
        var quarterWidth, ref;
        quarterWidth = window.innerWidth / 4;
        position("absolute");
        left(quarterWidth);
        width(quarterWidth * 2);
        height(64);
        overflow("hidden");
        text_align("center");
        if (((ref = sim.galaxyStar) != null ? ref.hasDesignCriteria : void 0) && galaxyMap.designMeetsCriteria === false && ui.mode === "design") {
          return;
        }
        onclick(function () {
          if (ui.mode !== "battle") {
            return (ui.mode = "battle");
          } else {
            return (ui.mode = "quickscore");
          }
        });
        if (sim.galaxyStar && ui.mode !== "battle") {
          if (sim.step < 16) {
            return text("Click here to start the battle.");
          } else {
            return text("Click here to return to the battle.");
          }
        } else if (intp.countDown > 15) {
          font_size(30);
          return text(Math.floor(intp.countDown / 16));
        } else {
          return ui.topPlayers();
        }
      });
      return div(function () {
        position("absolute");
        right(0);
        width(300);
        text_align("right");
        return rightMenu();
      });
    });
    div(function () {
      var i, j, ref, showDesign;
      position("absolute");
      if (folded) {
        bottom(-84 - 48);
      } else {
        bottom(0);
      }
      left(0);
      right(0);
      height(84);
      background_color("rgba(0,0,0,.2)");
      text_align("center");
      for (i = j = 0; j < 10; i = ++j) {
        drawBuildButton(i);
      }
      showDesign = true;
      if ((ref = sim.galaxyStar) != null ? ref.noDesignTools : void 0) {
        showDesign = false;
      }
      if (showDesign) {
        div(".hover-black", function () {
          position("absolute");
          top(0);
          left(0);
          return ui.barButton("design");
        });
        div(".hover-black", function () {
          position("absolute");
          top(0);
          right(0);
          return ui.barButton("fleet");
        });
      }
      if (ui.mode === "battle") {
        return div("#action-bar", function () {
          var c, miniButton;
          position("absolute");
          left(0);
          right(0);
          bottom(84);
          height(42);
          background_color("rgba(0,0,0,.1)");
          c = Math.floor(window.innerWidth / 2);
          div(function () {
            position("absolute");
            bottom(0);
            left(c - 80);
            right(c - 80);
            line_height(42);
            color("rgba(240, 240, 240, 1)");
            span("#money-text", function () {
              return font_size(24);
            });
            span("#money-income", function () {
              font_size(14);
              vertical_align("super");
              return margin_left(10);
            });
            return onecup.post_render(
              (function (_this) {
                return function () {
                  var ref1, ref2;
                  if ((ref1 = onecup.lookup("#money-text")) != null) {
                    ref1.innerHTML = buildBar.moneyText();
                  }
                  return (ref2 = onecup.lookup("#money-income")) != null ? (ref2.innerHTML = buildBar.moneyIncomeText()) : void 0;
                };
              })(this)
            );
          });
          miniButton = function (name, binding, fn, hidebound) {
            return div(".hover-black", function () {
              position("absolute");
              top(0);
              bottom(0);
              height(42);
              width(42);
              left(84);
              padding(5);
              img({
                src: "img/ui/actions/" + name + ".png",
                width: 32,
                height: 32,
              });
              onmouseover(function (e) {
                battleMode.tipBounds = e.target.getBoundingClientRect();
                return (battleMode.tip = function () {
                  text_align("center");
                  text(binding);
                  text(" ");
                  if (!hidebound) {
                    span(function () {
                      color("#f39c12");
                      return text(settings.humanViewBinding(binding));
                    });
                  }
                });
              });
              return fn();
            });
          };
          miniButton(
            "../ai",
            "AI mode",
            function () {
              top(0);
              left(c - 434);
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
                control.savePlayer();
              });
            },
            true
          );
          miniButton(
            "../aiBubbles",
            "Units bubbles",
            function () {
              top(0);
              left(c - 392);
              if (localStorage.aiGrid === "true") {
                background("rgba(255,0,0,.2)");
              }
              return onclick(function () {
                if (localStorage.aiGrid !== "true") {
                  return (localStorage.aiGrid = "true");
                } else {
                  return (localStorage.aiGrid = "false");
                }
              });
            },
            true
          );
          /*
          miniButton(
            "../decloak",
            "Hide cursor",
            function () {
              top(0);
              left(c - 350);
              if (localStorage.hideCursor === "true") {
                background("rgba(255,0,0,.2)");
              }
              onclick(function () {
                if (localStorage.hideCursor !== "true") {
                  localStorage.hideCursor = "true";
                  if (typeof network !== "undefined" && network !== null) {
                    network.send("mouseMove", [0, 0], false);
                  }
                } else {
                  localStorage.hideCursor = "false";
                }
              });
            },
            true
          );
          miniButton(
            "../range",
            "Draw range",
            function () {
              top(0);
              left(c - 308);
              if (localStorage.drawRanges === "true") {
                background("rgba(255,0,0,.2)");
              }
              return onclick(function () {
                if (localStorage.drawRanges !== "true") {
                  return (localStorage.drawRanges = "true");
                } else {
                  return (localStorage.drawRanges = "false");
                }
              });
            },
            true
          );
          miniButton(
            "../energyStorage",
            "Server performance info",
            function () {
              top(0);
              left(c - 266);
              if (control.perfServer) {
                background("rgba(255,0,0,.2)");
              }
              return onclick(function () {
                control.perfServer = !control.perfServer;
              });
            },
            true
          );
          */
          miniButton(
            localStorage.mute === "true" ? "../unmute" : "../mute",
            "Mute",
            function () {
              top(0);
              left(c - 224);
              if (localStorage.mute === "true") {
                background("rgba(255,0,0,.2)");
              }
              return onclick(function () {
                actionMixer.action = 0;
                if (localStorage.mute !== "true") {
                  localStorage.mute = "true";
                } else {
                  localStorage.mute = "false";
                }
              });
            },
            true
          );
          miniButton(
            "../window",
            "Reset camera",
            function () {
              top(0);
              left(c - 182);
              return onclick(function () {
                Interpolator.prototype.focusMap();
              });
            },
            true
          );
          miniButton(
            "../swap",
            "Switch side",
            function () {
              top(0);
              left(c - 140);
              return onclick(function () {
                network.send("switchSide", commander.side !== "alpha" ? "alpha" : "beta");
              });
            },
            true
          );
          /*
            miniButton("../topbar/restart", "Reconnect", function() {
              top(0);
              left(c - 140);
              if (ui.rejoinServerOn) {
                background("rgba(255,0,0,.5)");
              }
              onclick(function() {
                ui.rejoinServerOn = !ui.rejoinServerOn;
                return setTimeout((function() {
                  return ui.rejoinServerOn = false;
                }), 200);
              });
              return ondblclick(function() {
                battleMode.rejoinServer();
                return ui.rejoinServerOn = false;
              });
            },true);
            */

          miniButton(
            "../delete",
            "Clear build queue",
            function () {
              top(0);
              left(c + 140 - 42);
              if (ui.clearBuildOn) {
                background("rgba(255,0,0,.5)");
              }
              onclick(function () {
                ui.clearBuildOn = !ui.clearBuildOn;
                return setTimeout(function () {
                  return (ui.clearBuildOn = false);
                }, 200);
              });
              return ondblclick(function () {
                network.send("buildRq", 0, -Infinity);
                network.send("buildRq", 1, -Infinity);
                network.send("buildRq", 2, -Infinity);
                network.send("buildRq", 3, -Infinity);
                network.send("buildRq", 4, -Infinity);
                network.send("buildRq", 5, -Infinity);
                network.send("buildRq", 6, -Infinity);
                network.send("buildRq", 7, -Infinity);
                network.send("buildRq", 8, -Infinity);
                network.send("buildRq", 9, -Infinity);
                return (ui.clearBuildOn = false);
              });
            },
            true
          );
          miniButton("selfd", "Self Destruct", function () {
            top(0);
            left(c + 182 - 42);
            if (ui.selfdOn) {
              background("rgba(255,0,0,.5)");
            }
            onclick(function () {
              ui.selfdOn = !ui.selfdOn;
              return setTimeout(function () {
                return (ui.selfdOn = false);
              }, 200);
            });
            return ondblclick(function () {
              battleMode.selfDestructOrder();
              return (ui.selfdOn = false);
            });
          });
          miniButton("removeRally", "Remove Rally Point", function () {
            top(0);
            left(c + 224 - 42);
            return onclick(function () {
              var ref1;
              network.send("setRallyPoint", [0, 0]);
              return (ref1 = intp.players[commander.number]) != null ? (ref1.rallyPoint = [0, 0]) : void 0;
            });
          });
          miniButton("rally", "Place Rally Point", function () {
            top(0);
            left(c + 266 - 42);
            if (battleMode.rallyPlacing) {
              background("rgba(255,0,0,.5)");
            }
            return onclick(function () {
              return (battleMode.rallyPlacing = !battleMode.rallyPlacing);
            });
          });
          miniButton("focus", "Focus Fire/Follow", function () {
            top(0);
            left(c + 308 - 42);
            return onclick(function () {
              return (battleMode.follow = true);
            });
          });
          miniButton("../stripes", "Hold Position", function () {
            top(0);
            left(c + 350 - 42);
            return onclick(function () {
              return battleMode.holdPositionOrder();
            });
          });
          miniButton("stop", "Stop Units", function () {
            top(0);
            left(c + 392 - 42);
            return onclick(function () {
              return battleMode.stopOrder();
            });
          });
          miniButton("info", "Unit Info", function () {
            top(0);
            left(c + 434 - 42);
            if (ui.showInfo) {
              background("rgba(255,255,255,.3)");
            }
            return onclick(function () {
              ui.showInfo = !ui.showInfo;
              return buildBar.updateUnitBubble();
            });
          });
        });
      }
    });
    if (ui.contorlHelpToggle && ui.mode === "battle") {
      div(function () {
        position("absolute");
        if (folded) {
          top(0);
        } else {
          top(64);
        }
        width("100%");
        text_align("center");
        height(281 + 80);
        padding(40);
        background_color("rgba(0,0,0,.6)");
        return img({
          src: "img/ui/tips/controls.png",
          width: 848,
          height: 281,
        });
      });
    }
    return div("#unit-bubble", function () {
      position("absolute");
      background("rgba(0,0,0,.2)");
      border_radius("0px 0px 10px 0px");
      top(64);
      left(0);
      width(210);
      padding(15);
      font_size(14);
      color("#DDD");
      visibility("hidden");
      return onecup.post_render(buildBar.updateUnitBubble);
    });
  };

  buildBar.moneyText = function () {
    if (!commander) {
      return "";
    }
    if (!intp.state === "waiting") {
      return "waiting...";
    } else {
      if (commander.side === "spectators") {
        return "Spectating";
      } else {
        return "$" + Math.floor(commander.money);
      }
    }
  };

  buildBar.moneyIncomeText = function () {
    var _, income, ref, t;
    if (!commander) {
      return "";
    }
    if (commander.side === "spectators" || intp.state === "waiting") {
      return "";
    }
    income = 10;
    ref = sim.things;
    for (_ in ref) {
      t = ref[_];
      if (t.commandPoint && t.side === commander.side) {
        income += 1;
      }
    }
    return "+$" + income;
  };

  buildBar.selectedInfo = function () {
    var j, len, stat, stats, unit, units;
    units = commander.selection;
    stats = {};
    stat = function (icon, unit, value, maxValue, opts) {
      if (maxValue == null) {
        maxValue = 0;
      }
      if (opts == null) {
        opts = {
          hideZero: false,
          largest: false,
          sum: true,
          hideMultiple: false,
          fixed: 1,
        };
      }
      if (opts.hideZero && value === 0) {
        return;
      }
      if (!stats[icon]) {
        return (stats[icon] = {
          value: value,
          maxValue: maxValue,
          unit: unit,
          fixed: opts.fixed,
          count: 1,
        });
      } else {
        if (opts.hideMultiple) {
          stats[icon].hidden = true;
        } else if (opts.largest) {
          stats[icon].value = Math.max(stats[icon].value, value);
          stats[icon].maxValue = Math.max(stats[icon].maxValue, maxValue);
        } else {
          stats[icon].value += value;
          stats[icon].maxValue += maxValue;
        }
        if (!opts.sum && !opts.largest) {
          return stats[icon].count++;
        }
      }
    };
    for (j = 0, len = units.length; j < len; j++) {
      unit = units[j];
      stat("count.png", "", 1, 0, {
        sum: true,
        fixed: 0,
      });
      stat("cost.png", "", unit.cost, 0, {
        sum: true,
        fixed: 0,
      });
      stat("armor.png", "HP", unit.hp, unit.maxHP, {
        sum: true,
        fixed: 0,
      });
      stat("energy.png", "E", unit.energy, unit.storeEnergy, {
        sum: true,
        fixed: 0,
      });
      stat("dps.png", "dps", unit.weaponDPS * 16);
      stat("damage.png", "d", unit.weaponDamage);
      stat("range.png", "m", unit.weaponRange, 0, {
        largest: true,
        fixed: 0,
      });
      stat("arc.png", "°", unit.weaponArc, 0, {
        largest: true,
        fixed: 0,
      });
      stat("speed.png", "m/s", unit.maxSpeed * 16, 0, {
        sum: false,
      });
      stat("turnSpeed.png", "°/s", ((unit.turnSpeed * 180) / Math.PI) * 16, 0, {
        sum: false,
        fixed: 0,
      });
      stat("cloak.png", "T", unit.cloak, unit.mass, {
        hideZero: true,
        fixed: 0,
      });
      stat("shield.png", "sh", unit.shield, unit.maxShield, {
        hideZero: true,
        fixed: 0,
      });
      stat("burnDamage.png", "d", unit.burn, 0, {
        hideZero: true,
      });
      stat("jump.png", "m", unit.jump, unit.jumpDistance, {
        hideZero: true,
        largest: true,
        fixed: 0,
      });
    }
    return stats;
  };

  lastInfoTime = 0;

  info = {
    name: null,
    cost: 0,
    stats: {},
  };

  buildBar.updateUnitBubble = function () {
    var bubble, stats;
    if (!commander) {
      return;
    }
    stats = buildBar.selectedInfo();
    bubble = onecup.lookup("#unit-bubble");
    if (bubble == null) {
      return;
    }
    if (ui.mode !== "battle" || !ui.showInfo || Object.keys(stats).length === 0) {
      bubble.style.visibility = "hidden";
      return;
    }
    bubble.style.visibility = "visible";
    return (bubble.innerHTML = onecup.genHTML(function () {
      return div(function () {
        var icon, maxValue, results, stat, unit, value;
        results = [];
        for (icon in stats) {
          stat = stats[icon];
          if (stat.hidden) {
            continue;
          }
          value = stat.value / stat.count;
          maxValue = stat.maxValue / stat.count;
          unit = stat.unit;
          results.push(
            div(function () {
              font_size(13);
              width(175);
              float("left");
              margin(10);
              img(
                {
                  src: "img/ui/" + icon,
                  width: 20,
                  height: 20,
                },
                function () {
                  float("left");
                  margin_right(10);
                  return margin_top(-2);
                }
              );
              text(value.toFixed(stat.fixed));
              if (maxValue > 0) {
                text(" / " + maxValue.toFixed(stat.fixed));
              }
              return text(unit);
            })
          );
        }
        return results;
      });
    }));
  };

  specToUnitMap = {};

  buildBar.specToUnit = function (spec) {
    var unit;
    if (!specToUnitMap[spec]) {
      unit = new types.Unit(spec);
      unit.pos = [0, 0];
      unit.rot = 0;
      unit.warpIn = 1;
      specToUnitMap[spec] = unit;
    }
    return specToUnitMap[spec];
  };

  buildBar.specToThumb = function (spec, color) {
    var unit;
    unit = buildBar.specToUnit(spec);
    if (unit) {
      if (color) {
        unit.color = color;
      }
      return unit.thumb();
    }
  };

  buildBar.specToThumbBg = function (spec) {
    var thumb;
    background_size("64px 64px");
    background_repeat("no-repeat");
    background_position("10px 10px");
    thumb = buildBar.specToThumb(spec, commander.color);
    if (!thumb) {
      return background_image("url(img/empty.png)");
    } else {
      return background_image("url(" + thumb + ")");
    }
  };

  css(".unitpic .onhover", function () {
    return opacity("0");
  });

  css(".unitpic:hover .onhover", function () {
    return opacity("1");
  });

  drawBuildButton = function (index) {
    return div(".unitpic", function () {
      var count, i, j, len, ref, ref1;
      position("absolute");
      height(84);
      width(84);
      top(0);
      left(window.innerWidth / 2 + (index - 5) * 84);
      buildBar.specToThumbBg(commander.buildBar[index]);
      onmousedown(function (e) {
        var base;
        return typeof (base = control.mode).onbuildclick === "function" ? base.onbuildclick(e, index) : void 0;
      });
      if (buildBar.selected === index && ui.mode === "design") {
        background_color("rgba(0,0,0,.3)");
      }
      count = 0;
      ref = commander.buildQ;
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        if (i === index) {
          count += 1;
        }
      }
      if (count > 0) {
        div(".count", function () {
          position("absolute");
          top(0);
          left(0);
          min_width(24);
          height(24);
          color("white");
          background_color("rgba(0, 0, 0, .2)");
          text_align("center");
          text(count);
          font_size(18);
          return padding(2);
        });
      }
      if ((ref1 = sim.galaxyStar) != null ? ref1.noDesignTools : void 0) {
        return;
      }
      if (buildBar.emptySpec(commander.buildBar[index])) {
        return div(".onhover", function () {
          position("absolute");
          color("white");
          top(30);
          left(0);
          width("100%");
          text_align("center");
          return text("Empty");
        });
      } else if (!commander.validBar[index]) {
        if (buildBar.selected === index) {
          background_color("rgba(100,0,0,.3)");
        } else {
          background_color("rgba(255,0,0,.3)");
        }
        return div(function () {
          position("absolute");
          color("white");
          top(30);
          left(30);
          return text("Fix");
        });
      }
    });
  };

  buildBar.setSpec = function (index, spec) {
    var ref, row, tab;
    (ref = commander.fleet.selection), (row = ref.row), (tab = ref.tab);
    commander.buildBar[index] = spec;
    return (commander.fleet[getFleetKey(row, index, tab)] = spec);
  };

  buildBar.emptySpec = function (spec) {
    if (spec === "") {
      return true;
    }
    if (spec === '{"parts":[],"name":"","aiRules":[]}') {
      return true;
    }
    return false;
  };

  window.MenuMode = (function () {
    function MenuMode() {}

    MenuMode.prototype.focus = [0, 0];

    MenuMode.prototype.zoom = 1;

    MenuMode.prototype.onbuildclick = function () {};

    MenuMode.prototype.tick = function () {};

    MenuMode.prototype.draw = function () {};

    return MenuMode;
  })();
}.call(this));
