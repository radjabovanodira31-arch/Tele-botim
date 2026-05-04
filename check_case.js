import fs from 'fs';

const content = fs.readFileSync('bot.js', 'utf-8');
const lines = content.split('\n');
const errors = [];
const actualFiles = fs.readdirSync('images');

lines.forEach((line, i) => {
    // Matches img: "./images/..."
    const match = line.match(/img:\s*"(\.\/images\/[^"]+)"/);
    if (match) {
        const fullPath = match[1];
        const filePath = fullPath.replace('./images/', '');
        if (!actualFiles.includes(filePath)) {
            const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === filePath.toLowerCase());
            if (caseInsensitiveMatch) {
                errors.push(`Line ${i+1}: CASE MISMATCH: Code has '${filePath}', but file is '${caseInsensitiveMatch}'`);
            } else {
                errors.push(`Line ${i+1}: MISSING: '${filePath}' not found in images directory`);
            }
        }
    }
});

if (errors.length === 0) {
    console.log("All image paths match exactly!");
} else {
    console.log("Errors found:");
    errors.forEach(e => console.log(e));
}
