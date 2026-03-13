export function initChat(container, name, isAdmin = false) {
    container.innerHTML = `
        <div class="flex flex-col h-full max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-white mb-6 uppercase">${name} Chat</h2>
            <div class="flex-1 glass-card p-6 mb-6 overflow-y-auto"></div>
            <div class="flex gap-4">
                <input class="flex-1 bg-[#161b22] border border-[#30363d] p-4 rounded-2xl outline-none" placeholder="Message...">
                <button class="p-4 bg-blue-600 rounded-2xl text-white"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
}
