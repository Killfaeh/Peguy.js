function ConfirmPopup($content, $yesNo)
{
	///////////////
	// Attributs //
	///////////////
	
	// Structure du composant

	var content = $content;
	var yesNo = $yesNo;
	
	var html = '<div id="confirmBlock" class="confirmBlock" >'
					+ '<div id="confirmContent" class="confirmContent" >' + content + '</div>'
					+ '<div id="confirmButtons" class="confirmButtons" >'
						+ '<input type="button" id="cancel" class="cancel" value="' + KEYWORDS.cancel + '" />'
						+ '<input type="button" id="ok" class="ok" value="' + KEYWORDS.ok + '" />'
					+ '</div>'
				+ '</div>';
	
	var popup = new Popup(html);
	
	/*
{{INSERT CODE}}
	//*/

	if (yesNo === true)
	{
		popup.getById('cancel').value = KEYWORDS.no;
		popup.getById('ok').value = KEYWORDS.yes;
	}
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onCancel = function() {};
	this.onOk = function() { return true; };

	var onCancel = function()
	{
		$this.onCancel();
		$this.hide();
	};

	var onOk = function()
	{
		var isOk = $this.onOk();
		
		if (isOk === true)
			$this.hide();
	};
	
	popup.getById('closeIcon').onClick = function() { onCancel(); };
	popup.getById("cancel").onClick = function() { onCancel(); };
	popup.getById("ok").onClick = function() { onOk(); };

	popup.onKeyDown = function($event)
	{
		//if ($this === Components.getFrontPopup())
		{
			if ($event.keyCode === 13)
			{
				onOk();
				return true;
			}
			else if ($event.keyCode === 27)
			{
				onCancel();
				return true;
			}
		}

		return false;
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getContent = function() { return content; };
	
	// SET
	
	this.setCancelLabel = function($cancelLabel) { popup.getById("cancel").value = $cancelLabel; };
	this.setOkLabel = function($okLabel) { popup.getById("ok").value = $okLabel; };
	
	this.setContent = function($content)
	{
		content = $content;
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}