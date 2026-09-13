function ContentEditor($html)
{
	///////////////
	// Attributs //
	///////////////

	var component = new Component($html ? $html : '<div></div>');

	/*
{{INSERT CODE}}
	//*/

	this.detectCaretStr = "ChaineDeCaracteresAlaConQuePersonneNeTaperaJamaisCode" + Math.round(Math.random()*100000);
	var scrollX = 0;
	var scrollY = 0;

	var selection = null;
	var caretPosition = { node: component.getById('editor'), offset: 0 };
	var changeDate = new Date();
	var changeTimer = null;
	var arrowDate = new Date();
	var arrowTimer = null;
	var history = [];
	var historyIndex = 0;

	//////////////
	// Méthodes //
	//////////////

	//// Future fonction de formatage pour remplacer la native ////
	
	this.format = function($command, $param)
	{
		var inlineList = ['bold', 'italic', 'underline', 'strike', 'fontSize', 'foreColor', 'fontName', 'createLink', 'insertImage'];
		
		var blockList = ['formatBlock', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];

		/*
		const strongElement = document.createElement("strong");
	    const userSelection = window.getSelection();
    	const selectedTextRange = userSelection.getRangeAt(0);
    	selectedTextRange.surroundContents(strongElement);
		//*/
	};

	this.getCurrentSelection = function()
	{
		var sel = null;
		
		if (window.getSelection)
			sel = window.getSelection();
		else if (document.selection)
			sel = document.selection;

		return sel;
	};

	this.getRange = function()
	{
		var range = null;
		var sel = $this.getCurrentSelection();

		if (sel && sel.getRangeAt && sel.rangeCount)
			range = sel.getRangeAt(0);
		else if (sel && sel.createRange)
			range = sel.createRange();

		return range;
	};

	this.saveSelection = function()
	{
		selection = $this.getRange();
		return selection;
	};

	this.restoreSelection = function($range)
	{
		if ($range)
		{
			var sel = $this.getCurrentSelection();

			if (sel && sel.removeAllRanges && sel.addRange)
			{
				sel.removeAllRanges();
				sel.addRange($range);
			}
			else if (sel && $range.select)
				$range.select();
		}
	};

	this.nextNode = function($node)
	{
		var nextNode = null;
		var node = $node;
		
		if ($node.hasChildNodes())
			nextNode = $node.firstChild;
		else
		{
			while (node && !utils.isset(node.nextSibling))
				node = node.parentNode;
			
			if (utils.isset(node))
				nextNode = node.nextSibling;
		}
		
		return nextNode;
	};

	this.getSelectedNodes = function($range)
	{
		var node = $range.startContainer;
		var endNode = $range.endContainer;
		var nodesList = [];
		
		// Special case for a range that is contained within a single node
		if (node === endNode)
			nodesList = [node];
		else
		{
			// Iterate nodes until we hit the end container
			while (node && node != endNode)
			{
				node = $this.nextNode(node);
				nodesList.push(node);
			}
			
			// Add partially selected nodes at the start of the range
			node = $range.startContainer;
			
			while (node && node != $range.commonAncestorContainer)
			{
				nodesList.unshift(node);
				node = node.parentNode;
			}
		}
		
		return nodesList;
	};

	this.getNbCharBeforeCaret = function($caretNode, $node)
	{
		var nb = 0;
		var next = true;
		
		var childNodes = $node.childNodes;
		
		for (var i = 0; i < childNodes.length; i++)
		{
			var node = childNodes[i];
			
			if (node === $caretNode)
			{
				i = childNodes.length;
				next = false;
			}
			else if (node.nodeType === Node.TEXT_NODE)
				nb = nb + node.textContent.length;
			else
			{
				var response = $this.getNbCharBeforeCaret($caretNode, node);
				nb = nb + response.nb;
				
				if (response.next === false)
				{
					i = childNodes.length;
					next = false;
				}
			}
		}
		
		return { nb: nb, next: next };
	};

	this.getCaretPosition = function()
	{
		var position = 0;
		var sel = $this.getCurrentSelection();
		
		if (utils.isset(sel))
		{
			var nbCharBeforeCaret = $this.getNbCharBeforeCaret(sel.anchorNode, component.getById('editor')).nb;
			position = nbCharBeforeCaret + sel.anchorOffset;
		}
		
		return position;
	};

	this.getNodeAtPosition = function($node, $offset, $position)
	{
		var nodeToReturn = null;
		var currentPosition = $offset;
		
		var childNodes = $node.childNodes;
		
		for (var i = 0; i < childNodes.length; i++)
		{
			var node = childNodes[i];
			
			if (node.nodeType === Node.TEXT_NODE)
			{
				currentPosition = currentPosition + node.textContent.length;
				
				console.log("Current position : " + currentPosition);
				console.log(node.textContent);
				
				if (currentPosition > $position)
				{
					i = childNodes.length;
					nodeToReturn = node;
				}
			}
			else
			{
				var response = $this.getNodeAtPosition(node, currentPosition, $position);
				
				if (utils.isset(response.nodeToReturn))
				{
					i = childNodes.length;
					nodeToReturn = response.nodeToReturn;
				}
				else
					currentPosition = response.currentPosition;
			}
		}
		
		return { nodeToReturn: nodeToReturn, currentPosition: currentPosition };
	};

	//// Retourner le noeud où l'on a inséré la chaîne de sauvegarde de la position du curseur. ////
	
	this.getInsertNode = function($node)
	{
		var nodeToReturn = null;
		
		var childNodes = $node.childNodes;
		
		for (var i = 0; i < childNodes.length; i++)
		{
			var node = childNodes[i];
			
			if (node.nodeType === Node.TEXT_NODE)
			{
				if (node.textContent.indexOf($this.detectCaretStr) >= 0)
				{
					i = childNodes.length;
					nodeToReturn = node;
				}
			}
			else
			{
				var response = $this.getInsertNode(node);
				
				if (utils.isset(response))
				{
					i = childNodes.length;
					nodeToReturn = response;
				}
			}
		}
		
		return nodeToReturn;
	};

	//// Repositionner le curseur ////
	
	this.restoreCaret = function($moveScroll)
	{
		var caretNode = $this.getInsertNode(component.getById('editor'));
		
		if (utils.isset(caretNode))
		{
			var bbCaretPosition = bbContent.indexOf($this.detectCaretStr);
			bbContent = bbContent.replace($this.detectCaretStr, '');
			
			var saltPosition = caretNode.textContent.indexOf($this.detectCaretStr);
			var textContent = caretNode.textContent.replace($this.detectCaretStr, '');
			//console.log('Restore text content : "' + textContent + '"');
			caretNode.textContent = textContent;
			//console.log('Restored text content : "' + caretNode.textContent + '"');
			
			component.getById('bbEditor').value = bbContent;
			
			if (mode === 'text')
			{
				component.getById('bbEditor').setCaret(bbCaretPosition);
				component.getById('bbEditor').blur();
				component.getById('bbEditor').focus();
			}
			else
			{
				var sel = $this.getCurrentSelection();
				
				if (utils.isset(sel))
				{
					sel.deleteFromDocument();
					
					var range = new Range();
					range.setStart(caretNode, saltPosition);
					
					sel.removeAllRanges();
					sel.addRange(range);
				}
				
				// Repositionnement de l'ascenceur
				if ($moveScroll === true)
				{
					var span = document.createElement("span");
					
					if (utils.isset(span.getClientRects))
					{
						span.appendChild(document.createTextNode("\u200b"));
						range.insertNode(span);
						rect = span.getClientRects()[0];
						
						var newScrollY = scrollY;
						var editorPosition = component.getById('editor').position();
						var spanPosition = span.position();
						
						if (spanPosition.y - editorPosition.y < scrollY)
							newScrollY = spanPosition.y - editorPosition.y - span.offsetHeight;
						else if (spanPosition.y - editorPosition.y > scrollY + component.getById('editor').offsetHeight)
							newScrollY = spanPosition.y - editorPosition.y - component.getById('editor').offsetHeight + 3*span.offsetHeight;
						
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

	this.getSaltPosition = function($caretNode)
	{
		var saltPosition = $caretNode.textContent.indexOf($this.detectCaretStr);
		var textContent = $caretNode.textContent.replace($this.detectCaretStr, '');
		//console.log('Restore text content : "' + textContent + '"');
		$caretNode.textContent = textContent;
		//console.log('Restored text content : "' + caretNode.textContent + '"');

		return saltPosition;
	};

	this.updateSelection = function($caretNode, $saltPosition)
	{
		var range = null;
		var sel = $this.getCurrentSelection();
				
		if (utils.isset(sel))
		{
			sel.deleteFromDocument();
					
			range = new Range();
			range.setStart($caretNode, $saltPosition);
					
			sel.removeAllRanges();
			sel.addRange(range);
		}

		return range;
	};

	this.computeScroll = function($span, $range)
	{
		$span.appendChild(document.createTextNode("\u200b"));
		$range.insertNode($span);
		var rect = $span.getClientRects()[0];
		
		var newScrollX = scrollX;
		var newScrollY = scrollY;
		var editorPosition = component.getById('editor').position();
		var spanPosition = $span.position();
		
		if (spanPosition.x - editorPosition.x < scrollX)
			newScrollX = spanPosition.x - editorPosition.x - 10;
		else if (spanPosition.x - editorPosition.x > scrollX + component.getById('editor').offsetWidth)
			newScrollX = spanPosition.x - editorPosition.x - component.getById('editor').offsetWidth + 50;

		if (spanPosition.y - editorPosition.y < scrollY)
			newScrollY = spanPosition.y - editorPosition.y - $span.offsetHeight;
		else if (spanPosition.y - editorPosition.y > scrollY + component.getById('editor').offsetHeight)
			newScrollY = spanPosition.y - editorPosition.y - component.getById('editor').offsetHeight + 3*$span.offsetHeight;

		return { x: newScrollX, y: newScrollY };
	};

	//// Hierarchie du contenu ////

	var textNodes = [];

	this.getTextNodes = function() { return textNodes; };

	this.nodeToJSON = function($node, $offset)
	{
		var jsonData =
		{
			node: $node,
			offset: $offset,
			next: $offset,
			attributes: {},
			children: [],
		};

		if ($node.nodeType !== Node.TEXT_NODE)
		{
			var attributes = $node.attributes;
			var children = $node.childNodes;
			jsonData.textSize = 0;

			//console.log($node.tagName);

			if (attributes)
				Array.from(attributes).forEach(function($attribute) { jsonData.attributes[$attribute.name] = $attribute.value; });

			if (children && children.length > 0)
			{
				var childrenToParse = Array.from(children).filter(function($child)
				{
					return $child.nodeType === Node.TEXT_NODE 
							|| ($child.childNodes && $child.childNodes.length > 0)
							|| $child.tagName.toLowerCase() === 'br';
				});

				jsonData.children = childrenToParse.map(function($child)
				{
					var subData = $this.nodeToJSON($child, jsonData.next);
					jsonData.next = subData.next;
					return subData;
				});
			}
			else if ($node.tagName.toLowerCase() === 'br')
			{
				jsonData.node.jsonData = jsonData;
				jsonData.text = '\n';
				jsonData.textSize = 1;
				jsonData.next = jsonData.offset + 1;

				if (textNodes.length > 0)
				{
					jsonData.previousNode = textNodes[textNodes.length-1];
					textNodes[textNodes.length-1].nextNode = jsonData;
				}

				textNodes.push(jsonData);
			}
		}
		else
		{
			jsonData.node.jsonData = jsonData;
			jsonData.text = $node.textContent;
			jsonData.textSize = jsonData.text.length;
			jsonData.next = jsonData.offset + jsonData.text.length;

			if (textNodes.length > 0)
			{
				jsonData.previousNode = textNodes[textNodes.length-1];
				textNodes[textNodes.length-1].nextNode = jsonData;
			}

			textNodes.push(jsonData);
		}

		return jsonData;
	};

	this.getNodeHierarchy = function($node)
	{
		textNodes = [];
		var hierarchy = $this.nodeToJSON($node, 0);

		var slicedHierarchy =
		{
			node: $node,
			offset: 0,
			next: textNodes.length > 0 ? textNodes[textNodes.length-1].next : 0,
			attributes: {},
			children: [],
		};

		var row = { node: $node, offset: 0, next: 0, attributes: {}, children: [] };

		for (var i = 0; i < hierarchy.children.length; i++)
		{
			row.children.push(hierarchy.children[i]);

			if (i > 0 && i%1000 === 0)
			{
				row.next = hierarchy.children[i].next;
				slicedHierarchy.children.push(row);

				row =
				{
					node: $node,
					offset: hierarchy.children[i].next,
					next: hierarchy.children[i].next,
					attributes: {},
					children: []
				};
			}
		}

		row.next = hierarchy.next;
		slicedHierarchy.children.push(row);

		return slicedHierarchy;
	};

	this.getNodeFromTextCursor = function($json, $cursor)
	{
		var output = null;

		if ($json.children && $json.children.length > 0
			&& $cursor > $json.offset && $cursor <= $json.next)
		{
			for (var i = 0; i < $json.children.length; i++)
			{
				var child = $json.children[i];
				var subOuput = $this.getNodeFromTextCursor(child, $cursor);

				if (subOuput)
					return subOuput;
			}
		}
		else if ($cursor > $json.offset && $cursor <= $json.next)
		{
			$json.cursor = $cursor - $json.offset;
			return $json;
		}

		return output;
	};

	//// Gestion de l'historique ////

	this.updateUndoRedoButtons = function() {};

	var currentCaretNode = null;

	this.cloneForHistory = function($node)
	{
		var clone; 
	
		if ($node.tagName !== undefined)
		{
			// Création du clone
			clone = document.createElement($node.tagName); 
			
			// Attributs du noeuds
			var attributes = $node.attributes; 
			
			//console.log(this.attributes); 
			
			for (var i = 0; i < attributes.length; i++)
				clone.setAttribute(attributes[i].name, $node.getAttribute(attributes[i].name)); 
			
			// Parcours des enfants du noeud
			var children = $node.childNodes; 
		
			for (var i = 0; i < children.length; i++)
				clone.appendChild($this.cloneForHistory(children[i])); 
		}
		else 
			clone = document.createTextNode($node.nodeValue);
		
		if ($node === currentCaretNode.anchorNode)
		{
			//console.log("Insert node : " + $node.tagName);
			//console.log($node);
			var caretIndex = currentCaretNode.anchorOffset;
			
			if (utils.isset($node.tagName))
			{
				clone.insertAt(document.createTextNode($this.detectCaretStr), caretIndex);
			}
			else
				clone.textContent = $node.textContent.insertAt($this.detectCaretStr, caretIndex);
			
			//clone.innerHTML = $node.innerHTML.insertAt($this.detectCaretStr, caretIndex);
		}
		
		return clone; 
	};

	this.cloneCodeForHistory = function($editorBlockId)
	{
		var editorBlockId = $editorBlockId;

		if (!utils.isset(editorBlockId))
			editorBlockId = 'editor';

		var cloneCode = "";
		
		if (component.getById(editorBlockId).setSelectionRange)
		{
			cloneCode = component.getById(editorBlockId).value.substring(0, component.getById(editorBlockId).selectionStart)
							+ component.getById(editorBlockId).value.substring(component.getById(editorBlockId).selectionStart, component.getById(editorBlockId).selectionEnd)
							+ $this.detectCaretStr + component.getById(editorBlockId).value.substring(component.getById(editorBlockId).selectionEnd, component.getById(editorBlockId).value.length);
		}
		else
		{
			var range = document.selection.createRange();
			
			cloneCode = component.getById(editorBlockId).value.substring(0, range.startOffset)
							+ range.text 
							+ $this.detectCaretStr + component.getById(editorBlockId).value.substring(range.endOffset, component.getById(editorBlockId).value.length);
		}

        console.log(cloneCode);
		
		return cloneCode;
	};

	this.saveCurrentCaretNode = function()
	{
		if (window.getSelection)
			currentCaretNode = window.getSelection();
		else if (document.selection)
			currentCaretNode = document.selection;
	};

	this.addToHistory = function($content)
	{
		console.log("ADD TO HISTORY");
		
		var cloneCode = $content;

		$this.saveCurrentCaretNode();
		
		var clone = $this.cloneForHistory(component.getById('editor'));
		
        cloneCode = clone.innerText;
		
		if (cloneCode !== history[history.length-1])
			history.push(cloneCode);
		
		historyIndex = history.length-1;
		$this.updateUndoRedoButtons();
	};

	this.updateCursorInHistory = function($index, $content)
	{
		var cloneCode = $content;

		$this.saveCurrentCaretNode();
		
		var clone = $this.cloneForHistory(component.getById('editor'));

        cloneCode = clone.innerText;

		history[$index] = cloneCode;
		$this.updateUndoRedoButtons();
	};

	this.emptyHistoryFrom = function($index)
	{
		if ($index < history.length-1)
		{
			history.splice($index+1);
			$this.updateUndoRedoButtons();
			console.log("Vidage de l'historique après " + $index);
			console.log(history);
		}
	};

	this.emptyHistory = function($content)
	{
		history = [];
		history.push($content);
		historyIndex = 0;
		$this.updateUndoRedoButtons();
	};

	this.decrementeHistory = function($callback)
	{
		console.log("UNDO " + historyIndex);
		
		historyIndex--;
		
		if (historyIndex < 0)
			historyIndex = 0;
		else
			$callback(history[historyIndex]);
	};

	this.incrementeHistory = function($callback)
	{
		console.log("REDO " + historyIndex);

		historyIndex++;
		
		if (historyIndex >= history.length)
			historyIndex = history.length-1;
		else
			$callback(history[historyIndex]);
	};

	this.restoreScroll = function()
	{
		component.getById('editor').scrollLeft = scrollX;
		component.getById('editor').scrollTop = scrollY;
	};

	//// Gestion du clavier ////

	this.onType = function($delay, $callback)
	{
		changeDate = new Date();
		
		changeTimer = setTimeout(function()
		{
			var currentDate = new Date();

			if (currentDate.getTime()-changeDate.getTime() >= $delay)
				$callback();

		}, $delay);
	};

	this.onTypeArrow = function($delay, $callback)
	{
		arrowDate = new Date();
				
		arrowTimer = setTimeout(function()
		{
			var currentDate = new Date();
	
			if (currentDate.getTime()-arrowDate.getTime() >= $delay)
				$callback();
					
		}, $delay);
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getScrollX = function() { return scrollX; };
	this.getScrollY = function() { return scrollY; };
	this.getSelection = function() { return selection; };
	this.getHistory = function() { return history; };
	this.getHistoryIndex = function() { return historyIndex; };

	// SET

	this.setScrollX = function($scrollX) { scrollX = $scrollX; };
	this.setScrollY = function($scrollY) { scrollY = $scrollY; };
	this.pushHistory = function($content) { history.push($content); };
	this.setHistoryIndex = function($historyIndex) { historyIndex = $historyIndex; };

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	Events.undo = $this.onUndo;
	Events.redo = $this.onRedo;
	return $this;
}