const fs = require('fs');

let content = fs.readFileSync('app/vault/[id]/page.tsx', 'utf8');

// Fix toast calls: change toast('type', 'message') to toast('message', 'type')
content = content.replace(/toast\('success',\s*'([^']+)'\)/g, "toast('$1', 'success')");
content = content.replace(/toast\('error',\s*'([^']+)'\)/g, "toast('$1', 'error')");
content = content.replace(/toast\('info',\s*'([^']+)'\)/g, "toast('$1', 'info')");

fs.writeFileSync('app/vault/[id]/page.tsx', content);
console.log('Fixed toast calls in vault page');
