// Title letter cards (.container-titleLetter): flip to the image on hover,
// flip back to the letter when the cursor leaves.
// If the cursor leaves mid-flip, the card doesn't stop dead: it keeps
// turning briefly in the same direction, slows down, then flips back.
// Timing and easing come from the CSS variables in Styles/styleLetterFlip.css.

const FLIPPED = -180; // degrees; negative: bottom edge comes up first
const COAST_EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'; // ease-out (cubic)
const COAST_START_SLOPE = 3; // initial speed of that ease-out, relative to linear

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// "1.9s" or "300ms" -> milliseconds
function cssTime(name, fallback) {
    const value = cssVar(name);
    if (!value) return fallback;
    return value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000;
}

function setupCard(container) {
    const card = container.querySelector('.flip-card');
    if (!card) return;

    let animation = null;
    let holdTimer = null;
    let touchFlipped = false;

    // Current rotation in degrees (0 = letter, -180 = image), including
    // any running animation.
    function angle() {
        const transform = getComputedStyle(card).transform;
        if (transform === 'none') return 0;
        const m = new DOMMatrix(transform);
        let a = (Math.atan2(m.m23, m.m22) * 180) / Math.PI;
        if (a > 0.5) a -= 360; // rotateX(-180deg) can read as +180
        return a;
    }

    // Current speed in degrees per millisecond, by sampling the running
    // animation 16ms (one frame) earlier.
    function speed() {
        if (!animation || animation.playState !== 'running') return 0;
        const t = animation.currentTime;
        if (t < 16) return 0;
        const now = angle();
        animation.currentTime = t - 16;
        const before = angle();
        animation.currentTime = t;
        return (now - before) / 16;
    }

    // Freeze the card where it is and cancel anything pending.
    function stop() {
        clearTimeout(holdTimer);
        const current = angle();
        animation?.cancel();
        animation = null;
        card.style.transform = `rotateX(${current}deg)`;
        return current;
    }

    function animateTo(target, duration, easing, onDone) {
        const from = stop();
        if (reducedMotion.matches || duration <= 0 || Math.abs(target - from) < 0.5) {
            card.style.transform = `rotateX(${target}deg)`;
            onDone?.();
            return;
        }
        const current = card.animate(
            [{ transform: `rotateX(${from}deg)` }, { transform: `rotateX(${target}deg)` }],
            { duration, easing, fill: 'forwards' },
        );
        animation = current;
        current.onfinish = () => {
            if (animation !== current) return; // replaced in the meantime
            card.style.transform = `rotateX(${target}deg)`;
            current.cancel();
            animation = null;
            onDone?.();
        };
    }

    function flipToImage() {
        // From a partly turned card, only the remaining part is animated.
        const remaining = Math.abs(FLIPPED - angle()) / 180;
        animateTo(FLIPPED, cssTime('--letter-flip-duration', 1900) * remaining, cssVar('--letter-flip-easing'));
    }

    function flipBack() {
        const holdThenFlipBack = () => {
            holdTimer = setTimeout(() => {
                const remaining = Math.abs(angle()) / 180;
                animateTo(0, cssTime('--letter-flip-back-duration', 2800) * remaining, cssVar('--letter-flip-easing'));
            }, cssTime('--letter-flip-back-delay', 600));
        };

        // Coast: keep the current speed and ease out to a stop. With an
        // ease-out curve that starts COAST_START_SLOPE times faster than
        // linear, distance = speed * duration / COAST_START_SLOPE.
        const coastDuration = cssTime('--letter-flip-coast-duration', 500);
        const from = angle();
        const coastTarget = Math.min(0, Math.max(FLIPPED,
            from + (speed() * coastDuration) / COAST_START_SLOPE));

        if (Math.abs(coastTarget - from) > 1) {
            animateTo(coastTarget, coastDuration, COAST_EASING, holdThenFlipBack);
        } else {
            stop();
            holdThenFlipBack();
        }
    }

    container.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'touch') flipToImage();
    });
    container.addEventListener('pointerleave', (event) => {
        if (event.pointerType !== 'touch') flipBack();
    });
    // Touch screens have no hover: a tap toggles the card.
    container.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch') return;
        touchFlipped = !touchFlipped;
        if (touchFlipped) flipToImage();
        else flipBack();
    });
}

document.querySelectorAll('.container-titleLetter').forEach(setupCard);
