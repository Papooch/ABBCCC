
var robots = [["Karel", 0], ["Ondra", 1]];

function main(){
   add_robots()
   $.get("http://192.168.1.9/abbccc/test.py", function(data, status){$("#middle_pane").text(data);});
   $.getJSON('http://192.168.1.9/abbccc/test.py', function(data) {
        
        //var text = `Date: ${data.robots[0].downtime}<br>`
                    
                    
        console.log(data);
        //alert(data.stringify());
    });
}

function fetch_robots(){
   
}

function add_robots(){
   for(robot of robots){
      add_robot(robot[0], robot[1]);
   }
}

function add_robot(name, id){
   console.log("adding robot" + name);
   el = create_robot(name, id);
   $("#robot_list").append(el);
}