/* scroll */
const navEl = document.querySelector('nav');
const anchors = document.querySelectorAll('nav a:not([target=_blank])');
const anchoredElements = [...anchors].map(anchor => {
    const href = anchor.getAttribute('href');
    return document.querySelector(`${href}`);
});
const elementToNavAnchor = new Map(anchoredElements.map((element, index) => [element, anchors[index]]));
let oldScroll = window.scrollY;
let scrollDirectionDown = true;

function checkVisible(elm, threshold, mode) {
    threshold = threshold || 0;
    mode = mode || 'visible';
    const rect = elm.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    const above = rect.bottom - threshold < 0;
    const below = rect.top - viewHeight + threshold >= 0;
    return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}

function updateNavSelection(scrollingDown) {
    const direction = scrollingDown ? -1 : 1;
    const from = scrollingDown ? anchors.length : -1;
    const to = scrollingDown ? 0 : anchors.length - 1;
    let current = from;
    let activeSet = false;

    do  {
        current += direction;
        const anchoredElement = anchoredElements[current];
        if (!anchoredElement) {
            continue;
        }
        const visible = checkVisible(anchoredElement, 150);
        elementToNavAnchor.get(anchoredElement).classList.toggle('active', !activeSet && visible);
        activeSet = activeSet || visible;
    } while (current != to);
}
window.addEventListener('scroll', () => {
    scrollDirectionDown = oldScroll < window.scrollY;
    oldScroll = window.scrollY;
    updateNavSelection(scrollDirectionDown);
});


/* navigation */
const navButton = document.querySelector('.menu-toggle');
navButton.addEventListener('click', (event) => {
    navButton.classList.toggle('open');
    navEl.classList.toggle('open');
});
navEl?.addEventListener('click', (event) => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
        return;
    }
    if (event.target instanceof HTMLAnchorElement) {
        navButton.classList.remove('open');
        navEl.classList.remove('open');
    }
});

/* accordion */

const getActualHeight = (element) => {
    const style = window.getComputedStyle(element);
    const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    return Math.ceil(element.offsetHeight + margin);
}

document.querySelectorAll('[data-role=expandable]').forEach(expandable => {
    const title = expandable.querySelector('[data-role=title]');
    const content = expandable.querySelector('[data-role=content]');
    const contentWrapper = document.createElement('div');
    contentWrapper.style.overflow = 'hidden';
    contentWrapper.style.transition = 'all 0.3s ease-in-out';
    contentWrapper.style.height = '0';
    title.after(contentWrapper);
    contentWrapper.append(content);

    title?.addEventListener('click', (event) => {
        const toOpen = !expandable.classList.contains('expanded');
        if (toOpen) {
            const contentHeight = content.offsetHeight;
            contentWrapper.style.height = contentHeight + 'px';
        } else {
            contentWrapper.style.height = '0';
        }
        expandable.classList.toggle('expanded');
    });
});


/* read more */
document.querySelectorAll('[data-role=read_more]').forEach(expandable => {
    const buttonContainer = expandable.querySelector('[data-role=expand]');
    const parent = expandable.closest('.article-section');
    buttonContainer?.addEventListener('click', event => {
        const currentState = expandable.dataset.expandState;
        if (currentState === 'open') {
            parent.scrollIntoView(true);
        }
        event.stopPropagation();
        event.preventDefault();
        expandable.dataset.expandState = currentState === 'closed' ? 'open' : 'closed';
    });
});

/* dialog */
const dialog = document.querySelector('dialog.reference_dialog');
document.querySelector('[data-role=open_dialog]').addEventListener('click', event => {
    dialog.showModal();
});

document.querySelector('dialog button').addEventListener('click', event => {
    dialog.close();
});
