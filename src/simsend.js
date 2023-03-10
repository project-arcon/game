// here begin src/sim.js
(function () {
  var _pos, isArray;

  _pos = v2.create();

  isArray = function (a) {
    if (Array.isArray(a)) {
      return true;
    }
    if (a instanceof Float64Array) {
      return true;
    }
    return false;
  };

  window.sendSim = function (sim) {
    var _, changes, data, e, f, i, id, l, m, o, packet, part, partId, player, predictable, q, r, things, thing_fields, players, player_fields, sim_fields, parts, s, splayers, sthings, thing, v, x;
    sim.timeStart("send");
    sim.timeStart("things");
    sthings = [];
    things = sim.things;
    for (id in things) {
      thing = things[id];
      changes = [];
      changes.push(["thingId", thing.id]);
      if (thing.net == null) {
        thing.net = s = {};
        changes.push(["name", thing.constructor.name]);
        changes.push(["spec", thing.spec]);
        changes.push(["color", thing.color]);
        changes.push(["z", thing.z]);
      } else if (thing["static"]) {
        continue;
      } else {
        s = thing.net;
      }
      thing_fields = sim.thingFields;
      for (l = 0, thing_fields.length; l < thing_fields.length; l++) {
        f = thing_fields[l];
        v = thing[f];
        if (v != null && !simpleEquals(s[f], v)) {
          if (isArray(v)) {
            if (s.length !== v.length) {
              s[f] = new Array(v.length);
            }
            for (i = m = 0, v.length; m < v.length; i = ++m) {
              e = v[i];
              s[f][i] = e;
            }
          } else {
            s[f] = v;
          }
          changes.push([f, v]);
        }
      }
      predictable = false;
      if (s.vel != null && s.pos != null) {
        v2.add(s.pos, s.vel, _pos);
        if (v2.distance(_pos, thing.pos) < 0.1) {
          v2.set(_pos, s.pos);
          predictable = true;
        }
      }
      if (!predictable) {
        if (s.vel == null) {
          s.vel = v2.create();
        }
        if (s.pos == null) {
          s.pos = v2.create();
        }
        v2.set(thing.vel, s.vel);
        v2.set(thing.pos, s.pos);
        changes.push(["vel", thing.vel]);
        changes.push(["pos", thing.pos]);
      }
      if (s.targetId !== (thing.target?.id ?? undefined)) {
        s.targetId = thing.target?.id ?? undefined;
        changes.push(["targetId", s.targetId]);
      }

      if (s.originId !== (thing.origin?.id ?? undefined)) {
        s.originId = thing.origin?.id ?? undefined;
        changes.push(["originId", s.originId]);
      }

      if (s.followId !== (thing.follow?.id ?? undefined)) {
        s.followId = thing.follow?.id ?? undefined;
        changes.push(["followId", s.followId]);
      }

      if (sim.local && s.message !== thing.message) {
        s.message = thing.message;
        changes.push(["message", s.message]);
      }
      if (thing.parts != null) {
        parts = thing.parts;
        for (partId = o = 0, parts.length; o < parts.length; partId = ++o) {
          part = parts[partId];
          changes.push(["partId", partId]);
          s = part.net;
          if (!s) {
            part.net = s = {};
          }
          if (part.working != null && s.working !== part.working) {
            changes.push(["partWorking", part.working]);
            s.working = part.working;
          }
          if (part.weapon && part.target?.id) {
            const target_id = part.target.id;
            if (s.targetId !== target_id) {
              s.targetId = target_id;
              changes.push(["partTargetId", target_id]);
            }
          }
          if (changes[changes.length - 1][0] === "partId") {
            changes.pop();
          }
        }
      }
      if (changes.length > 1) {
        sthings.push(changes);
      }
    }
    sim.timeEnd("things");
    sim.timeStart("players");
    splayers = [];
    players = sim.players;
    for (q = 0, players.length; q < players.length; q++) {
      player = players[q];
      changes = [];
      changes.push(["playerNumber", player.number]);
      if (player.net == null) {
        player.net = s = {};
      } else {
        s = player.net;
      }
      player_fields = sim.playerFields;
      for (r = 0, player_fields.length; r < player_fields.length; r++) {
        f = player_fields[r];
        v = player[f];
        if (v != null && !simpleEquals(s[f], v)) {
          if (isArray(v)) {
            if (s.length !== v.length) {
              s[f] = new Array(v.length);
            }
            for (i = x = 0, v.length; x < v.length; i = ++x) {
              e = v[i];
              s[f][i] = e;
            }
          } else {
            s[f] = v;
          }
          changes.push([f, v]);
        }
      }
      if (changes.length > 1) {
        splayers.push(changes);
      }
    }
    sim.timeEnd("players");
    sim.timeStart("other");
    data = {};
    s = sim.net || {};
    sim_fields = sim.simFields;
    sim_fields.forEach((f) => {
      if (!simpleEquals(s[f], sim[f])) {
        data[f] = sim[f];
        s[f] = sim[f];
      }
    });
    if (splayers.length > 0) {
      data.players = splayers;
    }
    if (sthings.length > 0) {
      data.things = sthings;
    }
    if (sim.fullUpdate) {
      data.fullUpdate = true;
      sim.fullUpdate = false;
    }
    if (sim.step % 16 === 0) {
      data.perf = {
        numbers: {
          things: function () {
            var results;
            results = [];
            for (t in sim.things) {
              results.push(t);
            }
            return results;
          }.call(sim).length,
          sthings: sthings.length,
          players: function () {
            var i1, len9, ref14, results;
            ref14 = sim.players;
            results = [];
            for (i1 = 0, len9 = ref14.length; i1 < len9; i1++) {
              p = ref14[i1];
              results.push(p);
            }
            return results;
          }.call(sim).length,
          splayers: splayers.length,
          units: function () {
            var ref14, results;
            ref14 = sim.things;
            results = [];
            for (_ in ref14) {
              t = ref14[_];
              if (t.unit) {
                results.push(t);
              }
            }
            return results;
          }.call(sim).length,
          bullets: function () {
            var ref14, results;
            ref14 = sim.things;
            results = [];
            for (_ in ref14) {
              t = ref14[_];
              if (t.bullet) {
                results.push(t);
              }
            }
            return results;
          }.call(sim).length,
          others: function () {
            var ref14, results;
            ref14 = sim.things;
            results = [];
            for (_ in ref14) {
              t = ref14[_];
              if (!t.bullet && !t.unit) {
                results.push(t);
              }
            }
            return results;
          }.call(sim).length,
        },
        timeings: sim.timeings,
      };
      sim.timeings = {};
    }
    sim.timeEnd("other");
    sim.timeStart("zJson");
    packet = sim.zJson.dumpDv(data);
    sim.timeEnd("zJson");
    sim.timeEnd("send");
    return packet;
  };
}.call(this));
