/**
 * 注文ページのJavaScript
 */

let currentProduct = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', function() {
    // URLパラメータから商品IDと数量を取得
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const initialQuantity = parseInt(urlParams.get('quantity')) || 1;

    if (!productId) {
        alert('商品が選択されていません');
        window.location.href = 'products.html';
        return;
    }

    // 商品データを取得
    const product = getProductById(productId);

    if (!product) {
        alert('商品が見つかりませんでした');
        window.location.href = 'products.html';
        return;
    }

    currentProduct = product;
    currentQuantity = initialQuantity;

    // 配送希望日の最小日付を設定（今日以降）
    setMinDeliveryDate();

    // 商品情報を表示
    displayProductInfo(product);

    // 数量セレクタのイベント設定
    setupQuantitySelector();

    // フォーム送信イベント
    setupFormSubmit();

    // 初期表示の更新
    updateOrderSummary();
});

/**
 * 配送希望日の最小日付を設定
 */
function setMinDeliveryDate() {
    const deliveryDateInput = document.getElementById('delivery-date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    deliveryDateInput.setAttribute('min', minDate);
}

/**
 * 商品情報を表示
 */
function displayProductInfo(product) {
    const productInfoContainer = document.getElementById('order-product-info');

    productInfoContainer.innerHTML = `
        <div class="order-product-card">
            <div class="order-product-image">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="order-product-details">
                <h3 class="order-product-name">${product.name}</h3>
                <p class="order-product-price">${product.price.toLocaleString()}円（${product.size}）</p>
                <p class="order-product-stock">在庫：${product.stock}点</p>
            </div>
        </div>
    `;

    // サマリーにも商品情報を設定
    document.getElementById('summary-product-name').textContent = product.name;
    document.getElementById('summary-unit-price').textContent = `${product.price.toLocaleString()}円`;
}

/**
 * 数量セレクタのイベント設定
 */
function setupQuantitySelector() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');

    // 初期値を設定
    quantityInput.value = currentQuantity;

    // 数量変更イベント
    quantityInput.addEventListener('change', function() {
        let qty = parseInt(this.value);

        // 在庫数チェック
        if (qty > currentProduct.stock) {
            qty = currentProduct.stock;
            this.value = qty;
            alert(`在庫は${currentProduct.stock}点までです`);
        }

        if (qty < 1) {
            qty = 1;
            this.value = qty;
        }

        currentQuantity = qty;
        updateOrderSummary();
    });

    // 減らすボタン
    decreaseBtn.addEventListener('click', function() {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) {
            qty--;
            quantityInput.value = qty;
            currentQuantity = qty;
            updateOrderSummary();
        }
    });

    // 増やすボタン
    increaseBtn.addEventListener('click', function() {
        let qty = parseInt(quantityInput.value);
        if (qty < currentProduct.stock) {
            qty++;
            quantityInput.value = qty;
            currentQuantity = qty;
            updateOrderSummary();
        } else {
            alert(`在庫は${currentProduct.stock}点までです`);
        }
    });
}

/**
 * 注文サマリーを更新
 */
function updateOrderSummary() {
    const unitPrice = currentProduct.price;
    const quantity = currentQuantity;
    const subtotal = unitPrice * quantity;
    const shipping = subtotal >= 10000 ? 0 : 800;
    const total = subtotal + shipping;

    document.getElementById('summary-quantity').textContent = quantity;
    document.getElementById('summary-subtotal').textContent = `${subtotal.toLocaleString()}円`;
    document.getElementById('summary-shipping').textContent = shipping === 0 ? '無料' : `${shipping}円`;
    document.getElementById('summary-total').textContent = `${total.toLocaleString()}円`;
}

/**
 * フォーム送信の設定
 */
function setupFormSubmit() {
    const form = document.getElementById('order-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // フォームデータを取得
        const formData = new FormData(form);

        // バリデーション
        if (!validateForm(formData)) {
            return;
        }

        // 注文データを作成
        const orderData = createOrderData(formData);

        // localStorageに保存
        saveOrder(orderData);

        // 注文完了モーダルを表示
        showOrderCompleteModal(orderData.orderNumber);
    });
}

/**
 * フォームバリデーション
 */
function validateForm(formData) {
    const customerName = formData.get('customer-name');
    const customerEmail = formData.get('customer-email');
    const customerPhone = formData.get('customer-phone');
    const postalCode = formData.get('postal-code');
    const address = formData.get('address');

    if (!customerName || !customerEmail || !customerPhone || !postalCode || !address) {
        alert('必須項目をすべて入力してください');
        return false;
    }

    // メールアドレスの簡易チェック
    if (!customerEmail.includes('@')) {
        alert('正しいメールアドレスを入力してください');
        return false;
    }

    return true;
}

/**
 * 注文データを作成
 */
function createOrderData(formData) {
    const orderNumber = generateOrderNumber();
    const subtotal = currentProduct.price * currentQuantity;
    const shipping = subtotal >= 10000 ? 0 : 800;
    const total = subtotal + shipping;

    return {
        orderNumber: orderNumber,
        orderDate: new Date().toISOString(),
        status: '注文受付',
        product: {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            size: currentProduct.size
        },
        quantity: currentQuantity,
        customer: {
            name: formData.get('customer-name'),
            email: formData.get('customer-email'),
            phone: formData.get('customer-phone')
        },
        delivery: {
            postalCode: formData.get('postal-code'),
            address: formData.get('address'),
            deliveryDate: formData.get('delivery-date') || '',
            note: formData.get('delivery-note') || ''
        },
        payment: {
            method: formData.get('payment-method')
        },
        amount: {
            subtotal: subtotal,
            shipping: shipping,
            total: total
        }
    };
}

/**
 * 注文番号を生成
 */
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `ORD${year}${month}${day}${hours}${minutes}${seconds}${random}`;
}

/**
 * 注文をlocalStorageに保存
 */
function saveOrder(orderData) {
    // 既存の注文データを取得
    const orders = getOrders();

    // 新しい注文を追加
    orders.push(orderData);

    // localStorageに保存
    localStorage.setItem('orders', JSON.stringify(orders));

    console.log('注文を保存しました:', orderData);
}

/**
 * すべての注文データを取得
 */
function getOrders() {
    const ordersJson = localStorage.getItem('orders');
    return ordersJson ? JSON.parse(ordersJson) : [];
}

/**
 * 注文完了モーダルを表示
 */
function showOrderCompleteModal(orderNumber) {
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-complete-modal').style.display = 'flex';
}

// グローバルスコープに公開
if (typeof window !== 'undefined') {
    window.getOrders = getOrders;
}
