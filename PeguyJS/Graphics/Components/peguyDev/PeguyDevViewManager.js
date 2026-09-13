function PeguyDevViewManager($gridHTML, $config, $rerouteToDoc)
{
	///////////////
	// Attributs //
	///////////////

	var config =
	{
		mapping: { tabManager: 'centerPanel' },
		MenuToActivate:
		[
			'save', 'save-as', 'search-replace', 'delete-current-line', 
			'duplicate-current-line-above', 'duplicate-current-line-below', 
			'add-tabs', 'remove-tabs', 
			'toggle-line-comment', 'toggle-block-comment'
		],
		menu:
		[
			{ label: 'File', name: 'file', children: [] },
			{
				label: 'Edit',
				name: 'edit',
				children:
				[
					/*
					{ label: 'Undo', name: 'undo', shortcut: Events.metaKey + 'Z', onAction: function()
						{
							
						}
					},
					{ label: 'Redo', name: 'redo', shortcut: '⇧' + Events.metaKey + 'Z', onAction: function()
						{
							
						}
					},
					{ separator: true },
					{ label: 'Cut', name: 'cut', shortcut: Events.metaKey + 'X', onAction: function()
						{
							
						}
					},
					{ label: 'Copy', name: 'copy', shortcut: Events.metaKey + 'C', onAction: function()
						{
							
						}
					},
					{ label: 'Paste', name: 'paste', shortcut: Events.metaKey + 'V', onAction: function()
						{
							
						}
					},
					{ label: 'Select all', name: 'select-all', shortcut: Events.metaKey + 'A', onAction: function()
						{
							
						}
					},
					{ separator: true },
					//*/
					{ label: 'Search/Replace', name: 'search-replace', shortcut: Events.metaKey + 'F', onAction: function() { peguyViewManager.getSelected().getContent().getCodeEditor().openSearchBlock(); } },
					{ separator: true },
					{
						label: 'Lines',
						name: 'lines',
						children:
						[
							{ label: 'Delete current line', name: 'delete-current-line', shortcut: Events.metaKey + 'D', onAction: function() { execCurrentDocumentMethod('deleteLine'); } },
							{ label: 'Duplicate current line above', name: 'duplicate-current-line-above', shortcut: '⇧⌥▲', onAction: function() { execCurrentDocumentMethod('duplicateLine', [true]); } },
							{ label: 'Duplicate current line below', name: 'duplicate-current-line-below', shortcut: '⇧⌥▼', onAction: function() { execCurrentDocumentMethod('duplicateLine', [false]); } },
							{ label: 'Duplicate current line below with increment', name: 'duplicate-current-line-below-increment', shortcut: '⇧⌥D', onAction: function() { execCurrentDocumentMethod('duplicateLine', [false, true]); } },
							{ label: 'Switch current line above', name: 'switch-current-line-above', shortcut: '⌥▲', onAction: function() { execCurrentDocumentMethod('switchLines', [true]); } },
							{ label: 'Switch current line below', name: 'switch-current-line-below', shortcut: '⌥▼', onAction: function() { execCurrentDocumentMethod('switchLines'); } },
							{ label: 'Merge selected lines', name: 'merge-lines', shortcut: '⌥J', onAction: function() { execCurrentDocumentMethod('mergeLines'); } },
						]
					},
					{ separator: true },
					{
						label: 'Blocks and quote',
						name: 'blocks-and-quote',
						children:
						[
							{ label: 'Toggle parenthesis', name: 'toggle-parenthesis', shortcut: '⇧⌥P', onAction: function() { execCurrentDocumentMethod('toggleParenthesis'); } },
							{ label: 'Toggle brackets', name: 'toggle-brackets', shortcut: Events.metaKey + 'B', onAction: function() { execCurrentDocumentMethod('toggleBrackets'); } },
							{ label: 'Toggle square brackets', name: 'toggle-square-brackets', shortcut: '⇧' + Events.metaKey + 'B', onAction: function() { execCurrentDocumentMethod('toggleSquareBrackets'); } },
							{ label: 'Toggle angle brackets', name: 'toggle-angle-brackets', shortcut: '⌥B', onAction: function() { execCurrentDocumentMethod('toggleAngleBrackets'); } },
							{ label: 'Toggle simple quote', name: 'toggle-simple-quote', shortcut: '⌥Q', onAction: function() { execCurrentDocumentMethod('toggleSimpleQuote'); } },
							{ label: 'Toggle double quote', name: 'toggle-double-quote', shortcut: '⇧⌥Q', onAction: function() { execCurrentDocumentMethod('toggleDoubleQuote'); } },
						]
					},
					{ separator: true },
					{ label: 'Add tabs', name: 'add-tabs', shortcut: '⇥', onAction: function() { execCurrentDocumentMethod('insertTab'); } },
					{ label: 'Remove tabs', name: 'remove-tabs', shortcut: '⇧⇥', onAction: function() { execCurrentDocumentMethod('insertTab', [true]); } },
					{ separator: true },
					{ label: 'Toggle line comment', name: 'toggle-line-comment', shortcut: '⌥C', onAction: function() { execCurrentDocumentMethod('toggleLineComment'); } },
					{ label: 'Toggle block comment', name: 'toggle-block-comment', shortcut: '⇧⌥C', onAction: function() { execCurrentDocumentMethod('toggleBlockComment'); } },
					{ separator: true },
					{
						label: 'Format',
						name: 'format',
						children:
						[
							{ label: 'To lower case', name: 'to-lower-case', shortcut: '⌥L', onAction: function() { execCurrentDocumentMethod('toLowerCase'); } },
							{ label: 'To upper case', name: 'to-upper-case', shortcut: '⌥U', onAction: function() { execCurrentDocumentMethod('toUpperCase'); } },
						]
					},
					{
						label: 'Insert',
						name: 'insert',
						children:
						[
							{ label: 'Auto-complete', name: 'auto-complete', shortcut: '⌥Enter', onAction: function() { execCurrentDocumentMethod('insertFromContext'); } },
							{ label: 'Batch insert', name: 'batch-insert', shortcut: Events.metaKey + 'Enter', onAction: function() { execCurrentDocumentMethod('batchInsert'); } },
							{ separator: true },
							{ label: 'Return', name: 'insert-return', shortcut: '⌥R', onAction: function() { execCurrentDocumentMethod('insertSimpleTemplate', ['return']); } },
							{ label: 'Print', name: 'insert-print', shortcut: '⌥P', onAction: function() { execCurrentDocumentMethod('insertSimpleTemplate', ['print']); } },
							{ separator: true },
							{ label: 'Ternary', name: 'insert-ternary', shortcut: '⌥T', onAction: function() { execCurrentDocumentMethod('insertSimpleTemplate', ['ternary']); } },
							{ label: 'If block', name: 'insert-if-block', shortcut: '⌥I', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['if']); } },
							{ label: 'Switch case block', name: 'insert-switch-case-block', shortcut: '⇧⌥S', onAction: function() { execCurrentDocumentMethod('insertFunctionTemplate', ['switchCase']); } },
							{ label: 'Case', name: 'insert-case', shortcut: '⌥S', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['case']); } },
							{ separator: true },
							{ label: 'For block', name: 'insert-for-block', shortcut: '⌥F', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['for']); } },
							{ label: 'While block', name: 'insert-while-block', shortcut: '⇧' + Events.metaKey + 'W', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['while']); } },
							{ label: 'Do while block', name: 'insert-do-while-block', shortcut: '⌥D', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['do']); } },
							{ separator: true },
							{ label: 'Function', name: 'insert-function', shortcut: '⇧⌥F', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['function']); } },
							{ separator: true },
							{ label: 'Class', name: 'insert-class', shortcut: '⇧' + Events.metaKey + 'C', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['class']); } },
							{ label: 'Method', name: 'insert-method', shortcut: '⇧⌥M', onAction: function() { execCurrentDocumentMethod('insertTemplate', ['method']); } },
							{ label: 'Getter and setter', name: 'insert-getter-and-setter', shortcut: '⌥G', onAction: function() { execCurrentDocumentMethod('insertFunctionTemplate', ['getterSetters']); } },
						]
					},

					
				]
			},
			{
				label: 'Go',
				name: 'go',
				children:
				[
					{ label: 'To the beginning of the document', name: 'to-beginning-document', shortcut: '⌥A', onAction: function() { execCurrentDocumentMethod('moveCursorToBeginningOfDocument'); } },
					{ label: 'To the end of the document', name: 'to-end-document', shortcut: '⇧⌥A', onAction: function() { execCurrentDocumentMethod('moveCursorToEndOfDocument'); } },
					{ separator: true },
					{ label: 'To the beginning of the line', name: 'to-beginning-line', shortcut: '⌥◀︎', onAction: function() { execCurrentDocumentMethod('moveCursorToBeginningLine'); } },
					{ label: 'To the end of the line', name: 'to-end-line', shortcut: '⌥▶︎', onAction: function() { execCurrentDocumentMethod('moveCursorToEndLine'); } },
					{ separator: true },
					{ label: 'To the beginning of the word', name: 'to-beginning-word', shortcut: '⌥W', onAction: function() { execCurrentDocumentMethod('moveCursorToBeginningWord'); } },
					{ label: 'To the end of the word', name: 'to-end-word', shortcut: '⇧⌥W', onAction: function() { execCurrentDocumentMethod('moveCursorToEndWord'); } },
				]
			},
		]
	};

	if ($config.mapping)
		config.mapping = $config.mapping;

	if ($config.MenuToActivate)
	{
		for (var i = 0; i < $config.MenuToActivate.length; i++)
		{
			if (!config.MenuToActivate.includes($config.MenuToActivate[i]))
				config.MenuToActivate.push($config.MenuToActivate[i]);
		}
	}

	$config.menu.forEach(function($newMenu)
	{
		var alreadyExists = false;

		config.menu.every(function($menu)
		{
			if ($newMenu.name === $menu.name)
			{
				$newMenu.children.forEach(function($item) { $menu.children.push($item); });
				alreadyExists = true;
				return false;
			}

			return true;
		});

		if (!alreadyExists)
			config.menu.push($newMenu);
	});

	var peguyViewManager = new PeguyViewManager($gridHTML, config, $rerouteToDoc);

	//////////////
	// Méthodes //
	//////////////

	var languages = 
	{
		'as': 'actionscript', 'asr': 'actionscript',
		'adb': 'ada', 'ads': 'ada', 'awk': 'awk',
		'sh': 'bash',
		'bas': 'basic',
		'b': 'brainfuck', 'bf': 'brainfuck',
		'c': 'c',
		'cpp': 'cpp',
		'cs': 'csharp',
		'css': 'css',
		'dart': 'dart',
		'pas': 'delphi', 'dpr': 'delphi', 'dfm': 'delphi',
		'bat': 'dos',
		'erl': 'erlang',
		'f': 'fortran', 'for': 'fortran', 'ftn': 'fortran', 'f77': 'fortran', 'f90': 'fortran', 'f95': 'fortran', 'f03': 'fortran', 'f08': 'fortran',
		'gcode': 'gcode', 'nc': 'gcode', 'ngc': 'gcode', 'tap': 'gcode', 'cnc': 'gcode',
		'glsl': 'glsl', 'vert': 'glsl', 'frag': 'glsl', 'geom': 'glsl', 'tesc': 'glsl', 'tese': 'glsl', 'comp': 'glsl',
		'gml': 'gml',
		'go': 'go',
		'graphql': 'graphql', 'gql': 'graphql',
		'hs': 'haskell', 'lhs': 'haskell',
		'html': 'html',
		'java': 'java',
		'js': 'javascript',
		'json': 'json',
		'jsx': 'jsx',
		'kt': 'kotlin', 'kts': 'kotlin',
		'tex': 'latex',
		'lua': 'lua',
		'm': 'matlab',
		'ml': 'ocaml', 'mli': 'ocaml',
		'pl': 'perl',
		'php': 'php',
		'psl': 'powershell', 'psml': 'powershell', 'psdl': 'powershell', 'pslxml': 'powershell', 'cdxml': 'powershell',
		'pro': 'prolog',
		'py': 'python',
		'rpy': 'python',
		'qml': 'qml',
		'r': 'r',
		'rb': 'ruby',
		'rs': 'rust',
		'scala': 'scala',
		'sql': 'sql',
		'swift': 'swift',
		'svg': 'xml', 'xml': 'xml',
		'twig': 'twig',
		'ts': 'typescript', 'tsx': 'typescript', 'mts': 'typescript', 'cts': 'typescript',
		'vb': 'vbnet',
		'vbe': 'vbscript', 'vsf': 'vbscript', 'vsc': 'vbscript',
		'vhd': 'vhdl', 
		'vim': 'vim', 
		'asm': 'x86asm', 
		'yaml': 'yaml', 'yml': 'yaml', 
	};

	var getDocType = function($filePath)
	{
		var pathArray = $filePath.split('.');
		var extension = pathArray[pathArray.length-1].toLowerCase();

		var docType = 'plaintext';

		if (utils.isset(languages[extension]))
			docType = languages[extension];

		return docType;
	};

	this.createDocument = function($filePath, $data)
	{
		var docType = getDocType($filePath);
		var newDocument = new Document(docType);
		newDocument.setFilePath($filePath);
		newDocument.setData($data);
		newDocument.setSaved(true);
		return newDocument;
	};

	var onDropFiles = function($event)
	{
		Files.drop($event, async function($fileList)
		{
			for (var i = 0; i < $fileList.length; i++)
			{
				var mimeType = $fileList[i].type;
				
				if (/^text\//.test(mimeType) || /^image\/svg\+xml/.test(mimeType) 
				|| /^application\/javascript/.test(mimeType) || /^application\/json/.test(mimeType) || /^application\/typescript/.test(mimeType)
				|| /^application\/xhtml\+xml/.test(mimeType)|| /^application\/xml/.test(mimeType))
				{
					await $this.openFile($fileList[i].path);
				}
			}
		});
	};

	var execCurrentDocumentMethod = function($method, $arg)
	{
		var currentDocument = peguyViewManager.getSelected().getContent();

		if (currentDocument)
		{
			currentDocument.execCurrentEditorMethod('restoreCaret', [false]);
			currentDocument.execCurrentEditorMethod($method, $arg);
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	Events.find = function($event) { execCurrentDocumentMethod('toggleSearchBlock'); };
	//Events.find = function($event) { execCurrentDocumentMethod('openSearchBlock'); };
	//Events.escape = function($event) { execCurrentDocumentMethod('closeSearchBlock'); };

	peguyViewManager.getTabManager().connect('onDropFiles', onDropFiles);

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET

	var $this = utils.extend(peguyViewManager, this);
	return $this;
}