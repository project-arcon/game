(function () {
  var NxN,
    SIZE,
    offset,
    partSize,
    modulo = function (a, b) {
      return ((+a % (b = +b)) + b) % b;
    };

  NxN = 24;

  SIZE = 20;

  window.validSpec = function (player, spec) {
    var issue;
    issue = hasIssue(player, spec);
    return issue === null;
  };

  window.hasIssue = function (player, spec) {
    var badParts, check, e, grid, hasPart, j, k, len, len1, part, ref, ref1, ref2, size, unit, w, x, y;
    try {
      unit = new types.Unit(spec);
      if (unit.parts.length === 0) {
        return "No parts, drag parts from the left.";
      }
      if (unit.cost > sim.costLimit + unit.limitBonus) {
        return "Ship too big, cost can't be over $" + (sim.costLimit + unit.limitBonus) + ".";
      }
      if (unit.parts.length > 800) {
        return "Too many parts";
      }
      if (unit.name.length > 50) {
        return "Name too long";
      }
      ref = unit.parts;
      for (j = 0, len = ref.length; j < len; j++) {
        part = ref[j];
        size = partSize(part);
        x = part.pos[0] / SIZE + NxN / 2 - size[0] / 2;
        y = part.pos[1] / SIZE + NxN / 2 - size[1] / 2;
        if ((modulo(x, 1) > 0.0001 && modulo(x, 1) < 0.9999) || (modulo(y, 1) > 0.0001 && modulo(y, 1) < 0.9999)) {
          return "Invalid part placement";
        }
        if (part.disable) {
          return "Has parts that have been discontinued.";
        }
        if (part.ghostCopy) {
          return "Has parts from a copied ship.";
        }
        if (!part.dir < 0 || part.dir > 3 || modulo(part.dir, 1) !== 0) {
          return "Invalid part rotation";
        }
        if (!(part.dir === 0 || part.canRotate)) {
          return "Part cannot rotate";
        }
        if (!player.ai) {
          if (!(typeof account !== "undefined" && account !== null ? account.hasDLC(part.dlc) : void 0)) {
            return "Please support us by getting " + part.dlc + " DLC and unlock " + part.name + ".";
          }
          if (!(typeof account !== "undefined" && account !== null ? account.hasDLCBonus() : void 0) && part.dir && part.dir !== 0) {
            return "Part rotation is currently only available to <a href='http://store.steampowered.com/app/472490' target='_blank'>supporters who get a DLC</a>.";
          }
        }
      }
      hasPart = function (name) {
        var k, len1, ref1;
        ref1 = unit.parts;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          part = ref1[k];
          if (part.constructor.name === name) {
            return true;
          }
        }
        return false;
      };
      (ref1 = computeGrid(player, unit)), (grid = ref1[0]), (badParts = ref1[1]);
      if (badParts.length > 0) {
        return "Ship has parts outside the build area.";
      }
      check = function (fn) {
        var k, l, ref2, ref3, t;
        for (x = k = 0, ref2 = NxN; 0 <= ref2 ? k < ref2 : k > ref2; x = 0 <= ref2 ? ++k : --k) {
          for (y = l = 0, ref3 = NxN; 0 <= ref3 ? l < ref3 : l > ref3; y = 0 <= ref3 ? ++l : --l) {
            t = grid[x][y];
            if (fn(t)) {
              return true;
            }
          }
        }
        return false;
      };
      if (!player.ai) {
        if (
          check(function (t) {
            return t.locked;
          })
        ) {
          return "Has parts that have not been unlocked.";
        }
      }
      if (
        check(function (t) {
          return t.overlap;
        })
      ) {
        return "Parts should not overlap.";
      }
      if (
        check(function (t) {
          return t.exhaust && t.solid;
        })
      ) {
        return "Engine exhaust must not hit another part.";
      }
      if (
        check(function (t) {
          return t.solid && !t.fill;
        })
      ) {
        return "All ship parts must be connected.";
      }
      if (
        check(function (t) {
          return t.bad && t.gimble;
        })
      ) {
        return "Weapons must be placed on a mount.";
      }
      if (
        check(function (t) {
          return t.noTurret;
        })
      ) {
        return "Mount has no turret attached.";
      }
      if (
        check(function (t) {
          return t.noEffect;
        })
      ) {
        return "Part needs to be next to a weapon.";
      }
      if (
        check(function (t) {
          return t.cantPaint;
        })
      ) {
        return "Decal can't be placed like this. Decals go on armor or batteries.";
      }
      if (
        check(function (t) {
          return t.overPaint;
        })
      ) {
        return "Decal overlaps with another decal.";
      }
      if (
        check(function (t) {
          return t.bad;
        })
      ) {
        return "Improperly placed part.";
      }
      if (unit.storeEnergy === 0) {
        return "No energy storage, add battery or reactor.";
      }
      if (unit.maxSpeed === 0) {
        return "Can't move, add engines.";
      }
      if (unit.jumpDistance > 0 && unit.jumpDistance < unit.minJump) {
        return "Insufficient jump power for mass. Add more jump drives.";
      }
      ref2 = unit.weapons;
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        w = ref2[k];
        if (w.minRange > w.range) {
          return "Minimum range exceeds weapon range.";
        }
      }
      return null;
    } catch (error) {
      e = error;
      console.log("exception e", e);
      return "Part parse error... thats odd?";
    }
  };

  window.genBuildPic = function (spec) {};

  offset = function (part) {
    var xoff, yoff;
    if (part.size[0] % 2 === 1) {
      xoff = 1;
    } else {
      xoff = 0;
    }
    if (part.size[1] % 2 === 1) {
      yoff = 1;
    } else {
      yoff = 0;
    }
    if (part.dir % 2 === 0) {
      return [xoff, yoff];
    } else {
      return [yoff, xoff];
    }
  };

  partSize = function (part) {
    var xsize, ysize;
    xsize = part.size[0];
    ysize = part.size[1];
    if (part.dir % 2 === 0) {
      return [xsize, ysize];
    } else {
      return [ysize, xsize];
    }
  };

  window.computeGrid = function (player, unit, removCb) {
    var ax,
      ay,
      badParts,
      ey,
      getXY,
      grid,
      i,
      j,
      k,
      l,
      len,
      len1,
      len2,
      m,
      n,
      newSet,
      o,
      openSet,
      p,
      part,
      parts,
      px,
      py,
      q,
      r,
      ref,
      ref1,
      ref10,
      ref11,
      ref12,
      ref13,
      ref14,
      ref15,
      ref16,
      ref17,
      ref18,
      ref19,
      ref2,
      ref20,
      ref21,
      ref22,
      ref23,
      ref24,
      ref25,
      ref26,
      ref27,
      ref28,
      ref29,
      ref3,
      ref30,
      ref4,
      ref5,
      ref6,
      ref7,
      ref8,
      ref9,
      root,
      s,
      size,
      t,
      u,
      ws,
      x,
      y;
    parts = unit.parts;
    getXY = function (part) {
      var size, x, y;
      size = partSize(part);
      x = Math.round(part.pos[0] / SIZE + NxN / 2 - size[0] / 2);
      y = Math.round(part.pos[1] / SIZE + NxN / 2 - size[1] / 2);
      return [x, y];
    };
    grid = [];
    badParts = [];
    for (i = j = 0, ref = NxN; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      grid.push(
        (function () {
          var k, ref1, results;
          results = [];
          for (n = k = 0, ref1 = NxN; 0 <= ref1 ? k < ref1 : k > ref1; n = 0 <= ref1 ? ++k : --k) {
            results.push({});
          }
          return results;
        })()
      );
    }
    if (parts.length === 0) {
      return [grid, badParts];
    }
    root = parts[0];
    for (k = 0, len = parts.length; k < len; k++) {
      part = parts[k];
      size = partSize(part);
      for (px = l = 0, ref1 = size[0]; 0 <= ref1 ? l < ref1 : l > ref1; px = 0 <= ref1 ? ++l : --l) {
        for (py = m = 0, ref2 = size[1]; 0 <= ref2 ? m < ref2 : m > ref2; py = 0 <= ref2 ? ++m : --m) {
          (ref3 = getXY(part, px, py)), (x = ref3[0]), (y = ref3[1]);
          x += px;
          y += py;
          t = (ref4 = grid[x]) != null ? ref4[y] : void 0;
          if (t === void 0) {
            badParts.push(part);
            continue;
          }
          if (!player.ai) {
            if (part.dlc) {
              if (!account.hasDLC(part.dlc)) {
                t.bad = true;
                t.locked = true;
              }
            }
            if (!account.hasDLCBonus() && part.dir && part.dir !== 0) {
              t.bad = true;
              t.locked = true;
            }
          }
          if (sim.galaxyStar && player.id === commander.id && !galaxyMode.unlockedParts[part.constructor.name]) {
            t.bad = true;
            t.locked = true;
          }
          if (part.paintable) {
            t.paintable = true;
          }
          if (part.decal) {
            if (!t.paintable) {
              t.cantPaint = true;
              t.bad = true;
            } else if (t.painted) {
              t.overPaint = true;
              t.bad = true;
            } else {
              t.painted = true;
            }
            continue;
          }
          if (part.gimble) {
            if (!t.mount) {
              t.bad = true;
              t.gimble = true;
            }
          } else {
            if (t.solid === true) {
              t.overlap = true;
              t.bad = true;
            }
            t.solid = true;
          }
          if (part.attach) {
            if ((ref5 = grid[x]) != null) {
              if ((ref6 = ref5[y]) != null) {
                ref6.struct = true;
              }
            }
          }
          if (part.mount && (px === size[0] / 2 || px === size[0] / 2 - 1) && (py === size[1] / 2 || py === size[1] / 2 - 1)) {
            if ((ref7 = grid[x]) != null) {
              if ((ref8 = ref7[y]) != null) {
                ref8.mount = true;
              }
            }
            if (!part.turret) {
              if ((ref9 = grid[x]) != null) {
                if ((ref10 = ref9[y]) != null) {
                  ref10.noTurret = true;
                }
              }
              if ((ref11 = grid[x]) != null) {
                if ((ref12 = ref11[y]) != null) {
                  ref12.bad = true;
                }
              }
            }
          }
          if (part.gimble) {
            if ((ref13 = grid[x]) != null) {
              if ((ref14 = ref13[y]) != null) {
                ref14.mount = false;
              }
            }
          }
          if (part.exhaust) {
            if (py === 0) {
              if ((ref15 = grid[x]) != null) {
                if ((ref16 = ref15[y]) != null) {
                  ref16.struct = false;
                }
              }
              for (ey = o = ref17 = y - 1; ref17 <= -1 ? o < -1 : o > -1; ey = ref17 <= -1 ? ++o : --o) {
                if ((ref18 = grid[x]) != null) {
                  if ((ref19 = ref18[ey]) != null) {
                    ref19.exhaust = true;
                  }
                }
              }
            }
          }
          if (part.effected_weapons) {
            ws = part.effected_weapons();
            if (ws.length === 0) {
              if ((ref20 = grid[x]) != null) {
                if ((ref21 = ref20[y]) != null) {
                  ref21.noEffect = true;
                }
              }
              if ((ref22 = grid[x]) != null) {
                if ((ref23 = ref22[y]) != null) {
                  ref23.bad = true;
                }
              }
            }
          }
        }
      }
    }
    (ref24 = getXY(root)), (x = ref24[0]), (y = ref24[1]);
    if (grid[x] === void 0 || grid[x][y] === void 0) {
      return [grid, badParts];
    }
    grid[x][y].fill = true;
    openSet = [];
    openSet.push([x, y]);
    for (i = p = 0; p < 1000; i = ++p) {
      newSet = [];
      for (q = 0, len1 = openSet.length; q < len1; q++) {
        (ref25 = openSet[q]), (x = ref25[0]), (y = ref25[1]);
        ref26 = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];
        for (r = 0, len2 = ref26.length; r < len2; r++) {
          (ref27 = ref26[r]), (ax = ref27[0]), (ay = ref27[1]);
          t = (ref28 = grid[x + ax]) != null ? ref28[y + ay] : void 0;
          if (t && t.solid && !t.fill) {
            t.fill = true;
            newSet.push([x + ax, y + ay]);
          }
        }
      }
      if (newSet.length === 0) {
        break;
      }
      openSet = newSet;
    }
    for (x = s = 0, ref29 = NxN; 0 <= ref29 ? s < ref29 : s > ref29; x = 0 <= ref29 ? ++s : --s) {
      for (y = u = 0, ref30 = NxN; 0 <= ref30 ? u < ref30 : u > ref30; y = 0 <= ref30 ? ++u : --u) {
        t = grid[x][y];
        if (t.exhaust && t.solid) {
          t.bad = true;
        }
        if (t.solid && !t.fill) {
          t.bad = true;
        }
      }
    }
    return [grid, badParts];
  };
}.call(this));
