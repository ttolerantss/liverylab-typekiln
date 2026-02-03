import { Header, Footer } from './components/layout';
import { ToastContainer, Button } from './components/common';
import { useUIStore, useGlyphStore } from './store';
import {
  DropZone,
  FileList,
  GlyphGrid,
  CharacterSetGrid,
  KerningTable,
  KerningPreview,
  FontPreview,
  PreviewControls,
  MetadataForm,
  MetricsForm,
  ExportPanel,
} from './components/features';
import styles from './App.module.css';

type TabId = 'upload' | 'mapping' | 'kerning' | 'preview' | 'metadata' | 'export';

const TABS: { id: TabId; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'mapping', label: 'Mapping' },
  { id: 'kerning', label: 'Kerning' },
  { id: 'preview', label: 'Preview' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'export', label: 'Export' },
];

function App() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const glyphs = useGlyphStore((s) => s.glyphs);

  const assignedCount = Array.from(glyphs.values()).filter(g => g.character).length;

  return (
    <div className={styles.app}>
      <Header />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>TypeKiln</h1>
        <a
          href="https://github.com/ttolerantss/liverylab-typekiln"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.heroLink}
        >
          view on github
        </a>
      </section>

      <main className={styles.main}>
        <nav className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.content}>
          {activeTab === 'upload' && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Upload SVG Files</h2>
              <p className={styles.panelDescription}>
                Upload your glyph SVG files. Files can be named after characters (A.svg, period.svg)
                for auto-detection, or you can assign characters manually in the next step.
              </p>
              <DropZone />
              <FileList />
            </div>
          )}

          {activeTab === 'mapping' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Character Mapping</h2>
                  <p className={styles.panelDescription}>
                    Assign characters to your glyphs. Click a glyph to change its character assignment.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setActiveTab('kerning')}
                  disabled={assignedCount === 0}
                >
                  Continue to Kerning
                </Button>
              </div>
              <div className={styles.mappingLayout}>
                <div className={styles.glyphSection}>
                  <GlyphGrid />
                </div>
                <div className={styles.coverageSection}>
                  <CharacterSetGrid />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kerning' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Kerning</h2>
                  <p className={styles.panelDescription}>
                    Adjust spacing between character pairs. Use Auto-Kern to generate initial values.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setActiveTab('preview')}
                >
                  Continue to Preview
                </Button>
              </div>
              <div className={styles.kerningLayout}>
                <div className={styles.kerningTable}>
                  <KerningTable />
                </div>
                <div className={styles.kerningPreview}>
                  <KerningPreview />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Font Preview</h2>
                  <p className={styles.panelDescription}>
                    Preview how your font will look. Adjust size, spacing, and colors.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setActiveTab('metadata')}
                >
                  Continue to Metadata
                </Button>
              </div>
              <div className={styles.previewLayout}>
                <div className={styles.previewMain}>
                  <FontPreview />
                </div>
                <div className={styles.previewSidebar}>
                  <PreviewControls />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Font Metadata</h2>
                  <p className={styles.panelDescription}>
                    Configure font information. The font family name is required for export.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setActiveTab('export')}
                >
                  Continue to Export
                </Button>
              </div>
              <div className={styles.splitPanel}>
                <div className={styles.splitLeft}>
                  <MetadataForm />
                </div>
                <div className={styles.splitRight}>
                  <MetricsForm />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Export Font</h2>
              <p className={styles.panelDescription}>
                Generate and download your font files as a ZIP package.
              </p>
              <div className={styles.exportContainer}>
                <ExportPanel />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
