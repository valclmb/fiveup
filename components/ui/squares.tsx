'use client'
import React, { useEffect, useRef } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  fillColor?: CanvasStrokeStyle;
  backgroundColor?: CanvasStrokeStyle;
  randomFillProbability?: number; // Probabilité qu'un carré soit coloré (0-1)
}

const Squares: React.FC<SquaresProps> = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  fillColor = '#222',
  backgroundColor = '#060010',
  randomFillProbability = 0.1 // 10% de chance qu'un carré soit coloré par défaut
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const filledSquaresRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
      // Régénérer les carrés colorés lors du resize
      filledSquaresRef.current.clear();
      generateFilledSquares();
    };

    const generateFilledSquares = () => {
      // Utiliser une fonction de hash déterministe basée sur la position absolue
      // pour que les mêmes carrés soient toujours colorés peu importe le déplacement
      filledSquaresRef.current.clear();
    };

    // Fonction pour déterminer si un carré à une position absolue doit être coloré
    const shouldFillSquare = (absX: number, absY: number): boolean => {
      // Utiliser une fonction de hash simple pour avoir un résultat déterministe
      const seed = (absX * 73856093) ^ (absY * 19349663);
      const hash = Math.abs(Math.sin(seed)) * 10000;
      return (hash % 10000) < (randomFillProbability * 10000);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    generateFilledSquares();

    const drawGrid = () => {
      if (!ctx) return;

      // Remplir le background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          const gridX = Math.floor((x - startX) / squareSize);
          const gridY = Math.floor((y - startY) / squareSize);
          const squareKey = `${gridX},${gridY}`;

          // Colorer le carré s'il est dans le set
          if (filledSquaresRef.current.has(squareKey)) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [direction, speed, borderColor, fillColor, backgroundColor, randomFillProbability, squareSize]);

  return <canvas ref={canvasRef} className="w-full h-full border-none block"></canvas>;
};

export default Squares;
