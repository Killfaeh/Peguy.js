function DropFilesZone($accept)
{
	////////////////
	// Attributes //
	////////////////
	
	var accept = $accept ? $accept : [];
	var multiSelect = true;
	
	var html = '<div id="dropFilesZone" class="dropFilesZone" >'
					+ '<div id="background" class="background" >'
						+ '<p id="message" class="message" >' + KEYWORDS.dropFilesInThisArea  + '<br /><br /></p>'
						+ '<div class="wall" ></div>'
					+ '</div>'
					+ '<ul id="filesList" class="filesList" ></ul>'
				+ '</div>';

	var component = new ListComponent(html);
	component.setNode(component.getById('filesList'));
	
	/*
// Style

component.addConfigStyle("dropFilesZone", function ()
{
	return {
		common:
		{
	"multi-tag": {
		".dropFilesZone ul li img": [
			"border: (function() { return STYLE.dropFilesZoneBorder; })(),
			"box-Shadow: (function() { return STYLE.dropFilesZoneBoxShadow; })()
		],
		".dropFilesZone ul .selected img": [
			"background-Color: (function() { return STYLE.dropFilesZoneBackgroundColor; })()
		]
	},
	"background": {
		"border": (function() { return STYLE.dropFilesZoneBorder; })(),
		"backgroundColor": (function() { return STYLE.dropFilesZoneBackgroundColor; })()
	},
	"selected": {
		"border": (function() { return STYLE.dropFilesZoneBorder; })(),
		"backgroundColor": (function() { return STYLE.dropFilesZoneBackgroundColor; })()
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

	var uploadIcon = Loader.getSVG('icons', 'upload-icon', 300, 300);
	component.getById('message').appendChild(uploadIcon);

	/////////////
	// Methods //
	/////////////

	this.addPreview = function($preview)
	{
		var list = $this.addToList($preview);
		component.getById('background').style.display = 'none';
		onSelectFiles();
		return list;
	};

	this.insertPreviewInto = function($preview, $index)
	{
		var list = $this.insertElementInto($preview, $index);
		component.getById('background').style.display = 'none';
		onSelectFiles();
		return list;
	};

	this.removePreview = function($preview)
	{
		var list = $this.removeFromList($preview);

		if (component.getList().length > 0)
			component.getById('background').style.display = 'none';
		else
			component.getById('background').style.display = 'block';
		
		onSelectFiles();

		return list;
	};

	this.removeAllPreview = function()
	{
		var list = $this.removeAllFromList();
		component.getById('background').style.display = 'block';
		onSelectFiles();
		return list;
	};

	this.unselectAll = function()
	{
		component.execAll([ 'unselect' ]);
		onSelectFiles();
	};
	
	var confirmDeleteOneFile = function($preview)
	{
		var confirmPopup = new ConfirmPopup('<div>'
												+ '<p>' + KEYWORDS.areYouSureYouWantToRemoveThisFileFromTheList + '</p>'
											+ '</div>', true);
		
		confirmPopup.onOk = function() 
		{
			$this.removePreview($preview);
			$this.onRemoveFiles([$preview]);
			onSelectFiles();
			return true;
		};
		
		document.getElementById('main').appendChild(confirmPopup);
	};

	this.removeSelectedFiles = function()
	{
		var selectedFiles = component.getList().filter(function($preview) { return $preview.isSelected(); });

		if (selectedFiles.length > 0)
		{
			var confirmPopup = new ConfirmPopup('<div>'
													+ '<p>' + KEYWORDS.areYouSureYouWantToRemoveSelectedFilesFromTheList + '</p>'
												+ '</div>', true);
			
			confirmPopup.onOk = function() 
			{
				$this.removePreview(selectedFiles);
				$this.onRemoveFiles(selectedFiles);
				onSelectFiles();
				return true;
			};
			
			document.getElementById('main').appendChild(confirmPopup);
		}
	};

	var onDropFiles = function($event)
	{
		console.log("Execute onDropFiles...");
		Files.accept = accept;
		Files.drop($event, function($files) { $this.addFiles($files); });
	};
	
	this.addFiles = function($files)
	{
		$this.unselectAll();
		var newPreviews = $files.map(function($file) { return new FilePreview($file.name, $file.type, $file.data); });
		$this.addPreview(newPreviews);
		newPreviews.forEach(function($preview) { $preview.select(); });
		$this.onAddFiles(newPreviews);
		onSelectFiles();
	};
	
	//// Générateurs d'aperçu ////
	
	this.createDefaultPreview = function($preview)
	{
		
	};
	
	this.createTextPreview = function($preview)
	{
		
	};
	
	this.createImagePreview = function($preview)
	{
		$preview.getPreview().src = $preview.getFileData();
	};
	
	this.createPDFpreview = function($preview)
	{
		
	};

	/////////////////
	// Init events //
	/////////////////

	this.initElementEvents = function($preview)
	{
		$preview.onSelect = function()
		{
			if (multiSelect !== true)
				$this.unselectAll();
			
			setTimeout(function() { onSelectFiles(); }, 50);
		};
		
		$preview.onUnselect = function() { onSelectFiles(); };
		$preview.onDelete = function($preview2) { confirmDeleteOneFile($preview2); };

		$preview.createDefaultPreview = function($preview2) { $this.createDefaultPreview($preview2); };
		$preview.createTextPreview = function($preview2) { $this.createTextPreview($preview2); };
		$preview.createImagePreview = function($preview2) { $this.createImagePreview($preview2); };
		$preview.createPDFpreview = function($preview2) { $this.createPDFpreview($preview2); };
		$preview.updatePreview();
	};

	this.removeElementEvents = function($preview)
	{
		$preview.onSelect = function() {};
		$preview.onUnselect = function() {};
		$preview.onDelete = function() {};
		$preview.createDefaultPreview = function() {};
		$preview.createTextPreview = function() {};
		$preview.createImagePreview = function() {};
		$preview.createPDFpreview = function() {};
	};
	
	this.onAddFiles = function($filesList) {};
	this.onRemoveFiles = function($filesList) {};
	this.onSelectFiles = function($fileList) {};
	
	var onSelectFiles = function()
	{
		var selectedFiles = component.getList().filter(function($preview) { return $preview.isSelected(); });
		$this.onSelectFiles(selectedFiles);
	};
	
	component.onClick = function() { $this.unselectAll(); };
	
	component.onDrop = function($event) { Events.emit('onDropFiles', [$event]); };
	
	component.connect('onDropFiles', onDropFiles);

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.isMultiSelect = function() { return multiSelect; };
	this.getPreview = function() { return preview; };

	// SET
	
	this.setMultiSelect = function($multiSelect) { multiSelect = $multiSelect; };

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}