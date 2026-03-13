import { GEMINI_API_KEY } from './firebase-config.js';

export async function initDashboard(container, isAdmin) {
    // 1. Categories for AI News
    const categories = ["Indian News", "Business News", "World News", "Sports News", "Science News", "GSIS News"];
    
    // Initial House News (Controlled by Admin/Hardcoded)
    let newsData = {
        "House News": [
            { title: "House Meeting", bio: "Scheduled for 8:00 PM in the main hall.", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" },
            { title: "New Gym Gear", bio: "Dumbbells and racks updated today.", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" }
        ]
    };

    // 2. Build the UI Structure
    container.innerHTML = `
        <div class="space-y-8 animate-in pb-12">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-5xl font-black text-white tracking-tighter uppercase">Tahr <span class="text-blue-500">Central</span></h2>
                    <p class="text-gray-500 mt-2 font-mono" id="live-clock"></p>
                </div>
                <h3 class="text-2xl font-black italic text-red-600 tracking-widest uppercase opacity-80">"Winter is Coming..."</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4" id="news-viewport">
                <div class="glass-card overflow-hidden flex flex-col h-72 shadow-xl border-blue-500/30" id="widget-house-news">
                    <div class="p-3 bg-blue-600/10 border-b border-[#30363d] flex justify-between">
                        <span class="text-[10px] font-black uppercase text-blue-400">House News</span>
                        <i class="fas fa-shield-alt text-[10px] text-blue-500"></i>
                    </div>
                    <div class="relative flex-1 bg-[#0d1117] content-slot"></div>
                </div>

                ${categories.map(cat => `
                    <div class="glass-card overflow-hidden flex flex-col h-72 shadow-lg group" id="widget-${cat.replace(/\s+/g, '-')}">
                        <div class="p-3 bg-[#1c2128] border-b border-[#30363d]">
                            <h4 class="text-[10px] font-black uppercase text-gray-500 tracking-widest">${cat}</h4>
                        </div>
                        <div class="relative flex-1 bg-gray-900 content-slot">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="glass-card p-10 relative overflow-hidden group shadow-2xl border-blue-500/10 w-full">
                <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i class="fas fa-folder-open text-9xl text-blue-500"></i>
                </div>
                <div class="relative z-10">
                    <h3 class="text-4xl font-black text-white mb-4 italic tracking-tight uppercase">Winter House Central Drive</h3>
                    <p class="text-gray-400 text-lg leading-relaxed mb-8 max-w-4xl">
                        Access all house documents, project files, and shared resources in one secure location. 
                        This drive is synced daily with the house administration servers.
                    </p>
                    <button class="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30">
                        Open Storage Hub <i class="fas fa-external-link-alt text-sm"></i>
                    </button>
                </div>
            </div>

            <div class="glass-card p-8 shadow-xl">
                <h3 class="text-2xl font-black text-white italic mb-8 px-2 flex items-center gap-3">
                    <i class="far fa-calendar-alt text-blue-500"></i> HOUSE CALENDAR
                </h3>
                <div class="grid grid-cols-7 gap-3" id="calendar-grid"></div>
            </div>
        </div>
    `;

    // 3. Clock & Calendar Logic
    const updateClock = () => {
        document.getElementById('live-clock').innerText = new Date().toLocaleString();
    };
    setInterval(updateClock, 1000); updateClock();

    const calGrid = document.getElementById('calendar-grid');
    let calHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => 
        `<div class="text-center text-[10px] font-black text-blue-500 uppercase pb-4">${d}</div>`).join('');
    
    for (let i = 1; i <= 31; i++) {
        const isToday = i === new Date().getDate();
        calHTML += `<div class="aspect-square glass-card flex flex-col p-3 border-[#30363d]/50 hover:border-blue-500 transition-colors ${isToday ? 'bg-blue-600/10 border-blue-500/40' : 'bg-[#0d1117]'}">
            <span class="text-xs font-bold ${isToday ? 'text-white' : 'text-gray-600'}">${i}</span>
        </div>`;
    }
    calGrid.innerHTML = calHTML;

    // 4. AI News Fetching
    async function fetchNews(category) {
        if (!GEMINI_API_KEY) return [{ title: "API Key Required", bio: "Enter key in config." }];
        try {
            const prompt = `Give me 3 brief news headlines for ${category}. Format as JSON: [{"title":"..","bio":".."}]`;
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
            });
            const data = await res.json();
            return JSON.parse(data.candidates[0].content.parts[0].text);
        } catch (e) {
            return [{ title: "Update Pending", bio: "AI is fetching latest info..." }];
        }
    }

    // Load initial AI data
    for (const cat of categories) {
        newsData[cat] = await fetchNews(cat);
    }

    // 5. Rotation Logic (Every 7 Seconds)
    let idx = 0;
    const updateUI = (catId) => {
        const name = catId === 'house-news' ? 'House News' : catId.replace(/-/g, ' ');
        const list = newsData[name] || [];
        const item = list[idx % list.length];
        if (!item) return;

        const slot = document.getElementById(`widget-${catId}`).querySelector('.content-slot');
        slot.innerHTML = `
            <img src="${item.img || `https://picsum.photos/seed/${catId}${idx}/400/300`}" class="w-full h-full object-cover opacity-30 animate-in">
            <div class="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent p-4 flex flex-col justify-end">
                <h5 class="text-[11px] font-black text-white leading-tight mb-1 uppercase italic">${item.title}</h5>
                <p class="text-[9px] text-gray-400 line-clamp-2">${item.bio}</p>
            </div>
        `;
    };

    const startRotation = () => {
        updateUI('house-news');
        categories.forEach(c => updateUI(c.replace(/\s+/g, '-')));
        idx++;
    };

    startRotation();
    const interval = setInterval(startRotation, 7000);

    // Stop interval if user navigates away
    container.addEventListener('remove', () => clearInterval(interval));
}


