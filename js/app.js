$(function(){
  
  //start ripple effect
  $(".footer-btn").ePulse({
    bgColor: "#ded9d9",
    size: 'medium'
    
  });
  
   
//  showPublicGroups();
//
//  getUserGroups(g_user);

    //convertTemplate("#login-tmpl",{},"#container"  );
    //convertTemplate("#header-tmpl",{group: "My Group"},"header"  );
    convertTemplate("#headerTitle-tmpl",{group: "My Group"},"headerTitle");
    convertTemplate("#headerBreadCrumbs-tmpl",{},"headerBreadCrumbs");
    convertTemplate("#headerMenu-tmpl",{},"headerMenu");
  
})

var g_user = "talyaron"

//connect to DB
var DB = new Firebase("https://synthesistalyaron.firebaseio.com/");

function convertTemplate (template, context, destination){
  var groupsPublicTmpl = $(template).html();
  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  var groupPublicHTML = groupPublicHandl(context);
  $(destination).html(groupPublicHTML);
}


