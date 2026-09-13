var requestAnimationFrame = requestAnimationFrame ? requestAnimationFrame : function($callback)
{
	setTimeout(function()
	{
		if ($callback)
			$callback();
	}, 17);
};

if (typeof Object.values !== 'function')
{
	Object.values = function($obj)
	{
		if ($obj === null || typeof $obj === 'undefined')
			throw new TypeError('Cannot convert undefined or null to object');
		
		var values = [];

		for (var key in $obj)
		{
			if (Object.prototype.hasOwnProperty.call($obj, key))
				values.push($obj[key]);
		}
		
		return values;
	};
}

if (typeof Object.entries !== 'function')
{
	Object.entries = function($obj)
	{
		if ($obj === null || typeof $obj === 'undefined')
			throw new TypeError('Cannot convert undefined or null to object');
		
		var entries = [];
		
		for (var key in $obj)
		{
			if (Object.prototype.hasOwnProperty.call($obj, key))
				entries.push([key, $obj[key]]);
		}
		
		return entries;
	};
}

if (typeof Object.groupBy !== 'function')
{
	Object.groupBy = function($items, $callback)
	{
		if (!utils.isset($items))
			throw new TypeError('items is null or not defined');
		
		var result = {};
		var o = Object($items);
		var len = o.length >>> 0;
		
		for (var i = 0; i < len; i++)
		{
			if (i in o)
			{
				var value = o[i];
				var key = $callback(value, i);
				
				if (!result[key])
					result[key] = [];
				
				result[key].push(value);
			}
		}
		
		return result;
	};
}