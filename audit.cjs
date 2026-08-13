const fs = require('fs');

function countKeys(filePath, regex) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  } catch (e) {
    return "Error reading file";
  }
}

console.log("--- COURSES ---");
console.log("Courses in courses50Data.ts:", countKeys('src/data/courses50Data.ts', /id:\s*'course-[^']+'/g));
console.log("Modules in courses50Data.ts:", countKeys('src/data/courses50Data.ts', /id:\s*'mod-[^']+'/g));
console.log("Lessons in courses50Data.ts:", countKeys('src/data/courses50Data.ts', /id:\s*'les-[^']+'/g));

console.log("--- BRANDS ---");
console.log("Brands in brandsData.ts:", countKeys('src/data/brandsData.ts', /id:\s*'brand-[^']+'/g));
console.log("Models in brandsData.ts:", countKeys('src/data/brandsData.ts', /id:\s*'model-[^']+'/g));
console.log("Engines in brandsData.ts:", countKeys('src/data/brandsData.ts', /id:\s*'eng-[^']+'/g));
console.log("Transmissions in brandsData.ts:", countKeys('src/data/brandsData.ts', /id:\s*'trans-[^']+'/g));

console.log("--- DTCs & SYSTEMS ---");
console.log("Systems in systemsData.ts:", countKeys('src/data/systemsData.ts', /id:\s*'sys-[^']+'/g));
console.log("Components in systemsData.ts:", countKeys('src/data/systemsData.ts', /id:\s*'comp-[^']+'/g));
console.log("DTCs in systemsData.ts:", countKeys('src/data/systemsData.ts', /id:\s*'DTC-[^']+'/g));

console.log("--- CASES & LABS ---");
console.log("Cases in casesData.ts:", countKeys('src/data/casesData.ts', /id:\s*'case-[^']+'/g));
console.log("Labs in labsData.ts:", countKeys('src/data/labsData.ts', /id:\s*'lab-[^']+'/g));
