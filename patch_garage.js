const fs = require('fs');
let code = fs.readFileSync('src/components/garage/GarageView.tsx', 'utf8');

const target = `  const brand = brands.find(b => b.id === selectedBrandId) || brands[0];
  const model = brandModels.find((m: any) => m.id === selectedModelId) || brandModels[0] || {
    id: 'base-model',
    name: brand ? \`\${brand.name} Base\` : 'Modelo Base',
    brandId: brand ? brand.id : 'toyota',
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    engines: [
      {
        code: 'ENGINE-1.6L',
        displacement: '1.6L 16V',
        fuelType: 'Gasolina',
        power: '120 HP',
        systems: []
      }
    ]
  };

  const engine = model.engines.find(e => e.code === selectedEngineCode) || model.engines[0] || {
    code: 'STANDARD-1.6L',
    displacement: '1.6L',
    fuelType: 'Gasolina' as const,
    power: '120 HP',
    systems: []
  };

  const transmission = engine.transmissions?.find(t => t.id === selectedTransId) || engine.transmissions?.[0];`;

const replacement = `  const brand = brands.find(b => b.id === selectedBrandId) || brands[0];
  const model = brandModels.find((m: any) => m.id === selectedModelId) || brandModels[0];
  const engine = engines.find(e => e.code === selectedEngineCode || e.id === selectedEngineCode) || engines[0];
  const transmission = transmissions.find(t => t.id === selectedTransId) || transmissions[0];`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/garage/GarageView.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
