// here begin src/sound.js
(function() {
  var ctx, e, maxSounds, r, soundCache;

  if (window.AudioContext == null) {
    window.AudioContext = window.webkitAudioContext;
  }

  try {
    ctx = new AudioContext();
  } catch (error) {
    e = error;
    console.log('Web Audio API is not supported in this browser');
  }

  window.mainVolume = ctx.createGain();

  mainVolume.connect(ctx.destination);

  ctx.destination.isConnected = true;

  soundCache = {};

  r = function() {
    return (Math.random() - .5) * Math.random();
  };

  window.loadSound = function(url, cb) {
    var request, sound;
    sound = {};
    sound.source = ctx.createBufferSource();
    sound.volume = ctx.createGain();
    sound.source.connect(sound.volume);
    sound.volume.connect(mainVolume);
    if (soundCache[url]) {
      sound.buffer = soundCache[url];
      sound.source.buffer = sound.buffer;
      return cb(sound);
    } else {
      request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";
      request.onload = function(e) {
        var onFailure, onSuccess;
        onSuccess = function(buffer) {
          soundCache[url] = buffer;
          sound.buffer = soundCache[url];
          sound.source.buffer = sound.buffer;
          return cb(sound);
        };
        onFailure = function() {
          return console.log("failed to load", url);
        };
        return ctx.decodeAudioData(this.response, onSuccess, onFailure);
      };
      return request.send();
    }
  };

  maxSounds = {};

  window.playSound = function(url, volume) {
    if (volume == null) {
      volume = 1;
    }
    if (Array.isArray(url)) {
      url = choose(url);
    }
    if (maxSounds[url] >= 16) {
      return;
    }
    maxSounds[url] = (maxSounds[url] || 0) + 1;
    return loadSound(url, function(sound) {
      var rate;
      sound.volume.gain.value = volume * 0.15 + r() * settings.soundValue("FX Volume");
      rate = 1 + r();
      sound.source.playbackRate.value = rate;
      sound.source.start(ctx.currentTime);
      return after(sound.source.buffer.duration * rate * 1000, function() {
        return maxSounds[url] -= 1;
      });
    });
  };

  window.playSoundUI = function(url, volume, rate) {
    if (volume == null) {
      volume = 1;
    }
    if (rate == null) {
      rate = 1;
    }
    return loadSound(url, function(sound) {
      sound.source.playbackRate.value = rate;
      sound.volume.gain.value = volume * settings.soundValue("FX Volume");
      return sound.source.start(ctx.currentTime);
    });
  };

  window.ActionMixer = (function() {
    function ActionMixer() {
      this.action = 0;
      this.reset();
    }

    ActionMixer.prototype.reset = function() {
      var actionSound, ref;
      actionSound = choose(["Industrial Cinematic.wav", "Anxiety.mp3", "Another 80s Arp.wav", "Kevlar.wav", "Kevlar.wav", "Slow Burn.wav", "Producer Alchemy - 13 Stones Drums - 96 BPM.mp3", "Producer Alchemy Demo - Stones Drums.mp3", "Producer Alchemy Pizz.Paddy - 09.mp3"]);
      if ((ref = this.battleSound) != null) {
        ref.source.stop();
      }
      return loadSound("sounds/loops/action/" + actionSound, (function(_this) {
        return function(sound) {
          _this.battleSound = sound;
          _this.battleSound.volume.gain.value = 0;
          _this.battleSound.source.loop = true;
          return _this.battleSound.source.start();
        };
      })(this));
    };

    ActionMixer.prototype.playTrack = function(name) {
      if (this.trackName === name) {
        return;
      }
      this.trackName = name;
      console.log("play track", this.trackName);
      return loadSound(this.trackName, (function(_this) {
        return function(sound) {
          console.log("playing track", _this.trackName);
          _this.trackSound = sound;
          _this.trackSound.volume.gain.value = 0;
          _this.trackSound.source.loop = true;
          return _this.trackSound.source.start();
        };
      })(this));
    };

    ActionMixer.prototype.tick = function() {
      var v;
      this.action = this.action * .995;
      if (this.battleSound) {
        v = 0;
        if (this.action) {
          v = 1 - Math.exp(-this.action);
        }
        this.battleSound.volume.gain.value = v * settings.soundValue("Music Volume") * .75;
      }
      if (this.trackSound) {
        v = 1;
        this.trackSound.volume.gain.value = v * settings.soundValue("Music Volume") * .75;
      }
      mainVolume.gain.value = settings.soundValue("Master Volume");
      if (localStorage.mute === "true") {
        if (ctx.destination.isConnected) {
          ctx.destination.isConnected = false;
          return mainVolume.disconnect(ctx.destination);
        }
      } else {
        if (!ctx.destination.isConnected) {
          ctx.destination.isConnected = true;
          return mainVolume.connect(ctx.destination);
        }
      }
    };

    return ActionMixer;

  })();

}).call(this);
;


