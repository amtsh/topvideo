function showSweetAlert() {
  swal({
    title: "Top Videos",
    text: "Sign in to get personalised video feed that matches your taste.\
         <br><br><b>Say hi to us on Facebook Messenger <br>and get a <b>6-digit one time password.</b>",
    showCancelButton: true,
    closeOnConfirm: false,
    confirmButtonText: "Messenger",
    animation: "slide-from-top",
    html: true
  }, function() {
    swal({
      title: "Verification Code",
      text: "Enter the code you recieved on Facebook Messenger",
      type:"input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "6 digit code."
    }, function(code) {
      if (code === false) return false;
      if (code === "") {
        swal.showInputError("No code recieved.");
        return false
      }
      swal("Success!", "You have been successfully logged in.", "success");
    })
  })
  var messengerBtn = document.getElementsByClassName("confirm")[0];
  messengerBtn.addEventListener('click', redirectToMessenger);
}

  var redirectToMessenger = function() {
    window.open('https://m.me/topvideoBot', '_blank');
    var messengerBtn = document.getElementsByClassName("confirm")[0];
    messengerBtn.removeEventListener('click', redirectToMessenger)
  }


window.fbAsyncInit = function() {
  FB.init({
    appId      : '1023729924329447',
    xfbml      : true,
    version    : 'v2.6'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
