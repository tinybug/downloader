# Description
state limit count downloading items.

```js
const Downloader = require('downloader');
const downloader = new Downloader();
const items = [
    {url: 'www.test1.com/file1', filepath: 'filepath1'},
    {url: 'www.test2.com/file2', filepath: 'filepath2'}
];
downloader.init(items, 1);
downloader.start();
downloader.on('error', function(error) {
    console.log(error);
});
downloader.on('finish', function() {
    console.log('finish');
});
```