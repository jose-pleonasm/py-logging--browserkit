# py-logging-browserkit
Logging tool for browser platform (extension for [py-logging][1]).

Produces output like this (default):

![devTools](default.png)


Or (configured):

![devTools](configured.png)

## Usage
*Requires [py-logging][1] module ready for browser (with [Browserify][2] for example).*
```html
<script src="./build/py-logging.bundle.js"></script>
<script src="./build/browserkit.min.js"></script>
<script>
  py_logging_browserkit.install(logging);
  
  logging.info('Hello!');
</script>
```

## Sending records via HTTP
```javascript
var handler = new logging.HttpHandler(
	'http://localhost/server/',
	{ 'Content-Type': 'application/json' }
);
var formatter = new logging.JsonFormatter(); // py-logging/commonkit
var logger = logging.getLogger();

handler.setFormatter(formatter);
logger.addHandler(handler);

logger.error('Fatal error in main component.');
```

[1]: https://github.com/jose-pleonasm/py-logging
[2]: http://browserify.org/
