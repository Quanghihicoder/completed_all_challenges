import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.resolve(__dirname, '../assets/icons');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg'));

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const output = files
  .map((file) => {
    const name = path.basename(file, '.svg');
    return `export { ReactComponent as Icon${capitalize(name)} } from './${file}';`;
  })
  .join('\n');

// Write to index.ts inside the icons directory
fs.writeFileSync(path.join(dir, 'index.ts'), output);
