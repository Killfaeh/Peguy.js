
Math.range = function($start, $end, $step)
{
	var step = Math.round($step);
	
	if (!utils.isset(step) || step < 1)
		step = 1;
	
	var output = [];
	
	for (var i = $start; i < $end; i += step)
		output.push(i);
	
	return output;
};

Math.isPowerOf2 = function($input) 
{ 
	var output = true; 
	var input = $input; 
	
	while (input > 2)
	{
		if (input % 2 !== 0)
		{
			output = false; 
			input = 2; 
		}
		else 
			input = input/2; 
	}
	
	return output; 
};

Math.scie = function($input)
{
	var output = 0.0;
		
	if ($input > Math.PI)
	{
		while ($input > Math.PI)
			$input = $input-2*Math.PI; 
	}
	else if ($input < -Math.PI)
	{
		while ($input < -Math.PI)
			$input = $input+2*Math.PI; 
	}
		
	if ($input > 0.0)
		output = $input/Math.PI - 0.5; 
	else 
		output = -$input/Math.PI - 0.5; 
	
	return output; 
}; 

Math.roundToDigit = function($input, $digit)
{
	return Math.round($input*Math.pow(10, $digit))/Math.pow(10, $digit);
};

Math.gcd = function($a, $b)
{
	var a = Math.max($a, $b);
	var b = Math.min($a, $b);

	while (b !== 0)
	{
		var tmp = b;
		b = a%b;
		a = tmp;
	}

	return a;
};

Math.lcm = function($a, $b)
{
	var result = 0;

	if (!utils.isset($b) && Array.isArray($a))
	{
		if (!utils.isset($a) || $a.length === 0)
			result = 0;
		else
		{
			result = $a[0];

			for (var i = 1; i < $a.length; i++)
    			result = Math.lcm(result, $a[i]);
		}
	}
	else
	{
		if ($a === 0 || $b === 0)
			result = 0;
		else
			result = ($a * $b) / Math.gcd($a, $b);
	}

	return result;
};