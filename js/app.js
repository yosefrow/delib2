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

  var currentUrl = getUrl();
  routTo(currentUrl);
  //  showPublicGroups();
  $(window).on('popstate', function() {
    console.log('Back button was pressed.');
    var currentUrl = getUrl();
    routTo(currentUrl);

  });

  //
  convertTemplate("#LogoHeaderTitle-tmpl",{},"#headerTitle");
  convertTemplate("#headerBreadCrumbs-tmpl",{},"#headerBreadCrumbs");
  convertTemplate("#headerMenu-tmpl",{},"#headerMenu");
  goHome();
  //    convertTemplate("#login-tmpl",{},"body");

  listenToAuth();
})

var userUuid = "-KIUArWGBpO4c2t5m-5c";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBEumZUTCL3Jc9pt7_CjiSVTxmz9aMqSvo",
  authDomain: "synthesistalyaron.firebaseapp.com",
  databaseURL: "https://synthesistalyaron.firebaseio.com",
  storageBucket: "gs://synthesistalyaron.appspot.com",
};
firebase.initializeApp(config);

var DB = firebase.database().ref();
var storage = firebase.storage();


