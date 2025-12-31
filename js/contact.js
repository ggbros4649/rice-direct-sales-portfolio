/**
 * お問い合わせページのJavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    setupFormSubmit();
});

/**
 * フォーム送信の設定
 */
function setupFormSubmit() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // フォームデータを取得
        const formData = new FormData(form);

        // バリデーション
        if (!validateForm(formData)) {
            return;
        }

        // お問い合わせデータを作成
        const contactData = createContactData(formData);

        // localStorageに保存
        saveContact(contactData);

        // 送信完了モーダルを表示
        showContactCompleteModal(contactData.contactNumber);

        // フォームをリセット
        form.reset();
    });
}

/**
 * フォームバリデーション
 */
function validateForm(formData) {
    const name = formData.get('contact-name');
    const email = formData.get('contact-email');
    const type = formData.get('contact-type');
    const message = formData.get('contact-message');

    if (!name || !email || !type || !message) {
        alert('必須項目をすべて入力してください');
        return false;
    }

    // メールアドレスの簡易チェック
    if (!email.includes('@') || !email.includes('.')) {
        alert('正しいメールアドレスを入力してください');
        return false;
    }

    // メッセージの長さチェック
    if (message.length < 10) {
        alert('お問い合わせ内容は10文字以上入力してください');
        return false;
    }

    return true;
}

/**
 * お問い合わせデータを作成
 */
function createContactData(formData) {
    const contactNumber = generateContactNumber();

    return {
        contactNumber: contactNumber,
        contactDate: new Date().toISOString(),
        status: '未対応',
        name: sanitizeInput(formData.get('contact-name')),
        email: sanitizeInput(formData.get('contact-email')),
        type: sanitizeInput(formData.get('contact-type')),
        message: sanitizeInput(formData.get('contact-message'))
    };
}

/**
 * XSS対策: 入力値のサニタイズ
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }
    // 基本的なHTMLエスケープ
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * お問い合わせ番号を生成
 */
function generateContactNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `CNT${year}${month}${day}${hours}${minutes}${seconds}${random}`;
}

/**
 * お問い合わせをlocalStorageに保存
 */
function saveContact(contactData) {
    // 既存のお問い合わせデータを取得
    const contacts = getContacts();

    // 新しいお問い合わせを追加
    contacts.push(contactData);

    // localStorageに保存
    localStorage.setItem('contacts', JSON.stringify(contacts));

    console.log('お問い合わせを保存しました:', contactData);
}

/**
 * すべてのお問い合わせデータを取得
 */
function getContacts() {
    const contactsJson = localStorage.getItem('contacts');
    return contactsJson ? JSON.parse(contactsJson) : [];
}

/**
 * 送信完了モーダルを表示
 */
function showContactCompleteModal(contactNumber) {
    document.getElementById('contact-number').textContent = contactNumber;
    document.getElementById('contact-complete-modal').style.display = 'flex';
}

// グローバルスコープに公開
if (typeof window !== 'undefined') {
    window.getContacts = getContacts;
}
