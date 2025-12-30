import * as React from "react";
import { Coffee } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { breakOptionSchema, type BreakOptionValues } from "@/features/show-calendar/utils/schema";

type BreakOptionFormValues = BreakOptionValues;

interface BreakOptionProps {
    value: BreakOptionValues;
    onBreakOptionChange?: (values: BreakOptionValues) => void;
}

export function BreakOption({ value, onBreakOptionChange }: BreakOptionProps) {
    // INITIALIZE FORM WITH ZOD SCHEMA AND DEFAULT VALUES
    const form = useForm<BreakOptionFormValues>({
        resolver: zodResolver(breakOptionSchema),
        defaultValues: {
            hasBreak: value.hasBreak ?? false,
            breakDuration: value.breakDuration ?? 5,
        },
    });

    // UPDATE FORM WHEN EXTERNAL VALUES CHANGE
    React.useEffect(() => {
        form.reset({
            hasBreak: value.hasBreak ?? false,
            // IF HASBREAK IS TRUE AND BREAKDURATION IS 0, USE 5 AS DEFAULT VALUE
            breakDuration:
                value.hasBreak && (!value.breakDuration || value.breakDuration === 0)
                    ? 5
                    : value.breakDuration ?? 5,
        });
    }, [value, form]);

    // WATCH FOR CHANGES AND NOTIFY PARENT
    React.useEffect(() => {
        const subscription = form.watch((values) => {
            const normalizedValues: BreakOptionValues = {
                hasBreak: values.hasBreak ?? false,
                breakDuration: values.breakDuration ?? 5,
            };

            // IF HASBREAK IS TRUE AND BREAKDURATION IS 0, SET TO 5
            if (normalizedValues.hasBreak && normalizedValues.breakDuration <= 0) {
                form.setValue("breakDuration", 5);
                onBreakOptionChange?.({ ...normalizedValues, breakDuration: 5 });
            } else {
                onBreakOptionChange?.(normalizedValues);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, onBreakOptionChange]);

    // HANDLE SWITCH CHANGE
    const handleSwitchChange = (checked: boolean) => {
        form.setValue("hasBreak", checked);
        if (checked) {
            // IF SWITCH IS CHECKED, SET DURATION TO 5 IF IT IS 0
            const currentDuration = form.getValues("breakDuration");
            if (!currentDuration || currentDuration === 0) {
                form.setValue("breakDuration", 5);
            }
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4">
                {/* BREAK TOGGLE */}
                <FormField
                    control={form.control}
                    name="hasBreak"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Coffee className="w-4 h-4" />
                                <FormLabel className="text-sm font-medium leading-none">
                                    Add a break
                                </FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value ?? false}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* BREAK DURATION */}
                {(form.watch("hasBreak") ?? false) && (
                    <FormField
                        control={form.control}
                        name="breakDuration"
                        render={({ field }) => (
                            <FormItem className="ml-6">
                                <FormLabel className="text-sm font-medium mb-1 block">
                                    Break duration
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value || 5}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value < 5 ? 5 : value);
                                            }}
                                            max={30}
                                            min={5}
                                            step={5}
                                            className="w-full pr-20 bg-neutral-100 dark:bg-neutral-900"
                                        />
                                    </FormControl>
                                    <span className="absolute top-0 right-3 h-full flex items-center text-sm text-neutral-500">
                                        minutes
                                    </span>
                                </div>
                            </FormItem>
                        )}
                    />
                )}
            </form>
        </Form>
    );
}
