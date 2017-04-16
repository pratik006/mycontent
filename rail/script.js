$(document).ready(function() {
	var stations;
	var REGION = "hyd-mmts";
	var CONTEXT = "http://apps-pratiks.rhcloud.com/rest/rail/";
	console.log(document.querySelector('.mdl-layout'));
	console.log(document.querySelector('.mdl-layout').CssClasses_.IS_DRAWER_OPEN);
	if(document.querySelector('.mdl-layout').MaterialLayout) {
		document.querySelector('.mdl-layout').MaterialLayout.drawerToggleHandler_();
	}

    var from = $(".typeahead");
    $.get(CONTEXT+"stations?region=hyd-mmts", function(data){
      stations = data;
	  $(".typeahead").typeahead({ source:stations });
	},'json');

	$(".typeahead").change(function() {
	  var current = $(".typeahead").typeahead("getActive");
	  if (current) {
	    // Some item from your model is active!
	    if (current.name == $(".typeahead").val()) {
	      // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
	    } else {
	      // This means it is only a partial match, you can either add a new item
	      // or take the active if you don't want new items
	    }
	  } else {
	    // Nothing is active so it is a new value (or maybe empty value)
	  }
	});

	$("#btnSearch").click(function() {
		var from, to;
		stations.forEach(function(station) {
			if ($("#from").val() == station.name) {
				from = station.code;
			} else if ($("#to").val() == station.name) {
				to = station.code;
			}
		});

		if (from && to) {
			var url;
			if ($("#nextHourCount").is(':checked')) {
				url = CONTEXT+"findTrains?"+$.param({"region": REGION, "from": from, "to": to, "nextHourCount": 4});	
			} else {
				url = CONTEXT+"findTrains?"+$.param({"region": REGION, "from": from, "to": to});	
			}
			
			$("#timetable > table > tbody > tr").remove();
			$.get(url, function(trains) {

				document.querySelector('.mdl-layout').MaterialLayout.drawerToggleHandler_();
				$("#timetable").show();
				if (trains.length == 0) {
					var text = "No Trains";
					if ($("#nextHourCount").is(':checked')) {
						text = text + " in next 4 hours";
					}
					$("#timetable > table > tbody").append("<tr><td colspan='4' style='text-align: center'>"+text+"</td></tr>");
					return;
				}


				trains.forEach(function(train) {
					$("#timetable > table > tbody").append(
						"<tr class='accordion'>"
						+"<td class='no-padding icon-width'>"
							+"<button class='no-padding mdl-button mdl-js-button mdl-micron-button mdl-button--colored mdl-js-ripple-effect'>"
							+"<i class='material-icons'>add</i></button>"
						+"</td>"
						+"<td class='mdl-data-table__cell--non-numeric train-number'>"+train.id+"</td>"
						+"<td class='mdl-data-table__cell--non-numeric train-name'>"+train.name+"</td>"
						+"<td class='mdl-layout--large-screen-only mdl-cell--hide-phone'>"+train.routes[0].arrival+"</td>"
						+"<td class='mdl-data-table__cell--non-numeric'>"+train.routes[0].departure+"</td>"
						+"<td class='mdl-layout--large-screen-only mdl-cell--hide-phone'>"+train.trainType+"</td>"
						+"</tr>"
						+"<tr class='accordion-panel'>"
						+"<td class='mdl-cell--5 no-padding' colspan='5'>"+buildRouteGrid(train.routes)+"</td>"
						+"</tr>");
				});
				
				$("tr.accordion").click(function() {
					console.log('clicked');
					/* Toggle between adding and removing the "active" class,
			        to highlight the button that controls the panel */
			        this.classList.toggle("active");


			        /* Toggle between hiding and showing the active panel */
			        var panel = this.nextElementSibling;
			        if (panel.style.display === "table-row") {
			            panel.style.display = "none";
			            $(this).find("i").html("add");
			        } else {
			            panel.style.display = "table-row";
			            $(this).find("i").html("remove");
			        }


			        
				});
				
			});
		}

	});

	function buildRouteGrid(routes) {
		var html = "<div class='text-center'><span class='mdl-layout-title minor-padding'>Route Information</span></div>" 
		+"<div id='route'>"
		  +"<table class='mdl-data-table mdl-js-data-table mdl-data-table mdl-shadow--2dp full-width'>"
		    +"<thead>"
		      +"<tr>"
		        +"<th class='mdl-data-table__cell--non-numeric mdl-cell--1-col'>Station</th>"
		        +"<th class='mdl-data-table__cell'>Arrival</th>"
		        +"<th class='mdl-data-table__cell'>Departure</th>"
		        +"<th class='mdl-data-table__cell mdl-cell--hide-phone'>Distance</th>"
		      +"</tr>"
		    +"</thead>";
		routes.forEach(function(route) {
			html += "<tr>"
		        +"<td class='mdl-data-table__cell--non-numeric mdl-cell--1-col'>"+route.stationName +"</td>"
		        +"<td class='mdl-data-table__cell'>"+route.arrival+"</td>"
		        +"<td class='mdl-data-table__cell'>"+route.departure+"</td>"
		        +"<td class='mdl-data-table__cell mdl-cell--hide-phone'>"+route.dist+"</td>"
		      +"</tr>";
		});


		html+="<tbody>"
		    +"</tbody>"
		  +"</table>"
		+"</div>";
		return html;
	}
});