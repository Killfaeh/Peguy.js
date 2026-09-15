function Matrix3()
{
	///////////////
	// Attributs //
	///////////////
	
	var data = new Float32Array(PreComputeMatrix.identity3);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.identity = function() { data = new Float32Array(PreComputeMatrix.identity3); };
	this.null = function() { data = new Float32Array(PreComputeMatrix.null3); };
	
	this.fill = function($value)
	{
		data = new Float32Array(9);
		
		for (var i = 0; i < 9; i++)
			data[i] = $value;
	};
	
	this.isIdentity = function()
	{
		var isIdentity = true;
		
		for (var i = 0; i < 3; i++)
		{
			for (var j = 0; j < 3; j++)
			{
				if (i === j && newData[i*3 + j] !== 1)
					isIdentity = false;
				else if (i !== j && newData[i*3 + j] !== 0)
					isIdentity = false;
			}
		}

		return isIdentity;
	};
	
	this.isNull = function()
	{
		var isNull = true;
		
		for (var i = 0; i < 3; i++)
		{
			for (var j = 0; j < 3; j++)
			{
				if (newData[i*3 + j] !== 0)
					isNull = false;
			}
		}

		return isNull;
	};
	
	this.multiplyLeft = function($matrix)
	{
		if (!$this.isIdentity() && !$matrix.isIdentity())
		{
			if (!$this.isNull() && !$matrix.isNull())
			{
				var newData = new Float32Array(9);
			
				for (var i = 0; i < 3; i++)
				{
					for (var j = 0; j < 3; j++)
					{
						newData[i*3 + j] = 0;
						
						for (var k = 0; k < 3; k++)
							newData[i*3 + j] = newData[i*3 + j] + $matrix.$matrix.getData()[i*3 + k]*data[k*3 + j];
					}
				}
				
				data = newData;
			}
			else
				this.null();
		}
		
		return $this;
	};
	
	this.multiplyRight = function($matrix)
	{
		if (!$this.isIdentity() && !$matrix.isIdentity())
		{
			if (!$this.isNull() && !$matrix.isNull())
			{
				var newData = new Float32Array(9);
			
				for (var i = 0; i < 3; i++)
				{
					for (var j = 0; j < 3; j++)
					{
						newData[i*3 + j] = 0;
						
						for (var k = 0; k < 3; k++)
							newData[i*3 + j] = newData[i*3 + j] + data[i*3 + k]*$matrix.$matrix.getData()[k*3 + j];
					}
				}
				
				data = newData;
			}
			else
				this.null();
		}

		return $this;
	};
	
	this.multiplyVect = function($input)
	{
		if (!$this.isIdentity())
		{
			var output = new Float32Array(3);
			
			for (var i = 0; i < 3; i++)
			{
				output[i] = 0;
			
				if (!$this.isNull())
				{
					for (var j = 0; j < 3; j++)
						output[i] = output[i] + newData[i*3 + j]*$input[j];
				}
			}
			
			return output;
		}
		
		return $input;
	};
	
	this.transform = this.multiplyVect;
	
	this.transpose = function()
	{
		if (!$this.isIdentity() && !$this.isNull())
		{
			var newData = new Float32Array(9);
			
			for (var i = 0; i < 3; i++)
			{
				for (var j = 0; j < 3; j++)
					newData[i*3 + j] = data[j*3 + i];
			}
			
			data = newData;
		}
		
		return $this;
	};
	
	this.clone = function()
	{
		var clone = new Matrix();
		clone.setData(data);
		return clone;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getData = function() { return data; };
	
	this.getItem = function($index)
	{
		if ($index >= 0 && $index < data.length)
			return data[$index];
		
		return null;
	};
	
	// SET
	
	this.setData = function($data)
	{
		data = new Float32Array(9);
		
		for (var i = 0; i < data.length; i++)
			data[i] = $data[i];
	};
	
	this.setItem = function($index, $value)
	{
		if ($index >= 0 && $index < data.length)
			data[$index] = $value;
	};
	
	var $this = this;
}