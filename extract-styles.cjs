const fs = require('fs');
const html = fs.readFileSync('C:/Users/Iskandar/.gemini/antigravity-ide/brain/b130710c-1d9a-4564-beca-0e268e34cbc5/.system_generated/steps/2/content.md', 'utf8');

// Cari tag <style>...</style>
const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
console.log('Total style tags:', styleMatches.length);

let aggregatedCss = '';
styleMatches.forEach((st, idx) => {
  const content = st.replace(/<\/?style[^>]*>/gi, '');
  aggregatedCss += `\n/* --- STYLE BLOCK ${idx} --- */\n` + content;
});

fs.writeFileSync('C:/xampp/htdocs/inv-digital/extracted-site.css', aggregatedCss, 'utf8');
console.log('Saved extracted-site.css (bytes):', aggregatedCss.length);
