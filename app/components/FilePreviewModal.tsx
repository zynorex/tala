import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2,
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  FileText, Code, Image as ImageIcon, Video, Music, File,
  Eye, EyeOff, Copy, Check, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Lock, Search, Sun, Moon,
  ExternalLink, Columns, WrapText
} from 'lucide-react';
import {
  useFilePreview,
  getPreviewType,
  getLanguageFromFileName,
  isPreviewSupported,
  formatFileSize,
} from '@/app/hooks/useFilePreview';
import { VaultLockedError } from '@/app/hooks/useFileDownload';

// ============ TYPES ============

interface FilePreviewModalProps {
  isOpen: boolean;
  vaultId: string;
  file: {
    id: string;
    fileName: string;
    mimeType: string | null;
    fileSizeBytes: number;
  } | null;
  files?: Array<{
    id: string;
    fileName: string;
    mimeType: string | null;
    fileSizeBytes: number;
  }>;
  onClose: () => void;
  onVaultLocked?: (unlockTime: string) => void;
}

// ============ SUB-COMPONENTS ============

/**
 * Password Entry Component
 */
function PasswordEntry({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (password: string) => void;
  isLoading: boolean;
  error: string | null;
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-heirlock-yellow border-4 border-black flex items-center justify-center">
            <Lock className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black mb-2">Enter Decryption Password</h3>
          <p className="text-sm text-gray-600">Your file is encrypted for security</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="relative mb-6">
          <input
            ref={inputRef}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full p-4 pr-12 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-heirlock-yellow/50"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!password.trim() || isLoading}
          className="w-full p-4 bg-black text-white font-black border-4 border-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Decrypting...</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              <span>Preview File</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

/**
 * Loading Progress Component
 */
function LoadingProgress({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative w-32 h-32 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#84cc16"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black">{progress}%</span>
        </div>
      </div>
      <p className="font-black text-lg">
        {progress < 25 ? 'Fetching metadata...' :
         progress < 50 ? 'Downloading from IPFS...' :
         progress < 80 ? 'Decrypting file...' :
         'Preparing preview...'}
      </p>
    </div>
  );
}

/**
 * Image Preview Component with zoom and pan
 */
function ImagePreview({ url, fileName }: { url: string; fileName: string }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.25, Math.min(5, z + delta)));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-center gap-2 p-3 bg-gray-100 border-b-4 border-black">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-white border-2 border-black transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="px-3 py-1 bg-white border-2 border-black font-mono text-sm min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-white border-2 border-black transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-black mx-2" />
        <button
          onClick={handleRotate}
          className="p-2 hover:bg-white border-2 border-black transition-all"
          title="Rotate"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 hover:bg-white border-2 border-black transition-all text-xs font-black"
        >
          Reset
        </button>
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-[#1a1a1a] flex items-center justify-center"
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={url}
          alt={fileName}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-150"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/**
 * Video Preview Component
 */
function VideoPreview({ url, mimeType }: { url: string; mimeType: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Video */}
      <div className="flex-1 flex items-center justify-center">
        <video
          ref={videoRef}
          src={url}
          className="max-w-full max-h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onClick={togglePlay}
        >
          <source src={url} type={mimeType} />
        </video>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 border-t-4 border-black">
        {/* Progress Bar */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-heirlock-green mb-3"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => skip(-10)}
              className="p-2 text-white hover:bg-gray-700 rounded transition-all"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-heirlock-green text-black rounded-full hover:opacity-90 transition-all"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <button
              onClick={() => skip(10)}
              className="p-2 text-white hover:bg-gray-700 rounded transition-all"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <span className="text-white font-mono text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-white hover:bg-gray-700 rounded transition-all"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (videoRef.current) videoRef.current.volume = v;
                if (v > 0) setIsMuted(false);
              }}
              className="w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Audio Preview Component
 */
function AudioPreview({ url, fileName, mimeType }: { url: string; fileName: string; mimeType: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-b from-gray-900 to-black">
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      {/* Visualizer Placeholder */}
      <div className="w-48 h-48 mb-8 rounded-full bg-gradient-to-br from-heirlock-pink via-heirlock-yellow to-heirlock-green p-1">
        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
          <Music className="w-20 h-20 text-white" />
        </div>
      </div>

      <h3 className="text-white font-black text-xl mb-6 text-center max-w-md truncate">
        {fileName}
      </h3>

      {/* Progress */}
      <div className="w-full max-w-md mb-4">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => {
            const time = parseFloat(e.target.value);
            if (audioRef.current) {
              audioRef.current.currentTime = time;
            }
          }}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-heirlock-green"
        />
        <div className="flex justify-between text-gray-400 text-sm mt-1 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = Math.max(0, currentTime - 10);
            }
          }}
          className="p-3 text-white hover:bg-gray-800 rounded-full transition-all"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={togglePlay}
          className="p-4 bg-heirlock-green text-black rounded-full hover:opacity-90 transition-all"
          style={{ boxShadow: '0 0 20px rgba(132, 204, 22, 0.5)' }}
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = Math.min(duration, currentTime + 10);
            }
          }}
          className="p-3 text-white hover:bg-gray-800 rounded-full transition-all"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

/**
 * PDF Preview Component using embed/object for blob URL compatibility
 */
function PDFPreview({ url, fileName }: { url: string; fileName: string }) {
  const [useEmbed, setUseEmbed] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Open in new tab handler
  const handleOpenInNewTab = () => {
    // Create a new window with the PDF
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { margin: 0; padding: 0; }
              embed { width: 100%; height: 100vh; }
            </style>
          </head>
          <body>
            <embed src="${url}" type="application/pdf" width="100%" height="100%" />
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // Download handler
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b-4 border-black">
        <span className="font-black text-sm truncate max-w-[200px]">{fileName}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-heirlock-green border-2 border-black hover:opacity-90 text-sm font-black transition-all"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black hover:bg-gray-50 text-sm font-black transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            New Tab
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-200 relative">
        {loadError ? (
          // Fallback message if PDF fails to load
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="font-black text-lg mb-2">PDF Preview Unavailable</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Your browser cannot display this PDF inline. Please download the file or open it in a new tab.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white font-black border-4 border-black hover:bg-gray-800 transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2 px-4 py-2 bg-white font-black border-4 border-black hover:bg-gray-50 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
            </div>
          </div>
        ) : useEmbed ? (
          // Try embed first (works better with blob URLs)
          <embed
            src={url}
            type="application/pdf"
            className="w-full h-full"
            onError={() => setUseEmbed(false)}
          />
        ) : (
          // Fallback to object tag
          <object
            data={url}
            type="application/pdf"
            className="w-full h-full"
            onError={() => setLoadError(true)}
          >
            {/* Final fallback if object also fails */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600">Unable to display PDF</p>
            </div>
          </object>
        )}
      </div>

      {/* Info bar */}
      <div className="p-2 bg-gray-100 border-t-2 border-black text-xs text-gray-500 text-center">
        If the PDF doesn't display correctly, try downloading or opening in a new tab
      </div>
    </div>
  );
}

/**
 * Code/Text Preview Component with syntax highlighting
 */
function CodePreview({
  content,
  fileName,
  language,
}: {
  content: string;
  fileName: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(14);

  const lines = useMemo(() => content.split('\n'), [content]);
  
  const highlightedLines = useMemo(() => {
    if (!searchQuery) return lines.map((line) => ({ line, highlighted: false }));
    
    return lines.map((line) => ({
      line,
      highlighted: line.toLowerCase().includes(searchQuery.toLowerCase()),
    }));
  }, [lines, searchQuery]);

  const matchCount = useMemo(() => {
    if (!searchQuery) return 0;
    return highlightedLines.filter((l) => l.highlighted).length;
  }, [highlightedLines, searchQuery]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bgColor = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const lineNumColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-100 border-b-4 border-black">
        {/* Language Badge */}
        <span className="px-2 py-1 bg-heirlock-blue text-black text-xs font-black uppercase border-2 border-black">
          {language}
        </span>

        {/* Search */}
        <div className="relative flex-1 min-w-[150px] max-w-[250px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 border-2 border-black text-sm font-mono focus:outline-none focus:ring-2 focus:ring-heirlock-yellow"
          />
          {matchCount > 0 && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {matchCount} matches
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* Font Size */}
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 2))}
            className="p-1.5 hover:bg-white border-2 border-black text-xs font-black"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((s) => Math.min(24, s + 2))}
            className="p-1.5 hover:bg-white border-2 border-black text-xs font-black"
          >
            A+
          </button>

          <div className="w-px h-6 bg-black mx-1" />

          {/* Line Numbers Toggle */}
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`p-1.5 border-2 border-black transition-all ${showLineNumbers ? 'bg-heirlock-green' : 'bg-white hover:bg-gray-50'}`}
            title="Toggle Line Numbers"
          >
            <Columns className="w-4 h-4" />
          </button>

          {/* Word Wrap Toggle */}
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`p-1.5 border-2 border-black transition-all ${wordWrap ? 'bg-heirlock-green' : 'bg-white hover:bg-gray-50'}`}
            title="Toggle Word Wrap"
          >
            <WrapText className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 hover:bg-white border-2 border-black transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="w-px h-6 bg-black mx-1" />

          {/* Copy */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1.5 border-2 border-black text-xs font-black transition-all ${
              copied ? 'bg-heirlock-green' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className={`flex-1 overflow-auto ${bgColor}`}>
        <div
          className={`min-h-full font-mono ${textColor}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
        >
          {highlightedLines.map(({ line, highlighted }, index) => (
            <div
              key={index}
              className={`flex ${highlighted ? (theme === 'dark' ? 'bg-yellow-900/50' : 'bg-yellow-200') : ''} hover:${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}
            >
              {showLineNumbers && (
                <span
                  className={`select-none px-4 py-0 text-right ${lineNumColor} border-r ${borderColor}`}
                  style={{ minWidth: `${Math.max(40, String(lines.length).length * 12 + 24)}px` }}
                >
                  {index + 1}
                </span>
              )}
              <pre
                className={`flex-1 px-4 py-0 ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}
              >
                {line || ' '}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between px-4 py-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} border-t-2 ${borderColor} text-xs font-mono`}>
        <span>{lines.length} lines</span>
        <span>{content.length.toLocaleString()} characters</span>
      </div>
    </div>
  );
}

/**
 * JSON Preview Component with tree view
 */
function JSONPreview({ content, fileName }: { content: string; fileName: string }) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));
  const [copied, setCopied] = useState(false);

  let parsedJSON: unknown;
  let parseError: string | null = null;

  try {
    parsedJSON = JSON.parse(content);
  } catch (e) {
    parseError = e instanceof Error ? e.message : 'Invalid JSON';
  }

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const expandAll = () => {
    const paths = new Set<string>();
    const traverse = (obj: unknown, path: string) => {
      paths.add(path);
      if (obj && typeof obj === 'object') {
        Object.keys(obj as object).forEach((key) => {
          traverse((obj as Record<string, unknown>)[key], `${path}.${key}`);
        });
      }
    };
    traverse(parsedJSON, 'root');
    setExpandedPaths(paths);
  };

  const collapseAll = () => {
    setExpandedPaths(new Set(['root']));
  };

  const renderValue = (value: unknown, path: string, depth: number): React.ReactNode => {
    const indent = depth * 20;

    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-purple-400">{String(value)}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-blue-400">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-green-400">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path);
      return (
        <span>
          <button
            onClick={() => togglePath(path)}
            className="text-yellow-400 hover:underline"
          >
            [{isExpanded ? '' : `...${value.length} items`}
          </button>
          {isExpanded && (
            <div style={{ marginLeft: indent }}>
              {value.map((item, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 mr-2">{index}:</span>
                  {renderValue(item, `${path}[${index}]`, depth + 1)}
                </div>
              ))}
            </div>
          )}
          {isExpanded && <span>]</span>}
        </span>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as object);
      const isExpanded = expandedPaths.has(path);
      return (
        <span>
          <button
            onClick={() => togglePath(path)}
            className="text-yellow-400 hover:underline"
          >
            {'{'}
            {isExpanded ? '' : `...${entries.length} keys`}
          </button>
          {isExpanded && (
            <div style={{ marginLeft: indent }}>
              {entries.map(([key, val]) => (
                <div key={key} className="flex">
                  <span className="text-pink-400 mr-2">"{key}":</span>
                  {renderValue(val, `${path}.${key}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
          {isExpanded && <span>{'}'}</span>}
        </span>
      );
    }

    return <span>{String(value)}</span>;
  };

  if (parseError) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 bg-red-50 border-b-4 border-red-500">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-black">Invalid JSON: {parseError}</span>
          </div>
        </div>
        <CodePreview content={content} fileName={fileName} language="json" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 bg-gray-100 border-b-4 border-black">
        <span className="px-2 py-1 bg-heirlock-yellow text-black text-xs font-black uppercase border-2 border-black">
          JSON
        </span>
        <button
          onClick={expandAll}
          className="px-2 py-1 bg-white border-2 border-black text-xs font-black hover:bg-gray-50"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-2 py-1 bg-white border-2 border-black text-xs font-black hover:bg-gray-50"
        >
          Collapse All
        </button>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(JSON.stringify(parsedJSON, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={`ml-auto px-2 py-1 border-2 border-black text-xs font-black ${copied ? 'bg-heirlock-green' : 'bg-white hover:bg-gray-50'}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 font-mono text-sm">
        {renderValue(parsedJSON, 'root', 1)}
      </div>
    </div>
  );
}

/**
 * CSV Preview Component with table view
 */
function CSVPreview({ content, fileName }: { content: string; fileName: string }) {
  const [delimiter, setDelimiter] = useState(',');

  const rows = useMemo(() => {
    const lines = content.split('\n').filter((line) => line.trim());
    return lines.map((line) => {
      // Simple CSV parsing (doesn't handle quoted fields perfectly)
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;

      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          cells.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      cells.push(current.trim());
      return cells;
    });
  }, [content, delimiter]);

  const headers = rows[0] || [];
  const data = rows.slice(1);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 bg-gray-100 border-b-4 border-black">
        <span className="px-2 py-1 bg-heirlock-pink text-black text-xs font-black uppercase border-2 border-black">
          CSV
        </span>
        <span className="text-sm text-gray-600">
          {data.length} rows × {headers.length} columns
        </span>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs font-black">Delimiter:</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="px-2 py-1 border-2 border-black text-sm"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              <th className="px-3 py-2 border-2 border-black text-left text-xs font-black bg-gray-300">
                #
              </th>
              {headers.map((header, i) => (
                <th key={i} className="px-3 py-2 border-2 border-black text-left text-xs font-black">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-heirlock-yellow/20">
                <td className="px-3 py-2 border-2 border-black text-xs font-mono bg-gray-100">
                  {rowIndex + 1}
                </td>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 border-2 border-black text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Markdown Preview Component
 */
function MarkdownPreview({ content, fileName }: { content: string; fileName: string }) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  // Simple markdown rendering (basic support)
  const renderMarkdown = (md: string): React.ReactNode => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">
              <code>{codeContent}</code>
            </pre>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.slice(3);
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-3xl font-black mb-4 mt-6">{line.slice(2)}</h1>);
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-2xl font-black mb-3 mt-5">{line.slice(3)}</h2>);
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-xl font-black mb-2 mt-4">{line.slice(4)}</h3>);
        return;
      }

      // Horizontal rule
      if (line.match(/^[-*_]{3,}$/)) {
        elements.push(<hr key={index} className="border-2 border-black my-6" />);
        return;
      }

      // Lists
      if (line.match(/^[-*+]\s/)) {
        elements.push(
          <li key={index} className="ml-6 list-disc">{line.slice(2)}</li>
        );
        return;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s/)) {
        elements.push(
          <li key={index} className="ml-6 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>
        );
        return;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="border-l-4 border-heirlock-blue pl-4 italic text-gray-600 my-2">
            {line.slice(2)}
          </blockquote>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<br key={index} />);
        return;
      }

      // Regular paragraph with inline formatting
      let formatted = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-heirlock-blue underline">$1</a>');

      elements.push(
        <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });

    return elements;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 bg-gray-100 border-b-4 border-black">
        <span className="px-2 py-1 bg-heirlock-blue text-black text-xs font-black uppercase border-2 border-black">
          Markdown
        </span>
        <div className="flex border-2 border-black">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 text-xs font-black ${viewMode === 'preview' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-3 py-1 text-xs font-black ${viewMode === 'raw' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Raw
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {viewMode === 'preview' ? (
          <div className="p-6 max-w-3xl mx-auto prose">
            {renderMarkdown(content)}
          </div>
        ) : (
          <CodePreview content={content} fileName={fileName} language="markdown" />
        )}
      </div>
    </div>
  );
}

/**
 * Unsupported File Type Component
 */
function UnsupportedPreview({
  fileName,
  mimeType,
  fileSize,
  onDownload,
}: {
  fileName: string;
  mimeType: string;
  fileSize: number;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-24 h-24 mb-6 rounded-2xl bg-gray-200 border-4 border-black flex items-center justify-center">
        <File className="w-12 h-12 text-gray-500" />
      </div>
      <h3 className="text-xl font-black mb-2 text-center">{fileName}</h3>
      <p className="text-gray-600 mb-1">{mimeType || 'Unknown type'}</p>
      <p className="text-gray-500 text-sm mb-6">{formatFileSize(fileSize)}</p>
      <div className="border-4 border-black bg-heirlock-yellow/30 p-4 mb-6 max-w-md text-center">
        <p className="text-sm">
          Preview is not available for this file type. You can download the file to view it.
        </p>
      </div>
      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black border-4 border-black hover:bg-gray-800 transition-all"
        style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)' }}
      >
        <Download className="w-5 h-5" />
        Download File
      </button>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export function FilePreviewModal({
  isOpen,
  vaultId,
  file,
  files = [],
  onClose,
  onVaultLocked,
}: FilePreviewModalProps) {
  const {
    loadPreview,
    clearPreview,
    downloadFromPreview,
    isLoading,
    progress,
    error,
    previewData,
  } = useFilePreview();

  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Find current file index
  useEffect(() => {
    if (file && files.length > 0) {
      const index = files.findIndex((f) => f.id === file.id);
      if (index >= 0) setCurrentFileIndex(index);
    }
  }, [file, files]);

  const currentFile = files.length > 0 ? files[currentFileIndex] : file;

  // Reset state when modal closes or file changes
  useEffect(() => {
    if (!isOpen) {
      clearPreview();
      setHasPassword(false);
      setPassword('');
    }
  }, [isOpen, clearPreview]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }

      if (e.key === 'ArrowLeft' && files.length > 1) {
        setCurrentFileIndex((i) => (i > 0 ? i - 1 : files.length - 1));
        setHasPassword(false);
        clearPreview();
      }

      if (e.key === 'ArrowRight' && files.length > 1) {
        setCurrentFileIndex((i) => (i < files.length - 1 ? i + 1 : 0));
        setHasPassword(false);
        clearPreview();
      }

      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsFullscreen((f) => !f);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, files.length, onClose, clearPreview]);

  // Handle password submission
  const handlePasswordSubmit = async (pwd: string) => {
    if (!currentFile) return;

    setPassword(pwd);
    try {
      await loadPreview({
        vaultId,
        fileId: currentFile.id,
        fileName: currentFile.fileName,
        mimeType: currentFile.mimeType,
        password: pwd,
      });
      setHasPassword(true);
    } catch (err) {
      if (err instanceof VaultLockedError && onVaultLocked && err.unlockTime) {
        onClose();
        onVaultLocked(err.unlockTime);
      }
    }
  };

  // Navigate between files
  const goToPrevFile = () => {
    setCurrentFileIndex((i) => (i > 0 ? i - 1 : files.length - 1));
    setHasPassword(false);
    clearPreview();
  };

  const goToNextFile = () => {
    setCurrentFileIndex((i) => (i < files.length - 1 ? i + 1 : 0));
    setHasPassword(false);
    clearPreview();
  };

  if (!isOpen || !currentFile) return null;

  const previewType = getPreviewType(currentFile.mimeType, currentFile.fileName);
  const language = getLanguageFromFileName(currentFile.fileName);
  const canPreview = isPreviewSupported(currentFile.mimeType, currentFile.fileName);

  // Get file type icon
  const FileTypeIcon = {
    image: ImageIcon,
    video: Video,
    audio: Music,
    pdf: FileText,
    code: Code,
    text: FileText,
    markdown: FileText,
    json: Code,
    csv: FileText,
    unsupported: File,
  }[previewType];

  return (
    <div
      className={`fixed inset-0 z-50 ${isFullscreen ? '' : 'p-4 md:p-8'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div
        ref={modalRef}
        className={`bg-white border-4 border-black flex flex-col ${
          isFullscreen ? 'w-full h-full' : 'max-w-6xl max-h-[90vh] mx-auto h-full'
        }`}
        style={isFullscreen ? {} : { boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-white">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded bg-gray-100 border-2 border-black flex items-center justify-center flex-shrink-0">
              <FileTypeIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-black text-lg truncate">{currentFile.fileName}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatFileSize(currentFile.fileSizeBytes)}</span>
                {files.length > 1 && (
                  <>
                    <span>•</span>
                    <span>{currentFileIndex + 1} of {files.length}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            {previewData && (
              <button
                onClick={downloadFromPreview}
                className="flex items-center gap-2 px-3 py-2 bg-heirlock-green border-2 border-black font-black text-sm hover:opacity-90 transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 border-2 border-black transition-all"
              title={isFullscreen ? 'Exit Fullscreen (Ctrl+F)' : 'Fullscreen (Ctrl+F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 hover:text-red-600 border-2 border-black transition-all"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {/* File Navigation */}
          {files.length > 1 && hasPassword && (
            <>
              <button
                onClick={goToPrevFile}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border-4 border-black hover:bg-gray-100 transition-all"
                style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                title="Previous file (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNextFile}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border-4 border-black hover:bg-gray-100 transition-all"
                style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                title="Next file (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Password Entry */}
          {!hasPassword && !isLoading && (
            <PasswordEntry
              onSubmit={handlePasswordSubmit}
              isLoading={isLoading}
              error={error}
            />
          )}

          {/* Loading State */}
          {isLoading && <LoadingProgress progress={progress} />}

          {/* Preview Content */}
          {hasPassword && previewData && !isLoading && (
            <div className="h-full">
              {previewType === 'image' && (
                <ImagePreview url={previewData.url} fileName={previewData.fileName} />
              )}

              {previewType === 'video' && (
                <VideoPreview url={previewData.url} mimeType={previewData.mimeType} />
              )}

              {previewType === 'audio' && (
                <AudioPreview
                  url={previewData.url}
                  fileName={previewData.fileName}
                  mimeType={previewData.mimeType}
                />
              )}

              {previewType === 'pdf' && (
                <PDFPreview url={previewData.url} fileName={previewData.fileName} />
              )}

              {previewType === 'code' && previewData.textContent && (
                <CodePreview
                  content={previewData.textContent}
                  fileName={previewData.fileName}
                  language={language}
                />
              )}

              {previewType === 'text' && previewData.textContent && (
                <CodePreview
                  content={previewData.textContent}
                  fileName={previewData.fileName}
                  language="plaintext"
                />
              )}

              {previewType === 'json' && previewData.textContent && (
                <JSONPreview
                  content={previewData.textContent}
                  fileName={previewData.fileName}
                />
              )}

              {previewType === 'csv' && previewData.textContent && (
                <CSVPreview
                  content={previewData.textContent}
                  fileName={previewData.fileName}
                />
              )}

              {previewType === 'markdown' && previewData.textContent && (
                <MarkdownPreview
                  content={previewData.textContent}
                  fileName={previewData.fileName}
                />
              )}

              {previewType === 'unsupported' && (
                <UnsupportedPreview
                  fileName={previewData.fileName}
                  mimeType={previewData.mimeType}
                  fileSize={previewData.fileSize}
                  onDownload={downloadFromPreview}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer with keyboard shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2 border-t-4 border-black bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">Esc</kbd>
              {' '}Close
            </span>
            {files.length > 1 && (
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs ml-1">→</kbd>
                {' '}Navigate
              </span>
            )}
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">Ctrl</kbd>
              {' + '}
              <kbd className="px-1.5 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">F</kbd>
              {' '}Fullscreen
            </span>
          </div>
          <span className="font-mono">
            {previewType.toUpperCase()} • {currentFile.mimeType || 'Unknown type'}
          </span>
        </div>
      </div>
    </div>
  );
}
