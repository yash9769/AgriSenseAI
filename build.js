const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL || 'PLACEHOLDER_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'PLACEHOLDER_SUPABASE_ANON_KEY';
const grokKey = process.env.GROK_API_KEY || 'PLACEHOLDER_GROK_API_KEY';

console.log('--- AgriSense Build ---');
console.log('Supabase URL:', supabaseUrl.startsWith('http') ? 'Configured' : 'Missing/Placeholder');
console.log('Supabase Key:', supabaseKey.length > 20 ? 'Configured' : 'Missing/Placeholder');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('PLACEHOLDER_SUPABASE_URL', supabaseUrl);
html = html.replace('PLACEHOLDER_SUPABASE_ANON_KEY', supabaseKey);
html = html.replace('PLACEHOLDER_GROK_API_KEY', grokKey);

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync('public/index.html', html);
console.log('Build complete: public/index.html generated.');
