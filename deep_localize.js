const fs = require('fs');
const path = require('path');

const targetDir = 'd:/Freddiebusiness/local_assets/sites/6I6G4DgbsRMh9ZSZNxtnvn';
const indexHtmlPath = 'd:/Freddiebusiness/index.html';

// 1. Deep localize all .mjs and .json files in the target directory
const files = fs.readdirSync(targetDir);
for (const file of files) {
    const filePath = path.join(targetDir, file);
    if (file.endsWith('.mjs') || file.endsWith('.json')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace all instances of framer CDN with our absolute local path
        let newContent = content.replace(/https:\/\/framerusercontent\.com\//g, '/local_assets/');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated internal links in: ${file}`);
        }
    }
}

// 2. Update index.html to point to our localized JS files
let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
let newHtmlContent = htmlContent.replace(/https:\/\/framerusercontent\.com\//g, '/local_assets/');
if (htmlContent !== newHtmlContent) {
    fs.writeFileSync(indexHtmlPath, newHtmlContent, 'utf8');
    console.log('Updated index.html to use local JS modules');
}

console.log('Deep localization complete.');
