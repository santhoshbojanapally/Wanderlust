const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

const today = new Date().toISOString().split("T")[0];
checkin.min = today;
checkout.min = today;

checkin.addEventListener("change", () => {
  // console.log(checkin.value);
  if (!checkin.value) return;
  checkout.min = checkin.value;

  if (checkout.value && checkout.value < checkin.value) {
    checkout.value = "";
  }
});
checkout.addEventListener("change", () => {});

const checkoutPicker = flatpickr("#checkout", {
  dateFormat: "m/d/Y",
  minDate: "today",
});

flatpickr("#checkin", {
  dateFormat: "m/d/Y",
  minDate: "today",
  onChange: function (selectedDates) {
    if (selectedDates.length) {
      checkoutPicker.set("minDate", selectedDates[0]);
    }
  },
});

let adultsMinus = document.getElementById("adultsMinus");
let adultsPlus = document.getElementById("adultsPlus");
let adultsCount = document.getElementById("adultsCount");
let childrenMinus = document.getElementById("childrenMinus");
let childrenPlus = document.getElementById("childrenPlus");
let childrenCount = document.getElementById("childrenCount");
let guestDropdownBtn = document.getElementById("guestsBtn");
let guestCloseBtn = document.getElementById("closeGuests");
let clearBtn = document.getElementById("clearGuests");
let guestsCount = document.getElementById("guestsCount");
let adultsInput = document.getElementById("adultsInput");
let childrenInput = document.getElementById("childrenInput");
let guestsTotalInput = document.getElementById("guestsTotalInput");

adultsMinus.addEventListener("click", (e) => {
  e.preventDefault();
  let num = adultsCount.textContent - "0";
  if (num == 0) return;
  num -= 1;
  adultsCount.textContent = num;
  let total = guestsCount.innerText - "0";
  total -= 1;
  total = Math.max(0, total);
  total = Math.min(10, total);
  guestsCount.innerText = total;
  adultsInput.value = num;
  guestsTotalInput.value = total;
});
adultsPlus.addEventListener("click", (e) => {
  e.preventDefault();
  let num = adultsCount.textContent - "0";
  if (num == 5) return;
  num += 1;
  num = Math.min(num, 5);
  adultsCount.textContent = num;
  let total = guestsCount.innerText - "0";
  total += 1;
  total = Math.max(0, total);
  total = Math.min(10, total);
  guestsCount.innerText = total;
  adultsInput.value = num;
  guestsTotalInput.value = total;
});
childrenMinus.addEventListener("click", (e) => {
  e.preventDefault();
  let num = childrenCount.textContent - "0";
  if (num == 0) return;
  num -= 1;
  num = Math.max(num, 0);
  childrenCount.textContent = num;
  let total = guestsCount.innerText - "0";
  total -= 1;
  total = Math.max(0, total);
  total = Math.min(10, total);
  guestsCount.innerText = total;
  childrenInput.value = num;
  guestsTotalInput.value = total;
});
childrenPlus.addEventListener("click", (e) => {
  e.preventDefault();
  let num = childrenCount.textContent - "0";
  if (num == 5) return;
  num += 1;
  childrenCount.textContent = num;
  let total = guestsCount.innerText - "0";
  total += 1;
  total = Math.max(0, total);
  total = Math.min(10, total);
  childrenInput.value = num;
  guestsCount.innerText = total;
  guestsTotalInput.value = total;
});
guestCloseBtn.addEventListener("click", () => {
  const instance = bootstrap.Dropdown.getOrCreateInstance(guestDropdownBtn);
  instance.hide();
});
clearBtn.addEventListener("click", () => {
  adultsCount.innerText = "0";
  childrenCount.innerText = "0";
  guestsTotalInput.value = 0;
  guestsCount.innerText = "0";
});
