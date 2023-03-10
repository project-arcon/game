// here begin src/network.js
(function() {
  var fixServer, getAIRules,
    slice = [].slice;

  window.Connection = (function() {
    function Connection(address) {
      this.address = address;
      console.log("connecting to", this.address);
      this.connect();
    }

    Connection.prototype.connect = function() {
      this.websocket = new WebSocket(this.address);
      this.websocket.binaryType = 'arraybuffer';
      console.log("websocket", this.websocket);
      this.websocket.onopen = (function(_this) {
        return function(e) {
          console.log("ws open", e);
          _this.sendPlayer();
          console.log("sending game key", commander.name, rootNet.gameKey);
          return _this.send("gameKey", commander.name, rootNet.gameKey);
        };
      })(this);
      this.websocket.onclose = (function(_this) {
        return function(e) {
          return console.log("ws close", e);
        };
      })(this);
      this.websocket.onmessage = (function(_this) {
        return function(e) {
          var data, packet;
          stats.netAdd(e.data.byteLength);
          packet = new DataView(e.data);
          data = intp.zJson.loadDv(packet);
          return intp.recv(data);
        };
      })(this);
      return this.websocket.onerror = (function(_this) {
        return function(e) {
          return console.log("ws error", e);
        };
      })(this);
    };

    Connection.prototype.send = function() {
      var args, dv;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (this.websocket.readyState === 1) {
        dv = sim.zJson.dumpDv(args);
        return this.websocket.send(dv);
      }
    };

    Connection.prototype.sendPlayer = function(update) {
      var buildBar, i, j;
      if (update == null) {
        update = true;
      }
      if (!commander) {
        return;
      }
      buildBar = [null, null, null, null, null, null, null, null, null, null];
      for (i = j = 0; j < 10; i = ++j) {
        if (validSpec(commander, commander.buildBar[i])) {
          buildBar[i] = fromShort(commander.buildBar[i]);
        }
      }
      return this.send("playerJoin", commander.id, commander.name, commander.color, buildBar, getAIRules(), false, update);
    };

    Connection.prototype.close = function() {
      return this.websocket.close();
    };

    return Connection;

  })();

  window.RootConnection = (function() {
    function RootConnection(address) {
      this.address = address;
      this.connect();
    }

    RootConnection.prototype.connect = function() {
      this.startTime = Date.now();
      this.websocket = new WebSocket(this.address);
      this.websocket.onopen = (function(_this) {
        return function(e) {
          onecup.refresh();
          account.lastRootSave = {};
          account.connectedToRoot();
          return _this.sendMode();
        };
      })(this);
      this.websocket.onclose = (function(_this) {
        return function(e) {
          onecup.refresh();
          return console.log("root ws close", e);
        };
      })(this);
      this.websocket.onmessage = (function(_this) {
        return function(e) {
          var _, battleMode, k, msg, name, player, ref, ref1, ref2, ref3, s, server, v;
          onecup.refresh();
          msg = JSON.parse(e.data);
          switch (msg[0]) {
            case "serversStats":
              return _this.serversStats = msg[1];
            case "servers":
              _this.servers = {};
              ref = msg[1];
              for (_ in ref) {
                s = ref[_];
                fixServer(s);
                _this.servers[s.name] = s;
              }
              if (typeof battleMode !== "undefined" && battleMode !== null ? battleMode.serverName : void 0) {
                battleMode = (ref1 = rootNet.servers) != null ? ref1[battleMode.serverName] : void 0;
              }
              return onecup.refresh();
            case "serversDiff":
              ref2 = msg[1];
              for (name in ref2) {
                server = ref2[name];
                if (server === null) {
                  delete _this.servers[name];
                } else {
                  if (_this.servers[name] == null) {
                    _this.servers[name] = {};
                  }
                  for (k in server) {
                    v = server[k];
                    _this.servers[name][k] = v;
                  }
                  fixServer(_this.servers[name]);
                }
              }
              return onecup.refresh();
            case "players":
              chat.players = msg[1];
              return onecup.refresh();
            case "playersDiff":
              ref3 = msg[1];
              for (name in ref3) {
                player = ref3[name];
                if (player === null) {
                  delete chat.players[name];
                } else {
                  if (chat.players[name] == null) {
                    chat.players[name] = {};
                  }
                  for (k in player) {
                    v = player[k];
                    chat.players[name][k] = v;
                  }
                }
              }
              return onecup.refresh();
            case "message":
              msg[1].time = Date.now();
              chat.lines.push(msg[1]);
              return after(100, function() {
                var chatarea;
                chatarea = document.getElementById("chatarea");
                if (chatarea) {
                  return chatarea.scrollTop = 100000;
                }
              });
            case "messageLog":
              msg[1].time = 0;
              return chat.lines.push(msg[1]);
            case "authError":
              return account.authError(msg[1]);
            case "authPasswordChanged":
              return ui.changePassword = false;
            case "login":
              return account.signinReply(msg[1]);
            case "windowClose":
              return window.close();
            case "windowReload":
              return location.reload();
            case "modInfo":
              console.log("modInfo", msg);
              return mod.info = msg[1];
            case "modLog":
              console.log("modLog", msg);
              return mod.log = msg[1];
            case "gameKey":
              return _this.gameKey = msg[1];
          }
        };
      })(this);
      return this.websocket.onerror = (function(_this) {
        return function(e) {
          return console.log("root ws error", e);
        };
      })(this);
    };

    RootConnection.prototype.send = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (this.websocket.readyState === 1) {
        return this.websocket.send(JSON.stringify(args));
      }
    };

    RootConnection.prototype.playerMode = function() {
      var mode;
      mode = ui.mode;
      if (mode === "battle") {
        if (sim.galaxyStar) {
          mode = "galaxy*";
        } else if (sim.challenge) {
          mode = "challenge*";
        } else if (sim.local) {
          mode = "local*";
        }
      }
      return mode;
    };

    RootConnection.prototype.sendMode = function() {
      return this.send("setMode", this.playerMode(), chat.channel);
    };

    return RootConnection;

  })();

  window.replays = {};

  replays.recording = [];

  getAIRules = function() {
    if (localStorage.useAi !== "true") {
      return null;
    }
    return ais.buildBar2aiRules(commander.buildBar);
  };

  fixServer = function(server) {
    if (!Array.isArray(server.players)) {
      return server.players = [];
    }
  };

  window.Local = (function() {
    function Local() {}

    Local.prototype.sendPlayer = function() {
      var buildBar, i, j;
      if (!commander) {
        return;
      }
      buildBar = [null, null, null, null, null, null, null, null, null, null];
      for (i = j = 0; j < 10; i = ++j) {
        if (validSpec(commander, commander.buildBar[i])) {
          buildBar[i] = fromShort(commander.buildBar[i]);
        }
      }
      return this.send("playerJoin", commander.id, commander.name, commander.color, buildBar, getAIRules());
    };

    Local.prototype.send = function() {
      var args, dv, j, len, p, player, ref, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      dv = (ref = sim.zJson).dumpDv.apply(ref, args);
      player = null;
      ref1 = sim.players;
      for (j = 0, len = ref1.length; j < len; j++) {
        p = ref1[j];
        if (p.id === commander.id) {
          player = p;
          player.active = true;
        }
      }
      return sim[args[0]].apply(sim, [player].concat(slice.call(args.slice(1))));
    };

    return Local;

  })();

}).call(this);
;


