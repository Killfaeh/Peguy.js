function Calendar($date)
{
	///////////////
	// Attributs //
	///////////////
	
	var dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	var today = new Date();
	var date = $date ? $date : new Date();
	
	var year = date.getFullYear();
	var month = date.getMonth();
	var weekLength = 7;
	var weekStart = 0;
	
	var start = new Date();
	var end = new Date();
	
	var enable = true;
	var disableFuture = false;
	var shortMode = false;
	var open = false;
	
	var changedByUser = false;
	
	var html = '<div class="calendar" >'
					+ '<p><input type="text" id="selectedDate" class="selectedDate" name="selectedDate" autocomplete="off" readonly="readonly" /></p>'
				+ '</div>';
				
	var component = new Component(html);
	
	var panelHTML = '<p id="navigation" class="navigation" >'
						+ '<span id="previousMonth" class="previousMonth" >◄</span>'
						+ '<span id="month" ></span>'
						+ '<span id="nextMonth" class="nextMonth" >►</span>'
					+ '</p>'
					+ '<table>'
						+ '<thead><tr id="week" ></tr></thead>'
						+ '<tbody id="days" class="days" ></tbody>'
					+ '</table>'
					+ '<p><input id="today" class="today" type="button" value="' + KEYWORDS.today + '" /></p>';
					
	var invisibleFreezeScreen = new InvisibleFreezeScreen();
	
	var panel = new FloatingPanel(panelHTML);
	
	panel.addClass('panel');
	panel.addClass('calendarPanel');
	
	var navigation = panel.getById('navigation');
	var previousMonth = panel.getById('previousMonth');
	var currentMonth = panel.getById('month');
	var nextMonth = panel.getById('nextMonth');
	var week = panel.getById('week');
	var days = panel.getById('days');
	var todayButton = panel.getById('today');
	
	// Style

	panel.addConfigStyle("calendar", function ()
	{
	    return {
	        classic:
	        {
				"multi-tag":
	        	{
					".calendarPanel td:hover span":
					[
						"background-Color: " + (function() { return STYLE.calendarHoverBackgroundColor; })(),
						"border-radius: " + (function() { return STYLE.calendarRingRadius; })(),
					],
					
					".days td .weekend":
					[
						"color: " + (function() { return STYLE.calendarWeekendColor; })(),
						"background-color: " + (function() { return STYLE.calendarWeekendBackgroundColor; })()
					],
					
					".days td .otherMonth":
					[
						"color: " + (function() { return STYLE.calendarOtherMonthColor; })()
					],
					
					".days td .today":
					[
						"color: " + (function() { return STYLE.calendarTodayColor; })(),
						"background-color: " + (function() { return STYLE.calendarTodayBackgroundColor; })(),
						"border-radius: " + (function() { return STYLE.calendarRingRadius; })(),
					],
					
					".days td .selected":
					[
						"color: " + (function() { return STYLE.calendarSelectedColor; })(),
						"background-color: " + (function() { return STYLE.calendarSelectedBackgroundColor; })(),
						"border-radius: " + (function() { return STYLE.calendarRingRadius; })(),
					],
					
					".days td:hover .today":
					[
						"color: " + (function() { return STYLE.calendarTodayColor; })(),
						"background-color: " + (function() { return STYLE.calendarTodayBackgroundColor; })(),
						"border-radius: " + (function() { return STYLE.calendarRingRadius; })(),
					],
					
					".days td:hover .selected":
					[
						"color: " + (function() { return STYLE.calendarSelectedColor; })(),
						"background-color: " + (function() { return STYLE.calendarSelectedBackgroundColor; })(),
						"border-radius: " + (function() { return STYLE.calendarRingRadius; })(),
					]
				},

				"previousMonth":
				{
					"color": (function() { return STYLE.calendarArrowsColor; })()
				},
				
				"nextMonth":
				{
					"color": (function() { return STYLE.calendarArrowsColor; })()
				},
			},
	    };
	});

	panel.applyConfigStyle();

	
	//////////////
	// Méthodes //
	//////////////
	
	var select = function($date)
	{
		if (enable === true)
		{
			var selectedNode = panel.getElementsByClassName(date.getSQLFormat());
		
			if (selectedNode && selectedNode.length > 0)
				selectedNode[0].removeClass('selected');
		
			date = today;
			
			if (!disableFuture || (disableFuture && $date <= today.getSQLFormat()))
				date = $date.getDate();
			
			year = date.getFullYear();
			month = date.getMonth();
			
			selectedNode = panel.getElementsByClassName(date.getSQLFormat());
		
			if (selectedNode && selectedNode.length > 0)
				selectedNode[0].addClass('selected');
			
			component.getById('selectedDate').value = date.toLocaleDateString(undefined, dateFormatOptions);
			
			$this.onChange(date.getSQLFormat());
		}
	};
	
	var resize = function()
	{
		var componentPosition = component.getById('selectedDate').position();
		var componentWidth = component.getById('selectedDate').offsetWidth;
		var panelWidth = panel.offsetWidth;
		var panelHeight = panel.offsetHeight;
		var panelPosition = panel.position();
		
		invisibleFreezeScreen.resize(component.getById('selectedDate'));
		
		panel.style.minWidth = component.getById('selectedDate').offsetWidth + "px";
		panel.style.left = (componentPosition.x + (componentWidth-panelWidth)/2.0) + 'px';
		panel.style.top = (componentPosition.y+component.getById('selectedDate').offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.height = (Screen.getHeight()-20) + "px";
			panel.style.top = "7px";
			panel.style.overflow = "auto";
		}
		else if (componentPosition.y + component.getById('selectedDate').offsetHeight + panelHeight > Screen.getHeight())
			panel.style.top = (componentPosition.y-panelHeight) + "px";
	};
	
	var autoResize = function()
	{
		//if (autoresize === true)
		/*
		{
			var dateContentSize = utils.getInputTextSize(component.getById('selectedDate'));
			
			if (dateContentSize.width <= 0)
				requestAnimationFrame(function() { autoResize(); });
			else
				component.getById('selectedDate').style.width = (dateContentSize.width+20) + 'px';
		}
		//*/
		
		invisibleFreezeScreen.resize(component.getById('selectedDate'));
	};
	
	var buildInterface = function()
	{
		//// Réinitialisation ////
		
		currentMonth.empty();
		week.empty();
		days.empty();
		
		//// Construction ////
		
		var displayedDay = date.getDate();
		month = date.getMonth();
		var displayedMonth = month+1;
		year = date.getFullYear();
		
		displayedDay = (displayedDay < 10) ? '0'+displayedDay : displayedDay;
		displayedMonth = (displayedMonth < 10) ? '0'+displayedMonth : displayedMonth;
		
		//component.getById('selectedDate').set("value", DAYNAMES[date.getDay()] + ' ' + date.getDate() + ' ' + MONTHNAMES[month] + ' ' + year);
		
		if (shortMode === true)
			component.getById('selectedDate').value = date.toLocaleDateString(undefined);
		else
			component.getById('selectedDate').value = date.toLocaleDateString(undefined, dateFormatOptions);
		
		currentMonth.innerHTML = " " + MONTHNAMES[month] + " " + year + " ";
		
		// Jours de la semaine
		
		var daysArray = [0,1,2,3,4,5,6];
		
		week.innerHTML = daysArray.map(function($dayNum)
		{
			var dayNum = $dayNum + weekStart;
			
			if (dayNum >= 7)
				dayNum -= 7;
			
			var dayName = DAYNAMES[dayNum].substring(0, 3) + ".";
			var dayHtml = '<th class="dayName" >' + dayName + '</th>';
			
			return dayHtml;
		}).join('');
		
		//// Jours ////
		
		// Récupération des bornes de la période à afficher 
		
		var startMonth = new Date(year, month, 1);
		var startNum = startMonth.getDay()-weekStart;
		startNum = (startNum < 0) ? startNum+7 : startNum;
		
		start = new Date();
		start.setTime(startMonth.getTime() - DateUtils.dayToTime(startNum));
		
		var endMonth = new Date(year, month + 1, 0);
		var endNum = endMonth.getDay()-weekStart;
		endNum = (endNum < 0) ? endNum+7 : endNum;
		
		end = new Date();
		end.setTime(endMonth.getTime() + DateUtils.dayToTime(6-endNum));
		
		var weeksNb = Math.round(DateUtils.timeToDay(end.getTime()-start.getTime())/7);
		var weeksIndex = [];
		
		for (var i = 0; i < weeksNb; i++)
			weeksIndex.push(i);
		
		// Affichage des jours 
		
		var daysHtml = weeksIndex.map(function($weekNum)
		{
			var displayWeek = false;
			var weekHTML = '<tr>';
			
			weekHTML += daysArray.map(function($dayNum)
			{
				var day = new Date();
				day.setTime(start.getTime() + DateUtils.dayToTime($weekNum*7 + $dayNum) + DateUtils.dayToTime(0.5)); // On prend le jour à midi pour gérer le cas des changements d'heure
				var sqlDay = day.getSQLFormat();
				
				if (($dayNum <= 0 || $dayNum >= weekLength-1) && day.getMonth() === date.getMonth())
					displayWeek = true;
				
				var dayHtml = '<td date="' + sqlDay + '" >';
				
				if (day.getMonth() !== month)
					dayHtml += '<span class="otherMonth ' + sqlDay + '" date="' + sqlDay + '" >';
				else if (day.getDay() === 0 || day.getDay() === 6)
					dayHtml += '<span class="weekend ' + sqlDay + '" date="' + sqlDay + '" >';
				else
					dayHtml += '<span class="' + sqlDay + '" date="' + sqlDay + '" id="' + sqlDay + '" >';
				
				dayHtml += day.getDate();
				dayHtml += '</span></td>';
				
				return dayHtml;
				
			}).join('');
			
			weekHTML += '</tr>';
			
			if (displayWeek === true)
				return weekHTML;
			else
				return '';
			
		}).join('');
		
		days.innerHTML = daysHtml;
		
		var todayNode = panel.getElementsByClassName(today.getSQLFormat());
		var selectedNode = panel.getElementsByClassName(date.getSQLFormat());
		
		if (todayNode && todayNode.length > 0)
			todayNode[0].addClass('today');
		
		if (selectedNode && selectedNode.length > 0)
			selectedNode[0].addClass('selected');
		
		daysNode = days.getElementsByTagName('td');
		
		Array.from(daysNode).forEach(function($node)
		{
			$node.onClick = function()
			{
				var selectedDate = this.getAttribute("date");
				select(selectedDate);
				$this.close();
				changedByUser = true;
			};
		});
		
		requestAnimationFrame(function() { autoResize(); });
	};
	
	buildInterface();

	this.onOpen = function() {};
	
	this.open = function()
	{
		if (enable === true)
		{
			$this.onOpen();
			
			var calendarWidth = component.offsetWidth;
			var panelWidth = panel.offsetWidth;
			
			//panel.style.left = ((calendarWidth-panelWidth)/2) + 'px';
	
			// Gérer le cas où la liste sort de l'écran
			//var panelHeight = panel.offsetHeight;
			//var panelPosition = panel.position();
			
			//if (panelPosition.y + panelHeight > Screen.getHeight())
				//panel.setStyle("top", (-panelHeight-component.getById('selectedDate').offsetHeight) + "px");
			
			invisibleFreezeScreen.display(component.getById('selectedDate'));
			panel.display();
			resize();
			open = true;
		}
	};
	
	this.close = function()
	{
		invisibleFreezeScreen.hide();
		panel.hide();
		open = false;
	};
	
	var changeMonth = function($month, $year)
	{
		var dayNum = date.getDate();
		var lastDayOfTheMonth = (new Date($year, $month, 0)).getDate();
		
		dayNum = (dayNum > lastDayOfTheMonth) ? lastDayOfTheMonth : dayNum;
		dayNum = (dayNum < 10) ? '0'+dayNum : dayNum;
			
		$month++;
		$month = ($month < 10) ? '0'+$month : $month;
		
		select($year + '-' + $month + '-' + dayNum);
		buildInterface();
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($value) {};
	
	component.getById('selectedDate').onClick = function()
	{
		if (enable)
		{
			if (open)
				$this.close();
			else
				$this.open();
		}
	};
	
	previousMonth.onClick = function()
	{
		if (enable)
		{
			month--;
			
			if (month < 0)
			{
				month = 11;
				year--;
			}
			
			changeMonth(month, year);
			changedByUser = true;
		}
	};
	
	nextMonth.onClick = function()
	{
		if (enable === true)
		{
			month++;
			
			if (month > 11)
			{
				month = 0;
				year++;
			}
			
			changeMonth(month, year);
			changedByUser = true;
		}
	};
	
	todayButton.onClick = function()
	{
		if (enable === true)
		{
			date = new Date();
			select(date.getSQLFormat());
			buildInterface();
			$this.close();
			changedByUser = true;
		}
	};
	
	panel.onClick = function() {};
	
	invisibleFreezeScreen.onClick = function() { $this.close(); };
	
	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getDate = function() { return date; };
	this.isEnable = function() { return enable; };
	this.isOpen = function() { return open; };
	this.isChangedByUser = function() { return changedByUser; };
	
	// SET
	
	this.setDate = function($date)
	{
		if (enable === true)
		{
			date = $date;
			buildInterface();
			changedByUser = false;
		}
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		if (enable)
			component.getById('selectedDate').removeAttribute('disabled');
		else
			component.getById('selectedDate').setAttribute('disabled', 'disabled');
	};
	
	this.setDisableFuture = function($disableFuture) { disableFuture = $disableFuture; };
	this.setShortMode = function($shortMode) { shortMode = $shortMode; };
	this.setChangedByUser = function($changedByUser) { changedByUser = $changedByUser; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}