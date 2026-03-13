export function initDashboard(container, isAdmin) {
    container.innerHTML = `
        <div class="space-y-8 animate-in fade-in">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-4xl font-black text-white">Welcome to <span class="text-blue-500">Tahr Central</span></h2>
                    <p class="text-gray-500 mt-2" id="dash-date">${new Date().toDateString()}</p>
                </div>
                <h3 class="text-2xl font-black italic text-red-600 tracking-widest uppercase">"Winter is Coming..."</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                ${["House", "Indian", "Business", "World", "Sports", "Science", "GSIS"].map(cat => `
                    <div class="glass-card h-64 flex flex-col overflow-hidden">
                        <div class="p-3 bg-[#1c2128] border-b border-[#30363d] text-[10px] font-bold text-gray-500 uppercase tracking-widest">${cat} News</div>
                        <div class="flex-1 bg-gray-800 relative">
                             <div class="absolute inset-0 p-3 bg-gradient-to-t from-[#161b22] to-transparent flex flex-col justify-end">
                                <h5 class="text-[11px] font-bold text-white">Latest ${cat} Update</h5>
                             </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="glass-card p-8 flex flex-col justify-between h-64">
                    <h3 class="text-xl font-bold text-white">Winter House Info</h3>
                    <button class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Open House Drive</button>
                </div>
                <div class="lg:col-span-2 glass-card p-8 relative h-64">
                    <h3 class="text-xl font-bold text-white mb-6">Daily Sliders</h3>
                    ${isAdmin ? '<div class="space-y-4"><input type="range" class="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"></div>' : '<div class="text-gray-600 italic">Sliders only appear when active.</div>'}
                </div>
            </div>
        </div>
    `;
}
