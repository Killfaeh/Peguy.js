function JargonTarget($name, $label, $type, $config, $startBlock, $endBlock)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var label = $label;
	var type = $type;
	var config = $config;
	var startBlock = $startBlock;
	var endBlock = $endBlock;

	if (!name)
		name = 'target';

	if (!label)
		label = 'Target';

	if (!type)
		type = 'javascript';

	if (!config)
		config = [];

	if (!startBlock)
		startBlock = '';

	if (!endBlock)
		endBlock = '';

	var map = new Map();

	//Exemple : 

	// { name: 'my-template', template: ' for (var {{INDEX_NAME}} += {{INDEX_INIT_VALUE}}; {{CONDITION}}; {{ACTION}})' }

	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		config.forEach(function($item) { map.set($item.name, $item.template); });
	};

	var add = function()
	{
		var target = { name: label, value: name, object: $this }
		JARGON.targets.set(name, target);
		JARGON.comboTargets.push(target);
	};

	var parseRow = function($row)
	{
		//console.log($row);
		var template = map.get($row.templateName);
		//console.log(template);

		if (template)
		{
			return Object.keys($row.variables).reduce(function($rowCode, $variableName)
			{
				var variable = $row.variables[$variableName];

				if (typeof variable === 'string')
					$rowCode = $rowCode.replaceAll('{{' + $variableName + '}}', variable);
				else
					$rowCode = $rowCode.replaceAll('{{' + $variableName + '}}', parseRow(variable));

				return $rowCode;
			}, template);
		}
		else
			return '';
	};

	var parseAST = function($jsonAST, $startTab)
	{
		var outputCode = '';

		return $jsonAST.reduce(function($code, $row)
		{
			var rowCode = parseRow($row.row);
			$code = $code + $startTab + rowCode + '\n';

			if ($row.children)
			{
				$code = $code + $startTab + startBlock + '\n';
				$code = $code + parseAST($row.children, $startTab + '	');
				$code = $code + $startTab + endBlock + '\n';
			}

			return $code;

		}, '');

		return outputCode;
	};

	this.toCode = function($jsonAST, $startTab)
	{
		var outputCode = parseAST($jsonAST, $startTab);
		return outputCode;
	}

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getName = function() { return name; };
	this.getType = function() { return type; };

	var $this = this;
	init();
	add();
}