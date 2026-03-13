export function initInfoHub(container, isAdmin) {
    const members = [{name: "Sample User", bio: "House Member", img: "https://i.pravatar.cc/150?u=1"}];
    container.innerHTML = `
        <div class="space-y-8">
            <h2 class="text-3xl font-black text-white italic">HOUSE DIRECTORY</h2>
            <div class="grid grid-cols-5 gap-6">
                ${members.map(m => `
                    <div class="glass-card p-6 text-center">
                        <img src="${m.img}" class="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-500">
                        <h4 class="text-white font-bold">${m.name}</h4>
                        <p class="text-[10px] text-gray-500 mt-2">${m.bio}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
