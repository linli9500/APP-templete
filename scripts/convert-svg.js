const sharp = require('sharp');
const path = require('path');

const inputPath = path.resolve(__dirname, '../assets/logo-fortune.svg');
const outputPath = path.resolve(__dirname, '../assets/logo-fortune.png');

console.log(`Converting ${inputPath} to ${outputPath}...`);

sharp(inputPath)
  .resize(1024) // Resize to a reasonable size for splash screen
  .png()
  .toFile(outputPath)
  .then(info => {
    console.log('Conversion successful:', info);
  })
  .catch(err => {
    console.error('Error converting file:', err);
    process.exit(1);
  });
