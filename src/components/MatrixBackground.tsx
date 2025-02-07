
import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (including some Japanese katakana for effect)
    const chars = '01アベマンパ'.split('');
    const fontSize = 20; // Increased from 16 to 20
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      // Lighter background fade for better visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Brighter green for better visibility
      ctx.fillStyle = 'rgba(0, 255, 70, 0.65)'; // Increased opacity from 0.35 to 0.65
      ctx.font = `${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Animation loop with performance optimization
    let animationId: number;
    let lastTime = 0;
    const interval = 1000 / 24; // Keep at 24 FPS for smooth animation

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);
      
      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;

      draw();
      lastTime = currentTime - (deltaTime % interval);
    };
    animate(0);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ 
        contain: 'strict',
        pointerEvents: 'none',
        opacity: 1 // Increased from 0.8 to 1
      }}
    />
  );
};

export default MatrixBackground;

