const fs = require('fs');

let content = fs.readFileSync('app/vault/[id]/page.tsx', 'utf8');

// Fix the catch error toast
content = content.replace(
  /toast\('error', error instanceof Error \? error.message : 'Failed to download vault'\)/g,
  "toast(error instanceof Error ? error.message : 'Failed to download vault', 'error')"
);

// Also check for similar patterns with 'Copied to clipboard'
content = content.replace(/toast\('success', 'Copied to clipboard'\)/g, "toast('Copied to clipboard', 'success')");

fs.writeFileSync('app/vault/[id]/page.tsx', content);
console.log('Fixed remaining toast calls');
