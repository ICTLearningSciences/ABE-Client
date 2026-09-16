/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import axios from "axios";
import { ACCESS_TOKEN_KEY, localStorageGet } from "../store/local-storage";

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

/** S3 */

export interface S3File {
  Key: string;
  LastModified: string;
}
export async function getRagStore(): Promise<S3File[]> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || "";
  const url = import.meta.env.VITE_ABE_API_ENDPOINT || "/graphql";
  const data = await axios.get(`${url}/s3list`, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });
  return data.data.Contents;
}

export async function uploadRagFile(file: File, name?: string): Promise<void> {
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || "";
  const url = import.meta.env.VITE_ABE_API_ENDPOINT || "/graphql";
  const filename = (name || file.name).replaceAll(" ", "");
  const ext = filename.split(".").pop();
  const mimetype = getMimeTypeFromExtension(ext);
  const data = await axios.post(
    `${url}/s3upload`,
    { Key: filename, ContentType: mimetype },
    {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    },
  );
  const presignedPostData = data.data;
  const formData = new FormData();
  Object.entries(presignedPostData.fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);
  const response = await fetch(presignedPostData.url, {
    method: "POST",
    body: formData,
  });
  console.warn(response);
}

/** Polly */

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

export async function getPollyTTS(args: {
  text: string;
  voice?: string;
  engine?: string;
  language?: string;
}): Promise<HTMLAudioElement> {
  let text = args.text;
  if (!text.startsWith("<speak>") && !text.endsWith("</speak>")) {
    text = `<speak>${text}</speak>`;
  }
  const accessToken = localStorageGet(ACCESS_TOKEN_KEY) || "";
  const apiUrl = import.meta.env.VITE_ABE_API_ENDPOINT || "/graphql";
  const data = await axios.post(
    `${apiUrl}/polly`,
    {
      Text: text,
      Engine: args.engine || "long-form",
      VoiceId: args.voice || "Danielle",
      LanguageCode: args.language || "en-US",
      TextType: "ssml",
      OutputFormat: "mp3",
    },
    {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    },
  );
  const stream = data.data.AudioStream;
  const uInt8Array = new Uint8Array(stream.data);
  const blob = new Blob([uInt8Array.buffer], { type: "audio/mp3" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio();
  audio.src = url;
  return audio;
}
