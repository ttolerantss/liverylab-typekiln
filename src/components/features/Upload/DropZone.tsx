import { useCallback, useState, useRef } from 'react';
import { useFileUpload } from '../../../hooks';
import { useUploadStore } from '../../../store';
import { ProgressBar } from '../../common';
import styles from './DropZone.module.css';

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { processFiles } = useFileUpload();
  const isProcessing = useUploadStore((s) => s.isProcessing);
  const progress = useUploadStore((s) => s.processingProgress);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [processFiles]);

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${isProcessing ? styles.processing : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".svg"
        multiple
        onChange={handleChange}
        className={styles.input}
      />

      {isProcessing ? (
        <div className={styles.progressWrapper}>
          <ProgressBar value={progress} showPercentage label="Processing files..." />
        </div>
      ) : (
        <>
          <div className={styles.icon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 32V16M24 16L18 22M24 16L30 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40 32V36C40 38.2091 38.2091 40 36 40H12C9.79086 40 8 38.2091 8 36V32"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.text}>
            <span className={styles.primary}>Drop SVG files here</span>
            <span className={styles.secondary}>or click to browse</span>
          </div>
          <div className={styles.hint}>
            Supports individual glyph SVG files. Name files after characters (e.g., A.svg, period.svg)
          </div>
        </>
      )}
    </div>
  );
}
