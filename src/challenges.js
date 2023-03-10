// here begin src/challenges.js
(function() {
  var drawAiChallenge;

  eval(onecup["import"]());

  ui.challengesView = function() {
    return ui.inScreen("menu", "Challenges vs AI", function() {
      var ai, i, j, k, len, len1, len2, n, ref, ref1, ref2, results, title;
      overflow_y("scroll");
      width(820);
      height(window.innerHeight);
      title = function(what) {
        return div(function() {
          margin(0);
          text_align("center");
          padding(30);
          font_size(20);
          background_color("rgba(0,0,0,.5)");
          return text(what);
        });
      };
      title("easy");
      if (commander.challenges == null) {
        commander.challenges = {};
      }
      n = 0;
      ref = ais.easy;
      for (i = 0, len = ref.length; i < len; i++) {
        ai = ref[i];
        drawAiChallenge(ai, n);
        n += 1;
      }
      title("medium");
      ref1 = ais.med;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        ai = ref1[j];
        drawAiChallenge(ai, n);
        n += 1;
      }
      title("hard");
      ref2 = ais.hard;
      results = [];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        ai = ref2[k];
        drawAiChallenge(ai, n);
        results.push(n += 1);
      }
      return results;
    });
  };

  drawAiChallenge = function(aiName, n) {
    return div(".hover-black", function() {
      display("inline-block");
      width(200);
      height(100);
      return div(function() {
        var bestTime;
        position("relative");
        width(200);
        height(100);
        line_height(100);
        color("white");
        font_size(24);
        text_align("center");
        bestTime = commander.challenges[aiName];
        if (bestTime != null) {
          background_color("rgba(255, 255, 255, .2)");
          div(function() {
            var m, s, sec;
            position("absolute");
            right(6);
            bottom(3);
            font_size(12);
            line_height(16);
            opacity(".5");
            sec = bestTime / 16;
            m = Math.floor(sec / 60);
            s = ("0" + Math.floor(sec) % 60).slice(0, 2);
            return text("best time: " + m + ":" + s);
          });
        }
        text(aiName);
        return onclick(function() {
          battleMode.startAIChallenge(aiName);
          return ui.go("battle");
        });
      });
    });
  };

}).call(this);
;


