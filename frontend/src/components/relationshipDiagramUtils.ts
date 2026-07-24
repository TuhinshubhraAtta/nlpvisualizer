import type { DiagramEdge, DiagramNode } from "./relationshipDiagramData";

export type PositionedNode = DiagramNode & {
  x: number;
  y: number;
};

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 56;
export const H_GAP = 220;
export const V_GAP = 120;
export const PADDING = 70;
const GRAPH_MIN_WIDTH = 940;
const GRAPH_MIN_HEIGHT = 880;

const nodePriority: Record<string, number> = {
  "frontend-app": 0,
  "run-pipeline": 1,
  "export-json": 2,
  "backend-app": 3,
  "preprocess-route": 4,
  "health-route": 5,
  "pipeline-class": 6,
  "pipeline-run": 7,
  "pipeline-step-model": 8,
  "cleaning-step": 9,
  "tokenizer-step": 10,
  "pos-step": 11,
  "ner-step": 12,
  "stopword-step": 13,
  "stemmer-step": 14,
  "lemmatizer-step": 15,
  "embedding-step": 16,
};

export const buildAutoLayout = (
  nodeList: DiagramNode[],
  edgeList: DiagramEdge[],
): { positionedNodes: PositionedNode[]; graphWidth: number; graphHeight: number } => {
  const incoming = new Map<string, number>(nodeList.map((node) => [node.id, 0]));
  const outgoing = new Map<string, string[]>(nodeList.map((node) => [node.id, []]));

  for (const edge of edgeList) {
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    outgoing.get(edge.from)?.push(edge.to);
  }

  const pending = nodeList
    .filter((node) => (incoming.get(node.id) ?? 0) === 0)
    .sort((left, right) => (nodePriority[left.id] ?? 0) - (nodePriority[right.id] ?? 0));

  const levelMap = new Map<string, number>(pending.map((node) => [node.id, 0]));
  const remaining = new Map<string, number>(
    nodeList.map((node) => [node.id, incoming.get(node.id) ?? 0]),
  );

  while (pending.length > 0) {
    const current = pending.shift();

    if (!current) {
      continue;
    }

    const nextNodes = outgoing.get(current.id) ?? [];

    for (const nextId of nextNodes) {
      const nextLevel = Math.max(
        levelMap.get(nextId) ?? 0,
        (levelMap.get(current.id) ?? 0) + 1,
      );
      levelMap.set(nextId, nextLevel);

      const nextRemaining = (remaining.get(nextId) ?? 0) - 1;
      remaining.set(nextId, nextRemaining);

      if (nextRemaining === 0) {
        const nextNode = nodeList.find((candidate) => candidate.id === nextId);

        if (nextNode) {
          pending.push(nextNode);
          pending.sort(
            (left, right) => (nodePriority[left.id] ?? 0) - (nodePriority[right.id] ?? 0),
          );
        }
      }
    }
  }

  const layers = new Map<number, DiagramNode[]>();

  for (const node of nodeList) {
    const layer = levelMap.get(node.id) ?? 0;
    const existing = layers.get(layer) ?? [];
    existing.push(node);
    layers.set(layer, existing);
  }

  const positionedNodes = nodeList.map((node) => {
    const layer = levelMap.get(node.id) ?? 0;
    const orderedNodes = [...(layers.get(layer) ?? [])].sort(
      (left, right) => (nodePriority[left.id] ?? 0) - (nodePriority[right.id] ?? 0),
    );
    const indexInLayer = orderedNodes.findIndex((candidate) => candidate.id === node.id);

    return {
      ...node,
      x: PADDING + layer * (NODE_WIDTH + H_GAP),
      y: PADDING + indexInLayer * (NODE_HEIGHT + V_GAP),
    };
  });

  const graphWidth = Math.max(
    GRAPH_MIN_WIDTH,
    ...positionedNodes.map((node) => node.x + NODE_WIDTH + PADDING),
  );
  const graphHeight = Math.max(
    GRAPH_MIN_HEIGHT,
    ...positionedNodes.map((node) => node.y + NODE_HEIGHT + PADDING),
  );

  return { positionedNodes, graphWidth, graphHeight };
};

export const getEdgePoints = (
  source: PositionedNode,
  target: PositionedNode,
): string => {
  const startX = source.x + NODE_WIDTH;
  const startY = source.y + NODE_HEIGHT / 2;
  const endX = target.x;
  const endY = target.y + NODE_HEIGHT / 2;

  const midX = startX + (endX - startX) / 2;

  return `${startX},${startY} ${midX},${startY} ${midX},${endY} ${endX},${endY}`;
};

