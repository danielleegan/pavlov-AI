(function () {
  var marquee = document.querySelector(".testimonial-marquee");
  var touchStartX = 0;
  var touchStartY = 0;
  var didDrag = false;
  var suppressNextClick = false;

  if (!marquee) {
    return;
  }

  function isTapPauseDevice() {
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  }

  function isPaused() {
    return marquee.classList.contains("is-paused");
  }

  function pause() {
    marquee.classList.add("is-paused");
  }

  function resume() {
    marquee.classList.remove("is-paused");
  }

  marquee.addEventListener("touchstart", function (event) {
    if (!isTapPauseDevice()) {
      return;
    }

    if (!event.target.closest(".testimonial-card")) {
      return;
    }

    didDrag = false;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  marquee.addEventListener("touchmove", function (event) {
    if (!isTapPauseDevice()) {
      return;
    }

    if (!event.target.closest(".testimonial-card")) {
      return;
    }

    var deltaX = Math.abs(event.touches[0].clientX - touchStartX);
    var deltaY = Math.abs(event.touches[0].clientY - touchStartY);

    if (deltaX > 8 && deltaX > deltaY) {
      didDrag = true;
      suppressNextClick = true;
      pause();
    }
  }, { passive: true });

  document.addEventListener("click", function (event) {
    if (!isTapPauseDevice()) {
      return;
    }

    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

    if (isPaused()) {
      resume();
      return;
    }

    if (event.target.closest(".testimonial-card")) {
      pause();
    }
  });
}());
