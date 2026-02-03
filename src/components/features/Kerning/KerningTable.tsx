import { useState, useMemo } from 'react';
import { useKerningStore, useGlyphStore, useUIStore } from '../../../store';
import { analyzeGlyphShape, generateAutoKerning } from '../../../services';
import { Input, Button } from '../../common';
import { KerningPairRow } from './KerningPairRow';
import styles from './KerningTable.module.css';

export function KerningTable() {
  const [search, setSearch] = useState('');
  const pairs = useKerningStore((s) => s.pairs);
  const setPairs = useKerningStore((s) => s.setPairs);
  const setShapeProfiles = useKerningStore((s) => s.setShapeProfiles);
  const isCalculating = useKerningStore((s) => s.isCalculating);
  const setCalculating = useKerningStore((s) => s.setCalculating);
  const glyphs = useGlyphStore((s) => s.glyphs);
  const addToast = useUIStore((s) => s.addToast);

  const filteredPairs = useMemo(() => {
    if (!search) return pairs;
    const query = search.toLowerCase();
    return pairs.filter(
      (p) =>
        p.left.toLowerCase().includes(query) ||
        p.right.toLowerCase().includes(query)
    );
  }, [pairs, search]);

  const handleAutoKern = async () => {
    if (glyphs.size === 0) {
      addToast('warning', 'No glyphs loaded to analyze');
      return;
    }

    setCalculating(true);

    try {
      // Analyze all glyphs
      const profiles = new Map<string, ReturnType<typeof analyzeGlyphShape>>();
      for (const glyph of glyphs.values()) {
        if (glyph.character) {
          profiles.set(glyph.id, analyzeGlyphShape(glyph));
        }
      }

      setShapeProfiles(profiles);

      // Generate kerning pairs
      const newPairs = generateAutoKerning(glyphs, profiles);
      setPairs(newPairs);

      addToast('success', `Generated ${newPairs.length} kerning pairs`);
    } catch (error) {
      addToast('error', 'Failed to calculate kerning');
    } finally {
      setCalculating(false);
    }
  };

  const handleClearAll = () => {
    setPairs([]);
    addToast('info', 'All kerning pairs cleared');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Kerning Pairs ({pairs.length})</h3>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="small"
            onClick={handleAutoKern}
            loading={isCalculating}
          >
            Auto-Kern
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={handleClearAll}
            disabled={pairs.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search pairs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />

      {filteredPairs.length === 0 ? (
        <div className={styles.empty}>
          {pairs.length === 0 ? (
            <>
              <p>No kerning pairs defined.</p>
              <p className={styles.hint}>
                Click "Auto-Kern" to automatically generate kerning based on glyph shapes.
              </p>
            </>
          ) : (
            <p>No pairs match your search.</p>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {filteredPairs.map((pair) => (
            <KerningPairRow key={pair.id} pair={pair} />
          ))}
        </div>
      )}
    </div>
  );
}
