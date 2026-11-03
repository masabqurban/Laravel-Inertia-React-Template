import { Form } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { ManagedUser } from '@/types';

type DeleteUserDialogProps = {
    user: ManagedUser | null;
    onOpenChange: (open: boolean) => void;
};

/** Destructive actions always ask first, and name exactly what will be deleted. */
export function DeleteUserDialog({
    user,
    onOpenChange,
}: DeleteUserDialogProps) {
    return (
        <Dialog open={user !== null} onOpenChange={onOpenChange}>
            <DialogContent role="alertdialog">
                <DialogHeader>
                    <DialogTitle>Delete user?</DialogTitle>
                    <DialogDescription>
                        <span className="font-medium text-foreground">
                            {user?.name}
                        </span>{' '}
                        will lose access immediately. This can&apos;t be undone.
                    </DialogDescription>
                </DialogHeader>
                {user && (
                    <Form
                        {...UserController.destroy.form(user)}
                        options={{ preserveScroll: true }}
                        onSuccess={() => onOpenChange(false)}
                    >
                        {({ processing }) => (
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Delete user
                                </Button>
                            </DialogFooter>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
