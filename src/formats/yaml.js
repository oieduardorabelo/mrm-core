'use strict';

const fs = require('fs');
const _ = require('lodash');
const yaml = require('js-yaml');
const merge = require('../util/merge');
const core = require('../core');

module.exports = function(filename, defaultValue) {
	const exists = fs.existsSync(filename);

	let originalContent = '';
	let json = defaultValue || {};
	if (exists) {
		originalContent = core.readFile(filename);
		json = yaml.safeLoad(originalContent);
	}

	return {
		/** Return true if a file exists */
		exists() {
			return exists;
		},

		/** Get a value at a given address */
		get(address, defaultValue) {
			if (!address) {
				return json;
			}

			return _.get(json, address, defaultValue);
		},

		/** Set a value at a given address */
		set(address, value) {
			if (value === undefined) {
				json = address;
			} else {
				_.set(json, address, value);
			}
			return this;
		},

		/** Remove a section with a given address */
		unset(address) {
			_.unset(json, address);
			return this;
		},

		/** Merge a given value with the current value */
		merge(value) {
			json = merge(json, value);
			return this;
		},

		/** Save file */
		save() {
			const content = yaml.safeDump(json, null, '  ');
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
