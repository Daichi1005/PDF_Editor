import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import { PictureAsPdf } from '@mui/icons-material';

interface SortableItemProps {
    id: string;
    file: File;
    onDelete: (id: string) => void;
  }
  
const SortableItem: React.FC<SortableItemProps> = ({ id, file, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
        ref={setNodeRef}
        style={style}
        className="p-4 mb-4 flex items-center justify-between"
        >
        <div className="flex items-center">
            <div {...attributes} {...listeners}>
            <DragIndicatorIcon className="cursor-move" />
            </div>
            <PictureAsPdf className="mx-4" />
            <span>{file.name}</span>
        </div>
        <IconButton onClick={() => onDelete(id)}>
            <DeleteIcon />
        </IconButton>
        </Card>
    );
};
  

export default SortableItem