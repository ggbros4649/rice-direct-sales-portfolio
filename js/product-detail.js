/**
 * 商品詳細ページのJavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // URLパラメータから商品IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showProductNotFound();
        return;
    }

    // 商品データを取得
    const product = getProductById(productId);

    if (!product) {
        showProductNotFound();
        return;
    }

    // 商品詳細を表示
    displayProductDetail(product);
    updatePageMeta(product);
});

/**
 * 商品が見つからない場合の表示
 */
function showProductNotFound() {
    document.getElementById('product-not-found').style.display = 'block';
    document.getElementById('product-detail-content').style.display = 'none';
}

/**
 * 商品詳細を表示
 */
function displayProductDetail(product) {
    // コンテナを表示
    document.getElementById('product-not-found').style.display = 'none';
    document.getElementById('product-detail-content').style.display = 'block';

    // パンくず
    document.getElementById('breadcrumb-product').textContent = product.name;

    // メイン画像
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;

    // サムネイル画像（複数ある場合）
    const thumbnailsContainer = document.getElementById('product-thumbnails');
    if (product.images.length > 1) {
        product.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `${product.name} 画像${index + 1}`;
            thumb.className = 'product-thumbnail';
            if (index === 0) thumb.classList.add('active');

            thumb.addEventListener('click', function() {
                mainImage.src = imgSrc;
                document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });

            thumbnailsContainer.appendChild(thumb);
        });
    }

    // タグ
    const tagsContainer = document.getElementById('product-tags');
    product.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'product-tag';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
    });

    // 商品名
    document.getElementById('product-name').textContent = product.name;

    // 価格
    document.getElementById('product-price').textContent = product.price.toLocaleString();
    document.getElementById('product-size').textContent = `（${product.size}）`;

    // 在庫情報
    const stockInfo = document.getElementById('product-stock-info');
    const stockStatus = getStockStatus(product.stock);
    const stockText = getStockStatusText(product.stock);
    stockInfo.textContent = `${stockText}（残り${product.stock}点）`;
    stockInfo.className = `product-stock-info ${stockStatus}`;

    // 送料
    document.getElementById('product-shipping-note').textContent = product.shippingNote;

    // 商品説明（短い）
    document.getElementById('product-description').textContent = product.description;

    // 詳細説明
    document.getElementById('product-detailed-description').textContent = product.detailedDescription;

    // 特徴リスト
    const featuresList = document.getElementById('product-features-list');
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // 炊き方のコツ
    document.getElementById('product-cooking-tips').textContent = product.cookingTips;

    // 関連商品（同じ銘柄の別サイズ）
    displayRelatedProducts(product);

    // 購入ボタンのイベント設定
    setupPurchaseActions(product);
}

/**
 * 関連商品を表示（同じ銘柄の別サイズ）
 */
function displayRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById('related-products');
    const relatedProducts = PRODUCTS.filter(p =>
        p.brand === currentProduct.brand && p.id !== currentProduct.id
    );

    if (relatedProducts.length === 0) {
        relatedContainer.parentElement.style.display = 'none';
        return;
    }

    relatedProducts.forEach(product => {
        const card = createRelatedProductCard(product);
        relatedContainer.appendChild(card);
    });
}

/**
 * 関連商品カードを生成
 */
function createRelatedProductCard(product) {
    const stockStatus = getStockStatus(product.stock);
    const stockText = getStockStatusText(product.stock);

    const card = document.createElement('div');
    card.className = 'related-product-card';

    card.innerHTML = `
        <div class="related-product-badge ${stockStatus}">${stockText}</div>
        <div class="related-product-image">
            <img src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="related-product-info">
            <h3 class="related-product-name">${product.name}</h3>
            <p class="related-product-price">${product.price.toLocaleString()}円<span class="price-unit">（${product.size}）</span></p>
            <a href="product-detail.html?id=${product.id}" class="btn btn-secondary btn-small btn-full">詳細を見る</a>
        </div>
    `;

    return card;
}

/**
 * 購入アクションの設定
 */
function setupPurchaseActions(product) {
    const buyNowBtn = document.getElementById('buy-now-btn');
    const yahooAuctionBtn = document.getElementById('yahoo-auction-btn');
    const amazonBtn = document.getElementById('amazon-btn');

    // 在庫切れの場合はボタンを無効化
    if (product.stock === 0) {
        buyNowBtn.textContent = '在庫切れ';
        buyNowBtn.classList.add('btn-disabled');
        buyNowBtn.style.pointerEvents = 'none';
        buyNowBtn.style.opacity = '0.5';

        // 外部リンクも無効化
        yahooAuctionBtn.style.display = 'none';
        amazonBtn.style.display = 'none';
        document.querySelector('.external-purchase-section').style.display = 'none';
        return;
    }

    // 購入へ進む
    buyNowBtn.href = `order.html?id=${product.id}&quantity=1`;

    // 外部サイトリンク（ダミーURL）
    // 実際の運用時は各ECサイトの商品URLに変更
    yahooAuctionBtn.href = `https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(product.name)}&auccat=`;
    amazonBtn.href = `https://www.amazon.co.jp/s?k=${encodeURIComponent(product.name)}`;
}

/**
 * ページのメタ情報を更新（SEO対策）
 */
function updatePageMeta(product) {
    // タイトル
    const title = `${product.name} - ○○農園｜米 直販`;
    document.getElementById('page-title').textContent = title;
    document.title = title;

    // メタディスクリプション
    const description = `${product.description} ${product.shippingNote}`;
    document.getElementById('meta-description').setAttribute('content', description);

    // OGP
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-description').setAttribute('content', description);

    if (product.images && product.images.length > 0) {
        const imageUrl = new URL(product.images[0], window.location.href).href;
        document.getElementById('og-image').setAttribute('content', imageUrl);
    }

    document.getElementById('og-url').setAttribute('content', window.location.href);
}
