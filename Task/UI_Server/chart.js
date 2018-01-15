// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
	
	$.get("./CSVs/black_box_results.csv", function(csvString){

		var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
		
		var data = new google.visualization.arrayToDataTable(arrayData);
    
		var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
		chart.draw(data);
	});
}