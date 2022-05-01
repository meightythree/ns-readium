import { ReadiumHtmlOptions } from "./redium.model";

export const UPDATE_PAGES_EVENT = "UPDATE_PAGES_EVENT";

export const readiumScripts = (options: ReadiumHtmlOptions) => `
    ${calculatePages}
    document.calculatePages = calculatePages;
    ${rediumEvents(options)}
`;

const rediumEvents = (options: ReadiumHtmlOptions) =>  `
    window.addEventListener('ns-bridge-ready', function (error) {
        window.nsWebViewBridge.emit('${UPDATE_PAGES_EVENT}', calculatePages());
    });
`;

const calculatePages = `
function calculatePages() {
    const width = document.body.getBoundingClientRect().width;
    const clientWidth = document.body.clientWidth;
    return Math.floor(Number(width / clientWidth));
}
`;
