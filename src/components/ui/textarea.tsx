
'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  const internalRef = React.useRef<HTMLTextAreaElement>(null);
  const combinedRef = (ref || internalRef) as React.RefObject<HTMLTextAreaElement>;

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
  React.useLayoutEffect(() => {
    const textarea = combinedRef.current;
    if (textarea) {
       textarea.style.height = 'auto'; // Reset height
       textarea.style.height = `${textarea.scrollHeight}px`;
    }
  // Effect dependencies can be tricky. Let's start with just the value.
  }, [props.value, combinedRef]);


  return (
    <textarea
      className={cn(
        'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none overflow-hidden',
        className
      )}
      ref={combinedRef}
      onInput={handleInput}
      rows={1}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };

    