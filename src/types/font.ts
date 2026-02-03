export interface FontMetrics {
  unitsPerEm: number;
  ascender: number;
  descender: number;
  capHeight: number;
  xHeight: number;
  lineGap: number;
  letterSpacing: number;
  wordSpacing: number;
}

export interface FontMetadata {
  familyName: string;
  styleName: string;
  version: string;
  author: string;
  description: string;
  license: LicenseType;
  customLicense?: string;
  copyright: string;
  manufacturerUrl: string;
  designerUrl: string;
}

export type LicenseType = 'OFL' | 'MIT' | 'CC0' | 'Apache-2.0' | 'Custom';

export const LICENSE_TEXTS: Record<LicenseType, string> = {
  'OFL': 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
  'MIT': 'Permission is hereby granted, free of charge, to any person obtaining a copy of this font software...',
  'CC0': 'This font is dedicated to the public domain under CC0 1.0 Universal.',
  'Apache-2.0': 'Licensed under the Apache License, Version 2.0.',
  'Custom': ''
};

export interface ExportOptions {
  formats: ('ttf' | 'otf')[];
  includeReadme: boolean;
  zipName: string;
}

export interface ExportProgress {
  stage: 'preparing' | 'building' | 'generating' | 'packaging' | 'complete';
  progress: number;
  message: string;
}
