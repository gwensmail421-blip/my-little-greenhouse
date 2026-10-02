import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { PLANTS, type Plant, type PlantId } from '@/data/plants';

const KEY = 'my-plants/v1';

type MyPlants = {
  ids: PlantId[];
  plants: Plant[];
  loaded: boolean;
  has: (id: PlantId) => boolean;
  toggle: (id: PlantId) => void;
};

const Ctx = createContext<MyPlants | null>(null);

export function MyPlantsProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<PlantId[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as string[];
        setIds(saved.filter((id): id is PlantId => id in PLANTS));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const toggle = useCallback((id: PlantId) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<MyPlants>(
    () => ({
      ids,
      plants: ids.map((id) => PLANTS[id]),
      loaded,
      has: (id) => ids.includes(id),
      toggle,
    }),
    [ids, loaded, toggle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMyPlants() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMyPlants must be used inside MyPlantsProvider');
  return v;
}
