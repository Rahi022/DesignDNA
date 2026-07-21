"use client";

import { useState } from "react";

import {
  User,
  Save,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  Crown,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import {
  updateProfile,
  changePassword,
} from "../../services/user";

export default function SettingsPage() {

  const { user, refreshUser } = useAuth();

  /* ---------------- PROFILE ---------------- */

  const [name, setName] = useState(user?.name ?? "");

  const [savingProfile, setSavingProfile] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");

  /* ---------------- PASSWORD ---------------- */

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");

  /* ---------------- PROFILE SAVE ---------------- */

  async function handleProfileSave() {

    setSavingProfile(true);

    setProfileMessage("");

    try {

      await updateProfile({
        name,
      });

      await refreshUser();

      setProfileMessage(
        "Profile updated successfully!"
      );

    } catch (error) {

      setProfileMessage(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );

    } finally {

      setSavingProfile(false);

    }

  }

  /* ---------------- PASSWORD SAVE ---------------- */

  async function handlePasswordSave() {

    if (newPassword !== confirmPassword) {

      setPasswordMessage("Passwords do not match.");

      return;

    }

    setSavingPassword(true);

    setPasswordMessage("");

    try {

      await changePassword({

        current_password: currentPassword,

        new_password: newPassword,

      });

      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");

      setPasswordMessage(
        "Password updated successfully!"
      );

    } catch (error) {

      setPasswordMessage(
        error instanceof Error
          ? error.message
          : "Failed to update password."
      );

    } finally {

      setSavingPassword(false);

    }

  }

  return (

    <div className="max-w-6xl mx-auto space-y-8">

    {/* ================= HERO ================= */}

    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-blue-900/30 via-neutral-900 to-purple-900/30 p-10">

      {/* Background Glow */}

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

        {/* Left Side */}

        <div className="flex items-center gap-6">

          <div
            className="
              h-28
              w-28
              rounded-full
              bg-gradient-to-r
              from-blue-500
              to-purple-600
              flex
              items-center
              justify-center
              text-5xl
              font-bold
              shadow-2xl
              ring-4
              ring-blue-500/30
            "
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              {user?.name}
            </h1>

            <p className="text-gray-400 mt-2">
              {user?.email}
            </p>

            <div className="flex gap-3 mt-5">

              <span className="rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-sm text-blue-400">
                Premium Member
              </span>

              <span className="rounded-full bg-green-600/20 border border-green-500/30 px-4 py-2 text-sm text-green-400">
                Active
              </span>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="grid grid-cols-2 gap-5">

          <div className="rounded-2xl border border-neutral-800 bg-black/40 p-5 backdrop-blur hover:scale-105 transition">

            <p className="text-gray-400 text-sm">
              Account
            </p>

            <div className="flex items-center gap-2 mt-3">

              <Crown className="text-yellow-400" size={22} />

              <h3 className="text-xl font-bold">
                Premium
              </h3>

            </div>

          </div>

          <div className="rounded-2xl border border-neutral-800 bg-black/40 p-5 backdrop-blur hover:scale-105 transition">

            <p className="text-gray-400 text-sm">
              Security
            </p>

            <div className="flex items-center gap-2 mt-3">

              <ShieldCheck
                className="text-green-400"
                size={22}
              />

              <h3 className="text-xl font-bold">
                Protected
              </h3>

            </div>

          </div>

        </div>

      </div><br /><br /><br />

      {/* ================= PROFILE CARD ================= */}

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl hover:border-blue-500/50 transition-all duration-300">

        <div className="flex items-center gap-4 mb-8">

          <div className="h-14 w-14 rounded-2xl bg-blue-600/20 flex items-center justify-center">

            <User size={28} className="text-blue-400"/>

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Profile Information
            </h2>

            <p className="text-gray-400">
              Manage your personal account information.
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Name */}

          <div>

            <label className="text-gray-400 text-sm">

              Full Name

            </label>

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="
                mt-2
                w-full
                rounded-2xl
                bg-black
                border
                border-neutral-700
                px-5
                py-4
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/30
              "
            />

          </div>

          {/* Email */}

          <div>

            <label className="text-gray-400 text-sm">

              Email Address

            </label>

            <input
              value={user?.email ?? ""}
              disabled
              className="
                mt-2
                w-full
                rounded-2xl
                bg-neutral-800
                border
                border-neutral-700
                px-5
                py-4
                text-gray-500
                cursor-not-allowed
              "
            />

          </div>

        </div>

        {/* Success Message */}

        {profileMessage && (

          <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">

            {profileMessage}

          </div>

        )}

        {/* Bottom */}

        <div className="flex justify-between items-center mt-8">

          <div>

            <p className="text-gray-500 text-sm">

              Last updated just now

            </p>

          </div>

          <button
            onClick={handleProfileSave}
            disabled={savingProfile}
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              px-8
              py-4
              font-semibold
              transition-all
              hover:scale-105
              shadow-lg
              shadow-blue-500/20
            "
          >

            <Save size={20}/>

            {savingProfile
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>

      </div>

    </div>

  );

}