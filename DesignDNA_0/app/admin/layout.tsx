"use client";

import AdminGuard from "../guards/AdminGuard";
import AdminLayout from "../components/admin/AdminLayout";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminGuard>
    );
}