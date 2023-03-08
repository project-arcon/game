// here begin src/engine.js
(function () {
  var canvas, dpr, gl, resizeViewport;

  gl = void 0;

  canvas = void 0;

  dpr = 2;

  window.Atlas = (function () {
    function Atlas(params) {
      this.curSprite = 0;
      this.maxSpritesInBatch = 1024 * 2;
      this.spriteMap = {};
      this.drawMargin = 4;
      this.atlasMargin = 2;
      this.vertsBuf = null;
      this.uvsBuf = null;
      this.indexsBuf = null;
      this.uvs = new Float32Array(2 * 4 * this.maxSpritesInBatch);
      this.verts = new Float32Array(2 * 4 * this.maxSpritesInBatch);
      this.colors = new Uint8Array(4 * 4 * this.maxSpritesInBatch);
      this.indexs = new Uint16Array(2 * 3 * this.maxSpritesInBatch);
      this.initShader();
      this.initTexture();
      this.initBuffers();
      this.initOffscreenBuffer();
      this.viewPort = new Float32Array(4);
      this.frame = 0;
      this.ready = false;
    }

    Atlas.prototype.preloadList = function () {
      var key, results;
      results = [];
      for (key in this.spriteMap) {
        results.push(key);
      }
      return results;
    };

    Atlas.prototype.initShader = function () {
      var compileShader, linkShader, simpleFragment, simpleVertex;
      compileShader = function (type, src) {
        var shader;
        shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.log(gl.getShaderInfoLog(shader));
          return null;
        }
        return shader;
      };
      linkShader = function (fragmentSrc, vertexSrc) {
        var shader;
        shader = gl.createProgram();
        gl.attachShader(shader, compileShader(gl.FRAGMENT_SHADER, fragmentSrc));
        gl.attachShader(shader, compileShader(gl.VERTEX_SHADER, vertexSrc));
        gl.linkProgram(shader);
        if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
          console.log("could not link shader");
          return null;
        }
        return shader;
      };
      simpleFragment =
        "precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\n\nvoid main(void) {\n    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n    vec4 finalColor = textureColor * vColor;\n    gl_FragColor = finalColor;\n}";
      simpleVertex =
        "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void) {\n    gl_Position = vec4(aVertexPosition, 0.0, 1.0);\n    vColor = aColor;\n    vTextureCoord = aTextureCoord;\n}";
      this.shader = linkShader(simpleFragment, simpleVertex);
      gl.useProgram(this.shader);
      this.shader.vertAttr = gl.getAttribLocation(this.shader, "aVertexPosition");
      gl.enableVertexAttribArray(this.shader.vertAttr);
      this.shader.uvsAttr = gl.getAttribLocation(this.shader, "aTextureCoord");
      gl.enableVertexAttribArray(this.shader.uvsAttr);
      this.shader.colorsAttr = gl.getAttribLocation(this.shader, "aColor");
      gl.enableVertexAttribArray(this.shader.colorsAttr);
      return (this.shader.samplerUniform = gl.getUniformLocation(this.shader, "uSampler"));
    };

    Atlas.prototype.initTexture = function () {
      var anisotropic, handleLoadedTexture, loadTexture, max_anisotropy;
      this.canvas = document.createElement("canvas");
      this.canvas.className = "atlas";
      this.originalTextureSize = 1024 * 8;
      this.textureSize = Math.min(this.originalTextureSize, gl.getParameter(gl.MAX_TEXTURE_SIZE));
      this.canvas.width = this.textureSize;
      this.canvas.height = this.textureSize;
      this.heights = new Uint16Array(this.canvas.width);
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);
      gl.generateMipmap(gl.TEXTURE_2D);
      anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
      if (anisotropic) {
        max_anisotropy = gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        gl.texParameterf(gl.TEXTURE_2D, anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, max_anisotropy);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.bindTexture(gl.TEXTURE_2D, null);
      handleLoadedTexture = function (texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return (texture.loaded = true);
      };
      return (loadTexture = function (src) {
        var texture;
        texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function () {
          return handleLoadedTexture(texture);
        };
        texture.image.src = src;
        return texture;
      });
    };

    Atlas.prototype.initBuffers = function () {
      var a, i, j, ref, x, y;
      for (i = j = 0, ref = this.maxSpritesInBatch; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        a = 0;
        x = 0;
        y = 0;
        this.verts[i * 8 + 0] = x - a;
        this.verts[i * 8 + 1] = y - a;
        this.verts[i * 8 + 2] = x + a;
        this.verts[i * 8 + 3] = y - a;
        this.verts[i * 8 + 4] = x + a;
        this.verts[i * 8 + 5] = y + a;
        this.verts[i * 8 + 6] = x - a;
        this.verts[i * 8 + 7] = y + a;
        this.uvs[i * 8 + 0] = 0;
        this.uvs[i * 8 + 1] = 0;
        this.uvs[i * 8 + 2] = 1;
        this.uvs[i * 8 + 3] = 0;
        this.uvs[i * 8 + 4] = 1;
        this.uvs[i * 8 + 5] = 1;
        this.uvs[i * 8 + 6] = 0;
        this.uvs[i * 8 + 7] = 1;
        this.colors[i * 16 + 0] = 255;
        this.colors[i * 16 + 1] = 255;
        this.colors[i * 16 + 2] = 255;
        this.colors[i * 16 + 3] = 255;
        this.colors[i * 16 + 4] = 255;
        this.colors[i * 16 + 5] = 255;
        this.colors[i * 16 + 6] = 255;
        this.colors[i * 16 + 7] = 255;
        this.colors[i * 16 + 8] = 255;
        this.colors[i * 16 + 9] = 255;
        this.colors[i * 16 + 10] = 255;
        this.colors[i * 16 + 11] = 255;
        this.colors[i * 16 + 12] = 255;
        this.colors[i * 16 + 13] = 255;
        this.colors[i * 16 + 14] = 255;
        this.colors[i * 16 + 15] = 255;
        this.indexs[i * 6 + 0] = i * 4 + 0;
        this.indexs[i * 6 + 1] = i * 4 + 1;
        this.indexs[i * 6 + 2] = i * 4 + 2;
        this.indexs[i * 6 + 3] = i * 4 + 0;
        this.indexs[i * 6 + 4] = i * 4 + 2;
        this.indexs[i * 6 + 5] = i * 4 + 3;
      }
      this.vertsBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.verts, gl.DYNAMIC_DRAW);
      this.uvsBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
      this.colorsBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.DYNAMIC_DRAW);
      this.indexsBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexsBuf);
      return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexs, gl.STATIC_DRAW);
    };

    Atlas.prototype.initOffscreenBuffer = function () {
      this.rtt = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtt);
      this.rtt.width = 64 * dpr;
      this.rtt.height = 64 * dpr;
      this.rttTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.rtt.width, this.rtt.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      this.renderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.rtt.width, this.rtt.height);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
      this.pixels = new Uint8Array(4 * this.rtt.width * this.rtt.height);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      return gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    Atlas.prototype.startFrame = function () {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      return (this.frame += 1);
    };

    Atlas.prototype.startOffscreenFrame = function () {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtt);
      gl.viewport(0, 0, this.rtt.width, this.rtt.height);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      return gl.clear(gl.COLOR_BUFFER_BIT);
    };

    Atlas.prototype.endOffscreenFrame = function () {
      var ctx, i, j, pixelsOut, ref, rttcanvas;
      gl.readPixels(0, 0, this.rtt.width, this.rtt.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels);
      rttcanvas = document.createElement("canvas");
      rttcanvas.width = this.rtt.width;
      rttcanvas.height = this.rtt.height;
      ctx = rttcanvas.getContext("2d");
      pixelsOut = ctx.getImageData(0, 0, this.rtt.width, this.rtt.height);
      if (!(pixelsOut != null ? pixelsOut.data : void 0)) {
        return "";
      }
      for (i = j = 0, ref = this.pixels.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        pixelsOut.data[i] = this.pixels[i];
      }
      ctx.putImageData(pixelsOut, 0, 0, 0, 0, this.rtt.width, this.rtt.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return rttcanvas.toDataURL();
    };

    Atlas.prototype.loadAtlas = function (atlas) {
      var xhr;
      xhr = new XMLHttpRequest();
      xhr.open("GET", atlas.src, true);
      xhr.responseType = "arraybuffer";
      xhr.onprogress = (function (_this) {
        return function (e) {
          _this.progress = e.loaded / e.total;
          return onecup.refresh();
        };
      })(this);
      xhr.onload = (function (_this) {
        return function (e) {
          var encodedData, j, len, ref, s, stringData;
          _this.atlasImage = new Image();
          _this.atlasImage.onload = function (e) {
            var data;
            gl.bindTexture(gl.TEXTURE_2D, _this.texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            if (_this.textureSize !== _this.atlasImage.width) {
              console.log("scaling image down");
              data = _this.scaleImage(_this.atlasImage, _this.textureSize);
            } else {
              data = _this.atlasImage;
            }
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.generateMipmap(gl.TEXTURE_2D);
            _this.spriteMap = atlas.mappings;
            _this.ready = true;
            return onecup.refresh();
          };
          _this.atlasImage.onerror = function (e) {
            console.log("Could not load atlas image", e);
            return (_this.error = true);
          };
          stringData = "";
          ref = new Uint8Array(xhr.response);
          for (j = 0, len = ref.length; j < len; j++) {
            s = ref[j];
            stringData += String.fromCharCode(s);
          }
          encodedData = window.btoa(stringData);
          return (_this.atlasImage.src = "data:image/png;base64," + encodedData);
        };
      })(this);
      return xhr.send();
    };

    Atlas.prototype.scaleImage = function (image, size) {
      var ctx;
      canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, size, size);
      return canvas;
    };

    Atlas.prototype.beginSprites = function (pos, zoom, viewPort) {
      if (pos == null) {
        pos = [0, 0];
      }
      if (zoom == null) {
        zoom = 1;
      }
      if (!viewPort) {
        this.viewPort[0] = pos[0];
        this.viewPort[1] = pos[1];
        this.viewPort[2] = gl.viewportWidth;
        this.viewPort[3] = gl.viewportHeight;
      } else {
        this.viewPort[0] = viewPort[0];
        this.viewPort[1] = viewPort[1];
        this.viewPort[2] = viewPort[2];
        this.viewPort[3] = viewPort[3];
      }
      this.viewPort[2] *= zoom / dpr;
      return (this.viewPort[3] *= zoom / dpr);
    };

    Atlas.prototype.drawSprite = function (src, pos, size, rot, color, z) {
      var cos, h, i, j, m, mapping, n, sin, sx, sy, w, x, y, zf;
      if (color == null) {
        color = [255, 255, 255, 255];
      }
      if (z == null) {
        z = 0;
      }
      if (!this.ready) {
        return;
      }
      if (this.curSprite >= this.maxSpritesInBatch) {
        this.finishSprites();
      }
      mapping = this.spriteMap[src];
      if (!mapping) {
        console.error("not in mapping", src);
        return;
      }
      i = this.curSprite;
      m = this.drawMargin / this.originalTextureSize;
      this.uvs[i * 8 + 0] = mapping.uv[0] - m;
      this.uvs[i * 8 + 1] = mapping.uv[1] + m;
      this.uvs[i * 8 + 2] = mapping.uv[2] + m;
      this.uvs[i * 8 + 3] = mapping.uv[1] + m;
      this.uvs[i * 8 + 4] = mapping.uv[2] + m;
      this.uvs[i * 8 + 5] = mapping.uv[3] - m;
      this.uvs[i * 8 + 6] = mapping.uv[0] - m;
      this.uvs[i * 8 + 7] = mapping.uv[3] - m;
      this.colors[i * 16 + 0] = color[0];
      this.colors[i * 16 + 1] = color[1];
      this.colors[i * 16 + 2] = color[2];
      this.colors[i * 16 + 3] = color[3];
      this.colors[i * 16 + 4] = color[0];
      this.colors[i * 16 + 5] = color[1];
      this.colors[i * 16 + 6] = color[2];
      this.colors[i * 16 + 7] = color[3];
      this.colors[i * 16 + 8] = color[0];
      this.colors[i * 16 + 9] = color[1];
      this.colors[i * 16 + 10] = color[2];
      this.colors[i * 16 + 11] = color[3];
      this.colors[i * 16 + 12] = color[0];
      this.colors[i * 16 + 13] = color[1];
      this.colors[i * 16 + 14] = color[2];
      this.colors[i * 16 + 15] = color[3];
      w = (mapping.uv[2] - mapping.uv[0]) * this.originalTextureSize;
      h = (mapping.uv[1] - mapping.uv[3]) * this.originalTextureSize;
      sx = ((w + this.drawMargin * 2) * size[0]) / 2;
      sy = ((h + this.drawMargin * 2) * size[1]) / 2;
      cos = Math.cos(rot);
      sin = Math.sin(rot);
      this.verts[i * 8 + 0] = pos[0] + (-sx * cos + sy * sin);
      this.verts[i * 8 + 1] = pos[1] + (-sx * sin - sy * cos);
      this.verts[i * 8 + 2] = pos[0] + (+sx * cos + sy * sin);
      this.verts[i * 8 + 3] = pos[1] + (+sx * sin - sy * cos);
      this.verts[i * 8 + 4] = pos[0] + (+sx * cos - sy * sin);
      this.verts[i * 8 + 5] = pos[1] + (+sx * sin + sy * cos);
      this.verts[i * 8 + 6] = pos[0] + (-sx * cos - sy * sin);
      this.verts[i * 8 + 7] = pos[1] + (-sx * sin + sy * cos);
      for (n = j = 0; j < 4; n = ++j) {
        zf = Math.pow(1.001, -z);
        x = this.verts[i * 8 + n * 2 + 0];
        this.verts[i * 8 + n * 2 + 0] = (x + this.viewPort[0]) / this.viewPort[2] / zf;
        y = this.verts[i * 8 + n * 2 + 1];
        this.verts[i * 8 + n * 2 + 1] = (y + this.viewPort[1]) / this.viewPort[3] / zf;
      }
      return (this.curSprite += 1);
    };

    Atlas.prototype.finishSprites = function (blend) {
      if (blend == null) {
        blend = false;
      }
      if (blend) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      } else {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      }
      gl.useProgram(this.shader);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.verts, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(this.shader.vertAttr, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(this.shader.uvsAttr, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(this.shader.colorsAttr, 4, gl.UNSIGNED_BYTE, true, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(this.shader.samplerUniform, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexsBuf);
      gl.drawElements(gl.TRIANGLES, this.curSprite * 6, gl.UNSIGNED_SHORT, 0);
      return (this.curSprite = 0);
    };

    return Atlas;
  })();

  window.initGL = function () {
    var contextError;
    canvas = document.getElementById("webGL");
    contextError = function (e) {
      ui.error = "webGL";
      track("webgl_context_error", {
        message: e.statusMessage,
      });
      return (ui.contextErrrorMessage = e.statusMessage);
    };
    canvas.addEventListener("webglcontextcreationerror", contextError, false);
    canvas.addEventListener("webglcontextlost", contextError, false);
    window.gl = gl = canvas.getContext("webgl", {
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) {
      console.log("failed to init GL");
      return false;
    }
    resizeViewport();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    return true;
  };

  window.onresize = function () {
    resizeViewport();
    return onecup.refresh();
  };

  resizeViewport = function () {
    if (!canvas) {
      return;
    }
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    if (gl != null) {
      gl.viewportWidth = canvas.width;
      return (gl.viewportHeight = canvas.height);
    }
  };

  window.togglePointerLock = function () {
    canvas = document.getElementById("webGL");
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
    return canvas.requestPointerLock();
  };

  window.isFullScreen = function () {
    return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  };

  window.toggleFullScreen = function () {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };

  window.enterFullScreen = function () {
    if (document.documentElement.requestFullscreen) {
      return document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      return document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      return document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      return document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  };

  window.exitFullScreen = function () {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    }
  };
}.call(this));
