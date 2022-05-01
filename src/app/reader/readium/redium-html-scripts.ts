import { ReadiumHtmlOptions } from "./redium.model";

export const DEBUG_EVENT = "READIUM_DEBUG_EVENT";
export const UPDATE_PAGES_EVENT = "UPDATE_PAGES_EVENT";

export const readiumScripts = (options: ReadiumHtmlOptions) => `
    ${convertRemToPixels}
    ${calculateColumns}
    document.calculateColumns = calculateColumns;
    ${rediumEvents(options)}
`;

const rediumEvents = (options: ReadiumHtmlOptions) =>  `
    window.addEventListener('ns-bridge-ready', function (error) {
        window.nsWebViewBridge.emit('${UPDATE_PAGES_EVENT}', calculateColumns());
        window.nsWebViewBridge.emit('${DEBUG_EVENT}', JSON.stringify(calculateColumns()));
    });
`;

const calculateColumns = `
function calculateColumns() {
    const columnWidth = convertRemToPixels(getComputedStyle(document.body).getPropertyValue('--RS__maxLineLength'));
    const firstReadiumElement = document.getElementById('first-readium-element');
    const lastReadiumElement = document.getElementById('last-readium-element');
    const x = lastReadiumElement.getBoundingClientRect().right - firstReadiumElement.getBoundingClientRect().left;
    const clientWidth = document.body.clientWidth;
    return Math.ceil(x / clientWidth);
}
`;

const convertRemToPixels =  `
function convertRemToPixels(rem) {
    return Number(rem.replace('rem', '')) * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
`;