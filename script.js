// Конфигурация игр
const games = [
    { id: 'brawl', name: 'Brawl Stars', subtitle: 'Гемы и бравлеры', reward: '170 Гемов' },
    { id: 'cod', name: 'Call of Duty: Mobile', subtitle: 'CP и скины', reward: '880 CP' },
    { id: 'clash', name: 'Clash of Clans', subtitle: 'Гемы и золото', reward: '500 Гемов' },
    { id: 'genshin', name: 'Genshin Impact', subtitle: 'Кристаллы сотворения', reward: '300 Кристаллов' },
    { id: 'hayday', name: 'Hay Day', subtitle: 'Алмазы и монеты', reward: '100 Алмазов' },
    { id: 'homescapes', name: 'Homescapes', subtitle: 'Монеты и звезды', reward: '1000 Монет' },
    { id: 'lts', name: 'Left To Survive', subtitle: 'Золото и оружие', reward: '500 Золота' },
    { id: 'mlbb', name: 'Mobile Legends', subtitle: 'Алмазы и герои', reward: '250 Алмазов' },
    { id: 'pubg', name: 'PUBG Mobile', subtitle: 'UC и ящики', reward: '325 UC' },
    { id: 'roblox', name: 'Roblox', subtitle: 'Робуксы', reward: '400 Robux' },
    { id: 'standoff', name: 'Standoff 2', subtitle: 'Голда и скины', reward: '1000 Голды' },
    { id: 'wotb', name: 'World of Tanks Blitz', subtitle: 'Золото и премиум', reward: '1500 Золота' },
    { id: 'durak', name: 'Дурак Онлайн', subtitle: 'Монеты и смайлы', reward: '25000 Монет' }
];

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрыть на весь экран

// DOM элементы
const shopListEl = document.getElementById('shop-list');
const shopView = document.getElementById('shop-view');
const profileView = document.getElementById('profile-view');
const claimView = document.getElementById('claim-view');
const userProfileView = document.getElementById('user-profile-view');
const successOverlay = document.getElementById('success-overlay');

// Рендеринг списка игр
function renderShop() {
    shopListEl.innerHTML = '';
    games.forEach(game => {
        const item = document.createElement('div');
        item.className = 'game-item';
        item.innerHTML = `
            <div class="game-icon"></div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-subtitle">${game.subtitle}</div>
            </div>
            <button class="btn-get" onclick="openClaimView('${game.id}')">Получить</button>
        `;
        shopListEl.appendChild(item);
    });
}

// Навигация по табам
function switchTab(tabName) {
    // Скрываем все views кроме claim (он модальный по сути)
    claimView.style.display = 'none';
    
    // Сброс активных классов у табов
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    
    if (tabName === 'shop') {
        shopView.classList.add('active');
        userProfileView.classList.remove('active');
        document.getElementById('tab-shop').classList.add('active');
    } else if (tabName === 'profile') {
        shopView.classList.remove('active');
        userProfileView.classList.add('active');
        document.getElementById('tab-profile').classList.add('active');
    }
}

// Открытие страницы "Получить" (Game Profile)
window.openClaimView = function(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    // Заполнение данных
    document.getElementById('claim-title').textContent = game.name;
    document.getElementById('claim-reward').textContent = `Вы получите: ${game.reward}`;
    document.getElementById('game-id-input').value = ''; // Очистить инпут

    // Переключение видимости
    shopView.classList.remove('active');
    userProfileView.classList.remove('active');
    claimView.classList.add('active');
};

// Возврат назад
window.goBack = function() {
    claimView.classList.remove('active');
    // Возвращаемся на магазин
    switchTab('shop');
};

// Обработка кнопки "Получить" (Сабмит)
window.submitClaim = function() {
    const input = document.getElementById('game-id-input');
    if (!input.value.trim()) {
        tg.showAlert('Пожалуйста, введите ваш ID!');
        return;
    }

    // Показать экран успеха
    successOverlay.classList.add('active');
    
    // Вибрация (Haptic Feedback)
    tg.HapticFeedback.notificationOccurred('success');

    // Через 3 секунды можно закрыть или отправить данные боту
    setTimeout(() => {
        // tg.close(); // Можно закрыть приложение
        // Или просто скрыть оверлей и вернуться
        successOverlay.classList.remove('active');
        goBack();
    }, 3000);
};

// Инициализация
renderShop();

// Установка имени пользователя если доступно
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById('username-display').textContent = 
        `${user.first_name} ${user.last_name || ''}`.trim();
}
