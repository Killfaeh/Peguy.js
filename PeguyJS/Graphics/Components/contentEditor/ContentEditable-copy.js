function ContentEditable()
{
	///////////////
	// Attributs //
	///////////////
	
	// Données
	
	var bold = true;
	var italic = true;
	var underline = true;
	var strike = true;
	var fontSize = true;
	var title = true;
	var textColor = true;
	var font = true;
	var quote = true;
	var code = true;
	var align = true;
	var lists = true;
	var tables = true;
	var links = true;
	var images = true;
	var addAnchor = false;
	var keepBR = false;
	var truc = 1;
	
	var defaultColor = 'rgb(0, 0, 0)';
	var colorsList = [];
	
	var fontList = [
					{ value: 'Arial', label: 'Arial' },
					{ value: 'Times New Roman', label: 'Times New Roman' },
					{ value: 'Courier New', label: 'Courier New' },
					{ value: 'Géorgie', label: 'Géorgie' },
					{ value: 'Helvetica', label: 'Helvetica' },
					];
					
	var languagesList = [];
	
	var imagesUploadModes =
	{
		url: true,
		hosted: false
	};
	
	var imagesLibraryConfig = 
	{
		searchMode: false, withMetadata: false,
		params: {},
		displayFreezeScreen: function() {},
		hideFreezeScreen: function() {},
		onError: function(status, $response) {},
		getImagesListRequest: { url: '', method: 'GET', param: [], data: [], response: {id: 'id', url: 'url', title: 'title', keywords: 'keywords'} },
		uploadImageRequest: { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url', title: 'title', keywords: 'keywords'} },
		editImageRequest: { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url', title: 'title', keywords: 'keywords'} },
		deleteImageRequest: { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url', title: 'title', keywords: 'keywords'} }
	};
	
	var imgSecureURL = '';
	
	// Eléments affichables
	
	var html = '<div class="contentEditable" >'
				+ '<div id="buttons" class="buttons" >'
					+ '<div class="buttonsSubBlock" >'
						+ '<p class="undoRedo" id="undoRedo" >'
							+ '<a id="undo" href="#" ></a>'
							+ '<a id="redo" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="format" id="format" >'
							+ '<a id="bold" href="#" style="font-weight: bold; " >B</a>'
							+ '<a id="italic" href="#" style="font-style: italic; " >I</a>'
							+ '<a id="underline" href="#" style="text-decoration: underline; " >U</a>'
							+ '<a id="strike" href="#" style="text-decoration: line-through; " >S</a>'
							+ '<a id="font-size" href="#" ></a>'
							+ '<a id="title" class="title" href="#" >T</a>'
							+ '<a id="text-color" href="#" ></a>'
							+ '<a id="font" class="font" href="#" >F</a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="block" id="block" >'
							+ '<a id="quote" href="#" >“…”</a>'
							+ '<a id="code" href="#" >&lt;/&gt;</a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="align" id="align" >'
							+ '<a id="align-left" href="#" ></a>'
							+ '<a id="align-center" href="#" ></a>'
							+ '<a id="align-right" href="#" ></a>'
							+ '<a id="align-justify" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="list" id="list" >'
							+ '<a id="unorder-list" href="#" ></a>'
							+ '<a id="order-list" href="#" ></a>'
							+ '<a id="table" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="links" id="links" >'
							+ '<a id="url" href="#" ></a>'
							+ '<a id="img" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="remove-format-block" id="remove-format-block" >'
							+ '<a id="remove-format" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
					+ '</div>'
				+ '</div>'
				+ '<div id="editor" class="editor" contenteditable="true" ></div>'
				+ '<textarea id="bbEditor" class="bbEditor" ></textarea>'
			+ '</div>';

	var component = new ContentEditor(html);
	
	var undoIcon = Loader.getSVG('icons', 'undo-icon', 16, 16);
	var redoIcon = Loader.getSVG('icons', 'redo-icon', 16, 16);
	var fontSizeIcon = Loader.getSVG('icons', 'font-size-icon', 16, 16);
	var textColorIcon = Loader.getSVG('icons', 'text-color-icon', 16, 16);
	var alignLeftIcon = Loader.getSVG('icons', 'align-left-icon', 16, 16);
	var alignCenterIcon = Loader.getSVG('icons', 'align-center-icon', 16, 16);
	var alignRightIcon = Loader.getSVG('icons', 'align-right-icon', 16, 16);
	var alignJustifyIcon = Loader.getSVG('icons', 'align-justify-icon', 16, 16);
	var unorderListIcon = Loader.getSVG('icons', 'unorder-list-icon', 16, 16);
	var orderListIcon = Loader.getSVG('icons', 'order-list-icon', 16, 16);
	var tableIcon = Loader.getSVG('icons', 'table-icon', 16, 16);
	var urlIcon = Loader.getSVG('icons', 'url-icon', 16, 16);
	var imgIcon = Loader.getSVG('icons', 'picture-icon', 16, 16);
	var removeTextFormatIcon = Loader.getSVG('icons', 'remove-text-format-icon', 16, 16);
	
	component.getById('undo').appendChild(undoIcon);
	component.getById('redo').appendChild(redoIcon);
	component.getById('font-size').appendChild(fontSizeIcon);
	component.getById('text-color').appendChild(textColorIcon);
	component.getById('align-left').appendChild(alignLeftIcon);
	component.getById('align-center').appendChild(alignCenterIcon);
	component.getById('align-right').appendChild(alignRightIcon);
	component.getById('align-justify').appendChild(alignJustifyIcon);
	component.getById('unorder-list').appendChild(unorderListIcon);
	component.getById('order-list').appendChild(orderListIcon);
	component.getById('table').appendChild(tableIcon);
	component.getById('url').appendChild(urlIcon);
	component.getById('img').appendChild(imgIcon);
	component.getById('remove-format').appendChild(removeTextFormatIcon);
	
	// Données de fonctionnement
	
	var htmlContent = "";
	var bbContent = "";
	var mode = 'wysiwyg';

	//////////////
	// Méthodes //
	//////////////
	
	//// Vérifier si la sélection contient ou est dans un bloc de code ou de citation ////
	
	this.isThereCodeOrQuoteTag = function()
	{
		var isThere = false;

		$this.saveSelection();
		
		if (utils.isset($this.getSelection()))
		{
			var commonParent = $this.getSelection().commonAncestorContainer;
			var ancestor = commonParent;
			
			while (utils.isset(ancestor))
			{
				if (utils.isset(ancestor.tagName) 
					&& (ancestor.tagName.toUpperCase() === 'PRE' 
						|| ancestor.tagName.toUpperCase() === 'CODE' 
						|| ancestor.tagName.toUpperCase() === 'BLOCKQUOTE'))
				{
					isThere = true;
					ancestor = null;
				}
				else
					ancestor = ancestor.parentNode;
			}
			
			if (isThere === false)
			{
				var selectedNodes = $this.getSelectedNodes($this.getSelection());
				
				for (var i = 0; i < selectedNodes.length; i++)
				{
					if (utils.isset(selectedNodes[i].tagName) && (selectedNodes[i].tagName.toUpperCase() === 'PRE' 
						|| selectedNodes[i].tagName.toUpperCase() === 'CODE' 
						|| selectedNodes[i].tagName.toUpperCase() === 'BLOCKQUOTE'))
					{
						isThere = true;
						i = selectedNodes.length;
					}
					else if (utils.isset(selectedNodes[i].getElementsByTagName))
					{
						var preNodes = selectedNodes[i].getElementsByTagName('pre');
						var codeNodes = selectedNodes[i].getElementsByTagName('code');
						var quoteNodes = selectedNodes[i].getElementsByTagName('blockquote');
						
						if (preNodes.length > 0 || codeNodes.length > 0 || quoteNodes.length > 0)
						{
							isThere = true;
							i = selectedNodes.length;
						}
					}
				}
			}
		}
		
		console.log("Is there ? " + isThere);
		
		return isThere;
	};
	
	//// Repositionner le curseur ////
	
	this.restoreCaret = function($moveScroll)
	{
		var caretNode = $this.getInsertNode(component.getById('editor'));
		
		if (utils.isset(caretNode))
		{
			var bbCaretPosition = bbContent.indexOf($this.detectCaretStr);
			bbContent = bbContent.replace($this.detectCaretStr, '');

			var saltPosition = $this.getSaltPosition(caretNode);
			
			component.getById('bbEditor').value = bbContent;
			
			if (mode === 'text')
			{
				component.getById('bbEditor').setCaret(bbCaretPosition);
				component.getById('bbEditor').blur();
				component.getById('bbEditor').focus();
			}
			else
			{
				var range = $this.updateSelection(caretNode, saltPosition);
				
				// Repositionnement de l'ascenceur
				if ($moveScroll === true)
				{
					var span = document.createElement("span");
					
					if (utils.isset(span.getClientRects))
					{
						var scroll = $this.computeScroll(span, range);
						var newScrollX = scroll.x;
						var newScrollY = scroll.y;
						
						if (utils.isset(component.getById('editor').scrollTo))
							component.getById('editor').scrollTo(0, newScrollY);
						else
							component.getById('editor').scrollTop = newScrollY;
						
						var spanParent = span.parentNode;
						spanParent.removeChild(span);
					}
				}
			}
			
			//console.log('Restored text content : "' + caretNode.textContent + '"');
		}
	};

	//// Gestion des données internes ////
	
	this.getConfig = function()
	{
		var config = 
		{
			bold: bold,
			italic: italic,
			underline: underline,
			strike: strike,
			fontSize: fontSize,
			title: title,
			textColor: textColor,
			font: font,
			quote: quote,
			code: code,
			align: align,
			lists: lists,
			tables: tables,
			links: links,
			images: images,
			addAnchor: addAnchor,
			keepBR: keepBR,
			defaultColor: defaultColor,
			colorsList: colorsList,
			fontList: fontList,
			imagesUploadModes: imagesUploadModes,
			imgSecureURL: imgSecureURL
		};
		
		return config;
	};
	
	this.updateBBCode = function()
	{
		//console.log("HTML");
		//console.log(component.getById("editor").innerHTML);
		htmlContent = component.getById("editor").innerHTML;
		bbContent = Format.nodeToBBCode(component.getById("editor"), $this.getConfig());
		bbContent = bbContent.replace(/^\n+/, '');
		component.getById("bbEditor").value = bbContent;
		//bbContent = bbContent.replace(/\n+$/, '');
		//console.log("BB CODE");
		//console.log(bbContent);
		return bbContent;
	};
	
	this.updateHTMLCode = function()
	{
		bbContent = component.getById("bbEditor").value;
		//console.log("BB CODE");
		//console.log(bbContent);
		htmlContent = Format.bbCodeToHTML(bbContent, $this.getConfig());
		//console.log("HTML");
		//console.log(htmlContent);
		component.getById("editor").innerHTML = htmlContent;
		return htmlContent;
	};
	
	this.updateCode = function()
	{
		if (mode === 'text')
			$this.updateHTMLCode();
		else
			$this.updateBBCode();
	};
	
	this.makeImagesDraggable = function()
	{
		/*
		var imagesList = component.getById("editor").getElementsByTagName('img');
		
		for (var i = 0; i < imagesList.length; i++)
			imagesList[i].setAttribute('draggable', 'true');
		//*/
	};
	
	//// Gestion de l'historique ////
	
	this.updateUndoRedoButtons = function()
	{
		if ($this.getHistory().length > 1)
		{
			component.getById('undoRedo').style.display = 'inline-block';

			if ($this.getHistoryIndex() <= 0)
				component.getById('undo').style.display = 'none';
			else
				component.getById('undo').style.display = 'inline-block';

			if ($this.getHistoryIndex() >= $this.getHistory().length-1)
				component.getById('redo').style.display = 'none';
			else
				component.getById('redo').style.display = 'inline-block';
		}
		else
			component.getById('undoRedo').style.display = 'none';
	};
	
	this.cloneBBCodeForHistory = function()
	{
		return $this.cloneCodeForHistory('bbEditor');
	};
	
	this.addToHistory = function()
	{
		console.log("ADD TO HISTORY");
		
		var cloneBBCode = bbContent;
		
		if (mode === 'text')
			cloneBBCode = $this.cloneBBCodeForHistory();
		else
		{
			$this.saveCurrentCaretNode();
			
			var clone = $this.cloneForHistory(component.getById('editor'));
			
			//var htmlCode = clone.innerHTML + "";
			
			//console.log(component.getById('editor').innerHTML);
			//console.log(clone.innerHTML);
			
			cloneBBCode =  Format.nodeToBBCode(clone, $this.getConfig());
			cloneBBCode = cloneBBCode.replace(/^\n+/, '');
		}
		
		if (cloneBBCode !== $this.getHistory()[$this.getHistory().length-1])
			$this.pushHistory(cloneBBCode);
		
		$this.setHistoryIndex($this.getHistory().length-1);
		$this.updateUndoRedoButtons();
	};
	
	this.updateCursorInHistory = function($index)
	{
		var cloneBBCode = bbContent;
		
		if (mode === 'text')
			cloneBBCode = $this.cloneBBCodeForHistory();
		else
		{
			$this.saveCurrentCaretNode();
			
			var clone = $this.cloneForHistory(component.getById('editor'));
			
			//var htmlCode = clone.innerHTML + "";
			
			cloneBBCode =  Format.nodeToBBCode(clone, $this.getConfig());
			cloneBBCode = cloneBBCode.replace(/^\n+/, '');
		}

		$this.getHistory()[$index] = cloneBBCode;
		$this.updateUndoRedoButtons();
	};
	
	var callbackUndoRedo = function($content)
	{
		//console.log("UNDO REDO " + historyIndex + ' : ' + $content);
			
		bbContent = $content;
		component.getById('bbEditor').value = bbContent;
		$this.updateHTMLCode();
			
		//component.getById('editor').innerHTML = $content;
		$this.makeImagesDraggable();
		$this.restoreCaret(false);
		$this.updateUndoRedoButtons();
	};

	this.undo = function() { $this.decrementeHistory(function($content) { callbackUndoRedo($content); }); };
	this.redo = function() { $this.incrementeHistory(function($content) { callbackUndoRedo($content); }); };
	
	//// Formatage du bb code ////
	
	var surroundBBCodeWithTag = function($tagStart, $tagEnd)
	{
		var caretPosition = component.getById('bbEditor').getCaret();
		var innerTextLength = 0;
		
		if (component.getById('bbEditor').setSelectionRange)
		{
			component.getById('bbEditor').value = component.getById('bbEditor').value.substring(0, component.getById('bbEditor').selectionStart) 
													+ $tagStart + component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionStart, component.getById('bbEditor').selectionEnd) + $tagEnd 
													+ component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionEnd, component.getById('bbEditor').value.length);
			
			innerTextLength = component.getById('bbEditor').selectionEnd - component.getById('bbEditor').selectionStart;
		}
		else
		{
			var selectedText = document.selection.createRange().text; 
			 
			if (selectedText != "")
			{
				innerTextLength = selectedText.length;
				var newText = $tagStart + selectedText + $tagEnd;
				document.selection.createRange().text = newText;
			}
		}
		
		component.getById('bbEditor').setCaret(caretPosition + $tagStart.length + innerTextLength);
	};
	
	var replaceBBCodeWidth = function($newStr)
	{
		var caretPosition = component.getById('bbEditor').getCaret();
		
		if (component.getById('bbEditor').setSelectionRange)
		{
			component.getById('bbEditor').value = component.getById('bbEditor').value.substring(0, component.getById('bbEditor').selectionStart) 
													+ $newStr
													+ component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionEnd, component.getById('bbEditor').value.length);
		}
		else
		{
			var selectedText = document.selection.createRange().text; 
			 
			if (selectedText != "")
				document.selection.createRange().text = $newStr;
		}
		
		component.getById('bbEditor').setCaret(caretPosition + $newStr.length);
	};

	//// Popup ////

	var errorPopup = function($message)
	{
		var errorHTML = '<p class="error" >' + $message + '</p>';
		var errorPopup = new InfoPopup(errorHTML);
		document.getElementById('main').appendChild(errorPopup);
	};

	var openPopup = function($title, $block, $onCancel, $onOk)
	{
		var popupHTML = '<h2>' + $title + '</h2>' + $block;
		var popup = new ConfirmPopup(popupHTML);
		popup.onCancel = function() { $onCancel(); };
		popup.onOk = function() { return $onOk(); };
		document.getElementById('main').appendChild(popup);
		return popup;
	};

	var openContext = function($buttonId, $options, $onCancel, $onAction)
	{
		var buttonPosition = component.getById($buttonId).position();

		var contextMenu = new ContextMenu(buttonPosition.x, buttonPosition.y + component.getById($buttonId).offsetHeight);

		for (var i = 0; i < $options.length; i++)
		{
			var item = new MenuItem($options[i].label);
			item.setAttribute('value', $options[i].value);
			item.onAction = function() { $onAction(this.getAttribute('value')); };
			contextMenu.addElement(item);
		}

		contextMenu.onCancel = function() { $onCancel(); };
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.getById('undo').onClick = function() { $this.onUndo(); };
	component.getById('undo').onToolTip = KEYWORDS.undo;
	
	component.getById('redo').onClick = function() { $this.onRedo(); };
	component.getById('redo').onToolTip = KEYWORDS.redo;
	
	var styles = 
	{
		"bold" : { bbTag: 'b', config: bold },
		"italic" : { bbTag: 'i', config: italic },
		"underline" : { bbTag: 'u', config: underline },
		"strikeThrough" : { bbTag: 's', config: strike },
	};

	var applyStyle = function($style)
	{
		var style = styles[$style];
		var bbTag = style.bbTag;
		var configToTest = style.config;

		if (configToTest === true && !$this.isThereCodeOrQuoteTag())
		{
			if (mode === 'text')
				surroundBBCodeWithTag('[' + bbTag + ']', '[/' + bbTag + ']');
			else
				document.execCommand($style, false, null);
			
			onChange();
		}
	};

	component.getById('bold').onClick = function() { applyStyle("bold"); };
	component.getById('bold').onToolTip = KEYWORDS.bold;
	
	component.getById('italic').onClick = function() { applyStyle("italic"); };
	component.getById('italic').onToolTip = KEYWORDS.italic;
	
	component.getById('underline').onClick = function() { applyStyle("underline"); };
	component.getById('underline').onToolTip = KEYWORDS.underline;
	
	component.getById('strike').onClick = function() { applyStyle("strikeThrough"); };
	component.getById('strike').onToolTip = KEYWORDS.strike;
	
	var applyFontSize = function($size)
	{
		var sizeList = 
		{
			'0': 20,
			'2': 50,
			'3': 100,
			'5': 150,
			'7': 200
		};
		
		$this.restoreSelection($this.getSelection());
		
		if (mode === 'text')
			surroundBBCodeWithTag('[size=' + sizeList[$size] + ']', '[/size]');
		else
		{
			document.execCommand('fontSize', false, $size);
			
			var fontList = component.getById('editor').getElementsByTagName('font');
			
			for (var i = 0; i < fontList.length; i++)
			{
				var size = fontList[i].getAttribute('size');
				
				if (utils.isset(size) && size !== '')
				{
					fontList[i].removeAttribute("size");
					fontList[i].style.fontSize = sizeList[$size] + "%";
				}
			}
		}
		
		onChange();
	};

	component.getById('font-size').onclick = function()
	{
		if (fontSize === true)
		{
			var sizes =
			[
				{ value: 0, label: '<span style="font-size: 20%" >' + KEYWORDS.verySmall + '</span>' },
				{ value: 2, label: '<span style="font-size: 50%" >' + KEYWORDS.small + '</span>' },
				{ value: 3, label: '<span style="font-size: 100%" >' + KEYWORDS.normal + '</span>' },
				{ value: 5, label: '<span style="font-size: 150%" >' + KEYWORDS.big + '</span>' },
				{ value: 7, label: '<span style="font-size: 200%" >' + KEYWORDS.veryBig + '</span>' }
			];
			
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (Loader.getMode() === 'mobile')
			{
				var popup = openPopup(KEYWORDS.fontSize, '<div id="size-selector-block" ></div>', 
					function() { $this.restoreSelection($this.getSelection()); }, 
					function()
					{
						if (mode === 'text' || !isThereCodeOrQuoteTag)
						{
							var fontSize = sizeSelector.getCurrentValue();
							applyFontSize(fontSize);
						}

						return true;
					});
				
				var sizeSelector = new RadioList('size-selector', sizes, 3, 1, true);
				popup.getById('size-selector-block').appendChild(sizeSelector);
			}
			else
			{
				if (mode === 'text' || !isThereCodeOrQuoteTag)
					openContext('font-size', sizes, function() { $this.restoreSelection($this.getSelection()); }, function($value) { applyFontSize($value); });
			}
		}
	};
	
	component.getById('font-size').onToolTip = KEYWORDS.fontSize;
	
	var applyTitle = function($headTag)
	{
		$this.restoreSelection($this.getSelection());
		
		if (mode === 'text')
			surroundBBCodeWithTag('\n\n[' + $headTag + ']', '[/' + $headTag + ']\n\n');
		else
			document.execCommand('formatBlock', false, $headTag);
		
		onChange();
	};
	
	component.getById('title').onclick = function()
	{
		if (title === true)
		{
			var titles =
			[
				{ value: 'h1', label: '<h1 style="display: inline" >' + KEYWORDS.title + ' 1</h1>' },
				{ value: 'h2', label: '<h2 style="display: inline" >' + KEYWORDS.title + ' 2</h2>' },
				{ value: 'h3', label: '<h3 style="display: inline" >' + KEYWORDS.title + ' 3</h3>' },
				{ value: 'h4', label: '<h4 style="display: inline" >' + KEYWORDS.title + ' 4</h4>' },
				{ value: 'h5', label: '<h5 style="display: inline" >' + KEYWORDS.title + ' 5</h5>' },
				{ value: 'h6', label: '<h6 style="display: inline" >' + KEYWORDS.title + ' 6</h6>' }
			];
			
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (Loader.getMode() === 'mobile')
			{
				var popup = openPopup(KEYWORDS.title, '<div id="title-selector-block" ></div>', 
					function() { $this.restoreSelection($this.getSelection()); }, 
					function()
					{
						if (mode === 'text' || !isThereCodeOrQuoteTag)
						{
							var headTag = titleSelector.getCurrentValue();
							applyTitle(headTag);
						}

						return true;
					});
				
				var titleSelector = new RadioList('title-selector', titles, 'h3', 2, true);
				popup.getById('title-selector-block').appendChild(titleSelector);
			}
			else
			{
				if (mode === 'text' || !isThereCodeOrQuoteTag)
					openContext('title', titles, function() { $this.restoreSelection($this.getSelection()); }, function($value) { applyTitle($value); });
			}
		}
	};
	
	component.getById('title').onToolTip = KEYWORDS.title;
	
	var applyColor = function($color)
	{
		$this.restoreSelection($this.getSelection());
		
		if (mode === 'text')
			surroundBBCodeWithTag('[color=#'+ $color + ']', '[/color]');
		else
		{
			document.execCommand('foreColor', false, $color);
			
			var fontList = component.getById('editor').getElementsByTagName('font');
			
			for (var i = 0; i < fontList.length; i++)
			{
				var color = fontList[i].getAttribute('color');
				
				if (utils.isset(color) && color !== '')
				{
					fontList[i].removeAttribute("color");
					fontList[i].style.color = color;
				}
			}
		}
		
		onChange();
	};
	
	component.getById('text-color').onclick = function()
	{
		if (textColor === true)
		{
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (utils.isset(colorsList) && colorsList.length > 0)
			{
				if (Loader.getMode() === 'mobile')
				{
					var popup = openPopup(KEYWORDS.selectColor, '<div id="color-palette-selector-block" ></div>', 
					function() { $this.restoreSelection($this.getSelection()); }, 
					function()
					{
						if (mode === 'text' || !isThereCodeOrQuoteTag)
						{
							var color = colorPalette.getValue();
							
							if (utils.isset(color))
							{
								color = color.replace(/ /gi, '');
								
								if (/^rgb/.test(color))
								{
									var rgb = color.match(/^rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)$/);
									var color = Colors.rgbToHex(rgb[1], rgb[2], rgb[3]);
								}
								else
									color = color.replace('#', '');
								
								applyColor(color);
							}
						}
						
						return true;
					});
				
					var colorPalette = new ColorPalette(colorsList);
					popup.getById('color-palette-selector-block').appendChild(colorPalette);
				}
				else
				{
					if (mode === 'text' || !isThereCodeOrQuoteTag)
					{
						openContext('title', titles, 
							function() { $this.restoreSelection($this.getSelection()); }, 
							function($value)
							{
								var color = $value.replace(/ /gi, '');
								
								if (/^rgb/.test(color))
								{
									var rgb = color.match(/^rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)$/);
									var color = Colors.rgbToHex(rgb[1], rgb[2], rgb[3]);
								}
								else
									color = color.replace('#', '');
								
								applyColor(color);
							});
					}
				}
			}
			else
			{
				var colorPopup = new SelectColorPopup(null);
				
				colorPopup.onCancel = function() { $this.restoreSelection($this.getSelection()); };
				
				colorPopup.onOk = function()
				{
					if (mode === 'text' || !isThereCodeOrQuoteTag)
					{
						var rgb = colorPopup.getRGB();
						applyColor(colorPopup.getHex());
					}
					
					return true;
				};
				
				document.getElementById('main').appendChild(colorPopup);
			}
		}
	};
	
	component.getById('text-color').onToolTip = KEYWORDS.color;
	
	var applyFont = function($fontName)
	{
		$this.restoreSelection($this.getSelection());
		
		if (mode === 'text')
			surroundBBCodeWithTag('[font=' + $fontName + ']', '[/font]');
		else
		{
			document.execCommand('fontName', false, $fontName);
			
			var fontList = component.getById('editor').getElementsByTagName('font');
			
			for (var i = 0; i < fontList.length; i++)
			{
				var fontName = fontList[i].getAttribute('face');
				
				if (utils.isset(fontName) && fontName !== '')
				{
					fontList[i].removeAttribute("face");
					fontList[i].style.fontFamily = fontName;
				}
			}
		}
		
		onChange();
	};
	
	component.getById('font').onclick = function()
	{
		if (font === true)
		{
			var fonts = fontList;
			
			if (fonts.length <= 0)
			{
				fonts =
				[
					{ value: 'Arial', label: '<span style="font-family: \'Arial\'" >Arial</span>' },
					{ value: 'Times New Roman', label: '<span style="font-family: \'Times New Roman\'" >Times New Roman</span>' },
					{ value: 'Courier New', label: '<span style="font-family: \'Courier New\'" >Courier New</span>' },
					{ value: 'Géorgie', label: '<span style="font-family: \'Géorgie\'" >Géorgie</span>' },
					{ value: 'Helvetica', label: '<span style="font-family: \'Helvetica\'" >Helvetica</span>' },
					{ value: 'Verdana', label: '<span style="font-family: \'Verdana\'" >Verdana</span>' }
				];
			}
			else
			{
				for (var i = 0; i < fonts.length; i++)
					fonts[i].label = '<span style="font-family: \'' + fonts[i].value + '\'" >' + fonts[i].label + '</span>';
			}
			
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (Loader.getMode() === 'mobile')
			{
				var popup = openPopup(KEYWORDS.font, '<div id="font-selector-block" ></div>', 
					function() { $this.restoreSelection($this.getSelection()); }, 
					function()
					{
						if (!isThereCodeOrQuoteTag)
						{
							var fontName = fontSelector.getCurrentValue();
							applyFont(fontName);
						}
						
						return true;
					});
				
					var fontSelector = new RadioList('font-selector', fonts, 'Arial', 2, true);
					popup.getById('font-selector-block').appendChild(fontSelector);
			}
			else
			{
				if (mode === 'text' || !isThereCodeOrQuoteTag)
					openContext('font', fonts, function() { $this.restoreSelection($this.getSelection()); }, function($value) { applyFont($value); });
			}
		}
	};
	
	component.getById('font').onToolTip = KEYWORDS.font;
	
	component.getById('quote').onclick = function()
	{
		if (mode === 'text')
		{
			surroundBBCodeWithTag('\n\n[quote]', '[/quote]\n\n');
			onChange();
		}
		else if (quote === true && !$this.isThereCodeOrQuoteTag())
		{
			document.execCommand('formatBlock', false, 'blockquote');
			onChange();
		}
	};
	
	component.getById('quote').onToolTip = KEYWORDS.insertQuote;
	
	var insertCode = function($language)
	{
		$this.restoreSelection($this.getSelection());
		
		if (mode === 'text')
		{
			if ($language !== '' && $language !== 'plain-text')
				surroundBBCodeWithTag('\n\n[code=' + $language + ']', '[/code]\n\n');
			else
				surroundBBCodeWithTag('\n\n[code]', '[/code]\n\n');
		}
		else
		{
			document.execCommand('formatBlock', false, 'pre');
			
			var sel = null;
			
			if (window.getSelection)
				sel = window.getSelection();
			else if (document.selection)
				sel = document.selection;
			
			if (utils.isset(sel) && $language !== '' && $language !== 'plain-text')
			{
				var block = window.getSelection().focusNode.parentNode;
				block.setAttribute('class', "language-" + $language);
			}
		}
		
		onChange();
	};
	
	component.getById('code').onclick = function()
	{
		var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
		
		if (code === true && !isThereCodeOrQuoteTag)
		{
			if (languagesList.length > 0)
			{
				var options = [{ value: 'plain-text', label: 'Texte' }];
				
				for (var i = 0; i < languagesList.length; i++)
					options.push(languagesList[i]);
				
				if (Loader.getMode() === 'mobile')
				{
					var popup = openPopup('Bloc de code', '<div id="language-selector-block" ></div>', 
					function() { $this.restoreSelection($this.getSelection()); }, 
					function()
					{
						if (!isThereCodeOrQuoteTag)
						{
							var language = languageSelector.getCurrentValue();
							insertCode(language);
						}
						
						return true;
					});
				
					//var nbColumns = 1;
					var nbColumns = Math.ceil(Math.sqrt(options.length));

					var languageSelector = new RadioList('language-selector', options, 'plain-text', nbColumns);
					popup.getById('language-selector-block').appendChild(languageSelector);
				}
				else
				{
					openContext('code', options, 
						function() { $this.restoreSelection($this.getSelection()); }, 
						function($value)
						{
							if (!isThereCodeOrQuoteTag)
								insertCode($value);
						});
				}
			}
			else
				insertCode('plain-text');
		}
	};
	
	component.getById('code').onToolTip = KEYWORDS.insertCode;
	
	var aligns = 
	{
		"justifyLeft": "left",
		"justifyCenter": "center",
		"justifyRight": "right",
		"justifyFull": "justify",
	};

	var applyAlign = function($align)
	{
		var bbTag = aligns[$align];

		if (align === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				surroundBBCodeWithTag('\n\n[' + bbTag + ']', '[/' + bbTag + ']\n\n');
				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				document.execCommand($align, false, null);
				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};

	component.getById('align-left').onclick = function() { applyAlign("justifyLeft"); };
	component.getById('align-left').onToolTip = KEYWORDS.alignLeft;
	
	component.getById('align-center').onclick = function() { applyAlign("justifyCenter"); };
	component.getById('align-center').onToolTip = KEYWORDS.center;
	
	component.getById('align-right').onclick = function() { applyAlign("justifyRight"); };
	component.getById('align-right').onToolTip = KEYWORDS.alignRight;
	
	component.getById('align-justify').onclick = function() { applyAlign("justifyFull"); };
	component.getById('align-justify').onToolTip = KEYWORDS.justify;

	var applyList = function($ordered)
	{
		if (lists === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				if ($ordered === true)
					replaceBBCodeWidth('\n\n[list=1]\n[*]\n[/list]\n\n');
				else
					replaceBBCodeWidth('\n\n[list]\n[*]\n[/list]\n\n');

				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				if ($ordered === true)
					document.execCommand('insertOrderedList', false, null);
				else
					document.execCommand('insertUnorderedList', false, null);

				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};
	
	component.getById('unorder-list').onclick = function() { applyList(false); };
	component.getById('unorder-list').onToolTip = KEYWORDS.insertList;
	
	component.getById('order-list').onclick = function() { applyList(true); };
	component.getById('order-list').onToolTip = KEYWORDS.insertOrderedList;
	
	component.getById('table').onclick = function()
	{
		if (tables === true && (!$this.isThereCodeOrQuoteTag() || mode === 'text'))
		{
			$this.saveSelection();
			
			var popupHTML = '<table>'
								+ '<tr>'
									+ '<th><label for="columns" >' + KEYWORDS.columns + '</label></th>'
									+ '<th><label for="rows" >' + KEYWORDS.rows + '</label></th>'
								+ '</tr>'
								+ '<tr>'
									+ '<td>'
										+ '<input id="columns" type="number" value="2" />'
									+ '</td>'
									+ '<td>'
										+ '<input id="rows" type="number" value="2" />'
									+ '</td>'
								+ '</tr>'
							+ '</table>';

			var popup = openPopup(KEYWORDS.insertTable, popupHTML, 
					function() { $this.restoreSelection($this.getSelection()); }, 
					function()
					{
						var isOk = true;
						var nbColumns = popup.getById('columns').value;
						var nbRows = popup.getById('rows').value;
						
						if (nbColumns < 1)
						{
							errorPopup(KEYWORDS.errorNbColumns);
							isOk = false;
						}
						else if (nbRows < 1)
						{
							errorPopup(KEYWORDS.errorNbRows);
							isOk = false;
						}
						else
						{
							$this.restoreSelection($this.getSelection());
							
							if (mode === 'text')
							{
								var str = '\n\n[table]\n';
								
								for (var i = 0; i < nbRows; i++)
								{
									str = str + '[tr]\n';
									
									for (var j = 0; j < nbColumns; j++)
										str = str + '[td][/td]\n';
									
									str = str + '[/tr]\n';
								}
								
								str = str + '[/table]\n\n';
								
								replaceBBCodeWidth(str);
							}
							else
							{
								var newTable = new Table(nbColumns, nbRows);
								
								var sel = null;
								
								if (window.getSelection)
									sel = window.getSelection();
								else if (document.selection)
									sel = document.selection;
					
								if (utils.isset(sel))
								{
									sel.deleteFromDocument();
									sel.getRangeAt(0).insertNode(newTable);
									
									var range = new Range();
									range.setStart(newTable, newTable.childNodes.length);
									
									sel.removeAllRanges();
									sel.addRange(range);
								}
							}
							
							onChange();
						}
						
						return isOk;
					});
				
			popup.getById('columns').focus();
		}
	};
	
	component.getById('table').onToolTip = KEYWORDS.insertTable;
	
	component.getById('url').onclick = function()
	{
		if (links === true && (!$this.isThereCodeOrQuoteTag() || mode === 'text'))
		{
			$this.saveSelection();
			
			var popup = openPopup(KEYWORDS.insertLink, 
							'<p class="insert-url-input" >'
								+ '<input name="url-input" id="url-input" type="text" placeholder="' + KEYWORDS.link + '" />'
							+ '</p>', 
					function() { $this.restoreSelection($this.getSelection()); }, 
					function()
					{
						var isOk = true;
						var url = popup.getById('url-input').value;
						//url = url.replaceAll('&amp;', '%26').replaceAll('&', '%26') + '';
						
						if (utils.isset(DataFilter.url(url)))
						{
							$this.restoreSelection($this.getSelection());
							
							if (mode === 'text')
								surroundBBCodeWithTag('[url=' + url + ']', '[/url]');
							else
								document.execCommand('createLink', false, url);
							
							onChange();
						}
						else
						{
							errorPopup(KEYWORDS.errorURL);
							isOk = false;
						}
						
						return isOk;
					});

			popup.getById('url-input').focus();
		}
	};
	
	component.getById('url').onToolTip = KEYWORDS.insertLink;
	
	var insertImage = function($url)
	{
		$this.restoreSelection($this.getSelection());
		
		if (mode === 'text')
			replaceBBCodeWidth('[img]' + $url + '[/img]');
		else
		{
			document.execCommand('insertImage', true, $url);
			
			var imgList = component.getById('editor').getElementsByTagName('img');
			
			//for (var i = 0; i < imgList.length; i++)
				//imgList[i].style.maxWidth = "500px";
		}
		
		onChange();
	};
	
	var openUrlPopup = function()
	{
		var popup = openPopup(KEYWORDS.insertImg, 
							'<p id="inputs" class="select-img-inputs" >'
								+ '<input name="url-input" id="url-input" type="text" placeholder="url" />'
							+ '</p>', 
					function() {}, 
					function()
					{
						var isOk = false;
						
						var url = popup.getById('url-input').value;
						
						if (utils.isset(DataFilter.url(url)))
							isOk = true;

						if (isOk === true)
						{
							$this.restoreSelection($this.getSelection());
							
							if (!$this.isThereCodeOrQuoteTag())
								insertImage(url);
						}
						else
						{
							errorPopup(KEYWORDS.errorURL);
							isOk = false;
						}
						
						return isOk;
					});

		popup.getById('url-input').focus();
	};
	
	var initImagesLibrary = function()
	{
		var imagesLibrary = new ImagesManager();
		
		imagesLibrary.setSearchMode(imagesLibraryConfig.searchMode);
		imagesLibrary.setWithMetadata(imagesLibraryConfig.withMetadata);
		imagesLibrary.setParams(imagesLibraryConfig.params);
		
		imagesLibrary.setDisplayFreezeScreen(imagesLibraryConfig.displayFreezeScreen);
		imagesLibrary.setHideFreezeScreen(imagesLibraryConfig.hideFreezeScreen);
		
		imagesLibrary.setGetImagesListRequest(imagesLibraryConfig.getImagesListRequest);
		imagesLibrary.setUploadImageRequest(imagesLibraryConfig.uploadImageRequest);
		imagesLibrary.setEditImageRequest(imagesLibraryConfig.editImageRequest);
		imagesLibrary.setDeleteImageRequest(imagesLibraryConfig.deleteImageRequest);
		
		imagesLibrary.onError = imagesLibraryConfig.onError;

		imagesLibrary.onCancel = function() { $this.restoreSelection($this.getSelection()); };
		
		imagesLibrary.onOk = function()
		{
			var url = imagesLibrary.getSelectedUrl();

			$this.restoreSelection($this.getSelection());
			
			if (utils.isset(url) && !$this.isThereCodeOrQuoteTag())
				insertImage(url);
			
			return true;
		};
		
		imagesLibrary.getImagesList();
		
		return imagesLibrary;
	};
	
	var openImagesLibrary = function()
	{
		var imagesLibrary = initImagesLibrary();
		document.getElementById('main').appendChild(imagesLibrary);
	};
	
	component.getById('img').onclick = function()
	{
		if (images === true)
		{
			var countOptions = 0;
			
			if (imagesUploadModes.url === true)
				countOptions++;
			
			if (imagesUploadModes.inlineData === true)
				countOptions++;
			
			if (imagesUploadModes.hosted === true)
				countOptions++;
			
			if (countOptions > 0)
			{
				$this.saveSelection();
				
				if (countOptions === 1)
				{
					if (imagesUploadModes.url === true)
						openUrlPopup();
					else if (imagesUploadModes.hosted === true)
						openImagesLibrary();
				}
			}
		}
	};
	
	component.getById('img').onToolTip = KEYWORDS.insertImage;
	
	component.getById('remove-format').onclick = function()
	{
		document.execCommand('removeFormat', false, null);
		document.execCommand('formatBlock', false, 'div');
		onChange();
	};
	
	component.getById('remove-format').onToolTip = KEYWORDS.removeStyle;

	component.getById('editor').onscroll = function($event)
	{
		$this.setScrollX(component.getById('editor').scrollLeft);
		$this.setScrollY(component.getById('editor').scrollTop);
	};
	
	component.getById('editor').onDragEnter = function($event) { component.getById('editor').style.backgroundColor = 'rgb(245, 245, 245)'; };
	component.getById('editor').onDragLeave = function($event) { component.getById('editor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	component.getById('editor').onDragEnd = function($event) { component.getById('editor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	
	component.getById('editor').onDragOver = function($event)
	{
		//console.log('DRAG OVER');
	};
	
	component.getById('editor').onDrop = function($event)
	{
		console.log('ON DROP');
		console.log($event);
		
		var effectAllowed = $event.dataTransfer.effectAllowed;
		
		if (effectAllowed === "all")
		{
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			var imagesLibrary = initImagesLibrary();
			
			imagesLibrary.onImagesUpload = function($urls)
			{
				if (!isThereCodeOrQuoteTag && utils.isset($urls) && Array.isArray($urls))
				{
					for (var i = 0; i < $urls.length; i++)
					{
						$this.restoreSelection($this.getSelection());
						document.execCommand('insertImage', true, $urls[i]);
						scrollY = component.getById('editor').scrollTop;
						
						var imgList = component.getById('editor').getElementsByTagName('img');
						
						//for (var i = 0; i < imgList.length; i++)
							//imgList[i].style.maxWidth = "500px";
					}
					
					onChange();
				}
			};
			
			imagesLibrary.onDropFiles($event);
		}
	};
	
	component.getById('bbEditor').onDragEnter = function($event) { component.getById('bbEditor').style.backgroundColor = 'rgb(245, 245, 245)'; };
	component.getById('bbEditor').onDragLeave = function($event) { component.getById('bbEditor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	component.getById('bbEditor').onDragEnd = function($event) { component.getById('bbEditor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	
	component.getById('bbEditor').onDragOver = function($event)
	{
		//console.log('DRAG OVER');
	};
	
	component.getById('bbEditor').onDrop = function($event)
	{
		console.log('ON DROP');
		console.log($event);
		
		var effectAllowed = $event.dataTransfer.effectAllowed;
		
		if (effectAllowed === "all")
		{
			//$this.saveSelection();
			var imagesLibrary = initImagesLibrary();
			
			imagesLibrary.onImagesUpload = function($urls)
			{
				if (utils.isset($urls) && Array.isArray($urls))
				{
					var str = '';
					
					for (var i = 0; i < $urls.length; i++)
					{
						$this.restoreSelection($this.getSelection());
						str = str + '[img]' + $urls[i] + '[/img]';
					}
					
					replaceBBCodeWidth(str);
					
					onChange();
				}
			};
			
			imagesLibrary.onDropFiles($event);
		}
	};
	
	this.onFocus = function() {};
	
	var onFocus = function()
	{
		$this.setScrollY(component.getById('editor').scrollTop);
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		$this.onFocus();
	};

	component.getById('editor').addEvent('focus', function() { onFocus(); });
	component.getById('bbEditor').addEvent('focus', function() { onFocus(); });
	this.onBlur = function() {};
	
	var onBlur = function()
	{
		$this.setScrollY(component.getById('editor').scrollTop);
		$this.onBlur();
	};

	component.getById('editor').addEvent('blur', function() { onBlur(); });
	
	var onChange = function()
	{
		$this.setScrollY(component.getById('editor').scrollTop);
		$this.emptyHistoryFrom($this.getHistoryIndex());
		$this.addToHistory();
		$this.updateCode();
		$this.makeImagesDraggable();
		$this.onChange();
	};
	
	this.onChange = function() {};
	
	var onEditorChange = function($event)
	{
		$this.setScrollY(component.getById('editor').scrollTop);

		var shortcutModifier = Events.keyPressTable['ctrl'];
		
		if (/mac os x/.test(navigator.userAgent.toLowerCase().replace(" ", "")) || /macosx/.test(navigator.userAgent.toLowerCase().replace(" ", "")))
			shortcutModifier = $event.metaKey;
		
		if (shortcutModifier !== true)
		{
			var keys = [16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 91, 93,
						112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130];
			
			var arrowKeys = [37, 38, 39, 40];
			
			if (keys.indexOf($event.keyCode) < 0)
			{
				if ($event.keyCode === 9 && $event.type === 'keydown')
				{
					Events.preventDefault($event);
					document.execCommand('insertHTML', true, '	');
				}
				
				/*
				changeDate = new Date();
				
				changeTimer = setTimeout(function()
				{
					var currentDate = new Date();
	
					if (currentDate.getTime()-changeDate.getTime() >= 500)
					{
						onChange();
					}
					
				}, 500);
				//*/

				$this.onType(500, function() { onChange(); });
			}
			else if (arrowKeys.indexOf($event.keyCode) >= 0)
			{
				/*
				arrowDate = new Date();
				
				arrowTimer = setTimeout(function()
				{
					var currentDate = new Date();
	
					if (currentDate.getTime()-arrowDate.getTime() >= 500)
						$this.updateCursorInHistory($this.getHistoryIndex());
					
				}, 500);
				//*/

				$this.onTypeArrow(500, function() { $this.updateCursorInHistory($this.getHistoryIndex()); });
			}
		}
	};
	
	component.getById('editor').addEvent('keydown', onEditorChange);
	component.getById('editor').addEvent('keyup', onEditorChange);
	
	component.getById('editor').onClick = function()
	{
		$this.setScrollY(component.getById('editor').scrollTop);
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		$this.updateCursorInHistory($this.getHistoryIndex());
	};
	
	component.getById('bbEditor').addEvent('keydown', onEditorChange);
	component.getById('bbEditor').addEvent('keyup', onEditorChange);
	
	component.getById('bbEditor').onClick = function()
	{
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
	};
	
	this.onKeyDown = function($event)
	{
		var shortcutModifier = Events.keyPressTable['ctrl'];
		
		if (/mac os x/.test(navigator.userAgent.toLowerCase().replace(" ", "")) || /macosx/.test(navigator.userAgent.toLowerCase().replace(" ", "")))
			shortcutModifier = $event.metaKey;
	
		if (shortcutModifier === true)
		{
			var keylist = [66, 73, 80, 83, 87, 89, 90];
			
			if (keylist.indexOf($event.keyCode) >= 0)
			{
				Events.preventDefault($event);
				Events.stopPropagation($event);
			}
			
			// Pomme + B
			if ($event.keyCode === 66)
				applyStyle("bold");

			// Pomme + I
			else if ($event.keyCode === 73)
				applyStyle("italic");

			// Pomme + U
			else if ($event.keyCode === 85)
				applyStyle("underline");
		}
		// Gérer les sauts de ligne
		else if ($event.keyCode === 13)
		{
			if (Events.keyPressTable['shift'] === true)
			{
				/*
				if (mode === 'text')
				{
					Events.preventDefault($event);
					replaceBBCodeWidth('\n');
				}
				else
				//*/
				{
					Events.preventDefault($event);
					document.execCommand('insertText', true, '[br]' + $this.detectCaretStr);
					var htmlCode = component.getById('editor').innerHTML + "";
					component.getById('editor').innerHTML = htmlCode.replace('[br]', '<br />');
					$this.restoreCaret(false);
				}
			}
			/*
			else
			{
				if (mode === 'text')
				{
					Events.preventDefault($event);
					replaceBBCodeWidth('\n');
				}
			}
			//*/
			
			onChange();
		}
	};
	
	var undoRedo = function($redo)
	{
		if ($redo === true)
			$this.redo();
		else
			$this.undo();

		$this.updateCode();
		$this.setScrollY(component.getById('editor').scrollTop);
		$this.onChange();
	};

	this.onUndo = function($event) { undoRedo(false); };
	this.onRedo = function($event) { undoRedo(true); };
	
	var onPaste = function($event)
	{
		$this.setScrollY(component.getById('editor').scrollTop);

		// Récupération du contenu à coller
		
		var clipboardData = $event.clipboardData || window.clipboardData;
		var dataToPaste = clipboardData.getData('text/html');
		
		// Si le contenu HTML n'existe pas, récupérer le contenu texte pur et l'encadrer dans une balise de paragraphe
		
		if (!utils.isset(dataToPaste) || dataToPaste === '')
		{
			//var textPlain = clipboardData.getData('text/plain').replace(/</g, '&amp;#60;').replace(/>/g, '&amp;#62;');
			var textPlain = dataManager.encodeHTMLEntities(clipboardData.getData('text/plain')).replace(/&/g, '&amp;');
			//console.log("Texte pur : " + textPlain);
			dataToPaste = '<p>' + textPlain + '</p>';
		}
		else
		{
			console.log("HTML : " + dataToPaste);
			dataToPaste = dataToPaste.replace(/<br ?\/?>/ig, '[br]')
			console.log("HTML : " + dataToPaste);
		}
		
		// Purge des styles du contenu
		
		var nodeToFilter = document.createElement('div');
		nodeToFilter.innerHTML = dataToPaste.replace('<!DOCTYPE html>', '').replace('\n', '<br />').replace('[br]', '<br />');
		//htmlContentToPaste  = Format.parseHtmlNode(nodeToFilter, $this.getConfig());
		htmlContentToPaste  = Format.purgeNodeStyle(nodeToFilter, $this.getConfig());
		
		// Retrait d'ancres et de balises en trop
		
		if (utils.isset(htmlContentToPaste.firstChild) 
			&& utils.isset(htmlContentToPaste.firstChild.getAttribute) 
			&& htmlContentToPaste.firstChild.getAttribute('class') === "anchor")
		{
			htmlContentToPaste.removeChild(htmlContentToPaste.firstChild);
		}
		
		if (htmlContentToPaste.childNodes.length <= 1 && utils.isset(htmlContentToPaste.firstChild) && htmlContentToPaste.firstChild.nodeType !== Node.TEXT_NODE)
		{
			if (utils.isset(htmlContentToPaste.firstChild.firstChild) 
				&& utils.isset(htmlContentToPaste.firstChild.firstChild.getAttribute) 
				&& htmlContentToPaste.firstChild.firstChild.getAttribute('class') === "anchor")
			{
				htmlContentToPaste.firstChild.removeChild(htmlContentToPaste.firstChild.firstChild);
			}
			
			htmlContentToPaste.innerHTML = htmlContentToPaste.firstChild.innerHTML;
		}
		
		// Convertir le contenu à coller en bbCode
		
		bbCodeToPaste = Format.nodeToBBCode(htmlContentToPaste, $this.getConfig());
		
		// Nettoyage des balises de code
		
		if ($this.isThereCodeOrQuoteTag())
		{
			bbCodeToPaste = bbCodeToPaste.replace(/\[code=([ a-zA-Z0-9]+?)\]/gi, '');
			bbCodeToPaste = bbCodeToPaste.replace(/\[code=([a-zA-Z0-9]+?)&#160;hljs\]/gi, '');
			bbCodeToPaste = bbCodeToPaste.replace(/\[\/code\]/gi, '');
		}
		
		bbCodeToPaste = bbCodeToPaste.replace(/^\n{1,}/, '');
		bbCodeToPaste = bbCodeToPaste.replace(/\n{1,}$/, '');
		
		// Insertion du bb Code

		document.execCommand('insertHTML', true, bbCodeToPaste + $this.detectCaretStr);
		
		Events.preventDefault($event);
		
		$this.updateCode();
		
		// Reconversion du bb code en html
		
		component.getById('editor').innerHTML = Format.bbCodeToHTML(bbContent, $this.getConfig());
		
		// Repositionnement du curseur
		
		$this.restoreCaret(true);
		
		onChange();
	};
	
	component.getById('editor').addEventListener('paste', onPaste);
	
	this.onRemove = function()
	{
		if (Events.undo === $this.onUndo)
			Events.undo = doNothing;
		
		if (Events.redo === $this.onRedo)
			Events.redo = doNothing;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getBBContent = function() { return bbContent; };
	this.getHTMLContent = function() { return htmlContent; };
	this.getDefaultColor = function() { return defaultColor; };
	this.getColorsList = function() { return colorsList; };
	this.getLanguagesList = function() { return languagesList; };
	this.getImagesLibraryConfig = function() { return imagesLibraryConfig; };
	this.getMode = function() { return mode; };
	
	// SET
	
	var setContent = function()
	{
		component.getById('editor').innerHTML = htmlContent;
		component.getById('bbEditor').value = bbContent;
		$this.makeImagesDraggable();
	};

	this.setBBContent = function($bbContent)
	{
		bbContent = $bbContent;
		htmlContent = Format.bbCodeToHTML(bbContent, $this.getConfig());
		setContent();
	};
	
	this.setHTMLContent = function($htmlContent)
	{
		htmlContent = $htmlContent;
		$this.updateCode();
		setContent();
	};

	var updateButton = function($id, $display)
	{
		if ($display === true)
			component.getById($id).style.display = 'inline';
		else
			component.getById($id).style.display = 'none';
	};
	
	this.setBold = function($bold)
	{
		bold = $bold;
		updateButton('cold', bold);
	};
	
	this.setItalic = function($italic)
	{
		italic = $italic;
		updateButton('italic', italic);
	};
	
	this.setUnderline = function($underline)
	{
		underline = $underline;
		updateButton('underline', underline);
	};
	
	this.setStrike = function($strike)
	{
		strike = $strike;
		updateButton('strike', strike);
	};
	
	this.setFontSize = function($fontSize)
	{
		fontSize = $fontSize;
		updateButton('font-size', fontSize);
	};
	
	this.setFont = function($font)
	{
		font = $font;
		updateButton('font', font);
	};
	
	this.setTitle = function($title)
	{
		title = $title;
		updateButton('title', title);
	};
	
	this.setTextColor = function($textColor)
	{
		textColor = $textColor;
		updateButton('text-color', textColor);
	};
	
	this.setQuote = function($quote)
	{
		quote = $quote;
		updateButton('quote', quote);
	};
	
	this.setCode = function($code)
	{
		code = $code;
		updateButton('code', code);
	};
	
	this.setAlign = function($align)
	{
		align = $align;
		updateButton('align', align);
	};
	
	this.setLists = function($lists)
	{
		lists = $lists;
		updateButton('list', lists);
	};
	
	this.setTables = function($tables)
	{
		tables = $tables;
		updateButton('table', tables);
	};
	
	this.setLinks = function($links)
	{
		links = $links;
		
		if (links === true)
		{
			component.getById('url').style.display = 'inline';
			component.getById('links').style.display = 'inline';
		}
		else
		{
			component.getById('url').style.display = 'none';
			
			if (images === false)
				component.getById('links').style.display = 'none';
		}
	};
	
	this.setImages = function($images)
	{
		images = $images;
		
		if (images === true)
		{
			component.getById('img').style.display = 'inline';
			component.getById('links').style.display = 'inline';
		}
		else
		{
			component.getById('img').style.display = 'none';
			
			if (links === false)
				component.getById('links').style.display = 'none';
		}
	};
	
	this.setAddAnchor = function($addAnchor) { addAnchor = $addAnchor; };
	this.setKeepBR = function($keepBR) { keepBR = $keepBR; };
	
	this.setDefaultColor = function($defaultColor) { defaultColor = $defaultColor; };
	
	this.setColorsList = function($colorsList)
	{
		colorsList = $colorsList;
		
		for (var i = 0; i < colorsList.length; i++)
		{
			if (/^rgb/.test(colorsList[i]))
			{
				colorsList[i] = colorsList[i].replace(/ /gi, '');
				var rgb = colorsList[i].match(/^rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)$/);
				colorsList[i] = '#' + Colors.rgbToHex(rgb[1], rgb[2], rgb[3]);
				console.log(colorsList[i]);
			}
		}
	};
	
	this.setFontsList = function($fontList) { fontList = $fontList; };
	
	this.setLanguagesList = function($languagesList) { languagesList = $languagesList; };
	
	this.setImagesUploadMode = function($mode, $value) { imagesUploadModes[$mode] = $value; };
	this.setImagesUploadModes = function($imagesUploadModes) { imagesUploadModes = $imagesUploadModes; };
	this.setImagesLibraryConfig = function($imagesLibraryConfig) { imagesLibraryConfig = $imagesLibraryConfig; };
	this.setImgSecureURL = function($imgSecureURL) { imgSecureURL = $imgSecureURL; };
	
	this.setMode = function($mode)
	{
		if (mode !== $mode)
		{
			$this.updateCode();
			
			mode = $mode;
			
			if (mode === 'text')
			{
				component.getById('editor').style.display = 'none';
				component.getById('remove-format-block').style.display = 'none';
				component.getById('bbEditor').style.display = 'block';
			}
			else
			{
				component.getById('editor').style.display = 'block';
				component.getById('remove-format-block').style.display = 'inline-block';
				component.getById('bbEditor').style.display = 'none';
			}
		}
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Events.undo = $this.onUndo;
	Events.redo = $this.onRedo;
	return $this;
}

//if (Loader !== null && Loader !== undefined)
//	Loader.hasLoaded("contentEditable");