const fs = require('fs');
const html = fs.readFileSync('C:/Users/Iskandar/.gemini/antigravity-ide/brain/b130710c-1d9a-4564-beca-0e268e34cbc5/.system_generated/steps/2/content.md', 'utf8');

const lastIdx = html.lastIndexOf('THE BRIDE');
console.log('Last THE BRIDE at:', lastIdx);
if (lastIdx !== -1) {
  console.log(html.substring(lastIdx - 400, lastIdx + 1600));
}
