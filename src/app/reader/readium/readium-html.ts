import { readiumCssBefore } from './css/readium-css-before';
import { readiumCssDefault } from './css/readium-css-default';
import { readiumCssAfter } from './css/readium-css-after';
import { ReadiumHtmlOptions, ReadiumUserView } from './redium.model';
import { readiumScripts } from './scripts/redium-html-scripts';
import { hammer } from './scripts/hammer'
import { gestureEvents } from './scripts/gestures'

export const readiumHtml = (options: ReadiumHtmlOptions) => {
    const { head, body, userView } = options;
    const isPagedOn = ReadiumUserView.PagedOn === userView;
    return  `<!DOCTYPE html>
    <html lang="en" style="--USER__fontOverride: readium-font-off; --RS__baseLineHeight: 1.5;">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
        ${head ?? ''}
        <style>${readiumCssBefore}</style>
        <style>${readiumCssDefault}</style>
        <style>${readiumCssAfter}</style>
        <script type="text/javascript">${hammer}</script>
    </head>
    <body>
        <div id="first-readium-element"></div>
        ${body}
        <div id="last-readium-element"></div>
        <script type="text/javascript">${readiumScripts(options)}</script>
        <script type="text/javascript">${gestureEvents}</script>
    </body>
    </html>
    `
}
