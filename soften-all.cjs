const fs = require('fs');
const glob = require('glob');

const files = glob.sync('components/**/*.tsx');
files.push('App.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Save a backup of the original file content
  fs.writeFileSync(file + '.bak', content);
  
  // Replace dark backgrounds with soft light ones
  content = content.replace(/bg-stone-950/g, 'bg-stone-100'); // Main background changes to light stone
  content = content.replace(/bg-stone-900/g, 'bg-stone-50');  // Cards/panels changes to soft off-white
  content = content.replace(/bg-stone-850/g, 'bg-stone-50');
  content = content.replace(/bg-stone-800/g, 'bg-stone-100'); // Inputs/secondary widgets to stone-100
  content = content.replace(/bg-stone-950\/80/g, 'bg-stone-50\/80');
  content = content.replace(/bg-stone-950\/90/g, 'bg-stone-50\/90');
  content = content.replace(/bg-stone-900\/50/g, 'bg-stone-50\/50');
  content = content.replace(/bg-stone-900\/40/g, 'bg-stone-50\/40');
  content = content.replace(/bg-stone-900\/30/g, 'bg-stone-50\/30');
  content = content.replace(/bg-stone-900\/20/g, 'bg-stone-50\/20');
  content = content.replace(/bg-stone-900\/10/g, 'bg-stone-50\/10');
  content = content.replace(/bg-stone-900\/5/g, 'bg-stone-50\/5');
  content = content.replace(/bg-stone-800\/50/g, 'bg-stone-100\/50');
  content = content.replace(/bg-stone-800\/30/g, 'bg-stone-100\/30');
  content = content.replace(/bg-stone-800\/20/g, 'bg-stone-100\/20');
  
  // Replace dark borders with light borders
  content = content.replace(/border-stone-800/g, 'border-stone-200');
  content = content.replace(/border-stone-700/g, 'border-stone-200');
  content = content.replace(/border-stone-900/g, 'border-stone-200');
  
  // Invert text colors from light-on-dark to dark-on-light
  content = content.replace(/text-stone-100/g, 'text-stone-900');
  content = content.replace(/text-stone-200/g, 'text-stone-800');
  content = content.replace(/text-stone-300/g, 'text-stone-700');
  content = content.replace(/text-stone-400/g, 'text-stone-500');
  
  // Text colors specific to light text headers that were on dark backgrounds
  content = content.replace(/text-amber-50/g, 'text-amber-900');
  content = content.replace(/text-amber-100/g, 'text-amber-800');
  content = content.replace(/text-white(?![\s\w-]*bg-(?:amber|emerald|red|blue|rose|sky|violet|indigo)-[5-9]00)/g, 'text-stone-900');
  
  fs.writeFileSync(file, content);
});

console.log('Successfully completed initial conversion to soft light theme!');
