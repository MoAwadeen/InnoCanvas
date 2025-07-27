
'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  const internalRef = React.useRef<HTMLTextAreaElement>(null);
  const combinedRef = (
    ref as React.RefObject<HTMLTextAreaElement>
  ) || internalRef;

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  React.useLayoutEffect(() => {
    const textarea = combinedRef.current;
    if (textarea) {
       // Set initial height
       textarea.style.height = 'auto';
       textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [props.value, combinedRef]);


  return (
    <textarea
      className={cn(
        'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'overflow-hidden', // Hide scrollbar
        className
      )}
      ref={combinedRef}
      onInput={handleInput}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
