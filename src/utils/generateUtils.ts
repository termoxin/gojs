import { shapes, colors } from "../constants/shapes";

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const createNode = (shape: string, color: string, x: number, y: number) => ({
    category: shape,
    shape,
    color,
    loc: `${x} ${y}`
});

export const generateNodes = () => {
    const nodes = [];
    const numNodes = getRandomInt(2, 20);
    for (let i = 0; i < numNodes; i++) {
        const shape = shapes[getRandomInt(0, shapes.length - 1)];
        const color = colors[getRandomInt(0, colors.length - 1)];
        const x = getRandomInt(50, 500);
        const y = getRandomInt(50, 300);
        nodes.push(createNode(shape, color, x, y));
    }
    return nodes;
};

export const setupLegend = (nodes: any[]) => {
    const uniqueEntries = new Map<string, any>();

    nodes.forEach(node => {
        const key = `${node.color}-${node.shape}`;
        if (!uniqueEntries.has(key)) {
            uniqueEntries.set(key, node);
        }
    });

    return Array.from(uniqueEntries.values());
};