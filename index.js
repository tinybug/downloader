'use strict';

const EventEmitter = require('events'),
    fs = require('fs'),
    util = require('util'),
    request = require('request');

function Downloader() {
    EventEmitter.call(this);

    this.on('hungry', this._download);
    this.on('finish-item', this._download);
}

util.inherits(Downloader, EventEmitter);

Downloader.prototype.init = function(items, limit) {
    this._downloadingCount = 0;
    this._items = items;
    this._downloadingLimit = limit;
    this._total = items.length;
    this._downloaded = 0;
};

Downloader.prototype.start = function() {
    this._download();
};

Downloader.prototype._handleDownloaded = function() {
    -- this._downloadingCount;
    ++ this._downloaded;
    this.emit('progress', this._downloaded, this._total);
    if(this._downloaded == this._total) {
        return this.emit('finish');
    }
    this.emit('finish-item');
};

Downloader.prototype._download = function() {
    if(this._downloadingCount < this._downloadingLimit) {
        ++ this._downloadingCount;
        this.emit('hungry');
        const item = this._items.shift();
        if(! item) {
            return;
        }
        const self = this;
        const req = request({url: item.url, followAllRedirects: true })
            .on('response', function(response) {
                self.emit('new-item', item.filepath);
                if(fs.existsSync(item.filepath)) {
                    const stat = fs.statSync(item.filepath);
                    if (stat['size'] == response.headers['content-length']) {
                        req.abort();
                        return self._handleDownloaded();
                    }
                }

                req.pipe(fs.createWriteStream(item.filepath))
                    .on('error', function(error) {
                        self.emit('error', error);
                    })
                    .on('close', function() {
                        self._handleDownloaded();
                    });
            })
            .on('error', function(error) {
                console.log(item);
                self._items.push(item);
                self.emit('error', error);
            });
    }
};

module.exports = Downloader;
