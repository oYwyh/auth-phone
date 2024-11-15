"use client"

import { forgetPassword, signIn } from "@/lib/auth-client"; //import the auth client
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { loginSchema, TLoginSchema } from "@/app/(unauthenticated)/(authentication)/auth.types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LoadingBtn from "@/components/loading-btn";
import { useVerifyStore } from "@/app/(unauthenticated)/(authentication)/store";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()
    const value = useVerifyStore((state) => state.value)
    const context = useVerifyStore((state) => state.context)

    if (!value) return <>Loading...</>

    const login = async (data: TLoginSchema) => {
        setIsLoading(true)
        if (context == 'email') {
            await signIn.email({
                email: value || data.value,
                password: data.password,
            }, {
                onSuccess: () => {
                    setIsLoading(false)
                    redirect("/")
                },
                onError: (ctx) => {
                    toast({
                        title: ctx.error.message,
                        description: "Please try again",
                        variant: "destructive",
                    })
                    setIsLoading(false)
                },
            });
        } else if (context == 'phoneNumber') {
            await signIn.phoneNumber({
                phoneNumber: value || data.value,
                password: data.password,
            }, {
                onSuccess: () => {
                    setIsLoading(false)
                    redirect("/")
                },
                onError: (ctx: any) => {
                    toast({
                        title: ctx.error.message,
                        description: "Please try again",
                        variant: "destructive",
                    })
                    setIsLoading(false)
                },
            });
        }
    }


    const form = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            value: value || '',
            password: "",
        }
    });

    const resetPassword = async () => {
        if (!value) return;
        if (context != 'email') {
            toast({
                title: "Password Reset functionality only works for emals at the moment",
                variant: 'destructive'
            })
            return;
        }
        const { error } = await forgetPassword({
            email: value,
            redirectTo: "/reset-password",
        });

        if (!error) {
            toast({
                title: "Password Reset Link Sent Successfully",
                description: "May Take 1-5 Minutes",
            })
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(login)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="value"
                            defaultValue={value}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">{context}</FormLabel>
                                    <FormControl>
                                        <Input disabled placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>Forget Your Password, <span className="cursor-pointer text-blue-600 underline" onClick={() => resetPassword()}>Click Here</span></div>
                    </div>
                    <LoadingBtn isLoading={isLoading} label="Login" />
                </form>
            </Form>
        </div>
    );
}