const DIAGRAM_SCALE = 2;
const BACKGROUND_COLOR = "white";
const LEGEND_FONT = "28px Arial";
const LEGEND_TEXT_COLOR = "black";
const COLOR_BOX_SIZE = 40;
const LEGEND_TEXT_OFFSET_X = 80;
const LEGEND_TEXT_OFFSET_Y = 50;
const COMBINED_CANVAS_SPACING = 50;
const COMBINED_CANVAS_MARGIN = 20;
const IMAGE_FORMAT = 'image/png';
const DOWNLOAD_FILE_NAME = 'nodes_with_legend.png';

export const exportWithLegend = (diagram: go.Diagram | null, legendContainer: HTMLDivElement | null) => {
    if (!diagram || !legendContainer) return;

    const diagramImage = createDiagramImage(diagram);

    if(!diagramImage) return;

    diagramImage.onload = () => {
        const legendCanvas = createLegendCanvas(legendContainer);
        const combinedCanvas = createCombinedCanvas(diagramImage, legendCanvas);

        if (combinedCanvas) {
            downloadImage(combinedCanvas);
        }
    };
};

function createDiagramImage(diagram: go.Diagram): HTMLImageElement | null {
    return diagram.makeImage({
        scale: DIAGRAM_SCALE,
        background: BACKGROUND_COLOR
    });
}

function createLegendCanvas(legendContainer: HTMLDivElement): HTMLCanvasElement {
    const legendCanvas = document.createElement('canvas');
    legendCanvas.width = legendContainer.offsetWidth * 2;
    legendCanvas.height = legendContainer.offsetHeight * 2;
    const legendCtx = legendCanvas.getContext('2d');

    if (legendCtx) {
        legendCtx.fillStyle = BACKGROUND_COLOR;
        legendCtx.fillRect(0, 0, legendCanvas.width, legendCanvas.height);
        legendCtx.font = LEGEND_FONT;
        legendCtx.fillStyle = LEGEND_TEXT_COLOR;

        const items = legendContainer.querySelectorAll('.legend-item');
        let offsetY = 40;
        legendCtx.fillText("Legend:", 20, offsetY);

        items.forEach(item => {
            const colorBox = item.querySelector('.color-box') as HTMLDivElement;
            const text = item.textContent || "";
            offsetY += LEGEND_TEXT_OFFSET_Y;
            legendCtx.fillStyle = colorBox.style.backgroundColor;
            legendCtx.fillRect(20, offsetY - COLOR_BOX_SIZE, COLOR_BOX_SIZE, COLOR_BOX_SIZE);
            legendCtx.fillStyle = LEGEND_TEXT_COLOR;
            legendCtx.fillText(text, LEGEND_TEXT_OFFSET_X, offsetY);
        });
    }

    return legendCanvas;
}

function createCombinedCanvas(diagramImage: HTMLImageElement, legendCanvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = diagramImage.width + legendCanvas.width + COMBINED_CANVAS_SPACING + 40;
    combinedCanvas.height = Math.max(diagramImage.height, legendCanvas.height) + 40;
    const ctx = combinedCanvas.getContext('2d');

    if (ctx) {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

        // Draw the legend on the left side
        ctx.drawImage(legendCanvas, COMBINED_CANVAS_MARGIN, (combinedCanvas.height - legendCanvas.height) / 2);

        // Draw the diagram to the right of the legend with spacing
        ctx.drawImage(diagramImage, legendCanvas.width + COMBINED_CANVAS_SPACING + COMBINED_CANVAS_MARGIN, (combinedCanvas.height - diagramImage.height) / 2);
    }

    return combinedCanvas;
}

function downloadImage(canvas: HTMLCanvasElement): void {
    const combinedImage = canvas.toDataURL(IMAGE_FORMAT);
    const link = document.createElement('a');
    link.download = DOWNLOAD_FILE_NAME;
    link.href = combinedImage;
    link.click();
}
