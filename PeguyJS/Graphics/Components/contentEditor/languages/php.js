LANGUAGES_TEMPLATE['php'] = 
{
	'return': 'return {{VALUE}}{{CURSOR}};',
	'print': 'error_log({{VALUE}}{{CURSOR}});',
	'ternary': "{{VALUE}} ? {{VALUE}} : ''{{CURSOR}}",

	'if': 'if (isset({{0}}))\n{\n\t{{CURSOR}}\n}',
	'switch': 'switch ({{0}})\n{\n\t{{CURSOR}}\n\n\tdefault:\n\t\tbreak;\n}',
	'case': 'case {{0}}:\n\t{{CURSOR}}\n\tbreak;',
	'for': 'for (var {{1}} = 0; {{1}} < count({{0}}); {{1}}++)\n{\n\t{{CURSOR}}\n}',
	'while': 'while (isset({{0}}))\n{\n\t{{CURSOR}}\n}',
	'do': 'do\n{\n\t{{CURSOR}}\n}\nwhile ({{0}})',
	'function': 'function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'method': 'public function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'privateMethod': 'private function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'protectedMethod': 'protected function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'publicMethod': 'public function {{0}}({{1}})\n{\n\t{{CURSOR}}\n}',
	'class': 'class {{0}}\n{\n\tpublic function __construct({{1}})\n\t{\n\t\t{{CURSOR}}\n\t}\n}',

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
		return 'public function get' + $strToParse.firstCharToUpperCase() + '() { return $this->' + $strToParse + '; }\n'
				+ 'public function set' + $strToParse.firstCharToUpperCase() + '($' + $strToParse + ') '
				+ '{ $this->' + $strToParse + ' = $' + $strToParse + '; }';
	},

	'getter': function($strToParse) { return 'public function get' + $strToParse.firstCharToUpperCase() + '() { return $this->' + $strToParse + '; }'; },
	'setter': function($strToParse) { return 'public function set' + $strToParse.firstCharToUpperCase() + '($' + $strToParse + ') { $this->' + $strToParse + ' = $' + $strToParse + '; }'; },

	'customTemplates':
	[
		
	]
};