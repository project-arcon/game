// here begin src/mod.js
(function() {
  var chatLine;

  eval(onecup["import"]());

  window.mod = {};

  mod.player = "";

  css(".hover-green", function() {
    background_color("rgba(0,255,0,.2)");
    return css(":hover", function() {
      return background_color("rgba(0,255,0,.5)");
    });
  });

  ui.modPage = function() {
    div(function() {
      position("absolute");
      top(0);
      left(0);
      width(300);
      bottom(200);
      background_color("rgba(0,0,0,.5)");
      color("white");
      overflow_y("scroll");
      overflow_x("hidden");
      div(".hover-black", function() {
        padding(15);
        text("Main");
        return onclick(function() {
          mod.info = null;
          mod.player = "";
          mod.chanFilter = "";
          return rootNet.send("command", ["modLog"]);
        });
      });
      input({
        type: "text",
        placeholder: "name",
        value: mod.player
      }, function() {
        width(300);
        font_size(20);
        padding(5);
        line_height(30);
        border("none");
        background_color("rgba(0,0,0,.5)");
        color("white");
        oninput(function(e) {
          return mod.player = e.target.value;
        });
        return onkeypress(function(e) {
          if (e.which === 13) {
            mod.info = null;
            return rootNet.send("command", ["modInfo", mod.player]);
          }
        });
      });
      if (mod.info) {
        if (mod.info.alts) {
          return div(function() {
            var alt, i, infoField, len, ref, results;
            user_select("text");
            padding(5);
            text("possible alts (not accureate)");
            ref = mod.info.alts;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              alt = ref[i];
              alt.afk = false;
              div(function() {
                return ui.playerChip(alt);
              });
              infoField = function(f) {
                return div(function() {
                  if (mod.info.player[f] === alt[f]) {
                    color("rgba(255,255,255,.6)");
                  } else {
                    color("rgba(255,255,255,.25)");
                  }
                  font_size(10);
                  return text(alt[f]);
                });
              };
              infoField("ip");
              infoField("email");
              results.push(infoField("fingerprint"));
            }
            return results;
          });
        }
      }
    });
    div(function() {
      position("absolute");
      left(0);
      width(300);
      height(200);
      bottom(0);
      background_color("rgba(0,0,0,.5)");
      color("white");
      return;
      div(".hover-red", function() {
        padding(5);
        return text("mute 15min");
      });
      div(".hover-red", function() {
        padding(5);
        return text("mute 1h");
      });
      div(".hover-green", function() {
        padding(5);
        return text("unmute");
      });
      div(".hover-red", function() {
        padding(5);
        return text("ban 1h");
      });
      div(".hover-red", function() {
        padding(5);
        return text("ban 24h");
      });
      div(".hover-red", function() {
        padding(5);
        return text("ban 7d");
      });
      return div(".hover-green", function() {
        padding(5);
        return text("unban");
      });
    });
    div(function() {
      var i, j, len, len1, msg, ref, ref1, ref2, ref3, results, results1;
      position("absolute");
      top(0);
      left(300);
      right(0);
      bottom(30);
      padding(5);
      background_color("rgba(0,0,0,.6)");
      color("white");
      overflow("auto");
      user_select("text");
      if ((ref = mod.info) != null ? ref.chatLog : void 0) {
        ref1 = mod.info.chatLog;
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
          msg = ref1[i];
          results.push(chatLine(msg));
        }
        return results;
      } else if ((ref2 = mod.log) != null ? ref2.chatLog : void 0) {
        ref3 = mod.log.chatLog.slice(mod.log.chatLog.length - 5000);
        results1 = [];
        for (j = 0, len1 = ref3.length; j < len1; j++) {
          msg = ref3[j];
          results1.push(chatLine(msg));
        }
        return results1;
      }
    });
    return input({
      type: "text"
    }, function() {
      border("none");
      position("absolute");
      left(300);
      width(window.innerWidth - 300);
      bottom(0);
      height(30);
      padding(5);
      background_color("rgba(0,0,0,.8)");
      return color("white");
    });
  };

  chatLine = function(msg) {
    if (mod.chanFilter && msg.channel !== mod.chanFilter) {
      return;
    }
    return div(function() {
      span(".hover-black", function() {
        display("ineline-block");
        text("F");
        padding("0px 5px");
        return onclick(function() {
          mod.player = msg.name;
          return rootNet.send("command", ["modInfo", mod.player]);
        });
      });
      span(".hover-black", function() {
        display("ineline-block");
        text("S");
        padding("0px 5px");
        return onclick(function() {
          return mod.chanFilter = msg.channel;
        });
      });
      ui.playerChip(msg, 20, "#AAA");
      padding(3);
      text(": ");
      return raw(linky.linkfy(msg.text));
    });
  };

}).call(this);
;


