function create_robot(name, id, up = 1, down = 1){
   el_name = $("<span></span>").addClass("robot_name").text(name);
   el_uptime = $("<span></span>").addClass("robot_uptime").text("up: "+up+" dn: "+down+" ("+up/(up+down)+")");
   return $("<div></div>").addClass("robot").append(el_name).append(el_uptime);
   name = container.append
   //return $("<p></p>").text(name).addClass("robot").attr('id', "robot_" + id);
}

function create_event(date, domain, severity, number, reason, cause = "", action = ""){
   el_severity = $("<div></div>").addClass("severity").addClass("severity_" + severity);
   el_date = $("<div></div>").addClass;
}