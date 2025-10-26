let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    // 🧠 Ensure mouse position updates correctly
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      // Compute velocity only when dragging
      if (this.holdingPaper && !this.rotating) {
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      // ✅ Rotation logic only when right button is held
      if (this.holdingPaper && this.rotating) {
        const dirX = this.mouseX - this.mouseTouchX;
        const dirY = this.mouseY - this.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1; // prevent NaN
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = (180 * angle) / Math.PI;
        this.rotation = (360 + Math.round(degrees)) % 360;
      }

      if (this.holdingPaper) {
        paper.style.transform = `
          translateX(${this.currentPaperX}px)
          translateY(${this.currentPaperY}px)
          rotateZ(${this.rotation}deg)
        `;
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    });

    // 🖱️ Handle left/right click
    paper.addEventListener('mousedown', (e) => {
      e.preventDefault(); // prevent image dragging or text selection
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.mouseTouchX = e.clientX;
      this.mouseTouchY = e.clientY;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    // 🧾 Release paper on mouse up
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // 🚫 Disable default right-click menu
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
