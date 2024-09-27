"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Download, Sparkles, Rocket, Star } from "lucide-react";
import html2canvas from "html2canvas";
import zerotomaker from "@/app/public/assets/zerotomaker.png";
import tinkerhub from "@/app/public/assets/tinkerhub.png";
import backgroundImage from "@/app/public/assets/009807469799.jpg";
export default function Component() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Your Name";
  const croppedImageUrl =
    searchParams.get("croppedImageUrl") || "/placeholder.svg";
  const divRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.src = croppedImageUrl;
  }, [croppedImageUrl]);

  const handleDownload = async () => {
    if (divRef.current) {
      try {
        // Use html2canvas to capture the div
        const canvas = await html2canvas(divRef.current, {
          useCORS: true, // Allow cross-origin images
          scale: window.devicePixelRatio, // Ensure high-resolution output
          logging: true, // Enable logging for debugging
          backgroundColor: null, // Set background color to transparent if needed
        });

        const dataURL = canvas.toDataURL("image/png", 1.0); // Convert canvas to image

        // Create a link element for downloading the image
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${name}_card.png`; // Set the download file name

        // Append the link to the body (necessary for Firefox)
        document.body.appendChild(link);
        link.click(); // Trigger the download

        // Clean up by removing the link
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error capturing the canvas:", error);
      }
    } else {
      console.error("divRef.current is not defined.");
    }
  };
  const CardContent = () => (
    <div
      className="relative w-full h-full bg-yellow-100 shadow-lg overflow-hidden p-6"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <div className="relative flex flex-col items-center justify-between h-full bg-white bg-opacity-70 rounded-lg p-4">
        <div className="w-full flex justify-between items-center">
          <Image
            src={zerotomaker}
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
          <Sparkles className="text-yellow-500 w-12 h-12" />
          <Image
            src={tinkerhub}
            alt="Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <div className="my-6 relative">
          {imageLoaded && (
            <div className="rounded-full overflow-hidden border-4 border-yellow-300 shadow-lg">
              <Image
                src={croppedImageUrl}
                alt={name}
                width={192}
                height={192}
                className="object-cover"
              />
            </div>
          )}
          <Star className="absolute top-0 right-0 text-yellow-500 w-8 h-8 transform -translate-y-1/2 translate-x-1/2" />
        </div>
        <p className="text-center font-medium text-gray-800 mt-4 px-4 text-xl">
          Hello, I&apos;m <span className="font-bold">{name}</span> and I just
          Participated in
          <span className="text-blue-500 font-bold"> Zero to Maker</span> by
          Tinkerhub MBCCET 🚀
        </p>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <span className="text-2xl">🎉</span>
          <Rocket className="text-blue-500 w-6 h-6" />
          <span className="text-2xl">🌟</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4 gap-5">
        <div className="w-full max-w-2xl aspect-[4/3] mb-4">
          <div ref={divRef}>
            <CardContent />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-yellow-100 p-4 flex-col gap-4">
        <h3>
          Made with ❤️ by{" "}
          <a
            href="https://www.instagram.com/shinazbinshajahan/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shinaz Bin Shajahan
          </a>
        </h3>
      </div>
    </>
  );
}
