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

function create_event_graph() {
   g = new Dygraph(

      // containing div
      document.getElementById("event_graph"),
  
      // CSV or path to a CSV file.
      "Date,Temperature\n" +
      "2008-05-07,75\n" +
      "2008-05-08,70\n" +
      "2008-05-09,80\n"
  
    );
}

function update_event_graph(data){

}

function prepare_event_graph_data(events){

}