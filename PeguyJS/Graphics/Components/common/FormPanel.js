function FormPanel($config, $listItem, $htmlGrid)
{
	////////////////
	// Attributes //
	////////////////

	var config = $config ? $config : [];
	var template = '';
	var parent = null;
	var display = 'none';

	if ($listItem === true)
		display = 'block';

	var htmlGrid = $htmlGrid;

	var template1 = '<tr>'
						+ '<td><strong id="label" class="label" >{{LABEL}}</strong></td>'
						+ '<td id="input" class="input" style="text-align: center;" >{{INPUT}}</td>'
					+ '</tr>';

	var template2 = '<tr>'
						+ '<td colspan="2"><strong id="label" class="label" >{{LABEL}}</strong></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td colspan="2" id="input" class="input" style="text-align: center;" >{{INPUT}}</td>'
					+ '</tr>';

	//var template1Types = ["text", "number", "CheckBox", "Select", "ComboBox", "AutoComplete", "AutoCompleteKeyValue"];
	var template2Types = ["textArea", "textarea", "CodeEditor", "ListBox", "LabelList"];

	var form = new Map();
	
	config.forEach(function($row)
	{
		var row = utils.clone($row);
		var name = row.name;
		
		if (htmlGrid)
			row.id = (new Date()).getTime() + "" + Math.round(Math.random()*1000);
		else
			row.id = name;
		
		form.set(name, row);
	});
	
	var defaultGrid = '<div id="formPanel" class="formPanel" >'
							+ '<div id="remove-icon" class="remove-icon" style="display: ' + display + ';position: absolute; right: 5px; top: 5px;" ></div>'
							+ '<table id="table" >'
								+ '<tr><td colspan="2" style="color: rgba(0, 0, 0, 0); font-size: 8px; " >Espace</td></tr>'
								+ '{{GRID CONTENT}}'
							+ '</table>'
						+ '</div>';
	
	var html = defaultGrid;

	if (htmlGrid)
		html = htmlGrid;
	else
	{
		var gridContent = config.reduce(function($code, $row)
		{
			var type = $row.type;
			var name = $row.name;
			var label = $row.label;
			var defaultValue = $row.default;
			
			var row = form.get(name);

			var componentHTML = template1;

			if (template2Types.includes(type))
				componentHTML = template2;
			
			componentHTML = componentHTML.replace('{{LABEL}}', label);
			
			if (type === "LabelList" || type === "ListBox")
			{
				componentHTML = componentHTML + '<tr><td colspan="2" id="buttons" class="buttons" style="text-align: right;" >'
													+ '<Icon id="' + row.id + '-addIcon" fileName="icons" name="plus-icon" width="30" height="30" ></Icon>'
												+ '</td></tr>';
			}
			
			if (type === "textArea" || type === "textarea")
			{
				if (defaultValue)
					componentHTML = componentHTML.replace('{{INPUT}}', '<textarea id="' + row.id + '" >' + defaultValue + '</textarea>');
				else
					componentHTML = componentHTML.replace('{{INPUT}}', '<textarea id="' + row.id + '" ></textarea>');
			}
			else if (type === "number")
			{
				if (defaultValue)
					componentHTML = componentHTML.replace('{{INPUT}}', '<input id="' + row.id + '" type="number" value="' + defaultValue + '" />');
				else
					componentHTML = componentHTML.replace('{{INPUT}}', '<input id="' + row.id + '" type="number" />');
			}
			else if (type === "CheckBox")
			{
				if (defaultValue)
					componentHTML = componentHTML.replace('{{INPUT}}', '<CheckBox id="' + row.id + '" checked="' + defaultValue + '" size="25" ></CheckBox>');
				else
					componentHTML = componentHTML.replace('{{INPUT}}', '<CheckBox id="' + row.id + '" size="25" ></CheckBox>');
			}
			else if (type === "Select")
			{
				if (defaultValue)
					componentHTML = componentHTML.replace('{{INPUT}}', '<Select id="' + row.id + '" name="' + name + '" currentValue="' + defaultValue + '" ></Select>');
				else
					componentHTML = componentHTML.replace('{{INPUT}}', '<Select id="' + row.id + '" name="' + name + '" ></Select>');
			}
			else if (type === "ComboBox")
			{
				if (defaultValue)
					componentHTML = componentHTML.replace('{{INPUT}}', '<ComboBox id="' + row.id + '" name="' + name + '" currentValue="' + defaultValue + '" freeOption="' + row.freeOption + '" ></ComboBox>');
				else
					componentHTML = componentHTML.replace('{{INPUT}}', '<ComboBox id="' + row.id + '" name="' + name + '" freeOption="' + row.freeOption + '" ></ComboBox>');
			}
			else if (type === "AutoComplete")
				componentHTML = componentHTML.replace('{{INPUT}}', '<AutoComplete id="' + row.id + '" ></AutoComplete>');
			else if (type === "AutoCompleteKeyValue")
				componentHTML = componentHTML.replace('{{INPUT}}', '<AutoCompleteKeyValue id="' + row.id + '" ></AutoCompleteKeyValue>');
			else if (type === "CodeEditor")
				componentHTML = componentHTML.replace('{{INPUT}}', '<CodeEditor id="' + row.id + '" language="' + row.language + '" ></CodeEditor>');
			else if (type === "ListBox")
				componentHTML = componentHTML.replace('{{INPUT}}', '<ListBox id="' + row.id + '" ></ListBox>');
			else if (type === "LabelList")
				componentHTML = componentHTML.replace('{{INPUT}}', '<LabelList id="' + row.id + '" ></LabelList>');
			else
			{
				if (defaultValue)
					componentHTML = componentHTML.replace('{{INPUT}}', '<input id="' + row.id + '" type="text" value="' + defaultValue + '" />');
				else
					componentHTML = componentHTML.replace('{{INPUT}}', '<input id="' + row.id + '" type="text" />');
			}
			
			return $code + componentHTML;
			
		}, '');
		
		html = html.replace('{{GRID CONTENT}}', gridContent);
	}

	var component = new Component(html);

	var removeIcon = Loader.getSVG('icons', 'close-icon', 20, 20);
	component.getById('remove-icon').appendChild(removeIcon);
	
	config.forEach(function($row)
	{
		var type = $row.type;
		var name = $row.name;
		var label = $row.label;
		var defaultValue = $row.default;
			
		var row = form.get(name);
		
		row.input = component.getById(row.id);
		
		if (type === "Select")
		{
			row.input.setOptions(row.options);
			
			if (defaultValue)
				row.input.setCurrentValue(defaultValue);
		}
		else if (type === "ComboBox")
		{
			row.input.setOptions(row.options);
			
			if (defaultValue)
				row.input.setCurrentValue(defaultValue);
		}
		else if (type === "AutoComplete")
		{
			row.input.setList(row.options);

			if (defaultValue)
				row.input.setValue(defaultValue);
		}
		else if (type === "AutoCompleteKeyValue")
		{
			row.input.setList(row.options);

			if (defaultValue)
				row.input.setValue(defaultValue);
		}
		else if (type === "CodeEditor" && defaultValue)
			row.input.setCode(defaultValue);
		else if (type === "ListBox")
		{
			if (row.template)
				row.input.setTemplate(row.template);

			var addIcon = component.getById(row.id + '-addIcon');
			addIcon.row = row;
			addIcon.onClick = function() { this.row.input.addElement(new FormListItem(this.row.inputList)); };
		}
		else if (type === "LabelList")
		{
			if (row.template)
				row.input.setTemplate(row.template);

			var addIcon = component.getById(row.id + '-addIcon');
			addIcon.row = row;

			addIcon.onClick = function()
			{
				var popupHTML = '<h3>Add New label</h3>'
								+ '<p>'
									+ '<input id="label-name" type="text" placeholder="Label name" />'
								+ '</p>';

				var addPopup = new ConfirmPopup(popupHTML);
				addPopup.row = this.row;

				addPopup.onOk = function()
				{
					var ok = false;
					var labelName = this.getById('label-name').value;

					if (utils.isset(labelName) && labelName !== "")
					{
						var newLabel = new Label(labelName);
						this.row.input.addLabel(newLabel);
						ok = true;
					}
					else
					{
						ok = false;
						var infoPopup = new InfoPopup('<p>The name can\'t be empty.</p>');
						document.getElementById('main').appendChild(infoPopup);
					}

					return ok;
				};

				document.getElementById('main').appendChild(addPopup);
			};
		}
	});

	/*
// Style

component.addConfigStyle("formPanel", function ()
{
	return {
		common:
		{
	"multi-tag": {
		".formPanel tr:hover": [
			"background-Color: (function() { return STYLE.formPanelBackgroundColor; })()
		]
	},
	"listBox": {
		"border": (function() { return STYLE.formPanelBorder; })()
	},
	"codeEditor": {
		"border": (function() { return STYLE.formPanelBorder; })(),
		"backgroundColor": (function() { return STYLE.formPanelBackgroundColor; })()
	}
},
		
		classic:
		{},
		
		mobile:
		{},
	};
});

component.applyConfigStyle();
	//*/

	/////////////
	// Methods //
	/////////////

	this.loadFromJSON = function($json)
	{
		if (utils.isset($json))
		{
			form.forEach(function($row, $name)
			{
				var type = $row.type;
				var input = $row.input;

				if ($json[$name])
				{
					if (type === "CheckBox")
						input.setChecked($json[$name]);
					else if (type === "Select")
						input.setCurrentValue($json[$name]);
					else if (type === "ComboBox")
						input.setCurrentValue($json[$name]);
					else if (type === "AutoComplete")
						input.setValue($json[$name]);
					else if (type === "AutoCompleteKeyValue")
						input.setValue($json[$name]);
					else if (type === "CodeEditor")
						input.setCode($json[$name]);
					else if (type === "ListBox")
					{
						input.removeAllElement();

						var itemsToAdd = $json[$name].map(function($item)
						{
							var item = new FormListItem($row.inputList);
							item.loadFromJSON($item);
							return item;
						});

						input.addElement(itemsToAdd);
					}
					else if (type === "LabelList")
						input.loadFromJSON($json[$name]);
					else
						input.value = $json[$name];
				}

			}, null);
		}
	};

	this.generateComponentCode = function()
	{
		var code = '';

		// ...

		return code;
	};
	
	// A peaufiner
	this.createFromTemplate = function($template)
	{
		var jsonData = $this.getJSON();
		
		return Object.keys(jsonData).reduce(function($str, $key)
		{
			return $str.replaceAll('{{' + $key.toUpperCase() + '}}', jsonData[$key]);
		}, $template);
	};

	/////////////////
	// Init events //
	/////////////////

	removeIcon.onClick = function()
	{
		var itemParent = $this.getParent();

		if (itemParent)
		{
			const removePopup = new ConfirmPopup('<p>Are you sure you want to remove this item?</p>');

			removePopup.onOk = function()
			{
				itemParent.removeElement($this.parentNode.parentNode);
				return true;
			};

			document.getElementById('main').appendChild(removePopup);
		}
	};

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getJSON = function()
	{
		const json = {};
		form.forEach(function($row, $name) { json[$name] = $this.get($name); }, null);
		return json;
	};

	this.getCode = function()
	{
		var code = template;

		form.forEach(function($row, $name)
		{
			var type = $row.type;
			var input = $row.input;
			var value = $this.get($name);

			if (type === "ListBox")
				value = input.getCode();
			else if (type === "LabelList")
				value = input.getCode();
			
			if ($row.templateVariable && $row.templateVariable !== '')
				code = code.replaceAll('{{' + $row.templateVariable + '}}', value);

		}, null);

		return code;
	};

	this.get = function($name)
	{
		var value = null;

		if (form.has($name))
		{
			var row = form.get($name);
			var type = row.type;
			var input = row.input;
			
			if (type === "CheckBox")
				value = input.isChecked();
			else if (type === "Select")
				value = input.getCurrentValue();
			else if (type === "ComboBox")
				value = input.getCurrentValue();
			else if (type === "AutoComplete")
				value = input.getValue();
			else if (type === "AutoCompleteKeyValue")
				value = input.getValue();
			else if (type === "CodeEditor")
				value = input.getCode();
			else if (type === "ListBox")
				value = input.getJSON();
			else if (type === "LabelList")
				value = input.getJSON();
			else if (type === "number")
				value = parseFloat(input.value);
			else
				value = input.value;
		}

		return value;
	};

	this.getParent = function() { return parent; };

	// SET

	this.setTemplate = function($template) { template = $template; };

	this.set = function($name, $value)
	{
		if (form.has($name))
		{
			var row = form.get($name);
			var type = row.type;
			var input = row.input;
			
			if (type === "CheckBox")
				input.setChecked($value);
			else if (type === "Select")
				input.setCurrentValue($value);
			else if (type === "ComboBox")
				input.setCurrentValue($value);
			else if (type === "AutoComplete")
				input.setValue($value);
			else if (type === "AutoCompleteKeyValue")
				input.setValue($value);
			else if (type === "CodeEditor")
				input.setCode($value);
			else if (type === "ListBox")
			{
				input.removeAllElement();

				var itemsToAdd = $json[$name].map(function($item)
				{
					var item = new FormListItem(row.inputList);
					item.loadFromJSON($item);
					return item;
				});

				input.addElement(itemsToAdd);
			}
			else if (type === "LabelList")
				input.loadFromJSON($value);
			else
				input.value = $value;
		}
	};

	this.setParent = function($parent) { parent = $parent; };
	
	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}