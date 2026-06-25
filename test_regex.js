const fs = require('fs');
const content = fs.readFileSync('d:/Freddiebusiness/local_assets/sites/6I6G4DgbsRMh9ZSZNxtnvn/script_main.BeGuDugU.mjs', 'utf8');
const dynRegex = /import\s*\(\s*[`"']\.\/([^`"']+)[`"']\s*\)/g;
let match;
while ((match = dynRegex.exec(content)) !== null) {
    console.log(match[1]);
}
