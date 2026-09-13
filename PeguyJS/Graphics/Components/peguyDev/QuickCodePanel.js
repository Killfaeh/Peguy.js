function QuickCodePanel($name, $codeList)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var codeList = $codeList;

	if (!utils.isset(codeList))
		codeList = [];

	var component = new Component('<div class="quickCodePanel" >'
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

component.addConfigStyle("quickCodePanel", function ()
{
	return {
		common:
		{
	"multi-tag": {},
	"quickCodePanel": {
		"backgroundColor": (function() { return STYLE.quickCodePanelBackgroundColor; })()
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

		for (var i = 0; i < codeList.length; i++)
		{
			if (searchCriteria === '' || codeList[i].label.toUpperCase().indexOf(searchCriteria) >= 0 
				|| codeList[i].keywords.toUpperCase().indexOf(searchCriteria) >= 0 
				|| codeList[i].code.toUpperCase().indexOf(searchCriteria) >= 0)
			{
				var itemHTML = '<div class="codeRow" >'
									+ '<div id="preview" class="preview" ></div>'
									+ '<div>' + codeList[i].label + '</div>'
								+ '</div>';

				var item = new ListItem(itemHTML);

				var copyIcon = Loader.getSVG('icons', 'copy-paste-icon', 20, 20);
				item.getById('preview').appendChild(copyIcon);

				item.code = codeList[i].code;
				copyIcon.code = codeList[i].code;

				item.onDblClick = function($event) { Events.emit('onInsertCode', [this.code]); };
				copyIcon.onClick = function($event) { Events.emit('onInsertCode', [this.code]); };

				itemsToAdd.push(item);
			}
		}

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