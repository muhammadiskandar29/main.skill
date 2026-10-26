const fs = require('fs');
const css = fs.readFileSync('C:/xampp/htdocs/inv-digital/extracted-site.css', 'utf8');

const ids = ['f17f592', '5924f15a', '274ed723'];
ids.forEach(id => {
  const reg = new RegExp(`\\.elementor-element-${id}[^{]*\\{[^}]*\\}`, 'gi');
  console.log(`\n=== RULES FOR ${id} ===`);
  (css.match(reg) || []).forEach(r => console.log(r));
});
