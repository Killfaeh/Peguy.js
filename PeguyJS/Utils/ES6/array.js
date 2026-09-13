if (!Array.isArray)
{
	Array.isArray = function($input)
	{
		var strType = Object.prototype.toString.call($input);
		return strType === '[object Array]';
	};
}

if (!Array.prototype.at)
{
	Array.prototype.at = function($index)
	{
		var n = Math.trunc($index) || 0;
		var len = this.length >>> 0;
		var k = (n >= 0) ? n : len + n;
		
		if (k < 0 || k >= len)
			return undefined;
		
		return this[k];
	};
}

if (!Array.prototype.forEach)
{
	Array.prototype.forEach = function($callback)
	{
		for (var i = 0; i < this.length; i++)
			$callback(this[i], i, this);
	};
}

/*
if (!Array.prototype.every)
{
	Array.prototype.every = function($callback)
	{
		for (var i = 0; i < this.length; i++)
		{
			var continueLoop = $callback(this[i], i, this);

			if (!continueLoop)
				i = this.length;
		}
	};
}
//*/

if (!Array.prototype.map)
{
	Array.prototype.map = function($callback)
	{
		var newArray = [];
		
		for (var i = 0; i < this.length; i++)
		{
			var result = $callback(this[i], i, this);
			newArray.push(result);
		}
		
		return newArray;
	};
}

if (!Array.prototype.filter)
{
	Array.prototype.filter = function($callback)
	{
		var filteredArray = [];
		
		for (var i = 0; i < this.length; i++)
		{
			if ($callback(this[i], i, this))
				filteredArray.push(this[i]);
		}
		
		return filteredArray;
	};
}

if (!Array.prototype.reduce)
{
	Array.prototype.reduce = function($callback, $initValue)
	{
		var accumulator = $initValue;
		var start = 0;

		if (!utils.isset(accumulator))
		{
			accumulator = this[0];
			start = 1;
		}
		
		for (var i = start; i < this.length; i++)
			accumulator = $callback(accumulator, this[i], i, this);
		
		return accumulator;
	};
}

if (!Array.from)
{
	Array.from = function($input, $mapFunction, $thisArg)
	{
		// 1. On transforme l'objet en tableau de base
		var array = Array.prototype.slice.call($input);
		
		// 2. Si une fonction de transformation (mapFn) est fournie
		if (typeof $mapFunction === 'function')
		{
			for (var i = 0; i < array.length; i++)
			{
				// On applique la fonction avec le contexte thisArg si fourni
				array[i] = $mapFunction.call($thisArg, array[i], i);
			}
		}
		
		return array;
	};
}

if (!Array.prototype.includes)
{
	Array.prototype.includes = function($searchElement, $fromIndex)
	{
		var o = Object(this);
		var len = parseInt(o.length, 10) || 0;

		if (len === 0)
			return false;
		
		// Cas où la valeur recherchée est NaN
		if ($searchElement !== $searchElement)
		{
			var start = parseInt($fromIndex, 10) || 0;

			if (start < 0)
				start = len + start;

			if (start < 0)
				start = 0;
			
			for (var k = start; k < len; k++)
			{
				if (o[k] !== o[k])
					return true;
			}
			
			return false;
		}
		
		return Array.prototype.indexOf.call(o, $searchElement, $fromIndex) !== -1;
	};
}

if (!Array.prototype.flat)
{
	Array.prototype.flat = function($depth)
	{
		var depth = (typeof $depth === 'undefined') ? 1 : Number($depth);

		if (depth < 1)
			return Array.prototype.slice.call(this);
		else
		{
			var flatten = function($array, $currentDepth)
			{
				var tmpArray = $array.reduce(function($accumulator, $value)
				{
					if ($currentDepth > 0 && Array.isArray($value))
						return $accumulator.concat(flatten($value, $currentDepth - 1));
					else
						return $accumulator.concat([$value]);
				}, []);

				return tmpArray;
			};

			return flatten(this, depth);
		}
	};
}

if (!Array.prototype.flatMap)
{
	Array.prototype.flatMap = function($callback, $thisArg)
	{
		return this.map($callback, $thisArg).flat(1);
	};
}

if (!Array.prototype.find)
{
	Array.prototype.find = function($callback, $thisArg)
	{
		if (!utils.isset(this))
			throw new TypeError('"this" is null or not defined');
		
		var o = Object(this);
		var len = o.length >>> 0;
		 
		if (typeof $callback !== 'function')
			throw new TypeError('callback must be a function');
		
		for (var i = 0; i < len; i++)
		{
			if ($callback.call($thisArg, o[i], i, o))
				return o[i];
		}
		
		return undefined;
	};
}

if (!Array.prototype.findIndex)
{
	Array.prototype.findIndex = function($callback, $thisArg)
	{
		if (!utils.isset(this))
			throw new TypeError('"this" is null or not defined');
		
		var o = Object(this);
		var len = o.length >>> 0;
		
		if (typeof $callback !== 'function')
			throw new TypeError('callback must be a function');
		
		for (var i = 0; i < len; i++)
		{
			if ($callback.call($thisArg, o[i], i, o))
				return i;
		}
		
		return -1;
	};
}

if (!Array.prototype.findLast)
{
	Array.prototype.findLast = function($callback, $thisArg)
	{
		if (!utils.isset(this))
			throw new TypeError('this is null or not defined');
		
		var o = Object(this);
		var len = o.length >>> 0;
		
		if (typeof $callback !== 'function')
			throw new TypeError('callback must be a function');

		for (var i = len - 1; i >= 0; i--)
		{
			if (i in o && $callback.call($thisArg, o[i], i, o))
				return o[i];
		}
		
		return undefined;
	};
}

if (!Array.prototype.findLastIndex)
{
	Array.prototype.findLastIndex = function($callback, $thisArg)
	{
		if (!utils.isset(this))
			throw new TypeError('this is null or not defined');
		
		var o = Object(this);
		var len = o.length >>> 0;
		
		if (typeof $callback !== 'function')
			throw new TypeError('callback must be a function');
		
		for (var i = len - 1; i >= 0; i--)
		{
			if (i in o && $callback.call($thisArg, o[i], i, o))
				return i;
		}
		
		return -1;
	};
}

if (!Array.prototype.some)
{
	Array.prototype.some = function($callback, $thisArg)
	{
		if (!utils.isset(this))
			throw new TypeError('this is null or not defined');
		
		var o = Object(this);
		var len = o.length >>> 0;
		
		for (var i = 0; i < len; i++)
		{
			if (i in o && $callback.call($thisArg, o[i], i, o))
				return true;
		}
		
		return false;
	};
}

if (!Array.prototype.every)
{
	Array.prototype.every = function($callback, $thisArg)
	{
		if (!utils.isset(this))
			throw new TypeError('this is null or not defined');
		
		var o = Object(this);
		var len = o.length >>> 0;
		
		for (var i = 0; i < len; i++)
		{
			if (i in o && !$callback.call($thisArg, o[i], i, o))
				return false;
		}
		
		return true;
	};
}