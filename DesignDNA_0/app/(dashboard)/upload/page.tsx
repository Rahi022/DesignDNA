"use client";

import Image from "next/image";
import {ChangeEvent,useEffect,useState } from "react";
import { analyzeImage } from "../../services/api";
import { AnalysisResponse } from "../../types/analysis";
import MetricCard from "../../components/MetricCard";
import InfoCard from "../../components/InfoCard";
import ScoreCard from "../../components/ScoreCard";
import ColorPalette from "../../components/ColorPalette";
import FeedbackCard from "../../components/FeedbackCard";
import UploadHeader from "../../components/UploadHeader";
import Navbar from "../../components/Navbar";
import AuthGuard from "../../guards/AuthGuard";

/* =========================================================
  COMPONENT
========================================================= */

export default function UploadPage() {

  const [error, setError] =
    useState("");

  /* =====================================================
      IMAGE
  ===================================================== */
  
  const [image, setImage] =
    useState<string | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [fileName, setFileName] =
    useState("");

  const [fileSize, setFileSize] =
    useState("");

  /* =====================================================
      LOADING
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  /* =====================================================
      IMAGE INFORMATION
  ===================================================== */

  const [width, setWidth] =
    useState<number | null>(null);

  const [height, setHeight] =
    useState<number | null>(null);

  const [pixels, setPixels] =
    useState<number | null>(null);

  /* =====================================================
      ANALYSIS
  ===================================================== */

  const [brightness, setBrightness] =
    useState<number | null>(null);

  const [contrast, setContrast] =
    useState<number | null>(null);

  const [sharpness, setSharpness] =
    useState<number | null>(null);

  useEffect(() => {
    if (!image) return;

    return () => {
      URL.revokeObjectURL(image);
    };
  }, [image]);

  const [edgeDensity, setEdgeDensity] =
    useState<number | null>(null);

  const [whitespace, setWhitespace] =
    useState<number | null>(null);

  /* =====================================================
      SCORE
  ===================================================== */

  const [score, setScore] =
    useState<number | null>(null);

  /* =====================================================
      COLORS
  ===================================================== */

  const [dominantColors, setDominantColors] =
    useState<string[]>([]);

  const [colorHarmony, setColorHarmony] =
    useState("");

  /* =====================================================
      METRICS
  ===================================================== */

  const [metrics, setMetrics] =
    useState<AnalysisResponse["metrics"] | null>(null);

  /* =====================================================
      FEEDBACK
  ===================================================== */

  const [feedback, setFeedback] =
    useState<string[]>([]);

  /* =====================================================
      RESET ANALYSIS
  ===================================================== */

  const resetAnalysis = () => {


    setImage(null);
    setSelectedFile(null);
    setFileName("");
    setFileSize("");

    setBrightness(null);
    setContrast(null);
    setSharpness(null);
    setEdgeDensity(null);
    setWhitespace(null);

    setScore(null);

    setDominantColors([]);
    setColorHarmony("");

    setMetrics(null);

    setFeedback([]);

    setWidth(null);
    setHeight(null);
    setPixels(null);
    setError("");

  };

  /* =====================================================
      HANDLE IMAGE
  ===================================================== */

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Maximum file size is 10 MB.");
      return;
    }

    resetAnalysis();

    setSelectedFile(file);

    setImage(
      URL.createObjectURL(file)
    );

    setFileName(file.name);

    setFileSize(
      (
        file.size /
        1024 /
        1024
      ).toFixed(2) + " MB"
    );

  };

  /* =====================================================
      ANALYZE
  ===================================================== */

  const analyzeDesign = async () => {

    if (!selectedFile) {

    setError(
      "Please select an image first."
    );

      return;

    }

    try {

      setLoading(true);
      setError("");

      const data = await analyzeImage(selectedFile);

      console.log(data);

      /* -----------------------
        Image
      ----------------------- */

      setWidth(data.image.width);

      setHeight(data.image.height);

      setPixels(data.image.pixels);

      /* -----------------------
        Analysis
      ----------------------- */

      setBrightness(
        data.analysis.brightness
      );

      setContrast(
        data.analysis.contrast
      );

      setSharpness(
        data.analysis.sharpness
      );

      setEdgeDensity(
        data.analysis.edge_density
      );

      setWhitespace(
        data.analysis.whitespace
      );

      /* -----------------------
        Result
      ----------------------- */

      setScore(
        data.result.score
      );

      /* -----------------------
        Colors
      ----------------------- */

      setDominantColors(
        data.colors.dominant_colors
      );

      setColorHarmony(
        data.colors.harmony
      );

      /* -----------------------
        Metrics
      ----------------------- */

      setMetrics(
        data.metrics
      );

      /* -----------------------
        Feedback
      ----------------------- */

      setFeedback(
        data.feedback
      );

    } catch (error) {

      console.error(error);

      setError(
        "Unable to analyze image. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


    return (
      
      <AuthGuard>
      <main className="min-h-screen bg-black text-white">

        <UploadHeader title="Upload Design" subtitle="Upload posters, logos, banners, social media posts and other creatives. DesignDNA will analyze your image and generate AI-powered design insights"/>

        {/* =========================
            PAGE
        ========================== */}

        <section className="max-w-screen-2xl mx-auto px-8 py-10">


        {error && (
          <div className="mb-6 rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

          {/* ======================
              Upload Card
          ======================= */}

          <div className="bg-neutral-900 border border-gray-800 rounded-2xl p-8">

            <label
              htmlFor="upload-file"
              className="
                cursor-pointer
                inline-block
                px-6
                py-3
                bg-blue-600
                hover:bg-blue-700
                rounded-xl
                font-semibold
                transition
              "
            >
              Choose Design
            </label>

            <input
              id="upload-file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* File Information */}

            {fileName && (
    
              <div className="mb-8 space-y-2">
    
                <p>

                  <strong>File:</strong>{" "}
                  {fileName}
    
                </p>
    
                <p>

                  <strong>Size:</strong>{" "}
                  {fileSize}

                </p>

              </div>
    
            )}

            {/* Preview */}

            {image && (

              <div className="mb-8">
                <Image
                    src={image}
                    alt="Preview"
                    width={500}
                    height={500}
                />
              </div>

            )}

            {/* Analyze Button */}

            {image && (

              <button

                onClick={analyzeDesign}

                disabled={loading}

                className="
                  bg-white
                  text-black
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  hover:bg-gray-300
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "

              >

                {loading
                  ? "Analyzing Design..."
                  : "Analyze Design"}

              </button>

            )}

            {/* Loading */}

            {loading && (

              <div className="mt-8">

                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">

                  <div className="
                    h-full
                    w-1/2
                    bg-green-400
                    animate-pulse
                  " />

                </div>

                <p className="mt-4 text-gray-400">

                  AI is analyzing your design...

                </p>

              </div>

            )}

            {/* =====================================
                DASHBOARD
            ===================================== */}

            {score !== null && (

            <div className="mt-12 space-y-12">

            <ScoreCard score={score}/>

            <ColorPalette colors={dominantColors} harmony={colorHarmony} />

            <FeedbackCard feedback={feedback} />

              {/* ============================
                  Metrics
              ============================ */}

              <div className="grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6"
              >

                {/* Brightness */}

                <MetricCard
                  title="Brightness"
                  value={brightness}
                  unit=""
                  status={metrics?.brightness}
                />

                {/* Contrast */}

                <MetricCard
                  title="Contrast"
                  value={contrast}
                  unit=""
                  status={metrics?.contrast}
                />

                {/* Sharpness */}

                <MetricCard
                  title="Sharpness"
                  value={sharpness}
                  unit=""
                  status={metrics?.sharpness}
                />

                {/* Edge Density */}

                <MetricCard
                  title="Edge Density"
                  value={edgeDensity}
                  unit="%"
                  status={metrics?.edges}
                />

                {/* Whitespace */}

                <MetricCard
                  title="Whitespace"
                  value={whitespace}
                  unit="%"
                  status={metrics?.whitespace}
                />

              </div>

              {/* ============================
                  Image Information
              ============================ */}

              <div className="bg-neutral-950 border border-gray-800 rounded-2xl p-6">

                <h2 className="text-2xl font-bold mb-6">

                  Image Information

                </h2>

                <div className="grid md:grid-cols-3 gap-4">

                  <InfoCard
                    title="Width"
                    value={width}
                  />

                  <InfoCard
                    title="Height"
                    value={height}
                  />

                  <InfoCard
                    title="Pixels"
                    value={pixels}
                  />

                </div>

              </div>

            </div>

            )}

          </div>

        </section>

      </main>
      </AuthGuard>
    );
}
