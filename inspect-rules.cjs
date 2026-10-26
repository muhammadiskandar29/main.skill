const fs = require('fs');
const css = fs.readFileSync('C:/xampp/htdocs/inv-digital/extracted-site.css', 'utf8');

const targetIds = ['776da981', '2dce2521', '3b4c65e7', '628f664e', '9592649', '4ad73dca'];
targetIds.forEach(id => {
  const reg = new RegExp(`\\.elementor-element-${id}[^{]*\\{[^}]*\\}`, 'gi');
  const matches = css.match(reg) || [];
  console.log(`\n=== RULES FOR ${id} ===`);
  matches.forEach(m => console.log(m));
});
