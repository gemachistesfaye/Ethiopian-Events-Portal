const fs = require('fs');
const glob = require('glob');

const files = glob.sync('components/**/*.tsx');
files.push('App.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace dark text classes with light text classes to fix black-on-black issues
  content = content.replace(/text-stone-900/g, 'text-stone-100');
  content = content.replace(/text-stone-800/g, 'text-stone-200');
  content = content.replace(/text-black/g, 'text-stone-100');
  
  // Force text color on form inputs, textareas, and selects
  content = content.replace(/<input(.*?)className=\"([^\"]*)\"/g, (match, p1, p2) => {
    if (!p2.includes('text-stone-100') && !p2.includes('text-white')) {
      return `<input${p1}className="${p2} text-stone-100 bg-stone-900"`;
    }
    return match;
  });
  
  content = content.replace(/<textarea(.*?)className=\"([^\"]*)\"/g, (match, p1, p2) => {
    if (!p2.includes('text-stone-100') && !p2.includes('text-white')) {
      return `<textarea${p1}className="${p2} text-stone-100 bg-stone-900"`;
    }
    return match;
  });
  
  content = content.replace(/<select(.*?)className=\"([^\"]*)\"/g, (match, p1, p2) => {
    if (!p2.includes('text-stone-100') && !p2.includes('text-white')) {
      return `<select${p1}className="${p2} text-stone-100 bg-stone-900"`;
    }
    return match;
  });
  
  // For any text-stone-600 or 700 that might be hard to read
  content = content.replace(/text-stone-700/g, 'text-stone-300');
  content = content.replace(/text-stone-600/g, 'text-stone-400');
  
  fs.writeFileSync(file, content);
});
console.log('Fixed black text issues in dark mode.');
