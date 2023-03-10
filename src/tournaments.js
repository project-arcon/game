// here begin src/tournaments.js
(function() {
  eval(onecup["import"]());

  window.tournaments = {};

  ui.tournamentsPage = function() {
    return div(function() {
      var a, aKey, ai, aiList, ais, b, bKey, draws, game, j, len, losses, page, ref, size, tgames, times, twins, winRatio, wins;
      position("absolute");
      top(0);
      left(0);
      width(window.innerWidth);
      min_height(window.innerHeight);
      overflow("auto");
      background_color("rgba(0,0,0,.5)");
      color("white");
      h1(function() {
        padding(5);
        return text("AI vs AI #1");
      });
      page = onecup.get("games.json");
      if (!page.loaded) {
        text("loading...");
        return;
      }
      tournaments.ais = ais = {};
      tournaments.wins = wins = {};
      tournaments.times = times = {};
      tournaments.losses = losses = {};
      tournaments.draws = draws = {};
      tournaments.twins = twins = {};
      tournaments.tgames = tgames = {};
      ref = page.json;
      for (j = 0, len = ref.length; j < len; j++) {
        game = ref[j];
        a = game.alpha;
        b = game.beta;
        aKey = a + 'vs' + b;
        bKey = b + 'vs' + a;
        ais[a] = true;
        ais[b] = true;
        tgames[a] = (tgames[a] || 0) + 1;
        tgames[b] = (tgames[b] || 0) + 1;
        times[aKey] = (times[aKey] || 0) + (game.time / 60 / 60);
        times[bKey] = (times[bKey] || 0) + (game.time / 60 / 60);
        if (game.winningSide === "alpha") {
          wins[aKey] = (wins[aKey] || 0) + 1;
          losses[bKey] = (losses[bKey] || 0) + 1;
          twins[a] = (twins[a] || 0) + 1;
        }
        if (game.winningSide === "beta") {
          wins[bKey] = (wins[bKey] || 0) + 1;
          losses[aKey] = (losses[aKey] || 0) + 1;
          twins[b] = (twins[b] || 0) + 1;
        }
        if (!game.winningSide) {
          draws[bKey] = (draws[bKey] || 0) + 1;
          draws[aKey] = (draws[aKey] || 0) + 1;
        }
      }
      aiList = (function() {
        var results;
        results = [];
        for (ai in ais) {
          results.push(ai);
        }
        return results;
      })();
      winRatio = function(ai) {
        return (twins[ai] / tgames[ai]) || 0;
      };
      aiList = aiList.sort(function(a, b) {
        return winRatio(b) - winRatio(a);
      });
      size = 20;
      return div(function() {
        var i, k, len1, len2, m, results, x, y;
        position("relative");
        font_size(10);
        for (i = k = 0, len1 = aiList.length; k < len1; i = ++k) {
          ai = aiList[i];
          div(function() {
            position("absolute");
            top(i * size + 103);
            width(130);
            text_align("right");
            return text(ai);
          });
          div(function() {
            position("absolute");
            top(i * size + 103);
            left(140);
            width(20);
            text_align("right");
            if (!tgames[ai] || !twins[ai]) {
              return text("0");
            } else {
              return text(Math.floor(twins[ai] / tgames[ai] * 100));
            }
          });
          div(function() {
            position("absolute");
            left(i * size + 172);
            width(130);
            top(39);
            transform("rotate(-45deg)");
            return text(ai);
          });
        }
        div(function() {
          position("absolute");
          left(136);
          width(130);
          top(39);
          transform("rotate(-45deg)");
          return text("win %");
        });
        results = [];
        for (y = m = 0, len2 = aiList.length; m < len2; y = ++m) {
          a = aiList[y];
          results.push((function() {
            var len3, o, results1;
            results1 = [];
            for (x = o = 0, len3 = aiList.length; o < len3; x = ++o) {
              b = aiList[x];
              results1.push(div(function() {
                var c, d, l, n, w;
                position("absolute");
                left(x * size + 180);
                top(y * size + 100);
                width(size - 2);
                height(size - 2);
                line_height(size - 2);
                text_align("center");
                if (a === b) {
                  return;
                }
                w = wins[a + 'vs' + b] || 0;
                l = losses[a + 'vs' + b] || 0;
                d = draws[a + 'vs' + b] || 0;

                /*
                if w > l
                    background_color "rgba(0,255,0,.6)"
                else if w < l
                    background_color "rgba(255,0,0,.6)"
                else if w == l
                    background_color "rgba(0,0,0,.4)"
                #text w - l
                #text w+":"+(l+d+w)
                #text Math.floor(w / (w+l+d) * 100)
                 */

                /*
                n = w+l+d
                c = n*10
                background_color "rgba(#{c},#{c},#{c},.4)"
                
                text n
                 */
                n = times[a + 'vs' + b] * 60;
                c = times[a + 'vs' + b] / 2;
                background_color("rgba(255,0,0," + c + ")");
                return text(Math.floor(n));
              }));
            }
            return results1;
          })());
        }
        return results;
      });
    });
  };

}).call(this);
;


