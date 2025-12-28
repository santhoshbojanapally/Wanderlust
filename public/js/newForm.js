const btn = document.getElementById("msBtn");
if (btn) {
  const menu = document.getElementById("msMenu");

  btn.addEventListener("click", () => menu.classList.toggle("show"));

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".multi-select")) menu.classList.remove("show");
  });
}
