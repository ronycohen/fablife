'use strict';
var request = require('request');
var memoryCache = require('memory-cache');
var _ = require('lodash');
var prompt = require('prompt');
var items = [{ name: 'sex' }, { name: 'weightCurrent' }, { name: 'age' }];
var itemIdx = 0;
var TTL = 1000 * 30; //30s
var bundle = "workshop-2";

function _getCachedParameters(cb) {
    'use strict';

    var cache = memoryCache.get('parameters');
    if (cache) {
        return cb(cache);
    }

    var options = {
        method: 'GET',
        json: true,
        headers: {
            'content-type': 'application/json',
            Authorization: 'admin34'
        },
        url: 'http://api.salus.fablife.com/bundle/' + bundle + '/parameters'
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log('  err: ' + error);
            cb("request Parameters error");
        }

        if (!error && response.statusCode === 200) {
            memoryCache.put('parameters', body, TTL);
            cb(body);
        }
    });
}

var _getDescriptionParameters = function(cb) {
    'use strict';
    _getCachedParameters(function(parameters) {
        var params = _(parameters)
            .filter(function(item) {
                return item.name;
            })
            .keyBy('name')
            .mapValues(function(item) {
                return item.description;
            })
            .value();
        cb(params);
    });
}

var _getNutrinome = function(items, cb) {
    'use strict';
    var options = {
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json',
            Authorization: 'admin34'
        },
        body: _.map(items, function(v, k) {
            return {
                name: k,
                value: v
            };
        })
    };

    request('http://api.salus.fablife.com/bundle/' + bundle + '/salus', options, function(error, response, body) {
        if (error) {
            console.log('  err: ' + error);
            return cb("Error API");
        }

        if (!error && response.statusCode === 200) {
            //console.log(JSON.stringify(body, null, 2));
            return cb(body);
        } else {
            return cb("Error : there is an error in the typed values.");
        }

    });
}

function _getNutrinomeWithDesc(items, cb) {
    _getNutrinome(items, function(nutrinome) {
        if (_.isObject(nutrinome)) {
            _getDescriptionParameters(function(descriptionsParameters) {
                nutrinome.profileParameters = _(nutrinome.profileParameters)
                    .mapValues(function(item, name) {
                        item.description = descriptionsParameters[name];
                        return item;
                    })
                    .value();
                cb({datas:nutrinome});
            });
        } else {
            cb({errors: nutrinome});
        }
    });


}


var _promptDescriptor = function(cb) {
    prompt.start();

    var descriptor = {
        properties: {
            descriptorValue: {
                message: 'Please type a value for ' + items[itemIdx].name,
                required: true
            }
        }
    };

    prompt.get(descriptor, function(err, result) {
        if (err) {
            console.log('  err: ' + err);
        }

        items[itemIdx].value = result.descriptorValue;
        itemIdx++;

        if (itemIdx < items.length) {
            _promptDescriptor();
        } else {
            _getNutrinomeWithDesc(items, cb);
        }
    });
}

module.exports = {
    promptDescriptor: _promptDescriptor,
    getNutrinomeWithDesc: _getNutrinomeWithDesc
}
