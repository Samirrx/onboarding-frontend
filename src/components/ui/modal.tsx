import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
 
interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  firstButtonText?: string;
  secondButtonText?: string;
  secondButtonFormRef?: string;
  firstButtonVariant?: string;
  width?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | string;
  isDisabled?: boolean;
  childrenStyle?: React.CSSProperties;
  isCloseVisible?: boolean;
  className?: string;
}
 
const Modal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  onCancel,
  children,
  width,
  firstButtonText,
  secondButtonText,
  secondButtonFormRef,
  firstButtonVariant = '',
  isDisabled = false,
  childrenStyle,
  isCloseVisible = true,
  className = ''
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        // isCloseVisible={isCloseVisible}
        className={`max-w-[${width}rem] min-w-[${width}rem] width-[${width}rem] motion-preset-expand min-h-44 motion-duration-700 ${className} `}
        style={{ width: width }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription
            className="max-h-[calc(100vh-200px)] overflow-hidden"
            style={childrenStyle}
          >
            {children}
          </DialogDescription>
        </DialogHeader>
        {(secondButtonText || secondButtonText) && (
          <DialogFooter className="absolute bottom-0 left-0 right-0 z-[100000] px-8 py-4">
            <div className="flex justify-end gap-4">
              {firstButtonText && (
                <Button variant="outline" onClick={onCancel}>
                  {firstButtonText}
                </Button>
              )}
              {secondButtonText && (
                <Button
                  {...(secondButtonFormRef
                    ? { form: secondButtonFormRef, type: 'submit' }
                    : {})}
                  onClick={onConfirm}
                  className="font-bold"
                  disabled={isDisabled}
                >
                  {secondButtonText}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
 
export { Modal };