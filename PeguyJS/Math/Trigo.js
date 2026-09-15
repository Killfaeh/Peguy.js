Trigo =
{
	rad_table: new Float32Array(360),
	sin_table: new Float32Array(360),
	cos_table: new Float32Array(360),
	tan_table: new Float32Array(360),
	
	degToRadRatio: Math.PI/180.0,
	
	rad: function($input)
	{
		if (Number.isInteger($input))
			return Trigo.rad_table[Trigo.normalizeDeg($input)];
		
		return $input*Trigo.degToRadRatio;
	},
	
	deg: function($input) { return $input/Trigo.degToRadRatio; },
	
	normalizeDeg: function($theta) { return (($theta % 360) + 360) % 360; }
	
	isometricAngle: Math.atan(0.5)/Trigo.degToRadRatio,
	
	sin: function($theta)
	{
		if (Number.isInteger($theta))
			return Trigo.sin_table[Trigo.normalizeDeg($theta)];
		
		return Math.sin($theta * Trigo.degToRadRatio);
	},
	
	cos: function($theta)
	{
		if (Number.isInteger($theta))
			return Trigo.cos_table[Trigo.normalizeDeg($theta)];
		
		return Math.cos($theta * Trigo.degToRadRatio);
	},
	
	tan: function($theta)
	{
		if (Number.isInteger($theta))
			return Trigo.tan_table[Trigo.normalizeDeg($theta)];
		
		return Math.tan($theta * Trigo.degToRadRatio);
	},
	
	cartesian: function($r, $theta, $phi)
	{
		var x = $r*Math.cos($theta);
		var y = $r*Math.sin($theta);
		var output = {x: x, y: y};

		if (utils.isset($phi))
		{
			x = x*Math.cos($phi);
			y = y*Math.cos($phi);
			var z = $r*Math.sin($phi);
			output = {x: x, y: y, z: z};
		}

		return output;
	},

	polar: function($x, $y, $z)
	{
		var r = Math.sqrt($x*$x + $y*$y);
		var theta = Trigo.atan($y, $x);
		var output = {r: r, theta: theta};

		if (utils.isset($z))
		{
			var phi = Trigo.atan($z, r);
			r = Math.sqrt($x*$x + $y*$y + $z*$z);
			output = {r: r, theta: theta, phi: phi};
		}

		return output;
	},

	atan: function($y, $x)
	{
		/*
		//console.log("ATAN INPUT : " + $y + ', ' + $x);

		var output = Math.atan($y/$x); 
			
		if ($y <= 0.0 && $x < 0.0)
		{
			output = Math.atan($y/$x)-Math.PI;
			//console.log("ATAN 1 : " + output);
		}
		else if ($y >= 0.0 && $x < 0.0)
		{
			output = Math.atan($y/$x)+Math.PI;
			//console.log("ATAN 2 : " + output);
		}
		else if ($x === 0.0 && $y > 0.0)
		{
			output = Math.PI/2;
			//console.log("ATAN 3 : " + output);
		}
		else if ($x === 0.0 && $y < 0.0)
		{
			output = -Math.PI/2;
			//console.log("ATAN 4 : " + output);
		}

		//console.log("ATAN OUTPUT : " + output);
		//*/

		var output = Math.atan2($y, $x);
			
		return output; 
	},
};

for (var deg = 0; deg < 360; deg++)
{
	var rad = deg * Trigo.degToRadRatio;
	Trigo.rad_table[deg] = rad;
	Trigo.sin_table[deg] = Math.sin(rad);
	Trigo.cos_table[deg] = Math.cos(rad);
	Trigo.tan_table[deg] = Math.tan(rad);
}