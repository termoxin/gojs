import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';
import { generateNodes, setupLegend } from '../../utils/generateUtils';
import styled from 'styled-components';

interface DiagramProps {
  setLegendItems: (items: any[]) => void;
  diagramRef: React.MutableRefObject<go.Diagram | null>;
}

const DiagramContainer = styled.div`
  width: 600px;
  height: 400px;
  border: 1px solid #0000000f;
  margin-bottom: 20px;
  background-color: white;
`;

const Diagram: React.FC<DiagramProps> = ({ setLegendItems, diagramRef }) => {
  const diagramDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagramDivRef.current && !diagramRef.current) {
      const $ = go.GraphObject.make;
      const diagram = $(go.Diagram, diagramDivRef.current, {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true
      });

      diagram.nodeTemplateMap.add("Rectangle",
        $(go.Node, "Auto",
          $(go.Shape, "Rectangle",
            { width: 100, height: 50, fill: "white" },
            new go.Binding("fill", "color")
          )
        )
      );

      diagram.nodeTemplateMap.add("RoundedRectangle",
        $(go.Node, "Auto",
          $(go.Shape, "RoundedRectangle",
            { width: 100, height: 50, fill: "white", strokeJoin: "round" },
            new go.Binding("fill", "color")
          )
        )
      );

      diagram.nodeTemplateMap.add("Ellipse",
        $(go.Node, "Auto",
          $(go.Shape, "Ellipse",
            { width: 50, height: 50, fill: "white" },
            new go.Binding("fill", "color")
          )
        )
      );

      diagram.nodeTemplateMap.add("Triangle",
        $(go.Node, "Auto",
          $(go.Shape, "Triangle",
            { width: 50, height: 50, fill: "white" },
            new go.Binding("fill", "color")
          )
        )
      );

      diagramRef.current = diagram;
    }

    return () => {
      if (diagramRef.current) {
        diagramRef.current.div = null;
        diagramRef.current = null;
      }
    };
  }, [diagramRef]);

  useEffect(() => {
    if (diagramRef.current) {
      const nodes = generateNodes();
      diagramRef.current.model = new go.GraphLinksModel(nodes);
      setLegendItems(setupLegend(nodes));
    }
  }, [diagramRef, setLegendItems]);

  return <DiagramContainer ref={diagramDivRef} />;
};

export default Diagram;
