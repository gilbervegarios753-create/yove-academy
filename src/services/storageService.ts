/**
 * Storage Abstraction for Media, Videos, Documents and Certificates
 */

export class StorageService {
  public static getCertificatePdfUrl(certificateCode: string): string {
    return `/certificates/${certificateCode}.pdf`;
  }

  public static getLessonAssetUrl(assetPath: string): string {
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
      return assetPath;
    }
    return `/assets/${assetPath}`;
  }
}
