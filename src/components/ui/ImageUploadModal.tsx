'use client';

import { useCallback, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, RotateCw, Move, ZoomIn, ZoomOut } from 'lucide-react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Helper function
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Props interface
interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageFile: File) => Promise<void>;
  imgSrc: string;
  isUploading: boolean;
  fileSize?: number;
  originalFileName?: string;
}

const ImageUploadModal = ({
  isOpen,
  onClose,
  onSave,
  imgSrc,
  isUploading,
  fileSize,
  originalFileName
}: ImageUploadModalProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect] = useState(1);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const generateCroppedImage = useCallback(async () => {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    const centerX = (completedCrop.width * scaleX) / 2;
    const centerY = (completedCrop.height * scaleY) / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    ctx.restore();

    const blob = await offscreen.convertToBlob({ type: 'image/png' });
    return blob;
  }, [completedCrop, scale, rotate]);

  const handleSaveImage = async () => {
    try {
      const croppedImageBlob = await generateCroppedImage();
      const fileName = originalFileName || 'cropped-image.png';
      const croppedImageFile = new File([croppedImageBlob], fileName, {
        type: 'image/png',
        lastModified: Date.now()
      });

      await onSave(croppedImageFile);
      handleModalClose();
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleRotateLeft = () => setRotate((prev) => prev - 90);
  const handleRotateRight = () => setRotate((prev) => prev + 90);

  const handleModalClose = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()} className="w-[90vw] sm:max-w-[60%]">
      <DialogContent className="w-[90vw] max-w-[90vw]  overflow-hidden sm:max-w-[60%]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Edit Profile Image</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 flex-1 min-h-0">
          <div className="lg:col-span-1 flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
            {imgSrc && (
              <div className="relative max-w-full max-h-full overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  minWidth={50}
                  minHeight={50}
                  circularCrop
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc || '/placeholder.svg'}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxHeight: '400px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                    onLoad={onImageLoad}
                    className="transition-transform duration-200"
                  />
                </ReactCrop>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Scale</Label>
                <Badge variant="secondary">{scale.toFixed(2)}x</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <ZoomOut className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[scale]}
                  onValueChange={(value) => setScale(value[0])}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Rotation</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotateLeft}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-1" /> Left
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotateRight}
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4 mr-1" /> Right
                </Button>
              </div>
              <div className="text-center">
                <Badge variant="outline">{rotate}°</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Move className="w-4 h-4" /> Crop Area
              </Label>
              <p className="text-xs text-muted-foreground">
                Drag on the image to select crop area
              </p>
              {completedCrop && (
                <div className="text-xs space-y-1">
                  <div>Width: {Math.round(completedCrop.width)}px</div>
                  <div>Height: {Math.round(completedCrop.height)}px</div>
                </div>
              )}
              {fileSize && (
                <div className="text-xs mt-2">
                  File size: {formatFileSize(fileSize)}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4">
          <Button variant="outline" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveImage}
            disabled={!completedCrop || isUploading}
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>

        <canvas
          ref={previewCanvasRef}
          style={{
            display: 'none',
            width: completedCrop?.width,
            height: completedCrop?.height
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;