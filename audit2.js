const fs = require('fs');

// We will use regex to count `{ id: ` blocks in each file
function countItems(file, regex) {
  try {
     const str = fs.readFileSync(file, 'utf-8');
     const matches = str.match(regex);
     return matches ? matches.length : 0;
  } catch(e) {
     return 0;
  }
}

// Just counting occurrences of `id: ` or similar to get a rough estimate
// Better yet, let's parse the AST or use a smart regex.
// Courses: count `id: ` but only inside the COURSES_50_CATALOG array?
// Actually, let's grep 'id: ' and 'category: ' inside courses50Data.ts
// Or we can just build a proper TS file and use tsx to execute it.
