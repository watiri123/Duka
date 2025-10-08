import React from 'react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center space-x-2 ${className || ''}`}>
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* Page numbers */}
      {pages.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

// Export additional components that might be expected
export function PaginationContent({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center space-x-2">{children}</div>;
}

export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function PaginationLink({ 
  children, 
  isActive = false,
  onClick 
}: { 
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function PaginationPrevious({ 
  onClick,
  disabled = false 
}: { 
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      Previous
    </Button>
  );
}

export function PaginationNext({ 
  onClick,
  disabled = false 
}: { 
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      Next
    </Button>
  );
}