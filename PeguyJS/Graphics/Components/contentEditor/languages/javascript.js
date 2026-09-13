LANGUAGES_TEMPLATE['javascript'] = 
{
	'return': 'return {{VALUE}}{{CURSOR}};',
	'print': 'console.log({{VALUE}}{{CURSOR}});',
	'ternary': "{{VALUE}} ? {{VALUE}} : ''{{CURSOR}}",

	'if': 'if ({{0}})\n{\n\t{{CURSOR}}\n}',
	'switch': 'switch ({{0}})\n{\n\t{{CURSOR}}\n\n\tdefault:\n\t\tbreak;\n}',
	'case': 'case {{0}}:\n\t{{CURSOR}}\n\tbreak;',
	'for': 'for (var {{1}} = 0; {{1}} < {{0}}.length; {{1}}++)\n{\n\t{{CURSOR}}\n}',
	'while': 'while ({{0}})\n{\n\t{{CURSOR}}\n}',
	'do': 'do\n{\n\t{{CURSOR}}\n}\nwhile ({{0}})',
	'function': 'function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'method': 'function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'privateMethod': 'function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'protectedMethod': 'function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'publicMethod': 'function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'class': 'class {{0}}\n{\n\tconstructor({{1}})\n\t{\n\t\t{{CURSOR}}\n\t}\n}',

	'switchCase': function($strToParse)
	{
		var token = $strToParse.split(' ');
		var variable = token[0] ? token[0] : '';
		var caseStr = '';

		for (var i = 1; i < token.length; i++)
			caseStr = caseStr + '\n\tcase ' + token[i] + ':\n\t\t{{CURSOR}}\n\t\tbreak;\n';

		caseStr = caseStr + '\n\tdefault:\n\t\t{{CURSOR}}\n\t\tbreak;\n';

		return 'switch (' + variable + ')\n{' + caseStr + '}';
	},

	'getterSetters': function($strToParse)
	{
		return 'get ' + $strToParse + '() { return this.' + $strToParse + '; }\n'
				+ 'set ' + $strToParse + '(' + $strToParse + ') '
				+ '{ this.' + $strToParse + ' = ' + $strToParse + '; }';
	},

	'getter': function($strToParse) { return 'get ' + $strToParse + '() { return this.' + $strToParse + '; }'; },
	'setter': function($strToParse) { return 'set ' + $strToParse + '(' + $strToParse + ') { this.' + $strToParse + ' = ' + $strToParse + '; }'; },

	'customTemplates':
	[
		{
			name: 'varFunc', label: 'Create function as const',
			template: 'const {{0}} = function({{1}})\n{\n\t{{CURSOR}}\n};'
		},
		{
			name: 'module', label: 'Module',
			children:
			[
				{
					name: 'export', label: 'Export',
					template: 'export {{0}};'
				},
				{
					name: 'exportDefault', label: 'Export default',
					template: 'export default {{0}};'
				},
				{
					name: 'importFrom', label: 'Import from',
					template: 'import {{0}} from {{1}};'
				},
			]
		},
		{
			name: 'name', label: 'Name',
			template: function($strToParse) { return $strToParse; }
		},
	]
};