"use server";

import { ImageStats, ProcessedImage, Sharpify } from "sharpify";

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
          watermark: params.watermark,
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
      case "avatar": 
        processedImage = await Sharpify.createAvatar(processedImage.data, {
          size: params.avatar.size,
        });
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

  const batchProcessingOptions = {
    ...params.format,
  
  };

  if (operations.includes("watermark")) {
    batchProcessingOptions.watermark = params.watermark;
  }

  if (operations.includes("resize")) {
    batchProcessingOptions.resize = params.resize;
  }

  if (operations.includes("flip")) {
    batchProcessingOptions.flip = params.flip;
  }
  
  if (operations.includes("enhance")) {
    batchProcessingOptions.enhance = params.enhance;
  }

  if (operations.includes("blur")) {
    batchProcessingOptions.blur = params.blur.amount;
  }
  
  if (operations.includes("crop")) {
    batchProcessingOptions.crop = params.crop;
  }


console.log(batchProcessingOptions)
  const processedImages = await Sharpify.batchProcess(buffers, batchProcessingOptions);

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
