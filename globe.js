import * as THREE from "three";

export const GLOBE_RADIUS = 1;

// Matches THREE.SphereGeometry's UV layout so markers align with the drawn land.
export function latLngToVector3(lat, lng, radius = GLOBE_RADIUS) {
  const phi = ((lng + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Draws an equirectangular Earth texture (ocean + land + graticule) on a canvas — no external tiles.
export function makeEarthTexture(land) {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0, "#0b3a63");
  ocean.addColorStop(0.5, "#1a6ea8");
  ocean.addColorStop(1, "#0b3a63");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  const px = (lng) => ((lng + 180) / 360) * W;
  const py = (lat) => ((90 - lat) / 180) * H;

  ctx.fillStyle = "#3dae6b";
  ctx.strokeStyle = "#28794c";
  ctx.lineWidth = 1.2;
  for (const ring of land) {
    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const x = px(ring[i][0]);
      const y = py(ring[i][1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  for (let lng = -180; lng <= 180; lng += 30) {
    ctx.beginPath();
    ctx.moveTo(px(lng), 0);
    ctx.lineTo(px(lng), H);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath();
    ctx.moveTo(0, py(lat));
    ctx.lineTo(W, py(lat));
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Black/white mask drawn from the same land outlines: used for relief (bump) and ocean shine (specular).
export function makeLandMaskTexture(land, { landFill = "#ffffff", oceanFill = "#000000" } = {}) {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = oceanFill;
  ctx.fillRect(0, 0, W, H);

  const px = (lng) => ((lng + 180) / 360) * W;
  const py = (lat) => ((90 - lat) / 180) * H;

  ctx.fillStyle = landFill;
  for (const ring of land) {
    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const x = px(ring[i][0]);
      const y = py(ring[i][1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Soft round dot used for each destination marker.
export function makeDotTexture() {
  const s = 64;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.95)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function markerColor(m) {
  if (m.type === "start") return "#34d399";
  const country = m.data?.country || "";
  if (country === "India" || (m.subtitle || "").includes("India")) return "#fb923c";
  return "#38bdf8";
}