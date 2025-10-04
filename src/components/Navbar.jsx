import React from 'react'

const Navbar = () => {
    return (
        <nav className="bg-slate-900 border-b-2 border-amber-400 shadow-lg">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 h-16">
                <div className="logo font-mono text-2xl font-bold tracking-tight">
                    <span className="text-amber-400">[</span>
                    <span className="text-green-400">Pass</span>
                    <span className="text-cyan-400">OP</span>
                    <span className="text-amber-400">]</span>
                    <span className="text-gray-500 text-sm ml-2">v1.0</span>
                </div>
                <div className="text-gray-400 text-sm font-mono">
                    <span className="text-green-400">●</span> System Online
                </div>
            </div>
        </nav>
    )
}

export default Navbar