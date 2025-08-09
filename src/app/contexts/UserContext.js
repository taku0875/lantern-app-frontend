// app/contexts/UserContext.js
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// ユーザーコンテキストを作成
const UserContext = createContext();

// カスタムフックでコンテキストを使いやすくする
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// ユーザープロバイダーコンポーネント
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 初期化時にlocalStorageからユーザー情報を復元
    useEffect(() => {
        const initializeUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('authToken');
                
                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to restore user from localStorage:', error);
                // エラー時はlocalStorageをクリア
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
            } finally {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, []);

    // ログイン処理
    const login = (userData, token) => {
        setUser(userData);
        // localStorageにも保存（ページリロード対策）
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
    };

    // ログアウト処理
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    // ユーザー情報更新処理
    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    // コンテキストの値
    const value = {
        user,           // 現在のユーザー情報
        isLoading,      // 初期化中かどうか
        login,          // ログイン関数
        logout,         // ログアウト関数
        updateUser,     // ユーザー情報更新関数
        isAuthenticated: !!user  // 認証済みかどうか
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};