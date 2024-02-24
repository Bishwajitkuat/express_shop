const mobileMenuBtn = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileNavManue");

function mobileMenuBtnClickHandeler() {
  mobileMenu.classList.toggle("hidden");
}

mobileMenuBtn.addEventListener("click", mobileMenuBtnClickHandeler);
