import { useState, useEffect, useCallback } from 'react';
import { CoreApi } from '../services/api/coreApi';

export function useGarageData(selectedBrandId: string, selectedModelId?: string, selectedSystemId?: string) {
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [generations, setGenerations] = useState<any[]>([]);
  const [engines, setEngines] = useState<any[]>([]);
  const [transmissions, setTransmissions] = useState<any[]>([]);
  const [systems, setSystems] = useState<any[]>([]);
  const [components, setComponents] = useState<any[]>([]);
  const [ecus, setEcus] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // Initialize basic lookups
  useEffect(() => {
    Promise.all([
      CoreApi.getBrands(),
      CoreApi.getSystems(),
      CoreApi.getEcus()
    ]).then(([brandsData, systemsData, ecusData]) => {
      setBrands(brandsData);
      setSystems(systemsData);
      setEcus(ecusData);
    });
  }, []);

  // Fetch models on brand change
  useEffect(() => {
    if (selectedBrandId) {
      setLoading(true);
      CoreApi.getModels(selectedBrandId).then(data => {
        setModels(data);
        setLoading(false);
      });
    } else {
      setModels([]);
    }
  }, [selectedBrandId]);

  // Fetch gen/eng/trans on model change
  useEffect(() => {
    if (selectedModelId) {
      Promise.all([
        CoreApi.getGenerations(selectedModelId),
        CoreApi.getEngines(selectedModelId),
        CoreApi.getTransmissions(selectedModelId)
      ]).then(([gensData, engsData, transData]) => {
        setGenerations(gensData);
        setEngines(engsData);
        setTransmissions(transData);
      });
    } else {
      setGenerations([]);
      setEngines([]);
      setTransmissions([]);
    }
  }, [selectedModelId]);

  // Fetch components on system change
  useEffect(() => {
    if (selectedSystemId) {
      CoreApi.getComponents(selectedSystemId).then(comps => {
        setComponents(comps);
      });
    } else {
      setComponents([]);
    }
  }, [selectedSystemId]);

  return {
    brands,
    models,
    generations,
    engines,
    transmissions,
    systems,
    components,
    ecus,
    loading
  };
}
