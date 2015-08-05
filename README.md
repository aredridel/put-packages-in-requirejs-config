put-packages-in-requirejs-config
===============================

A simple module to update a requirejs config to include packages from a
CommonJS Packages/A directory.

Tastes great, and goes well with [`copy-browser-modules`](https://github.com/aredridel/copy-browser-modules).

Use:
----

```javascript
var insertPackagesFromPathIntoConfig = require('put-packages-in-requirejs-config');

insertPackagesFromPathIntoConfig('path/to/packages', 'path/to/config/file' /* , 'path/to/target/config/file' */).then(function() {
    console.log('success!');
}).catch(function (err) {
    console.error('that went bad', err);
});
```

The last argument is completely optional, and if not given, the original config
file will be updated.
