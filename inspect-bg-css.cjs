const fs = require('fs');
const css = fs.readFileSync('C:/xampp/htdocs/inv-digital/extracted-site.css', 'utf8');

const bgMatches = css.match(/[^{}]*background-image:[^;}]*/gi) || [];
console.log('Background Images in CSS:');
bgMatches.forEach(bg => {
  if (bg.includes('http') || bg.includes('UW-')) console.log(bg.trim());
});
