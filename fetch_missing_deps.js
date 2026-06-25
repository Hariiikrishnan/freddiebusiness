const fs = require('fs');
const https = require('https');
const path = require('path');

const baseUrl = 'https://framerusercontent.com/sites/6I6G4DgbsRMh9ZSZNxtnvn/';
const localDir = 'd:/Freddiebusiness/local_assets/sites/6I6G4DgbsRMh9ZSZNxtnvn/';

const downloaded = new Set();
const toDownload = [];

// Get all currently downloaded .mjs files and scan them for imports
const existingFiles = fs.readdirSync(localDir).filter(f => f.endsWith('.mjs'));
for (const file of existingFiles) {
    downloaded.add(file);
    const content = fs.readFileSync(path.join(localDir, file), 'utf8');
    
    const staticRegex = /from\s*["']\.\/([^"']+)["']/g;
    let match;
    while ((match = staticRegex.exec(content)) !== null) {
        toDownload.push(match[1]);
    }
    
    const dynRegex = /import\s*\(\s*[`"']\.\/([^`"']+)[`"']\s*\)/g;
    while ((match = dynRegex.exec(content)) !== null) {
        toDownload.push(match[1]);
    }
}

function downloadFile(filename) {
    return new Promise((resolve, reject) => {
        const url = baseUrl + filename;
        const dest = path.join(localDir, filename);
        if (fs.existsSync(dest)) {
            resolve(dest);
            return;
        }
        
        console.log('Downloading', url);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.error('Failed to get ' + url + ' (' + res.statusCode + ')');
                resolve(null);
                return;
            }
            
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(dest);
            });
        }).on('error', (err) => {
            console.error(err);
            resolve(null);
        });
    });
}

async function processFile(filename) {
    if (downloaded.has(filename)) return;
    downloaded.add(filename);
    
    const filePath = await downloadFile(filename);
    if (!filePath) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    const staticRegex = /from\s*["']\.\/([^"']+)["']/g;
    let match;
    while ((match = staticRegex.exec(content)) !== null) {
        toDownload.push(match[1]);
    }
    
    const dynRegex = /import\s*\(\s*[`"']\.\/([^`"']+)[`"']\s*\)/g;
    while ((match = dynRegex.exec(content)) !== null) {
        toDownload.push(match[1]);
    }
}

async function run() {
    console.log('Starting recursive dependency fetch...');
    while (toDownload.length > 0) {
        const current = toDownload.shift();
        await processFile(current);
    }
    console.log('Finished fetching all dependencies!');
}

run();
