/* ============================================================
   result.js  —  Exam Results BD
   Handles the homepage result checker (id="resultForm").
   On submit: validates roll + registration, then shows a
   popup directing the student to the official portal with
   their details pre-filled where possible.
   No captcha. Aligns with existing HTML ids:
   #exam #year #board #roll #registration #searchBtn #resetBtn
   ============================================================ */
(function () {
  "use strict";

  var form = document.getElementById("resultForm");
  if (!form) return;

  // Official portal the student is sent to
  var OFFICIAL_URL = "https://eboardresults.com/v2/home";

  // Friendly board names for the popup message
  var BOARD_NAMES = {
    dhaka: "Dhaka", rajshahi: "Rajshahi", comilla: "Cumilla",
    chittagong: "Chattogram", barisal: "Barishal", sylhet: "Sylhet",
    jessore: "Jashore", dinajpur: "Dinajpur", mymensingh: "Mymensingh",
    madrasah: "Madrasah", technical: "Technical"
  };
  var EXAM_NAMES = { ssc: "SSC / Dakhil", hsc: "HSC / Alim", jsc: "JSC / JDC" };

  // ---- build the popup once ----
  function buildModal() {
    if (document.getElementById("resultModal")) return;

    var overlay = document.createElement("div");
    overlay.id = "resultModal";
    overlay.className = "result-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "resultModalTitle");
    overlay.innerHTML =
      '<div class="result-modal-box">' +
        '<button class="result-modal-close" aria-label="Close">&times;</button>' +
        '<h3 id="resultModalTitle">Check on the official portal</h3>' +
        '<p id="resultModalMsg"></p>' +
        '<div class="result-modal-details" id="resultModalDetails"></div>' +
        '<div class="result-modal-actions">' +
          '<a class="result-modal-go" id="resultModalGo" href="' + OFFICIAL_URL + '" target="_blank" rel="noopener">Open official result portal</a>' +
          '<button class="result-modal-cancel" type="button">Back</button>' +
        '</div>' +
        '<p class="result-modal-note">Results are published only by the official education boards. Enter your roll and registration number there to see the full marksheet.</p>' +
      '</div>';
    document.body.appendChild(overlay);

    function close() { overlay.classList.remove("show"); }
    overlay.querySelector(".result-modal-close").addEventListener("click", close);
    overlay.querySelector(".result-modal-cancel").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  function showModal(exam, year, board, roll, reg) {
    buildModal();
    var overlay = document.getElementById("resultModal");
    var examTxt = EXAM_NAMES[exam] || "SSC";
    var boardTxt = BOARD_NAMES[board] || board;

    document.getElementById("resultModalMsg").innerHTML =
      "You are checking the <strong>" + examTxt + " " + year +
      "</strong> result for <strong>" + boardTxt + " Board</strong>. " +
      "For security, official results open on the education board portal. " +
      "Tap the button below and enter your details there.";

    var details = document.getElementById("resultModalDetails");
    details.innerHTML =
      '<div class="rmd-row"><span>Exam</span><b>' + examTxt + '</b></div>' +
      '<div class="rmd-row"><span>Year</span><b>' + year + '</b></div>' +
      '<div class="rmd-row"><span>Board</span><b>' + boardTxt + '</b></div>' +
      '<div class="rmd-row"><span>Roll</span><b>' + roll + '</b></div>' +
      (reg ? '<div class="rmd-row"><span>Registration</span><b>' + reg + '</b></div>' : "");

    overlay.classList.add("show");
    // focus the primary action for accessibility
    var go = document.getElementById("resultModalGo");
    if (go) go.focus();
  }

  // ---- validation helpers ----
  function digitsOnly(s) { return (s || "").replace(/\D/g, ""); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var exam = (document.getElementById("exam") || {}).value || "ssc";
    var year = (document.getElementById("year") || {}).value || "2026";
    var board = (document.getElementById("board") || {}).value || "";
    var rollEl = document.getElementById("roll");
    var regEl = document.getElementById("registration");

    var roll = digitsOnly(rollEl && rollEl.value);
    var reg = digitsOnly(regEl && regEl.value);

    // Roll is required
    if (!roll) {
      if (rollEl) { rollEl.classList.add("input-error"); rollEl.focus(); }
      return;
    } else if (rollEl) {
      rollEl.classList.remove("input-error");
    }

    // Registration is recommended (needed for full marksheet) but not blocked
    showModal(exam, year, board, roll, reg);
  });

  // clear error styling as the user types
  var rollEl = document.getElementById("roll");
  if (rollEl) rollEl.addEventListener("input", function () { rollEl.classList.remove("input-error"); });
})();
