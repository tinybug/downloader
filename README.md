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
downloader.on('new-item', function(filepath) {
    console.log('start download: ' + filepath);
});
downloader.on('progress', function(downloaded, total) {
    console.log('download count: ' + downloaded + '/' + total);
});
downloader.on('error', function(error) {
    console.log(error);
});
downloader.on('finish', function() {
    console.log('finish');
});
downloader.start();
```