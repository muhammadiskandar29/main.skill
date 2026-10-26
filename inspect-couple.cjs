const fs = require('fs');
const html = fs.readFileSync('C:/Users/Iskandar/.gemini/antigravity-ide/brain/b130710c-1d9a-4564-beca-0e268e34cbc5/.system_generated/steps/2/content.md', 'utf8');

const coupleIdx = html.indexOf('Ni Made Sekar');
console.log('Found Ni Made Sekar at:', coupleIdx);
if (coupleIdx !== -1) {
  console.log(html.substring(coupleIdx - 800, coupleIdx + 1200));
}
