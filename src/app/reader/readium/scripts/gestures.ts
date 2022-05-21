export const SWIPELEFT_EVENT = "SWIPELEFT_EVENT";
export const SWIPERIGHT_EVENT = "SWIPERIGHT_EVENT";
export const TAP_EVENT = "TAP_EVENT";

// window.pressPageX = e.center.x;
// window.pressPageY = e.center.y;

export const gestureEvents = `
        window.addEventListener('ns-bridge-ready', function() {
            delete Hammer.defaults.cssProps.userSelect; // https://stackoverflow.com/a/37896547
            const hammerjs = new Hammer(document.querySelector('body'), { inputClass: Hammer.TouchInput });
            console.log('hammerjs', typeof hammerjs);
            hammerjs.on('tap', function(e) {
                window.nsWebViewBridge.emit('${TAP_EVENT}', '');
            });
            hammerjs.on('swipeleft', function(e) {
                window.nsWebViewBridge.emit('${SWIPELEFT_EVENT}', '');
            });
            hammerjs.on('swiperight', function(e) {
                window.nsWebViewBridge.emit('${SWIPERIGHT_EVENT}', JSON.stringify({x: e.center.x, y: e.center.y}));
            });
        });
`
