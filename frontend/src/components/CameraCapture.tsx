import React, { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CameraCapture = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // or 'user' for front cam
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // wait for metadata to load before playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.error("Play error:", err);
          });
        };
      }

      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Check permissions or device settings.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageData);
    stopCamera();
    onCapture(imageData);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto p-4 bg-blue-100 rounded-full w-fit">
          <Camera className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle>Camera Search</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Initial Button */}
        {!isCameraActive && !capturedImage && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Point your camera at any product to find similar items and get recommendations.
            </p>
            <Button
              onClick={startCamera}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          </div>
        )}

        {/* Live Camera Feed */}
        {isCameraActive && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              <Button
                onClick={stopCamera}
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button onClick={captureImage} className="flex-1">
                Capture Photo
              </Button>
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => onCapture(capturedImage)} className="flex-1">
                Search Products
              </Button>
              <Button onClick={retakePhoto} variant="outline" className="flex-1">
                Retake
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
