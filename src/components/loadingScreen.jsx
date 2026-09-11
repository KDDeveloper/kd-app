import { createContext, useContext, useEffect, useState } from "react";
import kdLogo from "../resources/images/kd-webdev-logo.png";
import portrait from "../resources/images/kushal-cutout.webp";

/*
  Branded loading screen.

  It exists for one reason: the hero photograph is the largest thing on the
  site and it is requested only once react has rendered the <img>, so on a
  cold load the intro animation used to play over an empty blob and the figure
  popped in halfway through it. The screen holds the page until the picture,
  the logo and the webfonts are in, then hands over.

  Everything downstream reads `ready` from the context below rather than
  starting on mount, so no animation can run behind the overlay. `ready` is
  deliberately not "the assets arrived" - it is "the overlay has finished
  leaving", which is the moment the intro is actually allowed to begin.
*/

// Set to false to take the loading screen out of the way entirely. Downstream
// animations then start on mount, the way they did before it existed.
const LOADING_SCREEN = true;

const ASSETS = [kdLogo, portrait];

// A cached reload finishes in a few milliseconds, and an overlay that appears
// for two frames reads as a glitch rather than as a loading screen.
const MIN_VISIBLE = 650;
// Nothing here is worth a blank page. If an asset stalls past this the site
// opens anyway and the picture arrives whenever it arrives.
const MAX_WAIT = 6000;
// must match the opacity transition on .app-loader in App.scss
const FADE = 420;

// Default true, so anything rendered outside the provider behaves exactly as
// it did before - mount is go.
const ReadyContext = createContext(true);

export const useAppReady = () => useContext(ReadyContext);

const LoadingScreen = ({ children }) => {
    // assets are in (or we gave up waiting) - start leaving
    const [done, setDone] = useState(!LOADING_SCREEN);
    // mid fade: still painted, no longer catching taps
    const [hiding, setHiding] = useState(false);
    // gone, and the intro may play
    const [ready, setReady] = useState(!LOADING_SCREEN);

    const [loaded, setLoaded] = useState(0);
    const total = ASSETS.length + 1;   // the images, plus the webfonts as one

    useEffect(() => {
        if (!LOADING_SCREEN) return undefined;

        let alive = true;
        const tick = () => { if (alive) setLoaded((n) => n + 1); };

        const preload = (src) => new Promise((resolve) => {
            const img = new Image();
            const finish = () => { tick(); resolve(); };
            img.onload = () => {
                // decode up front so the cost is paid behind the overlay
                // instead of on the first frame after it clears
                const decoded = img.decode ? img.decode() : Promise.resolve();
                decoded.catch(() => {}).then(finish);
            };
            // a broken asset must not be able to hold the page shut
            img.onerror = finish;
            img.src = src;
        });

        // fonts.ready can settle before the browser has even requested a face
        // that nothing on screen has used yet, so ask for them by name first.
        const fonts = (() => {
            if (!document.fonts) return Promise.resolve();
            return Promise.all([
                document.fonts.load("1rem oswald"),
                document.fonts.load("1rem blackpine"),
            ]).catch(() => {}).then(() => document.fonts.ready);
        })().then(tick, tick);

        const everything = Promise.all([...ASSETS.map(preload), fonts]);
        const floor = new Promise((r) => setTimeout(r, MIN_VISIBLE));
        const ceiling = new Promise((r) => setTimeout(r, MAX_WAIT));

        Promise.race([Promise.all([everything, floor]), ceiling])
            .then(() => { if (alive) setDone(true); });

        return () => { alive = false; };
    }, []);

    // Leaving. Held back while the tab is in the background: the fade is a css
    // transition and the intro that follows is a gsap timeline, and both are
    // frozen off screen - dismissing early would spend the whole entrance on
    // a page nobody is looking at.
    useEffect(() => {
        if (!done || ready) return undefined;

        let alive = true;
        let timer;
        let onVisible;

        const leave = () => {
            setHiding(true);
            timer = setTimeout(() => { if (alive) setReady(true); }, FADE);
        };

        if (document.hidden) {
            onVisible = () => {
                if (!document.hidden) {
                    document.removeEventListener("visibilitychange", onVisible);
                    leave();
                }
            };
            document.addEventListener("visibilitychange", onVisible);
        } else {
            leave();
        }

        return () => {
            alive = false;
            clearTimeout(timer);
            if (onVisible) document.removeEventListener("visibilitychange", onVisible);
        };
    }, [done, ready]);

    const progress = done ? 1 : loaded / total;

    return (
        <ReadyContext.Provider value={ready}>
            {!ready && (
                <div className={hiding ? "app-loader app-loader-out" : "app-loader"} role="status">
                    <div className="app-loader-inner">
                        <img src={kdLogo} alt="Kushal Davda, web developer" />
                        <div className="app-loader-track">
                            <div className="app-loader-bar"
                                style={{ transform: "scaleX(" + progress + ")" }} />
                        </div>
                    </div>
                </div>
            )}
            {children}
        </ReadyContext.Provider>
    );
};

export default LoadingScreen;
