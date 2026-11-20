import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import landData from "@/data/world-land.json";
import { GLOBE_RADIUS, latLngToVector3, makeEarthTexture, makeLandMaskTexture, makeDotTexture, markerColor } from "@/lib/globe";

export default function GlobeView({ markers = [], height = "100%", onSelect, className = "" }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const cbRef = useRef(onSelect);
  cbRef.current = onSelect;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sun = new THREE.DirectionalLight(0xffffff, 0.95);
    sun.position.set(-4, 2.5, 4);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x88bbff, 0.28);
    fill.position.set(3, -1.5, -3);
    scene.add(fill);

    const globe = new THREE.Group();
    globe.rotation.y = Math.PI; // start with India facing the viewer
    scene.add(globe);

    const earthTex = makeEarthTexture(landData.land);
    const reliefTex = makeLandMaskTexture(landData.land);
    const specularTex = makeLandMaskTexture(landData.land, { landFill: "#000000", oceanFill: "#ffffff" });
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS, 96, 64),
      new THREE.MeshPhongMaterial({
        map: earthTex,
        bumpMap: reliefTex,
        bumpScale: 0.02,
        specularMap: specularTex,
        specular: new THREE.Color("#5b86b0"),
        shininess: 22,
      })
    );
    globe.add(earth);

    // Atmosphere rim glow — makes the sphere read as a solid 3D ball.
    const glowMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color("#5aa9ff") } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor, 1.0) * max(intensity, 0.0);
        }`,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.16, 64, 48), glowMat);
    scene.add(glow);

    // Distant starfield for depth.
    const starGeo = new THREE.BufferGeometry();
    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(16 + Math.random() * 12);
      starPos[i * 3] = v.x;
      starPos[i * 3 + 1] = v.y;
      starPos[i * 3 + 2] = v.z;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff, transparent: true, opacity: 0.7, sizeAttenuation: true, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const dotTex = makeDotTexture();
    let points = null;

    const setMarkers = (list) => {
      if (points) {
        globe.remove(points);
        points.geometry.dispose();
        points.material.dispose();
        points = null;
      }
      const valid = (list || []).filter(
        (m) => m && m.lat != null && m.lng != null && !Number.isNaN(+m.lat) && !Number.isNaN(+m.lng)
      );
      if (!valid.length) return;
      const positions = new Float32Array(valid.length * 3);
      const colors = new Float32Array(valid.length * 3);
      const meta = [];
      const col = new THREE.Color();
      valid.forEach((m, i) => {
        const v = latLngToVector3(+m.lat, +m.lng, GLOBE_RADIUS * 1.005);
        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
        col.set(markerColor(m));
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
        meta.push(m);
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.03, map: dotTex, vertexColors: true, transparent: true,
        depthWrite: false, sizeAttenuation: true, alphaTest: 0.02,
      });
      points = new THREE.Points(geo, mat);
      points.userData.meta = meta;
      globe.add(points);
    };
    apiRef.current = { setMarkers };

    // ---- interaction ----
    const el = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let pauseUntil = performance.now() + 4000;

    const onPointerDown = (e) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      try { el.setPointerCapture(e.pointerId); } catch {}
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      globe.rotation.y += dx * 0.006;
      globe.rotation.x = Math.max(-1.15, Math.min(1.15, globe.rotation.x + dy * 0.006));
    };
    const onPointerUp = (e) => {
      if (dragging && moved < 6 && points) {
        const rect = el.getBoundingClientRect();
        ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(ndc, camera);
        raycaster.params.Points.threshold = 0.045;
        const ph = raycaster.intersectObject(points, false);
        const eh = raycaster.intersectObject(earth, false);
        if (ph.length && (!eh.length || ph[0].distance <= eh[0].distance + 0.03)) {
          const m = points.userData.meta[ph[0].index];
          if (m) cbRef.current?.(m);
        }
      }
      dragging = false;
      pauseUntil = performance.now() + 2500;
      el.style.cursor = "grab";
    };
    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(1.7, Math.min(6, camera.position.z + e.deltaY * 0.0012));
      pauseUntil = performance.now() + 2500;
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    // ---- sizing ----
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- render loop ----
    let raf = 0;
    let last = performance.now();
    const tick = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (!dragging && t > pauseUntil) globe.rotation.y += dt * 0.05;
      stars.rotation.y += dt * 0.008;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      earth.geometry.dispose();
      earth.material.dispose();
      earthTex.dispose();
      reliefTex.dispose();
      specularTex.dispose();
      glow.geometry.dispose();
      glowMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      dotTex.dispose();
      if (points) {
        points.geometry.dispose();
        points.material.dispose();
      }
      renderer.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setMarkers(markers);
  }, [markers]);

  const hasUser = markers.some((m) => m.type === "start");

  return (
    <div className={`relative bg-gradient-to-b from-slate-900 via-slate-950 to-black ${className}`} style={{ height, width: "100%" }}>
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute left-3 bottom-3 flex flex-col gap-1 rounded-xl border border-white/15 bg-white/10 backdrop-blur px-3 py-2 text-[11px] text-white pointer-events-none">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fb923c" }} /> India</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#38bdf8" }} /> World</span>
        {hasUser && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#34d399" }} /> You</span>}
      </div>
      <div className="absolute right-3 bottom-3 rounded-xl border border-white/15 bg-white/10 backdrop-blur px-3 py-1.5 text-[11px] text-white pointer-events-none">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}