import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { DateValue } from "@internationalized/date";
import { availableTimes } from "../data/available-times";
import { useMemo, useState, useEffect } from "react";
import { CalendarData } from "../hooks/useCalendarData";
import PickerWheel from "../components/right-panel/picker-wheel";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormField, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    combinedFormSchema,
    type CombinedFormValues,
    defaultTimeAndDateValues,
    defaultDurationValues,
    defaultPlatformValues,
} from "@/features/show-calendar/utils/schema";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

type CombinedFormInputValues = z.input<typeof combinedFormSchema>;

interface RightPanelProps {
    readonly timeZone: string;
    readonly date: DateValue;
    readonly calendarData: CalendarData;
    readonly onTimeSelect: (data: CombinedFormValues) => void;
    readonly onDateTimeChange: (date: Date) => void;
}

export function RightPanel({
    timeZone,
    date,
    calendarData,
    onTimeSelect,
    onDateTimeChange,
}: RightPanelProps) {
    const searchParams = useSearchParams();

    // GET DATE PARTS
    const [dayName, monthName, dayNumber, yearNumber] = date
        .toDate(timeZone)
        .toLocaleDateString("en-CH", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        .split(" ");

    const dateString = date.toString(); // GET DATE STRING
    const availableTimesCount = calendarData[dateString] ?? 0; // GET AVAILABLE TIMES COUNT
    const [resetKey, setResetKey] = useState(0); // STATE FOR RESET KEY
    const [isLoading, setIsLoading] = useState(false); // STATE FOR LOADING
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const filteredAvailableTimes = useMemo(() => {
        // IF NO AVAILABLE TIMES, RETURN EMPTY ARRAY
        if (availableTimesCount === 0) return [];

        // IF AVAILABLE TIMES COUNT IS GREATER THAN OR EQUAL TO AVAILABLE TIMES, RETURN AVAILABLE TIMES
        if (availableTimesCount >= availableTimes.length) return availableTimes;

        const timesCopy = [...availableTimes]; // COPY AVAILABLE TIMES
        const result = []; // RESULT ARRAY

        // LOOP THROUGH AVAILABLE TIMES COUNT
        for (let i = 0; i < availableTimesCount; i++) {
            if (timesCopy.length > 0) {
                const randomIndex = Math.floor(Math.random() * timesCopy.length); // GET RANDOM INDEX
                result.push(timesCopy[randomIndex]); // PUSH RANDOM TIME TO RESULT
                timesCopy.splice(randomIndex, 1); // REMOVE RANDOM TIME FROM TIMES COPY
            }
        }

        // SORT RESULT BY TIME
        return result.sort((a, b) => {
            return a["24"].localeCompare(b["24"]); // SORT BY TIME
        });
    }, [availableTimesCount]);

    // HANDLE DATE CHANGE
    useEffect(() => {
        setIsLoading(true); // ACTIVATE LOADING
        setResetKey((prev) => prev + 1);

        // SIMULATE LOADING DELAY
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false); // DISABLE LOADING AFTER DELAY
        }, 500);

        return () => clearTimeout(loadingTimeout);
    }, [date, availableTimesCount]);

    // INITIALIZE DEFAULT VALUES FROM URL PARAMS
    const defaultValues = useMemo(
        () => ({
            ...defaultTimeAndDateValues,
            selectedDate: date.toString(),
            selectedTime: "",
            timeFormat: (searchParams.get("timeFormat") as "12" | "24") ?? "24",

            // DURATION
            duration: searchParams.get("duration") ?? defaultDurationValues.duration,
            break: {
                hasBreak: searchParams.get("hasBreak") === "true",
                breakDuration: parseInt(searchParams.get("breakDuration") ?? "5"),
            },
            buffer: {
                hasBuffer: searchParams.get("hasBuffer") === "true",
                bufferDuration: parseInt(searchParams.get("bufferDuration") ?? "15"),
            },
            delay: {
                hasDelay: searchParams.get("hasDelay") === "true",
                delayDuration: parseInt(searchParams.get("delayDuration") ?? "10"),
            },
            flexible: {
                isFlexible: searchParams.get("isFlexible") === "true",
            },

            // PLATFORM
            platform: searchParams.get("platform") ?? defaultPlatformValues.platform,
            customLink: searchParams.get("customLink") === "true",
            webcam: searchParams.get("isWebcam") === "true",
            meetingUrl: searchParams.get("meetingUrl") ?? undefined,
            phone: searchParams.get("phoneNumber")
                ? { phoneNumber: searchParams.get("phoneNumber")! }
                : undefined,
            location: searchParams.get("location")
                ? { location: searchParams.get("location")! }
                : undefined,
            isPhysical: searchParams.get("isPhysical") === "true",
        }),
        [date, searchParams]
    );

    // INITIALIZE FORM WITH COMBINED FORM SCHEMA AND DEFAULT VALUES
    const form = useForm<CombinedFormInputValues>({
        resolver: zodResolver(combinedFormSchema),
        defaultValues,
    });

    // UPDATE FORM WHEN URL PARAMS CHANGE
    useEffect(() => {
        const values = form.getValues();
        const selectedTime = values.selectedTime;
        form.reset({ ...defaultValues, selectedTime });
    }, [defaultValues, form]);

    // HANDLE FORM SUBMISSION
    const onSubmit = (data: CombinedFormInputValues) => {
        const parsedData = combinedFormSchema.parse(data);
        const [hours, minutes] = parsedData.selectedTime.split(":").map(Number);
        const newDate = new Date(date.toDate(timeZone));
        newDate.setHours(hours, minutes);
        onDateTimeChange(newDate);
        onTimeSelect(parsedData);
    };

    // HANDLE TIME SELECTION - FOR SCROLL
    const handleTimeChange = (newSelectedTime: string) => {
        setSelectedTime(newSelectedTime);
        form.setValue("selectedTime", newSelectedTime);

        const currentValues = form.getValues();
        form.reset(
            { ...currentValues, selectedTime: newSelectedTime },
            { keepDefaultValues: true }
        );

        const [hours, minutes] = newSelectedTime.split(":").map(Number);
        const newDate = new Date(date.toDate(timeZone));
        newDate.setHours(hours, minutes);
        onDateTimeChange(newDate);
    };

    // HANDLE TIME CLICK - FOR CLICK
    const handleTimeClick = (newSelectedTime: string) => {
        if (selectedTime === newSelectedTime) {
            const currentValues = form.getValues();
            const formData = combinedFormSchema.parse({
                ...currentValues,
                selectedTime: newSelectedTime,
            });
            onTimeSelect(formData);
        } else {
            handleTimeChange(newSelectedTime);
        }
    };

    const timeFormat = form.watch("timeFormat") ?? "24";

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // CHECK IF WE HAVE A SELECTED TIME
                    if (!form.getValues("selectedTime")) {
                        return;
                    }

                    // SUBMIT FORM WITH CURRENT VALUES
                    const formData = form.getValues();
                    onSubmit(formData);
                }}
            >
                <Tabs
                    defaultValue="24"
                    className="flex flex-col w-[280px] border-l border-neutral-200 dark:border-neutral-800 pl-6"
                    onValueChange={(value) => form.setValue("timeFormat", value as "12" | "24")}
                >
                    {/* DATE */}
                    <div className="flex justify-between items-center mb-2">
                        <p
                            aria-hidden
                            className="flex-1 align-center font-bold text-md text-neutral-900 dark:text-neutral-100"
                        >
                            {dayName}{" "}
                            <span className="text-neutral-500 dark:text-neutral-400">
                                {dayNumber} {monthName} {yearNumber}
                            </span>
                        </p>
                    </div>

                    {/* PICKER WHEEL */}
                    <TabsContent
                        value={timeFormat}
                        className="flex-grow flex flex-col mt-10"
                    >
                        {isLoading ? (
                            <div className="flex flex-col items-center space-y-2 mr-14">
                                <Skeleton className="h-12 w-36" />
                                <Skeleton className="h-12 w-44" />
                                <Skeleton className="h-12 w-52 bg-red-500" />
                                <Skeleton className="h-12 w-44" />
                                <Skeleton className="h-12 w-36" />
                            </div>
                        ) : (
                            <FormField
                                control={form.control}
                                name="selectedTime"
                                render={() => (
                                    <FormControl>
                                        <PickerWheel
                                            key={resetKey}
                                            items={filteredAvailableTimes.map((time) => ({
                                                value: time[timeFormat],
                                                isFavorite: time.preferedTime,
                                            }))}
                                            onChange={(value) => handleTimeChange(value)}
                                            onItemClick={(value) => handleTimeClick(value)}
                                            initialSelectedItem={selectedTime ?? undefined}
                                        />
                                    </FormControl>
                                )}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    );
}
