const fs = require('fs');
const https = require('https');
const path = require('path');

const localDir = 'd:/Freddiebusiness';
const mjsDir = path.join(localDir, 'local_assets/sites/6I6G4DgbsRMh9ZSZNxtnvn');
const imagesDir = path.join(localDir, 'local_assets/images');
const framerBase = 'https://framerusercontent.com/images/';

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const allImages = new Set();

function extractImages(content) {
    // We are looking for strings like /local_assets/images/xyz.jpg
    const regex = /\/local_assets\/images\/([a-zA-Z0-9_\-\.]+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        allImages.add(match[1]);
    }
}

// Check index.html
const htmlContent = fs.readFileSync(path.join(localDir, 'index.html'), 'utf8');
extractImages(htmlContent);

// Check all .mjs files
const mjsFiles = fs.readdirSync(mjsDir).filter(f => f.endsWith('.mjs'));
for (const file of mjsFiles) {
    const content = fs.readFileSync(path.join(mjsDir, file), 'utf8');
    extractImages(content);
}

const missingImages = [];
for (const img of allImages) {
    if (!fs.existsSync(path.join(imagesDir, img))) {
        missingImages.push(img);
    }
}

console.log(`Found ${allImages.size} total images, ${missingImages.length} are missing.`);

function downloadImage(filename) {
    return new Promise((resolve) => {
        const url = framerBase + filename;
        const dest = path.join(imagesDir, filename);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.error('Failed to get ' + url + ' (' + res.statusCode + ')');
                resolve(false);
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            console.error(err);
            resolve(false);
        });
    });
}

async function run() {
    let count = 0;
    for (const img of missingImages) {
        console.log(`Downloading missing image: ${img}`);
        const success = await downloadImage(img);
        if (success) count++;
    }
    console.log(`Successfully downloaded ${count} missing images.`);
}

run();
