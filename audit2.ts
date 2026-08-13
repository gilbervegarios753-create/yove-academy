import { BRANDS_DATA, DTCS_DATABASE } from './src/data/brandsData.ts';

console.log("BRANDS sample:");
if (BRANDS_DATA.length > 0) {
    console.log(Object.keys(BRANDS_DATA[0]));
}

console.log("DTC Database count:", DTCS_DATABASE ? DTCS_DATABASE.length : 0);
if (DTCS_DATABASE && DTCS_DATABASE.length > 0) {
    console.log("DTC Sample keys:", Object.keys(DTCS_DATABASE[0]));
}

