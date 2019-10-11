function create_uptime_charts(robots) {
   //console.log(robots);
   for (robot of robots) {
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

}