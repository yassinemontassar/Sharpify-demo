"use server";

import { ImageStats, ProcessedImage, Sharpify, WatermarkFont } from "sharpify";

export async function processImage(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const operations = formData.getAll("operations") as string[];
  const params = JSON.parse(formData.get("params") as string);

  let processedImage: ProcessedImage = await Sharpify.process(buffer, {});

  for (const operation of operations) {
    switch (operation) {
      case "resize":
        processedImage = await Sharpify.process(processedImage.data, {
          width: params.resize.width,
          height: params.resize.height,
        });
        break;
      case "crop":
        processedImage = await Sharpify.process(processedImage.data, {
          crop: params.crop,
        });
        break;
      case "rotate":
        processedImage = await Sharpify.process(processedImage.data, {
          rotate: params.rotate.angle,
        });
        break;
      case "grayscale":
        processedImage = await Sharpify.process(processedImage.data, {
          grayscale: true,
        });
        break;
      case "format":
        processedImage = await Sharpify.process(processedImage.data, {
          format: params.format.type,
          quality: params.format.quality,
        });
        break;
        case "watermark":
          processedImage = await Sharpify.process(processedImage.data, {
            watermark: {
              ...params.watermark,
              font: 'Arial' as WatermarkFont 
            }
          });
          break;
      case "enhance":
        processedImage = await Sharpify.process(processedImage.data, {
          brightness: params.enhance.brightness,
          contrast: params.enhance.contrast,
          saturation: params.enhance.saturation,
          sharpen: true,
        });
        break;
      case "blur":
        processedImage = await Sharpify.process(processedImage.data, {
          blur: params.blur.amount,
        });
        break;
      case "flip":
        processedImage = await Sharpify.process(processedImage.data, {
          flip: true,
        });
        break;
      case "flop":
        processedImage = await Sharpify.process(processedImage.data, {
          flop: true,
        });
        break;
    }
  }

  const stats = (await Sharpify.getStats(processedImage.data)) as ImageStats;
  const dominantColor = await Sharpify.getDominantColor(processedImage.data);

  return {
    image: `data:image/${
      processedImage.format
    };base64,${processedImage.data.toString("base64")}`,
    stats,
    dominantColor,
  };
}

export async function batchProcessImages(formData: FormData) {
  const files = formData.getAll("images") as Blob[];
  if (files.length === 0) {
    throw new Error("No files uploaded");
  }

  const operations = formData.getAll("operations") as string[];
  const params = JSON.parse(formData.get("params") as string);

  // Convert Blobs to Buffers
  const buffers = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    })
  );

  const processedImages = await Sharpify.batchProcess(buffers, {
    ...params.resize,
    ...params.format,
    watermark: params.watermark,
    enhance: params.enhance,
    blur: params.blur.amount,
    grayscale: operations.includes("grayscale"),
    flip: operations.includes("flip"),
    flop: operations.includes("flop"),
  });

  const stats = await Promise.all(
    processedImages.map((img) => Sharpify.getStats(img.data))
  );
  const dominantColors = await Promise.all(
    processedImages.map((img) => Sharpify.getDominantColor(img.data))
  );

  return {
    images: processedImages.map(
      (img) => `data:image/${img.format};base64,${img.data.toString("base64")}`
    ),
    stats,
    dominantColors,
  };
}
