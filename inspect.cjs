const fs = require('fs');
const html = fs.readFileSync('C:/Users/Iskandar/.gemini/antigravity-ide/brain/b130710c-1d9a-4564-beca-0e268e34cbc5/.system_generated/steps/2/content.md', 'utf8');

const elementorCss = html.match(/https?:\/\/[^"']+\/uploads\/elementor\/css\/[^"']+\.css/gi) || [];
console.log('Elementor CSS:');
[...new Set(elementorCss)].forEach(c => console.log(c));

const images = html.match(/https?:\/\/[^"']+\.(?:webp|jpg|jpeg|png)/gi) || [];
console.log('\nTop Images:');
[...new Set(images)].slice(0, 30).forEach(img => console.log(img));
