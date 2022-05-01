import { readiumCssBefore } from './css/readium-css-before';
import { readiumCssDefault } from './css/readium-css-default';
import { readiumCssAfter } from './css/readium-css-after';
import { ReadiumHtmlOptions } from './redium.model';
import { readiumScripts } from './redium-html-scripts';

export const rediumHtml = (options: ReadiumHtmlOptions) => {
    const { head, body } = options;
    return  `<!DOCTYPE html>
    <html lang="en" style="--USER__view: readium-paged-on; --USER__fontOverride: readium-font-off; --RS__baseLineHeight: 1.5;">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
        ${head ?? ''}
        <style>${readiumCssBefore}</style>
        <style>${readiumCssDefault}</style>
        <style>${readiumCssAfter}</style>
    </head>
    <body scroll="no" style="overflow: hidden">
        ${body}
        <script type="text/javascript">${readiumScripts(options)}</script>
    </body>
    `
}