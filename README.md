# gauge.js

[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]
[![DevDependency Status][depstat-dev-image]][depstat-dev-url]

> Тестовое задание KudaGo ([Demo](http://jsfiddle.net/VovanR/exnzzqx8/))

![](example/specs.png)

## Install

```sh
npm i -D gauge.js
bower i -D 'VovanR/gauge.js'
```

## Usage

```javascript
var foo = new Gauge({
    block: document.getElementById('holder'),
    actualValue: 4,
    labels: [0, 1, 2, 3, 4, 5, 6],
    warningValue: 75,
    dangerValue: 90,
});
```

```javascript
foo.setValue(2);
foo.setValue(6);
foo.setValue(0);
```

## Development

### Initialize
```sh
npm i
```

### Test
*In console*
```sh
npm run test
```

*In browser*
```sh
open ./text/index-test.html
```

### Lint
```sh
npm run lint
```

## License
MIT © [Vladimir Rodkin](https://github.com/VovanR)

[travis-url]: https://travis-ci.org/VovanR/gauge.js
[travis-image]: http://img.shields.io/travis/VovanR/gauge.js.svg

[depstat-url]: https://david-dm.org/VovanR/gauge.js
[depstat-image]: https://david-dm.org/VovanR/gauge.js.svg

[depstat-dev-url]: https://david-dm.org/VovanR/gauge.js
[depstat-dev-image]: https://david-dm.org/VovanR/gauge.js/dev-status.svg
