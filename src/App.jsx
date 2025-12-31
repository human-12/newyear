import { useState, useEffect, useRef } from 'react';

// Firework and Particle classes for the animation
class Firework {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight;
    this.targetY = Math.random() * canvasHeight * 0.5;
    this.speed = 3;
    this.particles = [];
    this.exploded = false;
    this.hue = Math.random() * 360;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }
  
  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.explode();
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  explode() {
    this.exploded = true;
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.x, this.y, this.hue));
    }
  }
  
  draw(ctx) {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
      ctx.fill();
    }
    
    this.particles.forEach(particle => particle.draw(ctx));
  }
  
  isDone() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 5 + 2;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.gravity = 0.1;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.hue = hue + Math.random() * 30 - 15;
  }
  
  update() {
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.fill();
    ctx.restore();
  }
}

// HomePage Component
const HomePage = ({ onNavigate }) => {
  return (
    <div style={{
      background: 'linear-gradient(to right, #1e3c72, #2a5298)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      paddingTop: '200px',
      margin: 0,
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontSize: '48px',
        marginBottom: '20px'
      }}>
        🎁 Please Click
      </h1>
      <p style={{
        fontSize: '24px',
        marginBottom: '40px'
      }}>
        There is a surprise for you!
      </p>
      <button
        onClick={onNavigate}
        style={{
          background: 'gold',
          padding: '15px 30px',
          border: 'none',
          color: 'black',
          fontSize: '22px',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'background 0.3s',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => e.target.style.background = 'orange'}
        onMouseLeave={(e) => e.target.style.background = 'gold'}
      >
        Click Here
      </button>
    </div>
  );
};

// SurprisePage Component
const SurprisePage = () => {
  const canvasRef = useRef(null);
  const fireworksRef = useRef([]);
  const lastFireworkTimeRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (currentTime) => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Launch fireworks at intervals
      if (currentTime - lastFireworkTimeRef.current > 500) {
        fireworksRef.current.push(new Firework(canvas.width, canvas.height));
        lastFireworkTimeRef.current = currentTime;
      }
      
      // Update and draw fireworks
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        fireworksRef.current[i].update();
        fireworksRef.current[i].draw(ctx);
        
        if (fireworksRef.current[i].isDone()) {
          fireworksRef.current.splice(i, 1);
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <canvas 
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />
      
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 2,
        color: 'white',
        textShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
      }}>
        <h1 style={{
          fontSize: '64px',
          margin: 0,
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          🎊 Happy New Year 2026! 🎊
        </h1>
      </div>
      
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        maxWidth: '300px',
        zIndex: 2,
        color: 'white',
        animation: 'slideIn 1s ease-out'
      }}>
        <h2 style={{
          marginTop: 0,
          fontSize: '24px',
          color: '#ffd700',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
        }}>
          ✨ Best Wishes ✨
        </h2>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '10px 0'
        }}>
          May this new year bring you endless joy, success, and prosperity!
        </p>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '10px 0'
        }}>
          Wishing you a year filled with love, laughter, and amazing adventures.
        </p>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '10px 0'
        }}>
          Cheers to new beginnings and wonderful memories! 🥂
        </p>
      </div>

      <style>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ffd700, 0 0 50px #ffd700;
          }
          to {
            text-shadow: 0 0 30px #fff, 0 0 40px #ffd700, 0 0 50px #ffd700, 0 0 60px #ffd700;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {currentPage === 'home' ? (
        <HomePage onNavigate={() => setCurrentPage('surprise')} />
      ) : (
        <SurprisePage />
      )}
    </div>
  );
}

export default App;
