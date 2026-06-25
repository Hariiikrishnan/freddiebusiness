const fs = require('fs');
const html = fs.readFileSync('d:/Freddiebusiness/index.html', 'utf8');
const main = html.split('<div id="main"')[1];
console.log('local_assets count:', (main.match(/local_assets/g) || []).length);
console.log('framerusercontent count:', (main.match(/framerusercontent/g) || []).length);
