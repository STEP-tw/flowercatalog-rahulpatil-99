let hideImg = function() {
  document.getElementById("#gif").style.visibility = "hidden";
}

let showImg = function () {
  document.getElementById("#gif").style.visibility = "visible";
}

let blinkImage = function(){
  hideImg();
  setTimeout(showImg,1000);
}
