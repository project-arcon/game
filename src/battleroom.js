// here begin src/battleroom.js
(function () {
  var canAddAI,
    drawAI,
    drawAis,
    drawPlayerChip,
    drawServerSettings,
    drawSpecs,
    drawStart,
    drawTeam,
    drawTeams,
    findChatPlayer,
    needNumPlayers,
    quickScorePlayer,
    slice = [].slice;

  eval(onecup["import"]());

  window.battleroom = {};

  findChatPlayer = function (name) {
    var player;
    if (chat.players) {
      player = chat.players[name];
      if (player) {
        return player;
      }
    }
    return {
      rank: 0,
    };
  };

  window.findRank = function (name) {
    var chatPlayer;
    chatPlayer = findChatPlayer(name);
    if (!chatPlayer) {
      return "?";
    }
    return Math.round(chatPlayer.rank || 0);
  };

  window.rankImage = function (rank) {
    if (rank < 25) {
      return "img/ui/rank/rank0.png";
    } else if (rank < 75) {
      return "img/ui/rank/rank1.png";
    } else if (rank < 150) {
      return "img/ui/rank/rank2.png";
    } else if (rank < 225) {
      return "img/ui/rank/rank3.png";
    } else if (rank < 300) {
      return "img/ui/rank/rank4.png";
    } else if (rank < 400) {
      return "img/ui/rank/rank5.png";
    } else if (rank < 500) {
      return "img/ui/rank/rank6.png";
    } else if (rank < 600) {
      return "img/ui/rank/rank7.png";
    } else if (rank < 700) {
      return "img/ui/rank/rank8.png";
    } else if (rank < 800) {
      return "img/ui/rank/rank9.png";
    } else if (rank < 1000) {
      return "img/ui/rank/rank10.png";
    } else if (rank < 1250) {
      return "img/ui/rank/rank11.png";
    } else if (rank < 1500) {
      return "img/ui/rank/rank12.png";
    } else if (rank < 2000) {
      return "img/ui/rank/rank13.png";
    } else if (rank >= 2000) {
      return "img/ui/rank/rank14.png";
    }
  };

  ui.playerChip = function (player, cut, defaultColor) {
    var chatPlayer;
    if (cut == null) {
      cut = 20;
    }
    if (defaultColor == null) {
      defaultColor = "white";
    }
    if (player.ai) {
      chatPlayer = {
        rank: 0,
      };
    } else {
      chatPlayer = chat.players[player.name] || {
        rank: 0,
      };
    }
    return div(".playerChip", function () {
      var x;
      position("relative");
      display("inline-block");
      height(24);
      line_height(24);
      oncontextmenu(function (e) {
        e.preventDefault();
        return (ui.rmenu = {
          id: rid(),
          pos: [e.clientX, e.clientY],
          html: function () {
            div(function () {
              padding(5);
              return text(player.name);
            });
            if (player.name !== commander.name && player.name !== "Server") {
              div(".hover-red", function () {
                padding(5);
                if (!commander.mutes[player.name]) {
                  text("Mute player");
                } else {
                  text("Unmute player");
                }
                return onclick(function () {
                  commander.mutes[player.name] = !commander.mutes[player.name];
                  account.rootSave();
                  return (ui.rmenu = null);
                });
              });
              return div(".hover-red", function () {
                padding(5);
                if (!commander.friends[player.name]) {
                  text("Add to friends");
                } else {
                  text("Remove from friends");
                }
                return onclick(function () {
                  commander.friends[player.name] = !commander.friends[player.name];
                  account.rootSave();
                  return (ui.rmenu = null);
                });
              });
            }
          },
        });
      });
      x = 0;
      div(function () {
        var c, rank;
        left(x);
        position("absolute");
        box_shadow("inset 0 0 3px 2px rgba(255,255,255,.2)");
        border_radius(5);
        height(20);
        width(20);
        margin(2);
        if (player.connected === void 0 || player.connected === true) {
          c = player.color;
          if (c) {
            background_color("rgba(" + c[0] + "," + c[1] + "," + c[2] + ",1)");
          }
        }
        if (player.ai && !sim.galaxyStar) {
          img({
            src: "img/ui/player/ai.png",
            width: 20,
            height: 20,
          });
        } else {
          rank = chatPlayer.rank;
          if (rank !== 0 && !isNaN(rank)) {
            img({
              src: rankImage(rank),
              width: 20,
              height: 20,
            });
          }
        }
        return (x += 24);
      });
      if (player.host && !sim.galaxyStar) {
        x += 2;
        img(
          {
            src: "img/ui/player/host.png",
            width: 20,
            heigth: 20,
          },
          function () {
            left(x);
            top(2);
            position("absolute");
            return (x += 22);
          }
        );
      }
      if (commander.mutes[player.name]) {
        img(
          {
            src: "img/ui/player/mute.png",
            width: 20,
            heigth: 20,
          },
          function () {
            left(x);
            top(2);
            position("absolute");
            return (x += 18);
          }
        );
      }
      if (commander.friends[player.name]) {
        img(
          {
            src: "img/ui/player/friend.png",
            width: 20,
            heigth: 20,
          },
          function () {
            left(x);
            top(2);
            position("absolute");
            return (x += 18);
          }
        );
      }
      x += 2;
      return span(function () {
        padding_left(x);
        if (player.afk) {
          color("rgba(255,255,255,.6)");
        }
        if (chatPlayer.faction) {
          span(function () {
            font_size(20);
            color("rgba(255,255,255,.3)");
            return text("[");
          });
          text(chatPlayer.faction);
          span(function () {
            font_size(20);
            color("rgba(255,255,255,.3)");
            return text("]");
          });
          cut -= chatPlayer.faction.length;
          if (cut < 0) {
            cut = 0;
          }
        }
        if (!player.name) {
          return text(" ???");
        } else {
          return text(player.name.slice(0, cut));
        }
      });
    });
  };

  battleroom.countDownSound = null;

  battleroom.room = function () {
    var sideWidth;
    if (intp.countDown === 5 * 16 && !sim.local) {
      onecup.refresh();
    }
    sideWidth = window.innerWidth / 4;
    div(function () {
      color("white");
      position("absolute");
      top(64);
      bottom(84);
      left(0);
      width(sideWidth);
      background_color("rgba(0,0,0,.1)");
      overflow_y("scroll");
      if (network.websocket != null && network.websocket.readyState === WebSocket.CONNECTING) {
        div(function () {
          opacity(".4");
          padding("100px 20px");
          text_align("center");
          return text("Connecting...");
        });
      } else if (intp.players.length === 0) {
        div(function () {
          opacity(".4");
          padding("100px 20px");
          text_align("center");
          return text("Waiting...");
        });
      } else {
        drawServerSettings();
        drawStart();
        drawTeams();
      }
      if (!sim.local) {
        return div(".hover-white", function () {
          padding(20);
          text_align("center");
          text("leave game");
          return onclick(function () {
            battleMode.startNewLocal();
            return ui.go("multiplayer");
          });
        });
      }
    });
    return div(function () {
      color("white");
      position("absolute");
      top(64);
      bottom(84);
      right(0);
      width(sideWidth);
      background_color("rgba(0,0,0,.3)");
      overflow_y("scroll");
      if (ui.pickingLobbyAiSide) {
        return drawAis();
      }
    });
  };

  needNumPlayers = function () {
    if (sim.local) {
      return 3;
    }
    if (intp.serverType.slice(0, 3) === "1v1") {
      return 1;
    }
    if (intp.serverType === "2v2") {
      return 2;
    }
    if (intp.serverType === "3v3") {
      return 3;
    }
    return 3;
  };

  ui.serverNeedNumPlayers = function (server) {
    var ref;
    if (!server.type) {
      return 3;
    }
    if (((ref = server.type) != null ? ref.slice(0, 3) : void 0) === "1v1") {
      return 1;
    }
    if (server.type === "2v2") {
      return 2;
    }
    if (server.type === "3v3") {
      return 3;
    }
  };

  canAddAI = function () {
    if (sim.local) {
      return true;
    }
    if (intp.serverType.slice(0, 3) === "1v1") {
      return false;
    }
    return commander.side !== "spectators";
  };

  drawServerSettings = function () {
    var modeButton;
    modeButton = function (name, mode) {
      if (mode == null) {
        mode = name;
      }
      return span(".hover-black", function () {
        display("inline-block");
        margin(5);
        padding("10px 10px");
        text_align("center");
        color("white");
        if (intp.serverType === mode) {
          background_color("rgba(0,0,0,.2)");
        }
        text(name);
        return onclick(function () {
          var config;
          if (commander.host && intp.state === "waiting") {
            config = {};
            config["type"] = mode;
            console.log("send", "configGame", config);
            network.send("configGame", config);
            if (mode === "survival") {
              return network.send("switchSide", "alpha");
            }
          }
        });
      });
    };
    return div(function () {
      background_color("rgba(0,0,0,.1)");
      modeButton("1v1");
      modeButton("2v2");
      modeButton("3v3");
      modeButton("Sandbox", "sandbox");
      return modeButton("Survival", "survival");
    });
  };

  drawStart = function () {
    var alphas, betas, i, len, p, ready, ref;
    if (intp.state === "waiting") {
      if (intp.countDown > 15) {
        return div(function () {
          opacity(".4");
          padding(20);
          text_align("center");
          return text("Starting in " + Math.floor(intp.countDown / 16));
        });
      } else {
        alphas = 0;
        betas = 0;
        ref = intp.players;
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          if (p.side === "alpha") {
            alphas += 1;
          }
          if (p.side === "beta") {
            betas += 1;
          }
        }
        ready = alphas >= needNumPlayers() && betas >= needNumPlayers();
        if (intp.serverType === "survival" && alphas >= 1 && betas >= 1) {
          ready = true;
        }
        if (sim.local) {
          return div(".hover-white", function () {
            padding(20);
            text_align("center");
            text("Start");
            return onclick(function () {
              ui.go("battle");
              return network.send("startGame");
            });
          });
        } else if (ready) {
          if (commander.host) {
            return div(".hover-white", function () {
              padding(20);
              text_align("center");
              text("Start");
              return onclick(function () {
                return network.send("startGame");
              });
            });
          } else {
            return div(function () {
              opacity(".4");
              padding(20);
              text_align("center");
              return text("Waiting for host to start");
            });
          }
        } else {
          return div(function () {
            opacity(".4");
            padding(20);
            text_align("center");
            return text("Waiting for players");
          });
        }
      }
    } else {
      return div(".hover-white", function () {
        padding(20);
        text_align("center");
        text("In Progress");
        return onclick(function () {
          return ui.go("battle");
        });
      });
    }
  };

  drawTeams = function () {
    drawTeam("alpha", "Alpha Team");
    drawTeam("beta", "Beta Team");
    return drawSpecs("spectators", "Spectators");
  };

  drawAis = function () {
    var fleetAis, i, j, k, key, l, len, len1, len2, len3, len4, m, n, name, ref, ref1, ref2, ref3, results, row, tab, yourAis;
    color("white");
    ref = slice.call(commander.fleet.tabs);
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i];
      yourAis = [];
      fleetAis = commander.fleet.ais || {};
      for (row = j = 0; j < 1000; row = ++j) {
        key = getAIKey(row, tab);
        if (fleetAis[key]) {
          yourAis.push(fleetAis[key]);
        }
      }
      if (yourAis.length > 0) {
        div(function () {
          background_color("rgba(0,0,0,.1)");
          text(tab);
          return padding(10);
        });
        for (k = 0, len1 = yourAis.length; k < len1; k++) {
          name = yourAis[k];
          drawAI(name);
        }
      }
    }
    div(function () {
      background_color("rgba(0,0,0,.1)");
      text("Easy AIs");
      return padding(10);
    });
    ref1 = ais.easy;
    for (l = 0, len2 = ref1.length; l < len2; l++) {
      name = ref1[l];
      drawAI(name);
    }
    div(function () {
      background_color("rgba(0,0,0,.1)");
      text("Medium AIs");
      return padding(10);
    });
    ref2 = ais.med;
    for (m = 0, len3 = ref2.length; m < len3; m++) {
      name = ref2[m];
      drawAI(name);
    }
    div(function () {
      background_color("rgba(0,0,0,.1)");
      text("Hard AIs");
      return padding(10);
    });
    ref3 = ais.hard;
    results = [];
    for (n = 0, len4 = ref3.length; n < len4; n++) {
      name = ref3[n];
      results.push(drawAI(name));
    }
    return results;
  };

  drawAI = function (name) {
    return div(".hover-white", function () {
      var w;
      display("inline-block");
      w = (window.innerWidth / 4 - 25) / 2;
      width(w);
      padding(5);
      margin(3);
      text(name);
      return onclick(function () {
        var aiBuildBar, aiName, col, fleetAis, i, key, ref, row, tab;
        aiBuildBar = false;
        fleetAis = commander.fleet.ais || {};
        for (key in fleetAis) {
          aiName = fleetAis[key];
          (ref = fromAIKey(key)), (row = ref[0]), (tab = ref[1]);
          if (name === aiName) {
            aiBuildBar = [];
            for (col = i = 0; i < 10; col = ++i) {
              aiBuildBar.push(commander.fleet[getFleetKey(row, col, tab)]);
            }
            console.log("ai player from name", aiName, aiBuildBar);
          }
        }
        if (!aiBuildBar) {
          aiBuildBar = ais.all[name];
        }
        if (aiBuildBar) {
          network.send("addAi", name, ui.pickingLobbyAiSide, aiBuildBar);
        }
        return (ui.pickingLobbyAiSide = false);
      });
    });
  };

  drawTeam = function (side, name) {
    var _, num, p, ref;
    num = 0;
    ref = intp.players;
    for (_ in ref) {
      p = ref[_];
      if (p.side === side) {
        num += 1;
      }
    }
    div(function () {
      position("relative");
      text(name);
      padding(10);
      background_color("rgba(255, 255, 255, .1)");
      if (num < needNumPlayers() && canAddAI()) {
        return div(".hover-black", function () {
          position("absolute");
          right(0);
          top(0);
          padding(10);
          text("+ AI");
          return onclick(function () {
            return (ui.pickingLobbyAiSide = side);
          });
        });
      }
    });
    return div(function () {
      var ref1;
      min_height(100);
      overflow_y("auto");
      ref1 = intp.players;
      for (_ in ref1) {
        p = ref1[_];
        if (p.side === side) {
          drawPlayerChip(p);
        }
      }
      if (intp.serverType === "survival" && side === "beta") {
        return;
      }
      if (commander.side !== side && num < needNumPlayers()) {
        return div(".hover-black", function () {
          padding(10);
          text_align("center");
          color("#DDD");
          text("join this team");
          return onclick(function () {
            network.send("switchSide", side);
            if (side !== "spectators") {
              return network.sendPlayer();
            }
          });
        });
      }
    });
  };

  drawSpecs = function (side, name) {
    div(function () {
      position("relative");
      padding(10);
      background_color("rgba(255, 255, 255, .1)");
      return text(name);
    });
    return div(function () {
      var _, p, ref;
      min_height(100);
      overflow_y("auto");
      ref = intp.players;
      for (_ in ref) {
        p = ref[_];
        if (p.side === side && p.connected && !p.ai) {
          drawPlayerChip(p);
        }
      }
      if (commander.side !== side) {
        return div(".hover-black", function () {
          padding(10);
          text_align("center");
          color("#DDD");
          text("spectate");
          return onclick(function () {
            return network.send("switchSide", side);
          });
        });
      }
    });
  };

  drawPlayerChip = function (player) {
    return div(function () {
      height(24);
      line_height(24);
      margin(4);
      if (player.afk) {
        color("rgba(255,255,255,.3)");
      } else {
        color("white");
      }
      ui.playerChip(player);
      padding_left(5);
      height(24);
      text_overflow("ellipsis");
      overflow("hidden");
      white_space("nowrap");
      if (intp.serverType === "1v1r" || intp.serverType === "1v1t") {
        text("[" + findRank(player.name) + "]");
      }
      if (player.side !== "spectators" && sim.state === "waiting" && commander.host) {
        return div(".button", function () {
          height(24);
          padding("0px 5px");
          float("right");
          if (player.id === commander.id) {
            text("leave");
          } else {
            text("kick");
          }
          return onclick(function () {
            console.log("kick", player.number);
            return network.send("kickPlayer", player.number);
          });
        });
      }
    });
  };

  battleroom.quickscore = function () {
    return div(function () {
      var quarterWidth;
      quarterWidth = window.innerWidth / 4;
      position("absolute");
      left(quarterWidth);
      width(quarterWidth * 2);
      top(64);
      bottom(84);
      overflow_y("scroll");
      background_color("rgba(0, 0, 0, .1)");
      color("white");
      if (battleMode.server) {
        div(function () {
          background_color("rgba(0,0,0,.25)");
          padding(20);
          text_align("center");
          font_size(18);
          text(battleMode.server.name);
          text(" ");
          return text(intp.serverType);
        });
      }
      div(function () {
        var teamTable;
        padding(20);
        teamTable = function (team) {
          return table(function () {
            var _, player, ref, results;
            padding_top(50);
            tr(function () {
              height(30);
              th(function () {
                width(400);
                text_align("left");
                text_align("left");
                text(team);
                if (intp.winningSide === team) {
                  return text("(won)");
                }
              });
              th(function () {
                width(100);
                return text("Rank");
              });
              th(function () {
                width(100);
                return text("APM");
              });
              th(function () {
                width(100);
                return text("Caps");
              });
              th(function () {
                width(100);
                return text("Units");
              });
              return th(function () {
                width(100);
                return text("Money");
              });
            });
            ref = intp.players;
            results = [];
            for (_ in ref) {
              player = ref[_];
              if (player.side === team) {
                results.push(quickScorePlayer(player));
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
        };
        teamTable("alpha");
        return teamTable("beta");
      });
      if (intp.winningSide) {
        bottom(84);
        div(function () {
          font_size(90);
          padding(10);
          text_align("center");
          text_shadow("0px 0px 5px #000");
          return text(intp.winningSide + " victory!");
        });
      }
      if (intp.state === "running" && commander.side !== "spectators") {
        return div(".hover-red", function () {
          padding(10);
          width(200);
          margin("0px auto");
          text("Surrender");
          text_align("center");
          return onclick(function () {
            return network.send("surrender");
          });
        });
      } else {
        return div(".hover-black-dark", function () {
          padding(10);
          width(200);
          margin("0px auto");
          text("Battleroom");
          text_align("center");
          return onclick(function () {
            return (ui.mode = "battleroom");
          });
        });
      }
    });
  };

  quickScorePlayer = function (player) {
    if (player.side === "dead") {
      return;
    }
    return tr(function () {
      td(function () {
        text_align("left");
        return ui.playerChip(player);
      });
      td(function () {
        return text(findRank(player.name));
      });
      td(function () {
        var ref;
        return text((ref = player.apm) != null ? ref.toFixed(2) : void 0);
      });
      td(function () {
        return text(player.capps);
      });
      td(function () {
        return text(player.unitsBuilt);
      });
      return td(function () {
        return text(player.money);
      });
    });
  };

  ui.topPlayers = function () {
    var maybeChars, quarterWidth, s, team;
    quarterWidth = window.innerWidth / 4;
    maybeChars = quarterWidth / 16;
    team = function (side) {
      var _, cut, i, j, len, len1, p, player, players, results, totalChars;
      players = (function () {
        var ref, results;
        ref = intp.players;
        results = [];
        for (_ in ref) {
          p = ref[_];
          if ((p != null ? p.side : void 0) === side) {
            results.push(p);
          }
        }
        return results;
      })();
      if (players.length === 0) {
        return span(function () {
          color("rgba(255,255,255,.6)");
          return text("no one");
        });
      } else {
        cut = 18;
        while (cut > 1) {
          totalChars = 0;
          for (i = 0, len = players.length; i < len; i++) {
            p = players[i];
            totalChars += 4;
            if (p.faction) {
              totalChars += p.faction.length;
            }
            totalChars += p.name.slice(0, cut).length;
          }
          if (totalChars > maybeChars) {
            cut -= 1;
          } else {
            break;
          }
        }
        results = [];
        for (j = 0, len1 = players.length; j < len1; j++) {
          player = players[j];
          ui.playerChip(player, cut);
          results.push(text(" "));
        }
        return results;
      }
    };
    s = 20;
    div(function () {
      position("absolute");
      top(0);
      left(quarterWidth - s);
      width(s * 2);
      return text("vs");
    });
    div(function () {
      position("absolute");
      top(0);
      right(quarterWidth + s);
      return team("alpha");
    });
    return div(function () {
      position("absolute");
      top(0);
      left(quarterWidth + s);
      return team("beta");
    });
  };

  ui.restartDialog = function () {
    return div(function () {
      var bigRestartButton;
      position("absolute");
      top((window.innerHeight - 500) / 2);
      left(0);
      right(0);
      height(500);
      background_color("rgba(0,0,0,.6)");
      color("white");
      line_height(64);
      font_size(18);
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
            return ui.go("battle");
          });
        }
      );
      div(function () {
        position("absolute");
        top(0);
        left(60);
        text("back to battle");
        return onclick(function () {
          return (ui.mode = "battle");
        });
      });
      h1(function () {
        margin_top(80);
        text_align("center");
        return text("Restart");
      });
      bigRestartButton = function (label, mode) {
        return div(function () {
          var w;
          w = 160;
          position("relative");
          width(w);
          height(136);
          display("inline-block");
          return ui.div_hover_blur(function () {
            position("absolute");
            width(w);
            height(136);
            img(
              {
                src: "img/ui/restart/" + mode + ".png",
                width: 80,
                height: 80,
              },
              function () {
                position("absolute");
                top(0);
                return left((w - 80) / 2);
              }
            );
            div(function () {
              position("absolute");
              bottom(0);
              width(w);
              text_align("center");
              return text(label);
            });
            return onclick(function () {
              var ref;
              track("galaxy_restart", {
                mode: mode,
                starName: (ref = sim.galaxyStar) != null ? ref.name : void 0,
              });
              if (ui.mode !== "galaxy" && sim.galaxyStar) {
                galaxyMode.fightAt(sim.galaxyStar, true);
              }
              return (ui.mode = mode);
            });
          });
        });
      };
      div(function () {
        margin_top(30);
        text_align("center");
        bigRestartButton("Back to Galaxy", "galaxy");
        bigRestartButton("Back to Design", "design");
        return bigRestartButton("Restart Battle", "battle");
      });
      return div(function () {
        var ref;
        width(600);
        margin("20px auto");
        text_align("center");
        font_size(16);
        opacity(".5");
        if ((ref = sim.galaxyStar) != null ? ref.lossTip : void 0) {
          return text("tip: " + sim.galaxyStar.lossTip);
        }
      });
    });
  };
}.call(this));
