import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { SCHOOLS, type School } from '@/data/mockData';
import { Layers, Maximize2, Plus, Minus } from 'lucide-react';

const COLOR: Record<School['level'], string> = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  stable: '#10b981',
};
const SIZE: Record<School['level'], number> = { critical: 16, high: 13, moderate: 11, stable: 9 };

function makeIcon(level: School['level'], selected: boolean) {
  const c = COLOR[level];
  const s = SIZE[level];
  const ring = selected ? `box-shadow:0 0 0 3px rgba(59,130,246,0.85), 0 0 12px ${c};` : `box-shadow:0 0 0 2px rgba(10,15,28,0.9), 0 0 8px ${c}99;`;
  const pulse = level === 'critical' ? 'animation:diPulse 2s ease-out infinite;' : '';
  return L.divIcon({
    className: 'eduallocpro-marker',
    html: `<span style="display:block;width:${s}px;height:${s}px;border-radius:9999px;background:${c};${ring}${pulse}"></span>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  });
}

// Approximate Nandurbar district outline (lat,lng polygon)
const NANDURBAR_OUTLINE: [number, number][] = [
  [21.92, 73.92], [21.98, 74.18], [21.95, 74.45], [21.85, 74.68], [21.70, 74.82],
  [21.50, 74.88], [21.28, 74.78], [21.10, 74.55], [21.00, 74.25], [21.05, 73.95],
  [21.20, 73.78], [21.45, 73.72], [21.70, 73.78], [21.85, 73.85],
];

export function SchoolMap({ onSelect, selectedId }: { onSelect: (s: School) => void; selectedId?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [tile, setTile] = useState<'dark' | 'osm'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [21.45, 74.30],
      zoom: 9,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    });
    mapRef.current = map;

    tileLayerRef.current = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd' }
    ).addTo(map);

    // District outline
    L.polygon(NANDURBAR_OUTLINE, {
      color: 'hsl(217, 91%, 60%)', weight: 1.5, opacity: 0.7, fillColor: 'hsl(217, 91%, 60%)',
      fillOpacity: 0.04, dashArray: '6 4',
    }).addTo(map);

    // Cluster group with custom dark cluster icon
    const cluster = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 45,
      iconCreateFunction: (c: any) => {
        const n = c.getChildCount();
        const size = n < 10 ? 32 : n < 50 ? 38 : 46;
        return L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;display:grid;place-items:center;background:rgba(15,23,42,0.85);color:#e2e8f0;font:600 12px ui-sans-serif,system-ui;border:1.5px solid hsl(217,91%,60%);box-shadow:0 0 14px rgba(59,130,246,0.4);">${n}</div>`,
          className: 'eduallocpro-cluster',
          iconSize: [size, size],
        });
      },
    });
    clusterRef.current = cluster;

    SCHOOLS.forEach((s) => {
      const m = L.marker([s.lat, s.lng], { icon: makeIcon(s.level, false) });
      m.bindTooltip(
        `<div style="font:600 11px ui-sans-serif,system-ui;color:#e2e8f0;">${s.name}</div>
         <div style="font:500 10px ui-monospace;color:#94a3b8;">DI ${s.di} · ${s.totalVacancies} vacancies</div>`,
        { direction: 'top', offset: [0, -6], className: 'eduallocpro-tip' }
      );
      m.on('click', () => onSelect(s));
      markersRef.current.set(s.id, m);
      cluster.addLayer(m);
    });
    map.addLayer(cluster);

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selected marker styling
  useEffect(() => {
    markersRef.current.forEach((m, id) => {
      const school = SCHOOLS.find((s) => s.id === id);
      if (!school) return;
      m.setIcon(makeIcon(school.level, id === selectedId));
    });
    if (selectedId) {
      const sch = SCHOOLS.find((s) => s.id === selectedId);
      if (sch && mapRef.current) {
        mapRef.current.flyTo([sch.lat, sch.lng], Math.max(mapRef.current.getZoom(), 11), { duration: 0.6 });
      }
    }
  }, [selectedId]);

  // Tile switching
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);
    const url = tile === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileLayerRef.current = L.tileLayer(url, {
      maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: tile === 'dark' ? 'abcd' : 'abc',
    }).addTo(mapRef.current);
  }, [tile]);

  const zoomBy = (delta: number) => mapRef.current?.setZoom((mapRef.current?.getZoom() || 9) + delta);
  const fitBounds = () => mapRef.current?.fitBounds(L.latLngBounds(NANDURBAR_OUTLINE), { padding: [20, 20] });

  return (
    <div className="relative h-full min-h-[460px] rounded-lg overflow-hidden border border-border bg-surface">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top-left badge */}
      <div className="absolute top-3 left-3 z-[500] glass-panel rounded-md px-3 py-2 text-xs flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-success animate-pulse" />
        <span className="font-mono uppercase tracking-wider text-muted-foreground">Nandurbar</span>
        <span className="text-foreground font-semibold">847 schools</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-3 z-[500] glass-panel rounded-md p-3 text-xs space-y-1.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Deprivation Index</div>
        {[
          { c: COLOR.critical, l: 'Critical · 80–100', n: 180 },
          { c: COLOR.high, l: 'High · 60–79', n: 310 },
          { c: COLOR.moderate, l: 'Moderate · 40–59', n: 250 },
          { c: COLOR.stable, l: 'Stable · 0–39', n: 107 },
        ].map((row) => (
          <div key={row.l} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: row.c }} />
            <span className="text-foreground">{row.l}</span>
            <span className="ml-auto font-mono text-muted-foreground">{row.n}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-3 right-3 z-[500] flex flex-col gap-1">
        <button onClick={() => zoomBy(1)} className="size-8 grid place-items-center glass-panel rounded-md hover:border-primary/50 transition"><Plus className="size-4" /></button>
        <button onClick={() => zoomBy(-1)} className="size-8 grid place-items-center glass-panel rounded-md hover:border-primary/50 transition"><Minus className="size-4" /></button>
        <button onClick={() => setTile((t) => (t === 'dark' ? 'osm' : 'dark'))} title="Toggle basemap" className="size-8 grid place-items-center glass-panel rounded-md hover:border-primary/50 transition"><Layers className="size-4" /></button>
        <button onClick={fitBounds} title="Fit district" className="size-8 grid place-items-center glass-panel rounded-md hover:border-primary/50 transition"><Maximize2 className="size-4" /></button>
      </div>
    </div>
  );
}
