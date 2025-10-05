import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        getPasswords();
    }, []);

    const getPasswords = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/passwords`);

            if (!response.ok) {
                throw new Error('Failed to fetch passwords');
            }
            
            const passwords = await response.json();
            setPasswordArray(passwords);
        } catch (error) {
            console.error('Error fetching passwords:', error);
            showToast('Failed to load passwords', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showPassword = () => {
        if (passwordRef.current) {
            const isHidden = passwordRef.current.type === "password";
            passwordRef.current.type = isHidden ? "text" : "password";
            if (ref.current) {
                ref.current.textContent = isHidden ? "👁️" : "👁️‍🗨️";
            }
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (form.site.length < 3) {
            showToast('Website URL must be at least 3 characters', 'error');
            return false;
        }
        if (form.username.length < 3) {
            showToast('Username must be at least 3 characters', 'error');
            return false;
        }
        if (form.password.length < 3) {
            showToast('Password must be at least 3 characters', 'error');
            return false;
        }
        return true;
    };

    const savePassword = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            
            if (isEditing && editingId) {
                const response = await fetch(`${API_URL}/passwords/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                });

                if (!response.ok) {
                    throw new Error('Failed to update password');
                }

                showToast('Password updated successfully', 'success');
                setIsEditing(false);
                setEditingId(null);
            } else {
                const newEntry = { ...form, id: uuidv4() };
                const response = await fetch(`${API_URL}/passwords`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEntry)
                });

                if (!response.ok) {
                    throw new Error('Failed to save password');
                }

                showToast('Password saved successfully', 'success');
            }

            setForm({ site: "", username: "", password: "" });
            await getPasswords();
        } catch (error) {
            console.error('Error saving password:', error);
            showToast('Failed to save password', 'error');
        } finally {
            setLoading(false);
        }
    };

    const deletePassword = async (item) => {
        const confirmed = window.confirm("Are you sure you want to delete this password?");
        if (!confirmed) return;

        try {
            setLoading(true);
            const id = item.id || item._id;
            const response = await fetch(`${API_URL}/passwords/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete password');
            }

            showToast('Password deleted successfully', 'success');
            await getPasswords();
        } catch (error) {
            console.error('Error deleting password:', error);
            showToast('Failed to delete password', 'error');
        } finally {
            setLoading(false);
        }
    };

    const editPassword = (item) => {
        const id = item.id || item._id;
        setForm({
            site: item.site,
            username: item.username,
            password: item.password
        });
        setIsEditing(true);
        setEditingId(id);
    };

    const cancelEdit = () => {
        setForm({ site: "", username: "", password: "" });
        setIsEditing(false);
        setEditingId(null);
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Copied to clipboard', 'success');
            })
            .catch((error) => {
                console.error('Copy failed:', error);
                showToast('Failed to copy', 'error');
            });
    };

    const showToast = (message, type = 'success') => {
        toast[type](message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
        });
    };

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Slide}
            />
            <div className="relative">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-slate-800 border-2 border-green-400 px-6 py-3 mb-4">
                        <h1 className="font-mono text-3xl font-bold text-green-400">
                            [PASSOP TERMINAL]
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">
                        <span className="text-amber-400">►</span> Secure Password Vault System
                    </p>
                </div>

                {/* Input Form */}
                <div className="bg-slate-900 border-2 border-cyan-400 p-6 mb-8 shadow-2xl">
                    <div className="border-b border-cyan-400 pb-2 mb-4">
                        <span className="text-cyan-400 font-mono text-sm">
                            {isEditing ? '[ EDIT MODE ]' : '[ NEW ENTRY ]'}
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-green-400 font-mono text-xs block mb-1">
                                WEBSITE URL:
                            </label>
                            <input 
                                value={form.site} 
                                onChange={handleChange} 
                                placeholder='https://example.com' 
                                className='bg-slate-800 border border-green-400 text-green-400 w-full px-3 py-2 font-mono text-sm focus:outline-none focus:border-green-300' 
                                type="text" 
                                name="site" 
                                id='site'
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-cyan-400 font-mono text-xs block mb-1">
                                    USERNAME:
                                </label>
                                <input 
                                    value={form.username} 
                                    onChange={handleChange} 
                                    placeholder='user@example.com' 
                                    className='bg-slate-800 border border-cyan-400 text-cyan-400 w-full px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-300' 
                                    type="text" 
                                    name="username" 
                                    id='username'
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="text-amber-400 font-mono text-xs block mb-1">
                                    PASSWORD:
                                </label>
                                <div className="relative">
                                    <input 
                                        ref={passwordRef} 
                                        value={form.password} 
                                        onChange={handleChange} 
                                        placeholder='••••••••' 
                                        className='bg-slate-800 border border-amber-400 text-amber-400 w-full px-3 py-2 font-mono text-sm focus:outline-none focus:border-amber-300' 
                                        type="password" 
                                        name="password" 
                                        id='password'
                                        disabled={loading}
                                    />
                                    <span 
                                        ref={ref}
                                        onClick={showPassword} 
                                        className='absolute right-2 top-2 cursor-pointer text-lg'
                                        aria-label="Toggle password visibility"
                                    >
                                        👁️‍🗨️
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={savePassword}
                                disabled={loading}
                                className='bg-green-400 text-slate-900 px-4 py-2 font-mono text-sm font-bold hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-500'>
                                {loading ? '[PROCESSING...]' : (isEditing ? '[UPDATE]' : '[SAVE]')}
                            </button>
                            
                            {isEditing && (
                                <button
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    className='bg-gray-600 text-white px-4 py-2 font-mono text-sm font-bold hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-700'>
                                    [CANCEL]
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Passwords Table */}
                <div className="bg-slate-900 border-2 border-amber-400 p-6 shadow-2xl">
                    <div className="border-b border-amber-400 pb-2 mb-4 flex justify-between items-center">
                        <span className="text-amber-400 font-mono text-sm">
                            [ STORED PASSWORDS ]
                        </span>
                        <span className="text-gray-500 font-mono text-xs">
                            TOTAL: {passwordArray.length}
                        </span>
                    </div>

                    {loading && (
                        <div className="text-center py-8">
                            <span className="text-green-400 font-mono text-sm animate-pulse">
                                [ LOADING DATA... ]
                            </span>
                        </div>
                    )}

                    {!loading && passwordArray.length === 0 && (
                        <div className="text-center py-8">
                            <span className="text-gray-500 font-mono text-sm">
                                [ NO PASSWORDS STORED ]
                            </span>
                        </div>
                    )}

                    {!loading && passwordArray.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-2 px-3 text-green-400 font-bold">SITE</th>
                                        <th className="text-left py-2 px-3 text-cyan-400 font-bold">USERNAME</th>
                                        <th className="text-left py-2 px-3 text-amber-400 font-bold">PASSWORD</th>
                                        <th className="text-center py-2 px-3 text-gray-400 font-bold">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passwordArray.map((item) => (
                                        <tr key={item.id || item._id} className="border-b border-gray-800 hover:bg-slate-800">
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-2">
                                                    <a 
                                                        href={item.site} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-green-400 hover:text-green-300 truncate max-w-xs"
                                                    >
                                                        {item.site}
                                                    </a>
                                                    <button 
                                                        onClick={() => copyText(item.site)}
                                                        className="text-green-400 hover:text-green-300"
                                                        aria-label="Copy site URL"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-cyan-400 truncate max-w-xs">{item.username}</span>
                                                    <button 
                                                        onClick={() => copyText(item.username)}
                                                        className="text-cyan-400 hover:text-cyan-300"
                                                        aria-label="Copy username"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-amber-400">{"•".repeat(Math.min(item.password.length, 12))}</span>
                                                    <button 
                                                        onClick={() => copyText(item.password)}
                                                        className="text-amber-400 hover:text-amber-300"
                                                        aria-label="Copy password"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button 
                                                        onClick={() => editPassword(item)}
                                                        className="text-blue-400 hover:text-blue-300 text-lg"
                                                        aria-label="Edit password"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => deletePassword(item)}
                                                        className="text-red-400 hover:text-red-300 text-lg"
                                                        aria-label="Delete password"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Manager;