import { db } from './db';
import { BRANDS_DATA, VEHICLE_MODELS_DATA } from '../src/data/brandsData';
import { AUTOMOTIVE_15_SYSTEMS } from '../src/data/systemsData';
import { randomUUID } from 'crypto';

export function seedVehiclesData() {
  console.log('[Seed] Starting vehicle data seeding...');

  try {
    // 1. Brands
    const insertBrand = db.prepare(`
      INSERT OR IGNORE INTO vehicle_brands (id, name, logo, country, description, slug, status)
      VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
    `);
    
    for (const brand of BRANDS_DATA) {
      insertBrand.run(
        brand.id,
        brand.name,
        brand.logo,
        brand.country,
        brand.disclaimer,
        brand.id
      );
    }

    // 2. Models, Generations, Engines, Transmissions
    const insertModel = db.prepare(`
      INSERT OR IGNORE INTO vehicle_models (id, brandId, name, slug, segment, status)
      VALUES (?, ?, ?, ?, ?, 'ACTIVE')
    `);

    const insertGeneration = db.prepare(`
      INSERT OR IGNORE INTO vehicle_generations (id, modelId, name, code, startYear, endYear, status)
      VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
    `);

    const insertEngine = db.prepare(`
      INSERT OR IGNORE INTO engines (id, manufacturer, code, name, displacement, fuelType, aspiration, cylinders, configuration, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `);

    const insertModelEngine = db.prepare(`
      INSERT OR IGNORE INTO vehicle_model_engines (modelId, engineId, startYear, endYear)
      VALUES (?, ?, ?, ?)
    `);

    const insertTransmission = db.prepare(`
      INSERT OR IGNORE INTO transmissions (id, manufacturer, code, name, type, gears, status)
      VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
    `);

    const insertModelTransmission = db.prepare(`
      INSERT OR IGNORE INTO vehicle_model_transmissions (modelId, transmissionId, startYear, endYear)
      VALUES (?, ?, ?, ?)
    `);

    for (const model of VEHICLE_MODELS_DATA) {
      insertModel.run(
        model.id,
        model.brandId,
        model.name,
        model.id,
        model.bodyType || 'General'
      );

      // Handle generations
      if (model.generations && model.generations.length > 0) {
        for (const gen of model.generations) {
          const genId = gen.id || randomUUID();
          const startYear = gen.years?.[0] || model.years?.[0];
          const endYear = gen.years?.[gen.years.length - 1] || model.years?.[model.years.length - 1];
          
          insertGeneration.run(
            genId,
            model.id,
            gen.name,
            gen.code || null,
            startYear,
            endYear
          );

          // Handle engines in generation
          if (gen.engines) {
            for (const engine of gen.engines) {
              const engineId = engine.code; 
              insertEngine.run(
                engineId,
                model.brandId,
                engine.code,
                engine.code,
                parseFloat(engine.displacement) || 0,
                engine.fuelType,
                engine.timingType || null,
                null,
                null
              );

              insertModelEngine.run(
                model.id,
                engineId,
                startYear,
                endYear
              );

              // Transmissions
              if (engine.transmissions) {
                for (const trans of engine.transmissions) {
                  insertTransmission.run(
                    trans.id,
                    model.brandId,
                    trans.id,
                    trans.name,
                    trans.type,
                    null
                  );

                  insertModelTransmission.run(
                    model.id,
                    trans.id,
                    startYear,
                    endYear
                  );
                }
              }
            }
          }
        }
      } else if (model.engines) {
        // Models without generations but with engines
        const startYear = model.years?.[0];
        const endYear = model.years?.[model.years.length - 1];

        for (const engine of model.engines) {
          const engineId = engine.code;
          insertEngine.run(
            engineId,
            model.brandId,
            engine.code,
            engine.code,
            parseFloat(engine.displacement) || 0,
            engine.fuelType,
            engine.timingType || null,
            null,
            null
          );

          insertModelEngine.run(
            model.id,
            engineId,
            startYear,
            endYear
          );

          if (engine.transmissions) {
            for (const trans of engine.transmissions) {
              insertTransmission.run(
                trans.id,
                model.brandId,
                trans.id,
                trans.name,
                trans.type,
                null
              );

              insertModelTransmission.run(
                model.id,
                trans.id,
                startYear,
                endYear
              );
            }
          }
        }
      }
    }

    // 3. Systems, Components
    const insertSystem = db.prepare(`
      INSERT OR IGNORE INTO vehicle_systems (id, name, slug, description, category)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertComponent = db.prepare(`
      INSERT OR IGNORE INTO components (id, systemId, name, slug, description)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const sys of AUTOMOTIVE_15_SYSTEMS) {
      insertSystem.run(
        sys.id,
        sys.name,
        sys.id,
        sys.description || null,
        sys.relatedCourseCategory
      );

      if (sys.keyComponents) {
        for (const compName of sys.keyComponents) {
          const compSlug = compName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const compId = `${sys.id}-${compSlug}`;
          insertComponent.run(
            compId,
            sys.id,
            compName,
            compSlug,
            null
          );
        }
      }
    }

    console.log('[Seed] Vehicle data seeded successfully.');
  } catch (error) {
    console.error('[Seed] Error seeding vehicle data:', error);
  }
}

// execute if run directly
if (typeof process !== 'undefined' && process.argv && process.argv[1] && import.meta.url) {
  if (import.meta.url.startsWith("file:") && process.argv[1] === new URL(import.meta.url).pathname) {
    seedVehiclesData();
  }
}
