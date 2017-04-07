'use strict';

if (process.argv.length === 0) {
    console.info('usage: fablife [descriptor1] [descriptor2] [descriptor3] [descriptorx]');
    process.exit(1);
}

var memory = require('memory-cache');
var request = require('request');

process.argv.splice(0, 2);

console.log(process.argv);