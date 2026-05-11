const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const form = document.querySelector("#waitlist-form");
const status = document.querySelector("#form-status");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const email = String(data.get("email") || "").trim();

  if (!email) {
    return;
  }

  const signups = JSON.parse(localStorage.getItem("pavlovWaitlist") || "[]");
  if (!signups.includes(email)) {
    signups.push(email);
    localStorage.setItem("pavlovWaitlist", JSON.stringify(signups));
  }

  form.reset();
  status.textContent = "confirmed.";
});

document.querySelector("#share-link")?.addEventListener("click", () => {
  if (window.navigator?.share) {
    window.navigator.share({
      title: "Pavlov AI",
      text: "hey, saw this cool tech and legitimately thought it was made just for you: https://pavlov-ai.com",
      url: "https://pavlov-ai.com"
    }).catch(() => {});
  }
});
