const fs = require("fs");
const path = require("path");

// List of all the files to concatenate
const files = [
  "./src/mtwist.js",
  "./src/maths.js",
  "./src/hspace.js",
  "./src/zjson.js",
  "./src/protocol.js",
  "./src/trans.js",
  "./src/mxserver.js",
  "./src/utils.js",
  "./src/colors.js",
  "./src/maps.js",
  "./src/sim.js",
  "./src/survival.js",
  //"./src/interpolator.js",
  "./src/things.js",
  "./src/unit.js",
  "./src/parts.js",
  "./src/ai.js",
  //"./src/aidata.js",
  "./src/grid.js",
];

// Read and concatenate the contents of all the files
const contents = files.reduce((acc, file) => {
  const filePath = path.join(__dirname, file);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  return acc + fileContents + "\n";
}, "");

// Write the concatenated contents to the output file in the public/js directory
const outputFilePath = path.join(__dirname, "arcon.js");
fs.writeFileSync(outputFilePath, contents, "utf-8");

console.log("Successfully created arcon.js");
