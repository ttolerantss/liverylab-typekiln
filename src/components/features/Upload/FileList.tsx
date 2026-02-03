import { useUploadStore } from '../../../store';
import { Button } from '../../common';
import styles from './FileList.module.css';

export function FileList() {
  const files = useUploadStore((s) => s.files);
  const removeFile = useUploadStore((s) => s.removeFile);
  const clearAll = useUploadStore((s) => s.clearAll);

  if (files.length === 0) return null;

  const parsedCount = files.filter((f) => f.status === 'parsed').length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <span className={styles.count}>{files.length} files</span>
          {parsedCount > 0 && (
            <span className={styles.parsed}>{parsedCount} parsed</span>
          )}
          {errorCount > 0 && (
            <span className={styles.errors}>{errorCount} errors</span>
          )}
        </div>
        <Button variant="ghost" size="small" onClick={clearAll}>
          Clear All
        </Button>
      </div>

      <div className={styles.list}>
        {files.map((file) => (
          <div key={file.id} className={`${styles.item} ${styles[file.status]}`}>
            <div className={styles.icon}>
              {file.status === 'parsed' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {file.status === 'error' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 6L6 10M6 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
              {(file.status === 'pending' || file.status === 'parsing') && (
                <div className={styles.spinner} />
              )}
            </div>
            <span className={styles.name}>{file.name}</span>
            {file.error && <span className={styles.error}>{file.error}</span>}
            <button
              className={styles.remove}
              onClick={() => removeFile(file.id)}
              aria-label="Remove file"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
