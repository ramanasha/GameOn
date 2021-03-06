/**
 * Helper for making authorized requested to the GameOn API.
 *
 * @param options JSON object with options:
 *    url: Fully qualified URL to hit
 *    method: HTTP verb (GET, POST, PUT, DELETE, PATCH)
 *    qs: JSON object of query string properties
 *    json: JSON object of body to send in post
 *    invalid_signature: Setting to true will not send key, secret, and signature
 *    callback: Function to call after response is recieved
 *
 * @param callback Callback can be specified here & takes priority over options.
 */

var crypto = require('crypto'),
    config = require('../../config/config').gameon,
    request = require('request'),
    mongoose = require('mongoose');

var make_request = function(options, callback) {
  var call_id,
      sig,
      query_string;

  call_id = Date.now().toString();

  sig = crypto.createHmac('md5', config.API_SECRET)
    .update(config.API_KEY + call_id + config.API_SECRET)
    .digest("hex");

  query_string = options.qs || {};
  if (! options.invalid_signature) {
    query_string.api_key = config.API_KEY;
    query_string.call_id = call_id;
    query_string.signature = sig;
  }
  if (query_string.token || options.token) {
    query_string.token = query_string.token || options.token;
    query_string.uid = query_string.uid || options.uid;
  }

  var params = {
    uri: options.url,
    method: options.method || 'GET',
    qs: query_string
  };

  if (params.method !== 'GET') {
    params.json = options.json || options.body;
  }

  request(params, (callback || options.callback));
};

make_request.get = function(options, callback) {
  options.method = 'GET';
  make_request(options, callback);
}
make_request.post = function(options, callback) {
  options.method = 'POST';
  make_request(options, callback);
}
make_request.put = function(options, callback) {
  options.method = 'PUT';
  make_request(options, callback);
}
make_request.patch = function(options, callback) {
  options.method = 'PATCH';
  make_request(options, callback);
}
make_request.del = function(options, callback) {
  options.method = 'DELETE';
  make_request(options, callback);
}

module.exports = make_request;
