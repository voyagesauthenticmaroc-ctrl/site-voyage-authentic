'use client';

import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { RouteStop } from '@/lib/morocco-places';

interface CircuitMapProps {
  stops: RouteStop[];
  title?: string;
}

/** Carte interactive du circuit — MapLibre GL + tuiles OSM (aucune clé requise).
    Chargement paresseux : n'importe MapLibre qu'une fois visible dans le viewport. */
export function CircuitMap({ stops, title }: CircuitMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [activeStop, setActiveStop] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        io.disconnect();
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || stops.length === 0) return;
    let cancelled = false;

    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      if (cancelled) return;

      const lngs = stops.map((s) => s.lng);
      const lats = stops.map((s) => s.lat);
      const bounds: [[number, number], [number, number]] = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];

      const map = new maplibregl.Map({
        container: containerRef.current!,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap',
            },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        },
        bounds,
        fitBoundsOptions: { padding: 60, maxZoom: 9 },
        attributionControl: false,
        scrollZoom: false, // évite le zoom parasite pendant qu'on scrolle la page
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true }));

      // Le zoom molette s'active quand la souris est sur la carte + Ctrl/Cmd,
      // et se désactive dès qu'on sort. Comportement type Google Maps embed.
      map.on('mouseenter', () => map.getContainer().classList.add('map-hover'));
      map.on('mouseleave', () => {
        map.getContainer().classList.remove('map-hover');
        map.scrollZoom.disable();
      });
      map.getContainer().addEventListener('wheel', (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          if (!map.scrollZoom.isEnabled()) map.scrollZoom.enable();
        } else {
          map.scrollZoom.disable();
        }
      });

      map.on('load', () => {
        if (stops.length > 1) {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: stops.map((s) => [s.lng, s.lat]) },
            },
          });
          map.addLayer({
            id: 'route-glow',
            type: 'line',
            source: 'route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#E8762C', 'line-width': 10, 'line-opacity': 0.18, 'line-blur': 4 },
          });
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#E8762C',
              'line-width': 3.5,
              'line-dasharray': [1.5, 1.5],
            },
          });
        }

        stops.forEach((stop, i) => {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;';
          const pin = document.createElement('div');
          pin.textContent = String(i + 1);
          pin.style.cssText = `width:32px;height:32px;border-radius:50%;background:#E8762C;color:#fff;font-family:var(--font-inter,system-ui);font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(232,118,44,0.5),0 0 0 3px #fff;transition:transform 0.2s ease;`;
          const label = document.createElement('div');
          label.textContent = stop.name;
          label.style.cssText = 'margin-top:4px;padding:2px 8px;background:#fff;border-radius:6px;font-family:var(--font-inter,system-ui);font-weight:600;font-size:11px;color:#181410;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);';
          wrap.appendChild(pin);
          wrap.appendChild(label);
          wrap.addEventListener('mouseenter', () => { pin.style.transform = 'scale(1.15)'; });
          wrap.addEventListener('mouseleave', () => { pin.style.transform = ''; });
          wrap.addEventListener('click', () => setActiveStop(i));

          new maplibregl.Marker({ element: wrap, anchor: 'bottom' })
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);
        });
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [ready, stops]);

  if (stops.length === 0) return null;

  return (
    <div className="rounded-3xl overflow-hidden shadow-xl" style={{ border: '1px solid var(--cream-deep)' }}>
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: 'var(--forest-deep)' }}>
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-light)' }}>Itinéraire</p>
          {title && <p className="font-display text-white text-sm mt-0.5">{title}</p>}
        </div>
        <div className="flex items-center gap-2 text-white/70 text-[0.7rem]">
          <span className="w-2 h-2 rounded-full" style={{ background: '#E8762C' }} />
          <span>{stops.length} étape{stops.length > 1 ? 's' : ''}</span>
        </div>
      </div>
      <div ref={containerRef} style={{ height: 'clamp(340px, 55vw, 520px)', background: '#EDE6D6' }} />
      {activeStop !== null && stops[activeStop] && (
        <div className="px-5 py-3 border-t text-sm" style={{ background: 'var(--parchment)', borderColor: 'var(--cream-deep)', color: 'var(--ink)' }}>
          <span className="font-display font-semibold">Étape {activeStop + 1} · {stops[activeStop].name}</span>
          {stops[activeStop].day && <span className="ml-2 text-xs" style={{ color: 'var(--warm-gray)' }}>Jour {stops[activeStop].day}</span>}
        </div>
      )}
    </div>
  );
}
