import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function extensionFor(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  const { v2: cloudinary } = await import("cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "semana-da-violencia-politica" },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Falha ao enviar imagem para o Cloudinary."));
            return;
          }
          resolve(uploadResult as { secure_url: string });
        }
      )
      .end(buffer);
  });

  return result.secure_url;
}

async function uploadToLocalDisk(buffer: Buffer, mimeType: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${randomUUID()}.${extensionFor(mimeType)}`;
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export class ImageUploadError extends Error {}

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageUploadError("Formato de imagem não suportado. Use JPG, PNG, WEBP ou GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new ImageUploadError("A imagem deve ter no máximo 5MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (cloudinaryConfigured()) {
    return uploadToCloudinary(buffer);
  }

  // Alternativa local usada apenas em desenvolvimento, quando as credenciais
  // do Cloudinary não estão configuradas. Não funciona em produção na Vercel.
  return uploadToLocalDisk(buffer, file.type);
}
