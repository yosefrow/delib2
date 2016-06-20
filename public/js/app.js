
$(function(){


  if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('../delib-service-worker.js').then(function() {
      return navigator.serviceWorker.ready;
    }).then(function(serviceWorkerRegistration) {
      reg = serviceWorkerRegistration;
      fcmNotificationsBtn.disabled = false;
      console.log('Service Worker is ready :^)', reg, fcmNotificationsBtn);
    }).catch(function(error) {
      console.log('Service Worker Error :^(', error);
    });
  }

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
  //convertTemplate("#login-tmpl",{},"body");

  listenToAuth();
})

var userUuid;
var activeEntity = new Object();
var inactiveColor = "#5f1f1f";
var activeColor = "white";


// Initialize Firebase
var config = {
  apiKey: "AIzaSyBEumZUTCL3Jc9pt7_CjiSVTxmz9aMqSvo",
  authDomain: "synthesistalyaron.firebaseapp.com",
  databaseURL: "https://synthesistalyaron.firebaseio.com",
  storageBucket: "gs://synthesistalyaron.appspot.com"
};
firebase.initializeApp(config);

var DB = firebase.database().ref();
var storage = firebase.storage();

function setNewEntity (newEntity, newUid){
  var oldEntity = activeEntity.entity;
  var oldUid = activeEntity.uid;

  if(oldUid != undefined){
    DB.child(oldEntity+"/"+oldUid).off();
  }
  activeEntity.entity = newEntity;
  activeEntity.uid = newUid;
}
