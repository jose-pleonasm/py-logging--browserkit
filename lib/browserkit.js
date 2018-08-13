(function() {
var util = {
	inherits: function (child, parent) {
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child;
	},
};

/**
 * @private
 * @param  {string} url
 * @param  {*} [data]
 * @param  {string} [method]
 * @param  {Object} [headers]
 * @param  {Object} [options]
 * @return {undefined}
 */
function send(method, url, data, headers, options) {
	data = data || null;
	headers = headers || {};
	options = options || {};

	var opts = {
		timeout: typeof options.timeout !== 'undefined' ? options.timeout : 0,
		withCredentials: typeof options.withCredentials !== 'undefined'
			? options.withCredentials : false,
	};
	var xhr = new XMLHttpRequest();

	xhr.open(method, url, true);
	xhr.timeout = opts.timeout;
	xhr.withCredentials = opts.withCredentials;
	Object.keys(headers).forEach(function(key) {
		xhr.setRequestHeader(key, headers[key]);
	});
	xhr.send(data);
}


/**
 * @module py-logging-browserkit
 */


function install(logging) {
	if (!logging || typeof logging !== 'object') {
		throw new Error('Argument 0 of install is not valid.');
	}


	//--------------------------------------------------------------------------
	//   Browser/feature detections
	//--------------------------------------------------------------------------

	var ua = typeof window === 'object' && window
		&& window.navigator && window.navigator.userAgent;
	var isIE = ua && (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1);


	//--------------------------------------------------------------------------
	//   basicConfig
	//--------------------------------------------------------------------------

	/**
	 * Do basic configuration for the logging system.
	 *
	 * @function
	 * @override
	 * @memberof module:py-logging-browserkit
	 * @param  {Object} [options]
	 */
	function basicConfig(options) {
		options = options || {};

		var url = options.url;
		var format = options.format || '%(levelname):%(name):%(message)';
		var timeFormat = options.timeFormat || '';
		var root = logging.getLogger();
		var handler = null;
		var formatter = null;

		if (url) {
			formatter = new logging.Formatter(format, timeFormat);
			handler = new ImgHttpHandler(url);

		} else {
			var grouping = typeof options.grouping !== 'undefined'
				? options.grouping : true;
			var styles = options.styles || null;
			var colors = options.colors || null;

			formatter = new StylishConsoleFormatter(format, timeFormat,
				                                    styles, colors);
			handler = new logging.ConsoleHandler('', grouping);
		}

		handler.setFormatter(formatter);
		root.addHandler(handler);
		var level = options.level;
		if (level) {
			if (typeof level === 'string') {
				level = root.constructor.getLevelByName(level);
			}
			root.setLevel(level);
		}
	}


	//--------------------------------------------------------------------------
	//   Console formatter
	//--------------------------------------------------------------------------

	/**
	 * @memberof module:py-logging-browserkit
	 * @constructor ConsoleFormatter
	 * @extends Formatter
	 * @param {string} [format]
	 * @param {string} [timeFormat]
	 */
	function ConsoleFormatter(format, timeFormat) {
		format = format || '%(name)-s %(message)-s';
		timeFormat = timeFormat || '%H:%M:%S';

		logging.Formatter.call(this, format, timeFormat);

		this._compiledFormat = this._compile(format);
	}
	util.inherits(ConsoleFormatter, logging.Formatter);

	/** @inheritdoc */
	ConsoleFormatter.prototype.format = function(record) {
		var re = new RegExp(
			logging.Formatter.FORMAT_PATTERN.source,
			logging.Formatter.FORMAT_PATTERN.flags
		);
		var item = [];
		var s = this._compiledFormat;
		var data = [];

		while ((item = re.exec(this._format)) !== null) {
			var key = item[1];
			var flag = item[2] || '';
			var width = item[3] || NaN;
			var precision = item[4] || NaN;
			var type = item[5] || 's';

			data.push(this._getValue(record, key, flag, width, precision, type));
		}

		if (record.error) {
			s = s + '%o';
			data.push(record.error);
		}

		return [s].concat(data);
	};

	/**
	 * @private
	 * @param  {module:py-logging.LogRecord} record
	 * @param  {string} key
	 * @param  {string} [flag]
	 * @param  {number} [width]
	 * @param  {number} [precision]
	 * @param  {string} [type]
	 * @return {string}
	 */
	ConsoleFormatter.prototype._getValue = function(record, key, flag, width, precision, type) {
		if (key === 'asctime') {
			return this.formatTime(record);
		}
		if (!record[key]) {
			return '';
		}
		if (type === 's') {
			return this._getReplacement(
				record,
				null,
				key,
				flag,
				width,
				precision,
				type
			);
		}

		return record[key];
	};

	/**
	 * @private
	 * @param  {string} format
	 * @return {string}
	 */
	ConsoleFormatter.prototype._compile = function(format) {
		return format.replace(logging.Formatter.FORMAT_PATTERN, this._getDirective);
	};

	/**
	 * @private
	 * @param  {string} match
	 * @param  {string} key
	 * @param  {string} [flag]
	 * @param  {number} [width]
	 * @param  {number} [precision]
	 * @param  {string} [type]
	 * @return {string}
	 */
	ConsoleFormatter.prototype._getDirective = function(match, key, flag, width, precision, type) {
		if (type === 's') {
			return '%s';

		} else if (type === 'd') {
			var w = width || '';
			var p = precision || '';
			return '%' + w + (p ? '.' : '') + p + 'd';

		} else if (type === 'f') {
			var w = width || '';
			var p = precision || '';
			return '%' + w + (p ? '.' : '') + p + 'f';

		} else if (type === 'o') {
			return '%o';

		} else if (type === 'O') {
			return '%O';
		}
	};


	//--------------------------------------------------------------------------
	//   Another console formatter
	//--------------------------------------------------------------------------

	/**
	 * @memberof module:py-logging-browserkit
	 * @constructor StylishConsoleFormatter
	 * @extends ConsoleFormatter
	 * @param {string} [format]
	 * @param {string} [timeFormat]
	 * @param {Object} [styles]
	 * @param {(Function|Array<string>)} [colors]
	 */
	function StylishConsoleFormatter(format, timeFormat, styles, colors) {
		format = format || '%(message)';
		timeFormat = timeFormat || '%Y-%m-%d %H:%M:%S';
		styles = styles || {};
		colors = colors || StylishConsoleFormatter.naiveColorGenerator;

		this._format = format;
		this._timeFormat = timeFormat;
		this._styles = Array.isArray(styles)
			? Object.assign.apply(Object, [{}].concat(styles)) : styles; // TODO: deep
		this._getColor = typeof colors === 'function'
			? colors : this._getColorsIterator(colors);
		this._store = {};
		this._counters = {};
	}
	util.inherits(StylishConsoleFormatter, ConsoleFormatter);

	/**
	 * @constant
	 * @type {Object}
	 */
	StylishConsoleFormatter.COLORED_NAME = {
		'name': {
			'*': {
				'font-weight': 'bold;',
				'color': '%(color);',
			},
		},
	};

	/**
	 * @constant
	 * @type {Object}
	 */
	StylishConsoleFormatter.COLORED_BG_NAME = {
		'name': {
			'*': {
				'padding': '1px 4px;',
				'background-color': '%(color);',
				'color': 'white;',
			},
		},
	};

	/**
	 * @constant
	 * @type {Object}
	 */
	StylishConsoleFormatter.COLORED_SQUARE_NAME = {
		'name': {
			'*': {
				'padding': '0 0 0 5px;',
				'border-left-style': 'solid;',
				'border-left-width': '13px;',
				'border-left-color': '%(color);',
			},
		},
	};

	/**
	 * @constant
	 * @type {Object}
	 */
	StylishConsoleFormatter.COLORED_LEVELNAME = {
		'levelname': {
			'DEBUG': {
				'color': 'green;',
			},
			'INFO': {
				'color': 'blue;',
			},
			'WARNING': {
				'color': 'orange;',
			},
			'ERROR': {
				'color': 'red;',
			},
			'*': {
				'color': 'grey;',
			},
		},
	};

	/**
	 * @constant
	 * @type {Array<string>}
	 */
	StylishConsoleFormatter.TIGHT_PALLETE = [
		'#37455c',
		'#1da1f2',
		'#cb2027',
		'#ff5700',
		'#848484',
		'#118C4E',
		'#FF9009',
		'#9A2747',
		'#85A40C',
		'#265273',
		'#BF8E40',
		'#CC6666',
		'#000000',
		'#645188',
	];

	/**
	 * Naive implementation of color generator.
	 *
	 * @static
	 * @return {string}
	 */
	StylishConsoleFormatter.naiveColorGenerator = function() {
		return '#' + Math.random().toString(16).slice(2, 8);
	};

	/** @inheritdoc */
	StylishConsoleFormatter.prototype.format = function(record) {
		var values = [];
		var cb = this._processItem.bind(this, values, record);
		var s = '';

		s = this._format.replace(
			logging.Formatter.FORMAT_PATTERN,
			cb
		);

		if (record.error) {
			s = s + '%o';
			values.push(record.error);
		}

		return [s].concat(values);
	};

	/**
	 * @private
	 * @param  {Array} data
	 * @param  {module:py-logging.LogRecord} record
	 * @param  {string} match
	 * @param  {string} key
	 * @param  {string} flag
	 * @param  {string} width
	 * @param  {string} precision
	 * @param  {string} type
	 * @return {string}
	 */
	StylishConsoleFormatter.prototype._processItem = function(data, record, match, key, flag, width, precision, type) {
		var pureValue = record[key];
		var directive = this._getDirective(
			match,
			key,
			flag,
			width,
			precision,
			type
		);
		var value = this._getValue(
			record,
			key,
			flag,
			width,
			precision,
			type
		);
		var style = this._styles[key]
				&& (this._styles[key][pureValue] || this._styles[key]['*']);
		var styling = !isIE && style
			? this._getStyling(key, pureValue, style)
			: '';

		if (styling) {
			directive = '%c' + directive;
			data.push(styling);
		}
		data.push(value);
		if (styling) {
			directive = directive + '%c';
			data.push('');
		}

		return directive;
	};

	/**
	 * @private
	 * @param  {string} property
	 * @param  {*} value
	 * @param  {Object} style
	 * @return {string}
	 */
	StylishConsoleFormatter.prototype._getStyling = function(property, value, style) {
		var styleProp = '';
		var styleValue = '';
		var styling = '';
		var completeStyle = Object.assign({}, this._styles.common, style);

		for (styleProp in completeStyle) {
			if (!completeStyle.hasOwnProperty(styleProp)) {
				continue;
			}

			styleValue = completeStyle[styleProp];

			if (styleValue.indexOf('%(color)') > -1) {
				var storeKey = property + value;
				var color = this._store[storeKey];

				if (!color) {
					this._store[storeKey] = color = this._getColor(property);
				}

				styleValue = styleValue.replace('%(color)', color);
			}

			styling += styleProp + ':' + styleValue;
		}

		return styling;
	};

	/**
	 * @private
	 * @param  {Array<string>} colors
	 * @return {Function}
	 */
	StylishConsoleFormatter.prototype._getColorsIterator = function(colors) {
		if (!Array.isArray(colors)) {
			throw new Error('Arguent "colors" is not valid.');
		}

		return (function(ns) {
			if (!this._counters[ns]) {
				this._counters[ns] = 0;
			}

			return colors[this._counters[ns]++ % colors.length];
		}).bind(this);
	};


	//--------------------------------------------------------------------------
	//   HTTP handlers
	//--------------------------------------------------------------------------

	/**
	 * Simple HTTP handler (using Image API).
	 *
	 * @memberof module:py-logging-browserkit
	 * @constructor ImgHttpHandler
	 * @extends Handler
	 * @param {string} url
	 */
	function ImgHttpHandler(url) {
		logging.Handler.call(this);

		this._url = url;
	}
	util.inherits(ImgHttpHandler, logging.Handler);

	/**
	 * @constant
	 * @type {number}
	 */
	ImgHttpHandler.MAX_URL_LENGTH = 2048;

	/** @inheritdoc */
	ImgHttpHandler.prototype.emit = function(record) {
		try {
			var qs = this.format(record);
			var completeUrl = this._url + qs;

			if (completeUrl.length > ImgHttpHandler.MAX_URL_LENGTH) {
				throw new Error('URL length is longer than '
					+ ImgHttpHandler.MAX_URL_LENGTH);
			}

			(new Image()).src = completeUrl;
		}
		catch (err) {
			this.handleError(err, record);
		}
	};

	/**
	 * HTTP handler (default method POST).
	 *
	 * @memberof module:py-logging-browserkit
	 * @constructor HttpHandler
	 * @extends Handler
	 * @param {string} url
	 * @param {Object} [headers]
	 * @param {Object} [options]
	 */
	function HttpHandler(url, headers, options) {
		options = options || {};
		logging.Handler.call(this);

		var hdrs = {};
		if (headers && typeof headers === 'object') {
			hdrs = headers;
		}

		var method = options.method || 'POST';
		if (method !== 'GET' && method !== 'POST'
			&& method !== 'PUT' && method !== 'DELETE') {
			throw new Error('Invalid method "' + method + '".');
		}

		this._url = url || '';
		this._method = method;
		this._headers = hdrs;
		this._options = options;
	}
	util.inherits(HttpHandler, logging.Handler);

	/** @inheritdoc */
	HttpHandler.prototype.emit = function(record) {
		try {
			var data = this.format(record);

			send(this._method, this._url, data, this._headers, this._options);
		}
		catch (err) {
			this.handleError(err, record);
		}
	};

	/**
	 * WebSocket client.
	 *
	 * @memberof module:py-logging-browserkit
	 * @constructor WebSocketClient
	 * @param {string} [host]
	 * @param {number} [port]
	 * @param {Function} [decoder]
	 */
	function WebSocketClient(host, port, decoder) {
		host = host || '127.0.0.1';
		port = port || 9030;
		decoder = decoder || JSON.parse;
		logging.Handler.call(this);

		this._decoder = decoder;
		this._handler = null;
		this._socket = new WebSocket('ws://' + host + ':' + port + '/');
		this._socket.onmessage = this._handle.bind(this);
	}
	util.inherits(WebSocketClient, logging.Handler);

	/**
	 * Set the target handler for this handler.
	 *
	 * @param {Handler} target
	 */
	WebSocketClient.prototype.setTarget = function(target) {
		this._handler = target;
	};

	/** @inheritdoc */
	WebSocketClient.prototype._handle = function(message) {
		var record = this._decoder(message.data);

		if (this._handler) {
			this._handler.handle(record);
		}
	};


	logging.basicConfig = basicConfig;
	logging.ConsoleFormatter = ConsoleFormatter;
	logging.StylishConsoleFormatter = StylishConsoleFormatter;
	logging.ImgHttpHandler = ImgHttpHandler;
	logging.HttpHandler = HttpHandler;
	logging.WebSocketClient = WebSocketClient;
}


if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		install: install,
	};
} else if (typeof window !== 'undefined') {
	window.py_logging_browserkit = {
		install: install,
	};
} else {
	this.py_logging_browserkit = {
		install: install,
	};
}

}).call(this);
