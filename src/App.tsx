import React, { useRef, useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

const Canvas: React.FC = () => {
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
    <div>
      <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        style={{ border: '1px solid black' }}
      />
      <div>
        <button onClick={handleUndo}>Undo Last Stroke</button>
        <button onClick={handleClear}>Delete All</button>
      </div>
    </div>
  );
};



const App: React.FC = () => {
  return (
    <div>
      <h1>Drawing Application</h1>
      <Canvas />
    </div> 
  );
};

export default App;
