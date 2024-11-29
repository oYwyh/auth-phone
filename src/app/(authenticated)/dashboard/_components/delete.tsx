'use client'

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LoadingBtn from "@/components/loading-btn";
import { deleteById } from "@/lib/db/queries";

export default function Delete({ userId, setPopOpen }: { userId: string, setPopOpen: Dispatch<SetStateAction<boolean>>; }) {
    const [open, setOpen] = useState<boolean>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        setIsLoading(true)
        const result = await deleteById(userId, 'user');

        if (result?.message) {
            toast({
                title: 'Success',
                description: result?.message
            });
            setIsLoading(false)
            setPopOpen(false)
            setOpen(false)
        }
    };

    return (
        <AlertDialog open={open}>
            <AlertDialogTrigger asChild>
                <Button variant={'destructive'}>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                    <LoadingBtn
                        isLoading={isLoading}
                        label="delete"
                        variant="destructive"
                        onClick={() => handleDelete()}
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}