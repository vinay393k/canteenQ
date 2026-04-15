/* ════════════ DATA ════════════ */
let menuItems = [
    { id: 1,  name: 'Idli Sambar',      cat: 'Breakfast',  price: 25,  emoji: '🫓', desc: 'Soft idlis with tangy sambar',         avail: true },
    { id: 2,  name: 'Poha',             cat: 'Breakfast',  price: 20,  emoji: '🍚', desc: 'Flattened rice with spices',            avail: true },
    { id: 3,  name: 'Medu Vada',        cat: 'Breakfast',  price: 30,  emoji: '🍩', desc: 'Crispy lentil donuts with chutney',     avail: true },
    { id: 4,  name: 'Upma',             cat: 'Breakfast',  price: 22,  emoji: '🥣', desc: 'Semolina cooked with veggies',          avail: true },
    { id: 5,  name: 'Dosa',             cat: 'Breakfast',  price: 35,  emoji: '🥞', desc: 'Crispy rice crepe with sambar',         avail: true },
    { id: 6,  name: 'Veg Thali',        cat: 'Lunch',      price: 70,  emoji: '🍛', desc: 'Full meal with rice, dal, sabzi',       avail: true },
    { id: 7,  name: 'Paneer Butter',    cat: 'Lunch',      price: 80,  emoji: '🧈', desc: 'Rich paneer in creamy gravy',           avail: true },
    { id: 8,  name: 'Chole Rice',       cat: 'Lunch',      price: 55,  emoji: '🍲', desc: 'Spiced chickpeas with steamed rice',    avail: true },
    { id: 9,  name: 'Dal Fry Rice',     cat: 'Lunch',      price: 50,  emoji: '🥘', desc: 'Tempered lentils with jeera rice',      avail: true },
    { id: 10, name: 'Rajma Chawal',     cat: 'Lunch',      price: 55,  emoji: '🫘', desc: 'Kidney bean curry with rice',           avail: true },
    { id: 11, name: 'Veg Sandwich',     cat: 'Snacks',     price: 35,  emoji: '🥪', desc: 'Toasted sandwich with veggies',         avail: true },
    { id: 12, name: 'Samosa',           cat: 'Snacks',     price: 15,  emoji: '🔺', desc: 'Crispy pastry with potato filling',     avail: true },
    { id: 13, name: 'Pav Bhaji',        cat: 'Snacks',     price: 45,  emoji: '🍞', desc: 'Buttery mashed veggies with pav',       avail: true },
    { id: 14, name: 'French Fries',     cat: 'Snacks',     price: 40,  emoji: '🍟', desc: 'Crispy golden potato fries',            avail: true },
    { id: 15, name: 'Spring Roll',      cat: 'Snacks',     price: 35,  emoji: '🌯', desc: 'Crunchy rolls with veggie filling',     avail: true },
    { id: 16, name: 'Masala Chai',      cat: 'Beverages',  price: 15,  emoji: '☕', desc: 'Spiced milk tea',                       avail: true },
    { id: 17, name: 'Cold Coffee',      cat: 'Beverages',  price: 40,  emoji: '🥤', desc: 'Chilled blended coffee drink',          avail: true },
    { id: 18, name: 'Lemon Soda',       cat: 'Beverages',  price: 20,  emoji: '🍋', desc: 'Fresh lime with fizzy soda',            avail: true },
    { id: 19, name: 'Mango Lassi',      cat: 'Beverages',  price: 35,  emoji: '🥭', desc: 'Thick mango yogurt smoothie',           avail: true },
    { id: 20, name: 'Buttermilk',       cat: 'Beverages',  price: 15,  emoji: '🥛', desc: 'Spiced chilled buttermilk',             avail: true },
];

let cart = {};       // { itemId: quantity }
let orders = [];     // array of order objects
let tokenCounter = 100;
let currentCat = 'All';

/* ════════════ NAVIGATION ════════════ */
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const el = document.getElementById('page-' + page);
    if (el) el.classList.add('active');

    const navBtn = document.getElementById('nav-' + page);
    if (navBtn) navBtn.classList.add('active');

    if (page === 'menu')   renderMenu();
    if (page === 'cart')   renderCart();
    if (page === 'orders') renderOrders();
}

function showAdminPage() {
    showPage('admin');
}

/* ════════════ CATEGORY TABS ════════════ */
function buildCatTabs() {
    const cats = ['All', ...new Set(menuItems.map(i => i.cat))];
    const container = document.getElementById('cat-tabs');
    container.innerHTML = cats.map(c =>
        `<button class="cat-tab ${c === currentCat ? 'active' : ''}" onclick="selectCat('${c}')">${c}</button>`
    ).join('');
}

function selectCat(cat) {
    currentCat = cat;
    buildCatTabs();
    renderMenu();
}

/* ════════════ MENU RENDERING ════════════ */
function renderMenu() {
    buildCatTabs();
    const search = (document.getElementById('search-input')?.value || '').toLowerCase();
    const grid = document.getElementById('menu-grid');

    let items = menuItems;
    if (currentCat !== 'All') items = items.filter(i => i.cat === currentCat);
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search) || i.desc.toLowerCase().includes(search));

    if (items.length === 0) {
        grid.innerHTML = `<div class="cart-empty" style="grid-column:1/-1">
            <div class="cart-empty-icon">🔍</div>
            <div class="cart-empty-text">No items found</div>
            <div class="cart-empty-sub">Try a different search or category</div>
        </div>`;
        return;
    }

    grid.innerHTML = items.map(item => {
        const qty = cart[item.id] || 0;
        return `
            <div class="menu-item-card ${item.avail ? '' : 'unavailable'}">
                <div class="item-image">${item.emoji}</div>
                <div class="item-body">
                    <div class="item-cat">${item.cat}</div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-desc">${item.desc}</div>
                    <div class="item-bottom">
                        <div class="item-price">₹${item.price}</div>
                        ${qty === 0
                            ? `<button class="add-btn" onclick="addToCart(${item.id})">Add +</button>`
                            : `<div class="qty-controls">
                                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                                    <span class="qty-num">${qty}</span>
                                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                               </div>`
                        }
                    </div>
                </div>
            </div>`;
    }).join('');
}

function filterMenu() {
    renderMenu();
}

/* ════════════ CART LOGIC ════════════ */
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item || !item.avail) return;
    cart[id] = 1;
    updateCartBadge();
    renderMenu();
    toast(`${item.name} added to cart`, 'success');
}

function changeQty(id, delta) {
    const item = menuItems.find(i => i.id === id);
    if (!item || !item.avail) return;
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    updateCartBadge();
    renderMenu();
    renderCart();
}

function removeFromCart(id) {
    const item = menuItems.find(i => i.id === id);
    delete cart[id];
    updateCartBadge();
    renderCart();
    if (item) toast(`${item.name} removed`, 'error');
}

function updateCartBadge() {
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    document.getElementById('cart-badge').innerText = count;
}

function getCartTotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = menuItems.find(i => i.id === +id);
        return sum + (item ? item.price * qty : 0);
    }, 0);
}

function getCartItemCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
}

/* ════════════ CART RENDERING ════════════ */
function renderCart() {
    const container = document.getElementById('cart-content');
    const subEl = document.getElementById('cart-page-sub');
    const ids = Object.keys(cart);

    if (ids.length === 0) {
        subEl.textContent = '0 items selected';
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <div class="cart-empty-text">Your cart is empty</div>
                <div class="cart-empty-sub">Browse the menu and add items to get started.</div>
                <br>
                <button class="btn-primary" onclick="showPage('menu')">Browse Menu →</button>
            </div>`;
        return;
    }

    const totalItems = getCartItemCount();
    const totalPrice = getCartTotal();
    subEl.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''} selected`;

    let html = '<div class="cart-list">';
    ids.forEach(id => {
        const item = menuItems.find(i => i.id === +id);
        if (!item) return;
        const qty = cart[id];
        html += `
            <div class="cart-item">
                <div class="cart-emoji">${item.emoji}</div>
                <div class="cart-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} × ${qty}</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                    <span class="qty-num">${qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">₹${item.price * qty}</div>
                <button class="cart-remove" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
            </div>`;
    });
    html += '</div>';

    html += `
        <div class="cart-summary">
            <div class="cart-summary-row"><span>Subtotal</span><span>₹${totalPrice}</span></div>
            <div class="cart-summary-row"><span>Delivery</span><span style="color:var(--green)">Free</span></div>
            <div class="cart-summary-row total"><span>Total</span><span>₹${totalPrice}</span></div>
            <div class="cart-actions">
                <button class="btn-outline" onclick="showPage('menu')">← Add More</button>
                <button class="btn-primary" onclick="openOrderModal()" style="flex:1">Place Order 🎉</button>
            </div>
        </div>`;

    container.innerHTML = html;
}

/* ════════════ ORDER MODAL ════════════ */
function openOrderModal() {
    if (Object.keys(cart).length === 0) {
        toast('Cart is empty!', 'error');
        return;
    }
    tokenCounter++;
    document.getElementById('order-token-preview').value = 'TKN-' + String(tokenCounter).padStart(3, '0');
    document.getElementById('order-name-input').value = '';
    document.getElementById('order-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

function confirmOrder() {
    const name = document.getElementById('order-name-input').value.trim();
    if (!name) {
        toast('Please enter your name', 'error');
        return;
    }

    const token = document.getElementById('order-token-preview').value;
    const items = Object.entries(cart).map(([id, qty]) => {
        const item = menuItems.find(i => i.id === +id);
        return { ...item, qty };
    });
    const total = getCartTotal();

    const order = {
        token,
        name,
        items,
        total,
        status: 'Placed',     // Placed → Preparing → Ready
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    orders.unshift(order);
    cart = {};
    updateCartBadge();
    closeModal();
    showPage('orders');
    toast(`Order ${token} placed! 🎉`, 'success');
}

/* ════════════ ORDERS RENDERING ════════════ */
function renderOrders() {
    const container = document.getElementById('orders-content');

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="orders-empty">
                <div class="orders-empty-icon">📋</div>
                <div class="orders-empty-text">No orders yet</div>
                <div class="cart-empty-sub">Place your first order from the menu!</div>
                <br>
                <button class="btn-primary" onclick="showPage('menu')">Browse Menu →</button>
            </div>`;
        return;
    }

    const statusSteps = ['Placed', 'Preparing', 'Ready'];

    container.innerHTML = '<div class="orders-list">' + orders.map(order => {
        const stepIdx = statusSteps.indexOf(order.status);

        let statusBar = '<div class="order-status-bar">';
        statusSteps.forEach((step, i) => {
            const cls = i < stepIdx ? 'done' : (i === stepIdx ? 'active' : '');
            statusBar += `<div class="status-step ${cls}"><div class="status-dot"></div> ${step}</div>`;
            if (i < statusSteps.length - 1) {
                statusBar += `<div class="status-line ${i < stepIdx ? 'done' : ''}"></div>`;
            }
        });
        statusBar += '</div>';

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-token">${order.token}</div>
                        <div class="order-name">${order.name} · ${order.time}</div>
                    </div>
                    <span class="tag ${order.status === 'Ready' ? 'tag-green' : order.status === 'Preparing' ? 'tag-amber' : 'tag-blue'}">${order.status}</span>
                </div>
                <div class="order-items-list">
                    ${order.items.map(i => `
                        <div class="order-item-row">
                            <span>${i.emoji} ${i.name} × ${i.qty}</span>
                            <span>₹${i.price * i.qty}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <span>Total</span>
                    <span>₹${order.total}</span>
                </div>
                ${statusBar}
            </div>`;
    }).join('') + '</div>';
}

/* ════════════ TOAST ════════════ */
function toast(msg, type = '') {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerText = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ════════════ ADMIN ════════════ */
function doAdminLogin() {
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    if (u === 'admin' && p === 'admin123') {
        document.getElementById('admin-login-screen').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        renderAdminOverview();
        renderAdminOrders();
        renderMenuMgmt();
        toast('Welcome back, Admin', 'success');
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

function adminLogout() {
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('admin-login-screen').classList.remove('hidden');
    document.getElementById('admin-user').value = '';
    document.getElementById('admin-pass').value = '';
    document.getElementById('login-error').classList.add('hidden');
    showPage('home');
    toast('Logged out');
}

function showAdminPanel(panel) {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    const panelEl = document.getElementById('panel-' + panel);
    const btnEl = document.getElementById('sp-' + panel);
    if (panelEl) panelEl.classList.add('active');
    if (btnEl) btnEl.classList.add('active');

    if (panel === 'overview') renderAdminOverview();
    if (panel === 'orders')   renderAdminOrders();
    if (panel === 'menu')     renderMenuMgmt();
}

/* ── Admin: Overview ── */
function renderAdminOverview() {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const pending = orders.filter(o => o.status !== 'Ready').length;
    const menuCount = menuItems.length;

    document.getElementById('kpi-grid').innerHTML = `
        <div class="kpi-card"><div class="kpi-icon">📦</div><div class="kpi-val">${totalOrders}</div><div class="kpi-label">Total Orders</div></div>
        <div class="kpi-card"><div class="kpi-icon">💰</div><div class="kpi-val">₹${totalRevenue}</div><div class="kpi-label">Revenue</div></div>
        <div class="kpi-card"><div class="kpi-icon">⏳</div><div class="kpi-val">${pending}</div><div class="kpi-label">Pending</div></div>
        <div class="kpi-card"><div class="kpi-icon">🍽</div><div class="kpi-val">${menuCount}</div><div class="kpi-label">Menu Items</div></div>
    `;

    // Simple bar chart by category
    const catCounts = {};
    orders.forEach(o => o.items.forEach(i => {
        catCounts[i.cat] = (catCounts[i.cat] || 0) + i.qty;
    }));
    const cats = Object.keys(catCounts);
    const maxVal = Math.max(...Object.values(catCounts), 1);

    const chart = document.getElementById('sales-chart');
    if (cats.length === 0) {
        chart.innerHTML = '<div style="color:var(--muted);text-align:center;width:100%;padding:40px 0;">No order data yet</div>';
    } else {
        chart.innerHTML = cats.map(c => {
            const pct = (catCounts[c] / maxVal) * 100;
            return `<div class="bar-wrapper">
                <div class="bar-val">${catCounts[c]}</div>
                <div class="bar" style="height:${Math.max(pct, 8)}%"></div>
                <div class="bar-label">${c}</div>
            </div>`;
        }).join('');
    }
}

/* ── Admin: Orders ── */
function renderAdminOrders() {
    const body = document.getElementById('admin-orders-body');
    if (orders.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:40px;">No orders yet</td></tr>';
        return;
    }
    body.innerHTML = orders.map((o, idx) => `
        <tr>
            <td><strong style="color:var(--accent)">${o.token}</strong></td>
            <td>${o.name}</td>
            <td>${o.items.map(i => `${i.name}×${i.qty}`).join(', ')}</td>
            <td>₹${o.total}</td>
            <td>
                <select class="status-select" onchange="updateOrderStatus(${idx}, this.value)">
                    <option value="Placed" ${o.status === 'Placed' ? 'selected' : ''}>Placed</option>
                    <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready</option>
                </select>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(idx, status) {
    orders[idx].status = status;
    renderAdminOrders();
    renderAdminOverview();
    toast(`${orders[idx].token} → ${status}`, 'success');
}

/* ── Admin: Menu Management ── */
function renderMenuMgmt() {
    document.getElementById('menu-mgmt-grid').innerHTML = menuItems.map(item => `
        <div class="menu-mgmt-card">
            <div class="menu-mgmt-emoji">${item.emoji}</div>
            <div class="menu-mgmt-info">
                <div class="menu-mgmt-name">${item.name}</div>
                <div class="menu-mgmt-price">₹${item.price} · ${item.cat}</div>
            </div>
            <button class="toggle-btn ${item.avail ? 'available' : 'unavailable'}" onclick="toggleAvail(${item.id})">
                ${item.avail ? 'Available' : 'Sold Out'}
            </button>
        </div>
    `).join('');
}

function toggleAvail(id) {
    const item = menuItems.find(i => i.id === id);
    if (item) {
        item.avail = !item.avail;
        renderMenuMgmt();
        toast(`${item.name} — ${item.avail ? 'Available' : 'Sold Out'}`, item.avail ? 'success' : 'error');
    }
}
/* ════════════ THEME TOGGLE ════════════ */
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    const isLight = html.getAttribute('data-theme') === 'light';

    if (isLight) {
        html.removeAttribute('data-theme');
        icon.textContent = '🌙';
        localStorage.setItem('canteenq-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        icon.textContent = '☀️';
        localStorage.setItem('canteenq-theme', 'light');
    }
}

function loadSavedTheme() {
    const saved = localStorage.getItem('canteenq-theme');
    const icon = document.getElementById('theme-icon');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (icon) icon.textContent = '🌙';
    }
}

/* ════════════ INIT ════════════ */
window.onload = () => {
    loadSavedTheme();
    showPage('home');
    updateCartBadge();
};