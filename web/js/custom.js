
var robots = [["Karel", 0], ["Ondra", 1]];

function main(){
   //add_robots()
   //$.get("http://192.168.1.9/abbccc/test.py", function(data, status){$("#middle_pane").text(data);});
   fetch_robots();
   $("#event_list").append("what");
}

function fetch_robots(){
   $.getJSON('http://192.168.1.9/abbccc/test.py',
   function(data){
      add_robots(data);
      add_events(data.robots[0])
   })
   .fail(function(){
      console.log("failed to fetch robots");
      //$("#middle_pane").text("failed to fetch robots");
   });
}

function add_robots(data){
   for(robot of data.robots){
      add_robot(robot);
   }
   create_uptime_charts(data.robots);
}


function add_robot(r){
   console.log("adding robot " + r.name);
   console.log(r);
   el = create_robot(r.name, r.robot_id, r.uptime, r.downtime);
   $("#robot_list").append(el);
}

function add_events(data){
   for(event of data.events){
      add_event(event);
   }
}

function add_event(e){
   console.log("adding event" + e.time);
   el = create_event(e.time, "noDomain", e.severity, e.number, "noHeader", e.reason);
   $("#event_list").append(el);
}

