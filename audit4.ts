import { BRANDS_DATA, DTCS_DATABASE } from './src/data/brandsData.ts';

let models = 0;
let brandDtcs = 0;

BRANDS_DATA.forEach(b => {
    if (b.popularModels) models += b.popularModels.length;
    if (b.commonDtcs) brandDtcs += b.commonDtcs.length;
});

console.log("Modelos (strings):", models);
console.log("DTCs dentro de BRANDS:", brandDtcs);
console.log("DTCs en DTCS_DATABASE:", DTCS_DATABASE.length);
