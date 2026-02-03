import { SVGPathData, SVGPathDataTransformer } from 'svg-pathdata';
import type { ParsedSVG, ParsedPath, SVGBounds } from '../../types';
import { detectCharacterFromFilename } from '../../utils';

export function parseSVGContent(id: string, fileName: string, content: string): ParsedSVG {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) {
    throw new Error('Invalid SVG: No <svg> element found');
  }

  // Get dimensions and viewBox
  const viewBoxAttr = svg.getAttribute('viewBox');
  const widthAttr = svg.getAttribute('width');
  const heightAttr = svg.getAttribute('height');

  let viewBox = { x: 0, y: 0, width: 100, height: 100 };
  if (viewBoxAttr) {
    const parts = viewBoxAttr.split(/[\s,]+/).map(Number);
    viewBox = {
      x: parts[0] || 0,
      y: parts[1] || 0,
      width: parts[2] || 100,
      height: parts[3] || 100,
    };
  }

  const width = parseFloat(widthAttr || String(viewBox.width));
  const height = parseFloat(heightAttr || String(viewBox.height));

  // Extract all paths
  const paths = extractPaths(svg);

  if (paths.length === 0) {
    throw new Error('SVG contains no drawable paths');
  }

  // Calculate bounds
  const bounds = calculateBounds(paths);

  // Detect character from filename
  const detectedCharacter = detectCharacterFromFilename(fileName);

  return {
    id,
    fileName,
    paths,
    bounds,
    viewBox,
    width,
    height,
    detectedCharacter,
    detectionMethod: detectedCharacter ? 'literal' : undefined,
  };
}

function extractPaths(element: Element, parentTransform = ''): ParsedPath[] {
  const paths: ParsedPath[] = [];
  const transform = combineTransforms(parentTransform, element.getAttribute('transform') || '');

  for (const child of element.children) {
    const tagName = child.tagName.toLowerCase();

    if (tagName === 'g') {
      // Recursively process groups
      paths.push(...extractPaths(child, transform));
    } else if (tagName === 'path') {
      const d = child.getAttribute('d');
      if (d) {
        const transformedD = applyTransformToPath(d, transform);
        paths.push({
          d: transformedD,
          fill: child.getAttribute('fill') || undefined,
          stroke: child.getAttribute('stroke') || undefined,
          strokeWidth: parseFloat(child.getAttribute('stroke-width') || '0') || undefined,
        });
      }
    } else if (tagName === 'rect') {
      const d = rectToPath(child);
      if (d) {
        const transformedD = applyTransformToPath(d, transform);
        paths.push({ d: transformedD, fill: child.getAttribute('fill') || undefined });
      }
    } else if (tagName === 'circle') {
      const d = circleToPath(child);
      if (d) {
        const transformedD = applyTransformToPath(d, transform);
        paths.push({ d: transformedD, fill: child.getAttribute('fill') || undefined });
      }
    } else if (tagName === 'ellipse') {
      const d = ellipseToPath(child);
      if (d) {
        const transformedD = applyTransformToPath(d, transform);
        paths.push({ d: transformedD, fill: child.getAttribute('fill') || undefined });
      }
    } else if (tagName === 'polygon') {
      const d = polygonToPath(child);
      if (d) {
        const transformedD = applyTransformToPath(d, transform);
        paths.push({ d: transformedD, fill: child.getAttribute('fill') || undefined });
      }
    } else if (tagName === 'polyline') {
      const d = polylineToPath(child);
      if (d) {
        const transformedD = applyTransformToPath(d, transform);
        paths.push({ d: transformedD, fill: child.getAttribute('fill') || undefined });
      }
    } else if (tagName === 'line') {
      const d = lineToPath(child);
      if (d) {
        const transformedD = applyTransformToPath(d, transform);
        paths.push({
          d: transformedD,
          stroke: child.getAttribute('stroke') || undefined,
          strokeWidth: parseFloat(child.getAttribute('stroke-width') || '1'),
        });
      }
    }
  }

  return paths;
}

function rectToPath(rect: Element): string | null {
  const x = parseFloat(rect.getAttribute('x') || '0');
  const y = parseFloat(rect.getAttribute('y') || '0');
  const width = parseFloat(rect.getAttribute('width') || '0');
  const height = parseFloat(rect.getAttribute('height') || '0');
  const rx = parseFloat(rect.getAttribute('rx') || '0');
  const ry = parseFloat(rect.getAttribute('ry') || String(rx));

  if (width === 0 || height === 0) return null;

  if (rx === 0 && ry === 0) {
    return `M${x},${y}h${width}v${height}h${-width}Z`;
  }

  const r = Math.min(rx, width / 2, height / 2);
  return `M${x + r},${y}h${width - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${height - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${-(width - 2 * r)}a${r},${r} 0 0 1 ${-r},${-r}v${-(height - 2 * r)}a${r},${r} 0 0 1 ${r},${-r}Z`;
}

function circleToPath(circle: Element): string | null {
  const cx = parseFloat(circle.getAttribute('cx') || '0');
  const cy = parseFloat(circle.getAttribute('cy') || '0');
  const r = parseFloat(circle.getAttribute('r') || '0');

  if (r === 0) return null;

  return `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0`;
}

function ellipseToPath(ellipse: Element): string | null {
  const cx = parseFloat(ellipse.getAttribute('cx') || '0');
  const cy = parseFloat(ellipse.getAttribute('cy') || '0');
  const rx = parseFloat(ellipse.getAttribute('rx') || '0');
  const ry = parseFloat(ellipse.getAttribute('ry') || '0');

  if (rx === 0 || ry === 0) return null;

  return `M${cx - rx},${cy}a${rx},${ry} 0 1 0 ${2 * rx},0a${rx},${ry} 0 1 0 ${-2 * rx},0`;
}

function polygonToPath(polygon: Element): string | null {
  const points = polygon.getAttribute('points');
  if (!points) return null;

  const pairs = points.trim().split(/[\s,]+/);
  if (pairs.length < 4) return null;

  let d = `M${pairs[0]},${pairs[1]}`;
  for (let i = 2; i < pairs.length; i += 2) {
    d += `L${pairs[i]},${pairs[i + 1]}`;
  }
  return d + 'Z';
}

function polylineToPath(polyline: Element): string | null {
  const points = polyline.getAttribute('points');
  if (!points) return null;

  const pairs = points.trim().split(/[\s,]+/);
  if (pairs.length < 4) return null;

  let d = `M${pairs[0]},${pairs[1]}`;
  for (let i = 2; i < pairs.length; i += 2) {
    d += `L${pairs[i]},${pairs[i + 1]}`;
  }
  return d;
}

function lineToPath(line: Element): string | null {
  const x1 = parseFloat(line.getAttribute('x1') || '0');
  const y1 = parseFloat(line.getAttribute('y1') || '0');
  const x2 = parseFloat(line.getAttribute('x2') || '0');
  const y2 = parseFloat(line.getAttribute('y2') || '0');

  return `M${x1},${y1}L${x2},${y2}`;
}

function combineTransforms(parent: string, current: string): string {
  if (!parent && !current) return '';
  if (!parent) return current;
  if (!current) return parent;
  return `${parent} ${current}`;
}

function applyTransformToPath(d: string, transform: string): string {
  if (!transform) return d;

  try {
    const pathData = new SVGPathData(d);
    const matrix = parseTransformToMatrix(transform);

    return pathData.transform(matrix).encode();
  } catch {
    return d;
  }
}

function parseTransformToMatrix(transform: string): ReturnType<typeof SVGPathDataTransformer.MATRIX> {
  // Parse transform string into matrix
  let a = 1, b = 0, c = 0, d = 1, e = 0, f = 0;

  const transforms = transform.match(/(\w+)\(([^)]+)\)/g) || [];

  for (const t of transforms) {
    const match = t.match(/(\w+)\(([^)]+)\)/);
    if (!match) continue;

    const [, type, args] = match;
    const values = args.split(/[\s,]+/).map(Number);

    switch (type) {
      case 'translate':
        e += values[0] || 0;
        f += values[1] || 0;
        break;
      case 'scale': {
        const sx = values[0] || 1;
        const sy = values[1] ?? sx;
        a *= sx;
        d *= sy;
        break;
      }
      case 'rotate': {
        const angle = (values[0] || 0) * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newA = a * cos - c * sin;
        const newB = b * cos - d * sin;
        const newC = a * sin + c * cos;
        const newD = b * sin + d * cos;
        a = newA; b = newB; c = newC; d = newD;
        break;
      }
      case 'matrix':
        a = values[0] ?? 1;
        b = values[1] ?? 0;
        c = values[2] ?? 0;
        d = values[3] ?? 1;
        e = values[4] ?? 0;
        f = values[5] ?? 0;
        break;
    }
  }

  return SVGPathDataTransformer.MATRIX(a, b, c, d, e, f);
}

function calculateBounds(paths: ParsedPath[]): SVGBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const path of paths) {
    try {
      const pathData = new SVGPathData(path.d);
      const bounds = pathData.getBounds();

      minX = Math.min(minX, bounds.minX);
      minY = Math.min(minY, bounds.minY);
      maxX = Math.max(maxX, bounds.maxX);
      maxY = Math.max(maxY, bounds.maxY);
    } catch {
      // Skip paths we can't parse
    }
  }

  return {
    minX: isFinite(minX) ? minX : 0,
    minY: isFinite(minY) ? minY : 0,
    maxX: isFinite(maxX) ? maxX : 100,
    maxY: isFinite(maxY) ? maxY : 100,
    width: isFinite(maxX - minX) ? maxX - minX : 100,
    height: isFinite(maxY - minY) ? maxY - minY : 100,
  };
}
