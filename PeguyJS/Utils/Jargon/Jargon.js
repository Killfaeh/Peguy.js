var JARGON =
{
	sources: new Map(),
	targets: new Map(),

	comboSources: [],
	comboTargets: [],

	convert: function($inputCode, $source, $target)
	{
		var outputCode = $inputCode;

		if ($source)
		{
			var jsonAST = $source.toAST($inputCode);
			console.log(jsonAST);

			if ($target)
			{
				outputCode = $target.toCode(jsonAST, '');
				console.log(outputCode);
			}
			else
				return jsonAST;
		}

		return outputCode;
	}
};