function FormListItem($config)
{
	////////////////
	// Attributes //
	////////////////

	var item = new ListItem('');
	item.style.padding = '2px';
	var formPanel = new FormPanel($config, true);
	item.getById('list-label').appendChild(formPanel);

	/*
{{INSERT CODE}}
	//*/

	/////////////
	// Methods //
	/////////////

	this.loadFromJSON = function($json) { return formPanel.loadFromJSON($json); };
	this.generateComponentCode = function($json) { return formPanel.generateComponentCode($json); };

	/////////////////
	// Init events //
	/////////////////

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getJSON = function() { return formPanel.getJSON(); };
	this.getCode = function() { return formPanel.getCode(); };
	this.get = function($name) { return formPanel.get($name); };

	// SET

	this.setTemplate = function($template) { formPanel.setTemplate($template); };
	this.set = function($name, $value) { return formPanel.set($name, $value); };

	////////////
	// Extend //
	////////////

	var $this = utils.extend(item, this);
	$this.getParent = formPanel.getParent;
	$this.setParent = formPanel.setParent;
	return $this;
}