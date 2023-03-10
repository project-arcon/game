// here begin src/ui.js
(function () {
  var campaignsView, webGLErrorMessage;

  eval(onecup["import"]());

  window.ui = {};

  ui.path = ["menu"];

  ui.go = function (mode) {
    if (mode === "fleet") {
      if (fleetMode.draggingUnit) {
        commander.fleet[fleetMode.draggingUnit.key] = fleetMode.draggingUnit.spec;
      }
      fleetMode.draggingUnit = null;
      fleetMode.draggingFleet = null;
      onecup.later(100, function () {
        var screen;
        screen = onecup.lookup("#fleet-screen");
        return screen.scrollTo(0, commander.fleet.selection.row * 84);
      });
    }
    return (ui.mode = mode);
  };

  ui.goBack = function (mode) {
    if (history.length > 1) {
      history.back();
      ui.mode = window.location.hash.slice(1);
      onecup.refresh();
    } else {
      ui.mode = mode;
    }
    return console.log("ui.mode =", ui.mode);
  };

  ui.mode = "menu";

  ui.show = true;

  window.body = function () {
    var ref;
    if (ui.error === "webGL") {
      webGLErrorMessage();
      return;
    }
    if (!(typeof baseAtlas !== "undefined" && baseAtlas !== null ? baseAtlas.ready : void 0) || !ui.loaded) {
      ui.loadingMessage();
      return;
    } else {
      document.body.style.backgroundColor = "#6B7375";
    }
    if (account.signedIn === false) {
      ui.mode === "authenticate";
      account.signinOrRegisterMenu();
      return;
    }
    if (!ui.show) {
      return;
    }
    ui.reconnectRoot();
    if ((ref = sim.galaxyStar) != null ? (typeof ref.ui === "function" ? ref.ui() : void 0) : void 0) {
      return;
    }
    control.backgroundMode = battleMode;
    control.mode = menuMode;
    chat.draw();
    switch (ui.mode) {
      case "menu":
        ui.menu();
        break;
      case "battle":
        buildBar.draw();
        control.mode = battleMode;
        ui.reconnect();
        break;
      case "quickscore":
        buildBar.draw();
        battleroom.quickscore();
        control.mode = battleMode;
        break;
      case "restart":
        ui.restartDialog();
        break;
      case "design":
        control.mode = designMode;
        editorUI();
        break;
      case "fleet":
        control.mode = fleetMode;
        fleetUI();
        break;
      case "settings":
        ui.settingsMain();
        break;
      case "reset":
        account.settingsResetPassword();
        break;
      case "multiplayer":
        buildBar.draw();
        chat.room();
        break;
      case "battleroom":
        buildBar.draw();
        battleroom.room();
        ui.reconnect();
        break;
      case "challenges":
        ui.challengesView();
        break;
      case "galaxy":
        if (!galaxyMode.hasCurrent) {
          galaxyMode.difficulty = 1;
          galaxyMode.restart();
        }
        control.backgroundMode = galaxyMode;
        control.mode = galaxyMode;
        galaxyView();
        break;
      case "campaigns":
        campaignsView();
        break;
      case "unit":
        control.mode = designMode;
        break;
      case "unitpix":
        ui.unitPix();
        break;
      case "copy":
        ui.copyPage();
        break;
      case "mod":
        ui.modPage();
        break;
      case "tournaments":
        ui.tournamentsPage();
        break;
      case "servers":
        ui.serverPage();
    }
    if (ui.mode !== "menu") {
      bubbles.draw();
    }
    ui.perfPage();
    if (account.savingToServer) {
      ui.savingData();
    }
    if (ui.rmenu) {
      div("#rmenu", function () {
        position("fixed");
        background_color("rgba(0,0,0,.9)");
        color("white");
        z_index("10");
        left(ui.rmenu.pos[0]);
        top(ui.rmenu.pos[1]);
        return ui.rmenu.html();
      });
      return onecup.post_render(function () {
        var bounds, diff, rmenuDiv;
        rmenuDiv = onecup.lookup("#rmenu");
        if (rmenuDiv) {
          bounds = rmenuDiv.getBoundingClientRect();
          diff = window.innerHeight - (bounds.top + bounds.height);
          if (diff < 0 && bounds.top > 0) {
            ui.rmenu.pos[1] += diff;
            if (ui.rmenu.pos[1] < 0) {
              ui.rmenu.pos[1] = 0;
            }
            return (rmenuDiv.style.top = ui.rmenu.pos[1] + "px");
          }
        }
      });
    }
  };

  webGLErrorMessage = function () {
    return div(function () {
      position("absolute");
      top(0);
      left(0);
      right(0);
      bottom(0);
      min_height(600);
      background_color("rgb(211, 84, 0)");
      return div(function () {
        margin_top(100);
        font_size(20);
        color("white");
        return div(function () {
          h1(function () {
            return text("Graphic card error.");
          });
          br();
          margin("10px auto");
          width(600);
          br();
          p(function () {
            return text("You can try:");
          });
          br();
          ol(function () {
            margin_left(30);
            li(function () {
              return text("Restarting the computer.");
            });
            li(function () {
              return text("Update graphics drivers.");
            });
            if (typeof internal === "undefined" || internal === null) {
              li(function () {
                return text("Check for browser updates.");
              });
              li(function () {
                return text("Disable extensions like AdBlock, try incognito mode.");
              });
              return li(function () {
                return text("Make sure webGL is enabled.");
              });
            }
          });
          br();
          p(function () {
            return text("Technical reason:");
          });
          br();
          return p(function () {
            color("rgba(255, 200, 200, 1)");
            return text(ui.contextErrrorMessage);
          });
        });
      });
    });
  };

  ui.loadTime = Date.now();

  ui.loadingMessage = function () {
    var fade;
    fade = (Date.now() - ui.loadTime - 2000) / 5000;
    fade = Math.max(0, Math.min(fade, 1));
    div(function () {
      margin_top(200);
      text_align("center");
      font_size(30);
      color("#D3D5DE");
      opacity("" + fade);
      return text("loading...");
    });
    return div(function () {
      margin("20px auto");
      height(10);
      width(200);
      background_color("#E3E5EE");
      opacity("" + fade);
      return div(function () {
        var p;
        p = (typeof baseAtlas !== "undefined" && baseAtlas !== null ? baseAtlas.progress : void 0) || 0;
        width((p * 100).toFixed(0) + "%");
        background_color("#A3A5AE");
        return height(10);
      });
    });
  };

  ui.reconnect = function () {
    if (network.websocket != null && network.websocket.readyState === WebSocket.CLOSED) {
      return div(function () {
        position("absolute");
        top(200);
        left(0);
        right(0);
        color("white");
        overflow("hidden");
        text_align("center");
        background_color("rgba(160,0,0,.9)");
        padding(20);
        z_index("100");
        div(function () {
          margin(20);
          return text("Connection to server lost");
        });
        return div(".hover-black-dark", function () {
          padding(10);
          width(200);
          margin("0px auto");
          text_align("center");
          text("Reconnect");
          return onclick(function () {
            var ref;
            if ((ref = battleMode.server) != null ? ref.name : void 0) {
              return battleMode.joinServer(battleMode.server.name);
            } else {
              return (ui.mode = "multiplayer");
            }
          });
        });
      });
    }
  };

  ui.reconnectRoot = function () {
    if (rootNet.websocket != null && rootNet.websocket.readyState !== WebSocket.OPEN) {
      return div(function () {
        position("absolute");
        top(200);
        left(0);
        right(0);
        color("white");
        overflow("hidden");
        text_align("center");
        padding(20);
        z_index("100");
        if (account.error) {
          background_color("rgba(160,0,0,.9)");
          return div(function () {
            margin(20);
            return text(account.error);
          });
        } else if (rootNet.websocket.readyState === WebSocket.CLOSED) {
          background_color("rgba(160,0,0,.9)");
          div(function () {
            margin(20);
            return text("Connection to root server lost. Can't save progress or ship designs.");
          });
          return div(".hover-black-dark", function () {
            padding(10);
            width(200);
            margin("0px auto");
            text_align("center");
            text("Reconnect");
            return onclick(function () {
              return rootNet.connect();
            });
          });
        } else {
          background_color("rgba(0,160,0,.9)");
          return div(function () {
            margin(20);
            return text("Connecting to root server.");
          });
        }
      });
    }
  };

  ui.savingData = function () {
    return div(function () {
      position("absolute");
      top(200);
      left(0);
      right(0);
      color("white");
      overflow("hidden");
      text_align("center");
      background_color("rgba(0,160,0,.9)");
      padding(20);
      z_index("100");
      return div(function () {
        margin(20);
        return text("Saving data before closing...");
      });
    });
  };

  ui.inScreen = function (back, title, fn) {
    return div("#screen", function () {
      position("relative");
      margin("0px auto");
      height(window.innerHeight);
      width(520);
      background_color("rgba(0,0,0,.6)");
      color("white");
      padding_top(64);
      div(function () {
        position("absolute");
        top(16);
        left(64);
        right(64);
        text_align("center");
        font_size(30);
        return text(title);
      });
      img(
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
            return ui.go(back);
          });
        }
      );
      return fn();
    });
  };

  campaignsView = function () {
    if (!galaxyMode.hasCurrent) {
      galaxyMode.difficulty = 1;
      galaxyMode.restart();
      return;
    }
    return ui.inScreen("menu", "Campaigns", function () {
      div(function () {
        position("relative");
        top(-10);
        text_align("center");
        text("conquest of the galaxy");
        return padding_bottom(10);
      });
      div(function () {
        text_align("center");
        div(".button", function () {
          padding(40);
          text("Continue Current");
          if (galaxyMode.hasCurrent) {
            return onclick(function () {
              return ui.go("galaxy");
            });
          } else {
            background_color("rgba(0,0,0,.5)");
            return opacity(".1");
          }
        });
        return div(function () {
          width("100%");
          return height(50);
        });
      });
      div(function () {
        padding(20);
        text_align("center");
        if (localStorage.galaxy) {
          p(function () {
            font_size(30);
            padding_bottom(10);
            return text("Start New");
          });
          return p(function () {
            return text("will overwirte current one");
          });
        } else {
          p(function () {
            font_size(30);
            padding_bottom(10);
            return text("Galaxy");
          });
          return p(function () {
            return text("Let your conquest being");
          });
        }
      });
      return div(function () {
        var campaign;
        campaign = function (label, difficulty) {
          return div(".button", function () {
            position("relative");
            padding(40);
            text_align("center");
            text(label);
            overflow("hidden");
            margin_bottom(20);
            return onclick(function () {
              galaxyMode.difficulty = difficulty;
              return galaxyMode.restart();
            });
          });
        };
        return campaign("Restart", 1);
      });
    });
  };

  css(".hover-black", function () {
    return background_color("rgba(0,0,0,0)");
  });

  css(".hover-black:hover", function () {
    return background_color("rgba(0,0,0,.3)");
  });

  css(".hover-black-dark", function () {
    return background_color("rgba(0,0,0,.1)");
  });

  css(".hover-black-dark:hover", function () {
    return background_color("rgba(0,0,0,.4)");
  });

  css(".hover-white", function () {
    return background_color("rgba(255,255,255,0)");
  });

  css(".hover-white:hover", function () {
    return background_color("rgba(255,255,255,.3)");
  });

  css(".hover-white-dark", function () {
    return background_color("rgba(0,0,0,.4)");
  });

  css(".hover-white-dark:hover", function () {
    return background_color("rgba(255,255,255,.3)");
  });

  css(".hover-red", function () {
    return background_color("rgba(255,0,0,.3)");
  });

  css(".hover-red:hover", function () {
    return background_color("rgba(255,0,0,.7)");
  });

  css(".button", function () {
    return background_color("rgba(255,255,255,.1)");
  });

  css(".button:hover", function () {
    return background_color("rgba(0,0,0,.5)");
  });

  css(".menu-button", function () {
    background_color("rgba(255,255,255,.1)");
    text_align("left");
    padding(20);
    font_size(30);
    color("white");
    width("100%");
    return border("none");
  });

  css(".menu-button:hover", function () {
    return background_color("rgba(0,0,0,.5)");
  });

  css(".hover-fade", function () {
    return opacity(".2");
  });

  css(".hover-fade:hover", function () {
    return opacity("1");
  });

  ui.perfPage = function () {
    var avg;
    if (!control.perf) {
      return;
    }
    avg = function (stat) {
      var i, j, sec, total;
      total = 0;
      sec = Math.floor(Date.now() / 1000);
      for (i = j = 0; j < 5; i = ++j) {
        total += stat[sec - i - 1] || 0;
      }
      return Math.round(total / 5);
    };
    div(function () {
      position("absolute");
      top(76);
      right(260);
      width(100);
      color("white");
      text_align("right");
      text("FPS");
      br();
      return text(avg(stats.fps));
    });
    div(function () {
      position("absolute");
      top(156);
      right(260);
      width(100);
      color("white");
      text_align("right");
      text("Tick");
      br();
      return text(avg(stats.sim));
    });
    div(function () {
      position("absolute");
      top(356);
      right(260);
      width(100);
      color("white");
      text_align("right");
      text("Network");
      br();
      return text((avg(stats.net) / 1000).toFixed(1) + "k/s");
    });
    return div(function () {
      var j, k, ks, len, list, numbers, ref, ref1, results, v;
      position("absolute");
      top(64);
      width(300);
      background_color("rgba(0,0,0,.75)");
      bottom(84);
      color("white");
      overflow("hidden");
      padding(5);
      if (intp.perf) {
        numbers = intp.perf.numbers;
        table(function () {
          tr(function () {
            td(function () {
              padding(4);
              text_align("left");
              return text("things");
            });
            td(function () {
              padding(4);
              return text(numbers.things);
            });
            return td(function () {
              padding(4);
              return text(numbers.sthings);
            });
          });
          tr(function () {
            td(function () {
              padding(4);
              text_align("left");
              return text("players");
            });
            td(function () {
              padding(4);
              return text(numbers.players);
            });
            return td(function () {
              padding(4);
              return text(numbers.splayers);
            });
          });
          return tr(function () {
            td(function () {
              padding(4);
              text_align("left");
              return text("units/bullets/others");
            });
            td(function () {
              padding(4);
              return text(numbers.units);
            });
            td(function () {
              padding(4);
              return text(numbers.bullets);
            });
            return td(function () {
              padding(4);
              return text(numbers.others);
            });
          });
        });
      }
      if (((ref = intp.perf) != null ? ref.timeings : void 0) != null) {
        list = (function () {
          var ref1, results;
          ref1 = intp.perf.timeings;
          results = [];
          for (k in ref1) {
            v = ref1[k];
            results.push([k, v]);
          }
          return results;
        })();
        list.sort(function (a, b) {
          return a[0].localeCompare(b[0]);
        });
        results = [];
        for (j = 0, len = list.length; j < len; j++) {
          (ref1 = list[j]), (k = ref1[0]), (v = ref1[1]);
          ks = k.split(">");
          k = ks.pop();
          div(function () {
            margin_left(ks.length * 20);
            return text(k + " " + v.toFixed(1) + "ms");
          });
          results.push(
            div(function () {
              margin_left(ks.length * 20);
              height(8);
              width(200);
              background_color("black");
              return div(function () {
                height(8);
                if (v > 1000) {
                  background_color("red");
                } else {
                  background_color("rgba(255,0,0,.75)");
                }
                return width(Math.floor(200 * (v / 1000)));
              });
            })
          );
        }
        return results;
      }
    });
  };
}.call(this));
