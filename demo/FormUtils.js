
function FormRenderer() {
	this._logger = logging.getLogger('FormRenderer');
	this._form = document.createElement('form');
}

FormRenderer.prototype.renderInput = function(name, type, value) {
	value = value || '';
	this._logger.debug('rendering input with attributes', null, { args: [name, type, value] });

	var input = document.createElement('input');
	input.name = name;
	input.type = type;
	input.value = value;
	this._form.appendChild(input);

	return input;
};

FormRenderer.prototype.getElement = function() {
	return this._form;
};


function FormController(element) {
	this._logger = logging.getLogger('FormController');
	this._form = element;

	element.addEventListener('submit', this._onSubmit.bind(this));
}

FormController.prototype._onSubmit = function(event) {
	event.preventDefault();

	this._logger.info('Form submitted.');
};
