function PluginLanguagesTemplates($name, $label, $language)
{
	var name = $name;
	var label = $label;
	var language = $language;

	this.templates = [];

	this.init = function()
	{
		if (!LANGUAGES_TEMPLATE[language])
			LANGUAGES_TEMPLATE[language] = { 'customTemplates': [] };

		console.log(LANGUAGES_TEMPLATE[language]);

		var root = { name: name, label: label, children: $this.templates };
		console.log(root);
		LANGUAGES_TEMPLATE[language]['customTemplates'].push(root);
		console.log(LANGUAGES_TEMPLATE[language]);
	};

	var $this = this;
}