export function initCheckIn(container, isAdmin) {
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full space-y-12">
            <div class="glass-card p-16 text-center max-w-lg w-full">
                <h2 class="text-4xl font-black text-white italic mb-8">HOUSE CHECK-IN</h2>
                <button class="w-full py-6 bg-blue-600 rounded-3xl font-black text-2xl tracking-widest text-white shadow-xl shadow-blue-600/20 hover:scale-105 transition-all">CHECK IN</button>
            </div>
        </div>
    `;
}
