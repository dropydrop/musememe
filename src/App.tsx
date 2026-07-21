import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Upload, 
  Download, 
  RefreshCw, 
  Smile, 
  Type as FontIcon, 
  Sliders, 
  Check, 
  Image as ImageIcon,
  Flame,
  AlertCircle,
  Hash,
  Share2
} from "lucide-react";
import { MEME_TEMPLATES, MemeTemplate, RANDOM_MEME_TEXTS, MemeText } from "./data";

export default function App() {
  // Current active image state (DataURL or proxy-secured URL)
  const [selectedImage, setSelectedImage] = useState<string>(MEME_TEMPLATES[0].url);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(MEME_TEMPLATES[0].id);
  
  // Text configuration
  const [topText, setTopText] = useState<string>(MEME_TEMPLATES[0].defaultTop || "");
  const [bottomText, setBottomText] = useState<string>(MEME_TEMPLATES[0].defaultBottom || "");
  const [textSize, setTextSize] = useState<number>(36);
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [textPositionTop, setTextPositionTop] = useState<number>(10); // percentage from top
  const [textPositionBottom, setTextPositionBottom] = useState<number>(10); // percentage from bottom

  // AI captions states
  const [aiCaptions, setAiCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "upload">("templates");
  
  // Fun developer or general French facts list shown during caption generation load
  const loadTips = [
    "Analyse des pixels par un expert en mémologie appliquée...",
    "Traduction du sarcasme en langue française littéraire...",
    "Recherche des blagues les plus fines d'Internet...",
    "Vérification de la conformité du taux de sel...",
    "Dosage optimal de caféine injecté dans l'algorithme..."
  ];
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Update tip cycle when loading
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % loadTips.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Handle template selection
  const handleSelectTemplate = (template: MemeTemplate) => {
    setSelectedTemplateId(template.id);
    setTopText(template.defaultTop || "");
    setBottomText(template.defaultBottom || "");
    // Use proxy for outer images to avoid Canvas "tainting" (CORS) when downloading
    if (template.url.startsWith("http")) {
      setSelectedImage(`/api/proxy-image?url=${encodeURIComponent(template.url)}`);
    } else {
      setSelectedImage(template.url);
    }
  };

  // Convert template URLs to proxied on mount
  useEffect(() => {
    if (MEME_TEMPLATES[0]) {
      const initialTemplate = MEME_TEMPLATES[0];
      setSelectedImage(`/api/proxy-image?url=${encodeURIComponent(initialTemplate.url)}`);
    }
  }, []);

  // Set default texts when switching to custom upload
  const handleCustomUploadSelected = () => {
    setActiveTab("upload");
  };

  // Process file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        setSelectedImage(event.target.result);
        setSelectedTemplateId("custom");
        
        // Clear or set smart defaults
        setTopText("Moi quand");
        setBottomText("Saisir votre texte ici");
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  // Trigger file selection
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Render the canvas
  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Request CORS authorization
    img.src = selectedImage;

    img.onload = () => {
      // Set fixed resolution size for crisp download, fitting high quality standard
      const maxDimension = 800;
      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // Custom Font setup (Impact styled with beautiful high contrast outline)
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.textAlign = "center";
      
      // Calculate font size proportional to width
      const calculatedFontSize = Math.round((textSize / 500) * width);
      ctx.font = `bold ${calculatedFontSize}px Impact, "Anton", "Arial Black", sans-serif`;
      ctx.lineJoin = "miter";
      ctx.miterLimit = 2;
      ctx.lineWidth = Math.max(2, Math.round(calculatedFontSize / 6));

      // Prep texts
      const formattedTop = isUppercase ? topText.toUpperCase() : topText;
      const formattedBottom = isUppercase ? bottomText.toUpperCase() : bottomText;

      // Draw Top Text (split by lines if very long)
      if (formattedTop) {
        ctx.textBaseline = "top";
        const yPosTop = (textPositionTop / 100) * height;
        wrapAndDrawText(ctx, formattedTop, width / 2, yPosTop, width - 40, calculatedFontSize);
      }

      // Draw Bottom Text
      if (formattedBottom) {
        ctx.textBaseline = "bottom";
        const yPosBottom = height - ((textPositionBottom / 100) * height);
        wrapAndDrawText(ctx, formattedBottom, width / 2, yPosBottom, width - 40, calculatedFontSize, true);
      }
    };

    img.onerror = () => {
      console.error("Erreur de chargement de l'image de rendu canvas.");
    };
  };

  // Helper function to handle text wrapping on canvas
  const wrapAndDrawText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    fromBottom: boolean = false
  ) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // If drawing from bottom, we offset upwards to accommodate multiple lines
    const startY = fromBottom ? y - (lines.length - 1) * lineHeight : y;

    lines.forEach((line, index) => {
      const lineY = startY + index * lineHeight;
      ctx.strokeText(line, x, lineY);
      ctx.fillText(line, x, lineY);
    });
  };

  // Redraw whenever parameters change
  useEffect(() => {
    drawMeme();
  }, [selectedImage, topText, bottomText, textSize, textColor, strokeColor, isUppercase, textPositionTop, textPositionBottom]);

  // Magic Caption API Call
  const handleMagicCaption = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setApiError(null);

    try {
      let base64Payload = "";

      // Convert our current image to base64 if it's already a proxied URL or local
      if (selectedImage.startsWith("data:image")) {
        base64Payload = selectedImage;
      } else {
        // Fetch and convert image to base64 via canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        // Wait for image resolution
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width > 600 ? 600 : img.width;
            canvas.height = img.height > 600 ? Math.round((img.height * 600) / img.width) : img.height;
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            try {
              base64Payload = canvas.toDataURL("image/jpeg", 0.85);
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = (e) => reject(new Error("Impossible de charger l'image pour l'analyse IA."));
          img.src = selectedImage;
        });
      }

      // Call our server backend API
      const response = await fetch("/api/generate-captions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Payload }),
      });

      if (!response.ok) {
        throw new Error("Erreur de communication avec le serveur.");
      }

      const data = await response.json();
      if (data.captions && data.captions.length > 0) {
        setAiCaptions(data.captions);
        setLastGeneratedImage(selectedImage);
      } else {
        throw new Error("Aucune légende renvoyée.");
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Une erreur s'est produite lors de la génération avec Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Suggest caption split to user (tries to divide reasonably between Top and Bottom)
  const applySuggestedCaption = (caption: string) => {
    // If the caption has punctuation or logical dividers like "Moi quand" or "POV:" or ":"
    let top = "";
    let bottom = "";

    const splitPhrases = [" quand ", " qui ", " face ", " mais ", " alors que ", ", "];
    
    // Check if the caption contains POV: or similar start
    let cleaned = caption;
    let prefix = "";
    if (caption.toUpperCase().startsWith("POV:") || caption.toUpperCase().startsWith("POV :")) {
      const splitIdx = caption.indexOf(":");
      prefix = caption.substring(0, splitIdx + 1).trim() + " ";
      cleaned = caption.substring(splitIdx + 1).trim();
    }

    // Attempt smart splitting
    let splitDone = false;
    for (const delimiter of splitPhrases) {
      if (cleaned.toLowerCase().includes(delimiter)) {
        const parts = cleaned.split(new RegExp(delimiter, "i"));
        if (parts.length >= 2) {
          // Re-blend middle delimiter
          top = prefix + parts[0].trim();
          bottom = (delimiter.trim() + " " + parts.slice(1).join(delimiter).trim()).trim();
          splitDone = true;
          break;
        }
      }
    }

    // Standard word length middle split
    if (!splitDone) {
      const words = cleaned.split(" ");
      if (words.length > 4) {
        const mid = Math.ceil(words.length / 2);
        top = prefix + words.slice(0, mid).join(" ").trim();
        bottom = words.slice(mid).join(" ").trim();
      } else {
        top = prefix + cleaned;
        bottom = "";
      }
    }

    // Capitalize beautifully or apply custom user toggle
    setTopText(top);
    setBottomText(bottom);
  };

  // Download logic (Draw current meme canvas and download as file)
  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `ia-meme-generateur-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CORS taint prevented client-side download. Forcing direct canvas download fallback:", err);
      // Fallback instruction
      alert("Pour télécharger le mème, faites un clic droit ou maintenez appuyé sur l'image ci-dessous et sélectionnez : 'Enregistrer l'image sous'.");
    }
  };

  // Randomize texts using over 100 predefined offline French captions
  const handleRandomizeText = () => {
    const randomText = RANDOM_MEME_TEXTS[Math.floor(Math.random() * RANDOM_MEME_TEXTS.length)];
    setTopText(randomText.top);
    setBottomText(randomText.bottom);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col" id="meme-generator-root">
      
      {/* Upper Brand Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/10">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                MuseMeme<span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-medium">Alimenté par IA : Gemini 3.5 Flash</span>
              </h1>
              <p className="text-xs text-slate-400">
                Générateur de Mèmes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#templates-section"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Modèles de Mèmes populaires
            </a>
            <button 
              onClick={handleRandomizeText}
              title="Générer un texte comique instantanément sans consommer de quota d'API (100% local/hors-ligne)"
              className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl hover:scale-[1.01] active:scale-95 transition-all text-left shadow-xs cursor-pointer"
              id="randomize-text-btn"
            >
              <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">Texte Aléatoire</span>
                <span className="text-[10px] text-amber-400 opacity-80 font-normal leading-none mt-0.5">(Hors-ligne sans IA)</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8" id="workspace">
        
        {/* Main Grid: Canvas Preview + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Meme Studio Screen (Canvas Display) - span 7 */}
          <section className="lg:col-span-7 flex flex-col gap-4" id="preview-section">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Canvas de Rendu Live
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedTemplateId === "custom" ? "Image importée" : `Modèle : ${selectedTemplateId}`}
                </span>
              </div>

              {/* Dynamic Aspect Ratio Box containing the Canvas */}
              <div 
                className={`relative bg-slate-950 rounded-xl overflow-hidden min-h-[350px] md:min-h-[480px] max-h-[600px] flex items-center justify-center border-2 border-dashed transition-all duration-300 ${
                  isDragOver ? "border-amber-500 bg-amber-500/10" : "border-transparent"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                id="meme-canvas-wrapper"
              >
                {/* The core render element */}
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-[550px] object-contain shadow-2xl rounded"
                  id="main-meme-canvas"
                />

                {/* Drag overlay prompt */}
                {isDragOver && (
                  <div className="absolute inset-0 bg-amber-500/25 flex flex-col items-center justify-center backdrop-blur-xs text-white pointer-events-none">
                    <Upload className="w-12 h-12 mb-2 animate-bounce" />
                    <span className="font-bold text-lg">Déposez votre image ici !</span>
                    <span className="text-sm opacity-80">Importation instantanée</span>
                  </div>
                )}
              </div>

              {/* Quick Canvas Helpers */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-850">
                <p>💡 <span className="font-semibold text-slate-300">Truc:</span> Importez vos propres images ou utilisez les modèles populaires disponibles</p>
                <button
                  type="button"
                  onClick={downloadMeme}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Télécharger
                </button>
              </div>
            </div>

            {/* Magic Caption Section */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg" id="magic-caption-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/25 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs">
                      Exclusivité
                    </span>
                    <span className="flex items-center gap-1 text-xs text-amber-200">
                      <Sparkles className="w-3 h-3 fill-amber-200" /> IA Gemini 3.5
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Outil de Légendes Magiques ✨</h3>
                  <p className="text-sm opacity-90 max-w-xl">
                    L'IA analyse les émotions complexes de l'image pour vous proposer 5 légendes françaises humoristiques à appliquer d'un simple clic !
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleMagicCaption}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-orange-600 font-bold rounded-xl shadow-lg hover:bg-[#F9FAFB] hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition cursor-pointer self-start md:self-center shrink-0 w-full md:w-auto"
                  id="magic-caption-trigger"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 fill-orange-600" />
                  )}
                  <span>{isGenerating ? "Analyse de l'image..." : "Trouver des idées !"}</span>
                </button>
              </div>

              {/* Progress UI when analyzing */}
              {isGenerating && (
                <div className="mt-5 pt-5 border-t border-white/20 flex flex-col gap-3 animate-pulse" id="loading-panel">
                  <div className="flex items-center justify-between text-xs">
                    <span>Génération en cours...</span>
                    <span>Français d'origine contrôlée</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full w-2/3 animate-infinite-scroll"></div>
                  </div>
                  <p className="text-sm italic text-amber-100 flex items-center gap-2">
                    <Smile className="w-4 h-4 shrink-0" />
                    <span>"{loadTips[loadingTipIndex]}"</span>
                  </p>
                </div>
              )}

              {/* API error feedback */}
              {apiError && (
                <div className="mt-4 p-3.5 bg-red-500/23 border border-red-500/20 text-red-100 rounded-xl flex items-start gap-2.5 text-sm" id="api-error-alert">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-200" />
                  <div>
                    <span className="font-bold">Erreur de traitement : </span>
                    {apiError}. Légendes de secours fournies ci-dessous.
                  </div>
                </div>
              )}

              {/* AI Proposed Captions Container */}
              {aiCaptions.length > 0 && !isGenerating && (
                <div className="mt-5 pt-5 border-t border-white/20 text-white space-y-3" id="ai-captions-list">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-amber-200">
                      Propositions de l'IA (Cliquez pour appliquer)
                    </h4>
                    {lastGeneratedImage !== selectedImage && (
                      <span className="bg-yellow-500 text-black font-semibold text-[10px] px-2 py-0.5 rounded leading-none">
                        ⚠️ Image différente
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {aiCaptions.map((caption, idx) => (
                      <button
                        key={idx}
                        onClick={() => applySuggestedCaption(caption)}
                        className="w-full text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/22 border border-white/15 transition flex items-center justify-between gap-3 group text-sm font-medium"
                        title="Cliquer pour appliquer sur le mème"
                      >
                        <span className="flex items-start gap-2.5">
                          <span className="bg-amber-400 text-amber-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="group-hover:text-amber-100 transition line-clamp-2 md:line-clamp-none">{caption}</span>
                        </span>
                        <Check className="w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Custom Control Deck Panel - span 5 */}
          <section className="lg:col-span-5 flex flex-col gap-6" id="editor-controls-section">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <Sliders className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-white">Configuration & Édition</h3>
              </div>

              {/* Caption Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="top-text-input" className="block text-sm font-semibold text-slate-300 flex justify-between">
                    <span>Texte Supérieur (Haut)</span>
                    <span className="text-xs text-slate-500 font-mono">{topText.length}/100</span>
                  </label>
                  <textarea
                    id="top-text-input"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Saisir le texte du haut..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bottom-text-input" className="block text-sm font-semibold text-slate-300 flex justify-between">
                    <span>Texte Inférieur (Bas)</span>
                    <span className="text-xs text-slate-500 font-mono">{bottomText.length}/100</span>
                  </label>
                  <textarea
                    id="bottom-text-input"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Saisir le texte du bas..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono resize-none"
                  />
                </div>
              </div>

              {/* Sliders and Styling Toggles */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FontIcon className="w-3.5 h-3.5" /> Personnalisation visuelle
                </h4>

                {/* Font styling sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Slider: Text size */}
                  <div className="space-y-1.5">
                    <label htmlFor="text-size-range" className="block text-xs font-medium text-slate-400 flex justify-between">
                      <span>Taille du texte</span>
                      <span className="font-mono text-amber-400 font-bold">{textSize}px</span>
                    </label>
                    <input
                      id="text-size-range"
                      type="range"
                      min="15"
                      max="100"
                      value={textSize}
                      onChange={(e) => setTextSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Toggle: Case sensitivity */}
                  <div className="space-y-1.5">
                    <span className="block text-xs font-medium text-slate-400">Format des lettres</span>
                    <button
                      type="button"
                      onClick={() => setIsUppercase(!isUppercase)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-2 cursor-pointer ${
                        isUppercase 
                          ? "bg-amber-500 text-white border-amber-500" 
                          : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900"
                      }`}
                    >
                      <span>{isUppercase ? "MAJUSCULES ACTIVÉES" : "Format Libre / Minuscules"}</span>
                    </button>
                  </div>
                </div>

                {/* Color pickers */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Text Color */}
                  <div className="space-y-1.5">
                    <span className="block text-xs font-medium text-slate-400">Couleur du texte</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-10 h-10 border border-slate-800 rounded-lg p-0 cursor-pointer overflow-hidden"
                      />
                      <input
                        type="text"
                        value={textColor.toUpperCase()}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 min-w-0 px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono uppercase text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Stroke Border Color */}
                  <div className="space-y-1.5">
                    <span className="block text-xs font-medium text-slate-400">Couleur de bordure</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-10 h-10 border border-slate-800 rounded-lg p-0 cursor-pointer overflow-hidden"
                      />
                      <input
                        type="text"
                        value={strokeColor.toUpperCase()}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="flex-1 min-w-0 px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono uppercase text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Position adjusters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label htmlFor="top-position-range" className="block text-xs font-medium text-slate-400 flex justify-between">
                      <span>Espacement Haut</span>
                      <span className="font-mono text-slate-500">{textPositionTop}%</span>
                    </label>
                    <input
                      id="top-position-range"
                      type="range"
                      min="2"
                      max="40"
                      value={textPositionTop}
                      onChange={(e) => setTextPositionTop(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bottom-position-range" className="block text-xs font-medium text-slate-400 flex justify-between">
                      <span>Espacement Bas</span>
                      <span className="font-mono text-slate-500">{textPositionBottom}%</span>
                    </label>
                    <input
                      id="bottom-position-range"
                      type="range"
                      min="2"
                      max="40"
                      value={textPositionBottom}
                      onChange={(e) => setTextPositionBottom(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons: Download / Import custom */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={downloadMeme}
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                  id="download-meme-action"
                >
                  <Download className="w-5 h-5" />
                  <span>Obtenir le mème (PNG)</span>
                </button>
              </div>

            </div>

            {/* Direct upload tab connector */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-indigo-400" /> Ou importez votre photo
                </span>
                {selectedTemplateId === "custom" && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    Active
                  </span>
                )}
              </div>

              {/* File drop zone selector */}
              <div 
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="group border border-dashed border-slate-800 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer bg-slate-950 hover:bg-amber-500/5 transition"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Smile className="w-8 h-8 text-indigo-400 group-hover:text-amber-500 mx-auto mb-2 transition-transform group-hover:scale-110" />
                <p className="text-xs font-semibold text-slate-400 group-hover:text-amber-400">
                  Cliquez ou glissez-déposez n'importe quelle photo
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  JPG, PNG ou WebP — Analyse instantanée par l'IA possible
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Templates Selection Section */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6" id="templates-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-amber-500" />
                <span>Sélectionner un modèle populaire</span>
              </h3>
              <p className="text-sm text-slate-400">
                Choisissez parmi nos classiques d'Internet, ou importez vos propres images ci-dessus
              </p>
            </div>
            
            <div className="flex bg-slate-950 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleSelectTemplate(MEME_TEMPLATES[Math.floor(Math.random() * MEME_TEMPLATES.length)])}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-slate-300 shadow-xs hover:bg-slate-850 hover:text-white transition cursor-pointer"
              >
                Modèle au hasard 🎲
              </button>
            </div>
          </div>

          {/* Grid list of templates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="templates-list-grid">
            {MEME_TEMPLATES.map((template) => {
              const isActive = selectedTemplateId === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`group relative text-left rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    isActive 
                      ? "ring-2 ring-amber-500 border-amber-500 scale-[0.98]" 
                      : "border-slate-800 hover:border-amber-500/50 hover:shadow-md"
                  }`}
                  id={`template-card-${template.id}`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-slate-950 overflow-hidden relative">
                    <img
                      src={template.url}
                      alt={template.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.warn("Retrying direct template source image");
                      }}
                    />
                    
                    {/* Selected Badge */}
                    {isActive && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Description Info overlay/capsule */}
                  <div className="p-3 bg-slate-950">
                    <p className="text-xs font-bold text-slate-200 truncate">{template.name}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{template.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* Styled Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 text-xs text-slate-500 space-y-2">
          <p>© 2026 Mémologie Expérimentale AI — Conçu pour un maximum de fun en langue française 🇫🇷</p>
          <p>La technologie se base sur la vision de Gemini 3.5 Flash pour générer des idées fraîches basées sur le contexte visuel.</p>
        </div>
      </footer>

    </div>
  );
}
