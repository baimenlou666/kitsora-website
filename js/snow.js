(function () {
  var layer = document.getElementById("interactive-snow");
  if (!layer) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  var flakes = [];
  var flakeCount = 46;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var mouse = {
    x: -9999,
    y: -9999,
    active: false
  };
  var lastTime = performance.now();

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeFlake(index) {
    var el = document.createElement("i");
    var size = randomBetween(2.2, 7.2);
    var flake = {
      el: el,
      x: randomBetween(0, width),
      y: randomBetween(-height, height),
      vx: randomBetween(-0.08, 0.08),
      vy: randomBetween(0.28, 0.78),
      repelX: 0,
      repelY: 0,
      size: size,
      opacity: randomBetween(0.42, 0.92),
      swayPhase: randomBetween(0, Math.PI * 2),
      swaySpeed: randomBetween(0.0006, 0.0014),
      swayAmount: randomBetween(8, 24),
      repelRadius: randomBetween(70, 125),
      repelPower: randomBetween(0.45, 0.95)
    };

    el.className = "snowflake";
    el.style.setProperty("--snow-size", size + "px");
    el.style.setProperty("--snow-opacity", flake.opacity);
    el.style.zIndex = index % 3;
    layer.appendChild(el);
    flakes.push(flake);
  }

  function resetFlake(flake, fromTop) {
    flake.x = randomBetween(-40, width + 40);
    flake.y = fromTop ? randomBetween(-80, -8) : randomBetween(0, height);
    flake.vx = randomBetween(-0.08, 0.08);
    flake.vy = randomBetween(0.28, 0.78);
    flake.repelX *= 0.25;
    flake.repelY *= 0.25;
  }

  function updateMouse(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  }

  function hideMouse() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function animate(now) {
    var delta = Math.min(34, now - lastTime);
    var step = delta / 16.67;
    lastTime = now;

    for (var i = 0; i < flakes.length; i += 1) {
      var flake = flakes[i];
      var sway = Math.sin(now * flake.swaySpeed + flake.swayPhase) * flake.swayAmount;

      flake.x += (flake.vx + Math.sin(now * flake.swaySpeed + flake.swayPhase) * 0.08) * step;
      flake.y += flake.vy * step;

      if (mouse.active) {
        var screenX = flake.x + sway + flake.repelX;
        var screenY = flake.y + flake.repelY;
        var dx = screenX - mouse.x;
        var dy = screenY - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < flake.repelRadius && dist > 0.01) {
          var force = (1 - dist / flake.repelRadius) * flake.repelPower;
          flake.repelX += (dx / dist) * force * 11 * step;
          flake.repelY += (dy / dist) * force * 9 * step;
          flake.y += force * 1.8 * step;
        }
      }

      flake.repelX *= Math.pow(0.9, step);
      flake.repelY *= Math.pow(0.9, step);

      if (flake.y > height + 60 || flake.x < -90 || flake.x > width + 90) {
        resetFlake(flake, true);
      }

      flake.el.style.transform =
        "translate3d(" + (flake.x + sway + flake.repelX) + "px, " + (flake.y + flake.repelY) + "px, 0)";
    }

    requestAnimationFrame(animate);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  for (var i = 0; i < flakeCount; i += 1) {
    makeFlake(i);
  }

  window.addEventListener("mousemove", updateMouse, { passive: true });
  window.addEventListener("mouseleave", hideMouse);
  window.addEventListener("blur", hideMouse);
  window.addEventListener("resize", resize, { passive: true });

  requestAnimationFrame(animate);
})();
