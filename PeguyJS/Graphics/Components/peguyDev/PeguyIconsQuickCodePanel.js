function PeguyIconsQuickCodePanel()
{
	///////////////
	// Attributs //
	///////////////

	var component = new Component('<div class="peguyIconsQuickCodePanel" >'
									+ '<div id="topPanel" class="topPanel" >'
									+ '</div>'
									+ '<div id="bottomPanel" class="panel bottomPanel" >'
									+ '</div>'
								+ '</div>');

	//// Champ de recherche ////

	var searchInput = new InputSearch('text', 'Search code');
	component.getById('topPanel').appendChild(searchInput);

	//// Liste des assets ////

	var codeListBox = new ListBox();
	component.getById('bottomPanel').appendChild(codeListBox);

	/*
// Style

component.addConfigStyle("peguyIconsQuickCodePanel", function ()
{
	return {
		common:
		{
	"multi-tag": {},
	"peguyIconsQuickCodePanel": {
		"backgroundColor": (function() { return STYLE.peguyIconsQuickCodePanelBackgroundColor; })()
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

	//////////////
	// Méthodes //
	//////////////

	var updateCodeList = function()
	{
		var searchCriteria = searchInput.getValue().toUpperCase();

		codeListBox.removeAllElement();
		var itemsToAdd = [];

		var iconsList = Loader.getAllSVG(20, 20);
		
		iconsList.forEach(function($icon)
		{
			var filename = $icon.getAttribute('file');
			var name = $icon.getAttribute('name');

			if (searchCriteria === '' || filename.toUpperCase().indexOf(searchCriteria) >= 0 || name.toUpperCase().indexOf(searchCriteria) >= 0)
			{
				var itemHTML = '<div class="codeRow" >'
									+ '<div id="preview" class="preview" >'
										+ '<strong id="copyJS" >{}</strong>'
										+ '<strong id="copyHTML" >&lt;/&gt;</strong>'
									+ '</div>'
									+ '<div>' + name + '</div>'
									+ '<div id="icon" class="icon" ></div>'
								+ '</div>';

				var item = new ListItem(itemHTML);
				item.getById('icon').appendChild($icon);

				item.getById('copyJS').code = 'var newIcon = new Icon("icons", "' + name + '", 20, 20);';
				item.getById('copyHTML').code = '<Icon fileName="icons" name="' + name + '" width="20" height="20" />';

				item.getById('copyJS').onClick = function($event) { Events.emit('onInsertCode', [this.code]); };
				item.getById('copyHTML').onClick = function($event) { Events.emit('onInsertCode', [this.code]); };

				//codeListBox.addElement(item);
				itemsToAdd.push(item);
			}
		});

		codeListBox.addElement(itemsToAdd);
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	//// Champ de recherche ////

	searchInput.onSearch = function($value) { updateCodeList(); };
	searchInput.onEmpty = function($value) { updateCodeList(); };

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET

	var $this = utils.extend(component, this);
	updateCodeList();
	return $this;
}