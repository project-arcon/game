// here begin src/chat.js
(function() {
  var canJoinServer, closeToStart, drawLocal, drawPlayers, drawPrivateServer, drawPrivateServerFoldOut, drawServer, drawServers, numRealPlayers, playerItem, sizeOf;

  eval(onecup["import"]());

  window.chat = {};

  chat.players = {};

  sizeOf = function(map) {
    var k, l;
    l = 0;
    for (k in map) {
      l += 1;
    }
    return l;
  };

  chat.room = function() {
    var sideWidth;
    sideWidth = window.innerWidth / 4;
    div(function() {
      color("white");
      position("absolute");
      top(64);
      bottom(84);
      left(0);
      width(sideWidth);
      overflow_y("auto");
      background_color("rgba(0,0,0,.1)");
      return drawServers();
    });
    return div(function() {
      color("white");
      position("absolute");
      top(64);
      bottom(84);
      right(0);
      width(sideWidth);
      overflow_y("auto");
      background_color("rgba(0,0,0,.3)");
      return drawPlayers();
    });
  };

  ui.serverSearch = null;

  drawServers = function(m) {
    var _, j, len, results, server, servers, str;
    drawLocal();
    div(function() {
      position("relative");
      padding(10);
      height(40);
      background_color("rgba(255,255,255,.1)");
      padding_left(20);
      return text("Servers List");
    });
    input("#serversearch", {
      type: "text",
      value: ui.serverSearch,
      placeholder: "search servers"
    }, function() {
      padding(10);
      font_size(16);
      color("white");
      display("block");
      border("none");
      width("100%");
      background_color("rgba(0,0,0,.5)");
      return oninput(function(e) {
        return ui.serverSearch = e.target.value;
      });
    });
    servers = (function() {
      var ref, results;
      ref = rootNet.servers;
      results = [];
      for (_ in ref) {
        server = ref[_];
        results.push(server);
      }
      return results;
    })();
    servers.sort(function(a, b) {
      var avalue, bvalue;
      avalue = closeToStart(a) * 100 + numRealPlayers(a);
      bvalue = closeToStart(b) * 100 + numRealPlayers(b);
      if (a.state !== "waiting") {
        avalue = -a.observers;
      }
      if (b.state !== "waiting") {
        bvalue = -b.observers;
      }
      if (avalue === bvalue) {
        return a.name.localeCompare(b.name);
      }
      return bvalue - avalue;
    });
    results = [];
    for (j = 0, len = servers.length; j < len; j++) {
      server = servers[j];
      if (server.hidden) {
        continue;
      }
      if (ui.serverSearch) {
        str = server.name + " " + server.type;
        if (str.toLowerCase().indexOf(ui.serverSearch.toLowerCase()) === -1) {
          continue;
        }
      }
      results.push(drawServer(server));
    }
    return results;
  };

  drawLocal = function() {
    return div(".hover-black", function() {
      position("relative");
      height(40);
      padding_top(10);
      if (sim.local) {
        background_color("rgba(0,0,0,.4)");
      }
      div(function() {
        position("absolute");
        left(20);
        return text("Play vs AI");
      });
      return onclick(function() {
        battleMode.joinLocal();
        return ui.go("battleroom");
      });
    });
  };

  drawPrivateServerFoldOut = false;

  drawPrivateServer = function() {
    div(".hover-black", function() {
      position("relative");
      height(40);
      padding_top(10);
      if (sim.local) {
        background_color("rgba(0,0,0,.4)");
      }
      div(function() {
        position("absolute");
        left(20);
        return text("Host Private Server");
      });
      return onclick(function() {
        return drawPrivateServerFoldOut = !drawPrivateServerFoldOut;
      });
    });
    if (drawPrivateServerFoldOut) {
      return div(function() {
        return padding(10);
      });
    }
  };

  numRealPlayers = function(server) {
    var alpha, beta, j, len, p, ref;
    alpha = 0;
    beta = 0;
    ref = server.players;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      if (p.side === "alpha") {
        alpha += 1;
      }
      if (p.side === "beta") {
        beta += 1;
      }
    }
    return alpha + beta;
  };

  closeToStart = function(server) {
    var alphas, betas, hasAis, j, len, num, p, ref;
    hasAis = false;
    alphas = 0;
    betas = 0;
    ref = server.players;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      if (p.side === "alpha") {
        alphas += 1;
      }
      if (p.side === "beta") {
        betas += 1;
      }
    }
    num = ui.serverNeedNumPlayers(server);
    if (alphas + betas === num + num - 1) {
      return true;
    }
    return false;
  };

  canJoinServer = function(server) {
    if (server.players.length > 12) {
      return false;
    }
    if (server.version !== window.VERSION) {
      return false;
    }
    return true;
  };

  drawServer = function(server) {
    var avgRank, j, len, maxRank, nPlayers, player, rank, ref, totalRank;
    totalRank = 0;
    maxRank = 0;
    nPlayers = 0;
    ref = server.players;
    for (j = 0, len = ref.length; j < len; j++) {
      player = ref[j];
      if (player.side !== "spectators" && !player.ai) {
        rank = findRank(player.name);
        maxRank = Math.max(maxRank, rank);
        totalRank += rank;
        nPlayers += 1;
      }
    }
    avgRank = totalRank / nPlayers;
    return div(".hover-black", function() {
      var connected;
      position("relative");
      height(40);
      padding_top(10);
      if (canJoinServer(server)) {
        connected = server.address === network.address;
        if (connected) {
          background_color("rgba(0,0,0,.4)");
        }
        onclick(function() {
          ui.mode = "battleroom";
          return battleMode.joinServer(server.name);
        });
      } else {
        opacity(".5");
      }
      img({
        src: rankImage(maxRank),
        width: 20,
        height: 20
      }, function() {
        position("absolute");
        top(8);
        return left(4);
      });
      div(function() {
        position("absolute");
        left(28);
        text(server.type);
        text(" ");
        text(" ");
        return text(server.name);
      });
      if (window.innerWidth > 1000) {
        div(function() {
          position("absolute");
          right(80);
          if (server.version !== window.VERSION) {
            text("v" + server.version);
            if (server.version < window.VERSION) {
              return text("(older)");
            } else {
              return text("(newer)");
            }
          } else if (server.state !== "waiting") {
            return text(server.state);
          } else if (closeToStart(server)) {
            return text("+1 more");
          }
        });
        return div(function() {
          position("absolute");
          right(20);
          return text(server.observers);
        });
      }
    });
  };

  ui.playerSearch = "";

  drawPlayers = function() {
    var _, fullname, hasFriends, isFriend, j, len, len1, len2, n, name, o, offline, online, player, playerSearch, players, ref, ref1, results;
    players = [];
    playerSearch = ui.playerSearch.toLowerCase();
    ref = chat.players;
    for (_ in ref) {
      player = ref[_];
      if (playerSearch) {
        fullname = player.faction + player.name;
        if (fullname.toLowerCase().indexOf(playerSearch) !== -1) {
          players.unshift(player);
        }
      } else {
        players.unshift(player);
      }
    }
    players = players.sort(function(a, b) {
      return (b.rank || 0) - (a.rank || 0);
    });
    players = players.slice(0, 200);
    div(function() {
      position("relative");
      padding(10);
      height(40);
      background_color("rgba(255,255,255,.1)");
      padding_left(20);
      return text("Players (" + (sizeOf(chat.players)) + "):");
    });
    div(".hover-black", function() {
      padding(10);
      font_size(16);
      color("white");
      display("block");
      border("none");
      width("100%");
      text("Discord Voice Chat");
      return onclick(function() {
        return onecup.newTab("https://discord.gg/stX3pmF");
      });
    });
    input("#playersearch", {
      type: "text",
      value: ui.playerSearch,
      placeholder: "search players"
    }, function() {
      padding(10);
      font_size(16);
      color("white");
      display("block");
      border("none");
      width("100%");
      background_color("rgba(0,0,0,.5)");
      return oninput(function(e) {
        return ui.playerSearch = e.target.value;
      });
    });
    div(function() {
      return height(10);
    });
    hasFriends = false;
    online = [];
    offline = [];
    ref1 = commander.friends;
    for (name in ref1) {
      isFriend = ref1[name];
      if (isFriend && name.toLowerCase().indexOf(playerSearch) !== -1) {
        (name in chat.players ? online : offline).push(name);
        hasFriends = true;
      }
    }
    online.sort();
    offline.sort();
    for (j = 0, len = online.length; j < len; j++) {
      name = online[j];
      playerItem(chat.players[name]);
    }
    for (n = 0, len1 = offline.length; n < len1; n++) {
      name = offline[n];
      playerItem({
        name: name
      });
    }
    if (hasFriends) {
      div(function() {
        return height(20);
      });
    }
    results = [];
    for (o = 0, len2 = players.length; o < len2; o++) {
      player = players[o];
      results.push(playerItem(player));
    }
    return results;
  };

  playerItem = function(player) {
    return div(function() {
      var _, j, len, p, playerOnServer, ref, ref1, server;
      position("relative");
      padding("0px 10px");
      height(30);
      ui.playerChip(player);
      if (window.innerWidth > 1000) {
        playerOnServer = null;
        ref = rootNet.servers;
        for (_ in ref) {
          server = ref[_];
          if (server.players) {
            ref1 = server.players;
            for (j = 0, len = ref1.length; j < len; j++) {
              p = ref1[j];
              if (p.name === player.name) {
                playerOnServer = server;
                break;
              }
            }
          }
        }
        if (playerOnServer) {
          return div(".hover-black", function() {
            position("absolute");
            top(0);
            right(10);
            font_size(14);
            text(playerOnServer.name);
            padding(4);
            if (canJoinServer(playerOnServer)) {
              return onclick(function() {
                return battleMode.joinServer(playerOnServer.name);
              });
            } else {
              return opacity(".5");
            }
          });
        } else {
          return div(function() {
            position("absolute");
            top(4);
            right(20);
            font_size(14);
            return text(player.mode);
          });
        }
      }
    });
  };

  chat.lines = [];

  chat.scrollLock = true;

  chat.lastMessage = null;

  chat.lastMode = null;

  chat.draw = function(fullLobby) {
    var chatLocation, m, messages, ref, ref1;
    if (ui.mode === "multiplayer") {
      chat.channel = void 0;
    } else if (typeof battleMode !== "undefined" && battleMode !== null ? (ref = battleMode.server) != null ? ref.name : void 0 : void 0) {
      chat.channel = battleMode.server.name;
    } else {
      chat.channel = "local";
    }
    messages = (function() {
      var j, len, ref1, results;
      ref1 = chat.lines;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        m = ref1[j];
        if (m.channel === chat.channel) {
          results.push(m);
        }
      }
      return results;
    })();
    if ((ref1 = ui.mode) === "menu" || ref1 === "settings" || ref1 === "galaxy" || ref1 === "campaigns" || ref1 === "profile" || ref1 === "controls" || ref1 === "sound" || ref1 === "challenges" || ref1 === "fleet") {
      return;
    } else if (ui.mode === "multiplayer" || ui.mode === "battleroom") {
      chatLocation = "middle";
      messages = messages.slice(-200);
    } else if (ui.chatToggle) {
      chatLocation = "sidePanel";
      messages = messages.slice(-50);
    } else if (ui.chatting) {
      chatLocation = "sidePanel";
      messages = messages.slice(-50);
    } else if (localStorage.chatSilent === "true") {
      return;
    } else {
      messages = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = messages.length; j < len; j++) {
          m = messages[j];
          if (m.time + 10000 > Date.now()) {
            results.push(m);
          }
        }
        return results;
      })();
      if (messages) {
        chatLocation = "sliver";
      } else {
        return;
      }
    }
    if (chatLocation === "sidePanel") {
      div("#chat-x", function() {
        position("absolute");
        top(64);
        right(0);
        padding(10);
        color("white");
        z_index('2');
        text("X");
        return onclick(function() {
          return ui.chatToggle = false;
        });
      });
    }
    div("#chat-messages", function() {
      var quarterWidth;
      position("absolute");
      overflow_x("hidden");
      overflow_y("auto");
      background_color("rgba(0,0,0,.8)");
      z_index("1");
      quarterWidth = window.innerWidth / 4;
      switch (chatLocation) {
        case "sidePanel":
          top(64);
          bottom(84 + 30);
          right(0);
          width(quarterWidth);
          break;
        case "middle":
          top(64);
          bottom(84 + 30);
          left(quarterWidth);
          right(quarterWidth);
          break;
        case "sliver":
          bottom(84);
          right(0);
          width(quarterWidth);
      }
      onecup.post_render(function() {
        var j, len, line, newHeight, oldHeight, oldScrollTop, ref2, top, wrapper, wrapperGrew;
        top = 0;
        messages = onecup.lookup("#chat-messages");
        wrapper = onecup.lookup("#chat-wrapper");
        oldScrollTop = messages.scrollTop;
        oldHeight = wrapper.clientHeight;
        ref2 = onecup.lookup(".chat-message");
        for (j = 0, len = ref2.length; j < len; j++) {
          line = ref2[j];
          line.style.top = top + "px";
          top += line.clientHeight;
        }
        newHeight = top;
        wrapperGrew = newHeight - oldHeight;
        wrapper.style.height = top + "px";
        if (wrapperGrew > 0) {
          return messages.scrollTop += wrapperGrew;
        }
      });
      return div("#chat-wrapper", function() {
        var j, len, msg, results;
        position("relative");
        height("0px");
        results = [];
        for (j = 0, len = messages.length; j < len; j++) {
          msg = messages[j];
          if (commander.mutes[msg.name]) {
            continue;
          }
          results.push(p(".chat-message", function() {
            position("absolute");
            top(0);
            left(0);
            padding(2);
            font_size(16);
            if (msg.name === commander.name) {
              color("white");
            } else {
              color("#AAA");
            }
            ui.playerChip(msg, 20, "#AAA");
            padding(3);
            text(": ");
            return raw(linky.linkfy(msg.text));
          }));
        }
        return results;
      });
    });
    return input("#chat", {
      autocomplete: "off"
    }, function() {
      var quarterWidth;
      position("absolute");
      height(30);
      font_size(16);
      border("none");
      color("white");
      background_color("rgba(25,00,00,.8)");
      z_index("2");
      quarterWidth = window.innerWidth / 4;
      switch (chatLocation) {
        case "sidePanel":
          bottom(84);
          right(0);
          width(quarterWidth);
          break;
        case "middle":
          bottom(84);
          left(quarterWidth);
          width(quarterWidth * 2);
          break;
        case "sliver":
          display("none");
      }
      onblur(function() {
        return ui.chatting = false;
      });
      return onkeydown(function(e) {
        var _, commandArray, i, j, len, message, p, players, ref2, text, word, words;
        if (e.which === 27) {
          ui.chatting = false;
          e.target.blur();
        }
        if (e.which === 9) {
          words = e.target.value.split(/[\s\"]+/);
          word = words[words.length - 1];
          players = [];
          ref2 = chat.players;
          for (_ in ref2) {
            p = ref2[_];
            if (p.name.startsWith(word)) {
              players.push(p.name);
            }
          }
          console.log("tab", word, players);
          if (players.length === 1) {
            e.target.value += players[0].slice(word.length);
          }
          e.preventDefault();
        }
        if (e.which === 13) {
          if (e.target.value === "") {
            e.target.blur();
            ui.chatting = false;
            return;
          }
          text = e.target.value.trim();
          if (text[0] === "/") {
            commandArray = text.slice(1).match(/('.*?'|".*?"|\S+)/g);
            if (!commandArray) {
              return;
            }
            for (i = j = 0, len = commandArray.length; j < len; i = ++j) {
              word = commandArray[i];
              if (word[0] === '"') {
                commandArray[i] = word.slice(1, word.length - 1);
              }
            }
            console.log("command", commandArray);
            rootNet.send("command", commandArray);
            return e.target.value = "";
          } else if (chat.channel === "local") {
            chat.lines.push({
              text: text,
              name: commander.name,
              color: commander.color,
              channel: chat.channel,
              time: Date.now()
            });
            return e.target.value = "";
          } else {
            message = {
              text: text,
              channel: chat.channel
            };
            rootNet.send("message", message);
            return e.target.value = "";
          }
        }
      });
    });
  };

}).call(this);
;


