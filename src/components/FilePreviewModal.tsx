import { X, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { FileItem } from '@/redux/filesSlice';
import { useState, useEffect } from 'react';

interface Props {
  file: FileItem;
  onClose: () => void;
}

const FilePreviewModal = ({ file, onClose }: Props) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState(false);

  const isImage = file.mimeType?.startsWith('image/');
  const isPdf = file.mimeType?.includes('pdf');

  useEffect(() => {
    if (isPdf && file.dataUrl) {
      setPdfError(false);
      // Convert data URL to blob URL for better PDF rendering
      try {
        // Handle different data URL formats
        let base64Data = file.dataUrl;
        if (base64Data.includes(',')) {
          base64Data = base64Data.split(',')[1];
        }
        
        // Decode base64
        const binaryData = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert string to Uint8Array
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }
        
        // Create blob and URL
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
        
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error converting PDF data URL to blob:', error);
        setPdfError(true);
      }
    }
  }, [isPdf, file.dataUrl]);

  const handleDownload = () => {
    if (file.dataUrl) {
      const link = document.createElement('a');
      link.href = file.dataUrl;
      link.download = file.name;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-white font-medium truncate">{file.name}</span>
          <span className="text-white/40 text-sm whitespace-nowrap">
            {file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">
        {isImage && file.dataUrl ? (
          <img
            src={file.dataUrl}
            alt={file.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          />
        ) : isPdf && pdfBlobUrl ? (
          <iframe
            src={pdfBlobUrl}
            className="w-full h-full rounded-lg bg-white"
            title={file.name}
            onLoad={() => setPdfError(false)}
            onError={() => setPdfError(true)}
          />
        ) : isPdf && pdfError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="text-center text-white/50">
              <p className="text-lg mb-2">Impossible d'afficher le PDF</p>
              <p className="text-sm mb-4">Le lecteur PDF n'est pas disponible</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                Télécharger le PDF
              </button>
            </div>
          </div>
        ) : isPdf && file.dataUrl ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white/50">
              <p className="text-lg mb-2">Chargement du PDF...</p>
              <p className="text-sm">Veuillez patienter</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/50">
            <p className="text-lg mb-2">Aperçu non disponible</p>
            <p className="text-sm">Ce type de fichier ne peut pas être prévisualisé</p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {(isImage || isPdf) && (
        <div className="flex items-center justify-center gap-1 py-3 bg-black/50 border-t border-white/10">
          {isImage && (
            <>
              <button
                onClick={() => setZoom(z => Math.max(25, z - 25))}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-white/60 text-sm w-16 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(300, z + 25))}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <div className="w-px h-5 bg-white/20 mx-2" />
              <button
                onClick={() => setRotation(r => r + 90)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <div className="w-px h-5 bg-white/20 mx-2" />
              <span className="text-white/40 text-xs">R</span>
            </>
          )}
          {isPdf && (
            <>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
              <div className="w-px h-5 bg-white/20 mx-2" />
              <span className="text-white/40 text-xs">PDF</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilePreviewModal;
