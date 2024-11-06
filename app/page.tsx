"use client";

import { useState } from "react";
import { Button, Card, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { mergePDFs } from '@/app/services/pdfService';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
        <PictureAsPdfIcon className="mx-4" />
        <span>{file.name}</span>
      </div>
      <IconButton onClick={() => onDelete(id)}>
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

export default function Page() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles([...pdfFiles, ...Array.from(e.target.files)]);
    }
  };

  // Removed custom DragEndEvent interface

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPdfFiles((files) => {
        const oldIndex = files.findIndex((f) => f.name === active.id.toString());
        const newIndex = files.findIndex((f) => f.name === over.id.toString());
        return arrayMove(files, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (fileName: string) => {
    setPdfFiles(files => files.filter(file => file.name !== fileName));
  };
  
  const downloadPDF = (pdfBuffer: ArrayBuffer, filename: string): void => {
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // handleMergePDFsの実装を修正
  const handleMergePDFs = async () => {
    if (pdfFiles.length === 0) return;
    
    const result = await mergePDFs(pdfFiles);
    if (result.success && result.mergedPDF) {
      downloadPDF(result.mergedPDF, 'merged.pdf');
    } else {
      alert(result.error || 'PDFの結合に失敗しました');
    }
  };

  // 既存のdownloadPDFとhandleMergePDFs関数はそのまま

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        <Button
          variant="contained"
          component="label"
          startIcon={<PictureAsPdfIcon />}
        >
          PDFを選択
          <input
            type="file"
            hidden
            multiple
            accept=".pdf"
            onChange={handleFileChange}
          />
        </Button>
        <Button
          variant="contained"
          onClick={handleMergePDFs}
          disabled={pdfFiles.length === 0}
        >
          PDFを結合
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pdfFiles.map(file => file.name)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {pdfFiles.map((file) => (
              <SortableItem
                key={file.name}
                id={file.name}
                file={file}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}