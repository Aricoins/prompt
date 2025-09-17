import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBj-Fjmol_jKmnVwBi4WPdpl7J6UdGFpKE" });

// Storyboard-based prompt
const prompt = `
Escena 1: Panorámica de una ciudad europea del siglo XIV, calles desiertas, figuras encapuchadas. Hojas de eucalipto, romero, limón, clavo y canela girando.
Escena 2: Transición a un cuenco moderno con los mismos ingredientes frescos en un entorno natural.
Escena 3: Un taller artesanal en Bariloche, llenando botellas de vidrio ámbar con paisajes de lagos y montañas de fondo.
Escena 4: La botella de Bruma Thiev en primer plano sobre una mesa de madera con un atardecer patagónico de fondo.
`;

// Step 1: Load the local image.
const imagePath = "bruma thievs.webp";
const imageBytes = fs.readFileSync(imagePath).toString("base64");

// Step 2: Generate video with Veo 3 using the local image.
let operation = await ai.models.generateVideos({
  model: "veo-3.0-generate-001",
  prompt: prompt,
  image: {
    imageBytes: imageBytes,
    mimeType: "image/webp",
  },
});

// Poll the operation status until the video is ready.
while (!operation.done) {
  console.log("Waiting for video generation to complete...");
  await new Promise((resolve) => setTimeout(resolve, 10000));
  operation = await ai.operations.getVideosOperation({
    operation: operation,
  });
}

// Download the video.
ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: "bruma_thiev_video.mp4",
});
console.log(`Generated video saved to bruma_thiev_video.mp4`);