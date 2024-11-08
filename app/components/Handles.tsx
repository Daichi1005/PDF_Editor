// handles.ts

import { DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// handleFileChange関数
export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPdfFiles: React.Dispatch<React.SetStateAction<File[]>>,
  pdfFiles: File[]
) => {
  if (e.target.files) {
    setPdfFiles([...pdfFiles, ...Array.from(e.target.files)]);
  }
};

// handleDragEnd関数
export const handleDragEnd = (
  event: DragEndEvent,
  setPdfFiles: React.Dispatch<React.SetStateAction<File[]>>
) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    setPdfFiles((files) => {
      const oldIndex = files.findIndex((f) => f.name === active.id.toString());
      const newIndex = files.findIndex((f) => f.name === over.id.toString());
      return arrayMove(files, oldIndex, newIndex);
    });
  }
};

// sensorsのエクスポート
export const createSensors = () => {
  return useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
};