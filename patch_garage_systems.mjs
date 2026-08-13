import fs from 'fs';
let code = fs.readFileSync('src/components/garage/GarageView.tsx', 'utf8');

const target = `  // Systems filtering
  const allSystems = engine.systems || [];
  const filteredSystems = selectedSystemCategory === 'all'
    ? allSystems
    : allSystems.filter(s => s.category === selectedSystemCategory);

  // Components (Sensors & Actuators)
  const allComponents = allSystems.flatMap(s => s.components || []);
  const sensors = allComponents.filter(c => c.type === 'sensor');
  const actuators = allComponents.filter(c => c.type === 'actuator');
  const ecus = allComponents.filter(c => c.type === 'ecu');`;

const replacement = `  // Systems filtering
  const allSystems = systems || [];
  const filteredSystems = selectedSystemCategory === 'all'
    ? allSystems
    : allSystems.filter((s: any) => s.category === selectedSystemCategory);

  // Components (Sensors & Actuators)
  const allComponents = components || [];
  const sensors = allComponents.filter((c: any) => c.type === 'sensor' || c.name.toLowerCase().includes('sensor') || c.name.toLowerCase().includes('sonda'));
  const actuators = allComponents.filter((c: any) => c.type === 'actuator' || c.name.toLowerCase().includes('válvula') || c.name.toLowerCase().includes('actuador') || c.name.toLowerCase().includes('inyector') || c.name.toLowerCase().includes('bobina'));
  // ecus variable is already destructured from useGarageData, so we'll just alias it for local use
  const filteredEcus = ecus || [];`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/garage/GarageView.tsx', code);
console.log("Success");
