function create_robot(name, id, up = 1, down = 1){
   var el_name = $("<span></span>").addClass("ro_name").text(name);
   var el_uptime = $("<span></span>").addClass("ro_uptime").text(" up: "+up+" dn: "+down+" ("+up/(up+down)*100+"%)");
   var el_canvas = $("<canvas></canvas>").addClass("ro_canvas").attr('id', 'ro_id_' + id);
   var el_canvas_container = $("<div></div>").addClass("ro_canvas_container").append(el_canvas);
   return  $("<div></div>")
      .addClass("robot")
      .append(el_name)
      .append(el_uptime)
      .append(el_canvas_container)
      .click(function(){select_robot(name)});
}

function create_event(date, domain, severity, user_severity, number, header, reason){
   el_date = $("<div></div>").addClass("ev_date").text(date);
   el_domain = $("<div></div>").addClass("ev_date").text("domain: " + domain);
   el_severity = $("<div></div>").addClass("ev_severity").addClass("ev_severity_" + severity);
   el_u_severity = $("<div></div>").addClass("ev_u_severity").text("user severity: " + user_severity);
   el_number = $("<div></div>").addClass("ev_number").text("number: " + number);
   el_header = $("<div></div>").addClass("ev_header").text("header: " + header);
   el_reason = $("<div></div>").addClass("ev_reason").text("reason: " + reason);
   return $("<div></div>").addClass("event")
      .append(el_severity)
      .append(el_date)
      .append(el_domain)
      .append(el_u_severity)
      .append(el_number)
      .append(el_header)
      .append(el_reason)
      .click(function(){select_event(Math.random())});
}