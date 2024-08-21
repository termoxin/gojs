import React from 'react';

interface LegendProps {
    legendItems: any[];
    legendRef: React.RefObject<HTMLDivElement>; 
}

const Legend: React.FC<LegendProps> = ({ legendItems, legendRef }) => {
    return (
        <div
            ref={legendRef} 
            id="legendContainer"
            style={{ display: 'inline-block', border: '1px solid #0000000f', padding: 10, backgroundColor: 'white', verticalAlign: 'top' }}
        >
            <strong style={{ marginBottom: 10 }}>Legend:</strong>
            {legendItems.map((item, index) => (
                <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <div className="color-box" style={{ width: 20, height: 20, marginRight: 10, backgroundColor: item.color }}></div>
                    {item.shape}
                </div>
            ))}
        </div>
    );
};

export default Legend;
