function initButtonAnimation() {
  const button = document.querySelector("#gsap-button");
  const canvas = document.querySelector("#gsap-button > canvas");
  const ctx = canvas.getContext("2d");
  const buttonRect = button.getBoundingClientRect();
  canvas.width = buttonRect.width;
  canvas.height = buttonRect.height;
  
  let resizeDebounceTimer = null;  
  const circleState = {
    fillStyle: getComputedStyle(button).borderColor,
    lastPos: { x: 0, y: 0 },
    radius: (buttonRect.width / 2) + (buttonRect.width * 0.2),
  };

  window.addEventListener('resize', () => {
    if (resizeDebounceTimer) {
      window.clearTimeout(resizeDebounceTimer);
    }

    resizeDebounceTimer = window.setTimeout(() => {
      const buttonRect = button.getBoundingClientRect();
      canvas.width = buttonRect.width;
      canvas.height = buttonRect.height;

      circleState.radius = (buttonRect.width / 2) + (buttonRect.width * 0.2);
    }, 300);
  });

  button.addEventListener("mousemove", (event) => {
    // Clear the entire canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get mouse position relative to the button
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    drawCircle(ctx, x, y, circleState.radius, circleState.fillStyle);

    circleState.lastPos.x = x;
    circleState.lastPos.y = y;
  });

  button.addEventListener("mouseleave", (event) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const buttonRect = button.getBoundingClientRect();

    // Set destination
    const mousePos = {
      x: event.clientX - buttonRect.left,
      y: event.clientY - buttonRect.top,
    }; 
    
    const { destPos, shrink } = calculateDestPosition(
      mousePos,
      buttonRect,
      window.innerWidth,
      window.innerHeight
    );

    const newRadius = shrink ? (circleState.radius / 2) : circleState.radius;
    let progress = 0;
    const animationSpeed = 0.05;

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Interpolate between lastPos and destPos
      const currentX = circleState.lastPos.x + (destPos.x - circleState.lastPos.x) * progress;
      const currentY = circleState.lastPos.y + (destPos.y - circleState.lastPos.y) * progress;
      circleState.lastPos.x = currentX;
      circleState.lastPos.y = currentY;

      drawCircle(ctx, currentX, currentY, newRadius, circleState.fillStyle);

      progress += animationSpeed;

      // Continue animation until we reach the destination
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circleState.lastPos.x = 0;
        circleState.lastPos.y = 0;
      }
    }

    tick();
  });
}

function drawCircle(ctx, x, y, radius, fillStyle) {
  ctx.fillStyle = fillStyle;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function calculateDestPosition(
  mousePos,
  buttonRect,
  width,
  height
) {
  const destPos = { ...mousePos };
  let shrink = false;

  if (mousePos.x <= 0) {
    destPos.x -= width;
  } else if (mousePos.x >= buttonRect.width) {
    destPos.x += width;
  } else {
    if (mousePos.y <= 0) {
      destPos.y -= height;
    } else if (mousePos.y >= buttonRect.height) {
      destPos.y += height;
    }

    shrink = true;
  }

  return { destPos, shrink };
}

export default initButtonAnimation;