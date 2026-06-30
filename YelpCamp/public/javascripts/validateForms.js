// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => { // 立即執行函式 (IIFE) 意思是這整段程式一載入（頁面打開）就會自動執行，不用手動呼叫
    'use strict' // 開啟 嚴格模式，讓 JavaScript 更嚴謹地執行


    bsCustomFileInput.init() // 這行是用來初始化 bs-custom-file-input 的，讓它能夠在頁面上美化文件上傳按鈕，這樣使用者在選擇檔案的時候就會看到一個更好看的按鈕了

    const forms = document.querySelectorAll('.validated-form') // 找到頁面中所有擁有 .validated-form class 的 <form> 元素

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => { // 對每一個表單都監聽 submit 事件，只要使用者按下「送出」按鈕，這段程式就會被觸發
            if (!form.checkValidity()) {
                event.preventDefault() // 阻止表單真的送出
                event.stopPropagation() // 防止事件繼續傳遞（例如傳到上層元素）
            }
            form.classList.add('was-validated')
        }, false) // false 表示事件在冒泡階段執行（這是預設值）
    })

    document.querySelectorAll('input[type="file"]').forEach(function(input) {
        input.addEventListener('change', function() {
            const names = Array.from(this.files).map(f => f.name).join(', ');
            
            // 找到同一個 input-group 裡的 text input
            const display = this.closest('.input-group').querySelector('#file-name-display');
            if (display) {
                display.value = names || '尚未選擇檔案';
            }
        });
    });
    document.querySelectorAll('#file-name-display').forEach(function(display) {
        display.addEventListener('click', function() {
            // 找到同一個 input-group 裡隱藏的 file input
            const fileInput = this.closest('.input-group').querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.click();
            }
        });
    });
})()