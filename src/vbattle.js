(function () {
  eval(onecup["import"]());

  environment = {
    timer_enabled: true,
    tracker_enabled: true,
  };

  // --Timer--
  seconds_to_string = function (seconds) {
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    if (JSON.stringify(numminutes).length == 1) numminutes = "0" + numminutes;
    if (JSON.stringify(numseconds).length == 1) numseconds = "0" + numseconds;
    return numminutes + ":" + numseconds;
  };

  draw_timer = function () {
    div(function () {
      position("absolute");
      bottom(126);

      left(0);

      width(96);
      height(32);

      background("rgba(0,0,0,.1)");
      border_radius("0px 10px 0px 0px");

      text_align("center");
      font_size(30);
      color("white");
      if (sim.state == "running") text(seconds_to_string(Math.round(sim.step / 16)));
      else text("00:00");
    });
  };

  // --Tracker--
  draw_tracker = function () {
    return div(function () {
      position("absolute");
      top(64);
      left("50%");
      transform("translate(-50%, 0)");

      width(350);
      height(90);

      background("rgba(0,0,0,.4)");
      border_radius("0px 0px 10px 10px");
      color("white");

      onclick(function () {
        if (ui.mode !== "battle") {
          return (ui.mode = "battle");
        } else {
          return (ui.mode = "quickscore");
        }
      });

      function get_team_stats(team) {
        var value = 0;
        var money = 0;
        var eco = 10;

        for (var i in intp.things) {
          var thing = intp.things[i];
          if (thing.unit && thing.side === team) {
            value += thing.cost;
          }
          if (thing.capping !== undefined && thing.side === team) {
            eco++;
          }
        }

        for (var player of intp.players) {
          if (player.side === team) {
            money += player.money;
          }
        }

        return { value, money, eco };
      }

      function draw_team_stats(side, align) {
        var stats = get_team_stats(side);
        th(function () {
          height(30);
          position("absolute");

          align === "left" ? left(10) : right(10);
          tr(function () {
            width(400);
            text_align(align);
            text(side.charAt(0).toUpperCase() + side.slice(1));
          });
          tr(function () {
            font_size(10);
            text_align(align);
            text("eco: " + stats.eco);
          });
          tr(function () {
            width(100);
            text_align(align);
            return text("money: $" + stats.money);
          });
          return tr(function () {
            width(100);
            text_align(align);
            return text("value: $" + stats.value);
          });
        });
      }

      table(function () {
        padding(10);
        draw_team_stats("alpha", "left");
        draw_team_stats("beta", "right");
      });
    });
  };

  try {
    window_body_orig = window.body;
  } catch (e) {}

  window.body = (e) => {
    if (ui.mode === "battle") {
      if (environment.timer_enabled) draw_timer();
      if (environment.tracker_enabled) draw_tracker();
      onecup.refresh();
    }
    return window_body_orig.call(this, e);
  };
}.call(this));
