import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/constants';

const PlaylistCard = ({ playlist, index, moveCard, onClick }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PLAYLIST,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.PLAYLIST,
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveCard(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`
        relative rounded-lg overflow-hidden cursor-move transition-all
        transform hover:scale-105 hover:shadow-xl
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      onClick={() => onClick(playlist)}
    >
      <div className="aspect-video relative">
        <img
          src={playlist.thumbnail || '/api/placeholder/400/225'}
          alt={playlist.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-semibold truncate">{playlist.title}</h3>
          <div className="flex items-center mt-2 space-x-3">
            <span className="text-white text-sm flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {playlist.videoCount || 5} Videos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
