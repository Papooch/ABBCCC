function create_uptime_chart(robot) {
   //console.log(robots);
   var ctx = document.getElementById('ro_id_' + robot.robot_id).getContext('2d');
   var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
         labels: ['Uptime', 'Downtime'],
         datasets: [{
            label: 'Uptime',
            backgroundColor: ['lightgreen', 'red'],
            borderColor: 'green',
            borderWidth: 0,
            data: [robot.uptime, robot.downtime]
         }]
      },

      options: {
         legend: {
            display: false
         }
      }
   });
}

var last_highlight = 0;
var downtime = [
               [2, 5],
               [8, 10],
               ];

function create_event_graph() {
   g = new Dygraph(

      // containing div
      document.getElementById("event_graph"),
  
      [[0, NaN, NaN, NaN]],
      {
         labels: ["x", "a", "b", "c"],
         colors: ["blue", "orange", "red"],
         drawPoints: true,
         strokeWidth: 0,
         pointSize: 4,
         highlightCircleSize: 6,
         showLabelsOnHighlight: false,
         animatedZooms: true,
         valueRange: [0, 15],
         zoom: true,
         range: false,
         selectMode: 'euclidean',
         axes: {
            y: {
               drawAxis: false
            },
            axis : {
               x : {
                 valueFormatter: Dygraph.dateString_,
                 valueParser: function(x) { return 1000*parseInt(x); },
                 ticker: Dygraph.dateTicker                
               }
             }
         },
         zoomCallback: function(minDate, maxDate, yRanges){
            g.updateOptions({colors:g.getColors()})
         },
         highlightCallback: function(event, x, points, row, seriesName){
            //console.log(row);
            unhighlight_event(last_highlight);
            highlight_event(row);
            last_highlight = row;
         },
         unhighlightCallback: function(){
            unhighlight_event(last_highlight);
         },
         clickCallback: function(e, x, points){
            select_event($("#event_id_" + points[0].idx).attr('data-event_id'));
            scroll_to_event(points[0].idx);
         },
         underlayCallback: function(canvas, area, g){
            canvas.fillStyle = "rgba(255, 0, 0, .2)";
            function highlight_period(x_start, x_end) {
              var canvas_left_x = g.toDomXCoord(x_start);
              var canvas_right_x = g.toDomXCoord(x_end);
              var canvas_width = canvas_right_x - canvas_left_x;
              canvas.fillRect(canvas_left_x, area.y, canvas_width, area.h);
            }

            for(dn of downtime){
               var min_data_x = new Date(dn[0]);
               var max_data_x = new Date(dn[1]);
               highlight_period(min_data_x, max_data_x);
            }

         },

      }
    );
}

function update_event_graph(data){
   g.updateOptions( { 'file': data } );
}

function prepare_event_graph_data(events){
   var data = [];
   for(var i = 0; i < events.length; i++){
      line = [new Date(events[i].time), NaN, NaN, NaN];
      index = 1;
      switch (events[i].severity.toLowerCase()) {
         case "warning":
            index = 2;
            break;
         case "error":
            index = 3;
            break;
         default:
            break;
      }
      line[index] = events[i].user_severity+2;
      data[i] = line;
   }
   return data;
}
