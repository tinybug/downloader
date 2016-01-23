'use strict';

const EventEmitter = require('events'),
    fs = require('fs'),
    path = require('path'),
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

Downloader.prototype._download = function() {
    if(this._downloadingCount < this._downloadingLimit) {
        ++ this._downloadingCount;
        this.emit('hungry');
        const item = this._items.shift();
        if(! item) return;
        const self = this;
        request({url: item.url, followAllRedirects: true })
            .on('response', function(response) {
                console.log('new one donwloading...');
            })
            .on('error', function(error) {
                self.emit('error', error);
            })
            .pipe(fs.createWriteStream(item.filepath))
            .on('error', function(error) {
                self.emit('error', error);
            })
            .on('close', function() {
                -- self._downloadingCount;
                ++ self._downloaded;
                console.log('downloading count: ' + self._downloadingCount);
                self.emit('finish-item');
                if(self._downloaded == self._total) {
                    self.emit('finish');
                }
            });
    }
};

module.exports = Downloader;
