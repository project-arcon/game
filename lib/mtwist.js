(function () {
  var bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };

  window.MTwist = (function () {
    function MTwist(seed) {
      var k, mti, uint32mul;
      if (seed == null) {
        seed = Math.random() * 4294967295;
      }
      this.randomIntBetween = bind(this.randomIntBetween, this);
      this.randomIntBelow = bind(this.randomIntBelow, this);
      this.random = bind(this.random, this);
      this.randomUint32 = bind(this.randomUint32, this);
      uint32mul = function (n1, n2) {
        var n1High16, n1Low16, n2High16, n2Low16;
        n1Low16 = n1 & 0x0000ffff;
        n1High16 = n1 >>> 16;
        n2Low16 = n2 & 0x0000ffff;
        n2High16 = n2 >>> 16;
        return ((((n1 & 0xffff0000) * n2) >>> 0) + (((n1 & 0x0000ffff) * n2) >>> 0)) >>> 0;
      };
      this.mt = new Array(624);
      this.mt[0] = seed >>> 0;
      for (mti = k = 1; k < 624; mti = ++k) {
        this.mt[mti] = (uint32mul(1812433253, this.mt[mti - 1] ^ (this.mt[mti - 1] >>> 30)) + mti) >>> 0;
      }
      this.mti = mti;
    }

    MTwist.prototype.randomUint32 = function () {
      var i, k, l, y;
      if (this.mti >= 624) {
        for (i = k = 0; k < 227; i = ++k) {
          y = ((this.mt[i] & 0x80000000) | (this.mt[i + 1] & 0x7fffffff)) >>> 0;
          this.mt[i] = (this.mt[i + 397] ^ (y >>> 1) ^ (y & 1 ? 0x9908b0df : 0)) >>> 0;
        }
        for (i = l = 227; l < 623; i = ++l) {
          y = ((this.mt[i] & 0x80000000) | (this.mt[i + 1] & 0x7fffffff)) >>> 0;
          this.mt[i] = (this.mt[i - 227] ^ (y >>> 1) ^ (y & 1 ? 0x9908b0df : 0)) >>> 0;
        }
        y = ((this.mt[623] & 0x80000000) | (this.mt[0] & 0x7fffffff)) >>> 0;
        this.mt[623] = (this.mt[396] ^ (y >>> 1) ^ (y & 1 ? 0x9908b0df : 0)) >>> 0;
        this.mti = 0;
      }
      y = this.mt[this.mti++];
      y = (y ^ (y >>> 11)) >>> 0;
      y = (y ^ ((y << 7) & 0x9d2c5680)) >>> 0;
      y = (y ^ ((y << 15) & 0xefc60000)) >>> 0;
      y = (y ^ (y >>> 18)) >>> 0;
      return y;
    };

    MTwist.prototype.random = function () {
      return this.randomUint32() / 4294967296;
    };

    MTwist.prototype.randomIntBelow = function (maxPlusOne) {
      var bitMask, bitsNeeded, int;
      if (maxPlusOne < 1) {
        throw "Upper bound must be greater than or equal to 1";
      }
      if (maxPlusOne === 1) {
        return 0;
      }
      bitsNeeded = (maxPlusOne - 1).toString(2).length;
      bitMask = (1 << bitsNeeded) - 1;
      while (true) {
        int = this.randomUint32() & bitMask;
        if (int < maxPlusOne) {
          return int;
        }
      }
    };

    MTwist.prototype.randomIntBetween = function (inclusiveMin, inclusiveMax) {
      return inclusiveMin + this.randomIntBelow(inclusiveMax - inclusiveMin + 1);
    };

    MTwist.test = function () {
      var i, iterationFactor, iterations, j, k, l, mtwist, ref, seed;
      seed = 1234567890;
      iterationFactor = 10000;
      for (i = k = 0; k < 1000; i = ++k) {
        mtwist = new MTwist(seed);
        iterations = Math.floor(mtwist.randomUint32() / iterationFactor);
        for (j = l = 0, ref = iterations; 0 <= ref ? l < ref : l > ref; j = 0 <= ref ? ++l : --l) {
          mtwist.randomUint32();
        }
        seed = mtwist.randomUint32();
      }
      return seed === 1240212512;
    };

    return MTwist;
  })();
}.call(this));
