var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Cron FieldType Constructor
 * @extends Field
 * @api public
 */
function cron (list, path, options) {
    this.options = options;
    this._nativeType = String;
    this._properties = ['monospace'];
    this._underscoreMethods = ['crop'];
    cron.super_.call(this, list, path, options);
}
cron.properName = 'Cron';
util.inherits(cron, FieldType);

cron.prototype.validateInput = function (data, callback) {
    utils.defer(callback, true);
};

cron.prototype.validateRequiredInput = function (item, data, callback) {
    utils.defer(callback, true);
};

/**
 * Add filters to a query
 */
cron.prototype.addFilterToQuery = function (filter) {
    var query = {};
    if (filter.mode === 'exactly' && !filter.value) {
        query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
        return query;
    }
    var value = utils.escapeRegExp(filter.value);
    if (filter.mode === 'beginsWith') {
        value = '^' + value;
    } else if (filter.mode === 'endsWith') {
        value = value + '$';
    } else if (filter.mode === 'exactly') {
        value = '^' + value + '$';
    }
    value = new RegExp(value, filter.caseSensitive ? '' : 'i');
    query[this.path] = filter.inverted ? { $not: value } : value;
    return query;
};

/**
 * Crops the string to the specifed length.
 */
cron.prototype.crop = function (item, length, append, preserveWords) {
    return utils.cropString(item.get(this.path), length, append, preserveWords);
};

/* Export Field Type */
module.exports = cron;
