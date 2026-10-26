const fs = require('fs');
const html = fs.readFileSync('C:/Users/Iskandar/.gemini/antigravity-ide/brain/b130710c-1d9a-4564-beca-0e268e34cbc5/.system_generated/steps/2/content.md', 'utf8');

const idx = html.indexOf('OPEN INVITATION');
console.log('Found OPEN INVITATION at index:', idx);
if (idx !== -1) {
  const snippet = html.substring(Math.max(0, idx - 1200), Math.min(html.length, idx + 800));
  console.log('\n--- SNIPPET ---');
  console.log(snippet);
}
