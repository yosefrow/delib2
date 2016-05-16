$(function(){
  
  //start ripple effect
  $(".footer-btn").ePulse({
    bgColor: "#ded9d9",
    size: 'medium'
    
  });
  
   
  showPublicGroups(); 
  
  getUserGroups(g_user);
  
})

var g_user = "talyaron"

//connect to DB
var DB = new Firebase("https://synthesistalyaron.firebaseio.com/");



 