"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/app/store/userStore";
import { updateProfile } from "@/app/api/user";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/date-time-picker";
import logger from "@/lib/logger";



const userSchema = z.object({
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    gender: z.enum(["MALE", "FEMALE"]),
    address: z.string().min(1, "Address is required"),
    latitude: z.number(),
    longitude: z.number(),
    birthDate: z.date({
        message: "Date of birth is required",
    }),
});

type UserFormValues = z.infer<typeof userSchema>;

export function UserProfileForm() {
    const [step, setStep] = useState(1);
    const { user } = useUserStore();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        mode: "onChange",
        defaultValues: {
            username: user?.username || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            gender: user?.gender || "MALE",
            address: user?.address || "",
            birthDate: user?.birthDate ? new Date(user.birthDate) : undefined,
            latitude: user?.latitude,
            longitude: user?.longitude,
        },
    });

    // Update form when user data changes
    useEffect(() => {
        if (user) {
            form.reset({
                ...form.getValues(),
                username: user.username || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                address: user.address || "",
                email: user.email || "",
                gender: user.gender || "MALE",
                birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
                latitude: user.latitude,
                longitude: user.longitude,
            });
        }
    }, [user, form]);

    const nextStep = async () => {
        const fieldsToValidate = step === 1
            ? ["gender", "email"] as const
            : [] as const;

        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) {
            setStep(2);
        }
    };

    const prevStep = () => setStep(1);

    async function onSubmit(data: UserFormValues) {
        try {
            logger.info({ msg: "User Profile Form Submitting", data });

            const updatedUser = await updateProfile({
                ...data,
                birthDate: data.birthDate.toISOString(),
            });

            const { updateUser } = useUserStore.getState();
            updateUser(updatedUser);

            logger.info({ msg: "User Profile Updated Successfully", updatedUser });
        } catch (error: unknown) {
            let message = "An unknown error occurred";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.response?.data || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            logger.error({
                msg: "Failed to update user profile",
                error: message
            });
        }
    }

    const { errors } = form.formState;

    // Logic to determine if steps are valid for button states
    const step1Fields = ["email", "gender"] as const;
    const isStep1Valid = step1Fields.every(field => {
        const value = form.watch(field);
        return value !== undefined && value !== null && value !== "" && !errors[field];
    });

    const step2Fields = ["birthDate", "address", "latitude", "longitude"] as const;
    const isStep2Valid = step2Fields.every(field => {
        const value = form.watch(field);
        // For optional fields, if they are not filled, they are considered valid for the purpose of enabling the button
        // unless they have an error. If they are filled, they must be valid.
        if (userSchema.shape[field].isOptional() && (value === undefined || value === null || value === "")) {
            return true; // Optional field not filled is considered valid for button state
        }
        return value !== undefined && value !== "" && value !== null && !errors[field];
    });


    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="space-y-4">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold tracking-tight">Profile Setup</CardTitle>
                    <div className="relative pt-2 max-w-sm mx-auto">
                        {/* Progress Line */}
                        <div className="absolute top-7 left-0 right-0 h-0.5 bg-muted z-0">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: step === 1 ? '0%' : '100%' }}
                            />
                        </div>

                        <div className="flex justify-between items-center mb-2 relative z-10">
                            {[1, 2].map((s) => (
                                <div key={s} className="flex flex-col items-center">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                                        "bg-card", // Solid background to hide the line
                                        step === s
                                            ? "border-primary text-primary scale-110 shadow-primary/20 z-20"
                                            : step > s
                                                ? "bg-primary border-primary text-primary-foreground z-20"
                                                : "border-muted text-muted-foreground z-20"
                                    )}>
                                        {step > s ? <Check className="w-5 h-5" /> : s}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-semibold mt-2 transition-colors duration-300",
                                        step === s ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {s === 1 ? "Личные данные" : "Рождение и локация"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {step === 1 && (
                    <CardDescription className="text-sm text-primary/80 bg-primary/5 p-3 rounded-lg border border-primary/10 font-medium">
                        Для дальнейшего использования сервиса вам необходимо заполнить данные
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 pb-2 border-b border-muted">
                                        <div className="w-1 h-6 bg-primary rounded-full" />
                                        <h3 className="text-lg font-semibold tracking-tight">Personal Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="johndoe" {...field} value={field.value ?? ""} readOnly className="bg-muted/50 border-muted-foreground/10" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="john@example.com"
                                                            type="email"
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            className={cn(
                                                                (errors.email || !field.value) && "border-destructive focus-visible:ring-destructive"
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} value={field.value ?? ""} readOnly className="bg-muted/50 border-muted-foreground/10" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" {...field} value={field.value ?? ""} readOnly className="bg-muted/50 border-muted-foreground/10" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                                    <FormControl>
                                                        <SelectTrigger className={cn(
                                                            "w-full",
                                                            (errors.gender || !field.value) && "border-destructive focus:ring-destructive"
                                                        )}>
                                                            <SelectValue placeholder="Select a gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Male</SelectItem>
                                                        <SelectItem value="FEMALE">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 pb-2 border-b border-muted">
                                        <div className="w-1 h-6 bg-primary rounded-full" />
                                        <h3 className="text-lg font-semibold tracking-tight">Birth Details</h3>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="birthDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-xs uppercase text-muted-foreground font-bold">Date and Time of Birth</FormLabel>
                                                <FormControl>
                                                    <DateTimePicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-muted/30">
                                    <div className="flex items-center space-x-2 pb-2 border-b border-muted">
                                        <div className="w-1 h-6 bg-primary rounded-full" />
                                        <h3 className="text-lg font-semibold tracking-tight">Location</h3>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase text-muted-foreground font-bold">Address</FormLabel>
                                                <FormControl>
                                                    <div className={cn((errors.address || !field.value) && "rounded-md border border-destructive")}>
                                                        <AddressAutocomplete
                                                            value={field.value ?? ""}
                                                            onChange={(val, lat, lon) => {
                                                                field.onChange(val);
                                                                if (lat !== undefined) form.setValue("latitude", lat);
                                                                if (lon !== undefined) form.setValue("longitude", lon);
                                                            }}
                                                            apiToken={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || ""}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="latitude"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase text-muted-foreground font-bold">Latitude</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="any" {...field} value={field.value ?? ""} readOnly className="bg-muted/30" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="longitude"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase text-muted-foreground font-bold">Longitude</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="any" {...field} value={field.value ?? ""} readOnly className="bg-muted/30" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <CardFooter className="flex justify-between pt-6 border-t border-muted/30">
                            {step === 2 && (
                                <Button type="button" variant="outline" onClick={prevStep} className="hover:bg-muted font-medium">
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            )}
                            {step === 1 ? (
                                <Button
                                    type="button"
                                    className="ml-auto px-6 font-semibold"
                                    onClick={nextStep}
                                    disabled={!isStep1Valid}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="ml-auto px-8 font-bold shadow-lg shadow-primary/20"
                                    disabled={!isStep2Valid || form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
                                </Button>
                            )}
                        </CardFooter>
                    </form>
                </Form>
            </CardContent >
        </Card >
    );
}
