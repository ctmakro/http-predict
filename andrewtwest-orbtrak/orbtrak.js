/****************************************************************************
*             OrbTrak: A satellite orbit visualization library              *
*                      Copyright Andrew T. West, 2008                       *
*                         Last update: 07-Jun-2008                          *
*****************************************************************************
*                                                                           *
* This program is free software; you can redistribute it and/or modify it   *
* under the terms of the GNU General Public License as published by the     *
* Free Software Foundation; either version 2 of the License or any later    *
* version.                                                                  *
*                                                                           *
* This program is distributed in the hope that it will be useful,           *
* but WITHOUT ANY WARRANTY; without even the implied warranty of            *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU         *
* General Public License for more details.                                  *
*                                                                           *
*****************************************************************************/

var Orb = 
	{
		satelliteMarkers: new Array(),

		startTracking: function(map, homeLat, homeLng)
		{
			Orb.map = map;
			Orb.crossBrowserSetStyle(map, "background-image: url(orbimages/world.jpg); overflow: hidden;", true);

			var frag = document.createDocumentFragment();
			var div = document.createElement("div");
			div.id = "home";
			Orb.crossBrowserSetStyle(div, "position:relative; width: 24px; height: 24px; background-image: url(orbimages/home.gif);", false);
			frag.appendChild(div);
			Orb.map.appendChild(frag);
			Orb.home = document.getElementById("home");

			PLib.InitializeData();
			Orb.setHomeCoordinates(homeLat, homeLng);
			Orb.createSatelliteMarkers();
			Orb.updateSatellites();
		},

		setHomeCoordinates: function(homeLat, homeLng)
		{
			PLib.configureGroundStation(homeLat, homeLng);

			Orb.home.style.top = ((-homeLat + 90) * 1.5 - 12.0) + "px";
			Orb.home.style.left =  ((parseInt(homeLng) + 180) * 1.5 - 12.0) + "px";
		},

		crossBrowserSetStyle: function(element, css, append)
		{
			var obj, attributeName;
			var useStyleObject = element.style.setAttribute;

			obj = useStyleObject ? element.style : element;
			attributeName = useStyleObject ? "cssText" : "style";

			if (append)
				css += obj.getAttribute(attributeName);

			obj.setAttribute(attributeName, css);
		},

		createOneMarker: function(txt)
		{
			var frag = document.createDocumentFragment();
			var markerCount = Orb.satelliteMarkers.length;

			var div = document.createElement("div");
			div.id = "satelliteMarker" + markerCount;
			Orb.crossBrowserSetStyle(div, "position:absolute; width: 24px; height: 24px; background-image: url(orbimages/saticon.gif);", false);
			var innerDiv = document.createElement("div");
			Orb.crossBrowserSetStyle(innerDiv, "position:absolute; left: 7px; top: 5px;");
			var txt = document.createTextNode(txt);

			innerDiv.appendChild(txt);
			div.appendChild(innerDiv);
			frag.appendChild(div);
			Orb.map.appendChild(frag);

			Orb.satelliteMarkers[markerCount] = document.getElementById(div.id)
		},

		createSatelliteMarkers: function()
		{
			for (var i = 1; i <= PLib.sat.length; i++)
				Orb.createOneMarker(i);
		},

		updateSatellites: function()
		{
			var satInfo;

			for (var i = 0; i < PLib.sat.length; i++)
			{
				satInfo = PLib.QuickFind(PLib.sat[i].name);

				Orb.satelliteMarkers[i].style.top = ((-satInfo.latitude + 90) * 1.5 - 12.0) + "px";
				Orb.satelliteMarkers[i].style.left =  ((satInfo.longitude + 180) * 1.5 - 12.0) + "px";
			}

			setTimeout("Orb.updateSatellites()", 5000);
		},

		createCell: function(tr, className, txt)
		{
			var td = document.createElement("td");
			td.className = className;
			txt = document.createTextNode(txt);
			td.appendChild(txt);
			tr.appendChild(td);
		},

		createHeaderColumn: function(tr, txt)
		{
			var th = document.createElement("th");
			th.className = "orb-header";
			txt = document.createTextNode(txt);
			th.appendChild(txt);
			tr.appendChild(th);
		},

		generateTable: function(divTable)
		{
			var tr, visibilityText, detailClassName;
			var frag = document.createDocumentFragment();
			var satInfoColl = PLib.getTodaysPasses();
			
			while (divTable.childNodes.length > 0)
			{
			    divTable.removeChild(divTable.firstChild);
			}
			
			var tbl = document.createElement("table");
			Orb.crossBrowserSetStyle(tbl, "border-collapse: collapse; margin-left: auto; margin-right: auto;", false);
			
			var thead = document.createElement("thead");
			tr = document.createElement("tr");
			
			Orb.createHeaderColumn(tr, '# on Map');
			Orb.createHeaderColumn(tr, 'Name');
			Orb.createHeaderColumn(tr, 'Pass #');
			Orb.createHeaderColumn(tr, 'Date');
			Orb.createHeaderColumn(tr, 'Local Time');
			Orb.createHeaderColumn(tr, 'Peak Elev.');
			Orb.createHeaderColumn(tr, 'Azimuth');
			Orb.createHeaderColumn(tr, 'Range (km)');
			Orb.createHeaderColumn(tr, 'Visibility');
			
			thead.appendChild(tr);
			tbl.appendChild(thead);
			
			var tbody = document.createElement("tbody");
			
			for (var i = 0; i < satInfoColl.length; i++)
			{
				tr = document.createElement("tr");
				
				detailClassName = satInfoColl[i].visibility == "+" ? "orb-detailVisible" : "orb-detail";
				
				Orb.createCell(tr, detailClassName, satInfoColl[i].number);
				Orb.createCell(tr, detailClassName, satInfoColl[i].name);
				Orb.createCell(tr, detailClassName, satInfoColl[i].passNo);
				Orb.createCell(tr, detailClassName, PLib.formatDateOnly(satInfoColl[i].dateTimeStart));
				Orb.createCell(tr, detailClassName, PLib.formatTimeOnly(satInfoColl[i].dateTimeStart) + " - " + PLib.formatTimeOnly(satInfoColl[i].dateTimeEnd));
				Orb.createCell(tr, detailClassName, satInfoColl[i].peakElevation + "\u00B0");
				Orb.createCell(tr, detailClassName, satInfoColl[i].riseAzimuth + ", " + satInfoColl[i].peakAzimuth + ", " + satInfoColl[i].decayAzimuth);
				Orb.createCell(tr, detailClassName, satInfoColl[i].riseRange + ", " + satInfoColl[i].peakRange + ", " + satInfoColl[i].decayRange);
				
				switch(satInfoColl[i].visibility)
				{
					case "+":
						visibilityText = 'Visible';
						break;    
					case "*":
						visibilityText = 'Not Visible';
						break;
					default:
						visibilityText = 'Eclipsed';
				}
				
				Orb.createCell(tr, detailClassName, visibilityText);
				
				tbody.appendChild(tr);
			}
			
			tbl.appendChild(tbody);
			frag.appendChild(tbl);
			divTable.appendChild(frag);
		}
	}
