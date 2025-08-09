'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";

export default function Header() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useUser();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutMenu(false);
    router.push("/"); // ログイン画面に遷移
  };

  return (
    <header className="w-full h-16 flex items-center px-4 bg-white shadow-md">
      {/* 戻るボタン（"<"） */}
      <div className="w-1/5 flex justify-start">
        <button
          onClick={() => router.back()}
          aria-label="戻る"
          className="text-3xl text-gray-800"
        >
          &lt;
        </button>
      </div>

      {/* ロゴ（3/5） */}
      <div className="w-3/5 flex justify-center">
        <img
          src="./images/name.png"
          alt="アプリロゴ"
          className="h-10 object-contain"
        />
      </div>

      {/* 右側のアクション */}
      <div className="w-1/5 flex justify-end items-center space-x-2 relative">
        {/* ホームアイコン */}
        <Link href="/home" aria-label="ホーム">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m4 0h5a1 1 0 001-1V10"
            />
          </svg>
        </Link>
        
        {/* ログアウトメニュー */}
        {isAuthenticated && (
          <>
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              aria-label="メニュー"
              className="w-6 h-6 text-gray-800 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3"/>
                <circle cx="12" cy="4" r="1"/>
                <circle cx="12" cy="20" r="1"/>
              </svg>
            </button>
            
            {/* ドロップダウンメニュー */}
            {showLogoutMenu && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  ログアウト
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}