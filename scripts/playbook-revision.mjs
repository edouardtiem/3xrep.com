import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const files = readdirSync('src/lib/brain').filter(name => name.endsWith('.ts') && !name.endsWith('.test.ts')).map(name => `src/lib/brain/${name}`);
files.push('src/lib/corrections.ts');
files.sort();
const hash = createHash('sha256');
for (const file of files) hash.update(file + '\0' + readFileSync(file, 'utf8') + '\0');
const revision = { engine: hash.digest('hex'), files };
writeFileSync('src/lib/playbooks/revision.json', JSON.stringify(revision, null, 2) + '\n');
