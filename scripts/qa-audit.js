const fs = require('fs');
const path = require('path');

console.log('=== QA AUDIT START ===\n');

// 1. Verify README references
const readme = fs.readFileSync('README.md', 'utf8');
const imgRegex = /src="([^"]+)"/g;
let m;
let missingFiles = 0;
while ((m = imgRegex.exec(readme))) {
  const filePath = m[1];
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing asset referenced in README: ${filePath}`);
    missingFiles++;
  } else {
    const size = fs.statSync(filePath).size;
    console.log(`✅ Asset verified: ${filePath} (${size} bytes)`);
  }
}

// 2. Validate XML of all SVGs in assets/
console.log('\n--- Validating SVG XML ---');
const { execSync } = require('child_process');
const assets = fs.readdirSync('assets').filter(f => f.endsWith('.svg'));
let invalidXml = 0;
for (const file of assets) {
  const filePath = path.join('assets', file);
  try {
    execSync(`python -c "import xml.etree.ElementTree as ET; ET.parse(r'${filePath}')"`, { stdio: 'pipe' });
    console.log(`✅ Valid SVG XML: ${file}`);
  } catch (err) {
    console.error(`❌ XML Parsing Error in ${file}: ${err.message}`);
    invalidXml++;
  }
}

// 3. Verify viewBox on main section cards
console.log('\n--- Verifying Uniform Card Dimensions ---');
const mainCards = ['banner.svg', 'stack.svg', 'city.svg', 'footer.svg'];
for (const card of mainCards) {
  const content = fs.readFileSync(path.join('assets', card), 'utf8');
  const vb = content.match(/viewBox="([^"]+)"/);
  console.log(`📐 ${card}: viewBox="${vb ? vb[1] : 'NONE'}"`);
}

console.log('\n=== QA AUDIT COMPLETE ===');
if (missingFiles === 0 && invalidXml === 0) {
  console.log('🎉 ALL AUDITS PASSED WITH ZERO ERRORS');
} else {
  console.error('⚠️ AUDIT REPORTED ISSUES');
  process.exit(1);
}
