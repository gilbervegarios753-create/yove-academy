import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { randomUUID } from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'media');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.ps1', '.sh', '.bash', '.vbs', '.js', '.ts', '.py',
  '.php', '.pl', '.cgi', '.msi', '.com', '.scr', '.pif', '.application', '.gadget',
  '.wsf', '.wsh', '.jar'
];

export interface SaveMediaInput {
  name: string;
  originalName: string;
  fileType: 'PDF' | 'IMAGE' | 'PRESENTATION' | 'DOCUMENT' | 'VIDEO' | 'OTHER';
  mimeType: string;
  buffer?: Buffer;
  base64Data?: string;
  externalUrl?: string;
  author?: string;
  sourceType?: string;
  sourceName?: string;
  license?: string;
  notes?: string;
  uploadedBy?: string;
}

export class MediaStorageService {
  /**
   * Validate file safety by checking extension and MIME type
   */
  static validateFileSafety(filename: string, mimeType: string): { valid: boolean; reason?: string } {
    const ext = path.extname(filename).toLowerCase();
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
      return { valid: false, reason: `Archivos ejecutables o scripts (${ext}) están estrictamente prohibidos.` };
    }
    if (mimeType.includes('executable') || mimeType.includes('script') || mimeType.includes('x-sh')) {
      return { valid: false, reason: 'Tipo MIME no seguro detectado.' };
    }
    return { valid: true };
  }

  /**
   * Save a media file locally or register external media
   */
  static async saveMedia(input: SaveMediaInput) {
    const { valid, reason } = this.validateFileSafety(input.originalName || input.name, input.mimeType || '');
    if (!valid) {
      throw new Error(reason);
    }

    const id = `med-${randomUUID()}`;
    let fileUrl = input.externalUrl || '';
    let sizeBytes = 0;

    if (input.buffer || input.base64Data) {
      let fileBuffer: Buffer;
      if (input.buffer) {
        fileBuffer = input.buffer;
      } else {
        const base64Clean = input.base64Data!.replace(/^data:.*?;base64,/, '');
        fileBuffer = Buffer.from(base64Clean, 'base64');
      }

      sizeBytes = fileBuffer.length;
      const ext = path.extname(input.originalName) || (input.fileType === 'PDF' ? '.pdf' : '.png');
      const safeFilename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
      const targetPath = path.join(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(targetPath, fileBuffer);
      fileUrl = `/uploads/media/${safeFilename}`;
    }

    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO media_library (id, name, originalName, fileType, mimeType, sizeBytes, url, author, sourceType, sourceName, license, notes, uploadedBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      input.name,
      input.originalName || input.name,
      input.fileType,
      input.mimeType || 'application/octet-stream',
      sizeBytes,
      fileUrl,
      input.author || 'YOVE Academy Studio',
      input.sourceType || 'YOVE_ORIGINAL',
      input.sourceName || 'YOVE Content Studio',
      input.license || 'Proprietary Educational License',
      input.notes || '',
      input.uploadedBy || 'usr_superadmin',
      createdAt
    );

    return this.getMediaById(id);
  }

  static getMediaById(id: string) {
    return db.prepare('SELECT * FROM media_library WHERE id = ?').get(id);
  }

  static listMedia(filter?: { fileType?: string; search?: string }) {
    let sql = 'SELECT * FROM media_library WHERE 1=1';
    const params: any[] = [];

    if (filter?.fileType && filter.fileType !== 'ALL') {
      sql += ' AND fileType = ?';
      params.push(filter.fileType);
    }

    if (filter?.search) {
      sql += ' AND (name LIKE ? OR originalName LIKE ? OR notes LIKE ?)';
      const query = `%${filter.search}%`;
      params.push(query, query, query);
    }

    sql += ' ORDER BY createdAt DESC';
    return db.prepare(sql).all(...params);
  }

  static deleteMedia(id: string) {
    const item: any = this.getMediaById(id);
    if (item && item.url && item.url.startsWith('/uploads/media/')) {
      const filename = path.basename(item.url);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Error deleting physical file:", e);
        }
      }
    }
    db.prepare('DELETE FROM media_library WHERE id = ?').run(id);
    return { success: true };
  }
}
