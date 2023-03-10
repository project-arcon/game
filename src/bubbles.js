// here begin src/bubbles.js
(function() {
  var drawBubble, fixBubblePos;

  eval(onecup["import"]());

  window.bubbles = {};

  bubbles.list = [];

  bubbles.tip = null;

  bubbles.add = function(bubble) {
    bubbles.list.push(bubble);
    return onecup.refresh();
  };

  bubbles.clear = function() {
    bubbles.list = [];
    return onecup.refresh();
  };

  bubbles.draw = function() {
    var i, len, ref, results, thing;
    if (bubbles.list.length > 0) {
      drawBubble(bubbles.list[0]);
    }
    if (bubbles.tip) {
      drawBubble(bubbles.tip);
    }
    if (tutor.bubble) {
      drawBubble(tutor.bubble);
    }
    if (commander.selection && localStorage.useAi === "true" && localStorage.aiGrid === "true") {
      ref = commander.selection;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        thing = ref[i];
        if (thing.message) {
          results.push(drawBubble({
            thing: thing,
            message: thing.message,
            modeOnly: "battle"
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  bubbles.tick = function() {
    var bubble, id, ref, results, thing;
    if (control.mode.fromGameSpace == null) {
      return;
    }
    if (bubbles.list.length > 0) {
      bubble = bubbles.list[0];
      if (bubble.thing) {
        fixBubblePos(bubble.thing);
      }
      if (typeof bubble.close === "function" ? bubble.close() : void 0) {
        onecup.refresh();
      }
    }
    if (intp) {
      ref = intp.things;
      results = [];
      for (id in ref) {
        thing = ref[id];
        if (thing.message != null) {
          results.push(fixBubblePos(thing));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  fixBubblePos = function(thing) {
    var dom, pos;
    dom = document.getElementById("bubble-" + thing.id);
    if (dom) {
      pos = control.mode.fromGameSpace(thing.pos);
      dom.style.left = pos[0] + "px";
      return dom.style.top = pos[1] + "px";
    }
  };

  drawBubble = function(bubble) {
    var pos, ref;
    if (bubble.findThing != null) {
      bubble.thing = bubble.findThing();
      if (!bubble.thing) {
        return;
      }
    }
    if (bubble.thing) {
      if (control.mode.fromGameSpace == null) {
        return;
      }
      pos = control.mode.fromGameSpace(bubble.thing.pos);
      bubble.x = Math.floor(pos[0]);
      bubble.y = Math.floor(pos[1]);
    }
    if (typeof bubble.close === "function" ? bubble.close() : void 0) {
      if (typeof bubble.onclose === "function") {
        bubble.onclose();
      }
      bubbles.list.shift();
      return;
    }
    if (bubble.onshow) {
      bubble.onshow();
      bubble.onshow = false;
    }
    if (bubble.delay != null) {
      bubble.delay -= 1 / 16;
      if (bubble.delay <= 0) {
        bubbles.list.shift();
      }
    }
    if ((bubble.modeOnly != null) && bubble.modeOnly !== ui.mode) {
      return;
      console.log("mode only");
    }
    return div("#bubble-" + ((ref = bubble.thing) != null ? ref.id : void 0), function() {
      var h, ref1, src, w;
      position("absolute");
      if (bubble.bottom) {
        bottom(bubble.bottom);
      } else {
        top(bubble.y);
      }
      left(bubble.x);
      overflow("visible");
      z_index("10");
      if (bubble.image) {
        ref1 = bubble.image, src = ref1[0], w = ref1[1], h = ref1[2];
        img({
          src: src + "?_1",
          width: w,
          height: h
        });
        transform("translate(" + (-w / 2) + "px, " + (-h / 2) + "px)");
        return;
      }
      div(function() {
        onclick(function() {
          if (bubble.notclosable) {
            return;
          }
          if (typeof bubble.onclose === "function") {
            bubble.onclose();
          }
          return bubbles.list.shift();
        });
        if (bubble.stem !== "top") {
          position("absolute");
          display("inline-block");
          left(-30);
          bottom(20);
        }
        width(bubble.width || 300);
        padding(10);
        border_radius(5);
        background_color("rgba(0,0,0,.5)");
        color("white");
        font_size(14);
        if (!bubble.notclosable) {
          div(function() {
            position("absolute");
            top(7);
            right(7);
            width(10);
            height(10);
            return background_color("rgba(0,0,0,.2)");
          });
        }
        if (bubble.message) {
          text(bubble.message);
        }
        return typeof bubble.html === "function" ? bubble.html() : void 0;
      });
      return div(function() {
        position("absolute");
        width(0);
        height(0);
        if (bubble.stem === "top") {
          top(-20);
          left(20);
          border_left("20px solid rgba(0,0,0,.5)");
          border_top("20px solid transparent");
        }
        if (bubble.stem === "center") {
          bottom(0);
          left(bubble.width / 2 - 50);
          ({
            margin_left: -20
          });
          border_left("20px solid transparent");
          border_right("20px solid transparent");
          return border_top("20px solid rgba(0,0,0,.5)");
        } else {
          bottom(0);
          ({
            margin_left: -20
          });
          border_left("20px solid rgba(0,0,0,.5)");
          return border_bottom("20px solid transparent");
        }
      });
    });
  };

}).call(this);
;


