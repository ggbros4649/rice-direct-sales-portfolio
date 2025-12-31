/**
 * 管理画面のJavaScript
 */

let allOrders = [];
let filteredOrders = [];
let searchQuery = '';
let statusFilter = 'all';

// お問い合わせ管理用
let allContacts = [];
let filteredContacts = [];
let contactSearchQuery = '';
let contactStatusFilter = 'all';

/**
 * XSS対策: HTMLエスケープ
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return text;
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    loadContacts();
    setupEventListeners();
    displayOrders();
    displayContacts();
    updateStats();
    updateContactStats();
});

/**
 * 注文データを読み込み
 */
function loadOrders() {
    allOrders = getOrders();
    applyFilters();
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    // 検索
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        searchQuery = this.value.trim().toLowerCase();
        applyFilters();
    });

    // ステータスフィルター
    document.getElementById('status-filter').addEventListener('change', function() {
        statusFilter = this.value;
        applyFilters();
    });

    // すべての注文をクリア
    document.getElementById('clear-all-orders').addEventListener('click', function() {
        if (confirm('すべての注文データを削除してもよろしいですか？この操作は取り消せません。')) {
            localStorage.removeItem('orders');
            loadOrders();
            displayOrders();
            updateStats();
            alert('すべての注文データを削除しました');
        }
    });

    // モーダルを閉じる
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('close-detail-btn').addEventListener('click', closeModal);

    // お問い合わせ検索
    const contactSearchInput = document.getElementById('contact-search-input');
    contactSearchInput.addEventListener('input', function() {
        contactSearchQuery = this.value.trim().toLowerCase();
        applyContactFilters();
    });

    // お問い合わせステータスフィルター
    document.getElementById('contact-status-filter').addEventListener('change', function() {
        contactStatusFilter = this.value;
        applyContactFilters();
    });

    // すべてのお問い合わせをクリア
    document.getElementById('clear-all-contacts').addEventListener('click', function() {
        if (confirm('すべてのお問い合わせデータを削除してもよろしいですか？この操作は取り消せません。')) {
            localStorage.removeItem('contacts');
            loadContacts();
            displayContacts();
            updateContactStats();
            alert('すべてのお問い合わせデータを削除しました');
        }
    });

    // お問い合わせモーダルを閉じる
    document.getElementById('close-contact-modal').addEventListener('click', closeContactModal);
    document.getElementById('close-contact-detail-btn').addEventListener('click', closeContactModal);
}

/**
 * お問い合わせモーダルを閉じる
 */
function closeContactModal() {
    document.getElementById('contact-detail-modal').style.display = 'none';
}

/**
 * フィルター・検索を適用
 */
function applyFilters() {
    filteredOrders = allOrders;

    // ステータスで絞り込み
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    // 検索（注文番号 or 顧客名）
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(order => {
            const orderNumber = order.orderNumber.toLowerCase();
            const customerName = order.customer.name.toLowerCase();
            return orderNumber.includes(searchQuery) || customerName.includes(searchQuery);
        });
    }

    displayOrders();
}

/**
 * 注文一覧を表示
 */
function displayOrders() {
    const tbody = document.getElementById('orders-tbody');
    const noOrdersMessage = document.getElementById('no-orders-message');

    tbody.innerHTML = '';

    if (filteredOrders.length === 0) {
        document.getElementById('orders-table').style.display = 'none';
        noOrdersMessage.style.display = 'block';
        return;
    }

    document.getElementById('orders-table').style.display = 'table';
    noOrdersMessage.style.display = 'none';

    // 新しい順にソート
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        return new Date(b.orderDate) - new Date(a.orderDate);
    });

    sortedOrders.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });
}

/**
 * 注文行を生成（XSS対策: textContent使用）
 */
function createOrderRow(order) {
    const tr = document.createElement('tr');

    const orderDate = new Date(order.orderDate);
    const formattedDate = `${orderDate.getFullYear()}/${String(orderDate.getMonth() + 1).padStart(2, '0')}/${String(orderDate.getDate()).padStart(2, '0')} ${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;

    // 注文番号セル
    const tdOrderNumber = document.createElement('td');
    tdOrderNumber.className = 'order-number';
    tdOrderNumber.textContent = order.orderNumber;
    tr.appendChild(tdOrderNumber);

    // 注文日時セル
    const tdDate = document.createElement('td');
    tdDate.textContent = formattedDate;
    tr.appendChild(tdDate);

    // 商品名セル
    const tdProduct = document.createElement('td');
    tdProduct.textContent = order.product.name;
    tr.appendChild(tdProduct);

    // 数量セル
    const tdQuantity = document.createElement('td');
    tdQuantity.textContent = order.quantity;
    tr.appendChild(tdQuantity);

    // 顧客名セル
    const tdCustomer = document.createElement('td');
    tdCustomer.textContent = order.customer.name;
    tr.appendChild(tdCustomer);

    // 合計金額セル
    const tdTotal = document.createElement('td');
    tdTotal.className = 'order-total';
    tdTotal.textContent = `${order.amount.total.toLocaleString()}円`;
    tr.appendChild(tdTotal);

    // ステータスセル（セレクトボックス）
    const tdStatus = document.createElement('td');
    const statusSelect = document.createElement('select');
    statusSelect.className = 'admin-select status-select';
    statusSelect.dataset.orderNumber = order.orderNumber;

    const statusOptions = ['注文受付', '発送準備中', '発送済み', 'キャンセル'];
    statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (status === order.status) {
            option.selected = true;
        }
        statusSelect.appendChild(option);
    });

    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${getStatusClass(order.status)}`;
    statusBadge.textContent = order.status;

    tdStatus.appendChild(statusBadge);
    tr.appendChild(tdStatus);

    // 操作セル
    const tdActions = document.createElement('td');
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'action-buttons';

    // ステータス変更セレクト + 更新ボタン
    const statusChangeDiv = document.createElement('div');
    statusChangeDiv.className = 'status-change-group';

    const statusSelectForChange = document.createElement('select');
    statusSelectForChange.className = 'admin-select admin-select-small';
    statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (status === order.status) {
            option.selected = true;
        }
        statusSelectForChange.appendChild(option);
    });

    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn-action btn-update';
    updateBtn.textContent = '更新';
    updateBtn.addEventListener('click', function() {
        updateOrderStatus(order.orderNumber, statusSelectForChange.value);
    });

    statusChangeDiv.appendChild(statusSelectForChange);
    statusChangeDiv.appendChild(updateBtn);

    // 詳細ボタン
    const detailBtn = document.createElement('button');
    detailBtn.className = 'btn-action btn-detail';
    detailBtn.textContent = '詳細';
    detailBtn.addEventListener('click', function() {
        showOrderDetail(order.orderNumber);
    });

    actionsDiv.appendChild(statusChangeDiv);
    actionsDiv.appendChild(detailBtn);
    tdActions.appendChild(actionsDiv);
    tr.appendChild(tdActions);

    return tr;
}

/**
 * ステータスに対応するCSSクラスを取得
 */
function getStatusClass(status) {
    switch (status) {
        case '注文受付':
            return 'pending';
        case '発送準備中':
            return 'preparing';
        case '発送済み':
            return 'shipped';
        case 'キャンセル':
            return 'cancelled';
        default:
            return 'unknown';
    }
}

/**
 * 注文詳細を表示
 */
function showOrderDetail(orderNumber) {
    const order = allOrders.find(o => o.orderNumber === orderNumber);

    if (!order) {
        alert('注文が見つかりませんでした');
        return;
    }

    const orderDate = new Date(order.orderDate);
    const formattedDate = `${orderDate.getFullYear()}年${String(orderDate.getMonth() + 1).padStart(2, '0')}月${String(orderDate.getDate()).padStart(2, '0')}日 ${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;

    const paymentMethodText = {
        'bank-transfer': '銀行振込',
        'cash-on-delivery': '代金引換（現金）',
        'credit-card': 'クレジットカード',
        'qr-payment': 'QR決済（PayPay）'
    };

    const detailContent = document.getElementById('order-detail-content');
    detailContent.innerHTML = `
        <div class="order-detail-section">
            <h3>基本情報</h3>
            <table class="detail-table">
                <tr>
                    <th>注文番号</th>
                    <td>${escapeHtml(order.orderNumber)}</td>
                </tr>
                <tr>
                    <th>注文日時</th>
                    <td>${escapeHtml(formattedDate)}</td>
                </tr>
                <tr>
                    <th>ステータス</th>
                    <td><span class="status-badge status-${getStatusClass(order.status)}">${escapeHtml(order.status)}</span></td>
                </tr>
            </table>
        </div>

        <div class="order-detail-section">
            <h3>商品情報</h3>
            <table class="detail-table">
                <tr>
                    <th>商品名</th>
                    <td>${escapeHtml(order.product.name)}</td>
                </tr>
                <tr>
                    <th>単価</th>
                    <td>${order.product.price.toLocaleString()}円</td>
                </tr>
                <tr>
                    <th>数量</th>
                    <td>${order.quantity}</td>
                </tr>
            </table>
        </div>

        <div class="order-detail-section">
            <h3>顧客情報</h3>
            <table class="detail-table">
                <tr>
                    <th>お名前</th>
                    <td>${escapeHtml(order.customer.name)}</td>
                </tr>
                <tr>
                    <th>メールアドレス</th>
                    <td>${escapeHtml(order.customer.email)}</td>
                </tr>
                <tr>
                    <th>電話番号</th>
                    <td>${escapeHtml(order.customer.phone)}</td>
                </tr>
            </table>
        </div>

        <div class="order-detail-section">
            <h3>配送先情報</h3>
            <table class="detail-table">
                <tr>
                    <th>郵便番号</th>
                    <td>${escapeHtml(order.delivery.postalCode)}</td>
                </tr>
                <tr>
                    <th>住所</th>
                    <td>${escapeHtml(order.delivery.address)}</td>
                </tr>
                ${order.delivery.deliveryDate ? `
                <tr>
                    <th>配送希望日</th>
                    <td>${escapeHtml(order.delivery.deliveryDate)}</td>
                </tr>
                ` : ''}
                ${order.delivery.note ? `
                <tr>
                    <th>備考</th>
                    <td>${escapeHtml(order.delivery.note)}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        <div class="order-detail-section">
            <h3>お支払い情報</h3>
            <table class="detail-table">
                <tr>
                    <th>お支払い方法</th>
                    <td>${paymentMethodText[order.payment.method] || order.payment.method}</td>
                </tr>
                <tr>
                    <th>小計</th>
                    <td>${order.amount.subtotal.toLocaleString()}円</td>
                </tr>
                <tr>
                    <th>送料</th>
                    <td>${order.amount.shipping === 0 ? '無料' : order.amount.shipping.toLocaleString() + '円'}</td>
                </tr>
                <tr class="total-row">
                    <th>合計金額</th>
                    <td class="total-amount">${order.amount.total.toLocaleString()}円</td>
                </tr>
            </table>
        </div>
    `;

    document.getElementById('order-detail-modal').style.display = 'flex';
}

/**
 * ステータスを更新
 */
function updateOrderStatus(orderNumber, newStatus) {
    const order = allOrders.find(o => o.orderNumber === orderNumber);

    if (!order) {
        alert('注文が見つかりませんでした');
        return;
    }

    if (order.status === newStatus) {
        alert('現在と同じステータスです');
        return;
    }

    if (confirm(`ステータスを「${order.status}」から「${newStatus}」に変更しますか？`)) {
        order.status = newStatus;

        // localStorageを更新
        localStorage.setItem('orders', JSON.stringify(allOrders));

        // 表示を更新
        loadOrders();
        displayOrders();
        updateStats();

        alert(`ステータスを「${newStatus}」に変更しました`);
    }
}

/**
 * 統計情報を更新
 */
function updateStats() {
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === '注文受付').length;
    const preparingOrders = allOrders.filter(o => o.status === '発送準備中').length;
    const shippedOrders = allOrders.filter(o => o.status === '発送済み').length;
    const cancelledOrders = allOrders.filter(o => o.status === 'キャンセル').length;

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('preparing-orders').textContent = preparingOrders;
    document.getElementById('shipped-orders').textContent = shippedOrders;
    document.getElementById('cancelled-orders').textContent = cancelledOrders;
}

/**
 * モーダルを閉じる
 */
function closeModal() {
    document.getElementById('order-detail-modal').style.display = 'none';
}

/* ========================================
   お問い合わせ管理機能
======================================== */

/**
 * お問い合わせデータを読み込み
 */
function loadContacts() {
    allContacts = getContacts();
    applyContactFilters();
}

/**
 * フィルター・検索を適用（お問い合わせ）
 */
function applyContactFilters() {
    filteredContacts = allContacts;

    // ステータスで絞り込み
    if (contactStatusFilter !== 'all') {
        filteredContacts = filteredContacts.filter(contact => contact.status === contactStatusFilter);
    }

    // 検索（名前 or メール）
    if (contactSearchQuery) {
        filteredContacts = filteredContacts.filter(contact => {
            const name = contact.name.toLowerCase();
            const email = contact.email.toLowerCase();
            return name.includes(contactSearchQuery) || email.includes(contactSearchQuery);
        });
    }

    displayContacts();
}

/**
 * お問い合わせ一覧を表示
 */
function displayContacts() {
    const tbody = document.getElementById('contacts-tbody');
    const noContactsMessage = document.getElementById('no-contacts-message');

    tbody.innerHTML = '';

    if (filteredContacts.length === 0) {
        document.getElementById('contacts-table').style.display = 'none';
        noContactsMessage.style.display = 'block';
        return;
    }

    document.getElementById('contacts-table').style.display = 'table';
    noContactsMessage.style.display = 'none';

    // 新しい順にソート
    const sortedContacts = [...filteredContacts].sort((a, b) => {
        return new Date(b.contactDate) - new Date(a.contactDate);
    });

    sortedContacts.forEach(contact => {
        const row = createContactRow(contact);
        tbody.appendChild(row);
    });
}

/**
 * お問い合わせ行を生成（XSS対策: textContent使用）
 */
function createContactRow(contact) {
    const tr = document.createElement('tr');

    const contactDate = new Date(contact.contactDate);
    const formattedDate = `${contactDate.getFullYear()}/${String(contactDate.getMonth() + 1).padStart(2, '0')}/${String(contactDate.getDate()).padStart(2, '0')} ${String(contactDate.getHours()).padStart(2, '0')}:${String(contactDate.getMinutes()).padStart(2, '0')}`;

    // お問い合わせ番号セル
    const tdContactNumber = document.createElement('td');
    tdContactNumber.className = 'order-number';
    tdContactNumber.textContent = contact.contactNumber;
    tr.appendChild(tdContactNumber);

    // 受付日時セル
    const tdDate = document.createElement('td');
    tdDate.textContent = formattedDate;
    tr.appendChild(tdDate);

    // お名前セル
    const tdName = document.createElement('td');
    tdName.textContent = contact.name;
    tr.appendChild(tdName);

    // メールアドレスセル
    const tdEmail = document.createElement('td');
    tdEmail.textContent = contact.email;
    tr.appendChild(tdEmail);

    // 種別セル
    const tdType = document.createElement('td');
    tdType.textContent = contact.type;
    tr.appendChild(tdType);

    // ステータスセル
    const tdStatus = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${getContactStatusClass(contact.status)}`;
    statusBadge.textContent = contact.status;
    tdStatus.appendChild(statusBadge);
    tr.appendChild(tdStatus);

    // 操作セル
    const tdActions = document.createElement('td');
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'action-buttons';

    // ステータス変更セレクト + 更新ボタン
    const statusChangeDiv = document.createElement('div');
    statusChangeDiv.className = 'status-change-group';

    const statusOptions = ['未対応', '対応済み'];
    const statusSelectForChange = document.createElement('select');
    statusSelectForChange.className = 'admin-select admin-select-small';
    statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (status === contact.status) {
            option.selected = true;
        }
        statusSelectForChange.appendChild(option);
    });

    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn-action btn-update';
    updateBtn.textContent = '更新';
    updateBtn.addEventListener('click', function() {
        updateContactStatus(contact.contactNumber, statusSelectForChange.value);
    });

    statusChangeDiv.appendChild(statusSelectForChange);
    statusChangeDiv.appendChild(updateBtn);

    // 詳細ボタン
    const detailBtn = document.createElement('button');
    detailBtn.className = 'btn-action btn-detail';
    detailBtn.textContent = '詳細';
    detailBtn.addEventListener('click', function() {
        showContactDetail(contact.contactNumber);
    });

    actionsDiv.appendChild(statusChangeDiv);
    actionsDiv.appendChild(detailBtn);
    tdActions.appendChild(actionsDiv);
    tr.appendChild(tdActions);

    return tr;
}

/**
 * ステータスに対応するCSSクラスを取得（お問い合わせ）
 */
function getContactStatusClass(status) {
    switch (status) {
        case '未対応':
            return 'pending';
        case '対応済み':
            return 'shipped';
        default:
            return 'unknown';
    }
}

/**
 * お問い合わせ詳細を表示
 */
function showContactDetail(contactNumber) {
    const contact = allContacts.find(c => c.contactNumber === contactNumber);

    if (!contact) {
        alert('お問い合わせが見つかりませんでした');
        return;
    }

    const contactDate = new Date(contact.contactDate);
    const formattedDate = `${contactDate.getFullYear()}年${String(contactDate.getMonth() + 1).padStart(2, '0')}月${String(contactDate.getDate()).padStart(2, '0')}日 ${String(contactDate.getHours()).padStart(2, '0')}:${String(contactDate.getMinutes()).padStart(2, '0')}`;

    const detailContent = document.getElementById('contact-detail-content');
    detailContent.innerHTML = `
        <div class="order-detail-section">
            <h3>基本情報</h3>
            <table class="detail-table">
                <tr>
                    <th>お問い合わせ番号</th>
                    <td>${escapeHtml(contact.contactNumber)}</td>
                </tr>
                <tr>
                    <th>受付日時</th>
                    <td>${escapeHtml(formattedDate)}</td>
                </tr>
                <tr>
                    <th>ステータス</th>
                    <td><span class="status-badge status-${getContactStatusClass(contact.status)}">${escapeHtml(contact.status)}</span></td>
                </tr>
            </table>
        </div>

        <div class="order-detail-section">
            <h3>お客様情報</h3>
            <table class="detail-table">
                <tr>
                    <th>お名前</th>
                    <td>${escapeHtml(contact.name)}</td>
                </tr>
                <tr>
                    <th>メールアドレス</th>
                    <td>${escapeHtml(contact.email)}</td>
                </tr>
                <tr>
                    <th>お問い合わせ種別</th>
                    <td>${escapeHtml(contact.type)}</td>
                </tr>
            </table>
        </div>

        <div class="order-detail-section">
            <h3>お問い合わせ内容</h3>
            <div class="contact-message-box">
                ${escapeHtml(contact.message).replace(/\n/g, '<br>')}
            </div>
        </div>
    `;

    document.getElementById('contact-detail-modal').style.display = 'flex';
}

/**
 * ステータスを更新（お問い合わせ）
 */
function updateContactStatus(contactNumber, newStatus) {
    const contact = allContacts.find(c => c.contactNumber === contactNumber);

    if (!contact) {
        alert('お問い合わせが見つかりませんでした');
        return;
    }

    if (contact.status === newStatus) {
        alert('現在と同じステータスです');
        return;
    }

    if (confirm(`ステータスを「${contact.status}」から「${newStatus}」に変更しますか？`)) {
        contact.status = newStatus;

        // localStorageを更新
        localStorage.setItem('contacts', JSON.stringify(allContacts));

        // 表示を更新
        loadContacts();
        displayContacts();
        updateContactStats();

        alert(`ステータスを「${newStatus}」に変更しました`);
    }
}

/**
 * 統計情報を更新（お問い合わせ）
 */
function updateContactStats() {
    const totalContacts = allContacts.length;
    const pendingContacts = allContacts.filter(c => c.status === '未対応').length;
    const respondedContacts = allContacts.filter(c => c.status === '対応済み').length;

    document.getElementById('total-contacts').textContent = totalContacts;
    document.getElementById('pending-contacts').textContent = pendingContacts;
    document.getElementById('responded-contacts').textContent = respondedContacts;
}
