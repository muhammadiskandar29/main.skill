const fs = require('fs');
const html = fs.readFileSync('C:/Users/Iskandar/.gemini/antigravity-ide/brain/b130710c-1d9a-4564-beca-0e268e34cbc5/.system_generated/steps/2/content.md', 'utf8');

const linkRegex = /<link[^>]+rel=['"]stylesheet['"][^>]+href=['"]([^'"]+)['"]/gi;
const links = [];
let m;
while ((m = linkRegex.exec(html)) !== null) {
  links.push(m[1]);
}

const fontMatches = html.match(/https?:\/\/[^"']+\.(?:woff2?|ttf|otf)/gi) || [];

console.log('--- CSS LINKS ---');
links.forEach(l => console.log(l));

console.log('\n--- FONTS ---');
[...new Set(fontMatches)].forEach(f => console.log(f));
