// here begin src/sim.js
(function () {
  
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
      len7,
      len8,
      m,
      o,
      p,
      packet,
      part,
      partId,
      player,
      predictable,
      q,
      r,
      ref,
      ref1,
      ref10,
      ref11,
      ref12,
      ref2,
      ref3,
      ref4,
      ref5,
      ref6,
      ref7,
      ref8,
      ref9,
      s,
      send,
      splayers,
      sthings,
      t,
      targetId,
      thing,
      v,
      x,
      y,
      z;
    sim.timeStart("send");
    sim.timeStart("things");
    sthings = [];
    ref = sim.things;
    for (id in ref) {
      thing = ref[id];
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
      ref1 = sim.thingFields;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        f = ref1[l];
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
      if (s.targetId !== ((ref2 = thing.target) != null ? ref2.id : void 0)) {
        s.targetId = (ref3 = thing.target) != null ? ref3.id : void 0;
        changes.push(["targetId", s.targetId]);
      }
      if (s.originId !== ((ref4 = thing.origin) != null ? ref4.id : void 0)) {
        s.originId = (ref5 = thing.origin) != null ? ref5.id : void 0;
        changes.push(["originId", s.originId]);
      }
      if (s.followId !== ((ref6 = thing.follow) != null ? ref6.id : void 0)) {
        s.followId = (ref7 = thing.follow) != null ? ref7.id : void 0;
        changes.push(["followId", s.followId]);
      }
      if (sim.local) {
        if (s.message !== thing.message) {
          s.message = thing.message;
          changes.push(["message", s.message]);
        }
      }
      if (thing.parts != null) {
        ref8 = thing.parts;
        for (partId = o = 0, len3 = ref8.length; o < len3; partId = ++o) {
          part = ref8[partId];
          changes.push(["partId", partId]);
          s = part.net;
          if (!s) {
            part.net = s = {};
          }
          if (part.working != null && s.working !== part.working) {
            changes.push(["partWorking", part.working]);
            s.working = part.working;
          }
          if (part.weapon) {
            targetId = ((ref9 = part.target) != null ? ref9.id : void 0) || 0;
            if (s.targetId !== targetId) {
              changes.push(["partTargetId", targetId]);
              s.targetId = targetId;
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
    ref10 = sim.players;
    for (q = 0, len4 = ref10.length; q < len4; q++) {
      player = ref10[q];
      changes = [];
      changes.push(["playerNumber", player.number]);
      if (player.net == null) {
        player.net = s = {};
      } else {
        s = player.net;
      }
      ref11 = sim.playerFields;
      for (r = 0, len5 = ref11.length; r < len5; r++) {
        f = ref11[r];
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
    s = sim.net;
    if (!s) {
      sim.net = s = {};
    }
    ref12 = sim.simFields;
    for (y = 0, len7 = ref12.length; y < len7; y++) {
      f = ref12[y];
      if (!simpleEquals(s[f], sim[f])) {
        data[f] = sim[f];
        s[f] = sim[f];
      }
    }
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
