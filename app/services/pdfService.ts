import { PDFDocument } from 'pdf-lib';

export interface PDFMergeResult {
  success: boolean;
  mergedPDF?: ArrayBuffer;
  error?: string;
}

export async function mergePDFs(files: File[]): Promise<PDFMergeResult> {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileArrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const mergedPdfFile = await mergedPdf.save();
    return {
      success: true,
      mergedPDF: mergedPdfFile
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}