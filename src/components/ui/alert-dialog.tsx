import React from 'react';
import { Button } from './button';

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogTriggerProps {
  children: React.ReactElement<{ onClick?: () => void }>;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onClick?: () => void;
}

// Simple context for dialog state (simplified)
const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function AlertDialog({ open = false, onOpenChange, children }: AlertDialogProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  const setOpen = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <AlertDialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ children }: AlertDialogTriggerProps) {
  const { setOpen } = React.useContext(AlertDialogContext);
  
  return React.cloneElement(children, {
    onClick: () => setOpen(true),
  });
}

export function AlertDialogContent({ children }: AlertDialogContentProps) {
  const { open, setOpen } = React.useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ children }: AlertDialogHeaderProps) {
  return <div className="mb-4">{children}</div>;
}

export function AlertDialogFooter({ children }: AlertDialogFooterProps) {
  return <div className="flex justify-end gap-2 mt-6">{children}</div>;
}

export function AlertDialogTitle({ children }: AlertDialogTitleProps) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function AlertDialogDescription({ children }: AlertDialogDescriptionProps) {
  return <p className="text-sm text-gray-600 mt-2">{children}</p>;
}

export function AlertDialogAction({ children, onClick }: AlertDialogActionProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handleClick = () => {
    onClick?.();
    setOpen(false);
  };

  return (
    <Button onClick={handleClick}>
      {children}
    </Button>
  );
}

export function AlertDialogCancel({ children, onClick }: AlertDialogCancelProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handleClick = () => {
    onClick?.();
    setOpen(false);
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      {children}
    </Button>
  );
}