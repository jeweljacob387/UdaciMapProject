$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350);
}


$( document ).ready(function() {
  setTimeout(function(){
    $("#loading").hide();
  },500)
});
