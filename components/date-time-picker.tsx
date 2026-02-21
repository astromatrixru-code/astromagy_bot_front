"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(value)

    // Sync internal state with external value
    React.useEffect(() => {
        setDate(value)
    }, [value])

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            setDate(undefined)
            onChange?.(undefined)
            return
        }

        const newDate = new Date(selectedDate)
        if (date) {
            newDate.setHours(date.getHours())
            newDate.setMinutes(date.getMinutes())
        } else {
            newDate.setHours(12)
            newDate.setMinutes(0)
        }

        setDate(newDate)
        onChange?.(newDate)
    }

    const handleTimeChange = (type: "hours" | "minutes" | "ampm", timeValue: string) => {
        if (!date) return

        const newDate = new Date(date)
        if (type === "hours") {
            const hours = parseInt(timeValue)
            const currentAmPm = date.getHours() >= 12 ? "PM" : "AM"
            if (currentAmPm === "PM" && hours < 12) {
                newDate.setHours(hours + 12)
            } else if (currentAmPm === "AM" && hours === 12) {
                newDate.setHours(0)
            } else {
                newDate.setHours(hours)
            }
        } else if (type === "minutes") {
            newDate.setMinutes(parseInt(timeValue))
        } else if (type === "ampm") {
            const hours = date.getHours()
            if (timeValue === "PM" && hours < 12) {
                newDate.setHours(hours + 12)
            } else if (timeValue === "AM" && hours >= 12) {
                newDate.setHours(hours - 12)
            }
        }

        setDate(newDate)
        onChange?.(newDate)
    }

    const displayHours = date ? date.getHours() % 12 || 12 : 12
    const ampm = date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM"

    return (
        <div className="flex flex-col gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal h-12 px-4 rounded-xl border-muted-foreground/20",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP HH:mm") : <span>Выберите дату и время</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-muted-foreground/10 shadow-2xl" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        className="rounded-t-2xl"
                    />
                    <div className="p-4 border-t border-muted bg-muted/5 rounded-b-2xl">
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                                <Select
                                    value={displayHours.toString()}
                                    onValueChange={(v) => handleTimeChange("hours", v)}
                                >
                                    <SelectTrigger className="w-[70px] h-9 rounded-lg">
                                        <SelectValue placeholder="HH" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                            <SelectItem key={h} value={h.toString()}>
                                                {h.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground font-bold">:</span>
                                <Select
                                    value={date ? date.getMinutes().toString() : "0"}
                                    onValueChange={(v) => handleTimeChange("minutes", v)}
                                >
                                    <SelectTrigger className="w-[70px] h-9 rounded-lg">
                                        <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                                            <SelectItem key={m} value={m.toString()}>
                                                {m.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={ampm}
                                    onValueChange={(v) => handleTimeChange("ampm", v)}
                                >
                                    <SelectTrigger className="w-[70px] h-9 rounded-lg">
                                        <SelectValue placeholder="AM/PM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AM">AM</SelectItem>
                                        <SelectItem value="PM">PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
