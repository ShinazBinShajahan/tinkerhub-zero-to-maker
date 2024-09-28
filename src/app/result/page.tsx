"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Rocket, Star, Copy, Check } from "lucide-react";
import zerotomaker from "@/app/public/assets/zerotomaker.png";
import tinkerhub from "@/app/public/assets/tinkerhub.png";
import backgroundImage from "@/app/public/assets/009807469799.jpg";
import { Suspense } from "react";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";

function Component() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Your Name";
  const croppedImageUrl =
    searchParams.get("croppedImageUrl") || "/placeholder.svg";
  const divRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.src = croppedImageUrl;
  }, [croppedImageUrl]);

  const CardContent = () => (
    <div
      className="relative w-full h-full bg-yellow-100 shadow-lg overflow-hidden p-6"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <div className="relative flex flex-col items-center justify-between h-full bg-white bg-opacity-70 rounded-lg p-4">
        <div className="w-full flex justify-between items-center">
          <div className="w-20 h-20 relative">
            <Image
              src={zerotomaker}
              alt="Zero to Maker Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <Sparkles className="text-yellow-500 w-12 h-12" />
          <div className="w-16 h-16 relative">
            <Image
              src={tinkerhub}
              alt="Tinkerhub Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
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
          Hello, I&apos;m <span className="font-bold">{name}</span>😉 and I just
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

  const longParagraph = `🌟 Exciting Day at Zero To Maker 🌟

  Today, I had the opportunity to attend an insightful session hosted by Tinkerhub MBCCET, titled "Zero To Maker" at Mar Baselios Christian College of Engineering & Technology. The talk emphasized the power of community and networking in shaping us into better makers. It was truly eye-opening to learn how to leverage the Tinkerhub platform to unlock new opportunities and grow through collaboration!
  
  A big thank you to all the speakers and organizers for making this an inspiring session. Looking forward to applying these insights and diving deeper into the world of innovation!
  @TinkerhubMBCCET
  #TinkerHub #ZeroToMaker #Networking #Innovation #CommunityBuilding #Makers`;
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // For modern browsers
        await navigator.clipboard.writeText(longParagraph);
      } else {
        // Fallback for older browsers and non-HTTPS environments
        const textArea = document.createElement("textarea");
        textArea.value = longParagraph;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      toast({
        title: "Content copied!",
        description: "The paragraph has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Unable to copy the content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="w-full aspect-[4/3] mb-4">
            <div ref={divRef}>
              <CardContent />
            </div>
          </div>
          <div
            className="w-full bg-white rounded-lg shadow-md p-6 mt-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={handleCopy}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
              Click to copy contents
              {isCopied ? (
                <Check className="text-green-500" />
              ) : (
                <Copy className="text-gray-500" />
              )}
            </h3>
            <p className="text-gray-700 text-sm">{longParagraph}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-yellow-100 p-4 flex-col gap-4">
        <h3>
          Made with ❤️ by{" "}
          <span className="text-blue-500">
            <a
              href="https://www.instagram.com/shinazbinshajahan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shinaz Bin Shajahan😉{" "}
            </a>
          </span>
        </h3>
      </div>
      <Toaster />
    </>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
