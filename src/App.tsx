import React, { useRef, useState } from 'react';
import Diagram from './components/Diagram/Diagram';
import Legend from './components/Legend/Legend';
import { exportWithLegend } from './utils/exportUtils';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ExportButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const RegenerateButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const App: React.FC = () => {
  const [legendItems, setLegendItems] = useState<any[]>([]);
  const [key, setKey] = useState<number>(0); 
  const diagramRef = useRef<go.Diagram | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);

  const regenerateDiagram = () => {
    setKey(prevKey => prevKey + 1); 
  };

  return (
    <Container>
      <ContentWrapper>
        <Legend legendItems={legendItems} legendRef={legendRef} />
        <Diagram
          key={key} // Pass key to force re-render
          setLegendItems={setLegendItems}
          diagramRef={diagramRef}
        />
      </ContentWrapper>
      <ExportButton onClick={() => exportWithLegend(diagramRef.current, legendRef.current)}>
        Export with Legend
      </ExportButton>
      <RegenerateButton onClick={regenerateDiagram}>
        Regenerate Diagram
      </RegenerateButton>
    </Container>
  );
};

export default App;
