Array.prototype.parse = function($callbacks)
{
	if ($callbacks.onOpenArray)
		$callbacks.onOpenArray(this);
		
	this.forEach(function($item)
	{
		if (Array.isArray($item) || typeof $item === 'object')
			$item.parse($callbacks);
		else if ($callbacks.onValue)
			$callbacks.onValue($item);
	});
		
	if ($callbacks.onCloseArray)
		$callbacks.onCloseArray(this);
};