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
    var _,
      changes,
      data,
      e,
      f,
      i,
      id,
      l,
      len1,
      len2,
      len3,
      len4,
      len5,
      len6,
      m,
      o,
      packet,
      part,
      partId,
      player,
      predictable,
      q,
      r,
      things,
      thing_fields,
      players,
      player_fields,
      sim_fields,
      parts,
      s,
      splayers,
      sthings,
      thing,
      v,
      x;
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
      for (l = 0, len1 = thing_fields.length; l < len1; l++) {
        f = thing_fields[l];
        v = thing[f];
        if (v != null && !simpleEquals(s[f], v)) {
          if (isArray(v)) {
            if (s.length !== v.length) {
              s[f] = new Array(v.length);
            }
            for (i = m = 0, len2 = v.length; m < len2; i = ++m) {
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
        for (partId = o = 0, len3 = parts.length; o < len3; partId = ++o) {
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
    for (q = 0, len4 = players.length; q < len4; q++) {
      player = players[q];
      changes = [];
      changes.push(["playerNumber", player.number]);
      if (player.net == null) {
        player.net = s = {};
      } else {
        s = player.net;
      }
      player_fields = sim.playerFields;
      for (r = 0, len5 = player_fields.length; r < len5; r++) {
        f = player_fields[r];
        v = player[f];
        if (v != null && !simpleEquals(s[f], v)) {
          if (isArray(v)) {
            if (s.length !== v.length) {
              s[f] = new Array(v.length);
            }
            for (i = x = 0, len6 = v.length; x < len6; i = ++x) {
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
          things: Object.keys(sim.things).length,
          sthings: sthings.length,
          players: sim.players.length,
          splayers: splayers.length,
          units: Object.values(sim.things).filter((t) => t.unit).length,
          bullets: Object.values(sim.things).filter((t) => t.bullet).length,
          others: Object.values(sim.things).filter((t) => !t.bullet && !t.unit).length,
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
