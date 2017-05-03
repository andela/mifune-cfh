/*eslint-disable */
// window.bootstrap = function() {
//     angular.bootstrap(document, ['mean']);
// };

// window.init = function() {
//     window.bootstrap();
// };
if (window.location.hash == "#_=_") window.location.hash = "#!";
// $(document).ready(function() {
//     //Fixing facebook bug with redirect
    

//     //Then init the app
//     window.init();
// });
$("body").on("click","#start_game_action", () => {
  swal({
  title: "Are you sure?",
  text: "You want to start the game now?",
  type: "success",
  showCancelButton: true,
  confirmButtonColor: "#DD6B55",
  confirmButtonText: "Yes Am Ready",
  cancelButtonText: "No, Not Now",
  closeOnConfirm: false,
  closeOnCancel: false
},
function(isConfirm){
  if (isConfirm) {
    swal("Weldone", "Click okay to start", "success");
  } else {
    swal("Cancelled", "You are off! Shitty you!!!", "error");
  }
});
});
