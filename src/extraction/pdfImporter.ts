import { extractResume } from './engineRegistry';

const ensurePdfWorker = async () => {
  const pdfjs = await import('pdfjs-dist');
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  }
  return pdfjs;
};

const readPdfText = async (file: File): Promise<string> => {
  const pdfjs = await ensurePdfWorker();
  const buffer = await file.arrayBuffer();
  const task = pdfjs.getDocument({ data: buffer });
  const doc = await task.promise;

  const pages: string[] = [];
  for (let index = 1; index <= doc.numPages; index += 1) {
    const page = await doc.getPage(index);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();
    if (text) pages.push(text);
  }

  return pages.join('\n');
};

export const importResumeFromPdf = async (file: File) => {
  const rawText = await readPdfText(file);
  if (!rawText.trim()) {
    throw new Error('PDF text extraction returned empty content');
  }

  return extractResume({ rawText, sourceName: file.name });
};
