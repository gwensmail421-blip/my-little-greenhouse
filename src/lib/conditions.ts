import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import type { Season } from '@/data/plants';
import { seasonFor, type TimeOfDay } from '@/data/seasons';

// Used when the user doesn't share their location: Madison, Wisconsin.
const FALLBACK = { latitude: 43.0731, longitude: -89.4012, place: 'Madison, WI' };
const REFRESH_MS = 15 * 60 * 1000;
const TWILIGHT_S = 40 * 60;

export type Sky = 'clear' | 'cloudy' | 'rain' | 'snow';

export type Conditions = {
  place: string;
  usingFallback: boolean;
  tempF: number | null;
  lowF: number | null;
  highF: number | null;
  humidity: number | null;
  sky: Sky;
  sunrise: number | null;
  sunset: number | null;
  latitude: number;
  loaded: boolean;
  error: boolean;
};

const EMPTY: Conditions = {
  place: FALLBACK.place,
  usingFallback: true,
  tempF: null,
  lowF: null,
  highF: null,
  humidity: null,
  sky: 'clear',
  sunrise: null,
  sunset: null,
  latitude: FALLBACK.latitude,
  loaded: false,
  error: false,
};

// WMO weather codes, as used by Open-Meteo.
export function skyFromCode(code: number): Sky {
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return 'rain';
  if (code >= 2) return 'cloudy';
  return 'clear';
}

export function timeOfDay(nowS: number, sunrise: number | null, sunset: number | null): TimeOfDay {
  if (sunrise == null || sunset == null) {
    const h = new Date(nowS * 1000).getHours();
    if (h >= 7 && h < 18) return 'day';
    if (h === 6 || (h >= 18 && h < 20)) return 'dusk';
    return 'night';
  }
  if (Math.abs(nowS - sunrise) <= TWILIGHT_S || Math.abs(nowS - sunset) <= TWILIGHT_S) return 'dusk';
  if (nowS > sunrise && nowS < sunset) return 'day';
  return 'night';
}

async function locate(): Promise<{ latitude: number; longitude: number; place: string; fallback: boolean }> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('denied');
    const pos =
      (await Location.getLastKnownPositionAsync({ maxAge: 6 * 60 * 60 * 1000 })) ??
      (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }));
    const { latitude, longitude } = pos.coords;
    let place = '';
    try {
      const [addr] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addr?.city) place = addr.region ? `${addr.city}, ${addr.region}` : addr.city;
    } catch {
      // A place name is nice to have, not needed.
    }
    return { latitude, longitude, place, fallback: false };
  } catch {
    return { ...FALLBACK, fallback: true };
  }
}

async function fetchWeather(latitude: number, longitude: number) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${latitude.toFixed(3)}&longitude=${longitude.toFixed(3)}` +
    '&current=temperature_2m,relative_humidity_2m,weather_code' +
    '&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset' +
    '&temperature_unit=fahrenheit&timezone=auto&timeformat=unixtime&forecast_days=1';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const j = await res.json();
  return {
    tempF: Math.round(j.current.temperature_2m),
    humidity: Math.round(j.current.relative_humidity_2m),
    sky: skyFromCode(j.current.weather_code),
    highF: Math.round(j.daily.temperature_2m_max[0]),
    lowF: Math.round(j.daily.temperature_2m_min[0]),
    sunrise: j.daily.sunrise[0] as number,
    sunset: j.daily.sunset[0] as number,
  };
}

export function useConditions() {
  const [c, setC] = useState<Conditions>(EMPTY);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const loc = await locate();
      try {
        const wx = await fetchWeather(loc.latitude, loc.longitude);
        if (cancelled) return;
        setC({ ...wx, place: loc.place, usingFallback: loc.fallback, latitude: loc.latitude, loaded: true, error: false });
      } catch {
        if (cancelled) return;
        setC((prev) => ({ ...prev, place: loc.place, latitude: loc.latitude, loaded: true, error: true }));
      }
    };
    load();
    const wx = setInterval(load, REFRESH_MS);
    const clock = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(wx);
      clearInterval(clock);
    };
  }, []);

  const date = new Date(now);
  const season: Season = seasonFor(date, c.latitude);
  const time = timeOfDay(Math.floor(now / 1000), c.sunrise, c.sunset);
  return { ...c, date, season, time };
}
