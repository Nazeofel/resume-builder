'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ComboboxProps {
    value?: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    apiEndpoint?: string;
    staticOptions?: string[];
}

export function Combobox({
    value,
    onSelect,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    apiEndpoint,
    staticOptions = [],
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<string[]>(staticOptions);
    const [loading, setLoading] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    // Handle outside click to close
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounce search for API
    // React.useEffect(() => {

    //     if (inputValue === ' ') {
    //         return;
    //     }

    //     if (!apiEndpoint || !inputValue) {
    //         if (!apiEndpoint) setOptions(staticOptions);
    //         return;
    //     }

    //     const timer = setTimeout(async () => {
    //         setLoading(true);
    //         try {
    //             const res = await fetch(`${apiEndpoint}?query=${encodeURIComponent(inputValue)}`);
    //             if (res.ok) {
    //                 const data = await res.json();
    //                 setOptions(data);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch options:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }, 300);

    //     return () => clearTimeout(timer);
    // }, [inputValue, apiEndpoint, staticOptions]);

    // Filter static options if not using API
    const displayOptions = apiEndpoint
        ? options
        : options.filter(opt => opt.toLowerCase().includes(inputValue.toLowerCase()));

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between font-normal text-left"
                onClick={() => setOpen(!open)}
            >
                {value || placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="flex items-center border-b px-3">
                        <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={searchPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="py-1">
                        {loading && <div className="py-6 text-center text-sm">{loading ? 'Loading...' : emptyText}</div>}
                        {!loading && displayOptions.length === 0 && (
                            <div className="py-6 text-center text-sm">{emptyText}</div>
                        )}
                        {!loading && displayOptions.map((option) => (
                            <div
                                key={option}
                                className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-gray-100",
                                    value === option && "bg-gray-100"
                                )}
                                onClick={() => {
                                    onSelect(option);
                                    setOpen(false);
                                    setInputValue('');
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
