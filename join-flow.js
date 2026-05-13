(function () {
  var form = document.getElementById("form01");
  var trigger = form ? form.querySelector('.actions button[type="submit"]') : null;
  var backdrop = document.querySelector(".join-flow-backdrop");

  if (!form || !trigger || !backdrop) return;

  var dialog = backdrop.querySelector(".join-flow-dialog");
  var title = backdrop.querySelector(".join-flow-title");
  var subtitle = backdrop.querySelector(".join-flow-subtitle");
  var input = backdrop.querySelector(".join-flow-input");
  var error = backdrop.querySelector(".join-flow-error");
  var submit = backdrop.querySelector(".join-flow-submit");
  var stepIndex = 0;
  var waitlistUrl = "/waitlist";
  var firstStepIndex = 3;

  var steps = [
    {
      title: "How badly do you want it?",
      subtitle: "Type “please please please”",
      placeholder: "please please please",
      button: "Submit",
      answer: "please please please"
    },
    {
      title: "I don’t think you want it bad enough.",
      subtitle: "Type “please I need it”",
      placeholder: "please I need it",
      button: "Conform",
      answer: "please I need it"
    },
    {
      title: "Will you be good and do as pavlov AI™ says?",
      subtitle: "Type \"yes please I promise I will be so good\"",
      placeholder: "yes please I promise I will be so good",
      button: "Obey",
      answer: "yes please I promise I will be so good"
    },
    {
      title: "Alright then. What's your email?",
      subtitle: "",
      placeholder: "Email",
      button: "Submit",
      type: "email"
    }
  ];

  function renderStep() {
    var step = steps[stepIndex];

    if (!step) {
      closeFlow();
      return;
    }

    dialog.classList.remove("is-received");
    title.textContent = step.title;
    title.classList.remove("is-received");
    subtitle.textContent = step.subtitle;
    subtitle.hidden = !step.subtitle;
    input.type = step.type || "text";
    input.placeholder = step.placeholder;
    input.value = "";
    input.hidden = false;
    error.textContent = "";
    submit.textContent = step.button;
    submit.hidden = false;
  }

  function openFlow() {
    stepIndex = firstStepIndex;
    renderStep();
    backdrop.hidden = false;
    window.setTimeout(function () {
      input.focus();
    }, 0);
  }

  function closeFlow() {
    backdrop.hidden = true;
  }

  function showReceived() {
    dialog.classList.add("is-received");
    title.textContent = "Received.";
    title.classList.add("is-received");
    subtitle.textContent = "";
    subtitle.hidden = true;
    input.value = "";
    input.hidden = true;
    error.textContent = "";
    submit.hidden = true;
  }

  function normalize(value) {
    return value.replace(/\s+/g, " ").trim().toLowerCase();
  }

  function submitEmail() {
    var email = input.value.trim();

    submit.disabled = true;
    error.textContent = "Submitting...";

    fetch(waitlistUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    }).then(function (response) {
      if (!response.ok) throw new Error("Submission failed.");
      showReceived();
    }).catch(function () {
      error.textContent = "Wrong. Try again.";
    }).finally(function () {
      submit.disabled = false;
    });
  }

  function submitStep() {
    var step = steps[stepIndex];

    if (!step) return;

    if (step.type === "email") {
      if (input.validity.valid && input.value.trim() !== "") {
        submitEmail();
        return;
      }

      error.textContent = "Wrong. Try again.";
      return;
    }

    if (normalize(input.value) === normalize(step.answer)) {
      stepIndex += 1;
      renderStep();
      return;
    }

    error.textContent = "Wrong. Try again.";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openFlow();
  }, true);

  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openFlow();
  }, true);

  submit.addEventListener("click", function () {
    submitStep();
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitStep();
    }
  });

  input.addEventListener("input", function () {
    error.textContent = "";
  });

  backdrop.addEventListener("click", function (event) {
    if (event.target === backdrop) closeFlow();
  });

  if (dialog) {
    dialog.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
})();
