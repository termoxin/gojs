import * as go from 'gojs';

const DIAGRAM_SCALE = 2;
const BACKGROUND_COLOR = "white";
const LEGEND_PADDING = 20;
const LEGEND_BORDER_COLOR = "black";
const LEGEND_TITLE = "Legend:";
const LEGEND_TITLE_FONT = "bold 30px sans-serif"; 
const LEGEND_TITLE_COLOR = "black";

export const exportWithLegend = async (diagram: go.Diagram | null, legendItems: any[]) => {
  if (!diagram || !legendItems.length) return;

  const legendDiagram = createLegendDiagram(legendItems);

  legendDiagram.addDiagramListener("InitialLayoutCompleted", async () => {
    try {
      const diagramImage = await createDiagramImage(diagram);
      const legendImage = await createLegendImage(legendDiagram);

      const combinedCanvas = createCombinedCanvas(diagramImage, legendImage);
      if (combinedCanvas) {
        downloadImage(combinedCanvas);
      }
    } catch (error) {
      console.error("Error exporting image:", error);
    }
  });
};

function createLegendDiagram(legendItems: any[]): go.Diagram {
  const $ = go.GraphObject.make;
  const legendDiagramDiv = document.createElement('div');

  const legendDiagram = $(go.Diagram, legendDiagramDiv, {
    initialContentAlignment: go.Spot.Center,
    layout: $(go.GridLayout)
  });

  legendDiagram.nodeTemplate =
    $(go.Node, "Horizontal",
      $(go.Shape,
        { width: 20, height: 20 },
        new go.Binding("fill", "color"),
        new go.Binding("figure", "shape")
      ),
      $(go.TextBlock,
        new go.Binding("text", "shape"),
        { margin: 8 }
      )
    );

  legendDiagram.model = new go.GraphLinksModel(legendItems);
  return legendDiagram;
}

function createLegendImage(legendDiagram: go.Diagram): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const legendImage = legendDiagram.makeImage({
      scale: DIAGRAM_SCALE,
      background: BACKGROUND_COLOR
    });

    if (!legendImage) {
      return reject(new Error("Failed to create legend image"));
    }

    legendImage.onload = () => resolve(legendImage);
    legendImage.onerror = () => reject(new Error("Failed to load legend image"));
  });
}

function createDiagramImage(diagram: go.Diagram): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const diagramImage = diagram.makeImage({
      scale: DIAGRAM_SCALE,
      background: BACKGROUND_COLOR
    });

    if (!diagramImage) {
      return reject(new Error("Failed to create diagram image"));
    }

    diagramImage.onload = () => resolve(diagramImage);
    diagramImage.onerror = () => reject(new Error("Failed to load diagram image"));
  });
}

function createCombinedCanvas(diagramImage: HTMLImageElement, legendImage: HTMLImageElement): HTMLCanvasElement | null {
  const legendWithPaddingWidth = legendImage.width + 2 * LEGEND_PADDING;
  const legendWithPaddingHeight = legendImage.height + 2 * LEGEND_PADDING + 30; // extra space for the "Legend" title

  const combinedCanvas = document.createElement('canvas');
  combinedCanvas.width = diagramImage.width + legendWithPaddingWidth + 50;
  combinedCanvas.height = Math.max(diagramImage.height, legendWithPaddingHeight) + 40;
  const ctx = combinedCanvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

    ctx.strokeStyle = LEGEND_BORDER_COLOR;
    ctx.strokeRect(20, (combinedCanvas.height - legendWithPaddingHeight) / 2, legendWithPaddingWidth, legendWithPaddingHeight);

    ctx.fillStyle = LEGEND_TITLE_COLOR;
    ctx.font = LEGEND_TITLE_FONT;
    ctx.fillText(LEGEND_TITLE, 30, (combinedCanvas.height - legendWithPaddingHeight) / 2 + 20);

    ctx.drawImage(legendImage, 20 + LEGEND_PADDING, (combinedCanvas.height - legendWithPaddingHeight) / 2 + 30);

    ctx.drawImage(diagramImage, legendWithPaddingWidth + 40, (combinedCanvas.height - diagramImage.height) / 2);
  }

  return combinedCanvas;
}

function downloadImage(canvas: HTMLCanvasElement): void {
  const combinedImage = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = getTimestampedFileName();
  link.href = combinedImage;
  link.click();
}

function getTimestampedFileName(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `nodes_with_legend_${year}_${month}_${day}_${hours}_${minutes}_${seconds}.png`;
}
