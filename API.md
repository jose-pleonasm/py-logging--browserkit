<a name="module_py-logging-browserkit"></a>

## py-logging-browserkit

* [py-logging-browserkit](#module_py-logging-browserkit)
    * [.ConsoleFormatter](#module_py-logging-browserkit.ConsoleFormatter) ⇐ <code>Formatter</code>
        * [new ConsoleFormatter([format], [timeFormat])](#new_module_py-logging-browserkit.ConsoleFormatter_new)
    * [.StylishConsoleFormatter](#module_py-logging-browserkit.StylishConsoleFormatter) ⇐ <code>ConsoleFormatter</code>
        * [new StylishConsoleFormatter([format], [timeFormat], [styles], [colors])](#new_module_py-logging-browserkit.StylishConsoleFormatter_new)
    * [.ImgHttpHandler](#module_py-logging-browserkit.ImgHttpHandler) ⇐ <code>Handler</code>
        * [new ImgHttpHandler(url)](#new_module_py-logging-browserkit.ImgHttpHandler_new)
    * [.HttpHandler](#module_py-logging-browserkit.HttpHandler) ⇐ <code>Handler</code>
        * [new HttpHandler(url, [headers], [options])](#new_module_py-logging-browserkit.HttpHandler_new)
    * [.basicConfig([options])](#module_py-logging-browserkit.basicConfig)

<a name="module_py-logging-browserkit.ConsoleFormatter"></a>

### py-logging-browserkit.ConsoleFormatter ⇐ <code>Formatter</code>
**Kind**: static class of [<code>py-logging-browserkit</code>](#module_py-logging-browserkit)  
**Extends**: <code>Formatter</code>  
<a name="new_module_py-logging-browserkit.ConsoleFormatter_new"></a>

#### new ConsoleFormatter([format], [timeFormat])

| Param | Type |
| --- | --- |
| [format] | <code>string</code> | 
| [timeFormat] | <code>string</code> | 

<a name="module_py-logging-browserkit.StylishConsoleFormatter"></a>

### py-logging-browserkit.StylishConsoleFormatter ⇐ <code>ConsoleFormatter</code>
**Kind**: static class of [<code>py-logging-browserkit</code>](#module_py-logging-browserkit)  
**Extends**: <code>ConsoleFormatter</code>  
<a name="new_module_py-logging-browserkit.StylishConsoleFormatter_new"></a>

#### new StylishConsoleFormatter([format], [timeFormat], [styles], [colors])

| Param | Type |
| --- | --- |
| [format] | <code>string</code> | 
| [timeFormat] | <code>string</code> | 
| [styles] | <code>Object</code> | 
| [colors] | <code>function</code> \| <code>Array.&lt;string&gt;</code> | 

<a name="module_py-logging-browserkit.ImgHttpHandler"></a>

### py-logging-browserkit.ImgHttpHandler ⇐ <code>Handler</code>
**Kind**: static class of [<code>py-logging-browserkit</code>](#module_py-logging-browserkit)  
**Extends**: <code>Handler</code>  
<a name="new_module_py-logging-browserkit.ImgHttpHandler_new"></a>

#### new ImgHttpHandler(url)
Simple HTTP handler (using Image API).


| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="module_py-logging-browserkit.HttpHandler"></a>

### py-logging-browserkit.HttpHandler ⇐ <code>Handler</code>
**Kind**: static class of [<code>py-logging-browserkit</code>](#module_py-logging-browserkit)  
**Extends**: <code>Handler</code>  
<a name="new_module_py-logging-browserkit.HttpHandler_new"></a>

#### new HttpHandler(url, [headers], [options])
HTTP handler (default method POST).


| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [headers] | <code>Object</code> | 
| [options] | <code>Object</code> | 

<a name="module_py-logging-browserkit.basicConfig"></a>

### py-logging-browserkit.basicConfig([options])
Do basic configuration for the logging system.

**Kind**: static method of [<code>py-logging-browserkit</code>](#module_py-logging-browserkit)  

| Param | Type |
| --- | --- |
| [options] | <code>Object</code> | 

