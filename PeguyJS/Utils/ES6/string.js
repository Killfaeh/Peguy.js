if (!String.prototype.includes)
{
	String.prototype.includes = function($search, $start)
	{
		if (typeof $start !== 'number')
			$start = 0;
		
		if ($start + $search.length > this.length)
			return false;
		else
			return this.indexOf($search, $start) !== -1;
	};
}

//// replaceAll ////

if (!String.prototype.replaceAll)
{
	String.prototype.replaceAll = function($searchValue, $replaceValue)
	{
		// Erreur
		if (!utils.isset(this))
			throw new TypeError("this is null or not defined");
		
		// Regex
		if (Object.prototype.toString.call($searchValue) === '[object RegExp]')
		{
			if (!$searchValue.global)
				throw new TypeError("replaceAll must be called with a global RegExp");
			
			return this.replace($searchValue, $replaceValue);
		}
		
		// Chaîne de caractères
		var escapedSearchValue = String($searchValue).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		
		return this.replace(new RegExp(escapedSearchValue, 'g'), $replaceValue);
	};
}

//// trim : Suppression des espaces aux extrémités ////

if (!String.prototype.trimStart)
	String.prototype.trimStart = function() { return this.replace(/^ */, ''); };

if (!String.prototype.trimEnd)
	String.prototype.trimEnd = function() { return this.replace(/ *$/, ''); };

if (!String.prototype.trim)
	String.prototype.trim = function() { return this.replace(/^ */, '').replace(/ *$/, ''); };

//// pad : Ajout de caractères aux extrémités ////

if (!String.prototype.padStart)
{
	String.prototype.padStart = function($targetLength, $padString)
	{
		$targetLength = $targetLength >> 0;
		var str = String(this);
		
		if (str.length >= $targetLength)
			return str;
		
		$padString = String((typeof $padString !== 'undefined') ? $padString : ' ');
		
		var fillLength = $targetLength - str.length;
		
		var filler = '';
		
		while (filler.length < fillLength)
			filler += $padString;
		
		return filler.slice(0, fillLength) + str;
	};
}

if (!String.prototype.padEnd)
{
	String.prototype.padEnd = function($targetLength, $padString)
	{
		$targetLength = $targetLength >> 0;
		var str = String(this);
		
		if (str.length >= $targetLength)
			return str;
		
		$padString = String((typeof $padString !== 'undefined') ? $padString : ' ');
		
		var fillLength = $targetLength - str.length;
		
		var filler = '';
		
		while (filler.length < fillLength)
			filler += $padString;
		
		return str + filler.slice(0, fillLength);
	};
}

String.prototype.render = function($data)
{
	var output = this;

	output = output.replace(/\${ *([^ }]*) *}/g, '${$1}');

	for (var key in $data)
		output = output.replaceAll('${' + key + '}', $data[key]);

	return output;
};