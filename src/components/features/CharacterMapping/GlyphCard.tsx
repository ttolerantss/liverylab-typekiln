import { useMemo, useState } from 'react';
import type { Glyph } from '../../../types';
import { getDisplayName } from '../../../utils';
import { CharacterSelectModal } from './CharacterSelectModal';
import styles from './GlyphCard.module.css';

interface GlyphCardProps {
  glyph: Glyph;
}

export function GlyphCard({ glyph }: GlyphCardProps) {
  const [showModal, setShowModal] = useState(false);

  const svgPreview = useMemo(() => {
    const { originalBounds, paths } = glyph;
    const padding = 4;
    const viewBox = `${originalBounds.minX - padding} ${originalBounds.minY - padding} ${originalBounds.width + padding * 2} ${originalBounds.height + padding * 2}`;

    return (
      <svg viewBox={viewBox} className={styles.preview}>
        {paths.map((path, i) => (
          <path key={i} d={path.d} fill="currentColor" />
        ))}
      </svg>
    );
  }, [glyph]);

  const displayChar = glyph.character || '?';
  const displayName = glyph.character ? getDisplayName(glyph.character) : 'Unassigned';

  return (
    <>
      <button
        className={`${styles.card} ${!glyph.character ? styles.unassigned : ''}`}
        onClick={() => setShowModal(true)}
      >
        <div className={styles.previewContainer}>
          {svgPreview}
        </div>
        <div className={styles.info}>
          <span className={styles.character}>{displayChar}</span>
          <span className={styles.name}>{displayName}</span>
        </div>
        <div className={styles.source}>{glyph.sourceFileName}</div>
      </button>

      {showModal && (
        <CharacterSelectModal
          glyph={glyph}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
