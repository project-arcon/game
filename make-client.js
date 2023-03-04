const fs = require("fs");
const path = require("path");

// List of all the files to concatenate
const files = [
  "./lib/fingerprint2.min.js",
  "./lib/lz-string.min.js",
  "./lib/detect.min.js",
  "./lib/moment.min.js",
  "./lib/mtwist.js",
  "./src/maths.js",
  "./src/hspace.js",
  "./src/linky.js",
  "./src/zjson.js",
  "./src/protocol.js",
  "./src/utils.js",
  "./src/db.js",
  "./src/onecup.js",
  "./src/transloader-client.js",
  "./src/trans.js",
  "./src/mxserver-client.js",
  "./src/account.js",
  "./src/engine.js",
  "./src/colors.js",
  "./src/sound.js",
  "./src/maps.js",
  "./src/sim.js",
  "./src/simsend.js",
  "./src/survival.js",
  "./src/interpolator.js",
  "./src/things.js",
  "./src/unit.js",
  "./src/parts.js",
  "./src/ai.js",
  "./src/aidata.js",
  "./src/network.js",
  "./src/ui.js",
  "./src/settings.js",
  "./src/challenges.js",
  "./src/grid.js",
  "./src/design.js",
  "./src/battle.js",
  "./src/buildbar.js",
  "./src/fleet.js",
  "./src/tutor.js",
  "./src/galaxy.js",
  "./src/galaxydata.js",
  "./src/bubbles.js",
  "./src/menus.js",
  "./src/chat.js",
  "./src/battleroom.js",
  "./src/tournaments.js",
  "./src/mod.js",
  "./src/vbattle.js",
  "./src/vparts.js",
  "./src/arcon.js",
  "./atlases/atlas.js",
];

// Read and concatenate the contents of all the files
const contents = files.reduce((acc, file) => {
  const filePath = path.join(__dirname, file);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  return acc + fileContents + "\n";
}, "");

// Write the concatenated contents to the output file in the public/js directory
const outputFilePath = path.join(__dirname, "../website/public/js/arcon.js");
fs.writeFileSync(outputFilePath, contents, "utf-8");

console.log("Successfully created arcon.js");
