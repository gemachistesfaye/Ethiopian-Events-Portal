const fs = require('fs');
const glob = require('glob');

const files = glob.sync('components/**/*.tsx');
files.push('App.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Soften the pure whites to reduce glare (warm stone palette)
  content = content.replace(/bg-stone-50/g, 'bg-stone-100');
  content = content.replace(/bg-white/g, 'bg-stone-50');
  
  fs.writeFileSync(file, content);
});
console.log('Successfully softened whites across the UI.');
