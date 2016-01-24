# Description
If there are 10 files you need to download, you can use init() to set the max limit downloading file in the same time, when one file finish downloaded, it will start a new download request.It will always contains max limit downloading file when there are enough files to download.

```js
const Downloader = require('downloader');
const downloader = new Downloader();
const items = [
    {url: 'www.test1.com/file1', filepath: 'filepath1'},
    {url: 'www.test2.com/file2', filepath: 'filepath2'}
];
downloader.init(items, 1);
downloader.on('file', function(filepath) {
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
# TODO
## push item dynamic
## file download in chunk
