var request = require('request');
var prompt = require('prompt');

var bundle = "workshop-2";
var items = [{name: 'sex'}, {name: 'weightCurrent'}, {name: 'age'}];
var itemIdx = 0;

prompt.start();

function reqSalus(items) {
    'use strict';
    var options = {
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json',
            Authorization: 'admin34'
        },
        body: items
    };


    request('http://api.salus.fablife.com/bundle/' + bundle + '/salus', options, function(error, response, body) {
        if (error) {
            console.log('  err: ' + error);
        }

        if (!error && response.statusCode === 200) {
            console.log(JSON.stringify(body, null, 2));
        } else {
            console.log("there is an error in the typed values.");
        }

    });
}

function getDescriptor() {
    'use strict';
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
            getDescriptor();
        } else {
            reqSalus(items);
        }

    });

}



getDescriptor();
