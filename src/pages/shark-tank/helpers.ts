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

export function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

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
