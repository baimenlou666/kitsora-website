(function () {
  var mascot = document.getElementById("site-mascot");
  if (!mascot) return;

  var targetRotate = 0;
  var currentRotate = 0;
  var targetEyeX = 0;
  var targetEyeY = 0;
  var currentEyeX = 0;
  var currentEyeY = 0;
  var rect = mascot.getBoundingClientRect();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function refreshRect() {
    rect = mascot.getBoundingClientRect();
  }

  function updateTarget(event) {
    var centerX = rect.left + rect.width * 0.42;
    var centerY = rect.top + rect.height * 0.26;
    var dx = event.clientX - centerX;
    var dy = event.clientY - centerY;
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;

    targetRotate = clamp(angle * 0.18, -13, 13);
    targetEyeX = clamp(dx / rect.width * 12, -4, 4);
    targetEyeY = clamp(dy / rect.height * 12, -3, 3);
  }

  function animate() {
    currentRotate += (targetRotate - currentRotate) * 0.12;
    currentEyeX += (targetEyeX - currentEyeX) * 0.16;
    currentEyeY += (targetEyeY - currentEyeY) * 0.16;

    mascot.style.setProperty("--head-rotate", currentRotate.toFixed(2) + "deg");
    mascot.style.setProperty("--eye-x", currentEyeX.toFixed(2) + "px");
    mascot.style.setProperty("--eye-y", currentEyeY.toFixed(2) + "px");

    requestAnimationFrame(animate);
  }

  refreshRect();
  window.addEventListener("mousemove", updateTarget, { passive: true });
  window.addEventListener("resize", refreshRect, { passive: true });
  window.addEventListener("scroll", refreshRect, { passive: true });

  requestAnimationFrame(animate);
})();
