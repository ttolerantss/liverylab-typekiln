import { useState, useMemo } from 'react';
import type { Glyph } from '../../../types';
import { useGlyphStore } from '../../../store';
import { FULL_CHARACTER_SET, getDisplayName } from '../../../utils';
import { Modal, Input } from '../../common';
import styles from './CharacterSelectModal.module.css';

interface CharacterSelectModalProps {
  glyph: Glyph;
  onClose: () => void;
}

export function CharacterSelectModal({ glyph, onClose }: CharacterSelectModalProps) {
  const [search, setSearch] = useState('');
  const assignCharacter = useGlyphStore((s) => s.assignCharacter);
  const characterMappings = useGlyphStore((s) => s.characterMappings);

  const filteredChars = useMemo(() => {
    const query = search.toLowerCase();
    return FULL_CHARACTER_SET.filter((char) => {
      const displayName = getDisplayName(char).toLowerCase();
      return char.toLowerCase().includes(query) || displayName.includes(query);
    });
  }, [search]);

  const handleSelect = (char: string) => {
    assignCharacter(glyph.id, char);
    onClose();
  };

  const getCharStatus = (char: string) => {
    const mapping = characterMappings.find((m) => m.character === char);
    if (!mapping) return 'available';
    if (mapping.glyphId === glyph.id) return 'current';
    if (mapping.glyphId) return 'assigned';
    return 'available';
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Assign Character"
      size="medium"
    >
      <div className={styles.content}>
        <Input
          placeholder="Search characters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />

        <div className={styles.grid}>
          {filteredChars.map((char) => {
            const status = getCharStatus(char);
            return (
              <button
                key={char}
                className={`${styles.charButton} ${styles[status]}`}
                onClick={() => handleSelect(char)}
                disabled={status === 'current'}
              >
                <span className={styles.char}>{char === ' ' ? '␣' : char}</span>
                <span className={styles.name}>{getDisplayName(char)}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.available}`} /> Available
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.assigned}`} /> Assigned
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.current}`} /> Current
          </span>
        </div>
      </div>
    </Modal>
  );
}
