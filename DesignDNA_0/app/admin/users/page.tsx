"use client";

import { useCallback, useEffect, useState } from "react";

import {
    getUsers,
    getUser,
    updateRole,
    toggleUser,
    deleteUser,
    AdminUser,
} from "@/app/services/admin";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // ============================================
    // LOAD USERS
    // ============================================
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getUsers(page, 10, search);
            setUsers(response.users);
            setPages(response.pages);
            setTotalUsers(response.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // ============================================
    // VIEW USER
    // ============================================
    async function handleView(id: number) {
        try {
            const user = await getUser(id);
            setSelectedUser(user);
            setShowModal(true);
        } catch (err) {
            console.error(err);
        }
    }

    // ============================================
    // CHANGE ROLE
    // ============================================
    async function handleRole(id: number, role: string) {
        try {
            await updateRole(id, role);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    }

    // ============================================
    // ENABLE / DISABLE
    // ============================================
    async function handleToggle(id: number) {
        try {
            await toggleUser(id);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    }

    // ============================================
    // DELETE
    // ============================================
    async function confirmDelete() {
        if (!deleteId) return;
        try {
            await deleteUser(deleteId);
            setDeleteId(null);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold">User Management</h1>
                    <p className="text-zinc-400 mt-2">
                        Manage all registered DesignDNA users.
                    </p>
                </div>
                <div className="rounded-xl bg-blue-600 px-6 py-4">
                    <p className="text-sm">Total Users</p>
                    <h2 className="text-3xl font-bold">{totalUsers}</h2>
                </div>
            </div>

            {/* Search */}
            <div className="mb-8 flex gap-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 outline-none focus:border-blue-500"
                />
            </div>

            {/* User Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <table className="w-full">
                    <thead className="bg-zinc-800">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Role</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Joined</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-zinc-500">
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-zinc-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t border-zinc-800 hover:bg-zinc-800/50 transition"
                                >
                                    <td className="p-4">
                                        <div className="font-semibold">{user.name}</div>
                                    </td>

                                    <td className="p-4 text-zinc-300">{user.email}</td>

                                    <td className="p-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRole(user.id, e.target.value)}
                                            className="rounded-lg bg-zinc-800 px-3 py-2"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                user.is_active ? "bg-green-600" : "bg-red-600"
                                            }`}
                                        >
                                            {user.is_active ? "Active" : "Disabled"}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleView(user.id)}
                                                className="rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-700"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() => handleToggle(user.id)}
                                                className={`rounded-lg px-3 py-2 text-white ${
                                                    user.is_active
                                                        ? "bg-yellow-600 hover:bg-yellow-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >
                                                {user.is_active ? "Disable" : "Enable"}
                                            </button>

                                            <button
                                                onClick={() => setDeleteId(user.id)}
                                                className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-700 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">User Details</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUser(null);
                                }}
                                className="text-zinc-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-zinc-500 text-sm">Name</p>
                                <p className="font-semibold">{selectedUser.name}</p>
                            </div>

                            <div>
                                <p className="text-zinc-500 text-sm">Email</p>
                                <p>{selectedUser.email}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <p className="text-zinc-500 text-sm">Designs</p>
                                    <p className="text-2xl font-bold">
                                        {selectedUser.analysis_count}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-zinc-500 text-sm">Logos</p>
                                    <p className="text-2xl font-bold">
                                        {selectedUser.logo_count}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-zinc-500 text-sm">Avg Score</p>
                                    <p className="text-2xl font-bold text-green-400">
                                        {selectedUser.average_score}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-zinc-500 text-sm">Joined</p>
                                <p>{new Date(selectedUser.created_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUser(null);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md">
                        <h2 className="text-2xl font-bold">Delete User</h2>
                        <p className="text-zinc-400 mt-3">This action cannot be undone.</p>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-5 py-3 rounded-xl bg-zinc-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
                <p className="text-zinc-400">
                    Page {page} of {pages}
                </p>
                <div className="flex gap-3">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-5 py-2 rounded-lg bg-zinc-800 disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <button
                        disabled={page === pages}
                        onClick={() => setPage(page + 1)}
                        className="px-5 py-2 rounded-lg bg-blue-600 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}