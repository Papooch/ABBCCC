function create_robot(name, id, up = 1, down = 1){
   var el_name = $("<div></div>").addClass("ro_name").text(name);
   var el_uptime = $("<div></div>").addClass("ro_uptime").text("Uptime: "+Math.round(up/(up+down)*1000)/10+"%");
   var el_canvas = $("<canvas></canvas>").addClass("ro_canvas").attr('id', 'ro_id_' + id);
   var el_canvas_container = $("<div></div>").addClass("ro_canvas_container").append(el_canvas);
   return  $("<div></div>")
      .addClass("robot")
      .append(el_name)
      .append(el_uptime)
      .append(el_canvas_container)
      .click(function(){select_robot(name)});
}

function create_event(id, event_id, date, domain, severity, user_severity, number, header, reason){
   el_date = $("<div></div>").addClass("ev_date").text(date);
   switch (domain) {
      case "Motion":
         dom = "ev_domain_motion";
         break;
      case "Operational":
         dom = "ev_domain_operational";
         break;
      case "Connected Services":
         dom = "ev_domain_connected";
         break;
      case "Program":
         dom = "ev_domain_program";
         break;
      case "System":
         dom = "ev_domain_system";
         break;
      default:
         dom = "ev_domain_unknown";
         break;
   }
   el_domain = $("<div></div>").addClass("ev_domain").addClass(dom).text(domain);
   el_severity = $("<div></div>").addClass("ev_severity").text(severity);
   el_u_severity = $("<div></div>").addClass("ev_u_severity").text(user_severity);
   el_number = $("<div></div>").addClass("ev_number").text(number);
   el_header = $("<div></div>").addClass("ev_header").text(header);
   el_reason = $("<div></div>").addClass("ev_reason").text(reason);
   return $("<div></div>").addClass("event").addClass("ev_severity_" + severity)
      .append(el_severity)
      .append(el_date)
      .append(el_domain)
      .append(el_u_severity)
      .append(el_number)
      .append(el_header)
      .append(el_reason)
      .attr('id', 'event_id_' + id)
      .attr('data-event_id', event_id)
      .mouseover(function(e){highlight_event(id)})
      .mouseout(function(e){unhighlight_event(id)})
      .click(function(){select_event(event_id)});
}

function create_event_detail(d){
   el_sev_color = $("<div></div>").addClass("e_severity").addClass("e_severity_" + d.severity);

   el_date = $("<div class='e_property e_date'><div>Date</div><div>"+d.time+"</div></div>");
   el_domain = $("<div class='e_property e_domain'><div>Domain</div><div>"+d.domain+"</div></div>");
   el_number = $("<div class='e_property e_number'><div>Number</div><div>"+d.number+"</div></div>");
   el_header = $("<div class='e_property e_header'><div>Header</div><div>"+d.header+"</div></div>");
   el_reason = $("<div class='e_property e_reason'><div>Reason</div><div>"+d.reason+"</div></div>");
   el_cause = $("<div class='e_property e_cause'><div>Cause</div><div>"+d.cause+"</div></div>");
   el_action = $("<div class='e_property e_action'><div>Action</div><div>"+d.action+"</div></div>");
   el_properties = $("<div></div>").addClass("e_properties")
      .append(el_date)
      .append(el_domain)
      .append(el_number);

   el_long_properties = $("<div></div>").addClass("e_long_properties")
   .append(el_header)
   .append(el_reason)
   .append(el_cause)
   .append(el_action);

   el_occurences = $("<div class='e_occurences'><div>Number of occurences</div><div>"+d.occurences+"</div></div>");
   
   el_event_stats = $("<div></div>").addClass("e_stats")
      .append(el_occurences)

   if(d.next_occurence[0]){
      el_next = $("<div class='e_next' data-next='"+d.next_occurence[0]+"'><div>Next occurence</div><div>"+d.next_occurence[1]+"</div></div>").click(function(){goto_prev_next(d.next_occurence[0])});;
      el_event_stats.append(el_next);
   }
   if(d.last_occurence[0]){
      el_prev = $("<div class='e_prev' data-prev='"+d.last_occurence[0]+"'><div>Previous occurence</div><div>"+d.last_occurence[1]+"</div></div>").click(function(){goto_prev_next(d.last_occurence[0])});
      el_event_stats.append(el_prev);
   }

   return $("<div></div>").attr('id', 'event_detail')
      .append(el_sev_color)
      .append(el_properties)
      .append(el_long_properties)
      .append(el_event_stats);
      
}