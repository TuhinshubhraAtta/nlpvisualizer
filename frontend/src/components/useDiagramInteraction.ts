import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export function useDiagramInteraction() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originPanX: 0,
    originPanY: 0,
  });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originPanX: pan.x,
      originPanY: pan.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;

    setPan({
      x: dragState.current.originPanX + deltaX,
      y: dragState.current.originPanY + deltaY,
    });
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return {
    zoom,
    pan,
    setZoom,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
