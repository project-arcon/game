// here begin src/linky.js
(function() {
  var cache, contains, endsWith, examine, pairs, tlds;

  window.linky = {};

  tlds = 'abbott abogado ac academy accountants active actor ad adult ae aero af ag agency ai airforce al allfinanz alsace am amsterdam an android ao apartments aq aquarelle ar archi army arpa as asia associates at attorney au auction audio autos aw ax axa az ba band bank bar barclaycard barclays bargains bayern bb bd be beer berlin best bf bg bh bi bid bike bingo bio biz bj black blackfriday bloomberg blue bm bmw bn bnpparibas bo boats boo boutique br brussels bs bt budapest build builders business buzz bv bw by bz bzh ca cab cal camera camp cancerresearch canon capetown capital caravan cards care career careers cartier casa cash casino cat catering cbn cc cd center ceo cern cf cg ch channel chat cheap chloe christmas chrome church ci citic city ck cl claims cleaning click clinic clothing club cm cn co coach codes coffee college cologne com community company computer condos construction consulting contractors cooking cool coop country courses cr credit creditcard cricket crs cruises cu cuisinella cv cw cx cy cymru cz dabur dad dance dating datsun day dclk de deals degree delivery democrat dental dentist desi design dev diamonds diet digital direct directory discount dj dk dm dnp do docs domains doosan durban dvag dz eat ec edu education ee eg email emerck energy engineer engineering enterprises epson equipment er erni es esq estate et eu eurovision eus events everbank exchange expert exposed fail fans farm fashion feedback fi finance financial firmdale fish fishing fit fitness fj fk flights florist flowers flsmidth fly fm fo foo football forex forsale foundation fr frl frogans fund furniture futbol ga gal gallery garden gb gbiz gd gdn ge gent gf gg ggee gh gi gift gifts gives gl glass gle global globo gm gmail gmo gmx gn goldpoint goo goog google gop gov gp gq gr graphics gratis green gripe gs gt gu guide guitars guru gw gy hamburg hangout haus healthcare help here hermes hiphop hiv hk hm hn holdings holiday homes horse host hosting house how hr ht hu ibm id ie ifm il im immo immobilien in industries infiniti info ing ink institute insure int international investments io iq ir irish is it iwc java jcb je jetzt jm jo jobs joburg jp juegos kaufen kddi ke kg kh ki kim kitchen kiwi km kn koeln kp kr krd kred kw ky kyoto kz la lacaixa land lat latrobe lawyer lb lc lds lease leclerc legal lgbt li lidl life lighting limited limo link lk loans london lotte lotto lr ls lt ltda lu luxe luxury lv ly ma madrid maif maison management mango market marketing markets marriott mc md me media meet melbourne meme memorial menu mg mh miami mil mini mk ml mm mn mo mobi moda moe monash money mormon mortgage moscow motorcycles mov mp mq mr ms mt mtpc mu museum mv mw mx my mz na nagoya name navy nc ne net network neustar new nexus nf ng ngo nhk ni nico ninja nissan nl no np nr nra nrw ntt nu nyc nz okinawa om one ong onl ooo oracle org organic osaka otsuka ovh pa paris partners parts party pe pf pg ph pharmacy photo photography photos physio pics pictet pictures pink pizza pk pl place plumbing pm pn pohl poker porn post pr praxi press pro prod productions prof properties property ps pt pub pw py qa qpon quebec re realtor recipes red rehab reise reisen reit ren rentals repair report republican rest restaurant reviews rich rio rip ro rocks rodeo rs rsvp ru ruhr rw ryukyu sa saarland sale samsung sarl saxo sb sc sca scb schmidt school schule schwarz science scot sd se services sew sexy sg sh shiksha shoes shriram si singles sj sk sky sl sm sn so social software sohu solar solutions soy space spiegel sr st study style su sucks supplies supply support surf surgery suzuki sv sx sy sydney systems sz taipei tatar tattoo tax tc td technology tel temasek tennis tf tg th tienda tips tires tirol tj tk tl tm tn to today tokyo tools top toshiba town toys tr trade training travel trust tt tui tv tw tz ua ug uk university uno uol us uy uz va vacations vc ve vegas ventures versicherung vet vg vi viajes video villas vision vlaanderen vn vodka vote voting voto voyage vu wales wang watch webcam website wed wedding wf whoswho wien wiki williamhill wme work works world ws wtc wtf xin xxx xyz yachts yandex ye yodobashi yoga yokohama youtube yt za zip zm zone zuerich zw'.split(" ");

  pairs = [["(", ")"], ["[", "]"], ["{", "}"], ["'", "'"], ['"', '"']];

  endsWith = function(text, str) {
    return text.slice(text.length - str.length) === str;
  };

  contains = function(text, str) {
    return text.indexOf(str) !== -1;
  };

  cache = {};

  linky.linkfy = function(text) {
    var j, len, output, parts, t;
    if (cache[text] != null) {
      return cache[text];
    }
    parts = linky.analyze(text);
    output = "";
    for (j = 0, len = parts.length; j < len; j++) {
      t = parts[j];
      if (t[0] === "url") {
        output += "<a href='" + t[1] + "' target='_blank'>" + t[2] + "</a>";
      } else {
        output += t;
      }
    }
    cache[text] = output;
    return output;
  };

  linky.isLink = function(text) {
    var parts;
    parts = linky.analyze(text);
    if (parts.length === 1 && parts[0][0] === "url") {
      return parts[0][1];
    } else {
      return false;
    }
  };

  linky.analyze = function(text) {
    var i, j, k, l, len, len1, len2, len3, m, output, outputAdd, r, ref, result, t, tld, token, tokens, v;
    ref = [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["\"", "&quot;"], ["'", "&apos;"]];
    for (j = 0, len = ref.length; j < len; j++) {
      v = ref[j];
      text = text.replace(new RegExp(v[0], "gm"), v[1]);
    }
    tokens = text.split(/(\s+)/);
    output = [];
    outputAdd = function(r) {
      var ref1;
      if (r) {
        if ((typeof output[output.length - 1] === (ref1 = typeof r) && ref1 === "string")) {
          return output[output.length - 1] += r;
        } else {
          return output.push(r);
        }
      }
    };
    for (i = k = 0, len1 = tokens.length; k < len1; i = ++k) {
      token = tokens[i];
      r = token;
      t = token.toLowerCase();
      for (l = 0, len2 = tlds.length; l < len2; l++) {
        tld = tlds[l];
        if (contains(t, "." + tld)) {
          result = examine(token, tld);
          if (result) {
            for (m = 0, len3 = result.length; m < len3; m++) {
              r = result[m];
              outputAdd(r);
            }
            r = "";
            break;
          }
        }
      }
      outputAdd(r);
    }
    return output;
  };

  examine = function(t, tld) {
    var a, b, j, len, post, pre, ref, url;
    pre = "";
    post = "";
    if (t[t.length - 1] === ".") {
      post = "." + post;
      t = t.slice(0, t.length - 1);
    }
    for (j = 0, len = pairs.length; j < len; j++) {
      ref = pairs[j], a = ref[0], b = ref[1];
      if (t[0] === a && t[t.length - 1] === b) {
        pre = pre + a;
        post = b + post;
        t = t.slice(1, t.length - 1);
      }
    }
    if (!(endsWith(t, "." + tld) || contains(t, "." + tld + "/") || contains(t, "." + tld + ":"))) {
      return false;
    }
    if (t[0] === ".") {
      return false;
    }
    if (t.slice(0, 4) !== "http") {
      url = "http://" + t;
    } else {
      url = t;
    }
    return [pre, ["url", url, t], post];
  };

}).call(this);
;


