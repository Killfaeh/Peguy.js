Object.prototype.parse = function($callbacks)
{
	if (Array.isArray(this))
	{
		if ($callbacks.onOpenArray)
			$callbacks.onOpenArray(this);
		
		$json.forEach(function($item)
		{
			if (Array.isArray($item) || typeof $item === 'object')
				$item.parse($callbacks);
			else if ($callbacks.onValue)
				$callbacks.onValue($item);
		});
		
		if ($callbacks.onCloseArray)
			$callbacks.onCloseArray(this);
	}
	else
	{
		if ($callbacks.onOpenObject)
			$callbacks.onOpenObject(this);
			
		for (var key in this)
		{
			if (Array.isArray(this[key]) || typeof this[key] === 'object')
				this[key].parse($callbacks);
			else if ($callbacks.onKeyValue && typeof this[key] !== 'function')
				$callbacks.onKeyValue(key, this[key]);
		}
		
		if ($callbacks.onCloseObject)
			$callbacks.onCloseObject(this);
	}
};