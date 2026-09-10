const { execSync } = require('child_process');

try {
  execSync('npx tsx -r dotenv/config src/lib/schema.ts', { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
