STYLE.applyGlobalStyle = function($tagName, $instructions)
{
	var styleTagId = $tagName + '-style-tag';
	var styleTag = document.getElementById(styleTagId);

	if (!styleTag)
	{
		styleTag = document.createElement('style');
		var heads = document.getElementsByTagName('head');

		if (heads && heads[0])
			heads[0].appendChild(styleTag);
	}

	var str = '';

	Object.keys($instructions).forEach(function($key)
	{
		var instructionsStr = '';

		$instructions[$key].forEach(function($instruction)
		{
			instructionsStr = instructionsStr + '	' + $instruction + ';\n';
		});

		str = str + $key + '\n{\n' + instructionsStr + '}\n\n';
	});

	styleTag.innerHTML = str;
};

STYLE.init = function()
{
	var instructions =
	{
		'body':
		[
			'background-color: ' + STYLE.backgroundColor,
			'color: ' + STYLE.textColor,
			'font-family: Arial',
		],

		'input[type="text"], input[type="password"], input[type="time"], input[type="email"], input[type="tel"], input[type="number"], textarea':
		[
			'border: 1px solid ' + STYLE.inputBorderColor,
			'background-color: ' + STYLE.inputBackgroundColor,
			'color: ' + STYLE.inputTextColor,
		],

		'input[type="text"]:focus, input[type="password"]:focus, input[type="time"]:focus, input[type="email"]:focus, input[type="tel"]:focus, input[type="number"]:focus, textarea:focus':
		[
			'border: 1px solid ' + STYLE.inputFocusBorderColor,
		],

		'input::placeholder':
		[
			'color: ' + STYLE.inputTextColor,
		],

		'input[type="button"]':
		[
			'color: '+ STYLE.buttonsTextColor,
			'font-weight: '+ STYLE.buttonsFontWeight,
			'background-color: ' + STYLE.buttonsBackgroundColor,
			'border: ' + STYLE.buttonsBorder,
			'border-radius: ' + STYLE.buttonsBorderRadius,
		],

		'input[type="button"][disabled="true"]':
		[
			'color: '+ STYLE.disabledButtonsTextColor,
			'background-color: ' + STYLE.disabledButtonsBackgroundColor,
			'border: ' + STYLE.disabledButtonsBorder,
		],

		'a': ['color: ' + STYLE.linkColor],
	};

	STYLE.applyGlobalStyle('init', instructions);
};

function Style($instructions)
{
	var instructions = {};

	if ($instructions)
		instructions = utils.clone($instructions);

	this.get = function($name) { return instructions[$name]; };

	this.set = function($name, $value)
	{
		if ($value)
			instructions[$name] = $value;

		return $this;
	};

	this.absolute = function($left, $right, $top, $bottom)
	{
		instructions.position = 'absolute';
		$this.set('left', $left);
		$this.set('right', $right);
		$this.set('top', $top);
		$this.set('bottom', $bottom);
		return $this;
	};

	this.padding = function($left, $right, $top, $bottom)
	{
		$this.set('paddingLeft', $left);
		$this.set('paddingRight', $right);
		$this.set('paddingTop', $top);
		$this.set('paddingBottom', $bottom);
		return $this;
	};

	this.margin = function($left, $right, $top, $bottom)
	{
		$this.set('marginLeft', $left);
		$this.set('marginRight', $right);
		$this.set('marginTop', $top);
		$this.set('marginBottom', $bottom);
		return $this;
	};

	this.boxShadow = function($x, $y, $radius, $color, $inset)
	{
		$this.set('boxShadow', $x + ' ' + $y + ' ' + $radius + ' ' + $color + ($inset ? ' inset' : ''));
		return $this;
	};

	this.getInstructions = function() { return instructions; };

	var $this = this;
	return $this;
}