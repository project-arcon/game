// here begin src/vbattle.js
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

//line move

var linemove = {};

linemove.center = function (points) {
  var rst = v2.create();
  for (var point of points) {
    v2.add(rst, point);
  }
  return v2.scale(rst, 1 / points.length);
};

// Function from https://stackoverflow.com/a/28866825/6023997
linemove.isIntersecting = function (p1, p2, p3, p4) {
  function ccw(p1, p2, p3) {
    return (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p1[0]);
  }
  return ccw(p1, p3, p4) != ccw(p2, p3, p4) && ccw(p1, p2, p3) != ccw(p1, p2, p4);
};

linemove.findIntersect = function (unit, target, paths) {
  for ([unit2, target2] of paths) {
    if (unit.id != unit2.id && linemove.isIntersecting(unit.pos, target, unit2.pos, target2)) {
      return { unit: unit2, target: target2 };
    }
  }
  return null;
};

linemove.resolvePaths = function (units, targets) {
  var paths = new Map();

  var targets = targets.slice();
  var units = units.slice();
  var uPos = units.map((unit) => unit.pos);

  var d = v2.rotate(v2.sub(linemove.center(uPos), linemove.center(targets)), Math.PI / 2);

  targets.sort(function (a, b) {
    return v2.dot(a, d) - v2.dot(b, d);
  });

  units.sort(function (a, b) {
    a = a.pos;
    b = b.pos;
    return v2.dot(a, d) - v2.dot(b, d);
  });

  units.forEach(function (unit, i) {
    paths.set(unit, targets[i]);
  });

  for ([unit, target] of paths) {
    var d = 500;
    while (d-- > 0) {
      var intersect = linemove.findIntersect(unit, target, paths);
      if (intersect) {
        //                console.log("swapping", unit.id, intersect.unit.id);
        paths.set(unit, intersect.target);
        paths.set(intersect.unit, target);
        target = intersect.target;
      } else {
        //                console.log("solved", unit.id, target);
        break;
      }
      if (d <= 0) console.error("Can't find solution");
    }
  }

  return paths;
};

// Function from istrolid.js
// I changed the last part of this function to reorder movePoints
BattleMode.prototype.computeLineMove = function () {
  var points, selected, totalDistance, u, walkRope;
  selected = commander.selection;
  if (!selected) {
    return;
  }
  selected = (function () {
    var j, len, results;
    results = [];
    for (j = 0, len = selected.length; j < len; j++) {
      u = selected[j];
      if (u.owner === commander.number) {
        results.push(u);
      }
    }
    return results;
  })();
  if (selected.length === 0) {
    return;
  }
  totalDistance = function (points) {
    var distance, j, last, len, point, ref;
    distance = 0;
    last = points[0];
    ref = points.slice(1);
    for (j = 0, len = ref.length; j < len; j++) {
      point = ref[j];
      distance += v2.distance(last, point);
      last = point;
    }
    return distance;
  };
  walkRope = function (points, units, cb) {
    var dir, dist, i, j, last, len, n, point, pos, prev, results, step, stepLeft, total, use;
    total = totalDistance(points);
    if (total === 0 || points.length === 1 || units.length === 1) {
      for (j = 0, len = units.length; j < len; j++) {
        u = units[j];
        cb(points[0], u);
      }
      return;
    }
    step = total / (units.length - 1);
    dir = v2.create();
    pos = v2.create();
    n = 0;
    i = 0;
    stepLeft = 0;
    last = null;
    results = [];
    while (i < units.length) {
      use = function (p) {
        cb(v2.create(p), units[i]);
        stepLeft = step;
        return (i += 1);
      };
      point = points[n];
      if (i === 0) {
        use(point);
        n += 1;
        continue;
      }
      if (i === units.length - 1) {
        use(points[points.length - 1]);
        continue;
      }
      if (n > points.length - 1) {
        use(points[points.length - 1]);
        continue;
      }
      prev = points[n - 1];
      dist = v2.distance(prev, point);
      if (dist === stepLeft) {
        use(point);
        n += 1;
        continue;
      } else if (dist < stepLeft) {
        stepLeft -= dist;
        n += 1;
        continue;
      } else if (dist > stepLeft) {
        v2.set(prev, pos);
        dist = v2.distance(prev, point);
        while (dist > stepLeft) {
          v2.direction(point, prev, dir);
          v2.scale(dir, stepLeft);
          v2.add(pos, dir);
          dist -= stepLeft;
          use(pos);
        }
        n += 1;
        results.push((stepLeft -= dist));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  this.movePoints = [];
  points = this.drawPoints;

  var units = [],
    targets = [];
  walkRope(points, selected, function (point, unit) {
    units.push(unit);
    targets.push(point);
  });

  // Sort them with unit id so BattleMode.prototype.moveOrder gives order correctly
  var paths = new Map([...linemove.resolvePaths(units, targets).entries()].sort((a, b) => a[0].id - b[0].id));
  paths.forEach(function (point, unit) {
    var angle, pos;
    this.movePoints.push(point);
    if (this.shiftOrder && unit.preOrders.length > 0) {
      pos = unit.preOrders.last().dest;
    }
    if (!pos) {
      pos = unit.pos;
    }
    angle = v2.angle(v2.sub(point, pos, v2.create()));
    baseAtlas.drawSprite("img/arrow01.png", point, [1, 1], angle, [255, 255, 255, 255]);
    //drawLine(unit.pos, point); // Draw debug line
  }, this);
};
