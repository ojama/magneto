# Eruda

[![npm version](https://badge.fury.io/js/eruda.svg)](https://badge.fury.io/js/eruda) 

Console for Mobile Browsers.

![Eruda](http://7xn2zy.com1.z0.glb.clouddn.com/eruda_screenshot3.jpg)

## Why

Logging things out on mobile browser is never an easy stuff. I used to include 
`window onerror alert` script inside pages to find out JavaScript errors, kind 
of stupid and inefficient. Desktop browser DevTools is great, and I wish there 
is a similar one on mobile side, which leads to the creation of Eruda.

## Demo

![Demo](http://7xn2zy.com1.z0.glb.clouddn.com/eruda_qrcode2.png)

Browse it on your phone: [http://liriliri.github.io/eruda/](http://liriliri.github.io/eruda/)

In order to try it for different sites, execute the script below on browser address bar.

```javascript
javascript:(function () { var script = document.createElement('script'); script.src="//liriliri.github.io/eruda/eruda.min.js"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();
```

## Features

* Console: Display JavaScript logs.
* Elements: Check dom state.
* Network: Show performance timing, ajax requests status.
* Resource: Show localStorage, cookie information.
* Info: Show url, user agent info.
* Snippets: Include snippets used most often.
* Sources: Html, js, css source viewer.
* Features: Browser feature detections.

## Install

You can get it on npm.

```bash
npm install eruda --save
```

Add this script to your page.

```html
<script src="node_modules/eruda/dist/eruda.min.js"></script>
<script>eruda.init();</script>
```

The JavaScript file size is quite huge(about 75kb gzipped) and therefore not
suitable to include in mobile pages. It's recommended to make sure eruda is
loaded only when eruda is set to true on url(http://example.com/?eruda=true),
for example:

```javascript
(function () {
    var src = 'node_modules/eruda/dist/eruda.min.js';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
```

## Configuration

When initialization, a configuration object can be passed in.

* container: Container element. If not set, it will append a element directly
under html root element.
* tool: Choose which default tools you want, by default all will be added.

```javascript
var el = document.createElement('div');
document.body.appendChild(el);

eruda.init({
    container: el,
    tool: ['console', 'elements']
});
```

## Plugins

It is possible to enhance Eruda with more features by writing plugins. Check
source code of plugins below to learn how to write your own custom tool panels.

* [eruda-fps](https://github.com/liriliri/eruda-fps): Display page fps info.

## License

Eruda is released under the MIT license. Please see
[LICENSE](https://opensource.org/licenses/MIT) for full details.
