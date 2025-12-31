/**
 * 商品マスターデータ
 * 全ページで共通利用する商品情報
 */

const PRODUCTS = [
    {
        id: 'tsuyahime-5kg',
        name: 'つや姫 5kg',
        brand: 'tsuyahime',
        brandName: 'つや姫',
        size: '5kg',
        price: 3800,
        stock: 25,
        popularity: 5,
        tags: ['人気', 'ブランド米', '山形県産'],
        description: '山形県が誇るブランド米。粒が大きく艶やかで、程よい甘みと粘りが特徴です。炊き上がりの美しさと、冷めても美味しさが持続する点が多くのお客様に支持されています。',
        detailedDescription: '「つや姫」は、山形県が10年の歳月をかけて開発した自信作です。際立つ「粒の大きさ」「白い輝き」「旨さ」「香り」「粘り」が特長で、どんな料理とも相性抜群。お弁当やおにぎりにも最適です。',
        images: [
            'images/products/tsuyahime-5kg.jpg',
            'images/products/tsuyahime-5kg-2.jpg'
        ],
        shippingNote: '全国一律800円（1万円以上で送料無料）',
        features: [
            '粒が大きく、ツヤツヤとした美しい見た目',
            '甘みと旨味のバランスが絶妙',
            '冷めても美味しさが持続',
            '炊飯時の香りが豊か'
        ],
        cookingTips: '水加減は気持ち少なめにすると、つや姫の特徴がより引き立ちます。30分程度浸水させてから炊飯するのがおすすめです。'
    },
    {
        id: 'tsuyahime-10kg',
        name: 'つや姫 10kg',
        brand: 'tsuyahime',
        brandName: 'つや姫',
        size: '10kg',
        price: 7200,
        stock: 18,
        popularity: 4,
        tags: ['お得', 'ブランド米', '山形県産'],
        description: '山形県が誇るブランド米。粒が大きく艶やかで、程よい甘みと粘りが特徴です。ご家族でたっぷり楽しめるお得な10kgサイズ。',
        detailedDescription: 'つや姫の10kgパック。ご家族での日常使いに最適なサイズです。5kgを2袋よりもお得な価格設定となっております。',
        images: [
            'images/products/tsuyahime-10kg.jpg'
        ],
        shippingNote: '全国一律800円（1万円以上で送料無料）',
        features: [
            '粒が大きく、ツヤツヤとした美しい見た目',
            '甘みと旨味のバランスが絶妙',
            '冷めても美味しさが持続',
            'ご家族での日常使いに最適なサイズ'
        ],
        cookingTips: '水加減は気持ち少なめにすると、つや姫の特徴がより引き立ちます。30分程度浸水させてから炊飯するのがおすすめです。'
    },
    {
        id: 'hitomebore-5kg',
        name: 'ひとめぼれ 5kg',
        brand: 'hitomebore',
        brandName: 'ひとめぼれ',
        size: '5kg',
        price: 3300,
        stock: 8,
        popularity: 6,
        tags: ['残りわずか', '定番', '万能'],
        description: 'バランスの良い味わいで、どんな料理にも合う万能品種。毎日のご飯におすすめです。',
        detailedDescription: '「ひとめぼれ」は、コシヒカリを親に持つ品種で、粘りとあっさり感のバランスが良く、どんなおかずとも相性抜群。和食はもちろん、洋食や中華にも合わせやすい万能米です。',
        images: [
            'images/products/hitomebore-5kg.jpg'
        ],
        shippingNote: '全国一律800円（1万円以上で送料無料）',
        features: [
            '粘りとあっさり感のバランスが良い',
            'どんな料理にも合う万能性',
            'コシヒカリ譲りの美味しさ',
            'クセがなく食べやすい'
        ],
        cookingTips: '標準的な水加減で炊飯してください。浸水時間は夏場30分、冬場1時間程度が目安です。'
    },
    {
        id: 'hitomebore-10kg',
        name: 'ひとめぼれ 10kg',
        brand: 'hitomebore',
        brandName: 'ひとめぼれ',
        size: '10kg',
        price: 6300,
        stock: 32,
        popularity: 3,
        tags: ['お得', '定番', '万能'],
        description: 'バランスの良い味わいで、どんな料理にも合う万能品種。ご家族でのデイリーユースに最適な10kgサイズ。',
        detailedDescription: 'ひとめぼれの10kgパック。毎日の食卓に欠かせないお米を、お得な価格でご提供します。',
        images: [
            'images/products/hitomebore-10kg.jpg'
        ],
        shippingNote: '全国一律800円（1万円以上で送料無料）',
        features: [
            '粘りとあっさり感のバランスが良い',
            'どんな料理にも合う万能性',
            'コシヒカリ譲りの美味しさ',
            'ご家族での日常使いに最適'
        ],
        cookingTips: '標準的な水加減で炊飯してください。浸水時間は夏場30分、冬場1時間程度が目安です。'
    },
    {
        id: 'sasanishiki-5kg',
        name: 'ササニシキ 5kg',
        brand: 'sasanishiki',
        brandName: 'ササニシキ',
        size: '5kg',
        price: 3600,
        stock: 15,
        popularity: 2,
        tags: ['和食向け', 'あっさり', '寿司・酢飯に最適'],
        description: 'あっさりとした食感で、寿司や和食によく合う品種。粘りが少なくさらりとした口当たりです。',
        detailedDescription: 'ササニシキは、粘りが少なくあっさりとした食感が特徴。寿司職人に愛される品種で、酢飯との相性が抜群です。和食全般、特に魚料理との相性が良いお米です。',
        images: [
            'images/products/sasanishiki-5kg.jpg'
        ],
        shippingNote: '全国一律800円（1万円以上で送料無料）',
        features: [
            'あっさりとした上品な味わい',
            '粘りが少なく、さらりとした食感',
            '寿司・酢飯に最適',
            '和食全般との相性抜群'
        ],
        cookingTips: '水加減は標準通りで問題ありません。酢飯にする場合は、炊き上がり直後に酢を混ぜるとツヤよく仕上がります。'
    },
    {
        id: 'sasanishiki-10kg',
        name: 'ササニシキ 10kg',
        brand: 'sasanishiki',
        brandName: 'ササニシキ',
        size: '10kg',
        price: 6900,
        stock: 6,
        popularity: 1,
        tags: ['残りわずか', '和食向け', 'あっさり'],
        description: 'あっさりとした食感で、寿司や和食によく合う品種。お寿司好きのご家庭に最適な10kgサイズ。',
        detailedDescription: 'ササニシキの10kgパック。和食中心のご家庭や、お弁当作りが多いご家庭におすすめです。',
        images: [
            'images/products/sasanishiki-10kg.jpg'
        ],
        shippingNote: '全国一律800円（1万円以上で送料無料）',
        features: [
            'あっさりとした上品な味わい',
            '粘りが少なく、さらりとした食感',
            '寿司・酢飯に最適',
            '和食全般との相性抜群'
        ],
        cookingTips: '水加減は標準通りで問題ありません。酢飯にする場合は、炊き上がり直後に酢を混ぜるとツヤよく仕上がります。'
    }
];

/**
 * 商品IDから商品情報を取得
 * @param {string} productId - 商品ID
 * @returns {object|null} 商品情報またはnull
 */
function getProductById(productId) {
    return PRODUCTS.find(product => product.id === productId) || null;
}

/**
 * 銘柄で商品をフィルタリング
 * @param {string} brand - 銘柄名
 * @returns {array} フィルタリングされた商品配列
 */
function getProductsByBrand(brand) {
    if (brand === 'all') return PRODUCTS;
    return PRODUCTS.filter(product => product.brand === brand);
}

/**
 * 容量で商品をフィルタリング
 * @param {string} size - 容量
 * @returns {array} フィルタリングされた商品配列
 */
function getProductsBySize(size) {
    if (size === 'all') return PRODUCTS;
    return PRODUCTS.filter(product => product.size === size);
}

/**
 * 在庫状態を取得
 * @param {number} stock - 在庫数
 * @returns {string} 'available' | 'limited' | 'out-of-stock'
 */
function getStockStatus(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'limited';
    return 'available';
}

/**
 * 在庫状態の日本語表示を取得
 * @param {number} stock - 在庫数
 * @returns {string} 在庫状態の日本語
 */
function getStockStatusText(stock) {
    const status = getStockStatus(stock);
    switch (status) {
        case 'available':
            return '在庫あり';
        case 'limited':
            return '残りわずか';
        case 'out-of-stock':
            return '在庫切れ';
        default:
            return '在庫確認中';
    }
}

// グローバルスコープに公開（古いブラウザ対応）
if (typeof window !== 'undefined') {
    window.PRODUCTS = PRODUCTS;
    window.getProductById = getProductById;
    window.getProductsByBrand = getProductsByBrand;
    window.getProductsBySize = getProductsBySize;
    window.getStockStatus = getStockStatus;
    window.getStockStatusText = getStockStatusText;
}
