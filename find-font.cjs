const fs = require('fs');
const css = fs.readFileSync('C:/xampp/htdocs/inv-digital/extracted-site.css', 'utf8');

const reg = /@font-face\s*\{[^}]*newyork[^}]*\}/gi;
const matches = css.match(reg) || [];
console.log('NewYork font faces:');
matches.forEach(m => console.log(m));
