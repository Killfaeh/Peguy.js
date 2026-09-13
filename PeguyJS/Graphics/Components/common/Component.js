function Component($html)
{
	///////////////
	// Attributs //
	///////////////
	
	Components.nbComponents++;
	var id = Components.nbComponents;
	var html = $html;
	var xml = null;
	var node = null;
	var idNodes = new Map();

	//var tagNamesToRemove = ['script', 'iframe', 'object', 'embed'];
	//var tagNamesToRemove = ['script', 'object', 'embed'];
	var tagNamesToRemove = new Set(['script', 'object', 'embed']);
	var desactivatedKeys = [65, 67, 86, 88];
	
	//////////////
	// Méthodes //
	//////////////
	
	//// Construction du composant ////

	/*
	this.xmlToHtml = function($xmlNode)
	{
		var htmlNode;
		var inputNodes = [];
		
		if ($xmlNode.nodeType !== Node.TEXT_NODE)
		{
			var attributes = $xmlNode.attributes;
			var children = $xmlNode.childNodes;

			htmlNode = Components.createTag($xmlNode);
			
			if (!htmlNode)
				htmlNode = document.createElement($xmlNode.tagName);
			
			if (SVGTAGS.indexOf($xmlNode.tagName) >= 0)
			{
				htmlNode = document.createElementNS(SVGNS, $xmlNode.tagName);
				addNodeMethods(htmlNode);
			}
			
			this.initDefaultEvents(htmlNode);
			
			if (utils.isset(attributes))
			{
				Array.from(attributes).forEach(function($attribute)
				{
					if (!Components.tags[$xmlNode.tagName] || !Components.tags[$xmlNode.tagName].includes($attribute.name))
					{
						if ($attribute.name === 'id' || $attribute.name === 'for' || ($attribute.name === 'target' && $xmlNode.tagName.toLowerCase() === 'form'))
						{
							if (SVGTAGS.indexOf($xmlNode.tagName) >= 0)
								htmlNode.setAttributeNS(null, $attribute.name, $attribute.value + id);
							else
								htmlNode.setAttribute($attribute.name, $attribute.value + id);
						}
						else
						{
							if (SVGTAGS.indexOf($xmlNode.tagName) >= 0 
								&& !/^xml/.test($attribute.name) && !/[a-z]+:[a-z]+/.test($attribute.name) 
								&& $attribute.name !== 'width' && $attribute.name !== 'height')
							{
								var attributeValue = $attribute.value;
							
								if (/url\(#[a-zA-Z0-9-_]+\)/.test(attributeValue))
									attributeValue = attributeValue.replace(/url\(#([a-zA-Z0-9-_]+)\)/gi, 'url(#$1' + id + ')');
							
								htmlNode.setAttributeNS(null, $attribute.name, attributeValue);
							}
							else
								htmlNode.setAttribute($attribute.name, $attribute.value);
						}
					}
				});
			}

			var tmpThis = this;
			
			children.forEach(function($child) { htmlNode.appendChild(tmpThis.xmlToHtml($child)); });
		}
		else
			htmlNode = document.createTextNode($xmlNode.textContent);

		return htmlNode;
	};
	//*/

	this.cleanNodes = function($node)
	{
		var checkedNodes = new Set();
		var iterator = document.createNodeIterator($node, NodeFilter.SHOW_ELEMENT);
		var node;

		while ((node = iterator.nextNode()))
		{
			if (node.nodeType !== Node.TEXT_NODE)
			{
				if (tagNamesToRemove.has(node.tagName.toLowerCase()))
					node.remove();
				else
				{
					if (!checkedNodes.has(node))
					{
						var htmlNode = Components.createTag(node);

						if (!htmlNode)
							htmlNode = node;
						else
							node.parentNode.replaceChild(htmlNode, node);

						if (!checkedNodes.has(htmlNode))
						{
							if (SVGTAGS.includes(node.tagName))
								addNodeMethods(htmlNode);

							this.initDefaultEvents(htmlNode);

							var attributes = node.attributes;

							if (attributes && attributes.length > 0)
							{
								var upperTagName = node.tagName.toUpperCase();
								var tagInfo = Components.tags.get(upperTagName);

								Array.from(attributes).forEach(function($attribute)
								{
									if (!tagInfo || !tagInfo.paramNames.includes($attribute.name))
									{
										if (htmlNode === node && (/^on/.test($attribute.name) || /^javascript:/.test($attribute.value)))
										{
											if (SVGTAGS.includes(node.tagName))
												htmlNode.removeAttributeNS(null, $attribute.name);
											else
												htmlNode.removeAttribute($attribute.name);
										}
										else
										{
											if ($attribute.name === 'id')
												idNodes.set($attribute.value, htmlNode);

											if (node !== $node && (['id', 'for'].includes($attribute.name) || ($attribute.name === 'target' && node.tagName.toLowerCase() === 'form')))
											{
												if (SVGTAGS.includes(node.tagName))
													htmlNode.setAttributeNS(null, $attribute.name, $attribute.value + id);
												else
													htmlNode.setAttribute($attribute.name, $attribute.value + id);
											}
											else if (SVGTAGS.includes(node.tagName))
											{
												if (!/(^xml|[a-zA-Z]+:[a-zA-Z]+)/.test($attribute.name) && (upperTagName !== 'SVG' || !['width', 'height'].includes($attribute.name)))
												{
													var attributeValue = $attribute.value;
										
													if (/url\(#[a-zA-Z0-9-_]+\)/.test(attributeValue))
													{
														attributeValue = attributeValue.replace(/url\(#([a-zA-Z0-9-_]+)\)/gi, 'url(#$1' + id + ')');
														htmlNode.setAttributeNS(null, $attribute.name, attributeValue);
													}
													else  if (htmlNode !== node)
														htmlNode.setAttributeNS(null, $attribute.name, attributeValue);
												}
												else if (htmlNode === node)
													htmlNode.removeAttributeNS(null, $attribute.name);
											}
											else if (htmlNode !== node)
												htmlNode.setAttribute($attribute.name, $attribute.value);
										}
									}
								});
							}
						}

						if (!checkedNodes.has(node))
							checkedNodes.add(node);

						if (!checkedNodes.has(htmlNode))
							checkedNodes.add(htmlNode);
					}
				}
			}
		}

		checkedNodes = new Set();
	};

	this.stringToHtml = function($input)
	{
		var rootTagName = $input.replace(/^< */, '').replace(/( |>).*/g, '');
		var tmpNode = document.createElement('div');

		if (SVGTAGS.includes(rootTagName) && rootTagName !== 'svg')
			tmpNode = document.createElementNS(SVGNS, 'svg');
		else if (rootTagName === 'tr')
			tmpNode = document.createElement('tbody');
		else if (rootTagName === 'td' || rootTagName === 'th')
			tmpNode = document.createElement('tr');
		else if (rootTagName === 'li')
			tmpNode = document.createElement('ul');

		tmpNode.innerHTML = $input;
		var htmlNode = tmpNode.firstChild;

		$this.cleanNodes(htmlNode);

		return htmlNode;
	};
	
	/*
	this.parseNode = function($node)
	{
		if ($node.nodeType !== Node.TEXT_NODE)
		{
			var attrId = $node.getAttribute('id');
			var forId = $node.getAttribute('for');
			
			if (utils.isset(attrId) && attrId !== '')
			{
				$node.setAttribute('id', attrId + "" + id);
				$node.addClass(attrId);
			}
			
			if (utils.isset(forId) && forId !== '')
				$node.setAttribute('for', forId + "" + id);
			
			this.initDefaultEvents($node);
			
			var children = $node.childNodes;
			
			for (var i = 0; i < children.length; i++)
				this.parseNode(children[i]);
		}
		
		return $node;
	};
	//*/
	
	//// Initialisation des événements du composant ////

	this.initDefaultEvents = function($node)
	{
		//var inputTagNames = new Set(['input', 'INPUT', 'select', 'SELECT', 'textarea', 'TEXTAREA']);
		var inputTagNames = new Set(['input', 'INPUT', 'textarea', 'TEXTAREA']);

		if (!$node.hasDefaultEvents && inputTagNames.has($node.tagName))
		{
			$node.onChangeDelay = 0;
			$node.lastKeyStrokeDate = new Date();
			
			$node.onchange = function($event)
			{
				if ((($event.metaKey || Events.keyPressTable['ctrl'] || Events.keyPressTable['cmd']) && !desactivatedKeys.includes($event.keyCode)) || Events.keyPressTable['alt'])
				{
					Events.preventDefault($event);
					Events.stopPropagation($event);
				}
				
				if (utils.isset(this.onChange))
					this.onChange($event);
			};
			
			$node.onkeydown = function($event)
			{
				if ((($event.metaKey || Events.keyPressTable['ctrl'] || Events.keyPressTable['cmd']) && !desactivatedKeys.includes($event.keyCode)) || Events.keyPressTable['alt'])
				{
					Events.preventDefault($event);
					Events.stopPropagation($event);
				}
				
				if (utils.isset(this.onKeyDown))
					this.onKeyDown($event);
			};
			
			$node.onkeyup = function($event)
			{
				var node = this;
				node.lastKeyStrokeDate = new Date();
				
				if (utils.isset(this.onKeyUp))
					this.onKeyUp($event);
				
				if (utils.isset(node.onChange))
				{
					if (node.onChangeDelay > 0)
					{
						setTimeout(function()
						{
							var currentDate = new Date();
							var deltaTime = currentDate.getTime()-node.lastKeyStrokeDate.getTime();
							
							if (deltaTime >= node.onChangeDelay)
								node.onChange($event);
								
						}, node.onChangeDelay+1);
					}
					else
						node.onChange($event);
				}
			};
			
			$node.addEvent('click', function($event)
			{
				if (utils.isset(this.onClick))
					this.onClick($event);
			});
			
			$node.addEvent('dblclick', function($event)
			{
				if (utils.isset(this.onDblClick))
					this.onDblClick($event);
			});
			
			$node.addEvent('mousedown', function($event)
			{
				if (utils.isset(this.onMouseDown))
					this.onMouseDown($event);
			});
			
			$node.addEvent('mousemove', function($event)
			{
				if (utils.isset(this.onMouseMove))
					this.onMouseMove($event);
			});
			
			$node.addEvent('mouseup', function($event)
			{
				if (utils.isset(this.onMouseUp))
					this.onMouseUp($event);
			});
		}
		
		if (!$node.hasDefaultEvents && $node.addEvent)
		{
			$node.addEvent('mouseover', function($event)
			{
				$event = $event || window.event; // Compatibilité IE
				
				var catchNode = $event.targetNode();
				var relatedTarget = $event.relatedTarget || $event.fromElement; // Idem
				
				if (!this.containsInChildren(relatedTarget))
				{
					if (utils.isset(this.onToolTip) && this.onToolTip !== "")
					{
						var toolTip = new ToolTip(this, this.onToolTip);
						var mousePosition = this.mousePosition($event);
						
						if (utils.isset(toolTip.update))
							toolTip.update(mousePosition.x, mousePosition.y + 3);
					}
					
					if (utils.isset(this.onMouseOver))
						this.onMouseOver($event);
				}
			});
			
			$node.addEvent('mouseout', function($event)
			{
				$event = $event || window.event; // Compatibilité IE
				
				var catchNode = $event.targetNode();
				var relatedTarget = $event.relatedTarget || $event.toElement; // Idem
				
				if (!this.containsInChildren(relatedTarget))
				{
					if (utils.isset(this.toolTipOpen))
						this.toolTipOpen.startFadeOut();
					
					if (utils.isset(this.onMouseOut))
						this.onMouseOut($event);
				}
			});
		}

		$node.hasDefaultEvents = true;
	};

	//// Gestion du style du composant ////

	//this.componentName = '';
	this.configStyle = [];

	this.addConfigStyle = function($name, $config) { this.configStyle.push({ name: $name, config: $config }); };

	this.applyConfigStyle = function()
	{
		this.configStyle.forEach(function($el)
		{
			var name = $el.name;
			var configStyle = $el.config();
			var multiTagInstructions = {};

			var apply = function($subConfig)
			{
				if ($subConfig['this'])
					$this.applyStyle($subConfig['this']);

				if ($subConfig['multi-tag'])
				{
					Object.keys($subConfig['multi-tag']).forEach(function($key)
					{
						if (multiTagInstructions[$key])
							multiTagInstructions[$key] = multiTagInstructions[$key].concat($subConfig['multi-tag'][$key]);
						else
							multiTagInstructions[$key] = $subConfig['multi-tag'][$key];
					});
				}

				Object.keys($subConfig).forEach(function($key)
				{
					if ($key !== 'this' && $key !== 'multi-tag' && $this.getById($key))
						$this.getById($key).applyStyle($subConfig[$key]);
				});
			};

			if (configStyle.common)
				apply(configStyle.common);
			if (Loader.getMode() === 'classic' && configStyle.classic)
				apply(configStyle.classic);
			else if (Loader.getMode() === 'mobile' && configStyle.mobile)
				apply(configStyle.mobile);

			STYLE.applyGlobalStyle(name, multiTagInstructions);
		});
	};

	this.setChildren = function($content)
	{
		$this.innerHTML = $this.innerHTML.replace(/{{ *(CHILDREN|children) *}}/, $content);
	};

	this.hideNodes = function($nodes)
	{
		$nodes.forEach(function($id)
		{
			var el = $this.getById($id);

			if (el)
			{
				var oldDisplay = el.getStyle('display');

				if (oldDisplay !== 'none')
					el.oldDisplay = el.getStyle('display');

				el.style.display = 'none';
			}
		});
	};

	this.displayNodes = function($nodes)
	{
		$nodes.forEach(function($id)
		{
			var el = $this.getById($id);

			if (el)
				el.style.display = el.oldDisplay;
		});
	};
	
	//// Accéder aux noeuds du composant ////

	this.getById = function($id)
	{
		var output = idNodes.get($id);

		if (!output)
		{
			var realId = ""+$id+id;
			var idAttribute = $this.getAttribute('id');

			if (realId === idAttribute || $id === idAttribute)
				output = $this;
		}
		
		return output;
	};
	
	this.getRealId = function($id)
	{
		$id = $id.replace(/\+/g, '\\+');
		var realId = $id + '' + id;

		var output = idNodes.get($id);

		if (!output)
		{
			var realId = ""+$id+id;
			var idAttribute = $this.getAttribute('id');

			if (realId === idAttribute || $id === idAttribute)
				output = $this;
		}

		if (output)
			realId = $this.getAttribute('id');
		else
			realId = null;

		return realId;
	};
	
	//// Divers ////

	this.toCode = function()
	{
		/*
		var tagName = $this.tagName;
		var attributes = $this.attributes;
		
		var str = '<' + tagName + ' ';
		
		for (var i = 0; i < attributes.length; i++)
		{
			//if (attributes[i].name === 'id' || attributes[i].name === 'for' || (attributes[i].name === 'target' && $xmlNode.tagName.toLowerCase() === 'form'))
			
			str = str + attributes[i].name + '="' + attributes[i].value + '" ';
		}
		
		str = str + '>' + $this.innerHTML + '</' + tagName + '>';
		
		return str;
		//*/

		return $this.outerHTML;
	};
	
	// Ajout des méthodes de noeuds
	
	var addNodeMethods = function($node)
	{
		//////////////////////////////
		// Manipulation des classes //
		//////////////////////////////
		
		$node.isClass = function($name)
		{
			var isClass = false;
			var className = this.getAttributeNS(null, 'class');
			
			if (utils.isset(className))
			{
				var classes = className.split(" ");
			
				for (var i = 0; i < classes.length; i++)
				{
					if($name === classes[i])
						isClass = true;
				}
			}
		
			return isClass;
		};
		
		$node.addClass = function($name)
		{
			var className = this.getAttributeNS(null, 'class');
			
			if (utils.isset(className) && className !== "")
			{
				var newClass = className;
				
				if (utils.isset($name) && $name !== "" && !this.isClass($name))
					newClass = className + " " + $name;
				
				newClass = newClass.replace(/^ /, '');
				this.setAttributeNS(null, 'class', newClass);
			}
			else
				this.setAttributeNS(null, 'class', $name);
		};
		
		$node.removeClass = function($name)
		{
			var className = this.getAttributeNS(null, 'class');
			
			if (utils.isset(className) && className !== "")
			{
				var classes = className.split(" "); 
				this.setAttributeNS(null, 'class', '');
			
				for (var i = 0; i < classes.length; i++)
				{
					if ($name !== classes[i])
						this.addClass(classes[i]); 
				}
			}
		};
		
		///////////////////////////
		// Manipulation du style //
		///////////////////////////
		
		$node.getStyle = function($name)
		{
			var value = null; 
			
			//console.log(window.getComputedStyle(this, null));
			
			if (window.getComputedStyle)
				value = window.getComputedStyle(this, null).getPropertyValue($name);
			else if (this.currentStyle)
				value =  this.currentStyle[$name]; //IE
			
			return value;
		};
		
		$node.setStyle = function($name, $value)
		{
			// Opacité 
			if ($name === 'opacity')
			{
				if ($value < 0)
					$value = 0; 
				else if ($value > 1)
					$value = 1; 
				
				this.style.filter = "alpha(opacity=" + ($value*100) + ")"; // Cas IE
				this.style.opacity = $value; // Cas usuel
			}
			// Ascenseurs
			else if ($name === 'overflow' && this.tagName.toLowerCase() === 'body')
			{
				this.style.overflow = $value; 
				
				var element = this; 
				
				while (element)
				{
					if (element.tagName.toLowerCase() === 'html')
					{
						element.style.overflow = $value; 
						element = null; 
					}
					else
						element = element.parentNode; 
				}
			}
			// Cas par défaut
			else
				this.style[$name] = $value; 
		};
		
		$node.copyStyleTo = function($target)
		{
			var styles = null;
			
			if (window.getComputedStyle)
				styles = window.getComputedStyle(this, null);
			else if (this.currentStyle)
				styles = this.currentStyle; //IE
			
			if (utils.isset(styles))
			{
				for (var i = 0; i < styles.length; i++)
				{
					if (window.getComputedStyle)
						$target.style[styles[i]] = window.getComputedStyle(this, null).getPropertyValue(styles[i]);
					else
						$target.currentStyle[styles[i]] = this.currentStyle[styles[i]];
				}
			}
		};
		
		/////////////
		// Clonage //
		/////////////
		
		$node.clone = function()
		{
			var clone;
			
			if (this.tagName !== undefined)
			{
				// Création du clone
				clone = document.createElement(this.tagName);
				
				// Attributs du noeuds
				var attributes = this.attributes;
				
				//console.log(this.attributes);
				
				for (var i = 0; i < attributes.length; i++)
					clone.setAttribute(attributes[i].name, this.getAttribute(attributes[i].name));
				
				// Parcours des enfants du noeud
				var children = this.childNodes;
			
				for (var i = 0; i < children.length; i++)
					clone.appendChild(children[i].clone());
			}
			else 
				clone = document.createTextNode(this.nodeValue);
			
			return clone;
		};
		
		$node.cloneForScreenshot = function()
		{
			var clone;
			
			if (this.tagName !== undefined)
			{
				// Création du clone
				clone = document.createElement(this.tagName);
				
				// Attributs du noeuds
				var attributes = this.attributes;
				
				//console.log(this.attributes);
				
				for (var i = 0; i < attributes.length; i++)
					clone.setAttribute(attributes[i].name, this.getAttribute(attributes[i].name));
				
				// Styles du noeud
				this.copyStyleTo(clone);
				
				// Parcours des enfants du noeud
				var children = this.childNodes;
			
				for (var i = 0; i < children.length; i++)
					clone.appendChild(children[i].cloneForScreenshot());
			}
			else 
				clone = document.createTextNode(this.nodeValue);
			
			return clone;
		};
	};
	
	// Gestion du focus
	
	this.focus = function()
	{
		$this.onFocus();
		//Components.addFocus($this);
	};
	
	this.blur = function()
	{
		$this.onBlur();
		//Components.removeFocus($this);
	};
	
	// Méthodes de gestion des événements globaux à surcharger
	
	this.onResize = function() { return false; };
	this.onEndResize = function() { return false; };
	this.onKeyDown = function($event) { return false; };
	this.onKeyUp = function($event) { return false; };
	this.onGamepadConnected = function($event) { return false; };
	this.onGamepadDisconnected = function($event) { return false; };
	this.onGamepadButtonDown = function($event) { return false; };
	this.onGamepadButtonUp = function($event) { return false; };
	this.onGamepadAxisChange = function($event) { return false; };
	this.onRemove = function() { return false; };
	this.onFocus = function() { return false; };
	this.onBlur = function() { return false; };
	this.onUndo = doNothing;
	this.onRedo = doNothing;
	
	this.refresh = function($data) {};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getId = function() { return id; };
	this.getIdNodes = function() { return idNodes; };
	this.getHtml = function() { return html; };
	this.getJSON = function() { return {}; };

	// SET
	
	this.loadFromJSON = function($json) {};

	var $this = this;

	if (typeof html === "string")
		node = this.stringToHtml(html);
	else if (html)
	{
		if (!html.getById)
			this.cleanNodes(html);
		else
		{
			id = html.getId();
			idNodes = html.getIdNodes();
		}

		node = html;
		//node = this.parseNode(html);
	}
	
	if (node && SVGTAGS.indexOf(node.tagName) >= 0)
	{
		this.totalLength = function() { return node.getTotalLength(); };

		this.pointAtLength = function($t)
		{
			if ($t < 0.0)
				$t = 0.0;
			else if ($t > 1.0)
				$t = 1.0;
			
			var totalLength = $this.totalLength();

			var point = node.getPointAtLength($t*totalLength);

			return [point.x, point.y, 0.0];
		};

		this.tangentAtLength = function($t, $precision)
		{
			var precision = $precision;

			if (!utils.isset(precision))
				precision = 0.001;

			var totalLength = $this.totalLength();

			if ($t < 0.0)
				$t = 0.0;
			else if ($t > 1.0)
				$t = 1.0;

			var $tPrev = ($t-precision)*totalLength;
			var $tNext = ($t+precision)*totalLength;
			
			if ($tPrev < 0.0)
				$tPrev = 0.0;
			else if ($tPrev > totalLength)
				$tPrev = totalLength;
			
			if ($tNext < 0.0)
				$tNext = 0.0;
			else if ($tNext > totalLength)
				$tNext = totalLength;
				
			var pointPrev = node.getPointAtLength($tPrev);
			var pointNext = node.getPointAtLength($tNext);
			
			var deltaVect = [pointNext.x-pointPrev.x, pointNext.y-pointPrev.y];
			var tangent = (new Vector(deltaVect)).normalize().values();
			var polar = Trigo.polar(deltaVect[0], deltaVect[1]);

			return [tangent[0], tangent[1], 0.0];
		};

		this.normalAtLength = function($t)
		{
			var tangent = node.tangentAtLength($t);
			return [tangent[1], -tangent[0], 0.0];
		};

		this.samplePoints = function($n, $edges)
		{
			var n = $n;

			if (n < 2)
				n = 2;
			
			if (/ [zZ]/.test(html))
				n = n+1;
			
			var pointsList = [];
			
			for (var i = 0; i < n; i++)
			{
				//if (i < n-1 || !/ [zZ]/.test(html))
				{
					var t = i/(n-1);
					pointsList.push($this.pointAtLength(t));
				}
			}

			console.log("Sampled points : ");
			console.log(pointsList);

			return pointsList;
		};

		this.samplePointsForWebGL = function($n, $edges)
		{
			var n = $n;

			if (n < 2)
				n = 2;
			
			if (/ [zZ]/.test(html))
				n = n+1;

			var pointsList = [];
			
			for (var i = 0; i < n; i++)
			{
				//if (i < n-1 || !/ [zZ]/.test(html))
				{
					var t = i/(n-1);
					var point = $this.pointAtLength(t);
					var tangent = $this.tangentAtLength(t, 1.0/n);
					var normal = [tangent[1], -tangent[0], 0.0];
					var data = { point: point, tangent: tangent, normal: normal, smooth: true, t: t};
					pointsList.push(data);
				}
			}
			
			return pointsList;
		};
	}
	
	$this = utils.extend(node, this);
	Components.componentsList.push($this);
	return $this; 
}