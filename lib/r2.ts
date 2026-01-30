import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

function getR2Client(): S3Client {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY must be set",
    );
  }
  const endpoint = `https://${accountId}.eu.r2.cloudflarestorage.com`;

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export type UploadResult = { key: string };

/**
 * Upload un fichier vers R2. Retourne la clé (stockée en DB).
 * L'affichage se fait via une URL signée (getSignedUrlForDownload).
 */
export async function uploadToR2(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string,
): Promise<UploadResult> {
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME must be set");
  }
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    }),
  );
  return { key };
}

/**
 * Génère une URL signée pour télécharger / afficher un objet (ex. logo).
 * Valide 1 h. Pas besoin d'accès public au bucket.
 */
export async function getSignedUrlForDownload(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME must be set");
  }
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

/**
 * Génère une clé unique pour un logo (ex: brand-logos/{userId}/{timestamp}-{slug}.ext).
 */
export function brandLogoKey(userId: string, filename: string): string {
  const ext = filename.replace(/^.*\./, "") || "png";
  const slug = filename.replace(/\.[^.]+$/, "").replace(/\W+/g, "-") || "logo";
  return `brand-logos/${userId}/${Date.now()}-${slug}.${ext}`;
}
