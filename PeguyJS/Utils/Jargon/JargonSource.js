function JargonSource($name, $label, $config)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var label = $label;
	var config = $config;

	if (!name)
		name = 'source';

	if (!label)
		label = 'Source';

	if (!config)
		config = [];

	var map = new Map();
	var regexList = [];

	//Exemple : 

	//[
	//	{
	//		name: 'my-template', 
	// 		templates:
	// 		[
	//			' *for +( *var +{{INDEX_NAME}} += +{{INDEX_INIT_VALUE}}; +{{CONDITION}}; +{{ACTION}} *) *',
	// 		],
	//		variables:
	//		{
	//			'INDEX_NAME': { regex: '[a-zA-Z0-9]+', expression: false },
	//			'INDEX_INIT_VALUE': { regex: '[a-zA-Z0-9]+', expression: false },
	//			'CONDITION': { regex: '.+', expression: true },
	//		}
	//	},
	//]

	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		config.forEach(function($item)
		{
			var template = { name: $item.name, variables: $item.variables };
			var declaredVariables = $item.variables;

			$item.templates.forEach(function($template)
			{
				var variablesList = [];
				var variablesConfig = {};
				var strRegex = $template;

				var matchVariables = $template.match(/{{([a-zA-Z0-9_ ]+)}}/g);

				if (matchVariables)
				{
					for (var i = 0; i < matchVariables.length; i++)
					{
						var variableName = matchVariables[i].replace('{{', '').replace('}}', '');
						variablesList.push(variableName);
						var variable = { regex: '.+', expression: true };

						if (declaredVariables[variableName])
						{
							variable.regex = declaredVariables[variableName].regex;
							variable.expression = declaredVariables[variableName].expression;
						}
						else
							template.variables[variableName] = variable;

						strRegex = strRegex.replaceAll(matchVariables[i], '(' + variable.regex + ')');
					}
				}

				var regex = new RegExp(strRegex);
				var regexConfig = { templateName: $item.name, regex: regex, variables: variablesList };
				regexList.push(regexConfig);
			});
			
			map.set($item.name, template);
		});
	};

	var add = function()
	{
		var source = { name: label, value: name, object: $this }
		JARGON.sources.set(name, source);
		JARGON.comboSources.push(source);
	};

	var parseRow = function($row)
	{
		var jsonAST = {};
		var row = $row.replace(/^	*/, '').trim();
		var template = null;
		var variableList = [];
		var regex = null;

		// Récupérer le template
		regexList.every(function($regex)
		{
			if ($regex.regex.test(row))
			{
				regex = $regex.regex;
				variableList = $regex.variables;
				template = map.get($regex.templateName);
				return false;
			}

			return true;
		});

		// Récupérer les valeurs des variables
		var variablesValues = {};

		if (template && regex)
		{
			var matchVariables = row.match(regex);

			if (matchVariables)
			{
				variableList.forEach(function($variable, $i)
				{
					var value = matchVariables[$i+1];

					if (template.variables[$variable].expression)
						value = parseRow(value);

					variablesValues[$variable] = value;
				});
			}
		}

		if (template)
			jsonAST = { templateName: template.name, variables: variablesValues };
		else
			return $row;

		return jsonAST;
	};

	var parseList = function($list)
	{
		var jsonAST = [];

		if ($list.length > 0)
		{
			var startCountTab = $list[0].replace(/^(	*)[^	]*/, '$1').length;

			var tmpData = [];
			var row = { row: "", children: [] };

			$list.forEach(function($item)
			{
				const countTab = $item.replace(/^(	*)[^	]*/, '$1').length;
				
				if (countTab === startCountTab)
				{
					row = { row: $item.replace(/^(	*)/, '').trim(), children: [] };
					tmpData.push(row);
				}
				else if (countTab > startCountTab)
					row.children.push($item);
			});

			jsonAST = tmpData.map(function($item)
			{
				let output = { row: parseRow($item.row) };

				if ($item.children.length > 0)
					output.children = parseList($item.children);

				return output;
			});
		}

		return jsonAST;
	};

	this.toAST = function($inputCode)
	{
		var jsonAST = [];

		var inputCode = $inputCode.toLowerCase().removeAccents();
		var rowList = $inputCode.split('\n');
		jsonAST = parseList(rowList);

		return jsonAST;
	};

	var $this = this;
	init();
	add();
}