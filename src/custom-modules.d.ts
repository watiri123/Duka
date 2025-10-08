// Module declarations for versioned import specifiers used in the project.
// These imports are aliased in `vite.config.ts` (e.g. '@radix-ui/react-slot@1.1.2' -> '@radix-ui/react-slot').
// TypeScript doesn't understand those specifiers by default, so declare them as any modules.

declare module 'vaul@1.1.2';
declare module 'sonner@2.0.3';
declare module 'recharts@2.15.2';
declare module 'react-resizable-panels@2.1.7';
declare module 'react-hook-form@7.55.0';
declare module 'react-day-picker@8.10.1';
declare module 'next-themes@0.4.6';
declare module 'lucide-react@0.487.0';
declare module 'input-otp@1.4.2';
declare module 'embla-carousel-react@8.6.0';
declare module 'cmdk@1.1.1';
declare module 'class-variance-authority';
declare module '@radix-ui/react-tooltip';
declare module '@radix-ui/react-toggle';
declare module '@radix-ui/react-toggle-group';
declare module '@radix-ui/react-tabs';
declare module '@radix-ui/react-switch';
declare module '@radix-ui/react-slot';
declare module '@radix-ui/react-slider';
declare module '@radix-ui/react-separator';
declare module '@radix-ui/react-select';
declare module '@radix-ui/react-scroll-area';
declare module '@radix-ui/react-radio-group';
declare module '@radix-ui/react-progress';
declare module '@radix-ui/react-popover';
declare module '@radix-ui/react-navigation-menu';
declare module '@radix-ui/react-menubar';
declare module '@radix-ui/react-label';
declare module '@radix-ui/react-hover-card';
declare module '@radix-ui/react-dropdown-menu';
declare module '@radix-ui/react-dialog';
declare module '@radix-ui/react-context-menu';
declare module '@radix-ui/react-collapsible';
declare module '@radix-ui/react-checkbox';
declare module '@radix-ui/react-avatar';
declare module '@radix-ui/react-aspect-ratio';
declare module '@radix-ui/react-alert-dialog';
declare module '@radix-ui/react-accordion';

// A generic fallback for any other module specifier that contains an @ and a version-like suffix.
// If you still have other similarly versioned imports that cause errors,
// add explicit `declare module 'package@x.y.z';` lines above.
