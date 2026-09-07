"use client";

import { useEffect, useRef } from "react";

/**
 * Ground spice drifting through the hero — turmeric, chili, cardamom.
 *
 * Canvas rather than a pile of animated DOM nodes: it stays cheap at a few
 * hundred motes, and it can be switched off wholesale for reduced motion or
 * when the tab is in the background.
 */

const PALETTE = ["#F6C445", "#F5A314", "#C7332B", "#E4557A", "#2F9E7A"];

type Mote = {
  x: number;
  y: number;
  radius: number;
  drift: number;
  rise: number;
  alpha: number;
  color: string;
  wobble: number;
  phase: number;
};

export function SpiceCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let frame = 0;
    let running = true;

    const seed = (): Mote => ({
      x: Math.random() * width,
      y: height + Math.random() * height * 0.4,
      radius: 0.8 + Math.random() * 2.4,
      drift: (Math.random() - 0.5) * 0.22,
      rise: 0.16 + Math.random() * 0.5,
      alpha: 0.25 + Math.random() * 0.5,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      wobble: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale the count to the area so a phone is not doing a desktop's work.
      const count = Math.round(Math.min(160, Math.max(40, (width * height) / 9000)));
      motes = Array.from({ length: count }, () => {
        const mote = seed();
        mote.y = Math.random() * height;
        return mote;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const mote of motes) {
        mote.y -= mote.rise;
        mote.phase += 0.012;
        mote.x += mote.drift + Math.sin(mote.phase) * mote.wobble * 0.12;

        if (mote.y < -12) Object.assign(mote, seed());
        if (mote.x < -12) mote.x = width + 12;
        if (mote.x > width + 12) mote.x = -12;

        // Fade out toward the top so nothing pops off the edge.
        const fade = Math.min(1, mote.y / (height * 0.35));
        ctx.globalAlpha = mote.alpha * fade;
        ctx.fillStyle = mote.color;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running) frame = window.requestAnimationFrame(draw);
    };

    resize();

    if (reduceMotion) {
      // One still frame: the texture is there, the movement is not.
      ctx.clearRect(0, 0, width, height);
      for (const mote of motes) {
        ctx.globalAlpha = mote.alpha * 0.6;
        ctx.fillStyle = mote.color;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return;
    }

    frame = window.requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = window.requestAnimationFrame(draw);
      }
    };

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
