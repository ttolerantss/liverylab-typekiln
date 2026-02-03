import { useMetadataStore } from '../../../store';
import { Input, Select } from '../../common';
import type { LicenseType } from '../../../types';
import styles from './MetadataForm.module.css';

const LICENSE_OPTIONS = [
  { value: 'OFL', label: 'SIL Open Font License' },
  { value: 'MIT', label: 'MIT License' },
  { value: 'CC0', label: 'CC0 (Public Domain)' },
  { value: 'Apache-2.0', label: 'Apache License 2.0' },
  { value: 'Custom', label: 'Custom License' },
];

export function MetadataForm() {
  const metadata = useMetadataStore((s) => s.metadata);
  const updateMetadata = useMetadataStore((s) => s.updateMetadata);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Required</h3>
        <div className={styles.row}>
          <Input
            label="Font Family Name"
            value={metadata.familyName}
            onChange={(e) => updateMetadata({ familyName: e.target.value })}
            placeholder="My Custom Font"
            fullWidth
          />
          <Input
            label="Style Name"
            value={metadata.styleName}
            onChange={(e) => updateMetadata({ styleName: e.target.value })}
            placeholder="Regular"
            fullWidth
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Optional</h3>
        <div className={styles.row}>
          <Input
            label="Version"
            value={metadata.version}
            onChange={(e) => updateMetadata({ version: e.target.value })}
            placeholder="1.000"
            fullWidth
          />
          <Input
            label="Author"
            value={metadata.author}
            onChange={(e) => updateMetadata({ author: e.target.value })}
            placeholder="Your Name"
            fullWidth
          />
        </div>

        <Input
          label="Description"
          value={metadata.description}
          onChange={(e) => updateMetadata({ description: e.target.value })}
          placeholder="A brief description of your font..."
          fullWidth
        />

        <Input
          label="Copyright"
          value={metadata.copyright}
          onChange={(e) => updateMetadata({ copyright: e.target.value })}
          placeholder="Copyright © 2024 Your Name"
          fullWidth
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>License</h3>
        <Select
          label="License Type"
          options={LICENSE_OPTIONS}
          value={metadata.license}
          onChange={(e) => updateMetadata({ license: e.target.value as LicenseType })}
          fullWidth
        />

        {metadata.license === 'Custom' && (
          <textarea
            className={styles.textarea}
            value={metadata.customLicense}
            onChange={(e) => updateMetadata({ customLicense: e.target.value })}
            placeholder="Enter your custom license text..."
            rows={4}
          />
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>URLs</h3>
        <div className={styles.row}>
          <Input
            label="Manufacturer URL"
            value={metadata.manufacturerUrl}
            onChange={(e) => updateMetadata({ manufacturerUrl: e.target.value })}
            placeholder="https://example.com"
            fullWidth
          />
          <Input
            label="Designer URL"
            value={metadata.designerUrl}
            onChange={(e) => updateMetadata({ designerUrl: e.target.value })}
            placeholder="https://example.com/designer"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
