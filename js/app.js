import { initDashboard } from './dashboard.js';
import { initChallenges } from './challenges.js';
import { initInfoHub } from './info-hub.js';
import { initCheckIn } from './check-in.js';
import { initHallOfFame } from './hall-of-fame.js';
import { initChat } from './chat.js';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-layout-dashboard' },
    { id: 'challenges', label: 'Challenges', icon: 'fa-trophy' },
    { id: 'info', label: 'Info Hub', icon: 'fa-info-circle' },
    { id: 'checkin', label: 'Check In', icon: 'fa-map-marker-alt' },
    { id: 'halloffame', label: 'Hall of Fame', icon: 'fa-user-circle' },
    { id: 'chat', label: 'Personal Chat', icon: 'fa-comment-dots' },
    { id: 'community', label: 'Community', icon: 'fa-users' }
];

let activeTab = 'dashboard';
let isAdmin = false;

function renderNav() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = navItems.map(item => `
        <button onclick="switchTab('${item.id}')" class="sidebar-item w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'active' : 'text-gray-400 hover:bg-[#21262d]'}" id="nav-${item.id}">
            <i class="fas ${item.icon} text-lg"></i>
            <span class="text-sm font-semibold">${item.label}</span>
        </button>
    `).join('');
}

window.switchTab = (id) => {
    activeTab = id;
    renderNav();
    const container = document.getElementById('main-content');
    switch(id) {
        case 'dashboard': initDashboard(container, isAdmin); break;
        case 'challenges': initChallenges(container, isAdmin); break;
        case 'info': initInfoHub(container, isAdmin); break;
        case 'checkin': initCheckIn(container, isAdmin); break;
        case 'halloffame': initHallOfFame(container); break;
        case 'chat': initChat(container, 'Personal'); break;
        case 'community': initChat(container, 'Community', isAdmin); break;
    }
};

document.getElementById('admin-toggle').addEventListener('click', (e) => {
    isAdmin = !isAdmin;
    e.target.innerText = `Admin Mode: ${isAdmin ? 'On' : 'Off'}`;
    window.switchTab(activeTab);
});

window.onload = () => { renderNav(); window.switchTab('dashboard'); };
