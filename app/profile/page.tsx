'use client';

import { auth } from '@/auth'

export default async function ProfilePage () {
    const session = await auth();
    const user = session?.user;
    return (
        <div className="flex-1 space-y-6">
            <div className="px-4 py-6 border-b bg-background md:px-6 md:py-8">
                <div className="max-w-2xl mx-auto md:px-6">
                    <div className="space-y-1 md:-mx-8">
                        <h1 className="text-2xl font-bold">{user?.user_metadata.name}&apos;s Profile</h1>
                        <div className="text-sm text-muted-foreground">
                            {user?.user_metadata.email}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-6 md:px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold">Profile</h2>
                            <div className="text-sm text-muted-foreground">
                                This information will be displayed publicly so be careful what you share.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
