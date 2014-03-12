# node-quick-temp

Create and remove temporary directories. Useful for build tools, like Broccoli
plugins. Smart about naming, and placing them in `./tmp` if possible, so you
don't have to worry about this.

Note: Version 0.2.0 brought a breaking change. Now every function returns a promise
and the asynchronous file functions are used internally.

## Installation

```bash
npm install --save quick-temp
```

## Usage

```js
var quickTemp = require('quick-temp')
```

### Creating a temporary directory

To make a temporary and assign its path to `this.tmpDestDir`, call either one
of these:

```js
quickTemp.makeOrRemake(this, 'tmpDestDir').then(...)
// or
quickTemp.makeOrReuse(this, 'tmpDestDir').then(...)
```

If `this.tmpDestDir` already contains a path, `makeOrRemake` will remove it
first and then create a new directory (with a different path), whereas
`makeOrReuse` will be a no-op.

Both functions return a promise that resolves to the path of the temporary directory.

### Removing a temporary directory

To remove a previously-created temporary directory and all its contents, call

```js
quickTemp.remove(this, 'tmpDestDir').then(...)
```

This will also assign `this.tmpDestDir = null`. If `this.tmpDestDir` is
already null or undefined, it will be a no-op.

## Development
- `npm test` runs tests once
- `npm run-script autotest` runs tests on every file change