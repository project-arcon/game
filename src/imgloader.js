// here begin src/imgloader.js
/*
 * Load images into atlas so it can be drawn using `atlas.drawSprite()`
 *
 * Use imgloader.addImage(name, url) to add images you want to load
 * Use imgloader.combineImages() after adding all the images
 * Now you can use atlas.drawSprite(name, pos, size, rot, color) to draw the image
 */
if (!imgloader) {
  var imgloader = {
    resizeFactor: 2,
    newAtlases: [],
    loading: 0,

    addImage(name, src) {
      var img = new Image();
      img.onload = function () {
        imgloader.newAtlases.push({
          name: name,
          img: img,
        });
        imgloader.loading--;
      };
      img.onerror = function (e) {
        console.log("Could not load image", e);
        imgloader.loading--;
      };
      img.crossOrigin = "";
      img.src = src;

      imgloader.loading++;
    },

    combineImages: function () {
      if (imgloader.loading > 0) {
        setTimeout(imgloader.combineImages, 50);
        return;
      }

      console.log("Adding images to atlas");

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      var newSize = imgloader.origAtlas.size * imgloader.resizeFactor;
      canvas.width = canvas.height = newSize;

      for (let i in imgloader.origAtlas.mappings) {
        for (let j = 0; j < 4; j++) {
          atlas.mappings[i].uv[j] = imgloader.origAtlas.mappings[i].uv[j] / imgloader.resizeFactor;
        }
      }

      ctx.drawImage(imgloader.origAtlasImg, 0, canvas.height - imgloader.origAtlas.size);

      let x = 0;
      let y = 0;
      let maxH = 0;
      for (let a of imgloader.newAtlases) {
        if (x + a.img.width > newSize && maxH > 0) {
          x = 0;
          y += maxH;
          maxH = 0;
        }
        ctx.drawImage(a.img, x, y);
        atlas.mappings[a.name] = {};
        atlas.mappings[a.name].uv = [x / newSize, 1 - y / newSize, (x + a.img.width) / newSize, 1 - (y + a.img.height) / newSize];
        x += a.img.width;
        maxH = Math.max(a.img.height, maxH);
      }

      atlas.src = canvas.toDataURL("image/png");
      baseAtlas.originalTextureSize = baseAtlas.textureSize = atlas.size = newSize;
      baseAtlas.ready = false;
      baseAtlas.loadAtlas(atlas);
    },
  };

  imgloader.origAtlas = Object.assign({}, atlas);
  // Copy mappings
  imgloader.origAtlas.mappings = {};
  for (let i in atlas.mappings) {
    imgloader.origAtlas.mappings[i] = {};
    imgloader.origAtlas.mappings[i].uv = atlas.mappings[i].uv.slice();
  }

  imgloader.origAtlasImg = new Image();
  imgloader.origAtlasImg.src = atlas.src;
}
