import React, { useEffect, useRef, useState, useCallback } from 'react';
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

const DialogContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border: 1px solid #ccc;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 300px;
  width: 100%;
`;

const DialogHeader = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DialogFooter = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const DialogButton = styled.button<{ color: string }>`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: ${({ color }) => color};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const DialogColorPicker = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ShapeSelect = styled.select`
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Diagram: React.FC<DiagramProps> = ({ setLegendItems, diagramRef }) => {
  const diagramDivRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<go.Node | null>(null);
  const [shape, setShape] = useState<string>('');
  const [color, setColor] = useState<string>('#ffffff'); // Default to white
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const updateLegend = useCallback(() => {
    if (diagramRef.current) {
      const nodes = diagramRef.current.model.nodeDataArray;
      setLegendItems(setupLegend(nodes));
    }
  }, [setLegendItems]);

  useEffect(() => {
    if (diagramDivRef.current && !diagramRef.current) {
      const $ = go.GraphObject.make;
      const diagram = $(go.Diagram, diagramDivRef.current, {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true
      });

      const removeNodeMenu =
        $(go.Adornment, "Vertical",
          $("ContextMenuButton",
            $(go.TextBlock, "Remove"),
            {
              click: (e, obj) => {
                const node = obj.part;
                if (node) {
                  diagram.model.removeNodeData(node.data);
                  updateLegend(); 
                }
              }
            }
          )
        );

      const nodeDoubleClick = (e: go.InputEvent, obj: go.GraphObject) => {
        const node = obj.part as go.Node;
        setSelectedNode(node);
        setShape(node.data.shape);
        setColor(node.data.color);
        setDialogVisible(true);
      };

      diagram.nodeTemplateMap.add("Rectangle",
        $(go.Node, "Auto",
          $(go.Shape, "Rectangle",
            { width: 100, height: 50, fill: "white" },
            new go.Binding("fill", "color"),
            new go.Binding("figure", "shape"),
            new go.Binding("width", "width"),
            new go.Binding("height", "height"),
          ),
          {
            contextMenu: removeNodeMenu,
            doubleClick: nodeDoubleClick
          }
        )
      );

      diagram.nodeTemplateMap.add("RoundedRectangle",
        $(go.Node, "Auto",
          $(go.Shape, "RoundedRectangle",
            { width: 100, height: 50, fill: "white", strokeJoin: "round" },
            new go.Binding("fill", "color"),
            new go.Binding("figure", "shape"),
            new go.Binding("width", "width"),
            new go.Binding("height", "height"),
          ),
          {
            contextMenu: removeNodeMenu,
            doubleClick: nodeDoubleClick
          }
        )
      );

      diagram.nodeTemplateMap.add("Ellipse",
        $(go.Node, "Auto",
          $(go.Shape, "Ellipse",
            { width: 50, height: 50, fill: "white" },
            new go.Binding("fill", "color"),
            new go.Binding("figure", "shape"),
            new go.Binding("width", "width"),
            new go.Binding("height", "height"),
          ),
          {
            contextMenu: removeNodeMenu,
            doubleClick: nodeDoubleClick
          }
        )
      );

      diagram.nodeTemplateMap.add("Triangle",
        $(go.Node, "Auto",
          $(go.Shape, "Triangle",
            { width: 50, height: 50, fill: "white" },
            new go.Binding("fill", "color"),
            new go.Binding("figure", "shape"),
            new go.Binding("width", "width"),
            new go.Binding("height", "height"),
          ),
          {
            contextMenu: removeNodeMenu,
            doubleClick: nodeDoubleClick
          }
        )
      );

      diagram.addDiagramListener("ChangedSelection", updateLegend); 

      diagramRef.current = diagram;
    }

    return () => {
      if (diagramRef.current) {
        diagramRef.current.div = null;
        diagramRef.current = null;
      }
    };
  }, [diagramRef, updateLegend]);

  useEffect(() => {
    if (diagramRef.current) {
      const nodes = generateNodes();
      diagramRef.current.model = new go.GraphLinksModel(nodes);
      updateLegend(); 
    }
  }, [diagramRef, updateLegend]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
      setDialogVisible(false);
      setSelectedNode(null);
    }
  }, []);

  useEffect(() => {
    if (dialogVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dialogVisible, handleClickOutside]);

  const handleDialogClose = () => {
    setDialogVisible(false);
    setSelectedNode(null);
  };
  const handleSaveChanges = () => {
    if (selectedNode) {
      const newShape = shape;
      const hexColor = color.startsWith('#') ? color : rgbToHex(color);  
  
      let newWidth = 100;
      let newHeight = 50;
      
      if (newShape === 'Ellipse') {
        newWidth = 50;
        newHeight = 50;
      } else if (newShape === 'Triangle') {
        newWidth = 50;
        newHeight = 50;
      }
  
      if (selectedNode.data.shape === 'Ellipse' && newShape === 'Rectangle') {
        newWidth = 100; 
        newHeight = 50; 
      } else if (selectedNode.data.shape === 'Rectangle' && newShape === 'Ellipse') {
        newWidth = 50; 
        newHeight = 50; 
      }

      diagramRef.current?.model.startTransaction('update');
      diagramRef.current?.model.setDataProperty(selectedNode.data, 'shape', newShape);
      diagramRef.current?.model.setDataProperty(selectedNode.data, 'color', hexColor);
      diagramRef.current?.model.setDataProperty(selectedNode.data, 'width', newWidth);
      diagramRef.current?.model.setDataProperty(selectedNode.data, 'height', newHeight);
      diagramRef.current?.model.commitTransaction('update');
  
      updateLegend(); 
    }
    handleDialogClose();
  };
  

  const rgbToHex = (rgb: string) => {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
    if (/^rgb/.test(rgb)) {
      const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return '#ffffff'; 
  };

  return (
    <>
      <DiagramContainer ref={diagramDivRef} />
      {dialogVisible && (
        <DialogContainer ref={dialogRef}>
          <DialogHeader>Edit Node</DialogHeader>
          <DialogBody>
            <label>
              Shape:
              <ShapeSelect
                value={shape}
                onChange={(e) => setShape(e.target.value)}
              >
                <option value="Rectangle">Rectangle</option>
                <option value="RoundedRectangle">RoundedRectangle</option>
                <option value="Ellipse">Ellipse</option>
                <option value="Triangle">Triangle</option>
              </ShapeSelect>
            </label>
            <label>
              Color:
              <DialogColorPicker
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          </DialogBody>
          <DialogFooter>
            <DialogButton color="#007bff" onClick={handleSaveChanges}>Save</DialogButton>
            <DialogButton color="#dc3545" onClick={handleDialogClose}>Cancel</DialogButton>
          </DialogFooter>
        </DialogContainer>
      )}
    </>
  );
};

export default Diagram;
