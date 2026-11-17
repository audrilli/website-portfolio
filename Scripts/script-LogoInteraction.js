// Logo interaction: the petal under the cursor turns pink and fans out.
// Works on every .Logo on the page (header and footer).
// Styling of the effect: Styles/styleLogoInteraction.css

const FAN_DISTANCE = 3; // px each petal moves outward
const ACTIVE_CLASS = 'is-active';

function setupLogo(logo) {
    const petals = [...logo.querySelectorAll('.Radial-Repeat')];
    const ring = logo.querySelector('.Group-center');
    if (!petals.length) return;

    // Geometry relative to the logo center, measured when needed
    // (the logo can move with layout changes).
    function measure() {
        const box = logo.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        const ringBox = ring?.getBoundingClientRect();
        const innerRadius = ringBox ? ringBox.width / 2 : 0;

        const angles = petals.map((petal) => {
            const r = petal.getBoundingClientRect();
            const dx = r.left + r.width / 2 - cx;
            const dy = r.top + r.height / 2 - cy;
            const angle = Math.atan2(dy, dx);
            // Outward direction for the fan-out, used by the CSS transform
            petal.style.setProperty('--dx', `${(Math.cos(angle) * FAN_DISTANCE).toFixed(2)}px`);
            petal.style.setProperty('--dy', `${(Math.sin(angle) * FAN_DISTANCE).toFixed(2)}px`);
            return angle;
        });
        return { cx, cy, innerRadius, angles };
    }

    let geometry = null;
    let active = null;

    function setActive(petal) {
        if (petal === active) return;
        active?.classList.remove(ACTIVE_CLASS);
        petal?.classList.add(ACTIVE_CLASS);
        active = petal;
    }

    // Petal boxes overlap, so pick the petal by the cursor's angle
    // around the logo center. The center ring itself picks nothing.
    logo.addEventListener('pointerenter', () => {
        geometry = measure();
    });

    logo.addEventListener('pointermove', (event) => {
        geometry ??= measure();
        const dx = event.clientX - geometry.cx;
        const dy = event.clientY - geometry.cy;
        if (Math.hypot(dx, dy) < geometry.innerRadius) {
            setActive(null);
            return;
        }
        const angle = Math.atan2(dy, dx);
        let best = 0;
        let bestDiff = Infinity;
        geometry.angles.forEach((petalAngle, i) => {
            const diff = Math.abs(Math.atan2(Math.sin(angle - petalAngle), Math.cos(angle - petalAngle)));
            if (diff < bestDiff) {
                bestDiff = diff;
                best = i;
            }
        });
        setActive(petals[best]);
    });

    logo.addEventListener('pointerleave', () => {
        setActive(null);
        geometry = null;
    });
}

document.querySelectorAll('.Logo').forEach(setupLogo);
