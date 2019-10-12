
//var robots = [["Karel", 0], ["Ondra", 1]];
var event_data = [];
var robot = "";

Date.prototype.toDateInputValue = (function() {
   var local = new Date(this);
   local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
   return local.toJSON().slice(0,10);
});

function main(){
   d = new Date();
   today = moment()
   console.log(today.format('YYYY-MM-DDTHH:mm'));
   $('#date_end').val(today.format('YYYY-MM-DDTHH:mm'));
   $('#date_start').val(today.subtract(7, "days").format('YYYY-MM-DDTHH:mm'));
   create_event_graph();
   //add_robots()
   //$.get("http://192.168.1.9/abbccc/test.py", function(data, status){$("#middle_pane").text(data);});
   //load_data();
}

function load_data(){
   $("#robot_list").empty();
   $("#event_list").empty();
   fetch_robots();
}

function load_week(){
   d = new Date();
   today = moment()
   console.log(today.format('YYYY-MM-DDTHH:mm'));
   $('#date_end').val(today.format('YYYY-MM-DDTHH:mm'));
   $('#date_start').val(today.subtract(7, "days").format('YYYY-MM-DDTHH:mm'));
}

function load_month(){
   d = new Date();
   today = moment()
   console.log(today.format('YYYY-MM-DDTHH:mm'));
   $('#date_end').val(today.format('YYYY-MM-DDTHH:mm'));
   $('#date_start').val(today.subtract(30, "days").format('YYYY-MM-DDTHH:mm'));
}

function fetch_robots(){
   $("#robot_list").append("<img src='icons/loading.gif' style='padding-left:3em'/>");
   //console.log('http://192.168.1.9/abbccc/get_data_from_database.py?type=robots&start='+$("#date_start").val().replace("T", "%20")+'&end='+$("#date_end").val().replace("T", "%20"));
   $.getJSON('http://192.168.1.9/abbccc/get_data_from_database.py?type=robots&start='+$("#date_start").val().replace("T", "%20")+'&end='+$("#date_end").val().replace("T", "%20"),
   function(data){
      console.log(data);
      $("#robot_list").empty();
      if(data=="No data available."){
         $("#robot_list").text("No data from the selected time period");
      }else{
         add_robots(data);
      }
      //add_events(data.elements[0])
   })
   .fail(function(){
      $("#robot_list").empty();
      console.log("failed to fetch robots");
      $("#robot_list").text("failed to fetch robots");
   });
}

function add_robots(data){
   for(robot of data.elements){
      add_robot(robot);
   }
}

function add_robot(r){
   //console.log("adding robot " + r.name);
   //console.log(r);
   el = create_robot(r.name, r.robot_id, r.uptime, r.downtime);
   $("#robot_list").append(el);
   create_uptime_chart(r);
}

function fetch_events(robot){
   $("#event_list").empty();
   $("#event_list").append("<img src='icons/loading.gif' style='padding-left:500px'/>");
   $.getJSON('http://192.168.1.9/abbccc/get_data_from_database.py?type=events&robot='+robot+'&start='+$("#date_start").val().replace("T", "%20")+'&end='+$("#date_end").val().replace("T", "%20"),
   function(data){
      $("#event_list").empty();
      event_data = data;
      downtime = event_data.elements[0].stop_start_time;
      $("#bu-info").text("Info ("+event_data.elements[0].infos+")");
      $("#bu-warning").text("Warning ("+event_data.elements[0].warnings+")");
      $("#bu-error").text("Error ("+event_data.elements[0].errors+")");
      add_events(data.elements[0]);
   })
   .fail(function(){
      $("#event_list").empty();
      console.log("failed to fetch robots");
      $("#event_list").text("failed to fetch events");
   });
}

function fetch_event_detail(id){
   $("#event_details").empty();
   $("#event_details").append("<img src='icons/loading.gif' style='padding-left:4em'/>");
   $.getJSON('http://192.168.1.9/abbccc/get_data_from_database.py?type=event_details&robot='+robot+'&event='+id+'&start='+$("#date_start").val().replace("T", "%20")+'&end='+$("#date_end").val().replace("T", "%20"),
   function(data){
      $("#event_details").empty();      
      $("#event_details").append(create_event_detail(data.elements[0]));
   })
   .fail(function(){
      $("#event_details").empty();
      $("#event_details").text("failed to fetch events details");
   });
}

function add_events(data){
   var id = 0;
   for(event of data.events){
      add_event(id, event);
      id += 1;
   }
   update_event_graph(prepare_event_graph_data(data.events));
}

function add_event(id, e){
   //console.log("adding event" + e.time);
   el = create_event(id, e.event_id, e.time, e.domain, e.severity, e.user_severity, e.number, e.header, e.reason);
   $("#event_list").prepend(el);
}

function select_robot(name){
   robot = name;
   $("#robot_name").text("Selected robot " + name);
   fetch_events(name);
}

function highlight_event(id){
   g.setSelection(id);
   $("#event_id_"+id).addClass("ev_highlight");
   //console.log(id);
}

function unhighlight_event(id){
   g.clearSelection();
   $("#event_id_"+id).removeClass("ev_highlight");
}


var last_selected = 0;

function select_event(id){
   $("[data-event_id="+last_selected+"]").removeClass("ev_selected");
   $("[data-event_id="+id+"]").addClass("ev_selected");
   last_selected = id;
   $("#event_details").text("Details for event id " + id);
   fetch_event_detail(id);
}

function scroll_to_event(id){
      scrollbar = $("#event_list").scrollTop();
      pos = $("#event_id_"+id).position().top;
      height = $("#event_id_"+id).height()

      $("#event_list").animate({scrollTop: scrollbar + pos - height}, 800);
}

function goto_prev_next(id){
   select_event(id);
   scroll_to_event($("[data-event_id="+id+"]").attr('id').replace("event_id_", ""));
}