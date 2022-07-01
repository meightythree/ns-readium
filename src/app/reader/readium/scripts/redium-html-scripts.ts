import { ReadiumHtmlOptions, ReadiumUserView } from "../redium.model";

export const DEBUG_EVENT = "READIUM_DEBUG_EVENT";
export const NS_BRIDGE_READY = "READIUM_NS_BRIDGE_READY";
export const UPDATE_PAGES_EVENT = "UPDATE_PAGES_EVENT";
export const UPDATE_ORIENTATION_EVENT = "UPDATE_ORIENTATION_EVENT";
export const UPDATE_PAGE_OFFSETS_EVENT = "UPDATE_PAGE_OFFSETS_EVENT";
export const UPDATE_DIMENSIONS_EVENT = "UPDATE_DIMENSIONS_EVENT";

export const readiumScripts = (options: ReadiumHtmlOptions) => `
    ${convertRemToPixels}
    ${calculateColumns}
    ${updateUserView}
    document.calculateColumns = calculateColumns;
    document.isPortrait = ${isPortrait};
    document.isLandscape = ${isLandscape};
    ${calculatePages(options.userView)}
    ${readiumEvents(options)}
    updateUserView('${options.userView}');

    window.updateUserView = updateUserView;
`;

const readiumEvents = (options: ReadiumHtmlOptions) =>  `
    window.addEventListener('ns-bridge-ready', function (error) {
        window.nsWebViewBridge.emit('${UPDATE_PAGES_EVENT}', calculatePages());
        window.nsWebViewBridge.emit('${NS_BRIDGE_READY}', '');
        ${emitOrientation}
        ${emitDimensions}
        window.nsWebViewBridge.emit('${DEBUG_EVENT}', '');
    });

    window.addEventListener('resize', function (event) {
        window.nsWebViewBridge.emit('${UPDATE_PAGES_EVENT}', calculatePages());
        ${emitOrientation}
        ${emitDimensions}
    });
    
    window.addEventListener('scroll', function (event) {
        ${emitPageOffset}
    });
`;

const isPortrait = `window.matchMedia("(orientation: portrait)").matches`;
const isLandscape = `window.matchMedia("(orientation: landscape)").matches`;

const emitPageOffset =  `
    const pageYOffset = window.pageYOffset;
    const pageXOffset = window.pageXOffset;
    window.nsWebViewBridge.emit('${UPDATE_PAGE_OFFSETS_EVENT}', JSON.stringify({ pageXOffset, pageYOffset }));
`

const emitOrientation = `
    const isPortrait = ${isPortrait};
    const isLandscape = ${isLandscape};
    window.nsWebViewBridge.emit('${UPDATE_ORIENTATION_EVENT}', JSON.stringify({ isLandscape, isPortrait }));
`;

const emitDimensions = `
    const clientHeight = document.body.clientHeight;
    const clientWidth = document.body.clientWidth;
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    window.nsWebViewBridge.emit('${UPDATE_DIMENSIONS_EVENT}', JSON.stringify({ clientHeight, clientWidth, innerHeight, innerWidth }));
`;

const calculateColumns = `function calculateColumns() {
    const columnWidth = convertRemToPixels(getComputedStyle(document.body).getPropertyValue('--RS__maxLineLength'));
    const firstReadiumElement = document.getElementById('first-readium-element');
    const lastReadiumElement = document.getElementById('last-readium-element');
    const x = lastReadiumElement.getBoundingClientRect().right - firstReadiumElement.getBoundingClientRect().left;
    const clientWidth = document.body.clientWidth;
    return Math.ceil(x / clientWidth);
}
`;

const calculatePages = (userView: ReadiumUserView) => ` function calculatePages() {
    if ('${userView}' === '${ReadiumUserView.PagedOn}') {
        return calculateColumns();
    } else if ('${userView}' === '${ReadiumUserView.ScrollOn}') {
        return Math.ceil(Number(document.body.clientHeight / window.innerHeight));
    }
}`;

const convertRemToPixels =  `function convertRemToPixels(rem) {
    return Number(rem.replace('rem', '')) * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
`;

const updateUserView = `function updateUserView(userView) {
    if ('${ReadiumUserView.PagedOn}' === userView) {
        document.body.setAttribute('scroll', 'no');
        document.body.style.overflow = 'hidden';
    } else if ('${ReadiumUserView.ScrollOn}' === userView) {
        document.body.setAttribute('scroll', 'initial');
        document.body.style.overflow = 'initial';
    }
    document.documentElement.style.setProperty('--USER__view', userView);
}
`;