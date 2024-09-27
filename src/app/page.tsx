"use client";
import React, { useState, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";

import zerotomaker from "@/app/public/assets/zerotomaker.png";
import { useRouter } from "next/navigation";

export default function FancyInputForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "crop" | "preview">("input");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          const croppedImageUrl = URL.createObjectURL(blob);
          resolve(croppedImageUrl);
        }, "image/jpeg");
      });
    },
    []
  );

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  const handleProceed = useCallback(async () => {
    if (step === "input" && name && image) {
      setStep("crop");
    } else if (step === "crop" && completedCrop) {
      try {
        const sourceImage = document.getElementById(
          "source-image"
        ) as HTMLImageElement;
        if (sourceImage) {
          const croppedImage = await getCroppedImg(sourceImage, completedCrop);
          setCroppedImageUrl(croppedImage);
          setStep("preview");
        }
      } catch (e) {
        console.error("Error cropping image:", e);
      }
    }
  }, [step, name, image, completedCrop, getCroppedImg]);

  const handleFinalProceed = useCallback(() => {
    console.log("Proceeding with:", { name, croppedImageUrl });
    router.push(
      `/result?name=${encodeURIComponent(
        name || ""
      )}&croppedImageUrl=${encodeURIComponent(croppedImageUrl || "")}`
    );
  }, [name, croppedImageUrl, router]);
  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-yellow-300 border-double max-w-md w-full">
        <Image
          src={zerotomaker}
          alt="Zero to Maker"
          width={5000}
          height={5000}
          className="w-full h-auto"
        />

        {step === "input" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 text-black"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-black
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-50 file:text-yellow-700
                  hover:file:bg-yellow-100"
              />
            </div>
          </>
        )}

        {step === "crop" && image && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-gray-600">
              Drag the corners to adjust the crop area. The image will be
              cropped to a square.
            </p>
            <ReactCrop
              // src={image}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
              aspect={1}
              circularCrop
            >
              <Image
                src={image}
                id="source-image"
                alt="Source"
                width={500}
                height={500}
                unoptimized={true}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </ReactCrop>
          </div>
        )}

        {step === "preview" && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Preview</h2>
            <p className="mb-2 text-black font-bold">Name: {name}</p>
            {croppedImageUrl && (
              <Image
                src={croppedImageUrl}
                alt="Cropped"
                width={256}
                height={256}
                className="object-cover rounded-lg mx-auto mb-4"
              />
            )}
            <button
              onClick={handleFinalProceed}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Proceed
            </button>
          </div>
        )}

        {step !== "preview" && (
          <button
            onClick={handleProceed}
            className="mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            disabled={!name || !image || (step === "crop" && !completedCrop)}
          >
            {step === "input" ? "Proceed to Crop" : "Finish Cropping"}
          </button>
        )}
      </div>
    </div>
  );
}
