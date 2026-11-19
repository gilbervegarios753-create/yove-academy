/**
 * YOVE ACADEMY - CDN & OBJECT STORAGE ENGINE
 * Decouples media serving from application servers.
 * Generates signed URLs and HLS/DASH manifest references for global CDN distribution.
 */

import crypto from "crypto";
import { INFRASTRUCTURE_CONFIG } from "./config";

export interface MediaAssetMetadata {
  assetId: string;
  type: 'video_hls' | 'video_mp4' | 'pdf_workbook' | 'certificate_pdf' | 'lab_model_3d';
  path: string;
  qualityVariants?: string[];
  bitrateKbps?: number;
}

export class CdnStorageEngine {
  private cdnBaseUrl: string;
  private storageBucket: string;
  private secretKey: string;

  constructor() {
    this.cdnBaseUrl = INFRASTRUCTURE_CONFIG.cdnDomain;
    this.storageBucket = INFRASTRUCTURE_CONFIG.objectStorageBucket;
    if (process.env.CDN_SIGNING_SECRET) {
      this.secretKey = process.env.CDN_SIGNING_SECRET;
    } else {
      console.warn("[CDN Security Warning] CDN_SIGNING_SECRET no definida en .env. Generando clave criptográfica dinámica por sesión de servidor.");
      this.secretKey = crypto.createHash("sha256").update(`yove_boot_seed_${process.uptime()}_${Date.now()}`).digest("hex");
    }
  }

  /**
   * Generates a time-limited, signed CDN URL for heavy assets (videos, PDFs, certificates).
   */
  public generateSignedUrl(
    assetPath: string,
    expiresInSeconds: number = INFRASTRUCTURE_CONFIG.signedUrlExpirationSeconds,
    clientIp?: string
  ): { url: string; expiresAt: string; cdnEdge: string } {
    const cleanPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
    const expiresTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    
    // Hash signature payload (Path + Expiry + Secret + IP)
    const payload = `${cleanPath}:${expiresTimestamp}:${clientIp || 'global'}`;
    const signature = crypto
      .createHmac("sha256", this.secretKey)
      .update(payload)
      .digest("hex")
      .substring(0, 32);

    const signedUrl = `${this.cdnBaseUrl}${cleanPath}?exp=${expiresTimestamp}&sig=${signature}`;
    
    // Random edge location selection simulation for CDN distribution
    const edges = ["lim-edge-01", "mia-edge-04", "bog-edge-02", "scl-edge-03", "sao-edge-05"];
    const selectedEdge = edges[Math.floor(Math.random() * edges.length)];

    return {
      url: signedUrl,
      expiresAt: new Date(expiresTimestamp * 1000).toISOString(),
      cdnEdge: selectedEdge,
    };
  }

  /**
   * Generates adaptive HLS (.m3u8) video streaming URLs for high quality video playback without server lag.
   */
  public getHlsStreamInfo(courseId: string, lessonId: string) {
    const basePath = `/streams/courses/${courseId}/lessons/${lessonId}`;
    const masterManifest = `${basePath}/master.m3u8`;
    
    const signedMaster = this.generateSignedUrl(masterManifest, 7200);

    return {
      courseId,
      lessonId,
      masterManifestUrl: signedMaster.url,
      expiresAt: signedMaster.expiresAt,
      cdnProvider: "Cloudflare Stream / AWS CloudFront Multi-Region CDN",
      adaptiveQualities: [
        { resolution: "1080p (FHD)", bitrate: "4500 kbps", manifest: `${basePath}/1080p.m3u8` },
        { resolution: "720p (HD)", bitrate: "2200 kbps", manifest: `${basePath}/720p.m3u8` },
        { resolution: "480p (SD)", bitrate: "900 kbps", manifest: `${basePath}/480p.m3u8` },
        { resolution: "360p (Low Data)", bitrate: "450 kbps", manifest: `${basePath}/360p.m3u8` },
      ],
      edgeServer: signedMaster.cdnEdge,
    };
  }

  /**
   * Directly uploads certificate or media asset to Object Storage via Presigned PUT URL.
   */
  public generateUploadPresignedUrl(fileName: string, mimeType: string) {
    const objectKey = `uploads/${Date.now()}_${crypto.randomBytes(4).toString("hex")}_${fileName}`;
    const signedPut = this.generateSignedUrl(`/${objectKey}`, 1800);

    return {
      objectKey,
      uploadUrl: signedPut.url,
      bucket: this.storageBucket,
      headers: {
        "Content-Type": mimeType,
        "x-amz-acl": "public-read",
      },
      expiresInMinutes: 30,
    };
  }
}

export const cdnStorageEngine = new CdnStorageEngine();
