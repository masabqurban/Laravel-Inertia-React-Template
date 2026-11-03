import { Form } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { ManagedUser, Option, Role, UserStatus } from '@/types';

type UserFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Edit this user, or create a new one when omitted. */
    user?: ManagedUser;
    roles: Option<Role>[];
    statuses: Option<UserStatus>[];
};

/**
 * Create or edit a user. Validation happens on the server (Form Requests);
 * Inertia's <Form> puts the errors back on each field. The Wayfinder action
 * supplies the URL and method, so a renamed route is a type error here.
 */
export function UserFormDialog({
    open,
    onOpenChange,
    user,
    roles,
    statuses,
}: UserFormDialogProps) {
    const action = user
        ? UserController.update.form(user)
        : UserController.store.form();
    // Admins can't change their own role or status; the server enforces it too.
    const canChangeAccess = user ? user.can.change_access : true;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user ? 'Edit user' : 'Add user'}</DialogTitle>
                    <DialogDescription>
                        {user
                            ? `Update ${user.name}'s details and access.`
                            : 'Invite a new member. They set their password with "Forgot password".'}
                    </DialogDescription>
                </DialogHeader>

                {/* Keyed so reopening for another user starts from fresh defaults. */}
                <Form
                    key={user?.id ?? 'new'}
                    {...action}
                    options={{ preserveScroll: true }}
                    onSuccess={() => onOpenChange(false)}
                    className="grid gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="user-name">Full name</Label>
                                <Input
                                    id="user-name"
                                    name="name"
                                    defaultValue={user?.name}
                                    required
                                    autoComplete="off"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="user-email">Email</Label>
                                <Input
                                    id="user-email"
                                    name="email"
                                    type="email"
                                    defaultValue={user?.email}
                                    required
                                    autoComplete="off"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {canChangeAccess ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="user-role">Role</Label>
                                        <Select
                                            name="role"
                                            defaultValue={
                                                user?.role ?? 'viewer'
                                            }
                                        >
                                            <SelectTrigger
                                                id="user-role"
                                                className="w-full"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem
                                                        key={role.value}
                                                        value={role.value}
                                                    >
                                                        {role.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="user-status">
                                            Status
                                        </Label>
                                        <Select
                                            name="status"
                                            defaultValue={
                                                user?.status ?? 'invited'
                                            }
                                        >
                                            <SelectTrigger
                                                id="user-status"
                                                className="w-full"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    You can&apos;t change your own role or
                                    status.
                                </p>
                            )}

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    {user ? 'Save changes' : 'Add user'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
