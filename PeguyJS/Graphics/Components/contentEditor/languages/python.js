LANGUAGES_TEMPLATE['python'] = 
{
	'return': 'return {{VALUE}}{{CURSOR}}',
	'print': 'print({{VALUE}}{{CURSOR}})',
	'ternary': "{{VALUE}} if {{VALUE}} else ''{{CURSOR}}",

	'if': 'if {{0}}:\n\t{{CURSOR}}\n\tpass',
	'switch': 'match {{0}}:\n\t{{CURSOR}}\n\n\tcase _:\n\t\tpass',
	'case': 'case {{0}}:\n\t{{CURSOR}}\n\tpass',
	'for': 'for {{1}} in {{0}}:\n\t{{CURSOR}}\n\tpass',
	'while': 'while {{0}}:\n\t{{CURSOR}}\n\tpass',
	'do': 'while {{0}}:\n\t{{CURSOR}}\n\tpass',
	'function': 'def {{0}}({{1}}):\n\t{{CURSOR}}\n\tpass',
	'method': 'def {{0}}({{1}}):\n\t{{CURSOR}}\n\tpass',
	'privateMethod': 'def {{0}}({{1}}):\n\t{{CURSOR}}\n\tpass',
	'protectedMethod': 'def {{0}}({{1}}):\n\t{{CURSOR}}\n\tpass',
	'publicMethod': 'def {{0}}({{1}}):\n\t{{CURSOR}}\n\tpass',
	'class': 'class {{0}}():\n\n\tdef __init__({{1}}):\n\t\t{{CURSOR}}\n\t\tpass',

	'switchCase': function($strToParse)
	{
		var token = $strToParse.split(' ');
		var variable = token[0] ? token[0] : '';
		var caseStr = '';

		for (var i = 1; i < token.length; i++)
			caseStr = caseStr + '\n\tcase ' + token[i] + ':\n\t\t{{CURSOR}}\n\t\tpass\n';

		caseStr = caseStr + '\n\tcase _:\n\t\t{{CURSOR}}\n\t\tpass\n';

		return 'match ' + variable + ':\n' + caseStr;
	},

	'getterSetters': function($strToParse)
	{
		return 'def get' + $strToParse.firstCharToUpperCase() + '():\n\treturn self.' + $strToParse + '\n\n'
				+ 'def set' + $strToParse.firstCharToUpperCase() + '(' + $strToParse + '):\n'
				+ '\tself.' + $strToParse + ' = ' + $strToParse + '\n';
	},

	'getter': function($strToParse) { return 'def get' + $strToParse.firstCharToUpperCase() + '():\n\treturn self.' + $strToParse + '\n'; },
	'setter': function($strToParse) { return 'def set' + $strToParse.firstCharToUpperCase() + '(' + $strToParse + '):\n\tself.' + $strToParse + ' = ' + $strToParse + '\n'; },

	'customTemplates':
	[
		{
			name: 'module', label: 'Module',
			children:
			[
				{
					name: 'import', label: 'Import',
					template: 'import {{0}}'
				},
				{
					name: 'importFrom', label: 'Import from',
					template: 'from {{1}} import {{0}}'
				},
			]
		},
		{
			name: 'name', label: 'Name',
			template: function($strToParse) { return $strToParse; }
		},
	]
};