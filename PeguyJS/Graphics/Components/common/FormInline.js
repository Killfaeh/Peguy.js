function FormInline($config, $listItem, $htmlGrid)
{
	////////////////
	// Attributes //
	////////////////

	var config = $config ? $config : [];
	var template = '';
	var parent = null;
	var padding = '0px';
	var display = 'none';

	if ($listItem === true)
	{
		padding = '25px';
		display = 'block';
	}

	var htmlGrid = $htmlGrid;

	var defaultGrid = '<div id="formInline" class="formInline" style="padding-right: ' + padding + ';" >'
							+ '<div id="inputs" class="inputs" ></div>'
							+ '<div id="remove-icon" class="remove-icon" style="display: ' + display + ';" ></div>'
						+ '</div>';
	
	var html = defaultGrid;

	if (htmlGrid)
		html = htmlGrid;

	var component = new Component(html);

	var removeIcon = Loader.getSVG('icons', 'close-icon', 17, 17);
	component.getById('remove-icon').appendChild(removeIcon);

	var template = '<div id="input" class="input" ></div>';

	//var template1Types = ["text", "number", "CheckBox", "Select", "ComboBox", "AutoComplete", "AutoCompleteKeyValue"];
	//var template2Types = ["textArea", "CodeEditor", "ListBox", "LabelList"];

	/*
// Style

component.addConfigStyle("formInline", function ()
{
	return {
		common:
		{
	"multi-tag": {}
},
		
		classic:
		{},
		
		mobile:
		{},
	};
});

component.applyConfigStyle();
	//*/

	var form = new Map();

	config.forEach(function($row)
	{
		var row = utils.clone($row);
		row.id = (new Date()).getTime() + "" + Math.round(Math.random()*1000);
		var type = row.type;
		var name = row.name;
		var label = row.label;
		var defaultValue = row.default;

		var componentHTML = template;

		/*
		if (template2Types.includes(type))
			componentHTML = template2;
		//*/

		/*
		if (type === "LabelList" || type === "ListBox")
			componentHTML = componentHTML + '<tr><td colspan="2" id="buttons" class="buttons" style="text-align: right;" ></td></tr>';
		//*/
			
		if (type === "LabelList")
			componentHTML = componentHTML + '<div id="buttons" class="buttons" ></div>';

		var rowComponent = new Component('<div>' + componentHTML + '</div>');
		//rowComponent.getById('label').innerHTML = label;

		if (type === "textArea")
		{
			if (defaultValue)
				row.input = new Component('<textarea placeholder="' + label + '" >' + defaultValue + '</textarea>');
			else
				row.input = new Component('<textarea placeholder="' + label + '" ></textarea>');
		}
		else if (type === "number")
		{
			if (defaultValue)
				row.input = new Component('<input type="number" placeholder="' + label + '" value="' + defaultValue + '" />');
			else
				row.input = new Component('<input type="number" placeholder="' + label + '" />');
		}
		else if (type === "CheckBox")
			row.input = new CheckBox(defaultValue, 25);
		else if (type === "Select")
			row.input = new Select(name, row.options, defaultValue);
		else if (type === "ComboBox")
		{
			row.input = new ComboBox(name, row.options, '', row.freeOption);

			if (defaultValue)
				row.input = new ComboBox(name, row.options, defaultValue, row.freeOption);
		}
		else if (type === "AutoComplete")
		{
			row.input = new AutoComplete();
			row.input.setList(row.options);

			if (defaultValue)
				row.input.setValue(defaultValue);
		}
		else if (type === "AutoCompleteKeyValue")
		{
			row.input = new AutoCompleteKeyValue();
			row.input.setList(row.options);

			if (defaultValue)
				row.input.setValue(defaultValue);
		}
		else if (type === "LabelList")
		{
			row.input = new LabelList();

			if (row.template)
				row.input.setTemplate(row.template);

			var addIcon = Loader.getSVG('icons', 'plus-icon', 25, 25);
			addIcon.row = row;
			rowComponent.getById('buttons').appendChild(addIcon);

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
		else
		{
			if (defaultValue)
				row.input = new Component('<input type="text" placeholder="' + label + '" value="' + defaultValue + '" />');
			else
				row.input = new Component('<input type="text" placeholder="' + label + '" />');
		}
		
		//row.input.style.display = 'inline-block';
		//row.input.style.position = 'relative';

		if (htmlGrid)
			component.getById(name).appendChild(row.input);
		else
		{
			rowComponent.getById("input").appendChild(row.input);

			row.row = rowComponent;

			while (rowComponent.firstChild)
				component.getById('inputs').appendChild(rowComponent.firstChild);
		}

		form.set(name, row);
	});

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
					/*
					else if (type === "CodeEditor")
						input.setCode($json[$name]);
					else if (type === "ListBox")
					{
						for (var i = 0; i < $json[$name].length; i++)
						{
							var item = new FormListItem($row.inputList);
							item.loadFromJSON($json[$name][i]);
							input.addElement(item);
						}
					}
					//*/
					else if (type === "LabelList")
					{
						for (var i = 0; i < $json[$name].length; i++)
							input.addLabel(new Label($json[$name][i]));
					}
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

			if (type === "LabelList")
				value = input.getCode();
			/*
			else if (type === "ListBox")
				value = input.getCode();
			//*/
			
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
			/*
			else if (type === "CodeEditor")
				value = input.getCode();
			else if (type === "ListBox")
				value = input.getJSON();
			//*/
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
			/*
			else if (type === "CodeEditor")
				input.setCode($value);
			else if (type === "ListBox")
			{
				for (var i = 0; i < $value.length; i++)
				{
					var item = new FormListItem(row.inputList);
					item.loadFromJSON($value[i]);
					input.addElement(item);
				}
			}
			//*/
			else if (type === "LabelList")
			{
				for (var i = 0; i < $value.length; i++)
					input.addLabel(new Label($value[i]));
			}
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