(function () {
  var backdrop = document.querySelector(".cookie-settings-backdrop");

  if (!backdrop) return;

  var close = backdrop.querySelector(".cookie-settings-close");
  var header = backdrop.querySelector(".cookie-settings-header");
  var toggles = backdrop.querySelectorAll(".cookie-toggle");

  function updateToggle(button) {
    var pill = button.querySelector(".cookie-pill");
    var onText = button.getAttribute("data-on-text");
    var offText = button.getAttribute("data-off-text");
    var isOn = button.getAttribute("aria-pressed") === "true";

    if (pill) pill.textContent = isOn ? onText : offText;
  }

  toggles.forEach(function (button) {
    updateToggle(button);

    button.addEventListener("click", function () {
      var next = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(next));
      updateToggle(button);
    });
  });

  function expand() {
    backdrop.classList.remove("is-collapsed");
  }

  function collapse() {
    backdrop.classList.add("is-collapsed");
  }

  if (header) {
    header.addEventListener("click", function () {
      if (backdrop.classList.contains("is-collapsed")) expand();
    });
  }

  if (close) {
    close.addEventListener("click", function (event) {
      event.stopPropagation();
      collapse();
    });
  }

  backdrop.addEventListener("click", function (event) {
    if (event.target === backdrop && !backdrop.classList.contains("is-collapsed")) {
      collapse();
    }
  });
})();
