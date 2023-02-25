(function () {
  var PRIME, clamp, overlapRectCircle;

  PRIME = 677;

  clamp = function (value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  };

  overlapRectCircle = function (point, radius, x, y, w, h) {
    var dx, dy;
    dx = point[0] - clamp(point[0], x, x + w);
    dy = point[1] - clamp(point[1], y, y + h);
    return dx * dx + dy * dy <= radius * radius;
  };

  window.HSpace = (function () {
    function HSpace(resolution) {
      this.resolution = resolution;
      this.hash = new Map();
    }

    HSpace.prototype.key = function (pos) {
      return Math.floor(pos[0] / this.resolution) + Math.floor(pos[1] / this.resolution) * PRIME;
    };

    HSpace.prototype.insert = function (thing) {
      var posKey, things;
      posKey = this.key(thing.pos);
      things = this.hash.get(posKey);
      if (things == null) {
        return this.hash.set(posKey, [thing]);
      } else {
        return things.push(thing);
      }
    };

    HSpace.prototype.findInRange = function (point, range, cb) {
      var d, i, j, k, len, posKey, px, py, ref, ref1, ref2, ref3, rx, ry, thing, things, x, y;
      sim.timeStart("findInRange");
      d = Math.floor(range / this.resolution) + 1;
      px = Math.floor(point[0] / this.resolution);
      py = Math.floor(point[1] / this.resolution);
      for (x = i = ref = -d, ref1 = d + 1; ref <= ref1 ? i < ref1 : i > ref1; x = ref <= ref1 ? ++i : --i) {
        for (y = j = ref2 = -d, ref3 = d + 1; ref2 <= ref3 ? j < ref3 : j > ref3; y = ref2 <= ref3 ? ++j : --j) {
          rx = px + x;
          ry = py + y;
          if (overlapRectCircle(point, range, rx * this.resolution, ry * this.resolution, this.resolution, this.resolution)) {
            posKey = rx + ry * PRIME;
            things = this.hash.get(posKey);
            if (things) {
              for (k = 0, len = things.length; k < len; k++) {
                thing = things[k];
                if (cb(thing)) {
                  sim.timeEnd("findInRange");
                  return;
                }
              }
            }
          }
        }
      }
      sim.timeEnd("findInRange");
    };

    return HSpace;
  })();
}.call(this));
