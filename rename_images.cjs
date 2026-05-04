const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('bot.js', 'utf-8');
const lines = content.split('\n');
const actualFiles = fs.readdirSync('images');
let newContent = content;

const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

lines.forEach((line, i) => {
    const match = line.match(/(id:\s*'([^']+)'[^}]+img:\s*["'])([^"']+)["']/);
    if (match) {
        const fullMatch = match[0];
        const id = match[2];
        const fullPath = match[3];
        const originalImgName = fullPath.replace('./images/', '');
        
        let bestMatch = null;
        let originalNormalized = normalize(originalImgName);
        for (let file of actualFiles) {
            let fileNormalized = normalize(file);
            if (fileNormalized === originalNormalized || fileNormalized.includes(originalNormalized) || originalNormalized.includes(fileNormalized)) {
                bestMatch = file;
                break;
            }
        }
        
        if (!bestMatch) {
            for (let file of actualFiles) {
                if (normalize(file).startsWith(originalNormalized.substring(0, 5))) {
                    bestMatch = file;
                    break;
                }
            }
        }

        if (bestMatch) {
            const newName = id + '.jpg';
            try {
                fs.renameSync(path.join('images', bestMatch), path.join('images', newName));
                console.log('Renamed', bestMatch, 'to', newName);
                
                const idx = actualFiles.indexOf(bestMatch);
                if (idx > -1) actualFiles[idx] = newName;
            } catch (e) {
                console.log('Rename failed or already done for', bestMatch);
            }
            
            const newLine = line.replace(fullPath, './images/' + newName);
            newContent = newContent.replace(line, newLine);
        } else {
            console.log('No match found for', originalImgName);
        }
    }
});

fs.writeFileSync('bot.js', newContent);
console.log('bot.js updated.');
