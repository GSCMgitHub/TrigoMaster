import React from 'react';
import { Stage, Layer, Line, Text, Circle, Group, Arc } from 'react-konva';

const GameCanvas = ({ problemData }) => {
  if (!problemData) return null;

  // Configuración de dimensiones
  const width = 400;
  const height = 300;
  const margin = 50;
  
  // Coordenadas del triángulo
  const x0 = margin;             // Esquina izquierda
  const y0 = margin;             // Techo
  const x1 = margin;             // Ángulo recto (X)
  const y1 = height - margin;    // Ángulo recto (Y)
  const x2 = width - margin;     // Esquina derecha (Base)
  const y2 = height - margin;    // Esquina derecha (Y)

  // Determinar qué etiquetas mostrar
  const labelA = problemData.a; // Vertical
  const labelB = problemData.b; // Horizontal
  const labelH = problemData.h; // Hipotenusa

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Sombra proyectada (Nivel 4 - Árbol) */}
        {problemData.h === "h" && (
          <Line
            points={[x1, y1, x2, y2]}
            stroke="#d3d3d3"
            strokeWidth={8}
            lineCap="round"
          />
        )}

        {/* El Triángulo Principal */}
        <Line
          points={[x0, y0, x1, y1, x2, y2]}
          closed={true}
          stroke={problemData.h === "h" ? "#2e7d32" : "#4285F4"}
          strokeWidth={4}
          fill={problemData.h === "h" ? "#f1f8e9" : "#e8f0fe"}
          lineJoin="round"
        />

        {/* Ángulo Recto (Cuadradito) */}
        <Line
          points={[x1, y1 - 20, x1 + 20, y1 - 20, x1 + 20, y1]}
          stroke="#9e9e9e"
          strokeWidth={2}
        />

        {/* Representación del Árbol (Nivel 4) */}
        {problemData.h === "h" && (
          <Group x={x1} y={y0}>
            <Line points={[0, 0, 0, y1 - y0]} stroke="#5d4037" strokeWidth={10} />
            <Circle x={0} y={0} radius={35} fill="#4caf50" shadowBlur={10} />
            <Circle x={15} y={10} radius={25} fill="#388e3c" />
          </Group>
        )}

        {/* Arcos de los ángulos (Theta) */}
        {problemData.anglePos === "top" && (
          <Arc
            x={x0} y={y0}
            innerRadius={30} outerRadius={35}
            angle={90} rotation={0}
            fill="#ff5722"
          />
        )}
        {problemData.anglePos === "bottom" && (
          <Arc
            x={x2} y={y2}
            innerRadius={30} outerRadius={35}
            angle={90} rotation={180}
            fill="#ff5722"
          />
        )}

        {/* Etiquetas de los Lados */}
        {/* Lado A (Vertical) */}
        <Group x={x1 - 40} y={(y0 + y1) / 2}>
           <Text text={labelA.toString()} fontSize={18} fontStyle="bold" fill="#333" />
        </Group>

        {/* Lado B (Horizontal) */}
        <Group x={(x1 + x2) / 2} y={y1 + 15}>
           <Text text={labelB.toString()} fontSize={18} fontStyle="bold" fill="#333" />
        </Group>

        {/* Hipotenusa (Diagonal) */}
        <Group x={(x0 + x2) / 2 + 10} y={(y0 + y2) / 2 - 20}>
           <Text 
             text={labelH.toString()} 
             fontSize={18} 
             fontStyle="bold" 
             fill={labelH === "?" ? "#d32f2f" : "#333"} 
           />
        </Group>

        {/* Símbolo de Ángulo Theta (θ) */}
        {problemData.anglePos !== "none" && (
          <Text
            x={problemData.anglePos === "top" ? x0 + 10 : x2 - 50}
            y={problemData.anglePos === "top" ? y0 + 40 : y2 - 40}
            text="θ"
            fontSize={24}
            fill="#ff5722"
            fontStyle="bold"
          />
        )}
      </Layer>
    </Stage>
  );
};

export default GameCanvas;