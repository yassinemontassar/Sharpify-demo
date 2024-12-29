"use client";

import { batchProcessImages, processImage } from "@/actions/processImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ImageStats } from "sharpify";

export default function ImageProcessor() {
  const [images, setImages] = useState<string[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [stats, setStats] = useState<ImageStats[]>([]);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [operations, setOperations] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [operationParams, setOperationParams] = useState({
    resize: { width: 800, height: 600 },
    crop: { left: 0, top: 0, width: 500, height: 500 },
    rotate: { angle: 90 },
    watermark: {
      text: "© 2024 Sharpify",
      position: "bottom-right",
      size: 80,
      color: "white",
      opacity: 0.8,
    },
    enhance: { brightness: 1.2, contrast: 1.1, saturation: 1.3 },
    blur: { amount: 5 },
    format: { type: "webp", quality: 80 },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setImages((prev) => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;

    setIsProcessing(true);
    try {
      if (isBatchProcessing) {
        const formData = new FormData();

        // Convert data URLs to Blobs and append to FormData
        await Promise.all(
          images.map(async (imageDataUrl, index) => {
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            formData.append("images", blob, `image-${index}.jpg`);
          })
        );

        operations.forEach((op) => formData.append("operations", op));
        formData.append("params", JSON.stringify(operationParams));

        const result = await batchProcessImages(formData);
        setProcessedImages(result.images);
        setStats(result.stats);
        setDominantColors(result.dominantColors);
      } else {
        const formData = new FormData();
        const response = await fetch(images[0]);
        const blob = await response.blob();
        formData.append("image", blob, "image.jpg");
        operations.forEach((op) => formData.append("operations", op));
        formData.append("params", JSON.stringify(operationParams));

        const result = await processImage(formData);
        setProcessedImages([result.image]);
        setStats([result.stats as ImageStats]);
        setDominantColors([result.dominantColor]);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      // You might want to add error handling UI here
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleOperation = (operation: string) => {
    setOperations((prev) =>
      prev.includes(operation)
        ? prev.filter((op) => op !== operation)
        : [...prev, operation]
    );
  };

  const updateOperationParam = (
    operation: string,
    param: string,
    value: number | string | boolean
  ) => {
    setOperationParams((prev) => ({
      ...prev,
      [operation]: {
        ...prev[operation as keyof typeof operationParams],
        [param]: value,
      },
    }));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <label htmlFor="image-upload" className="block">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or WebP (Multiple files allowed)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  multiple
                />
              </label>
            </div>
          </label>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <Tabs defaultValue="original" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger
              value="processed"
              disabled={processedImages.length === 0}>
              Processed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="original">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-full h-[200px]">
                      <Image
                        src={image}
                        alt={`Original ${index + 1}`}
                        fill
                        style={{ objectFit: "contain" }} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="processed">
  <Card>
    <CardContent className="p-6">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {processedImages.map((image, index) => (
    <div key={index} className="flex flex-col items-center">
      <div className="relative w-full h-[200px]">
        <Image
          src={image}
          alt={`Processed ${index + 1}`}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <a
        href={image}
        download={`processed-image-${index + 1}.jpg`}
        className="mt-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 flex items-center justify-center"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  ))}
</div>

    </CardContent>
  </Card>
</TabsContent>
        </Tabs>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <Checkbox
                id="batch-processing"
                checked={isBatchProcessing}
                onCheckedChange={(checked) =>
                  setIsBatchProcessing(checked as boolean)
                }
              />
              <Label htmlFor="batch-processing">Enable Batch Processing</Label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                "resize",
                "crop",
                "rotate",
                "grayscale",
                "format",
                "watermark",
                "enhance",
                "blur",
                "flip",
                "flop",
              ].map((op) => (
                <div key={op} className="flex items-center space-x-2">
                  <Checkbox
                    id={op}
                    checked={operations.includes(op)}
                    onCheckedChange={() => toggleOperation(op)}
                  />
                  <Label htmlFor={op} className="capitalize">
                    {op}
                  </Label>
                </div>
              ))}
            </div>

            {operations.includes("resize") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resize-width">Width</Label>
                  <Input
                    id="resize-width"
                    type="number"
                    value={operationParams.resize.width}
                    onChange={(e) =>
                      updateOperationParam(
                        "resize",
                        "width",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="resize-height">Height</Label>
                  <Input
                    id="resize-height"
                    type="number"
                    value={operationParams.resize.height}
                    onChange={(e) =>
                      updateOperationParam(
                        "resize",
                        "height",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            )}

            {operations.includes("crop") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crop-left">Left</Label>
                  <Input
                    id="crop-left"
                    type="number"
                    value={operationParams.crop.left}
                    onChange={(e) =>
                      updateOperationParam(
                        "crop",
                        "left",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="crop-top">Top</Label>
                  <Input
                    id="crop-top"
                    type="number"
                    value={operationParams.crop.top}
                    onChange={(e) =>
                      updateOperationParam(
                        "crop",
                        "top",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="crop-width">Width</Label>
                  <Input
                    id="crop-width"
                    type="number"
                    value={operationParams.crop.width}
                    onChange={(e) =>
                      updateOperationParam(
                        "crop",
                        "width",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="crop-height">Height</Label>
                  <Input
                    id="crop-height"
                    type="number"
                    value={operationParams.crop.height}
                    onChange={(e) =>
                      updateOperationParam(
                        "crop",
                        "height",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            )}

            {operations.includes("rotate") && (
              <div>
                <Label htmlFor="rotate-angle">Rotation Angle</Label>
                <Input
                  id="rotate-angle"
                  type="number"
                  value={operationParams.rotate.angle}
                  onChange={(e) =>
                    updateOperationParam(
                      "rotate",
                      "angle",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            )}

            {operations.includes("format") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="format-type">Format</Label>
                  <Select
                    value={operationParams.format.type}
                    onValueChange={(value) =>
                      updateOperationParam("format", "type", value)
                    }>
                    <SelectTrigger id="format-type">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format-quality">Quality</Label>
                  <Input
                    id="format-quality"
                    type="number"
                    min="1"
                    max="100"
                    value={operationParams.format.quality}
                    onChange={(e) =>
                      updateOperationParam(
                        "format",
                        "quality",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            )}

            {operations.includes("watermark") && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="watermark-text">Watermark Text</Label>
                  <Input
                    id="watermark-text"
                    value={operationParams.watermark.text}
                    onChange={(e) =>
                      updateOperationParam("watermark", "text", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="watermark-position">Position</Label>
                  <Select
                    value={operationParams.watermark.position}
                    onValueChange={(value) =>
                      updateOperationParam("watermark", "position", value)
                    }>
                    <SelectTrigger id="watermark-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="watermark-size">Size</Label>
                  <Input
                    id="watermark-size"
                    type="number"
                    value={operationParams.watermark.size}
                    onChange={(e) =>
                      updateOperationParam(
                        "watermark",
                        "size",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="watermark-color">Color</Label>
                  <Input
                    id="watermark-color"
                    type="color"
                    value={operationParams.watermark.color}
                    onChange={(e) =>
                      updateOperationParam("watermark", "color", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="watermark-opacity">Opacity</Label>
                  <Input
                    id="watermark-opacity"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={operationParams.watermark.opacity}
                    onChange={(e) =>
                      updateOperationParam(
                        "watermark",
                        "opacity",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            )}

            {operations.includes("enhance") && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="enhance-brightness">Brightness</Label>
                  <Input
                    id="enhance-brightness"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={operationParams.enhance.brightness}
                    onChange={(e) =>
                      updateOperationParam(
                        "enhance",
                        "brightness",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="enhance-contrast">Contrast</Label>
                  <Input
                    id="enhance-contrast"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={operationParams.enhance.contrast}
                    onChange={(e) =>
                      updateOperationParam(
                        "enhance",
                        "contrast",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="enhance-saturation">Saturation</Label>
                  <Input
                    id="enhance-saturation"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={operationParams.enhance.saturation}
                    onChange={(e) =>
                      updateOperationParam(
                        "enhance",
                        "saturation",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            )}

            {operations.includes("blur") && (
              <div>
                <Label htmlFor="blur-amount">Blur Amount</Label>
                <Input
                  id="blur-amount"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={operationParams.blur.amount}
                  onChange={(e) =>
                    updateOperationParam(
                      "blur",
                      "amount",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                images.length === 0 || operations.length === 0 || isProcessing
              }>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isBatchProcessing ? (
                "Batch Process Images"
              ) : (
                "Process Image"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {stats.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Image Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium">Image {index + 1}</p>
                  {Object.entries(stat).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium capitalize">{key}: </span>
                      <span className="text-gray-600">
                        {JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {dominantColors.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dominant Colors</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {dominantColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-medium">
                    Image {index + 1}: {color}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
