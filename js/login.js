//convertTemplate("#login-tmpl", {group: "title"}, "wrapper");

//    <button type="button" onclick="signout()">Sign out</button>
//    <button type="button" onclick="facebookLogin()">Facebook</button>
//    <button type="button" onclick="googleLogin()">Google</button>

// Initialize Firebase

//var fbaseStorage = firebase.storage();
//if (!fbaseStorage) {
//      var config = {
//        apiKey: "AIzaSyBEumZUTCL3Jc9pt7_CjiSVTxmz9aMqSvo",
//        authDomain: "synthesistalyaron.firebaseapp.com",
//        databaseURL: "https://synthesistalyaron.firebaseio.com",
//        storageBucket: "gs://synthesistalyaron.appspot.com"
//      };
//    firebase.initializeApp(config);
//}
firebase.auth().onAuthStateChanged(function(user) {
  console.log("status login change")
  if (user) {
    // User is signed in.
     console.log("User is signed in.");
     $("#loginScreen").hide(300);
    goHome();
    //get name
    //get picture

  } else {
    // No user is signed in.
    console.log("No user is signed in.");
    //show login screen
    convertTemplate("#login-tmpl", {}, "#loginScreen");
    $("#loginScreen").show(300);
  }
});

//var DB = firebase.database().ref();
//var storage = firebase.storage();
//Google login
function googleLogin() {
  var provider2 = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider2);
}
//Facebook login
function facebookLogin(){
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    var userName = result.credential.user;
    console.log("token: "+ token);
    // ...
  }
  // The sig  ned-in user info.
  console.dir(result.user);
  console.dir(result);
  //        window.location = "";
}).catch(function(error) {
  // Handle Errors here.
  console.log(error);
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  console.log("FB error: " + email+ ", "+errorMessage + ", "+errorCode + ", "+ credential);
  // ...
});

$("#signup-form").submit(function(e){
  e.preventDefault();
  console.log(this.email.value+ ", "+ this.pass.value);
  firebase.auth().createUserWithEmailAndPassword(this.email.value, this.pass.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: "+ errorMessage+" : "+ errorCode);
  });
});

$("#login-form").submit(function(e){
  e.preventDefault();
  firebase.auth().signInWithEmailAndPassword(this.email.value, this.pass.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: "+ errorMessage+" : "+ errorCode);
  });
});

function signout(){
  firebase.auth().signOut().then(function() {
    console.log("sign out");
  }, function(error) {
    console.log("Error: "+ error)
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Loged in, User: "+ user.email +", "+ user.uid);
  } else {
    console.log("Signed out");
  }
});
