/* ============================================================
   result.js  —  Exam Results BD
   Handles the homepage result checker (id="resultForm").
   On submit: validates roll + registration, then shows a
   popup directing the student to the official portal, with
   copy buttons for the roll and registration numbers.
   Reset button clears the form. No captcha.
   Aligns with existing HTML ids:
   #exam #year #board #roll #registration
   #searchBtn #resetBtn #errorMessage
   ============================================================ */
(function () {
  "use strict";

  var form = document.getElementById("resultForm");
  if (!form) return;

  var OFFICIAL_URL = "https://eboardresults.com/v2/home";

  var BOARD_NAMES = {
    dhaka: "Dhaka", rajshahi: "Rajshahi", comilla: "Cumilla",
    chittagong: "Chattogram", barisal: "Barishal", sylhet: "Sylhet",
    jessore: "Jashore", dinajpur: "Dinajpur", mymensingh: "Mymensingh",
    madrasah: "Madrasah", technical: "Technical"
  };
  var EXAM_NAMES = { ssc: "SSC / Dakhil", hsc: "HSC / Alim", jsc: "JSC / JDC" };

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
        '<p class="result-modal-note">Results are published only by the official education boards. Copy your roll and registration number, then enter them on the portal to see the full marksheet.</p>' +
      '</div>';
    document.body.appendChild(overlay);

    function close() { overlay.classList.remove("show"); }
    overlay.querySelector(".result-modal-close").addEventListener("click", close);
    overlay.querySelector(".result-modal-cancel").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    overlay.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".rmd-copy") : null;
      if (!btn) return;
      copyText(btn.getAttribute("data-copy"), btn);
    });
  }

  function copyText(text, btn) {
    if (!text) return;
    var done = function () { flashCopied(btn); };
    var fail = function () { legacyCopy(text, btn); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fail);
    } else {
      legacyCopy(text, btn);
    }
  }

  function legacyCopy(text, btn) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      flashCopied(btn);
    } catch (err) { /* ignore */ }
  }

  function flashCopied(btn) {
    if (!btn) return;
    var original = btn.getAttribute("data-label") || btn.textContent;
    btn.classList.add("copied");
    btn.textContent = "Copied";
    setTimeout(function () {
      btn.classList.remove("copied");
      btn.textContent = original;
    }, 1400);
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
      "Copy your details below and enter them there.";

    var details = document.getElementById("resultModalDetails");
    details.innerHTML =
      '<div class="rmd-row"><span>Exam</span><b>' + examTxt + '</b></div>' +
      '<div class="rmd-row"><span>Year</span><b>' + year + '</b></div>' +
      '<div class="rmd-row"><span>Board</span><b>' + boardTxt + '</b></div>' +
      '<div class="rmd-row rmd-copyrow"><span>Roll</span>' +
        '<span class="rmd-val"><b>' + roll + '</b>' +
        '<button type="button" class="rmd-copy" data-copy="' + roll + '" data-label="Copy" aria-label="Copy roll number">Copy</button></span></div>' +
      (reg
        ? '<div class="rmd-row rmd-copyrow"><span>Registration</span>' +
          '<span class="rmd-val"><b>' + reg + '</b>' +
          '<button type="button" class="rmd-copy" data-copy="' + reg + '" data-label="Copy" aria-label="Copy registration number">Copy</button></span></div>'
        : "");

    overlay.classList.add("show");
    var go = document.getElementById("resultModalGo");
    if (go) go.focus();
  }

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

    if (!roll) {
      if (rollEl) { rollEl.classList.add("input-error"); rollEl.focus(); }
      return;
    } else if (rollEl) {
      rollEl.classList.remove("input-error");
    }

    showModal(exam, year, board, roll, reg);
  });

  var rollElInput = document.getElementById("roll");
  if (rollElInput) rollElInput.addEventListener("input", function () { rollElInput.classList.remove("input-error"); });

  // ---- reset button ----
  var resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (form.reset) form.reset();

      var exam = document.getElementById("exam");
      var year = document.getElementById("year");
      var board = document.getElementById("board");
      if (exam) exam.selectedIndex = 0;
      if (year) year.selectedIndex = 0;
      if (board) board.selectedIndex = 0;

      var roll = document.getElementById("roll");
      var reg = document.getElementById("registration");
      if (roll) { roll.value = ""; roll.classList.remove("input-error"); }
      if (reg) { reg.value = ""; reg.classList.remove("input-error"); }

      var note = document.getElementById("errorMessage");
      if (note) { note.textContent = ""; note.classList.remove("show"); }

      var overlay = document.getElementById("resultModal");
      if (overlay) overlay.classList.remove("show");

      if (roll) roll.focus();
    });
  }
})();
