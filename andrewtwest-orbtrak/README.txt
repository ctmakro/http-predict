Thank you for using OrbTrak and PredictLib!

OrbTrak is a Web Widget (JavaScript library) that you can add to your own pages to chart upcoming passes of man-made satellites, as well as view their positions in real time.  Once the widget is loaded, no further trips to the server are necessary since all calculations are performed on the client.

PredictLib is a JavaScript library based on the open-source C program PREDICT, by John A. Magliacane.  It was ported from the DOS version, and has been modified to output tracking and prediction data suitable for OrbTrak. If you wish to modify or distribute PredictLib yourself, you may do so under the terms of the GNU GPL (http://www.gnu.org/licenses/gpl.html).

Installation and Usage
----------------------

1) Copy the following files to a location on your Web server:

orbtrak.css
orbtrak.js
predictlib.js
tle.js

2) Create a subdirectory named "orbimages" and copy the following images there:

home.gif
saticon.gif
world.jpg

See license.txt for image licensing terms.

The following example demonstrates the use of the library:

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <title>OrbTrak Example</title>
        <link rel="stylesheet" type="text/css" href="orbtrak.css" />
        <script src="predictlib.js" type="text/javascript"></script>
        <script src="tle.js" type="text/javascript"></script>
        <script src="orbtrak.js" type="text/javascript"></script>
        <script type="text/javascript">
                function load()
                {
                        // Pass in latitude and longitude of the ground station (your location).
                        Orb.startTracking(document.getElementById('map'), 43.154, -77.615);
                        Orb.generateTable(document.getElementById('passes'));
                }
        </script>
</head>
<body onload="load()">
        <div id="map" style="width: 540px; height: 270px;"></div>
        <div id="passes"></div>
</body>
</html>

*** IMPORTANT ***

In order for predictions to remain accurate, PredictLib's tle.js file must be updated with TLE (Two-Line Element) data from NORAD (http://celestrak.com/NORAD/elements/) on a periodic basis.  PredictLib does NOT update this info automatically.  Also, you must use the proper formatting.  See the existing tle.js file for the correct format.

Copyright © 2010 Andrew T. West.
