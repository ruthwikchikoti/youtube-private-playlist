import { useRef, useCallback } from 'react';

export const useDrag = (onDragEnd) => {
  const dragItem = useRef(null);
  const dragNode = useRef(null);

  const handleDragStart = useCallback((e, index) => {
    dragItem.current = index;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      dragNode.current?.classList.add('dragging');
    }, 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragNode.current?.classList.remove('dragging');
    dragNode.current?.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    onDragEnd(dragItem.current, index);
    dragItem.current = index;
  }, [onDragEnd]);

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver
  };
};