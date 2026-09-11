import { useEffect, useRef } from "react";

/*
  Liquid blob.

  The outline is a ring of points that can only move radially, but they are not
  springs pulled home to a rest position -- that reads as rubber. Two things
  restore the shape instead, both of them how an actual body of liquid behaves:

    surface tension   a bump flattens by flowing sideways into its neighbours,
                      driven by local curvature rather than by any memory of
                      where the point used to be

    incompressibility the blob holds its volume, so pushing a dent into one
                      side makes the rest of it swell to take up the slack

  Together those relax the shape back to a circle on their own. Nothing here
  pulls a point towards a remembered position except a very weak shape memory
  that keeps the resting silhouette organic rather than perfectly round.
*/

const POINTS = 64;
const CENTER = 120;            // viewBox is 0 0 240 240
const RADIUS = 88;

const SURFACE_TENSION = 0.09;  // curvature smoothing, also sets the wave speed
const SHAPE_MEMORY = 0.002;    // very weak pull back to the resting silhouette
const DAMPING = 0.985;
const VISCOSITY = 0.45;        // how strongly neighbours drag each other along
const VOLUME = 0.35;           // how hard the blob fights being compressed
const CURSOR_REACH = 84;       // svg units
const CURSOR_FORCE = 1;
const IMPULSE = 9;             // entry / exit ripple strength
const MAX_SPEED = 31;          // cursor speed clamp, svg units per move

// Fences, so a hard shove cannot turn the outline inside out.
const MIN_RADIUS = RADIUS * 0.42;
const MAX_RADIUS = RADIUS * 1.32;   // stays inside the viewBox, which clips
const MAX_VEL = 8;

const TAU = Math.PI * 2;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

const buildPath = (points) => {
    const n = points.length;
    let d = "M " + points[0].x.toFixed(2) + " " + points[0].y.toFixed(2);

    // Catmull-Rom through every point, expressed as cubic beziers so the
    // closed outline stays smooth across the seam.
    for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n];
        const p1 = points[i];
        const p2 = points[(i + 1) % n];
        const p3 = points[(i + 2) % n];

        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;

        d += " C " + c1x.toFixed(2) + " " + c1y.toFixed(2)
            + " " + c2x.toFixed(2) + " " + c2y.toFixed(2)
            + " " + p2.x.toFixed(2) + " " + p2.y.toFixed(2);
    }

    return d + " Z";
};

const InteractiveBlob = ({ color = "#1B86BC" }) => {
    const svgRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;
        const path = pathRef.current;
        if (!svg || !path) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const radii = new Float32Array(POINTS).fill(RADIUS);
        const vel = new Float32Array(POINTS);
        const rest = new Float32Array(POINTS);
        const smoothVel = new Float32Array(POINTS);
        const angles = new Float32Array(POINTS);
        for (let i = 0; i < POINTS; i++) angles[i] = (i / POINTS) * TAU;

        const cursor = { x: 0, y: 0, speed: 0, active: false, inside: false };
        const svgPoint = svg.createSVGPoint();
        let frame = 0;
        let time = 0;

        // Resting silhouette: a couple of slow harmonics so it still looks
        // hand-drawn rather than machine-round when nothing is touching it.
        const restRadius = (i, t) => {
            const a = angles[i];
            return RADIUS * (1 + 0.075 * Math.sin(3 * a + t * 0.6) + 0.05 * Math.sin(5 * a - t * 0.45));
        };

        const radiusAtAngle = (angle) => {
            const idx = ((angle / TAU) * POINTS + POINTS) % POINTS;
            const i0 = Math.floor(idx);
            const i1 = (i0 + 1) % POINTS;
            const f = idx - i0;
            return radii[i0] * (1 - f) + radii[i1] * f;
        };

        const splash = (angle, amount) => {
            const center = ((angle / TAU) * POINTS + POINTS) % POINTS;
            // A wide, soft bell rather than a tight ping - a narrow impulse
            // reads as a pluck, this reads as a swell.
            for (let o = -9; o <= 9; o++) {
                const i = (Math.round(center) + o + POINTS) % POINTS;
                vel[i] += amount * Math.exp(-(o * o) / 28);
            }
        };

        const toLocal = (clientX, clientY) => {
            const ctm = svg.getScreenCTM();
            if (!ctm) return null;
            svgPoint.x = clientX;
            svgPoint.y = clientY;
            return svgPoint.matrixTransform(ctm.inverse());
        };

        const onPointerMove = (e) => {
            const p = toLocal(e.clientX, e.clientY);
            if (!p) return;

            if (cursor.active) {
                const dx = p.x - cursor.x;
                const dy = p.y - cursor.y;
                cursor.speed = Math.min(Math.hypot(dx, dy), MAX_SPEED);
            }
            cursor.x = p.x;
            cursor.y = p.y;
            cursor.active = true;

            // Edge crossing -> ripple from the exact point of entry / exit.
            const dx = p.x - CENTER;
            const dy = p.y - CENTER;
            const dist = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);
            const inside = dist < radiusAtAngle(angle);

            if (inside !== cursor.inside) {
                const kick = IMPULSE * (0.35 + cursor.speed / MAX_SPEED);
                splash(angle, inside ? -kick : kick);
                cursor.inside = inside;
            }
        };

        // A touch pointer stops existing the moment the finger lifts, so without
        // this the cursor stays "active" at the last touch point and the physics
        // keeps shoving the rim there indefinitely - the blob sticks where it
        // was touched. A mouse never hits this, because the cursor really does
        // stay where it was left.
        const releaseCursor = (e) => {
            if(e && e.pointerType === "mouse") return;

            // lifting off from inside earns the same parting ripple a cursor
            // gets on its way out
            if(cursor.inside){
                const dx = cursor.x - CENTER;
                const dy = cursor.y - CENTER;
                splash(Math.atan2(dy, dx), IMPULSE * 0.7);
            }

            cursor.active = false;
            cursor.speed = 0;
            cursor.inside = false;
        };

        const onPointerLeave = () => {
            cursor.active = false;
            cursor.speed = 0;
            cursor.inside = false;
        };

        const step = () => {
            time += 0.016;

            const speedFactor = 0.3 + (cursor.speed / MAX_SPEED) * 1.7;

            let restVolume = 0;
            for (let i = 0; i < POINTS; i++) {
                rest[i] = restRadius(i, time);
                restVolume += rest[i] * rest[i];
            }

            for (let i = 0; i < POINTS; i++) {
                const l = (i - 1 + POINTS) % POINTS;
                const r = (i + 1) % POINTS;

                // Surface tension. Curvature, not position: a point only feels
                // a force when it is out of line with its neighbours, so bumps
                // level out by flowing sideways instead of springing back.
                vel[i] += (radii[l] + radii[r] - 2 * radii[i]) * SURFACE_TENSION;

                // Faint memory of the resting silhouette. Deliberately tiny --
                // turn this up and the rubber band comes back.
                vel[i] += (rest[i] - radii[i]) * SHAPE_MEMORY;

                if (cursor.active) {
                    const px = CENTER + Math.cos(angles[i]) * radii[i];
                    const py = CENTER + Math.sin(angles[i]) * radii[i];
                    const dx = px - cursor.x;
                    const dy = py - cursor.y;
                    const d = Math.hypot(dx, dy);

                    if (d < CURSOR_REACH && d > 0.001) {
                        // Push the point away from the cursor, keeping only the
                        // radial part. Cursor outside -> dent inwards, cursor
                        // inside -> bulge outwards, for free. Smoothstep so the
                        // influence has no hard edge.
                        const t = 1 - d / CURSOR_REACH;
                        const falloff = t * t * (3 - 2 * t);
                        const radial = (dx / d) * Math.cos(angles[i]) + (dy / d) * Math.sin(angles[i]);
                        vel[i] += radial * falloff * CURSOR_FORCE * speedFactor;
                    }
                }

                vel[i] = clamp(vel[i] * DAMPING, -MAX_VEL, MAX_VEL);
            }

            // Viscosity: each point is dragged towards the average motion of its
            // neighbourhood, so the surface moves in sheets like liquid rather
            // than every point chattering on its own.
            for (let i = 0; i < POINTS; i++) {
                const l2 = (i - 2 + POINTS) % POINTS;
                const l1 = (i - 1 + POINTS) % POINTS;
                const r1 = (i + 1) % POINTS;
                const r2 = (i + 2) % POINTS;
                smoothVel[i] = (vel[l2] + 2 * vel[l1] + 3 * vel[i] + 2 * vel[r1] + vel[r2]) / 9;
            }
            for (let i = 0; i < POINTS; i++) {
                vel[i] += (smoothVel[i] - vel[i]) * VISCOSITY;
                radii[i] = clamp(radii[i] + vel[i], MIN_RADIUS, MAX_RADIUS);
            }

            // Incompressibility. Area of this shape goes with the sum of the
            // squared radii, so if the blob has lost volume every point is
            // eased outwards to put it back -- which is what turns a dent on
            // one side into a swell everywhere else.
            let volume = 0;
            for (let i = 0; i < POINTS; i++) volume += radii[i] * radii[i];
            if (volume > 0) {
                const correction = (Math.sqrt(restVolume / volume) - 1) * VOLUME;
                for (let i = 0; i < POINTS; i++) {
                    radii[i] = clamp(radii[i] * (1 + correction), MIN_RADIUS, MAX_RADIUS);
                }
            }

            cursor.speed *= 0.86;

            const pts = new Array(POINTS);
            for (let i = 0; i < POINTS; i++) {
                pts[i] = {
                    x: CENTER + Math.cos(angles[i]) * radii[i],
                    y: CENTER + Math.sin(angles[i]) * radii[i],
                };
            }
            path.setAttribute("d", buildPath(pts));

            frame = requestAnimationFrame(step);
        };

        // Reduced motion: draw the rest shape once, skip the loop and listeners.
        if (reduceMotion) {
            const pts = new Array(POINTS);
            for (let i = 0; i < POINTS; i++) {
                pts[i] = {
                    x: CENTER + Math.cos(angles[i]) * restRadius(i, 0),
                    y: CENTER + Math.sin(angles[i]) * restRadius(i, 0),
                };
            }
            path.setAttribute("d", buildPath(pts));
            return undefined;
        }

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerdown", onPointerMove, { passive: true });
        // pointerup and pointercancel are what release a touch or pen. This is
        // deliberately not gated on screen size - a touchscreen laptop hits the
        // same problem on a wide window, so the decision is made per event from
        // pointerType rather than from a breakpoint.
        window.addEventListener("pointerup", releaseCursor, { passive: true });
        window.addEventListener("pointercancel", releaseCursor, { passive: true });
        window.addEventListener("pointerleave", onPointerLeave);
        frame = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerdown", onPointerMove);
            window.removeEventListener("pointerup", releaseCursor);
            window.removeEventListener("pointercancel", releaseCursor);
            window.removeEventListener("pointerleave", onPointerLeave);
        };
    }, []);

    return (
        <svg ref={svgRef} className="interactive-blob" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
            <path ref={pathRef} fill={color} d="" />
        </svg>
    );
};

export default InteractiveBlob;
