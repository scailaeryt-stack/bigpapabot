// Конфигурация игр с правилами валидации
// img: путь к картинке (относительно корня или папки images)
const games = [
    { 
        id: 'brawl', 
        name: 'Brawl Stars', 
        subtitle: 'Гемы и бравлеры', 
        reward: '170 Гемов',
        placeholder: '#JY8G9...',
        validateType: 'tag',
        errorMsg: 'ID должен начинаться с # и содержать 3-12 символов',
        img: 'images/brawl.png' 
    },
    { 
        id: 'cod', 
        name: 'Call of Duty: Mobile', 
        subtitle: 'CP и скины', 
        reward: '880 CP',
        placeholder: '67426...',
        validateType: 'numeric',
        errorMsg: 'UID должен состоять только из цифр',
        img: 'images/cod.png'
    },
    { 
        id: 'clash', 
        name: 'Clash of Clans', 
        subtitle: 'Гемы и золото', 
        reward: '500 Гемов',
        placeholder: '#LCY8...',
        validateType: 'tag',
        errorMsg: 'Тег должен начинаться с #',
        img: 'images/clash.png'
    },
    { 
        id: 'genshin', 
        name: 'Genshin Impact', 
        subtitle: 'Кристаллы сотворения', 
        reward: '300 Кристаллов',
        placeholder: '700123...',
        validateType: 'numeric',
        errorMsg: 'UID должен состоять из цифр (9 символов)',
        img: 'images/genshin.png'
    },
    { 
        id: 'hayday', 
        name: 'Hay Day', 
        subtitle: 'Алмазы и монеты', 
        reward: '100 Алмазов',
        placeholder: '#P8...',
        validateType: 'tag',
        errorMsg: 'Тег фермы должен начинаться с #',
        img: 'images/hayday.png'
    },
    { 
        id: 'homescapes', 
        name: 'Homescapes', 
        subtitle: 'Монеты и звезды', 
        reward: '1000 Монет',
        placeholder: 'ID поддержки...',
        validateType: 'any', 
        errorMsg: '',
        img: 'images/homescapes.png'
    },
    { 
        id: 'lts', 
        name: 'Left To Survive', 
        subtitle: 'Золото и оружие', 
        reward: '500 Золота',
        placeholder: 'ID игрока',
        validateType: 'numeric',
        errorMsg: 'ID должен быть числовым',
        img: 'images/lts.png'
    },
    { 
        id: 'mlbb', 
        name: 'Mobile Legends', 
        subtitle: 'Алмазы и герои', 
        reward: '250 Алмазов',
        placeholder: '12345678 (1234)',
        validateType: 'numeric_complex',
        errorMsg: 'Введите ID и ID сервера (только цифры)',
        img: 'images/mlbb.png'
    },
    { 
        id: 'pubg', 
        name: 'PUBG Mobile', 
        subtitle: 'UC и ящики', 
        reward: '325 UC',
        placeholder: '51234...',
        validateType: 'numeric',
        errorMsg: 'ID должен состоять только из цифр',
        img: 'images/pubg.png'
    },
    { 
        id: 'roblox', 
        name: 'Roblox', 
        subtitle: 'Робуксы', 
        reward: '400 Robux',
        placeholder: 'Username',
        validateType: 'username',
        errorMsg: 'Имя пользователя не найдено',
        img: 'images/roblox.png'
    },
    { 
        id: 'standoff', 
        name: 'Standoff 2', 
        subtitle: 'Голда и скины', 
        reward: '1000 Голды',
        placeholder: 'ID игрока',
        validateType: 'numeric',
        errorMsg: 'ID должен быть числовым',
        img: 'images/standoff.png'
    },
    { 
        id: 'wotb', 
        name: 'World of Tanks Blitz', 
        subtitle: 'Золото и премиум', 
        reward: '1500 Золота',
        placeholder: 'Никнейм или ID',
        validateType: 'any',
        errorMsg: '',
        img: 'images/wotb.png'
    },
    { 
        id: 'durak', 
        name: 'Дурак Онлайн', 
        subtitle: 'Монеты и смайлы', 
        reward: '25000 Монет',
        placeholder: 'ID или Ник',
        validateType: 'any',
        errorMsg: '',
        img: 'images/durak.png'
    }
];

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// DOM элементы
const shopListEl = document.getElementById('shop-list');
const shopView = document.getElementById('shop-view');
const userProfileView = document.getElementById('user-profile-view');
const settingsView = document.getElementById('settings-view');

const claimView = document.getElementById('claim-view');
const privacyView = document.getElementById('privacy-view');
const termsView = document.getElementById('terms-view');
const supportView = document.getElementById('support-view');

const successOverlay = document.getElementById('success-overlay');

let currentGameId = null;

// Рендеринг списка игр
function renderShop() {
    shopListEl.innerHTML = '';
    games.forEach(game => {
        const item = document.createElement('div');
        item.className = 'game-item';
        
        // Если картинка есть и загружена, показываем её, иначе цветная заглушка
        const iconStyle = game.img ? `background-image: url('${game.img}');` : '';
        
        item.innerHTML = `
            <div class="game-icon" style="${iconStyle}"></div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-subtitle">${game.subtitle}</div>
            </div>
            <button class="btn-get" onclick="openClaimView('${game.id}')">Получить</button>
        `;
        shopListEl.appendChild(item);
    });
}

// Утилита для скрытия всех экранов
function hideAllViews() {
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
        // Дополнительная страховка display: none делается через CSS класс,
        // но можно и тут явно, хотя CSS !important надежнее
    });
}

// Навигация по табам
function switchTab(tabName) {
    hideAllViews();
    // Сброс активных кнопок табов
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));

    if (tabName === 'shop') {
        shopView.classList.add('active');
        document.getElementById('tab-shop').classList.add('active');
    } else if (tabName === 'profile') {
        userProfileView.classList.add('active');
        document.getElementById('tab-profile').classList.add('active');
    } else if (tabName === 'settings') {
        settingsView.classList.add('active');
        document.getElementById('tab-settings').classList.add('active');
    }
}

// === ЛОГИКА ИГРЫ И ВАЛИДАЦИИ ===

window.openClaimView = function(gameId) {
    currentGameId = gameId;
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    hideAllViews();
    claimView.classList.add('active');

    // Заполнение UI
    document.getElementById('claim-title').textContent = game.name;
    document.getElementById('claim-reward').textContent = `Вы получите: ${game.reward}`;
    
    const input = document.getElementById('game-id-input');
    input.value = '';
    input.placeholder = game.placeholder || 'Введите ваш ID';
    
    // Сброс ошибок
    input.classList.remove('error');
    document.getElementById('error-msg').classList.remove('visible');
    
    // Цвет иконки (заглушка) или картинка
    const iconEl = document.querySelector('#claim-view .claim-icon');
    if (game.img) {
        iconEl.style.backgroundImage = `url('${game.img}')`;
        iconEl.style.backgroundColor = 'transparent';
    } else {
        iconEl.style.backgroundImage = 'none';
        iconEl.style.backgroundColor = '#FFD600';
    }
};

// Проверка ввода
function validateInput(value, type) {
    if (!value) return false;
    value = value.trim();
    
    if (type === 'numeric') {
        return /^\d+$/.test(value);
    }
    if (type === 'numeric_complex') {
        // Разрешаем цифры, пробелы, скобки (для MLBB например)
        return /^[\d\s\(\)]+$/.test(value);
    }
    if (type === 'tag') {
        // Должен начинаться с #
        return value.startsWith('#') && value.length > 3;
    }
    if (type === 'username') {
        // Буквы и цифры
        return /^[a-zA-Z0-9_]+$/.test(value);
    }
    return true; // Any
}

window.submitClaim = function() {
    const input = document.getElementById('game-id-input');
    const errorMsgEl = document.getElementById('error-msg');
    const val = input.value.trim();
    
    const game = games.find(g => g.id === currentGameId);
    
    // 1. Проверка на пустоту
    if (!val) {
        input.classList.add('error');
        errorMsgEl.textContent = 'Поле не может быть пустым';
        errorMsgEl.classList.add('visible');
        tg.HapticFeedback.notificationOccurred('error');
        return;
    }

    // 2. Проверка по типу валидации
    if (game && game.validateType) {
        const isValid = validateInput(val, game.validateType);
        if (!isValid) {
            input.classList.add('error');
            errorMsgEl.textContent = game.errorMsg || 'Некорректный формат ID';
            errorMsgEl.classList.add('visible');
            tg.HapticFeedback.notificationOccurred('error');
            return;
        }
    }

    // Успех
    successOverlay.classList.add('active');
    tg.HapticFeedback.notificationOccurred('success');

    setTimeout(() => {
        successOverlay.classList.remove('active');
        switchTab('shop'); // Возврат в магазин
    }, 3000);
};

// Сброс ошибок при вводе
document.getElementById('game-id-input').addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('error-msg').classList.remove('visible');
});

// === ЮРИДИЧЕСКИЕ СТРАНИЦЫ И ПОДДЕРЖКА ===

window.openPrivacy = function() {
    hideAllViews();
    privacyView.classList.add('active');
};

window.openTerms = function() {
    hideAllViews();
    termsView.classList.add('active');
};

window.openSupport = function() {
    hideAllViews();
    // Очистка поля
    document.getElementById('support-msg').value = '';
    supportView.classList.add('active');
};

window.closeSubPage = function() {
    // Возвращаемся в настройки
    switchTab('settings');
};

window.submitSupport = function() {
    const textarea = document.getElementById('support-msg');
    if (!textarea.value.trim()) {
        tg.showAlert('Введите сообщение!');
        return;
    }
    
    tg.showAlert('Ваше обращение успешно отправлено! Мы ответим вам в ближайшее время.');
    closeSubPage();
};

// === ИНИЦИАЛИЗАЦИЯ ===
function initApp() {
    renderShop();
    switchTab('shop');
    
    // Скрываем оверлеи
    successOverlay.classList.remove('active');
    
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('username-display').textContent = 
            `${user.first_name} ${user.last_name || ''}`.trim();
    }
}

initApp();
