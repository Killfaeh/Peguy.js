function CodeEditor($language)
{
	///////////////
	// Attributs //
	///////////////
	
	// Constantes
	
	var languageToken = 
	{
		'actionscript': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'ada': { inline: '--', commentStart: null, commentEnd: null },
		'bash': { inline: '#', commentStart: null, commentEnd: null },
		'basic': { inline: 'REM ', commentStart: null, commentEnd: null },
		'c': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'cpp': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'csharp': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'css': { inline: null, commentStart: '/*', commentEnd: '*/' },
		'dart': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'delphi': { inline: '//', commentStart: '(*', commentEnd: '*)' },
		'dos': { inline: 'REM ', commentStart: null, commentEnd: null },
		'erlang': { inline: '%', commentStart: null, commentEnd: null },
		'fortran': { inline: '!', commentStart: null, commentEnd: null },
		'gcode': { inline: ';', commentStart: '(', commentEnd: ')' },
		'glsl': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'gml': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'go': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'graphql': { inline: null, commentStart: '"""', commentEnd: '"""' },
		'haskell': { inline: '--', commentStart: '{-', commentEnd: '-}' },
		'html': { inline: null, commentStart: '<!--', commentEnd: '-->' },
		'java': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'javascript': { inline: '//', commentStart: '/*', commentEnd: '*/', blStart: '{', blEnd: '}' },
		'jsx': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'kotlin': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'latex': { inline: '%', commentStart: '\begin{comment}', commentEnd: '\end{comment}' },
		'lua': { inline: '--', commentStart: '--[[', commentEnd: ']]' },
		'matlab': { inline: '%', commentStart: '%{', commentEnd: '%}' },
		'ocaml': { inline: null, commentStart: '(*', commentEnd: '*)' },
		'perl': { inline: '#', commentStart: '=pod', commentEnd: '=cut' },
		'php': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'powershell': { inline: '#', commentStart: '<#', commentEnd: '#>' },
		'prolog': { inline: '%', commentStart: '/*', commentEnd: '*/' },
		'python': { inline: '#', commentStart: "'''", commentEnd: "'''" },
		'qml': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'r': { inline: '#', commentStart: null, commentEnd: null },
		'ruby': { inline: '#', commentStart: '=begin', commentEnd: '=end' },
		'scala': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'sql': { inline: null, commentStart: '/*', commentEnd: '*/' },
		'swift': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'twig': { inline: null, commentStart: '{#', commentEnd: '#}' },
		'typescript': { inline: '//', commentStart: '/*', commentEnd: '*/' },
		'vbnet': { inline: "'", commentStart: null, commentEnd: null },
		'vbscript': { inline: "'", commentStart: null, commentEnd: null },
		'vhdl': { inline: "--", commentStart: '/*', commentEnd: '*/' },
		'vim': { inline: "#", commentStart: null, commentEnd: null },
		'x86asm': { inline: ";", commentStart: null, commentEnd: null },
		'xml': { inline: null, commentStart: '<!--', commentEnd: '-->' },
		'yaml': { inline: "#", commentStart: null, commentEnd: null },
	};
	
	// Données
	
	var id = 'CodeEditor' + Math.round(Math.random()*100000);
	var language = $language;

	if (!utils.isset(language))
		language = "";
	
	// Eléments affichables
	
	var html = '<pre class="codeEditor" >'
					+ '<div id="highlighted-line" class="highlighted-line" ></div>'
					+ '<code id="same-layer" class="same-layer" ></code>'
					+ '<code id="render" class="render ' + language + '" ></code>'
					+ '<code id="search-layer" class="search-layer" ></code>'
					//+ '<code id="editor" class="editor" contenteditable="true" spellcheck="false" autocorrect="off" autocapitalize="off" ></code>'
					+ '<textarea id="editor" class="editor" spellcheck="false" autocorrect="off" autocapitalize="off" ></textarea>'
					+ '<div id="num-lines-block" class="num-lines" ><code id="num-lines" ></code></div>'
					+ '<div id="search-panel" class="search-panel" >'
						+ '<table>'
							+ '<tr>'
								+ '<td><input type="text" id="search-input" placeholder="Search" /></td>'
								+ '<td id="search-result" >No result</td>'
								+ '<td id="navigation" class="navigation" ></td>'
							+ '</tr>'
							+ '<tr>'
								+ '<td><input type="text" id="replace-input" placeholder="Replace" /></td>'
								+ '<td><input type="button" id="replace-button" value="Replace" /></td>'
								+ '<td><input type="button" id="replace-all-button" value="Replace all" /></td>'
							+ '</tr>'
							+ '<div id="close-search-icon" class="close-search-icon" >X</div>'
						+ '</table>'
					+ '</div>'
				+ '</pre>';

	var component = new ContentEditor(html);
	
	if (language === 'plaintext')
	{
		// Version temporaire
		component.getById('editor').style.color = 'rgb(200, 200, 200)';
		component.getById('render').style.color = 'rgba(200, 200, 200, 0)';
	}

	// Eléments graphiques 

	var downIcon = Loader.getSVG('icons', 'down-arrow-icon', 16, 16);
	var upIcon = Loader.getSVG('icons', 'up-arrow-icon', 16, 16);

	component.getById('navigation').appendChild(downIcon);
	component.getById('navigation').appendChild(upIcon);

	var sameLayer = component.getById('same-layer');
	var renderLayer = component.getById('render');
	var searchLayer = component.getById('search-layer');
	var editorLayer = component.getById('editor');

	/*
// Style

component.addConfigStyle("codeEditor", function ()
{
	return {
		common:
		{
	"multi-tag": {},
	"codeEditor": {
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })()
	},
	"editor": {
		"color": (function() { return STYLE.codeEditorColor; })(),
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })(),
		"border": (function() { return STYLE.codeEditorBorder; })(),
		"borderTop": (function() { return STYLE.codeEditorBorderTop; })(),
		"caretColor": (function() { return STYLE.codeEditorCaretColor; })()
	},
	"render": {
		"color": (function() { return STYLE.codeEditorColor; })(),
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })(),
		"border": (function() { return STYLE.codeEditorBorder; })(),
		"borderTop": (function() { return STYLE.codeEditorBorderTop; })()
	},
	"search-layer": {
		"color": (function() { return STYLE.codeEditorColor; })(),
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })(),
		"border": (function() { return STYLE.codeEditorBorder; })(),
		"borderTop": (function() { return STYLE.codeEditorBorderTop; })()
	},
	"same-layer": {
		"color": (function() { return STYLE.codeEditorColor; })(),
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })(),
		"border": (function() { return STYLE.codeEditorBorder; })(),
		"borderTop": (function() { return STYLE.codeEditorBorderTop; })()
	},
	"searched": {
		"color": (function() { return STYLE.codeEditorColor; })(),
		"background": (function() { return STYLE.codeEditorBackground; })()
	},
	"same": {
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })()
	},
	"editor::selection": {
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })(),
		"color": (function() { return STYLE.codeEditorColor; })()
	},
	"num-lines": {
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })(),
		"color": (function() { return STYLE.codeEditorColor; })(),
		"borderRight": (function() { return STYLE.codeEditorBorderRight; })(),
		"borderTop": (function() { return STYLE.codeEditorBorderTop; })()
	},
	"highlighted-line": {
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })(),
		"borderTop": (function() { return STYLE.codeEditorBorderTop; })(),
		"borderBottom": (function() { return STYLE.codeEditorBorderBottom; })()
	},
	"search-panel": {
		"border": (function() { return STYLE.codeEditorBorder; })(),
		"backgroundColor": (function() { return STYLE.codeEditorBackgroundColor; })()
	},
	"close-search-icon": {
		"color": (function() { return STYLE.codeEditorColor; })()
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

	// Gestion du clavier

	var keys = [16, 18, 17, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 91, 93,
				112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130];
	
	var arrowKeys = [37, 38, 39, 40];

	var delay = 250;

	// Données de fonctionnement
	
	var codeContent = "";
	var brNodes = [];
	var textNodes = [];
	var hierarchy = {};

	var currentNode = null;
	var startNode = null;
	var endNode = null;
	var selectedNodes = [];

	// Info de sélection

	var selection = null;

	var select =
	{
		start: 0,
		end: 0,
		focus: 0,
		previousLine: 0,
		currentLine: 0,
		word: ''
	};

	var startSelect = 0;
	var endSelect = 0;
	var focusPosition = 0;
	var previousLineNum = 0;
	var currentLineNum = 0;

	var wordOnCursor = '';
	var currentBlock = 0; // class des commentaires : hljs-comment
	var lastCharacter = null;

	// Recherche

	var searching = false;
	var searchOccurrences = [];
	var currentSearchOccurrences = 0;

	//////////////
	// Méthodes //
	//////////////

	//// Gestion du curseur ////

	// Lecture de la position

	this.getCurrentSelection = function()
	{
		var sel =
		{
			start: editorLayer.selectionStart,
			end: editorLayer.selectionEnd,
			focus: editorLayer.selectionEnd,
		};

		return sel;
	};

	this.saveSelection = function()
	{
		selection = $this.getCurrentSelection();

		startSelect = selection.start;
		endSelect = selection.end;
		focusPosition = selection.end;

		if (selection)
		{
			select.start = Math.min(startSelect, endSelect);
			select.end = Math.max(startSelect, endSelect);
			select.focus = focusPosition;
		};
		
		return selection;
	};

	// Forcer la position du curseur
	
	var setSelection = function($startOffset, $endOffset)
	{
		editorLayer.focus();
		editorLayer.setSelectionRange($startOffset, $endOffset);
		updateSelectData();

		requestAnimationFrame(function()
		{
			highlightLine(currentLineNum);
		});
	};

	this.restoreCaret = function($moveScroll)
	{
		//$this.updateNumLines();

		setSelection(select.start, select.end);

		updateSelectData();
		highlightLine(currentLineNum);

		/*
		if ($moveScroll && range)
		{
			var numElements = component.getById('num-lines').childNodes;

			if (numElements[currentLineNum] && numElements[currentLineNum].getClientRects)
			{
				var scroll = $this.computeScroll(numElements[currentLineNum], range);
				var newScrollX = scroll.x;
				var newScrollY = scroll.y;

				component.getById('editor').scrollTo(newScrollX, newScrollY);
				renderLayer.scrollTo(newScrollX, newScrollY);
				component.getById('search-layer').scrollTo(newScrollX, newScrollY);
				component.getById('same-layer').scrollTo(newScrollX, newScrollY);
			}
		}
		//*/
		
		$this.updateScroll();
	};
		
	this.selectAll = function()
	{
		var editorCode = getEditorCode();
		setSelection(0, editorCode ? editorCode.length : 0);
		updateSelectData();
		highlightLine(currentLineNum);
		updateSearchLayer();
	};

	this.moveCursorTo = function($cursor)
	{
		setSelection($cursor, $cursor);
		updateSelectData();
		highlightLine(currentLineNum);
		updateSearchLayer();
	};

	this.moveCursorToBeginningOfDocument = function()
	{
		$this.moveCursorTo(0);
	};

	this.moveCursorToEndOfDocument = function()
	{
		$this.moveCursorTo(getEditorCode().length+1);
	};

	this.moveCursorToBeginningLine = function()
	{
		var caretOffset = select.focus;
		var editorCode = getEditorCode();
		var startLine = editorCode.lastIndexOf('\n', caretOffset);
		var endLine = editorCode.indexOf('\n', caretOffset);

		$this.moveCursorTo(startLine+1);
	};

	this.moveCursorToEndLine = function()
	{
		var caretOffset = select.focus;
		var editorCode = getEditorCode();
		var startLine = editorCode.lastIndexOf('\n', caretOffset);
		var endLine = editorCode.indexOf('\n', caretOffset);

		$this.moveCursorTo(endLine);
	};

	this.moveCursorToBeginningWord = function()
	{
		var caretOffset = select.focus;
		var editorCode = getEditorCode();
		var startLine = editorCode.lastIndexOf('\n', caretOffset);
		var endLine = editorCode.indexOf('\n', caretOffset);
		var line = editorCode.slice(startLine, endLine);
		var localOffset = caretOffset - startLine;

		var dotIndex = delimiters.indexOf('.');
		
		if (dotIndex)
			delimiters.splice(dotIndex, 1);

		var wordStart = getWordStart(line, localOffset) + 1;
		var wordEnd = getWordEnd(line, localOffset);

		$this.moveCursorTo(startLine + wordStart);
	};

	this.moveCursorToEndWord = function()
	{
		var caretOffset = select.focus;
		var editorCode = getEditorCode();
		var startLine = editorCode.lastIndexOf('\n', caretOffset);
		var endLine = editorCode.indexOf('\n', caretOffset);
		var line = editorCode.slice(startLine, endLine);
		var localOffset = caretOffset - startLine;

		var dotIndex = delimiters.indexOf('.');
		
		if (dotIndex)
			delimiters.splice(dotIndex, 1);

		var wordStart = getWordStart(line, localOffset) + 1;
		var wordEnd = getWordEnd(line, localOffset);

		$this.moveCursorTo(startLine + wordEnd);
	};

	// Contenu sélectionné

	var getSelectedText = function()
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '')
			return codeEditor.substring(select.start, select.end);
		else
			return '';
	};

	var getTextBefore = function()
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '')
			return codeEditor.substring(0, select.start);
		else
			return '';
	};

	var getTextAfter = function()
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '')
			return codeEditor.substring(select.end, codeEditor.length);
		else
			return '';
	};
	
	// Lecture du contenu sélectionné
	
	var getLineNumFromOffset = function($offset)
	{
		var lineNum = 0;
		var codeEditor = getEditorCode();
		var codeBefore = codeEditor.slice(0, $offset);

		if (codeBefore && codeBefore !== '')
		{
			var linesBefore = codeBefore.split('\n');
			lineNum = linesBefore.length-1;
		}

		return lineNum;
	};

	var getLinesIndexFromOffset = function($start, $end)
	{
		var start = 0;
		var end = 0;
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '')
		{
			start = codeEditor.lastIndexOf('\n', $start-1);
			start = (start >= 0) ? start : 0;

			end = codeEditor.indexOf('\n', $end);
			end = (end >= 0) ? end : codeEditor.length;
		}

		return { start: start, end: end };
	};

	var delimitersStr = ' (){}[]%@&!#,`"<>.;:?*/=+-';
	var delimiters = ['\t', '\n', "'"];
	delimiters = delimiters.concat(Array.from(delimitersStr));

	var removeDelimiters = function($word)
	{
		return delimiters.reduce(function($w, $char)
		{
			return $w.replaceAll($char, '');
		}, $word);
	};

	var getWordStart = function($lineCode, $position)
	{
		return delimiters.reduce(function($pos, $char)
		{
			var index = $lineCode.lastIndexOf($char, $position);
			return (index > $pos && index < $position) ? index : $pos;
		}, -1);
	};

	var getWordEnd = function($lineCode, $position)
	{
		return delimiters.reduce(function($pos, $char)
		{
			var index = $lineCode.indexOf($char, $position);
			return (index < $pos && index >= $position) ? index : $pos;
		}, $lineCode.length);
	};

	var getSelectedWord = function()
	{
		var editorCode = getEditorCode();
		var lines = editorCode.split('\n');

		if (lines && lines.length > 0)
		{
			var lineCode = lines[select.currentLineNum];

			if (lineCode && lineCode !== '')
			{
				var lineOffset = editorCode.lastIndexOf('\n', select.focus);
				var wordStart = getWordStart(lineCode, lineOffset) + 1;
				var wordEnd = getWordEnd(lineCode, lineOffset);
				wordOnCursor = removeDelimiters(lineCode.slice(wordStart, wordEnd));
			}
		}

		return wordOnCursor;
	};

	// Lecture des noeuds sélectionnés

	var getNodeList = function($start, $end)
	{
		var start = ($start.node.parentNode === renderLayer) ? $start.node : $start.node.parentNode;
		var end = ($end.node.parentNode === renderLayer) ? $end.node : $end.node.parentNode;
		var iterNode = start;
		var nodesList = [];

		while (iterNode && iterNode !== end)
		{
			nodesList.push(iterNode);
			iterNode = iterNode.nextSibling;
		}

		nodesList.push(end);

		return nodesList;
	};

	var getSelectedNodes = function()
	{
		//$this.saveSelection();
		currentNode = $this.getNodeFromTextCursor(hierarchy, select.focus);
		startNode = $this.getNodeFromTextCursor(hierarchy, select.start);
		endNode = $this.getNodeFromTextCursor(hierarchy, select.end);

		if (startNode && endNode)
			selectedNodes = getNodeList(startNode, endNode);
		else
			selectedNodes = [];

		//console.log(currentNode, startNode, endNode, selectedNodes);
	};

	// Mise à jour des données sélectionnées

	var updateSelectData = function()
	{
		$this.saveSelection();
		
		previousLineNum = currentLineNum;
		currentLineNum = getLineNumFromOffset(select.focus);

		select.previousLine = previousLineNum;
		select.currentLineNum = currentLineNum;

		select.word = getSelectedWord();

		getSelectedNodes();
	};
	
	//// Gestion du scroll ////

	/*
	this.computeScroll = function($span, $range)
	{
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
	//*/

	this.updateNumLinesScroll = function()
	{
		var scrollTop = component.getById('editor').scrollTop;
		component.getById('num-lines').style.top = (-scrollTop) + 'px';
	};

	this.updateScroll = function()
	{
		//console.log("updateScroll");
		//Debug.callstack();
		var highlightedLineTop = 0;
		var highlightedNums = component.getById('num-lines').getElementsByClassName('highlighted-line');
		
		if (highlightedNums.length > 0)
			highlightedLineTop = highlightedNums[0].offsetTop;
		
		var searchPanelHeight = component.getById('search-panel').offsetHeight;
		var scrollWidth = renderLayer.scrollWidth;
		var scrollHeight = renderLayer.scrollHeight;
		var scrollerWidth = component.getById('editor').offsetWidth - component.getById('editor').clientWidth;
		var scrollerHeight = component.getById('editor').offsetHeight - component.getById('editor').clientHeight;
		var scrollLeftMax = scrollWidth - component.getById('editor').offsetWidth + scrollerWidth;
		var scrollTopMax = scrollHeight - component.getById('editor').offsetHeight + scrollerHeight;

		var scrollTop = component.getById('editor').scrollTop;
		var scrollLeft = component.getById('editor').scrollLeft;

		if (scrollTop > scrollTopMax)
			scrollTop = scrollTopMax;

		if (scrollLeft > scrollLeftMax)
			scrollLeft = scrollLeftMax;

		component.getById('editor').scrollTo(scrollLeft, scrollTop);
		var scrollHighlightedLine = searchPanelHeight + highlightedLineTop - scrollTop + 1;
		renderLayer.scrollTo(scrollLeft, scrollTop);
		component.getById('search-layer').scrollTo(scrollLeft, scrollTop);
		component.getById('same-layer').scrollTo(scrollLeft, scrollTop);
		$this.updateNumLinesScroll();
		$this.setScrollX(component.getById('editor').scrollLeft);
		$this.setScrollY(component.getById('editor').scrollTop);
		component.getById('highlighted-line').style.top = scrollHighlightedLine + 'px';
	};

	//// Surlignage des lignes ////
	
	var unlightAllLines = function()
	{
		var numLinesHTML = component.getById('num-lines').innerHTML;
		numLinesHTML = numLinesHTML.replaceAll('class="highlighted-line"', '');
		component.getById('num-lines').innerHTML = numLinesHTML;
	};
	
	var highlightLine = function($num)
	{
		unlightAllLines();
		
		var numElements = component.getById('num-lines').childNodes;
		
		if (numElements[$num])
		{
			var searchPanelHeight = component.getById('search-panel').offsetHeight;
			numElements[$num].setAttribute('class', 'highlighted-line');
			var highlightedLineTop = numElements[$num].offsetTop;
			var scrollTop = component.getById('editor').scrollTop;
			var scrollHighlightedLine = searchPanelHeight + highlightedLineTop - scrollTop + 1;
			component.getById('highlighted-line').style.top = scrollHighlightedLine + 'px';
			component.getById('highlighted-line').style.height = (numElements[$num].offsetHeight-2) + 'px';
		}
	};

	//// Gestion du champ de saisie ////

	var getEditorCode = function()
	{
		return component.getById('editor').value;
	};

	var setEditorCode = function($code)
	{
		component.getById('editor').value = $code;
	};
	
	//// Formatage du code ////

	// Empêcher l'interprétation du code HTML

	var cleanCodeToDisplay = function($code)
	{
		return $code.replaceAll('&', '&amp;')
					.replaceAll('<', '&lt;')
					.replaceAll('>', '&gt;');
	};

	// Mise à plat du HTML

	this.flatNodes = function($node)
	{
		var html = $node.outerHTML;

		var tagName = $node.tagName.toLowerCase();
		var children = $node.childNodes;
		var classValue = $node.getAttribute('class');

		if (children && children.length > 0)
		{
			html = '';

			for (var i = 0; i < children.length; i++)
			{
				var child = children[i];

				if (child.nodeType === Node.TEXT_NODE)
				{
					if (classValue && classValue !== '')
					{
						html = html + '<' + tagName + ' class="' + classValue + '" >' 
								+ cleanCodeToDisplay(child.nodeValue) 
								+ '</' + tagName + '>';
					}
					else
						html = html + cleanCodeToDisplay(child.nodeValue);
				}
				else if (child.tagName && child.tagName.toLowerCase() === 'br')
					html = html + '<br />';
				else
					html = html + $this.flatNodes(child);
			}
		}

		return html;
	};

	// Incrémentation des nombres présents dans une chaîne de caractères

	var incrementStrNumbers = function($input)
	{
		var output = $input;

		var matchNumbers = $input.match(/([0-9]+)/g);

		if (matchNumbers)
		{
			var words = $input.replace(/([0-9]+)/g, '{{NUM}}').split('{{NUM}}');
			var numbers = [];

			for (var i = 0; i < matchNumbers.length; i++)
				numbers.push(parseInt(matchNumbers[i])+1);

			output = words.map(function($word, $i) { return $word + (numbers[$i] ? numbers[$i] : ''); }).join('');
		}

		return output;
	};

	//// Mise à jour des calques de rendu ////

	// Mise à jour complète

	this.updateCode = function()
	{
		codeContent = getEditorCode();
		syntaxHighlightAll(); // Coloration syntaxique
		updateSearchLayer(); // Calques de recherche
		// Ajouter un calque d'affichage des espaces et des tabulations
		$this.updateNumLines(); // Colonne des numéros de lignes
		$this.updateScroll(); // Mise à jour de la position du scroll pour touts les calques
		highlightLine(currentLineNum); // Suligner la ligne où se trouve le curseur
	};

	// Mise à jour du code dans le calque de rechercher

	var updateSearchLayer = function()
	{
		var originalCode = cleanCodeToDisplay(getEditorCode());
		var searchCode = originalCode;
		var sameCode = originalCode;
		var criteria = component.getById('search-input').value;

		//console.log('wordOnCursor : "' + wordOnCursor + '"');

		if (utils.isset(wordOnCursor) && wordOnCursor !== '')
		{
			var cleanedWordOnCursor = cleanCodeToDisplay(wordOnCursor);
			sameCode = sameCode.replaceAll(cleanedWordOnCursor, '<span class="same" >' + cleanedWordOnCursor + '</span>');
		}

		//console.log('criteria : "' + criteria + '"');

		if (searching === true && utils.isset(criteria) && criteria)
		{
			var cleanedCriteria = cleanCodeToDisplay(criteria);
			searchCode = searchCode.replaceAll(cleanedCriteria, '<span class="searched" >' + cleanedCriteria + '</span>');
		}

		//console.log(searchCode);

		component.getById('search-layer').innerHTML = searchCode;
		component.getById('same-layer').innerHTML = sameCode;
	};
	
	// Coloration syntaxique du code source complet

	var updateHierarchy = function()
	{
		var startTime = (new Date()).getTime();
		//console.log('	UPDATE HIERARCHY ');

		hierarchy = $this.getNodeHierarchy(renderLayer);
		brNodes = renderLayer.getElementsByTagName('br');

		var endTime = (new Date()).getTime();
		//console.log('	UPDATE HIERARCHY ', endTime - startTime);
	};

	var syntaxHighlightAll = function()
	{
		var startTime = (new Date()).getTime();
		//console.log('START syntaxHighlightAll');

		if (language !== 'plaintext' && typeof hljs !== 'undefined' && hljs !== null)
		{
			var highlightedCodeAll = hljs.highlight(codeContent, { language: language, ignoreIllegals: true }).value;

			var div = document.createElement('div');
			div.innerHTML = highlightedCodeAll.replaceAll('\n', '<br />');
			var flatHTML = $this.flatNodes(div);
			//console.log(flatHTML);

			renderLayer.innerHTML = flatHTML;
		}
		else
			renderLayer.innerHTML = cleanCodeToDisplay(codeContent).replaceAll('\n', '<br />');

		updateHierarchy();
		updateSelectData();
		
		var endTime = (new Date()).getTime();
		//console.log('END syntaxHighlightAll', endTime - startTime);
	};

	//// Mises à jour locales des noeuds ////

	// Mise à jour du noeud en cours d'édition

	var updateNode = function($node, $text)
	{
		var finalNode = $node;

		if ($node.node.tagName && $node.node.tagName.toLowerCase() === 'br')
		{
			var textNode = document.createTextNode($text);
			renderLayer.insertAfter(textNode, $node.node);

			var finalNode =
			{
				node: textNode,
				offset: $node.next,
				next: $node.next + $text.length,
				text: $text,
				textSize: $text.length,
			};

			//console.log(finalNode);
		}
		else
		{
			$node.node.nodeValue = $text;
			$node.text = $text;
			$node.textSize = $text.length;
		}

		return finalNode;
	};

	var insertInNode = function($node, $text, $startSelect, $endSelect)
	{
		var nodeToEdit = $node;
		var localStart = $startSelect - (nodeToEdit.offset ? nodeToEdit.offset : 0);
		var localEnd = $endSelect - (nodeToEdit.offset ? nodeToEdit.offset : 0);

		if (localStart >= nodeToEdit.length && localEnd > nodeToEdit.length && nodeToEdit.nextNode)
			insertInNode(nodeToEdit.nextNode, $text, $startSelect, $endSelect);
		else
		{
			var newText = nodeToEdit.text ? nodeToEdit.text : renderLayer.innerText;
			newText = (newText === '\n') ? $text : [newText.slice(0, localStart), $text, newText.slice(localEnd)].join('');
			nodeToEdit.text = newText;

			if (nodeToEdit.node)
			{
				startNode = updateNode(nodeToEdit, newText);
				endNode = startNode;
				//startSelect = $startSelect + $text.length;
				//endSelect = startSelect;
			}
			else
				renderLayer.innerHTML = cleanCodeToDisplay(newText);
		}
	};

	var removeNodes = function($start, $end)
	{
		if ($start && $start !== $end)
		{
			var nodesToDelete = getNodeList($start, $end);

			for (var i = 0; i < nodesToDelete.length-1; i++)
				nodesToDelete[i].remove();
		}
	};

	var replaceNodes = function($text)
	{
		var localStart = select.start - (startNode.offset ? startNode.offset : 0);
		var localEnd = select.end - (endNode.offset ? endNode.offset : 0);

		var newText = startNode.text ? startNode.text : renderLayer.innerText;

		if (startNode.node)
		{
			var startText = (newText === '\n') ? $text : [newText.slice(0, localStart), $text].join('');
			startNode = updateNode(startNode, startText);

			if (endNode.node.nodeType === Node.TEXT_NODE)
			{
				var endText = endNode.text.slice(localEnd);
				updateNode(endNode, endText);
			}

			var startToDelete = startNode.nextNode ? startNode.nextNode : startNode;
			var endToDelete = endNode;

			if (endNode.node.tagName && endNode.node.tagName === 'br')
				endToDelete = endNode.nextNode ? endNode.nextNode : endNode;

			removeNodes(startToDelete, endToDelete);
		}
		else
		{
			newText = [newText.slice(0, localStart), $text, newText.slice(localEnd)].join('');
			renderLayer.innerHTML = cleanCodeToDisplay(newText);
		}

		//endSelect = startSelect + $text.length;
		endNode = startNode;
		//previousLineNum = currentLineNum;
		currentLineNum = getLineNumFromOffset(select.start);
		highlightLine(currentLineNum);
	};

	var updateCurrentNode = function($text)
	{
		if (language !== 'plaintext')
		{
			//updateSelectData();

			if (startNode === endNode)
			{
				//var caretOffset = select.focus;
				var caretNode = startNode;

				if (caretNode)
					insertInNode(caretNode, $text, select.start, select.end);
			}
			else if (startNode !== endNode)
				replaceNodes($text);

			var codeToDisplay = cleanCodeToDisplay(getEditorCode());
			component.getById('search-layer').innerHTML = codeToDisplay;
			component.getById('same-layer').innerHTML = codeToDisplay;
		}
		else
			$this.updateCode();
	};
	
	// Suppression du contenu de la sélection

	var deleteOne = function($node, $forward)
	{
		var nodeToEdit = $node.node;

		if ($forward)
		{
			var localStart = startSelect - (startNode.offset ? startNode.offset : 0);
			var newText = $node.text ? $node.text : renderLayer.innerText;

			if (localStart >= $node.textSize)
			{
				if (nodeToEdit.parentNode !== renderLayer)
					nodeToEdit = nodeToEdit.parentNode;

				nodeToEdit = nodeToEdit.nextSibling;

				while (nodeToEdit 
						&& nodeToEdit.nodeType !== Node.TEXT_NODE && nodeToEdit.innerHTML === ''
							&& nodeToEdit.tagName.toLowerCase() !== 'br')
				{
					nodeToEdit = nodeToEdit.nextSibling;
				}

				if (nodeToEdit && nodeToEdit.tagName && nodeToEdit.tagName.toLowerCase() === 'br')
					nodeToEdit.remove();
				else if (nodeToEdit)
				{
					if (nodeToEdit.nodeType !== Node.TEXT_NODE)
						nodeToEdit = nodeToEdit.firstChild;

					if (nodeToEdit.nodeValue)
						nodeToEdit.nodeValue = nodeToEdit.nodeValue.slice(1);

					if (!nodeToEdit.nodeValue || nodeToEdit.nodeValue === '')
						nodeToEdit.remove();
				}
			}
			else
			{
				newText = [newText.slice(0, localStart), newText.slice(localStart+1)].join('');
				$node.node.nodeValue = newText;
				$node.text = newText;
				$node.textSize = newText.length;
			}
		}
		else
		{
			if ($node.node.tagName && $node.node.tagName.toLowerCase() === 'br')
			{
				startNode = $node.node.previousSibling ? $node.node.previousSibling : $node.node.nextSibling;
				endNode = startNode;
				$node.node.remove();
			}
			else
			{
				var localStart = startSelect - (startNode.offset ? startNode.offset : 0);
				var newText = $node.text ? $node.text : renderLayer.innerText;

				if (localStart <= 0)
				{
					//console.log($node);

					var parentNode = nodeToEdit ? nodeToEdit.parentNode : $node.parentNode;

					if (parentNode !== renderLayer)
						nodeToEdit = nodeToEdit.parentNode;

					nodeToEdit = nodeToEdit.previousSibling;

					while (nodeToEdit 
							&& nodeToEdit.nodeType !== Node.TEXT_NODE && nodeToEdit.innerHTML === ''
								&& nodeToEdit.tagName.toLowerCase() !== 'br')
					{
						nodeToEdit = nodeToEdit.previousSibling;
					}

					if (nodeToEdit.tagName && nodeToEdit.tagName.toLowerCase() === 'br')
						nodeToEdit.remove();
					else if (nodeToEdit)
					{
						if (nodeToEdit.nodeType !== Node.TEXT_NODE)
							nodeToEdit = nodeToEdit.firstChild;

						if (nodeToEdit.nodeValue)
						{
							var original = nodeToEdit.nodeValue;
							nodeToEdit.nodeValue = original.slice(0, original.length-1);
						}

						if (!nodeToEdit.nodeValue || nodeToEdit.nodeValue === '')
							nodeToEdit.remove();
					}
				}
				else
				{
					newText = [newText.slice(0, localStart-1), newText.slice(localStart)].join('');
					$node.parentNode = nodeToEdit.parentNode;
					$node.node.nodeValue = newText;
					$node.text = newText;
					$node.textSize = newText.length;
				}
			}

			startSelect = startSelect - 1;
			endSelect = startSelect;
		}
	};
	
	//// Manipulation des lignes ////

	// Saut de ligne

	var lineBreak = function()
	{
		var tabs = '';
		
		updateSelectData();
		
		if (language !== 'plaintext')
		{
			var codeBefore = getTextBefore();
			var linesBefore = codeBefore.split('\n');
			var codeAfter = getTextAfter();
			var linesAfter = codeAfter.split('\n');
			var previousLine = linesBefore[linesBefore.length-2];
			var nextLine = linesAfter[0];

			if (previousLine)
			{
				var matchTab = previousLine.match(/^[ 	]*/);

				if (matchTab)
				{
					tabs = matchTab[0];

					if (!/^[ 	]+/.test(nextLine))
						tabs = tabs + (/{[ 	]*$/.test(previousLine) ? '	' : '');
				}
			}
		}

		updateCurrentNode('\n' + tabs);
		insertText('\n' + tabs);
		updateHierarchy();
		updateSelectData();
		highlightLine(currentLineNum);

		return tabs;
	};

	// Supprimer une ligne

	this.deleteLine = function()
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '')
		{
			updateSelectData();

			var startLineNum = getLineNumFromOffset(select.start);
			var endLineNum = getLineNumFromOffset(select.end);
			var startBR = brNodes[startLineNum-1] ? brNodes[startLineNum-1] : renderLayer.firstChild;
			var endBR = brNodes[endLineNum] ? brNodes[endLineNum] : renderLayer.lastChild;

			removeNodes(startBR.jsonData, endBR.jsonData);

			var startOffset = select.start;
			var endOffset = select.end;
			var lineIndex = getLinesIndexFromOffset(select.start, select.end);

			var startTmp = lineIndex.start;
			var endTmp = lineIndex.end;

			var codeCenter = codeEditor.slice(startTmp, endTmp);
			var codeLinesBefore = codeEditor.slice(0, startTmp);
			var codeLinesAfter = codeEditor.slice(endTmp+1);
			var linesCenter = codeCenter.split('\n');
			var linesBefore = codeLinesBefore.split('\n');
			var linesAfter = codeLinesAfter.split('\n');

			if (startTmp <= 0)
				endTmp = endTmp + 1;
			else if (endTmp >= codeEditor.length)
				endTmp = endTmp + 2;

			var localStart = startOffset - startTmp;
			var localEnd = endOffset - codeEditor.lastIndexOf('\n', endOffset+1);

			if (localEnd <= 0)
				startOffset = startTmp + Math.min(linesCenter[linesCenter.length-1].length + 1, linesAfter[0].length + 1);
			else
				startOffset = startTmp + ((localEnd > 0 && localEnd < linesAfter[0].length) ? localEnd : linesAfter[0].length + 1);

			endOffset = startOffset;

			requestAnimationFrame(function()
			{
				insertText('', false, startTmp, endTmp);
				setSelection(startOffset, endOffset);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
			});
		}
	};

	// Dupliquer une ligne

	this.duplicateLine = function($up, $incr)
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '' && select.start === select.end)
		{
			updateSelectData();
			var caretOffset = select.focus;

			var lineNum = getLineNumFromOffset(caretOffset);
			var startBR = brNodes[lineNum-1] ? brNodes[lineNum-1] : renderLayer.firstChild;
			var endBR = brNodes[lineNum] ? brNodes[lineNum] : renderLayer.lastChild;

			var nodesToDuplicate = getNodeList(startBR.jsonData, endBR.jsonData);

			var clones = [];

			for (var i = 0; i < nodesToDuplicate.length-1; i++)
			{
				var nodeToDuplicate = nodesToDuplicate[i];
				var clone = nodesToDuplicate[i].clone();

				if ($incr)
				{
					if (clone.nodeType !== Node.TEXT_NODE && $incr)
						clone.innerHTML = incrementStrNumbers(clone.innerHTML);
					else
						clone.nodeValue = incrementStrNumbers(clone.nodeValue);
				}

				clones.push(clone);
			}

			if (endBR)
				renderLayer.insertChildrenBefore(clones, endBR);
			else
				renderLayer.appendChildren(clones);

			var editorCode = getEditorCode();

			var lineIndex = getLinesIndexFromOffset(caretOffset, caretOffset);

			var startTmp = lineIndex.start;
			var endTmp = lineIndex.end;

			var codeCenter = editorCode.slice(startTmp, endTmp).removeAll('\n');

			if ($incr)
				codeCenter = incrementStrNumbers(codeCenter);

			if ($up)
				endTmp = startTmp;
			else
			{
				startTmp = endTmp;
				caretOffset = caretOffset + codeCenter.length;
			}

			requestAnimationFrame(function()
			{
				insertText('\n' + codeCenter, false, startTmp, endTmp);
				setSelection(caretOffset, caretOffset);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
			});
		}
	};

	this.switchLines = function($up)
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '' && select.start === select.end)
		{
			updateSelectData();
			var caretOffset = select.focus;

			var lineNum = getLineNumFromOffset(caretOffset);
			var lines = getEditorCode().split('\n');

			if (($up && lineNum > 0) || (!$up && lineNum < lines.length-1))
			{
				var startLine = lines[lineNum-1];
				var endLine = lines[lineNum];

				var prevBR = brNodes[lineNum-2];
				var currentBR = brNodes[lineNum-1];
				var nextBR = brNodes[lineNum];

				var localOffset = caretOffset - currentBR.jsonData.next;

				if (!$up)
				{
					startLine = lines[lineNum];
					endLine = lines[lineNum+1];

					prevBR = brNodes[lineNum-1];
					currentBR = brNodes[lineNum];
					nextBR = brNodes[lineNum+1];

					localOffset = caretOffset - (prevBR ? prevBR.jsonData.next : 0);
				}

				var nodesToSwitch = getNodeList(currentBR.jsonData, nextBR.jsonData);
				var nodesToMove = nodesToSwitch.slice(1);
				
				if (nextBR)
					nodesToMove.push(nextBR);
				else
					nodesToMove.push(document.createElement('br'));

				if (prevBR)
					renderLayer.insertChildrenAfter(nodesToMove, prevBR);
				else
				{
					var firstNode = renderLayer.firstChild;
					renderLayer.insertChildrenBefore(nodesToMove, firstNode);
				}

				var tmpCode =  endLine + '\n' + startLine;
				console.log(tmpCode);

				var startTmp = prevBR ? prevBR.jsonData.next : 0;
				var endTmp = nextBR ? nextBR.jsonData.offset : getEditorCode().length;

				if ($up)
					caretOffset = localOffset + ((prevBR) ? prevBR.jsonData.next : 0);
				else
					caretOffset = localOffset + ((prevBR) ? prevBR.jsonData.next : 0) + endLine.length + 1;

				requestAnimationFrame(function()
				{
					insertText(tmpCode, false, startTmp, endTmp);
					setSelection(caretOffset, caretOffset);
					updateHierarchy();
					updateSelectData();
					highlightLine(currentLineNum);
				});
			}
		}
	};

	// Fusionner plusieurs lignes

	this.mergeLines = function()
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '')
		{
			updateSelectData();

			var tmpCode = getEditorCode();

			var startLineNum = getLineNumFromOffset(select.start);
			var startIndex = tmpCode.lastIndexOf('\n', select.start);
			startIndex = (startIndex >= 0) ? startIndex : 0;

			var endIndex = tmpCode.indexOf('\n', select.end);
			endIndex = (endIndex >= 0) ? endIndex : tmpCode.length;

			var startTmp = startIndex+1;
			var endTmp = endIndex;

			var codeCenter = tmpCode.slice(startTmp, endTmp);
			var lines = codeCenter.split('\n');

			if (lines.length > 1)
			{
				var startLine = lines[0];
				lines = lines.slice(1);

				var brToDelete = [];

				for (var i = 0; i < lines.length; i++)
					brToDelete.push(brNodes[startLineNum + i]);

				for (var i = 0; i < brToDelete.length; i++)
				{
					if (brToDelete[i].jsonData && brToDelete[i].jsonData.nextNode)
						brToDelete[i].jsonData.nextNode.node.nodeValue = ' ' + brToDelete[i].jsonData.nextNode.node.nodeValue.replace(/^[ 	]*/, '').replace(/[ 	]*$/, '').trim();

					brToDelete[i].remove();
				}

				var tmpCode = startLine.trimEnd() + ' ' + lines.map(function($line, $i)
				{
					return $line.replace(/^[ 	]*/, '').replace(/[ 	]*$/, '').trim();
				}).join(' ');

				requestAnimationFrame(function()
				{
					insertText(tmpCode, true, startTmp, endTmp);
					var caretOffset = startTmp + tmpCode.length;
					setSelection(caretOffset, caretOffset);
					updateHierarchy();
					updateSelectData();
					highlightLine(currentLineNum);
				});
			}
		}
	};

	//// Modifications du code ////

	// Insertion de texte

	var insertText = function($text, $select, $start, $end)
	{
		//console.log('INSERT : ' + $text);
		//updateSelectData();

		var start = $start ? $start : select.start;
		var end = $end ? $end : select.end;
		editorLayer.focus();
		editorLayer.setRangeText($text, start, end, $select ? 'select' : 'end');

		if ($start || $end)
			updateSelectData();

		$this.onType(delay, function() { onChange(); });
	};

	// Suppression de texte

	var removeText = function($event, $forward)
	{
		if (language !== 'plaintext')
		{
			if (select.start !== select.end)
				updateCurrentNode('');
			else if (startNode)
				deleteOne(startNode, $forward);

			var codeToDisplay = cleanCodeToDisplay(getEditorCode());
			component.getById('search-layer').innerHTML = codeToDisplay;
			component.getById('same-layer').innerHTML = codeToDisplay;
		}
		else
			$this.updateCode();
	};

	// Baliser le contenu de la sélection

	var surround = function($start, $end, $esc)
	{
		updateSelectData();
		var extract = getSelectedText();

		if (extract && extract !== '')
		{
			var startOffset = select.start;
			var endOffset = select.end;
			var startTmp = startOffset;
			var endTmp = endOffset;
			var tmpCode = getEditorCode();
			var before = tmpCode.slice(0, select.start);
			var after = tmpCode.slice(select.end);
			var center = tmpCode.slice(select.start, select.end);

			var startRegexStr = $start.formatRegex();
			var endRegexStr = $end.formatRegex();

			if ($esc)
			{
				startRegexStr = startRegexStr.replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('[', '\\[').replaceAll(']', '\\]');
				endRegexStr = endRegexStr.replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('[', '\\[').replaceAll(']', '\\]');
			}

			var tabRegexStr = '([ 	]*)';
			var beforeRegexStr = startRegexStr + tabRegexStr + '$';
			var centerBeforeRegexStr = '^' + tabRegexStr + startRegexStr + tabRegexStr;
			var centerAfterRegexStr = tabRegexStr + endRegexStr + tabRegexStr + '$';
			var afterRegexStr = '^' + tabRegexStr + endRegexStr;

			/*
			console.log(beforeRegexStr);
			console.log(centerBeforeRegexStr);
			console.log(centerAfterRegexStr);
			console.log(afterRegexStr);
			//*/

			var tabRegex = new RegExp(tabRegexStr);
			var beforeRegex = new RegExp(beforeRegexStr);
			var centerBeforeRegex = new RegExp(centerBeforeRegexStr);
			var centerAfterRegex = new RegExp(centerAfterRegexStr);
			var afterRegex = new RegExp(afterRegexStr);

			var matchBefore = before.match(beforeRegex);
			var matchCenterBefore = center.match(centerBeforeRegex);
			var matchCenterAfter = center.match(centerAfterRegex);
			var matchAfter = after.match(afterRegex);

			var startNodeToEdit = startNode;
			var endNodeToEdit = endNode;

			if (!matchBefore && !matchCenterBefore && !matchAfter && !matchCenterAfter)
			{
				startTmp = before.length;
				endTmp = startTmp + center.length;
				center = $start + center + $end;
				
				insertInNode(startNodeToEdit, $start, startOffset, startOffset);
				insertInNode(endNodeToEdit, $end, endOffset, endOffset);
			}
			else
			{
				if (matchBefore)
				{
					var startIndex = before.lastIndexOf($start);
					startTmp = (startIndex >= 0) ? startIndex : startTmp;
					insertInNode(startNodeToEdit, '', startOffset - matchBefore[0].length, startOffset);
				}

				if (matchAfter)
				{
					var endIndex = after.indexOf($end);
					endIndex = endIndex + ((endIndex >= 0) ? $end.length : 0);
					endTmp = startOffset + center.length + ((endIndex >= 0) ? endIndex : 0);
					insertInNode(endNodeToEdit, '', endOffset, endOffset + matchAfter[0].length);
				}

				if (matchCenterBefore)
					insertInNode(startNodeToEdit, '', startOffset, startOffset + matchCenterBefore[0].length);

				if (matchCenterAfter)
					insertInNode(endNodeToEdit, '', endOffset - matchCenterAfter[0].length, endOffset);

				center = center.replace(centerBeforeRegex, '');
				center = center.replace(centerAfterRegex, '');
			}
			
			startOffset = startTmp;
			endOffset = startOffset + center.length;

			requestAnimationFrame(function()
			{
				insertText(center, false, startTmp, endTmp);
				setSelection(startOffset, endOffset);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
			});
		}
		else
		{
			var codeToInsert = $start + '{{CURSOR}}' + $end;
			$this.insertCode(codeToInsert, false);
		}
	};

	// Insert/remove tab

	this.insertTab = function($remove)
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '')
		{
			updateSelectData();

			var tmpCode = getEditorCode();

			var startOffset = select.start;
			var endOffset = select.end;

			var startLineNum = getLineNumFromOffset(startOffset);
			var startIndex = tmpCode.lastIndexOf('\n', startOffset);
			startIndex = (startIndex >= 0) ? startIndex : 0;

			var endIndex = tmpCode.indexOf('\n', endOffset);
			endIndex = (endIndex >= 0) ? endIndex : tmpCode.length;

			var startTmp = startIndex+1;
			var endTmp = endIndex;

			var codeCenter = tmpCode.slice(startTmp, endTmp);
			var lines = codeCenter.split('\n');

			var newLines = lines.map(function($line, $i)
			{
				var startBR = brNodes[startLineNum + $i - 1];
				var endBR = brNodes[startLineNum + $i] ? brNodes[startLineNum + $i] : brNodes[brNodes.length-1];

				var nodesInterval = getNodeList(startBR.jsonData, endBR.jsonData);

				for (var j = 0; j < nodesInterval.length; j++)
				{
					nodeInterval = nodesInterval[j];

					if (nodeInterval.tagName && nodeInterval.tagName.toLowerCase() !== 'br')
						nodeInterval = nodeInterval.firstChild;
					else if (nodeInterval.nodeType !== Node.TEXT_NODE)
						nodeInterval = null;

					if (nodeInterval)
					{
						if ($remove === true)
							nodeInterval.jsonData.text = nodeInterval.jsonData.text.remove(/^	/);
						else
							nodeInterval.jsonData.text = '	' + nodeInterval.jsonData.text;

						nodeInterval.jsonData.textSize = nodeInterval.jsonData.text.length;
						nodeInterval.nodeValue = nodeInterval.jsonData.text;
						j = nodesInterval.length;
					}
				}
				
				if ($remove === true)
				{
					if (/^	/.test($line))
						endOffset = endOffset-1;

					return $line.replace(/^	/, '');
				}
				else
				{
					endOffset = endOffset+1;
					return '	' + $line;
				}
			});

			var tmpCode = newLines.join('\n');

			if ($remove === true)
				startOffset = startOffset-1;
			else
				startOffset = startOffset+1;

			requestAnimationFrame(function()
			{
				insertText(tmpCode, false, startTmp, endTmp);
				setSelection(startOffset, endOffset);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
			});
		}
	};

	// Commentaires inline

	this.toggleLineComment = function()
	{
		var codeEditor = getEditorCode();

		if (codeEditor && codeEditor !== '' && language !== 'plaintext' 
			&& languageToken[language] && languageToken[language].inline)
		{
			updateSelectData();

			var tmpCode = getEditorCode();

			var inlineCom = languageToken[language].inline;
			var tabRegexStr = '([ 	]*)';
			var tabRegex = new RegExp('^' + tabRegexStr);
			var commentRegex = new RegExp('^' + tabRegexStr + inlineCom.formatRegex() + tabRegexStr);

			var startOffset = startSelect;
			var endOffset = endSelect;

			var startIndex = tmpCode.lastIndexOf('\n', startOffset);
			startIndex = (startIndex >= 0) ? startIndex+1 : 0;

			var endIndex = tmpCode.indexOf('\n', endOffset);
			endIndex = (endIndex >= 0) ? endIndex : tmpCode.length;

			var startTmp = startIndex;
			var endTmp = endIndex;

			var codeCenter = tmpCode.slice(startTmp, endTmp);
			var lines = codeCenter.split('\n');

			var finalStartOffset = startOffset;
			var finalEndOffset = endOffset;
			var countChars = startTmp;

			var newLines = lines.map(function($line, $i)
			{
				if ($line !== '')
				{
					var startLine = countChars;
					var endLine = countChars + $line.length;
					var startInterval = $this.getNodeFromTextCursor(hierarchy, startLine);
					var endInterval = $this.getNodeFromTextCursor(hierarchy, endLine+1);

					var matchComment = $line.match(commentRegex);

					if (matchComment)
					{
						var matchTab = $line.match(commentRegex);
						var before = (matchTab && matchTab[1]) ? matchTab[1] : '';
						var after = (matchTab && matchTab[2]) ? matchTab[2] : '';
						var tokenIndex = $line.indexOf(inlineCom);
						var tokenGlobalIndex = countChars + tokenIndex;
						var tokenNode = $this.getNodeFromTextCursor(hierarchy, tokenGlobalIndex+1);

						var nodeInterval = startInterval;

						while (nodeInterval && nodeInterval !== endInterval)
						{
							if (nodeInterval.node.nodeType === Node.TEXT_NODE && nodeInterval.text.includes(inlineCom + after))
							{
								nodeInterval.text = nodeInterval.text.remove(inlineCom + after);
								nodeInterval.node.nodeValue = nodeInterval.text;
								nodeInterval = null;
							}
							else
								nodeInterval = nodeInterval.nextNode;
						}
						
						if (countChars + tokenIndex < startOffset)
							finalStartOffset = finalStartOffset - inlineCom.length - after.length;

						finalEndOffset = finalEndOffset - inlineCom.length - after.length;
						
						countChars = countChars + $line.length + 1;
						
						return $line.replace(commentRegex, before);
					}
					else
					{
						var matchTab = $line.match(tabRegex);
						var before = (matchTab && matchTab[1]) ? matchTab[1] : '';
						var tokenGlobalIndex = countChars + before.length;
						var tokenNode = $this.getNodeFromTextCursor(hierarchy, tokenGlobalIndex);
						insertInNode(tokenNode, inlineCom + ' ', countChars + before.length, countChars + before.length);

						if (countChars + before.length < startOffset)
							finalStartOffset = finalStartOffset + inlineCom.length + 1;

						finalEndOffset = finalEndOffset + inlineCom.length + 1;
							
						countChars = countChars + $line.length + 1;
							
						return $line.replace(tabRegex, before + inlineCom + ' ');
					}
				}

				return $line
			});

			var tmpCode = newLines.join('\n');

			requestAnimationFrame(function()
			{
				insertText(tmpCode, false, startTmp, endTmp);
				setSelection(finalStartOffset, finalEndOffset);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
			});
		}
	};

	// Commentaires en bloc

	this.toggleBlockComment = function()
	{
		if (language !== 'plaintext' && languageToken[language] && languageToken[language].commentStart && languageToken[language].commentEnd)
			surround(languageToken[language].commentStart + ' ', ' ' + languageToken[language].commentEnd);
	};

	// Block

	this.toggleBrackets = function()
	{
		if (language !== 'plaintext')
			surround('{', '}');
	};

	// Crochets

	this.toggleSquareBrackets = function()
	{
		if (language !== 'plaintext')
			surround('[', ']', true);
	};

	// Chevrons

	this.toggleAngleBrackets = function()
	{
		if (language !== 'plaintext')
			surround('<', '>');
	};

	// Parenthèses

	this.toggleParenthesis = function()
	{
		if (language !== 'plaintext')
			surround('(', ')', true);
	};

	// Simple quote

	this.toggleSimpleQuote = function()
	{
		if (language !== 'plaintext')
			surround("'", "'");
	};

	// Double quote

	this.toggleDoubleQuote = function()
	{
		if (language !== 'plaintext')
			surround('"', '"');
	};

	// Fomatages divers

	this.toLowerCase = function()
	{
		$this.saveSelection();
		var extract = getSelectedText();
		var tmpCode = extract.toLowerCase();
		updateCurrentNode(tmpCode);
		requestAnimationFrame(function() { insertText(tmpCode, true); });
	};

	this.toUpperCase = function()
	{
		$this.saveSelection();
		var extract = getSelectedText();
		var tmpCode = extract.toUpperCase();
		updateCurrentNode(tmpCode);
		requestAnimationFrame(function() { insertText(tmpCode, true); });
	};

	this.toKebabCase = function()
	{
		$this.saveSelection();
		var extract = getSelectedText();
		var tmpCode = extract.replace(/[ _]+/gi, '-').toLowerCase();
		updateCurrentNode(tmpCode);
		requestAnimationFrame(function() { insertText(tmpCode, true); });
	};

	this.toSnakeCase = function()
	{
		$this.saveSelection();
		var extract = getSelectedText();
		var tmpCode = extract.replace(/[ -]+/gi, '_').toLowerCase();
		updateCurrentNode(tmpCode);
		requestAnimationFrame(function() { insertText(tmpCode, true); });
	};

	//// Insertion de templates ////
	
	var commandList =
	[
		'do while', 'do', 'dw',
		'while', 'w',
		'for', 
		'switch', 'sw', 's',
		'case', 'c',
		'if', 'i',
		'f', 'fc', 'func', 
		'class', 'cl',
		'm', 'met', 'method',
		'prim', 'primet', 'primethod', 'prif', 'prifc', 'prifunc',
		'prom', 'promet', 'promethod', 'prof', 'profc', 'profunc',
		'pum', 'pumet', 'pumethod', 'puf', 'pufc', 'pufunc',
		'get', 'set',
		'print', 'pr', 'p',
		'r', 't', 
	];

	this.insertReturn = function()
	{
		$this.saveSelection();
		$this.insertCode('return {{CURSOR}};', false);
		//updateCurrentNode('return ');
		//requestAnimationFrame(function() { insertText('return ', false); });
	};

	this.insertTag = function($tagName)
	{
		$this.saveSelection();
		var extract = getSelectedText();

		if ($tagName === 'a')
			$this.insertCode('<a href="' + extract + '" >' + extract + '</a>', false);
		else if ($tagName === 'img')
			$this.insertCode('<img src="' + extract + '" />', false);
		else
			$this.insertCode('<' + $tagName + '>' + extract + '</' + $tagName + '>', false);
	};

	this.insertSimpleTemplate = function($templateName, $cleanCommand)
	{
		$this.saveSelection();
		var extract = getSelectedText();
		var tmpCode = extract;

		if ($cleanCommand)
		{
			commandList.forEach(function($command)
			{
				commandRegExp = new RegExp('^' + $command + '[ 	]+');
				tmpCode = tmpCode.replace(commandRegExp, '');
			});
		}

		if (LANGUAGES_TEMPLATE[language] && LANGUAGES_TEMPLATE[language][$templateName])
			tmpCode = LANGUAGES_TEMPLATE[language][$templateName].replaceAll('{{VALUE}}', extract);

		$this.insertCode(tmpCode, false);
		//updateCurrentNode(tmpCode);
		//requestAnimationFrame(function() { $this.insertCode(tmpCode, false); });
	};

	var generateTemplate = function($template, $codeToParse)
	{
		var token = $codeToParse.split(' ');

		var outputCode = '\n' + $template;

		var matchVariables = $template.match(/{{([0-9 ]+)}}/g);
		
		if (matchVariables)
		{
			var variables = [];

			for (let i = 0; i < matchVariables.length; i++)
			{
				var varIndex = parseInt(matchVariables[i].remove('{{').remove('}}'));

				if (!variables.includes(varIndex))
					variables.push(varIndex);
			}

			variables.sort();

			if (token.length > variables.length)
			{
				var prevToken = token.slice(0, variables.length-1);
				var lastToken = token.slice(variables.length-1).join(' ');
				prevToken.push(lastToken);
				token = prevToken;
			}

			for (var i = 0; i < variables.length; i++)
				outputCode = outputCode.replaceAll('{{' + variables[i] + '}}', token[i] ? token[i] : '');
		}

		return outputCode;
	};

	var insertTemplate = function($template, $cleanCommand)
	{
		$this.saveSelection();
		var extract = getSelectedText();
		var outputCode = extract;

		var caretStart = select.start;
		var caretEnd = select.end;
		var caretOffset = select.end;
		tmpCode = getEditorCode();
		var startLine = tmpCode.lastIndexOf('\n', caretStart-1);
		var endLine = tmpCode.indexOf('\n', caretEnd);
		endLine = (endLine >= 0) ? endLine : tmpCode.length;
		var line = tmpCode.slice(startLine+1, endLine);
		var offsetLine = line.search(/[^	]/);
		var codeToParse = extract;

		if (extract === '')
			codeToParse = line.remove(/^[ 	]*/).remove(/[ 	]*$/).trim();

		if ($cleanCommand)
		{
			var words = codeToParse.split(' ');
			words.shift();
			codeToParse = words.join(' ');
		}

		outputCode = generateTemplate($template, codeToParse);

		var startTmp = startSelect;

		select.start = startLine + 1 + offsetLine;
		select.end = endLine;
		select.focus = select.end;
		console.log(select.start, select.end);

		return outputCode;
	};

	this.insertTemplate = function($templateName, $cleanCommand)
	{
		var extract = getSelectedText();
		var outputCode = extract;

		if (LANGUAGES_TEMPLATE[language] && LANGUAGES_TEMPLATE[language][$templateName])
			outputCode = insertTemplate(LANGUAGES_TEMPLATE[language][$templateName], $cleanCommand);

		console.log(select.start, select.end);
		$this.insertCode(outputCode);
	};

	var insertFunctionTemplate = function($template, $cleanCommand)
	{
		$this.saveSelection();
		var editorCode = getEditorCode();
		var extract = getSelectedText();
		var outputCode = extract;

		var caretStart = select.start;
		var caretEnd = select.end;
		var caretOffset = select.end;
		
		var startLine = editorCode.lastIndexOf('\n', caretStart-1);
		var endLine = editorCode.indexOf('\n', caretEnd);
		endLine = (endLine >= 0) ? endLine : editorCode.length;
		var line = editorCode.slice(startLine+1, endLine);
		var offsetLine = line.search(/[^	]/);
		var codeToParse = extract;

		if (extract === '')
			codeToParse = line.remove(/^[ 	]*/).remove(/[ 	]*$/).trim();

		if ($cleanCommand)
		{
			var words = codeToParse.split(' ');
			words.shift();
			codeToParse = words.join(' ');
		}

		outputCode = '\n' + $template(codeToParse);
		//outputCode = $template(codeToParse);

		var startTmp = startSelect;

		select.start = startLine + 1 + offsetLine;
		select.end = endLine;
		select.focus = select.end;
		console.log(select.start, select.end);

		return outputCode;
	};

	this.insertFunctionTemplate = function($templateName, $cleanCommand)
	{
		var extract = getSelectedText();
		var outputCode = extract;

		if (LANGUAGES_TEMPLATE[language] && LANGUAGES_TEMPLATE[language][$templateName])
			outputCode = insertFunctionTemplate(LANGUAGES_TEMPLATE[language][$templateName], $cleanCommand);

		console.log(select.start, select.end);
		$this.insertCode(outputCode);
	};

	var searchTemplateByName = function($name, $templates)
	{
		var output = null;

		for (var i = 0; i < $templates.length; i++)
		{
			if ($templates[i].name === $name)
			{
				output = $templates[i].template;
				i = $templates.length;
			}
			else if ($templates[i].children)
				output = searchTemplateByName($name, $templates[i].children);
		}

		return output;
	};

	this.insertFromContext = function()
	{
		$this.saveSelection();
		var editorCode = getEditorCode();
		var extract = getSelectedText();
		var outputCode = extract;

		var caretStart = select.start;
		var caretEnd = select.end;
		var caretOffset = select.end;
		
		var startLine = editorCode.lastIndexOf('\n', caretStart-1);
		var endLine = editorCode.indexOf('\n', caretEnd);
		var line = editorCode.slice(startLine+1, endLine);

		if (line.indexOf('\n') > 0 && line.indexOf('\n') < line.length)
			$this.batchInsert();
		else
		{
			var offsetLine = line.search(/[^	]/);
			var codeToParse = extract;

			if (extract === '')
				codeToParse = line.remove(/^[ 	]*/).remove(/[ 	]*$/).trim();

			var words = codeToParse.split(' ');
			var template = null;

			if (words && words.length > 0)
				template = searchTemplateByName(words[0], LANGUAGES_TEMPLATE[language]['customTemplates']);

			if (words && words.length > 0 && (commandList.includes(words[0]) || template))
			{
				var templateName = words[0];

				if (['do while', 'do', 'dw'].includes(templateName))
					$this.insertTemplate('do', true);
				else if (['while', 'w'].includes(templateName))
					$this.insertTemplate('while', true);
				else if (templateName === 'for')
					$this.insertTemplate('for', true);
				else if (['switch', 'sw', 's'].includes(templateName))
					$this.insertFunctionTemplate('switchCase', true);
				else if (['case', 'c'].includes(templateName))
					$this.insertTemplate('case', true);
				else if (['if', 'i'].includes(templateName))
					$this.insertTemplate('if', true);
				else if (['f', 'fc', 'func'].includes(templateName))
					$this.insertTemplate('function', true);
				else if (['m', 'met', 'method'].includes(templateName))
					$this.insertTemplate('method', true);
				else if (['prim', 'primet', 'primethod', 'prif', 'prifc', 'prifunc'].includes(templateName))
					$this.insertTemplate('privateMethod', true);
				else if (['prom', 'promet', 'promethod', 'prof', 'profc', 'profunc'].includes(templateName))
					$this.insertTemplate('protectedMethod', true);
				else if (['pum', 'pumet', 'pumethod', 'puf', 'pufc', 'pufunc'].includes(templateName))
					$this.insertTemplate('publicMethod', true);
				else if (['class', 'cl'].includes(templateName))
					$this.insertTemplate('class', true);
				else if (templateName === 'r')
					$this.insertSimpleTemplate('return', true);
				else if (['print', 'pr', 'p'].includes(templateName))
					$this.insertSimpleTemplate('print', true);
				else if (templateName === 't')
					$this.insertSimpleTemplate('ternary', true);
				else if (templateName === 'get')
					$this.insertFunctionTemplate('getter', true);
				else if (templateName === 'set')
					$this.insertFunctionTemplate('setter', true);
				else if (template)
				{
					if (typeof template === 'function')
						$this.insertCode(insertFunctionTemplate(template, true));
					else
						$this.insertCode(insertTemplate(template, true));
				}
			}
		}
	};

	var parseBatch = function($hierarchy, $offsetLine)
	{
		console.log($hierarchy);

		var codeToInsert = '';

		// Gérer d'abord les cas où la sélection complète correspond à un template multi-lignes

		codeToInsert = $hierarchy.map(function($item)
		{
			var ouputCode = '';
			var lineCode = $item.name;

			var innerCode = '';

			if ($item.children && $item.children.length > 0)
			{
				innerCode = parseBatch($item.children, $offsetLine + '	');
				innerCode = innerCode.split('\n').map(function($line) { return '	' + $line; }).join('\n');
			}

			var codeToParse = lineCode.remove(/^[ 	]*/).remove(/[ 	]*$/).trim();
			var words = codeToParse.split(' ');
			var template = null;

			if (words && words.length > 0)
				template = searchTemplateByName(words[0], LANGUAGES_TEMPLATE[language]['customTemplates']);

			if (words && words.length > 0 && (commandList.includes(words[0]) || template))
			{
				var templateName = words[0];

				words.shift();
				codeToParse = words.join(' ');

				if (['do while', 'do', 'dw'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['do'], codeToParse);
				else if (['while', 'w'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['while'], codeToParse);
				else if (templateName === 'for')
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['for'], codeToParse);
				else if (['switch', 'sw', 's'].includes(templateName))
					ouputCode = LANGUAGES_TEMPLATE[language]['switchCase'](codeToParse);
				else if (['case', 'c'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['case'], codeToParse);
				else if (['if', 'i'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['if'], codeToParse);
				else if (['f', 'fc', 'func'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['function'], codeToParse);
				else if (['m', 'met', 'method'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['method'], codeToParse);
				else if (['prim', 'primet', 'primethod', 'prif', 'prifc', 'prifunc'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['privateMethod'], codeToParse);
				else if (['prom', 'promet', 'promethod', 'prof', 'profc', 'profunc'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['protectedMethod'], codeToParse);
				else if (['pum', 'pumet', 'pumethod', 'puf', 'pufc', 'pufunc'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['publicMethod'], codeToParse);
				else if (['class', 'cl'].includes(templateName))
					ouputCode = generateTemplate(LANGUAGES_TEMPLATE[language]['class'], codeToParse);
				else if (templateName === 'r')
					ouputCode = LANGUAGES_TEMPLATE[language]['return'].replaceAll('{{VALUE}}', codeToParse);
				else if (['print', 'pr', 'p'].includes(templateName))
					ouputCode = LANGUAGES_TEMPLATE[language]['print'].replaceAll('{{VALUE}}', codeToParse);
				else if (templateName === 't')
					ouputCode = LANGUAGES_TEMPLATE[language]['ternary'].replaceAll('{{VALUE}}', codeToParse);
				else if (templateName === 'get')
					ouputCode = LANGUAGES_TEMPLATE[language]['getter'](codeToParse);
				else if (templateName === 'set')
					ouputCode = LANGUAGES_TEMPLATE[language]['setter'](codeToParse);
				else if (template)
				{
					if (typeof template === 'function')
						ouputCode = template(codeToParse);
					else
						ouputCode = generateTemplate(template, codeToParse);
				}
			}

			if (innerCode !== '')
				ouputCode = ouputCode.replace('{{CURSOR}}', innerCode);

			ouputCode = ouputCode.split('\n').map(function($line) { return $offsetLine + $line; }).join('\n');
			
			return ouputCode;
			
		}).join('\n');

		return codeToInsert;
	};

	this.batchInsert = function()
	{
		$this.saveSelection();
		var editorCode = getEditorCode();
		var extract = getSelectedText();
		var outputCode = extract;

		var caretStart = select.start;
		var caretEnd = select.end;
		var caretOffset = select.end;
		
		var startLine = editorCode.lastIndexOf('\n', caretStart-1);
		var endLine = editorCode.indexOf('\n', caretEnd);
		var line = editorCode.slice(startLine+1, endLine);

		if (line.indexOf('\n') > 0 && line.indexOf('\n') < line.length && LANGUAGES_TEMPLATE[language])
		{
			var offsetLine = line.search(/[^	]/);

			console.log('offsetLine : ' + offsetLine);
			console.log('line : ' + line);

			var codeToParse = line;

			var hierarchy = PeguyDevUtils.listToHierarchy(codeToParse.split('\n'));
			var outputCode = parseBatch(hierarchy, '');

			select.start = startLine + 1 + offsetLine;
			select.end = endLine;
			select.focus = select.end;

			$this.insertCode(outputCode);
		}
		else
			$this.insertFromContext();
	};
	
	//// Insertion de code ////

	this.insertCode = function($code, $paste)
	{
		var tabs = '';
		var codeToInsert = $code;
		var editorCode = getEditorCode();
		var cursor = -1;

		if (editorCode)
		{
			if (language !== 'plaintext' && codeToInsert.includes('\n') && !$paste)
			{
				var codeBefore = getTextBefore();
				var linesBefore = codeBefore.split('\n');
				var previousLine = linesBefore[linesBefore.length-1];

				if (previousLine)
				{
					var matchTab = previousLine.match(/^[ 	]*/);

					if (matchTab)
					{
						tabs = matchTab[0];
						tabs = tabs + (/{[ 	]*$/.test(previousLine) ? '	' : '');
						tabs = tabs.replaceAll('	', '\t');
						console.log('"' + tabs + '"');

						codeToInsert = codeToInsert.replace(/(\n\r|\r\n)/g, '\n');

						codeToInsert = codeToInsert.split('\n').map(function($line)
						{
							if ($line !== '')
								return tabs + $line.removeAll('\n');
							
							return '';
						}).join('\n');
					}
				}
			}

			var localCursor = codeToInsert.indexOf('{{CURSOR}}');

			if (localCursor >= 0)
				cursor = select.start + localCursor;

			codeToInsert = codeToInsert.removeAll('{{CURSOR}}');

			getSelectedNodes();
			updateCurrentNode(codeToInsert);

			requestAnimationFrame(function()
			{
				insertText(codeToInsert, false, select.start, select.end);
				
				if (localCursor >= 0)
					setSelection(cursor, cursor);
				
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
			});
		}
		else
		{
			var localCursor = codeToInsert.indexOf('{{CURSOR}}');

			if (localCursor >= 0)
				cursor = localCursor;

			codeToInsert = codeToInsert.removeAll('{{CURSOR}}');

			setEditorCode(codeToInsert);
			renderLayer.innerHTML = cleanCodeToDisplay(getEditorCode());
			$this.setScrollY(component.getById('editor').scrollTop);

			requestAnimationFrame(function()
			{
				setSelection(cursor, cursor);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
			});
		}
	};

	var onDropFiles = function($event)
	{
		console.log("Execute onDropFiles...");
		
		Files.drop($event, function($files)
		{
			if (language === 'html')
			{
				var imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];

				var code = $files.filter(function($file)
				{
					var ext = 0;

					if ($file.path)
						ext = $file.path.split('.').pop().toLowerCase();
					else
						return false;

					return imageExtensions.includes(ext);
					
				}).map(function ($file)
				{
					return '<img alt="' + $file.name + '" src="' + $file.path + '" />';
				}).join('\n');

				console.log($files);

				$this.insertCode(code);
			}
		});
	};

	//// Gestion de l'affichage des numéros de ligne ////

	this.updateNumLines = function()
	{
		var innerHTML = getEditorCode();
		var lines = innerHTML.split('\n');
		var linesHTML = lines.map(function($line, $index) { return '<div>' + ($index+1) + '</div>'; }).join('');
		component.getById('num-lines').innerHTML = linesHTML;
		return lines.length;
	};
	
	//// Gestion de l'historique ////

	var callbackUndoRedo = function($content)
	{
		codeContent = $content;
		var codeToDisplay = cleanCodeToDisplay(codeContent);
		setEditorCode(codeContent);
		syntaxHighlightAll();
		$this.restoreCaret(false);
		$this.updateUndoRedoButtons();
	};

	this.undo = function() { $this.decrementeHistory(function($content) { callbackUndoRedo($content); }); };
	this.redo = function() { $this.incrementeHistory(function($content) { callbackUndoRedo($content); }); };

	this.refresh = function() { onChange(); };

	//// Recherche et remplace ////

	this.toggleSearchBlock = function()
	{
		if (searching)
			$this.closeSearchBlock();
		else
			$this.openSearchBlock();
	};

	this.openSearchBlock = function()
	{
		searching = true;
		component.getById('search-panel').style.display = 'block';
		var searchPanelHeight = component.getById('search-panel').offsetHeight + component.getById('search-panel').offsetTop;
		component.getById('editor').style.top = searchPanelHeight + 'px';
		renderLayer.style.top = searchPanelHeight + 'px';
		component.getById('search-layer').style.top = searchPanelHeight + 'px';
		component.getById('same-layer').style.top = searchPanelHeight + 'px';
		component.getById('num-lines-block').style.top = searchPanelHeight + 'px';

		var criteria = component.getById('search-input').value;

		if (criteria === '')
		{
			var caretOffset = select.focus;
			var tmpCode = getEditorCode();
			var startLine = tmpCode.lastIndexOf('\n', caretOffset);
			var endLine = tmpCode.indexOf('\n', caretOffset);
			var line = tmpCode.slice(startLine, endLine);
			var localOffset = caretOffset - startLine;

			var dotIndex = delimiters.indexOf('.');
			
			if (dotIndex)
				delimiters.splice(dotIndex, 1);

			var wordStart = getWordStart(line, localOffset) + 1;
			var wordEnd = getWordEnd(line, localOffset);
			var word = line.slice(wordStart, wordEnd).remove(/^[ 	]*/).remove(/[ 	]*$/).trim();
			component.getById('search-input').value = word;
		}

		updateSelectData();
		highlightLine(currentLineNum);
		onSearch();
		updateSearchLayer();
	};

	this.closeSearchBlock = function()
	{
		searching = false;
		component.getById('search-panel').removeAttribute('style');
		component.getById('editor').removeAttribute('style');
		renderLayer.removeAttribute('style');
		component.getById('search-layer').removeAttribute('style');
		component.getById('same-layer').removeAttribute('style');
		component.getById('num-lines-block').removeAttribute('style');

		updateSelectData();
		highlightLine(currentLineNum);
		updateSearchLayer();
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	//// Divers ////

	component.getById('editor').onscroll = function($event) { $this.updateScroll(); };

	//// Gestion du focus ////

	this.onFocus = function() {};

	var onFocus = function()
	{
		Events.emit('onCodeEditorClick', [$this, codeContent]);
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		updateSelectData();
	};
	
	component.getById('editor').addEvent('focus', function()
	{
		onFocus();
		$this.onFocus();
	});

	//component.getById('editor').onClick = function() { Events.emit('onCodeEditorClick', [$this, codeContent]); };
	//component.getById('editor').onclick = function() { Events.emit('onCodeEditorClick', [$this, codeContent]); };

	component.getById('editor').onClick = function($event)
	{
		if (Events.keyPressTable['shift'] === true && Events.keyPressTable['alt'] === true) // Ligne
		{
			var clicPosition = (editorLayer.selectionStart < select.start) ? editorLayer.selectionStart : editorLayer.selectionEnd;
			var editorCode = getEditorCode();
			var startLine = editorCode.lastIndexOf('\n', clicPosition);
			var endLine = editorCode.indexOf('\n', clicPosition);
			var line = editorCode.slice(startLine, endLine).remove(/^[ 	]*/).remove(/[ 	]*$/).trim();
			
			updateCurrentNode(line);

			requestAnimationFrame(function()
			{
				insertText(line, false, select.start, select.end);
				setSelection(select.start, select.end);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
				updateSearchLayer();

				$this.onType(delay, function() { onChange(); });
			});
		}
		else if (Events.keyPressTable['alt'] === true) // Mot
		{
			var clicPosition = editorLayer.selectionEnd;
			var editorCode = getEditorCode();
			var startLine = editorCode.lastIndexOf('\n', clicPosition);
			var endLine = editorCode.indexOf('\n', clicPosition);
			var line = editorCode.slice(startLine, endLine);
			var localOffset = clicPosition - startLine;

			var dotIndex = delimiters.indexOf('.');
			
			if (dotIndex)
				delimiters.splice(dotIndex, 1);

			var wordStart = getWordStart(line, localOffset) + 1;
			var wordEnd = getWordEnd(line, localOffset);
			wordOnCursor = line.slice(wordStart, wordEnd).remove(/^[ 	]*/).remove(/[ 	]*$/).trim();

			delimiters.push('.');

			updateCurrentNode(wordOnCursor);

			requestAnimationFrame(function()
			{
				insertText(wordOnCursor, false, select.start, select.end);
				setSelection(select.start, select.end);
				updateHierarchy();
				updateSelectData();
				highlightLine(currentLineNum);
				updateSearchLayer();

				$this.onType(delay, function() { onChange(); });
			});
		}
		else
		{
			onFocus();
			highlightLine(currentLineNum);
			updateSearchLayer();
		}
	};

	component.getById('editor').onDblClick = function()
	{
		onFocus();
		highlightLine(currentLineNum);
		updateSearchLayer();
	};

	var createTemplateMenu = function($list, $parent)
	{
		for (var i = 0; i < $list.length; i++)
		{
			var child = $list[i];

			var itemMenu = new MenuItem(child.label);
			$parent.addElement(itemMenu);

			if (child.children)
				createTemplateMenu(child.children, itemMenu);
			else if (typeof child.template === 'string')
			{
				itemMenu.template = child.template;

				itemMenu.onAction = function()
				{
					$this.restoreCaret(false);
					$this.insertCode(insertTemplate(this.template));
				};
			}
			else if (typeof child.template === 'function')
			{
				itemMenu.template = child.template;

				itemMenu.onAction = function()
				{
					$this.restoreCaret(false);
					$this.insertCode(insertFunctionTemplate(this.template));
				};
			}
		}
	};

	var createContextMenu = function($event)
	{
		Events.preventDefault($event);
		var mousePosition = document.getElementById('main').mousePosition($event);
		var contextMenu = new ContextMenu(mousePosition.x, mousePosition.y);

		var findMenu = new MenuItem("Find");
		contextMenu.addElement(findMenu);
		findMenu.onAction = function() { $this.openSearchBlock(); };

		var completeMenu = new MenuItem("Complete");
		contextMenu.addElement(completeMenu);
		completeMenu.onAction = function() { $this.insertFromContext(); };

		if (LANGUAGES_TEMPLATE[language] && LANGUAGES_TEMPLATE[language]['customTemplates'])
		{
			contextMenu.addElement(new MenuSeparator());
			createTemplateMenu(LANGUAGES_TEMPLATE[language]['customTemplates'], contextMenu);
		}
	};

	component.getById('editor').onContextMenu = function($event) { createContextMenu($event); };
	
	this.onBlur = function() {};
	
	component.getById('editor').addEvent('blur', function() { $this.onBlur(); });
	
	//// Changement du contenu ////

	this.onChange = function($codeContent) {};
	
	var onChange = function()
	{
		$this.saveSelection();
		$this.emptyHistoryFrom($this.getHistoryIndex());
		$this.addToHistory(codeContent);
		$this.updateCode();
		updateSearchLayer();
		Events.emit('onCodeEditorChange', [$this, codeContent]);
		$this.onChange(codeContent);
	};

	this.forceOnChange = function() { onChange(); };

	//// Événements de changement du contenu et clavier ////

	var onEditorChange = function($event)
	{
		var processed = false;
		$this.setScrollY(component.getById('editor').scrollTop);
		
		if (!Events.shortcutModifier($event))
		{
			if (keys.indexOf($event.keyCode) < 0)
			{
				if ($event.type === 'keydown')
				{
					//console.log('KEY CODE : ' + $event.keyCode);

					if (Events.keyPressTable['shift'] && Events.keyPressTable['alt'])
					{
						Events.preventDefault($event);

						switch ($event.keyCode)
						{
							case 65: // Touche A pour aller à la fin du document
								$this.moveCursorToEndOfDocument();
								break;

							case 66: // Touche B pour entourer d'un block
								$this.toggleBrackets();
								break;

							case 67: // Touche C pour commenter/décommenter en mode block
								$this.toggleBlockComment();
								break;

							case 68: // Touche D pour dupliquer une ligne avec incrémentation
								$this.duplicateLine(false, true);
								break;

							case 70: // Touche F pour insérer une fonction
								$this.insertTemplate('function');
								break;
							
							case 75: // Touche K pour remplacer les espaces par des underscore
								$this.toSnakeCase();
								break;
							
							case 77: // Touche F pour insérer une méthode
								$this.insertTemplate('method');
								break;

							case 80: // Touche P pour entourer de parenthèses
								$this.toggleParenthesis();
								break;

							case 81: // Touche Q pour entourer de double quote
								$this.toggleDoubleQuote();
								break;

							case 83: // Touche S pour insérer un switch case
								$this.insertFunctionTemplate('switchCase');
								break;

							case 87: // Touche W pour aller à la fin du mot
								$this.moveCursorToEndWord();
								break;

							default:
								$this.saveSelection();
								updateCurrentNode($event.key);
								insertText($event.key);
						}

						processed = true;
					}
					else if (Events.keyPressTable['alt'])
					{
						Events.preventDefault($event);

						switch ($event.keyCode)
						{
							case 65: // Touche A pour aller au début du document
								$this.moveCursorTo(0);
								break;

							case 67: // Touche C pour commenter/décommenter en mode inline
								$this.toggleLineComment();
								break;

							case 74: // Touche J pour fusionner des lignes
								$this.mergeLines();
								break;
							
							case 75: // Touche K pour formatage url
								$this.toKebabCase();
								break;

							case 81: // Touche Q pour entourer de simple quote
								$this.toggleSimpleQuote();
								break;

							case 87: // Touche W pour aller au début du mot
								$this.moveCursorToBeginningWord();
								break;

							default:

								if (language === 'html' || language === 'xml')
								{
									switch ($event.keyCode)
									{
										case 13: // Touche Entrée
											Events.preventDefault($event);
											$this.insertCode('<br />', false);
											break;

										case 66: // Touche B
											$this.insertTag('strong');
											break;

										case 68: // Touche D
											$this.insertTag('div');
											break;
										
										case 69: // Touche E
											$this.insertTag('em');
											break;

										//case 70: // Touche F
										//	$this.insertTemplate('for');
										//	break;

										//case 71: // Touche G
										//	$this.insertFunctionTemplate('getterSetters');
										//	break;

										case 73: // Touche I
											$this.insertTag('img');
											break;
										
										case 76: // Touche L
											$this.insertTag('a');
											break;

										case 80: // Touche P
											$this.insertTag('p');
											break;

										//case 82: // Touche R
										//	$this.insertSimpleTemplate('return');
										//	break;

										case 83: // Touche S
											$this.insertTag('h4');
											break;

										case 84: // Touche T
											$this.insertTag('h3');
											break;

										//case 85: // Touche U pour casse haute
										//	$this.toUpperCase();
										//	break;

										default:
											$this.saveSelection();
											updateCurrentNode($event.key);
											insertText($event.key);
									}
								}
								else
								{
									switch ($event.keyCode)
									{
										case 9: // Touche Tabulation pour générer automatiquement une portion de code à partir du contexte
											Events.preventDefault($event);
											$this.insertFromContext();
											processed = true;
											break;

										case 13: // Touche Entrée pour générer automatiquement une portion de code à partir du contexte
											Events.preventDefault($event);
											$this.insertFromContext();
											processed = true;
											break;

										case 66: // Touche B pour entourer de chevrons
											$this.toggleAngleBrackets();
											break;

										case 68: // Touche D pour insérer une boucle do while
											$this.insertTemplate('do');
											break;

										case 70: // Touche F pour insérer une boucle for
											$this.insertTemplate('for');
											break;

										case 71: // Touche G pour insérer des accesseurs
											$this.insertFunctionTemplate('getterSetters');
											break;

										case 73: // Touche I pour insérer un block if
											$this.insertTemplate('if');
											break;
										
										case 76: // Touche L pour casse basse
											$this.toLowerCase();
											break;

										case 80: // Touche P pour insérer un print
											$this.insertSimpleTemplate('print');
											break;

										case 82: // Touche R pour insérer un return
											$this.insertSimpleTemplate('return');
											break;

										case 83: // Touche S pour insérer un case
											$this.insertTemplate('case');
											break;

										case 84: // Touche T pour insérer une ternaire
											$this.insertSimpleTemplate('ternary');
											break;
										
										case 85: // Touche U pour casse haute
											$this.toUpperCase();
											break;

										default:
											$this.saveSelection();
											updateCurrentNode($event.key);
											insertText($event.key);
									}
								}
						}

						processed = true;
					}
					else
					{
						$this.saveSelection();

						switch ($event.keyCode)
						{
							case 8: // Backspace
								removeText($event);
								break;

							case 9: // Tabulation
								Events.preventDefault($event);
								var extract = getSelectedText();

								if (extract.includes('\n'))
								{
									if (Events.keyPressTable['shift'])
										$this.insertTab(true);
									else
										$this.insertTab();
								}
								else
								{
									updateCurrentNode('	');
									insertText('	');
								}
								break;

							case 13: // Entrée
								Events.preventDefault($event);
								lineBreak();
								break;

							case 46: // Delete (Suppr)
								removeText($event, true);
								break;

							default:
								updateCurrentNode($event.key);
						}

						processed = true;
					}
				}
				else if ($event.type === 'keyup')
				{
					if ($event.keyCode === 9)
					{
						Events.preventDefault($event);
						processed = true;
					}
				}

				$this.onType(delay, function() { onChange(); });
			}
			else if (arrowKeys.indexOf($event.keyCode) >= 0)
			{
				if ($event.type === 'keydown')
				{
					if (Events.keyPressTable['alt'])
					{
						if (Events.keyPressTable['shift'])
						{
							Events.preventDefault($event);
							
							switch ($event.keyCode)
							{
								case 38: // Vers le haut
									$this.duplicateLine(true);
									$this.onType(delay, function() { onChange(); });
									processed = true;
									break;
								
								case 40: // Vers le bas
									$this.duplicateLine();
									$this.onType(delay, function() { onChange(); });
									processed = true;
									break;
							}
						}
						else
						{
							Events.preventDefault($event);

							switch ($event.keyCode)
							{
								case 38: // Vers le haut
									$this.switchLines(true);
									$this.onType(delay, function() { onChange(); });
									break;
								
								case 40: // Vers le bas
									$this.switchLines();
									$this.onType(delay, function() { onChange(); });
									break;
								
								case 37: // Vers la gauche pour aller au début de la ligne
									Events.preventDefault($event);
									$this.moveCursorToBeginningLine();
									break;
								
								case 39: // Vers la droite pour aller à la fin de la ligne
									Events.preventDefault($event);
									$this.moveCursorToEndLine();
									break;
							}

							processed = true;
						}
					}
				}

				if ($event.type === 'keyup')
				{
					updateSelectData();
					highlightLine(currentLineNum);
					updateSearchLayer();
				}
			}
		}
		else if ($event.type === 'keydown')
		{
			if (Events.keyPressTable['shift'])
			{
				switch ($event.keyCode)
				{
					case 66: // Touche B pour entourer de crochets
						Events.preventDefault($event);
						$this.toggleSquareBrackets();
						$this.onType(delay, function() { onChange(); });
						processed = true;
						break;
					
					case 67: // Touche C pour insérer un template de class
						Events.preventDefault($event);
						$this.insertTemplate('class');
						$this.onType(delay, function() { onChange(); });
						processed = true;
						break;
					
					case 87: // Touche W pour insérer une boucle while
						Events.preventDefault($event);
						$this.insertTemplate('while');
						processed = true;
						break;
				}
			}
			else
			{
				switch ($event.keyCode)
				{
					case 9: // Touche Tabulation pour générer automatiquement une portion de code à partir du contexte
						Events.preventDefault($event);
						$this.batchInsert();
						processed = true;
						break;
					
					case 13: // Touche Entrée pour générer automatiquement une portion de code à partir du contexte
						Events.preventDefault($event);
						$this.batchInsert();
						processed = true;
						break;
					
					case 65: // Touche A pour sélectionner tout
						Events.preventDefault($event);
						$this.selectAll();
						$this.onType(delay, function() { onChange(); });
						processed = true;
						break;

					case 66: // Touche B pour entourer d'un block
						Events.preventDefault($event);
						$this.toggleBrackets();
						$this.onType(delay, function() { onChange(); });
						processed = true;
						break;

					case 68: // Touche D pour supprimer une ligne
						Events.preventDefault($event);
						$this.deleteLine();
						$this.onType(delay, function() { onChange(); });
						processed = true;
						break;

					case 71: // Touche G pour ouvrir le menu des générateurs
						Events.preventDefault($event);
						createContextMenu($event);
						processed = true;
						break;

					case 88: // Touche X pour supprimer le contenu sélectionné
						Events.preventDefault($event);
						$this.saveSelection();
						var extract = getSelectedText();

						if (extract && extract !== '') {
							dataManager.toClipboard(extract,
													function() { console.log(extract); },
													function() { console.log("Copy to clipboard failed."); });
						}

						updateCurrentNode('');
						insertText('');
						processed = true;
						break;
				}

				// Pavé numérique (0-9)
				if ($event.keyCode >= 96 && $event.keyCode <= 105)
				{
					Events.preventDefault($event);
					$this.saveSelection();
					$this.insertCode('[' + $event.key + '{{CURSOR}}]', false);
					processed = true;
				}
			}
		}

		if (!processed)
		{
			if ($event.type === 'keydown')
				Components.onKeyDown($event);
			else if ($event.type === 'keyup')
				Components.onKeyUp($event);
		}
	};
	
	component.getById('editor').addEvent('keydown', onEditorChange);
	component.getById('editor').addEvent('keyup', onEditorChange);
	
	//// Recherche et remplace ////

	var selectOccurrence = function()
	{
		var criteria = component.getById('search-input').value;

		if (searching === true && utils.isset(criteria) && criteria !== '' 
			&& searchOccurrences.length > 0 && currentSearchOccurrences > 0
			&& searchOccurrences[currentSearchOccurrences-1])
		{
			startSelect = searchOccurrences[currentSearchOccurrences-1];
			endSelect = startSelect + criteria.length;
			setSelection(startSelect, endSelect);
			updateSelectData();
			highlightLine(currentLineNum);
			getSelectedNodes();
		}
	};

	var searchDown = function()
	{
		console.log("SEARCH DOWN");

		var criteria = component.getById('search-input').value;

		if (searching === true && utils.isset(criteria) && criteria !== '' && searchOccurrences.length > 0)
		{
			currentSearchOccurrences++;

			if (currentSearchOccurrences > searchOccurrences.length)
				currentSearchOccurrences = 1;

			component.getById('search-result').innerHTML = currentSearchOccurrences + '/' + searchOccurrences.length;
			selectOccurrence();
		}
	};

	var searchUp = function()
	{
		console.log("SEARCH UP");

		var criteria = component.getById('search-input').value;

		if (searching === true && utils.isset(criteria) && criteria !== '' && searchOccurrences.length > 0)
		{
			currentSearchOccurrences--;

			if (currentSearchOccurrences <= 0)
				currentSearchOccurrences = searchOccurrences.length;

			component.getById('search-result').innerHTML = currentSearchOccurrences + '/' + searchOccurrences.length;
			selectOccurrence();
		}
	};

	downIcon.onClick = searchDown;
	upIcon.onClick = searchUp;

	var onSearch = function()
	{
		console.log("SEARCH");

		searchOccurrences = [];
		currentSearchOccurrences = 0;

		var criteria = component.getById('search-input').value;

		if (utils.isset(criteria) && criteria !== '')
		{
			var code = getEditorCode();
			searchOccurrences = code.allIndexOf(criteria);
		}

		if (utils.isset(criteria) && criteria !== '' && searchOccurrences.length > 0)
			component.getById('search-result').innerHTML = currentSearchOccurrences + '/' + searchOccurrences.length;
		else
			component.getById('search-result').innerHTML = 'No result';

		updateSearchLayer();
	};

	component.getById('search-input').addEvent('keydown', onSearch);
	component.getById('search-input').addEvent('keyup', onSearch);

	component.getById('replace-button').onClick = function()
	{
		console.log("REPLACE");

		var criteria = component.getById('search-input').value;
		var replaceStr = component.getById('replace-input').value;

		if (searching === true && utils.isset(criteria) && criteria !== '' 
			&& searchOccurrences.length > 0 && currentSearchOccurrences > 0
			&& searchOccurrences[currentSearchOccurrences-1])
		{
			var startOffset = searchOccurrences[currentSearchOccurrences-1];
			var endOffset = startOffset + criteria.length;

			var code = getEditorCode();
			var tmpCode = [code.slice(0, startOffset), replaceStr, code.slice(endOffset)].join('');
			$this.setCode(tmpCode);
			var oldIndex = currentSearchOccurrences;
			onSearch();
			currentSearchOccurrences = oldIndex;

			if (searchOccurrences.length > 0)
			{
				if (currentSearchOccurrences > searchOccurrences.length)
					currentSearchOccurrences = 1;
			}
			else
				currentSearchOccurrences = 0;

			startSelect = startOffset;
			endSelect = startOffset + replaceStr.length;
			setSelection(startSelect, endSelect);
		}
	};

	component.getById('replace-all-button').onClick = function()
	{
		console.log("REPLACE ALL");

		var criteria = component.getById('search-input').value;
		var replaceStr = component.getById('replace-input').value;

		if (searching === true && utils.isset(criteria) && criteria !== '' && searchOccurrences.length > 0)
		{
			var code = getEditorCode();
			var tmpCode = code.replaceAll(criteria, replaceStr);
			$this.setCode(tmpCode);
			var oldIndex = currentSearchOccurrences;
			onSearch();
			currentSearchOccurrences = oldIndex;

			if (searchOccurrences.length > 0)
			{
				if (currentSearchOccurrences > searchOccurrences.length)
					currentSearchOccurrences = 1;
			}
			else
				currentSearchOccurrences = 0;
		}
	};

	component.getById('close-search-icon').onClick = function() { $this.closeSearchBlock(); };

	//// Historique ////

	var undoRedo = function($redo)
	{
		if ($redo === true)
			$this.redo();
		else
			$this.undo();

		$this.updateCode();
		$this.saveSelection();
		$this.onChange();
	};

	this.onUndo = function($event) { undoRedo(false); };
	this.onRedo = function($event) { undoRedo(true); };

	this.onPaste = function($text) { return $text; };

	//// Coller ////
	
	var onPaste = function($event)
	{
		var clipboardData = $event.clipboardData || window.clipboardData;
		console.log(clipboardData);
		//var dataToPaste = clipboardData.getData('text/html');
		var dataToPaste = clipboardData.getData('text/plain').replaceAll('    ', '	');
		console.log('Code to insert : "' + dataToPaste + '"');
		Events.preventDefault($event);
		$this.saveSelection();
		$this.insertCode(dataToPaste, true);
		//$this.onType(delay, function() { onChange(); });
	};
	
	component.getById('editor').addEventListener('paste', onPaste);
	
	this.onRemove = function()
	{
		if (Events.undo === $this.onUndo)
			Events.undo = doNothing;
		
		if (Events.redo === $this.onRedo)
			Events.redo = doNothing;
	};

	//// Dépôt de fichiers image ////
	
	component.onDrop = function($event) { onDropFiles($event); };

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getCode = function() { return codeContent; };
	this.getLanguage = function() { return language; };
	
	// SET
	
	this.setCode = function($code)
	{
		codeContent = $code;
		setEditorCode(codeContent);
		renderLayer.innerHTML = cleanCodeToDisplay(getEditorCode());
		syntaxHighlightAll(); // Coloration syntaxique
		updateSearchLayer(); // Calques de recherche
		// Ajouter un calque d'affichage des espaces et des tabulations
		$this.updateNumLines(); // Colonne des numéros de lignes
		$this.updateScroll(); // Mise à jour de la position du scroll pour touts les calques
		highlightLine(currentLineNum); // Suligner la ligne où se trouve le curseur
	};

	this.setLanguage = function($language)
	{
		var language = $language ? $language : 'plaintext';
		renderLayer.setAttribute('class', 'render ' + language);

		if (language === 'plaintext')
		{
			// Version temporaire
			component.getById('editor').style.color = 'rgb(200, 200, 200)';
			component.getById('render').style.color = 'rgba(200, 200, 200, 0)';
		}

		$this.updateCode();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Events.undo = $this.onUndo;
	Events.redo = $this.onRedo;
	return $this;
}