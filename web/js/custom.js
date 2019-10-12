
var robots = [["Karel", 0], ["Ondra", 1]];

function main(){
   //add_robots()
   //$.get("http://192.168.1.9/abbccc/test.py", function(data, status){$("#middle_pane").text(data);});
   fetch_robots();
}

function fetch_robots(){
   $.getJSON('http://192.168.1.9/abbccc/test.py',
   function(data){
      add_robots(data);
      add_events(data.robots[0])
   })
   .fail(function(){
      console.log("failed to fetch robots");
      $("#event_list").text("failed to fetch robots");
   });
}

function add_robots(data){
   for(robot of data.robots){
      add_robot(robot);
   }
}


function add_robot(r){
   console.log("adding robot " + r.name);
   console.log(r);
   el = create_robot(r.name, r.robot_id, r.uptime, r.downtime);
   $("#robot_list").append(el);
   create_uptime_chart(r);
}

function add_events(data){
   for(event of data.events){
      add_event(event);
   }
   create_event_graph();
   prepare_event_graph_data(data.events);
}

function add_event(e){
   console.log("adding event" + e.time);
   el = create_event(e.time, e.domain, e.severity, e.user_severity, e.number, e.header, e.reason);
   $("#event_list").append(el);
}

function select_robot(name){
   $("#robot_name").text("Selected robot " + name);
}

function select_event(id){
   $("#event_details").text("Details for event id " + id);
}