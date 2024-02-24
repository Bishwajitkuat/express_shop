const errorMessageP = document.getElementById("errorMessage");
const successMessageP = document.getElementById("successMessage");
const errorStatauMessageCloseBtn = document.getElementById(
  "errorStatauMessageClose"
);
const successStatauMessageCloseBtn = document.getElementById(
  "successStatauMessageClose"
);

if (errorMessageP) {
  setTimeout(() => {
    errorMessageP.classList.add("hidden");
  }, 5000);
}

if (successMessageP) {
  setTimeout(() => {
    successMessageP.classList.add("hidden");
  }, 5000);
}

if (errorStatauMessageCloseBtn) {
  errorStatauMessageCloseBtn.addEventListener("click", () => {
    errorMessageP.classList.add("hidden");
  });
}

if (successStatauMessageCloseBtn) {
  successStatauMessageCloseBtn.addEventListener("click", () => {
    successMessageP.classList.add("hidden");
  });
}
