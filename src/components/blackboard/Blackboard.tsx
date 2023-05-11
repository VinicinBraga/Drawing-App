import React, { useRef, useEffect, useState } from 'react';
import './Blackboard.css'


interface Point {
  x: number;
  y: number;
}

const Blackboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [lines, setLines] = useState<Point[][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d');
    }
  }, []);

  const drawLine = (line: Point[]) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(line[0].x, line[0].y);

    for (let i = 1; i < line.length; i++) {
      ctx.lineTo(line[i].x, line[i].y);
    }

    ctx.strokeStyle = 'white'; // Altera a cor da linha para branca
    ctx.stroke();
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const { clientX, clientY } = ('touches' in event) ? event.touches[0] : event;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = clientX - canvasRect.left;
    const offsetY = clientY - canvasRect.top;

    setCurrentLine([{ x: offsetX, y: offsetY }]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (!ctx || currentLine.length === 0) return;

    const { clientX, clientY } =  ('touches' in event) ? event.touches[0] : event;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = clientX - canvasRect.left;
    const offsetY = clientY - canvasRect.top;

    setCurrentLine([...currentLine, { x: offsetX, y: offsetY }]);
  };


  const handleMouseUp = () => {
    if (currentLine.length > 0) {
      setLines([...lines, currentLine]);
      setCurrentLine([]);
    }
  };

  const handleUndo = () => {
    if (lines.length > 0) {
      setLines(lines.slice(0, lines.length - 1));
    }
  };

  const handleClear = () => {
    setLines([]);
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
  };

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    lines.forEach((line) => drawLine(line));
    if (currentLine.length > 0) {
      drawLine(currentLine);
    }
  }, [lines, currentLine]);


  return (
    <div className='canvas-box'>
      <canvas
          className='drawing-box'
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        style={{ border: '4px solid DarkKhaki' }}
      />
      <div className='buttons-box'>
        <button className='undo-button'
          onClick={handleUndo}>Undo</button>
        <button className='delete-all-button'
          onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
};

export default Blackboard;