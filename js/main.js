// メインJavaScript

// DOMContentLoaded イベント
document.addEventListener('DOMContentLoaded', function() {
    console.log('○○農園サイトが読み込まれました');

    // スムーススクロール
    initSmoothScroll();

    // 商品一覧ページの絞り込み・並び替え機能
    if (document.getElementById('products-grid')) {
        initProductFilters();
    }

    // ページトップに戻るボタン（将来的に追加予定）
    // initScrollToTop();
});

/**
 * スムーススクロール初期化
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // # のみの場合は何もしない
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const targetPosition = target.offsetTop - 80; // ヘッダー分の余白

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * フォームバリデーション（将来的に使用）
 */
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

/**
 * 商品カートへの追加（ダミー実装）
 */
function addToCart(productId) {
    // 将来的にローカルストレージやバックエンドと連携
    console.log(`商品ID ${productId} をカートに追加しました`);
    alert('商品をカートに追加しました（ダミー動作）');
}

/**
 * 商品一覧の絞り込み・並び替え機能
 */
function initProductFilters() {
    const productsGrid = document.getElementById('products-grid');
    const filterVariety = document.getElementById('filter-variety');
    const filterWeight = document.getElementById('filter-weight');
    const filterStock = document.getElementById('filter-stock');
    const sortOrder = document.getElementById('sort-order');
    const resetButton = document.getElementById('reset-filters');
    const resetFromNoResults = document.getElementById('reset-from-no-results');
    const productCountNumber = document.getElementById('product-count-number');
    const noResults = document.getElementById('no-results');

    // 商品データ（グローバル変数 PRODUCTS を使用）
    let allProducts = PRODUCTS;

    /**
     * 絞り込み＆並び替えを実行
     */
    function applyFiltersAndSort() {
        const selectedVariety = filterVariety.value;
        const selectedWeight = filterWeight.value;
        const selectedStock = filterStock.value;
        const selectedSort = sortOrder.value;

        // 絞り込み処理
        let filteredProducts = allProducts.filter(product => {
            const varietyMatch = selectedVariety === 'all' || product.brand === selectedVariety;
            const weightMatch = selectedWeight === 'all' || product.size === selectedWeight;

            const productStockStatus = getStockStatus(product.stock);
            const stockMatch = selectedStock === 'all' || productStockStatus === selectedStock;

            return varietyMatch && weightMatch && stockMatch;
        });

        // 並び替え処理
        if (selectedSort === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (selectedSort === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (selectedSort === 'popular') {
            filteredProducts.sort((a, b) => b.popularity - a.popularity);
        }

        // 表示更新
        updateProductDisplay(filteredProducts);
    }

    /**
     * 商品表示を更新
     */
    function updateProductDisplay(products) {
        // グリッドをクリア
        productsGrid.innerHTML = '';

        if (products.length === 0) {
            // 商品が見つからない場合
            productsGrid.style.display = 'none';
            noResults.style.display = 'block';
            productCountNumber.textContent = '0';
        } else {
            // 商品が見つかった場合
            productsGrid.style.display = 'grid';
            noResults.style.display = 'none';
            productCountNumber.textContent = products.length;

            // フィルタリング済みの商品を追加
            products.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }
    }

    /**
     * 商品カードのHTML要素を生成
     */
    function createProductCard(product) {
        const stockStatus = getStockStatus(product.stock);
        const stockText = getStockStatusText(product.stock);

        const card = document.createElement('div');
        card.className = 'product-card-full';
        card.setAttribute('data-variety', product.brand);
        card.setAttribute('data-weight', product.size);
        card.setAttribute('data-stock', stockStatus);
        card.setAttribute('data-price', product.price);
        card.setAttribute('data-popularity', product.popularity);

        card.innerHTML = `
            <div class="product-badge ${stockStatus}">${stockText}</div>
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">
                    ${product.description}
                </p>
                <div class="product-details">
                    <p class="product-price">${product.price.toLocaleString()}円<span class="price-unit">（${product.size}）</span></p>
                    <p class="product-shipping">${product.shippingNote}</p>
                    <p class="product-stock ${stockStatus}">${stockText}</p>
                </div>
                <a href="product-detail.html?id=${product.id}" class="btn btn-secondary btn-full">詳細を見る</a>
            </div>
        `;

        return card;
    }

    /**
     * フィルターをリセット
     */
    function resetFilters() {
        filterVariety.value = 'all';
        filterWeight.value = 'all';
        filterStock.value = 'all';
        sortOrder.value = 'popular';
        applyFiltersAndSort();
    }

    // イベントリスナーの設定
    filterVariety.addEventListener('change', applyFiltersAndSort);
    filterWeight.addEventListener('change', applyFiltersAndSort);
    filterStock.addEventListener('change', applyFiltersAndSort);
    sortOrder.addEventListener('change', applyFiltersAndSort);
    resetButton.addEventListener('click', resetFilters);
    resetFromNoResults.addEventListener('click', resetFilters);

    // 初期表示（人気順でソート）
    applyFiltersAndSort();
}
