function filter(el){
   //console.log(el);
   el.toggleClass("pressed");
   sev = el[0].title;
   $(".ev_severity_" + sev).toggleClass("filtered");
   
   colors = ["blue", "orange", "red"];
   filt = $(".pressed");
   for(f of filt){
      colors[$(f).attr("data-f_id")] = "lightgray"
   }
   g.updateOptions({colors:colors});
}

function filterd(el){
   el.toggleClass("pressed")
   dom = el[0].title
   $(".ev_domain_" + dom).parent().toggleClass("filteredd");
}