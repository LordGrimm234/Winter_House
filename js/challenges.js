export function initChallenges(container, isAdmin) {
    container.innerHTML = `
        <div class="space-y-8">
            <div class="glass-card p-8 border-blue-500/20">
                <h2 class="text-4xl font-black text-white italic">XP: 0</h2>
                <div class="w-full h-4 bg-gray-800 rounded-full mt-4"><div class="h-full bg-blue-600 rounded-full" style="width: 5%"></div></div>
            </div>
            ${isAdmin ? `<div class="bg-blue-600/5 p-6 rounded-3xl border border-blue-500/20 grid grid-cols-4 gap-4">
                <input placeholder="Challenge Name" class="bg-transparent border border-[#30363d] p-3 rounded-xl">
                <input placeholder="XP" class="bg-transparent border border-[#30363d] p-3 rounded-xl">
                <button class="bg-blue-600 text-white font-bold rounded-xl col-span-2">Add Challenge</button>
            </div>` : ''}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="glass-card p-6 h-64 flex flex-col justify-between">
                    <div><h4 class="text-lg font-bold text-white">Daily Workout</h4><p class="text-xs text-gray-500 mt-2">+100 XP</p></div>
                    <button class="w-full py-3 bg-gray-800 rounded-xl font-bold uppercase tracking-widest">Done</button>
                </div>
            </div>
        </div>
    `;
}
