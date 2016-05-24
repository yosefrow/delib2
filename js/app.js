$(function(){
  
  //start ripple effect
  $(".footer-btn").ePulse({
    bgColor: "#ded9d9",
    size: 'medium'
    
  });
  $(".headerMenuBtn").ePulse({
    bgColor: "#ded9d9",
    size: 'medium'
    
  });
    
    convertTemplate("#headerTitle-tmpl",{group: "להציל את הים"},"#headerTitle");
    convertTemplate("#headerBreadCrumbs-tmpl",{},"headerBreadCrumbs");
    convertTemplate("#headerMenu-tmpl",{},"headerMenu");
  
  
})

var userUuid = "-KIUArWGBpO4c2t5m-5c";

//connect to DB
const DB = new Firebase("https://synthesistalyaron.firebaseio.com/");

function convertTemplate (template, context, destination){
  var groupsPublicTmpl = $(template).html();
  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  var groupPublicHTML = groupPublicHandl(context);
  $(destination).html(groupPublicHTML);
}


