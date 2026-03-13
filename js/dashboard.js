import { GEMINI_API_KEY } from './firebase-config.js';

export async function initDashboard(container, isAdmin) {
    const categories = ["House", "Indian", "Business", "World", "Sports", "Science", "GSIS"];
    let newsStore = {};

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
                ${categories.map(cat => `
                    <div class="glass-card h-64 flex flex-col overflow-hidden" id="widget-${cat}">
                        <div class="p-3 bg-[#1c2128] border-b border-[#30363d] text-[10px] font-bold text-gray-500 uppercase tracking-widest">${cat} News</div>
                        <div class="flex-1 bg-gray-800 relative content-slot">
                             <div class="absolute inset-0 p-3 bg-gradient-to-t from-[#161b22] to-transparent flex flex-col justify-end z-10">
                                <h5 class="text-[11px] font-bold text-white title-text italic uppercase">Syncing ${cat}...</h5>
                             </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="glass-card p-8 flex flex-col justify-between min-h-[14rem] w-full">
                <div>
                    <h3 class="text-3xl font-black text-white mb-2 italic">WINTER HOUSE INFO</h3>
                    <p class="text-gray-400 text-lg max-w-4xl">Centralized directory for all internal house logistics, project files, and administrative resources. Access is restricted to authorized Tahr members.</p>
                </div>
                <button class="w-full mt-6 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-500 transition-all uppercase tracking-tighter">Open House Drive</button>
            </div>

            <div class="glass-card p-8 w-full">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-black text-white italic uppercase tracking-widest">
                        <i class="far fa-calendar-alt text-blue-500 mr-2"></i> <span id="cal-month-name"></span>
                    </h3>
                </div>
                <div class="grid grid-cols-7 gap-2" id="calendar-grid"></div>
            </div>
        </div>
    `;

    // 1. Logic for Fully Functional Calendar
    const calGrid = document.getElementById('calendar-grid');
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('cal-month-name').innerText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let calHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="text-center text-[10px] font-black text-blue-500 uppercase pb-2">${d}</div>`).join('');
    for (let i = 0; i < firstDay; i++) calHTML += `<div class="aspect-square opacity-0"></div>`;
    for (let i = 1; i <= totalDays; i++) {
        const isToday = i === now.getDate();
        calHTML += `
            <div class="aspect-square glass-card flex items-center justify-center text-sm font-bold border-[#30363d] ${isToday ? 'bg-blue-600 text-white border-blue-400' : 'text-gray-500'}">
                ${i}
            </div>`;
    }
    calGrid.innerHTML = calHTML;

    // 2. Logic for AI News (Gemini API)
    async function fetchAINews(cat) {
        if (!GEMINI_API_KEY) return;
        try {
            const prompt = `Provide 3 short, high-energy news headlines for "${cat}". Format as JSON array of objects: [{"title": "...", "bio": "..."}]`;
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
            });
            const data = await res.json();
            newsStore[cat] = JSON.parse(data.candidates[0].content.parts[0].text);
        } catch (e) {
            newsStore[cat] = [{ title: `Checking ${cat} Feed...`, bio: "" }];
        }
    }

    // Initialize fetching
    for (const cat of categories) {
        if (cat === "House" && isAdmin) {
            newsStore["House"] = [{ title: "Admin Mode Active", bio: "Ready for protocol updates." }];
        } else {
            fetchAINews(cat);
        }
    }

    // 3. News Rotation Engine (Every 7 Seconds)
    let rotIndex = 0;
    const rotate = () => {
        categories.forEach(cat => {
            const slot = document.getElementById(`widget-${cat}`).querySelector('.content-slot');
            const data = newsStore[cat];
            if (!data) return;

            const current = data[rotIndex % data.length];
            const imgUrl = `https://picsum.photos/seed/${cat}-${rotIndex % 10}/400/300`;

            slot.innerHTML = `
                <img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover opacity-30 animate-in fade-in transition-opacity duration-1000">
                <div class="absolute inset-0 p-3 bg-gradient-to-t from-[#161b22] to-transparent flex flex-col justify-end z-10">
                    <h5 class="text-[11px] font-bold text-white uppercase italic leading-tight">${current.title}</h5>
                </div>
            `;
        });
        rotIndex++;
    };

    setTimeout(() => {
        rotate();
        const interval = setInterval(rotate, 7000);
        container.addEventListener('remove', () => clearInterval(interval));
    }, 1500);
}
