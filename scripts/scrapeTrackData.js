#!/usr/bin/env node
/**
 * scrapeTrackData.js
 *
 * Fetches road / path geometry from the OpenStreetMap Overpass API for the
 * three TrolleyDash tracks and writes pre-processed waypoint JSON files to
 * data/tracks/.
 *
 * Usage:
 *   npm run scrape
 *
 * The generated JSON files are consumed by the game at build time via
 * src/tracks/*.js (which embed the curated waypoints).  Run this script
 * whenever you want to refresh the raw OSM geometry.
 *
 * Overpass API endpoint: https://overpass-api.de/api/interpreter
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = join(__dirname, '..', 'data', 'tracks');

mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Track definitions: each entry maps to one Overpass query
// ---------------------------------------------------------------------------
const TRACKS = [
  {
    id:   'east_coast_park',
    name: 'East Coast Park',
    // Bounding box: south, west, north, east
    bbox: '1.2970,103.8960,1.3020,103.9480',
    // We want the service road and main cycling/pedestrian paths
    query: `
      [out:json][timeout:30];
      (
        way["highway"~"service|cycleway|footway|path|residential"]
           (1.2970,103.8960,1.3020,103.9480);
      );
      (._;>;);
      out body;
    `,
  },
  {
    id:   'bishan_park',
    name: 'Bishan-Ang Mo Kio Park',
    bbox: '1.3570,103.8310,1.3720,103.8500',
    query: `
      [out:json][timeout:30];
      (
        way["highway"~"footway|path|cycleway|pedestrian"]
           (1.3570,103.8310,1.3720,103.8500);
        way["leisure"="track"]
           (1.3570,103.8310,1.3720,103.8500);
      );
      (._;>;);
      out body;
    `,
  },
  {
    id:   'sentosa',
    name: 'Sentosa Circuit',
    bbox: '1.2460,103.8130,1.2600,103.8420',
    query: `
      [out:json][timeout:30];
      (
        way["highway"~"primary|secondary|tertiary|residential|service|unclassified"]
           (1.2460,103.8130,1.2600,103.8420);
      );
      (._;>;);
      out body;
    `,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

async function fetchOverpass(query) {
  const { default: fetch } = await import('node-fetch');
  const body = `data=${encodeURIComponent(query)}`;
  const res  = await fetch(OVERPASS_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
  return res.json();
}

/**
 * Convert raw OSM JSON to an ordered array of [lat, lng] pairs.
 * Nodes are collected from all ways and de-duped; simple ordering is used.
 */
function extractWaypoints(osmData) {
  const nodeMap = {};
  osmData.elements.forEach(el => {
    if (el.type === 'node') nodeMap[el.id] = [el.lat, el.lon];
  });

  const coords = [];
  const seen   = new Set();

  osmData.elements.forEach(el => {
    if (el.type !== 'way') return;
    (el.nodes || []).forEach(nid => {
      if (!seen.has(nid) && nodeMap[nid]) {
        seen.add(nid);
        coords.push(nodeMap[nid]);
      }
    });
  });

  return coords;
}

/**
 * Normalise lat/lng coordinates to 0–2000 design-canvas units.
 */
function normalise(coords, designSize = 2000) {
  if (coords.length === 0) return [];

  const lats = coords.map(c => c[0]);
  const lngs = coords.map(c => c[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const range  = Math.max(maxLat - minLat, maxLng - minLng) || 1;

  return coords.map(([lat, lng]) => [
    Math.round(((lng - minLng) / range) * designSize),
    // Flip Y axis: north is up in canvas coordinates
    Math.round(((maxLat - lat) / range) * designSize),
  ]);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  for (const track of TRACKS) {
    console.log(`\nFetching OSM data for: ${track.name}…`);
    try {
      const osmData  = await fetchOverpass(track.query);
      const latLngs  = extractWaypoints(osmData);
      const waypoints = normalise(latLngs);

      const output = {
        id:         track.id,
        name:       track.name,
        bbox:       track.bbox,
        fetchedAt:  new Date().toISOString(),
        nodeCount:  latLngs.length,
        waypoints,
      };

      const outPath = join(OUT_DIR, `${track.id}.json`);
      writeFileSync(outPath, JSON.stringify(output, null, 2));
      console.log(`  ✓ Saved ${waypoints.length} waypoints → ${outPath}`);
    } catch (err) {
      console.error(`  ✗ Failed for ${track.name}: ${err.message}`);
    }
  }
}

main();
