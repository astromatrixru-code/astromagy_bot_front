"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AddressAutocompleteProps {
    value: string;
    onChange: (value: string, lat?: number, lon?: number) => void;
    placeholder?: string;
    apiToken: string;
}

interface GeoapifyFeature {
    properties: {
        formatted: string;
        lat: number;
        lon: number;
        place_id: string;
    };
}

export function AddressAutocomplete({
    value,
    onChange,
    placeholder = "Введите адрес...",
    apiToken,
}: AddressAutocompleteProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);
    const [suggestions, setSuggestions] = React.useState<GeoapifyFeature[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchSuggestions = React.useCallback(
        async (query: string) => {
            if (!query || query.length < 3) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&lang=ru&limit=5&apiKey=${apiToken}`
                );
                const data = await response.json();
                setSuggestions(data.features || []);
            } catch (error) {
                console.error("Geoapify error:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [apiToken]
    );

    React.useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => {
            if (inputValue && inputValue !== value) {
                fetchSuggestions(inputValue);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue, fetchSuggestions, value, open]);

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-10 text-left items-start py-2 px-3 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <span className="truncate whitespace-normal">
                        {value || placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 mt-1" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Поиск адреса..."
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        {isLoading && (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-muted-foreground">Загрузка...</span>
                            </div>
                        )}
                        {!isLoading && suggestions.length === 0 && inputValue.length >= 3 && (
                            <CommandEmpty>Адрес не найден.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {suggestions.map((feature) => (
                                <CommandItem
                                    key={feature.properties.place_id}
                                    value={feature.properties.formatted}
                                    onSelect={() => {
                                        onChange(
                                            feature.properties.formatted,
                                            feature.properties.lat,
                                            feature.properties.lon
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === feature.properties.formatted ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {feature.properties.formatted}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
