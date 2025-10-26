let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchMoveX = 0;
    this.touchMoveY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    // 🟡 Handle touch move
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        // single-finger drag
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        if (this.holdingPaper && !this.rotating) {
          this.velX = this.touchMoveX - this.prevTouchX;
          this.velY = this.touchMoveY - this.prevTouchY;
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        if (this.holdingPaper) {
          paper.style.transform = `
            translateX(${this.currentPaperX}px)
            translateY(${this.currentPaperY}px)
            rotateZ(${this.rotation}deg)
          `;
        }

        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
      } 
      else if (e.touches.length === 2) {
        // two-finger rotation
        const [t1, t2] = e.touches;
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        const angle = Math.atan2(dy, dx);
        const degrees = (180 * angle) / Math.PI;
        this.rotation = degrees;
        this.rotating = true;

        if (this.holdingPaper) {
          paper.style.transform = `
            translateX(${this.currentPaperX}px)
            translateY(${this.currentPaperY}px)
            rotateZ(${this.rotation}deg)
          `;
        }
      }
    }, { passive: false });

    // 🟢 Touch start
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    }, { passive: false });

    // 🔴 Touch end
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
