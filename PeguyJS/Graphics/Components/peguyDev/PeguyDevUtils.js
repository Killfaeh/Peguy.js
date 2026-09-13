var PeguyDevUtils =
{
	textToList: function($text)
	{
		return $text.split('\n').map(function($item) { return $item.replace(/^([^#]*)#.*/, '$1'); })
									.filter(function($item) { return $item !== ''; });
	},
	
	listToHierarchy: function($list)
	{
		if ($list.length > 0)
		{
			var startCountTab = $list[0].replace(/^(	*)[^	]*/, '$1').length;
		
			var tmpData = [];
			var row = { name: "", children: [] };
		
			$list.forEach(function($item)
			{
				var countTab = $item.replace(/^(	*)[^	]*/, '$1').length;
			
				if (countTab === startCountTab)
				{
					row = { name: $item.remove(/^(	*)/).trim(), children: [] };
					tmpData.push(row);
				}
				else if (countTab > startCountTab)
					row.children.push($item);
			});
			
			var data = tmpData.map(function($item)
			{ 
				var output = { name: $item.name };
				
				if ($item.children.length > 0)
					output.children = PeguyDevUtils.listToHierarchy($item.children);
				
				return output;
			});
		
			return data;
		}
		else
			return [];
	},
	
	/////////////////////
	// Utilitaires XML //
	/////////////////////
	
	textToXMLprops: function($text)
	{
		return $text.split(' ').reduce(function($code, $prop)
		{
			var trimProp = $prop.trim();
			var propArray = trimProp.split('=');
			var propName = propArray[0];
			var propValue = trimProp.remove(/^[a-zA-Z0-9_-]+=/).removeAll('"');
			
			if (propName !== '')
				return $code + propName + '="' + propValue + '" ';
			
			return $code;
		}, "");
	},
	
	xmlToList: function($xml, $isXSL)
	{
		return $xml.split('\n').filter(function($row) { return !/^[	 ]*<\//.test($row); })
								.map(function($row)
								{
									if (/^[	 ]*<!--/.test($row))
										return $row.replace(/^([	 ]*)<!-- */, '$1# ').remove(/ *-->/).trimEnd();
									
									if ($row !== '' && !/^[	 ]*$/.test($row) && !/^[	 ]*</.test($row))
										return $row.replace(/^([	 ]*)/, '$1text ');
									
									var output = $row.remove('<').remove('/>').remove('>').trimEnd();
									
									if ($isXSL)
									{
										// Améliorer le traitement des attributs
										output = output.replace(/^([	 ]*)xsl:/, '$1');
									}
									
									return output;
									
								}).join('\n');
	},
	
	//////////////////////
	// Utilitaires HTML //
	//////////////////////
	
	htmlMonoTag: ['img', 'input'],
	
	hierarchyToHTML: function($hierarchy, $startTab, $peguyComponent)
	{
		return $hierarchy.map(function($item)
		{
			var ouputCode = '';
			var tagName = $item.name.split(' ')[0];
			var propsTxt = $item.name.remove(new RegExp('^' + tagName + ' *')).trim();
			var props = PeguyDevUtils.textToXMLprops(propsTxt);
			
			if (/^#/.test(tagName))
				ouputCode = $startTab + '<!-- ' + $item.name.remove(/^# +/) + ' -->';
			else if (tagName.toLowerCase() === 'text')
				ouputCode = $startTab + ($peguyComponent ? "+ '" : '') + $item.name.remove(/^text +/) + ($peguyComponent ? "'" : '');
			else if (PeguyDevUtils.htmlMonoTag.includes(tagName) && (!$item.children || $item.children.length <= 0))
				ouputCode = $startTab + ($peguyComponent ? "+ '" : '') + '<' + tagName + ' ' + props + '/>' + ($peguyComponent ? "'" : '');
			else
			{
				ouputCode = $startTab + ($peguyComponent ? "+ '" : '') + '<' + tagName + ' ' + props + '>';
			
				if ($item.children && $item.children.length > 0)
				{
					ouputCode = ouputCode + ($peguyComponent ? "'" : '') + '\n';
					ouputCode = ouputCode + PeguyDevUtils.hierarchyToHTML($item.children, $startTab + '	', $peguyComponent);
					ouputCode = ouputCode + $startTab + ($peguyComponent ? "+ '" : '') + '</' + tagName + '>' + ($peguyComponent ? "'" : '');
				}
				else
					ouputCode = ouputCode + '</' + tagName + '>' + ($peguyComponent ? "'" : '');
			}
			
			return ouputCode;
			
		}).join('\n');
	},
	
	/////////////////////
	// Utilitaires XSL //
	/////////////////////
	
	xslMonoTag: [ 'value-of', 'variable', 'copy-of', 'apply-templates', 'param', 'with-param', 'output', 'sort' ],
	
	xslDict:
	{
		'value-of': 'value-of', 'value': 'value-of', 'val': 'value-of', 
		'variable': 'variable', 'var': 'variable', 
		'copy-of': 'copy-of', 'copy': 'copy',
		'template': 'template', 'function': 'template', 'func': 'template', 'tmp': 'template',
		'apply-templates': 'apply-templates', 'apply-template': 'apply-templates', 'apply-function': 'apply-templates', 'apply-func': 'apply-templates', 'apply-tmp': 'apply-templates',
		'use-template': 'apply-templates', 'use-function': 'apply-templates', 'use-func': 'apply-templates', 'use-tmp': 'apply-templates',
		'call-template': 'call-template', 'call-function': 'call-template', 'call-func': 'call-template', 'call-tmp': 'call-template',
		'element': 'element', 'el': 'element',
		'attribute': 'attribute', 'attr': 'attribute',
		'param': 'param', 'with-param': 'with-param', 'use-param': 'with-param',
		'if': 'if', 
		'choose': 'choose', 'switch': 'choose', 
		'when': 'when', 'case': 'when', 'else-if': 'when', 'elif': 'when', 
		'otherwise': 'otherwise', 'else': 'otherwise', 'default': 'otherwise',
		'for-each': 'for-each', 'foreach': 'for-each', 'for': 'for-each', 
		'sort': 'sort', 
		'output': 'output', 'out': 'output', 
		'text': 'text'
	},
	
	textToXSLprops: function($tag, $text)
	{
		var propsDict = {};
		var propsArray = [];
		
		$text.split(' ').forEach(function($prop)
		{
			var trimProp = $prop.trim();
			
			if (trimProp !== '' 
				&& (($tag !== 'if' && !trimProp.includes('=')) 
						|| ($tag === 'if' && !trimProp.includes('test='))
					)
				)
			{
				propsArray.push(trimProp.removeAll('"'));
			}
			else
			{
				var propArray = trimProp.split('=');
				var propName = propArray[0];
				var propValue = trimProp.remove(/^[a-zA-Z0-9_-]+=/).removeAll('"');
				
				if (propName !== '')
					propsDict[propName] = propValue;
			}
		});
		
		var selectTags = [ 'value-of', 'copy-of', 'apply-templates' ];
		var nameTags = [ 'variable', 'element', 'attribute', 'param', 'with-param', 'call-template' ];
		var matchTags = [ 'template' ];
		var testTags = [ 'if', 'when' ];
		var selectOrder = [ 'sort' ];
		
		if (propsArray.length > 0)
		{
			if (selectTags.includes($tag))
				return 'select="' + propsArray[0] + '"';
			else if (nameTags.includes($tag))
				return 'name="' + propsArray[0] + '"' + (propsArray[1] ? (' select="' + propsArray[1] + '"') : '');
			else if (matchTags.includes($tag))
				return 'match="' + propsArray[0] + '"' + (propsArray[1] ? (' mode="' + propsArray[1] + '"') : '');
			else if (testTags.includes($tag))
				return 'test="' + propsArray[0] + '"';
			else if (selectOrder.includes($tag))
				return 'select="' + propsArray[0] + '"' + (propsArray[1] ? (' order="' + propsArray[1] + '"') : '');
			else
				return PeguyDevUtils.textToXMLprops($text);
		}
		else if (Object.keys(propsDict).length > 0)
			return Object.keys(propsDict).reduce(function($str, $key) { return $str + $key + '="' + propsDict[$key] + '" '; }, '');
		
		return PeguyDevUtils.textToXMLprops($text);
	},
	
	hierarchyToXSL: function($hierarchy, $startTab, $root)
	{
		var startTab = $startTab + ($root ? '	' : '');
		
		var outputCode = $hierarchy.reduce(function($code, $item)
		{
			var tagName = $item.name.split(' ')[0];
			var outputTag = PeguyDevUtils.xslDict[tagName] ? ('xsl:' + PeguyDevUtils.xslDict[tagName]) : tagName;
			var propsTxt = $item.name.remove(new RegExp('^' + tagName + ' *')).trim();
			var props = PeguyDevUtils.xslDict[tagName] ? PeguyDevUtils.textToXSLprops(outputTag.remove(/^xsl:/), propsTxt) : PeguyDevUtils.textToXMLprops(propsTxt);
			
			if (/^#/.test(tagName))
				$code = $code + startTab + '<!-- ' + $item.name.remove(/^# +/) + ' -->\n';
			else if (tagName.toLowerCase() === 'text')
				$code = $code + startTab + '<xsl:text>' + $item.name.remove(/^text +/) + '</xsl:text>\n';
			else if (PeguyDevUtils.xslMonoTag.includes(outputTag.remove(/^xsl:/)) && (!$item.children || $item.children.length <= 0))
				$code = $code + startTab + '<' + outputTag + ' ' + props + '/>' + '\n';
			else
			{
				$code = $code + startTab + '<' + outputTag + ' ' + props + '>';
			
				if ($item.children && $item.children.length > 0)
				{
					$code = $code + '\n';
					$code = $code + PeguyDevUtils.hierarchyToXSL($item.children, startTab + '	', false);
					$code = $code + startTab + '</' + outputTag + '>' + '\n';
				}
				else
					$code = $code + '</' + outputTag + '>' + '\n';
			}
			
			return $code;
			
		}, '');
		
		if ($root)
		{
			outputCode = '<?xml version="1.0" ?>\n'
							+ '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" >\n'
								+ outputCode
							+ '</xsl:stylesheet>';
		}
		
		return outputCode;
	},
	
	/////////////////////
	// Utilitaires SQL //
	/////////////////////
	
	//// MySQL ////
	
	sqlDrop: function($tableName) { return `DROP TABLE IF EXISTS DATABASE_NAME.${$tableName} RESTRICT;`; },
	
	sqlCreateColumn: function($name, $type, $default, $null)
	{
		var code = `${$name} ${$type}`;
			
		if ($default !== null)
			code = code + (($type === 'TEXT' || $type === 'DATETIME') ? ` DEFAULT "${$default}"` : ` DEFAULT ${$default}`);
			
		code = code + (($null === false) ? ' NOT NULL' : '');
			
		return code;
	},
	
	sqlCreateColumns: function($columns)
	{
		return $columns.map(function($column)
		{
			return PeguyDevUtils.sqlCreateColumn($column['name'], $column['type'], $column['default'], $column['null']);
		}).join(',\n');
	},
	
	sqlCreateConstraint: function($name, $type, $reference, $table, $column)
	{
		var code = `CONSTRAINT ${$name}`;

			if ($type === 'pk')
				code = code + ` PRIMARY KEY (${$reference})`;
			else
				code = code + ` FOREIGN KEY (${$column}) REFERENCES ${$table}(${$reference})`;
			
			return code;
	},
	
	sqlCreateConstraints: function($constraints)
	{
		return $constraints.map(function($constraint)
		{
			return PeguyDevUtils.sqlCreateConstraint($constraint['name'], $constraint['type'], $constraint['reference'], $constraint['table'], $constraint['column']);
		}).join(',\n');
	},
	
	sqlCreate: function($json, $parent)
	{
		var createTableContent = $json['columns'].map(function ($column, $i) { return PeguyDevUtils.sqlCreateColumn($column['name'], $column['type'], $column['default'], $column['null']); }).join(',\n');
		createTableContent = createTableContent + $json['constraints'].map(function ($constraint, $i) { return PeguyDevUtils.sqlCreateConstraint($constraint['name'], $constraint['type'], $constraint['referenceColumn'], $constraint['referenceTable'], $constraint['column']); }).join(',\n');
		
		if ($parent)
			createTableContent = createTableContent + ',\n' + PeguyDevUtils.sqlCreateConstraint(`fk_${$json['tableName']}_${$parent['tableName']}`, 'fk', 'id', $parent['tableName'], `${$parent['tableName']}_id`);
		
		return `CREATE TABLE IF NOT EXISTS DATABASE_NAME.${$json['tableName']}\n(id INTEGER AUTO_INCREMENT${createTableContent})\nENGINE = InnoDB;`;
	},
	
	sqlSelectColumn: function($tableName, $columnName, $tabs)
	{
		$tabs = $tabs ? $tabs : '';
		return `${$tabs}${$tableName}.${$columnName} AS ${$columnName}`;
	},
	
	sqlSelectColumns: function($json, $tabs)
	{
		$tabs = $tabs ? $tabs : '';
		return $json['columns'].map(function($column)
		{
			return PeguyDevUtils.sqlSelectColumn($json['tableName'], $column['name'], $tabs);
		}).join(',\n');
	},
	
	sqlSelect: function($json, $tabs)
	{
		$tabs = $tabs ? $tabs : '';
		var columnsToSelect = $json['columns'].map(function ($column, $i) { return PeguyDevUtils.sqlSelectColumn($json['tableName'], $column['name'], $tabs); }).join(',\n');
		var code = `SELECT ${columnsToSelect} FROM DATABASE_NAME.${$json['tableName']} ${$json['tableName']}`; // Ajouter les OUTER JOIN
		return code;
	},
	
	sqlInsert: function($json, $tabs)
	{
		$tabs = $tabs ? $tabs : '';
		
		let insertColumns = $json['columns'].map(function ($column, $i) { return `\n${$tabs}${$column['name']},`; }).join('');
		insertColumns = insertColumns.replace(/^	*/, ' ').replace(/,$/, '');
		
		let insertValues = $json['columns'].map(function ($column, $i) { return `\n${$tabs}:${$column['name']},`; }).join('');
		insertValues = insertValues.replace(/^	*/, ' ').replace(/,$/, '');
		
		const insertQuery = `INSERT INTO DATABASE_NAME.${$json['tableName']}(${insertColumns})\n${$tabs}VALUES (${insertValues})`;
		
		return insertQuery;
	},
	
	sqlUpdate: function($json, $tabs)
	{
		$tabs = $tabs ? $tabs : '';
		let updateQueryContent = $json['columns'].map(function ($column, $i) { return `\n${$tabs}${$column['name']} = :${$column['name']},`; }).join('');
		updateQueryContent = updateQueryContent.replace(/^	*/, ' ').replace(/,$/, '');
		return `UPDATE DATABASE_NAME.${$json['tableName']}\n${$tabs}SET ${updateQueryContent}\n${$tabs}WHERE id = :id`;
	},
	
	sqlDelete: function($tableName) { return `DELETE FROM DATABASE_NAME.${$tableName} WHERE id = :id`; },
};