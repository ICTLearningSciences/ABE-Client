/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import {
  Engine,
  LanguageCode,
  PollyClient,
  SynthesizeSpeechCommand,
  VoiceId,
} from "@aws-sdk/client-polly";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"; // ES Modules import

export const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESSKEY || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRETACCESSKEY || "",
  },
});

export const pollyClient = new PollyClient({
  region: import.meta.env.VITE_AWS_S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESSKEY || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRETACCESSKEY || "",
  },
});

export async function getPollyTTS(args: {
  text: string;
  voice?: string;
  engine?: string;
  language?: string;
}) {
  let text = args.text;
  if (!text.startsWith("<speak>") && !text.endsWith("</speak>")) {
    text = `<speak>${text}</speak>`;
  }
  const command = new SynthesizeSpeechCommand({
    Text: text,
    Engine: (args.engine || "long-form") as Engine,
    VoiceId: (args.voice || "Danielle") as VoiceId,
    LanguageCode: (args.language || "en-US") as LanguageCode,
    TextType: "ssml",
    OutputFormat: "mp3",
  });
  const response = await pollyClient.send(command);
  return response.AudioStream?.transformToWebStream();
}

export function getPollyVoiceOptions(engine: string): string[] {
  if (engine === "generative") {
    return ["Danielle", "Joanna", "Ruth", "Salli", "Matthew", "Stephen"];
  } else if (engine === "long-form") {
    return ["Danielle", "Ruth", "Gregory", "Patrick"];
  } else if (engine === "neural") {
    return [
      "Danielle",
      "Joanna",
      "Ruth",
      "Salli",
      "Kimberly",
      "Kendra",
      "Ivy",
      "Gregory",
      "Kevin",
      "Matthew",
      "Justin",
      "Joey",
      "Stephen",
    ];
  } else if (engine === "standard") {
    return [
      "Joanna",
      "Salli",
      "Kimberly",
      "Kendra",
      "Ivy",
      "Matthew",
      "Justin",
      "Joey",
    ];
  }
  return [];
}

export async function getRagStore() {
  const command = new ListObjectsCommand({
    Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
  });
  try {
    const response = await s3Client.send(command);
    return response.Contents;
  } catch (err) {
    console.error(err);
  }
}

export async function uploadRagFile(file: File, name?: string) {
  const filename = (name || file.name).replaceAll(" ", "_");
  const ext = filename.split(".").pop();
  const contentType = getMimeTypeFromExtension(ext);
  const command = new PutObjectCommand({
    Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
    Key: filename,
    ContentType: contentType,
    Body: file,
  });
  const response = await s3Client.send(command);
  return response;
}

export function getFileName(url: string): string {
  return url.substring(url.lastIndexOf("/") + 1);
}

export function getMimeTypeFromExtension(extension = "txt"): string {
  if (extension.startsWith("http")) {
    extension = getFileName(extension).split(".")[1];
  }
  if (extension && extension[0] === ".") {
    extension = extension.substr(1);
  }
  return (
    {
      aac: "audio/aac",
      abw: "application/x-abiword",
      arc: "application/x-freearc",
      avi: "video/x-msvideo",
      azw: "application/vnd.amazon.ebook",
      bin: "application/octet-stream",
      bmp: "image/bmp",
      bz: "application/x-bzip",
      bz2: "application/x-bzip2",
      cda: "application/x-cdf",
      csh: "application/x-csh",
      css: "text/css",
      csv: "text/csv",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      eot: "application/vnd.ms-fontobject",
      epub: "application/epub+zip",
      gz: "application/gzip",
      gif: "image/gif",
      htm: "text/html",
      html: "text/html",
      ico: "image/vnd.microsoft.icon",
      ics: "text/calendar",
      jar: "application/java-archive",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      js: "text/javascript",
      json: "application/json",
      jsonld: "application/ld+json",
      mid: "audio/midi audio/x-midi",
      midi: "audio/midi audio/x-midi",
      mjs: "text/javascript",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      mpeg: "video/mpeg",
      mpkg: "application/vnd.apple.installer+xml",
      odp: "application/vnd.oasis.opendocument.presentation",
      ods: "application/vnd.oasis.opendocument.spreadsheet",
      odt: "application/vnd.oasis.opendocument.text",
      oga: "audio/ogg",
      ogv: "video/ogg",
      ogx: "application/ogg",
      opus: "audio/opus",
      otf: "font/otf",
      png: "image/png",
      pdf: "application/pdf",
      php: "application/x-httpd-php",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      rar: "application/vnd.rar",
      rtf: "application/rtf",
      sh: "application/x-sh",
      svg: "image/svg+xml",
      swf: "application/x-shockwave-flash",
      tar: "application/x-tar",
      tif: "image/tiff",
      tiff: "image/tiff",
      ts: "video/mp2t",
      ttf: "font/ttf",
      txt: "text/plain",
      vsd: "application/vnd.visio",
      vtt: "text/vtt",
      wav: "audio/wav",
      weba: "audio/webm",
      webm: "video/webm",
      webp: "image/webp",
      woff: "font/woff",
      woff2: "font/woff2",
      xhtml: "application/xhtml+xml",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xml: "application/xml",
      xul: "application/vnd.mozilla.xul+xml",
      zip: "application/zip",
      "3gp": "video/3gpp",
      "3g2": "video/3gpp2",
      "7z": "application/x-7z-compressed",
    }[extension] || "application/octet-stream"
  );
}
