const fs = require('fs');
const css = fs.readFileSync('C:/xampp/htdocs/inv-digital/extracted-site.css', 'utf8');

// Cari font-family yang dipakai pada heading
const headings = css.match(/(?:h1|h2|h3|\.elementor-heading-title)[^{]*\{[^}]*font-family:[^;}]+/gi) || [];
console.log('Heading fonts:');
[...new Set(headings)].slice(0, 20).forEach(h => console.log(h.trim()));

// Cari cover / popup / overlay classes
const overlays = css.match(/\.(?:cover|popup|modal|dialog|gate|welcome)[^{]*\{[^}]*\}/gi) || [];
console.log('\nOverlay classes:');
[...new Set(overlays)].slice(0, 15).forEach(o => console.log(o.trim()));
