// 全局变量
let peer = null;
let connection = null;
let myPeerId = '';
let selectedFiles = [];
let transferInProgress = false;

// DOM 元素
const myIdElement = document.getElementById('my-id');
const peerIdInput = document.getElementById('peer-id');
const connectBtn = document.getElementById('connect-btn');
const copyIdBtn = document.getElementById('copy-id');
const connectionStatus = document.getElementById('connection-status');
const fileInput = document.getElementById('file-input');
const dragArea = document.getElementById('drag-area');
const fileList = document.getElementById('file-list');
const sendFilesBtn = document.getElementById('send-files-btn');
const textInput = document.getElementById('text-input');
const sendTextBtn = document.getElementById('send-text-btn');
const receivedFiles = document.getElementById('received-files');
const receivedText = document.getElementById('received-text');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// 初始化PeerJS
function initializePeer() {
    // 创建一个没有ICE服务器配置的Peer，使用默认stun服务器
    peer = new Peer();

    peer.on('open', (id) => {
        myPeerId = id;
        myIdElement.textContent = id;
        generateQRCode(id);
        updateStatus('在线，等待连接');
    });

    peer.on('connection', (conn) => {
        connection = conn;
        setupConnection();
        updateStatus(`已连接到 ${conn.peer}`);
    });

    peer.on('error', (error) => {
        console.error('Peer连接错误:', error);
        updateStatus('连接错误');
    });
}

// 生成二维码
function generateQRCode(peerId) {
    // 清除之前生成的二维码和URL
    const qrcodeElement = document.getElementById('qrcode');
    // 清空内容
    const context = qrcodeElement.getContext('2d');
    context.clearRect(0, 0, qrcodeElement.width, qrcodeElement.height);
    
    const shareUrlElement = document.getElementById('share-url');
    if (shareUrlElement) {
        shareUrlElement.remove();
    }
    
    // 添加调试代码
    console.log('QR Code element:', qrcodeElement);
    console.log('QR Code element type:', qrcodeElement.tagName);
    
    // 获取当前URL的基础部分（不包含查询参数）
    const baseUrl = window.location.origin + window.location.pathname;
    const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
    
    // 创建指向扫描页面的URL，而不是直接连接
    const scanUrl = `${basePath}scan.html?connect=${peerId}`;
    
    try {
        // 设置canvas大小
        qrcodeElement.width = 150;
        qrcodeElement.height = 150;
        
        // 现在使用toCanvas，因为元素已经是canvas
        QRCode.toCanvas(qrcodeElement, scanUrl, {
            width: 150,
            margin: 1,
            color: {
                dark: '#3498db',
                light: '#ffffff'
            }
        }, function (error) {
            if (error) {
                console.error('QR Code 生成错误:', error);
                // 显示错误信息
                const p = document.createElement('p');
                p.style.color = 'red';
                p.textContent = '二维码生成失败，请使用链接方式';
                qrcodeElement.parentNode.insertBefore(p, qrcodeElement.nextSibling);
            }
        });
    } catch (e) {
        console.error('QR Code 生成异常:', e);
        // 退化处理：只显示链接
        const p = document.createElement('p');
        p.style.color = 'red';
        p.textContent = '二维码生成失败，请使用链接方式';
        qrcodeElement.parentNode.insertBefore(p, qrcodeElement.nextSibling);
    }
    
    // 显示连接URL
    const newShareUrlElement = document.createElement('div');
    newShareUrlElement.id = 'share-url';
    newShareUrlElement.className = 'share-url';
    newShareUrlElement.innerHTML = `<small>或分享链接: <a href="${scanUrl}" target="_blank">${scanUrl}</a></small>`;
    document.getElementById('qr-container').appendChild(newShareUrlElement);
}

// 连接到对等方
function connectToPeer() {
    const peerId = peerIdInput.value.trim();
    if (!peerId) {
        alert('请输入对方ID');
        return;
    }
    
    updateStatus('正在连接...');
    connection = peer.connect(peerId, {
        reliable: true
    });
    
    setupConnection();
}

// 设置连接
function setupConnection() {
    if (!connection) return;
    
    connection.on('open', () => {
        updateStatus(`已连接到 ${connection.peer}`);
        enableSendButtons();
    });
    
    connection.on('data', (data) => {
        receiveData(data);
    });
    
    connection.on('close', () => {
        updateStatus('连接已关闭');
        disableSendButtons();
        connection = null;
    });
    
    connection.on('error', (error) => {
        console.error('连接错误:', error);
        updateStatus('连接出错');
    });
}

// 更新连接状态
function updateStatus(text) {
    connectionStatus.textContent = text;
}

// 发送文件
function sendFiles() {
    if (!connection || selectedFiles.length === 0) return;
    
    transferInProgress = true;
    
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            // 准备文件元数据
            const fileData = {
                type: 'file',
                name: file.name,
                size: file.size,
                dataType: file.type || 'application/octet-stream',
                data: event.target.result
            };
            
            // 发送文件数据
            connection.send(fileData);
        };
        
        reader.readAsArrayBuffer(file);
    });
    
    // 清空文件列表
    selectedFiles = [];
    fileList.innerHTML = '';
    updateSendButtonState();
    
    transferInProgress = false;
}

// 发送文本
function sendText() {
    const text = textInput.value.trim();
    if (!connection || !text) return;
    
    // 准备文本数据
    const textData = {
        type: 'text',
        content: text,
        timestamp: new Date().toISOString()
    };
    
    // 发送文本数据
    connection.send(textData);
    
    // 清空输入框
    textInput.value = '';
}

// 接收数据
function receiveData(data) {
    if (data.type === 'file') {
        // 接收文件
        const blob = new Blob([data.data], { type: data.dataType });
        const url = URL.createObjectURL(blob);
        
        const fileElement = document.createElement('div');
        fileElement.className = 'received-item';
        
        // 格式化文件大小
        const fileSize = formatFileSize(data.size);
        
        // 检查是否为图片类型
        const isImage = data.dataType.startsWith('image/');
        
        if (isImage) {
            // 图片文件显示预览
            fileElement.innerHTML = `
                <div class="file-info">
                    <span class="file-icon">🖼️</span>
                    <span class="file-name">${data.name}</span>
                    <span class="file-size">${fileSize}</span>
                </div>
                <div class="image-preview">
                    <img src="${url}" alt="${data.name}" style="max-width: 200px; max-height: 200px; margin: 10px 0;">
                </div>
                <div class="file-actions">
                    <a href="${url}" download="${data.name}" class="btn-small">下载</a>
                    <button class="btn-small copy-image" data-url="${url}">复制图片</button>
                </div>
            `;
        } else {
            // 其他类型文件
            fileElement.innerHTML = `
                <div class="file-info">
                    <span class="file-icon">📄</span>
                    <span class="file-name">${data.name}</span>
                    <span class="file-size">${fileSize}</span>
                </div>
                <a href="${url}" download="${data.name}" class="btn-small">下载</a>
            `;
        }
        
        receivedFiles.appendChild(fileElement);
        
        // 如果是图片，添加复制事件
        if (isImage) {
            const copyButton = fileElement.querySelector('.copy-image');
            if (copyButton) {
                copyButton.addEventListener('click', function() {
                    copyImageToClipboard(this.getAttribute('data-url'), data.name);
                });
            }
        }
    } else if (data.type === 'text') {
        // 接收文本
        const textElement = document.createElement('div');
        textElement.className = 'received-text';
        
        // 格式化时间
        const timestamp = new Date(data.timestamp).toLocaleString();
        
        textElement.innerHTML = `
            <div>${data.content}</div>
            <small>${timestamp}</small>
        `;
        
        receivedText.appendChild(textElement);
    }
}

// 复制图片到剪贴板
async function copyImageToClipboard(url, fileName) {
    try {
        // 检查 Clipboard API 是否可用
        if (!navigator.clipboard) {
            console.error('浏览器不支持 Clipboard API');
            showToast('您的浏览器不支持复制功能，请手动下载图片', true);
            return;
        }

        const response = await fetch(url);
        const blob = await response.blob();
        
        try {
            // 检查 ClipboardItem 是否可用
            if (typeof ClipboardItem === 'undefined') {
                throw new Error('ClipboardItem 不受支持');
            }

            // 尝试使用新的 Clipboard API
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            showToast(`已复制图片 ${fileName}`);
        } catch (err) {
            console.error('复制到剪贴板失败:', err);
            
            // 退化方案1：创建一个临时链接并打开图片
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.target = '_blank';
            tempLink.click();
            
            showToast('无法直接复制图片，已在新窗口打开，请手动复制', true);
        }
    } catch (e) {
        console.error('无法获取图片数据:', e);
        showToast('复制失败，请手动下载图片', true);
    }
}

// 显示提示消息
function showToast(message, isError = false) {
    // 检查是否已有toast元素，如果有则移除
    const existingToast = document.getElementById('toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的toast元素
    const toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.className = isError ? 'toast error' : 'toast';
    toast.textContent = message;
    
    // 添加到body
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 2秒后自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// 处理文件选择
function handleFileSelect(event) {
    const files = event.target.files || event.dataTransfer.files;
    if (!files.length) return;
    
    selectedFiles = Array.from(files);
    updateFileList();
    updateSendButtonState();
}

// 更新文件列表显示
function updateFileList() {
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // 格式化文件大小
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-icon">📄</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize}</span>
            </div>
            <span class="file-remove" data-index="${index}">×</span>
        `;
        
        fileList.appendChild(fileItem);
    });
    
    // 添加删除文件事件
    document.querySelectorAll('.file-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            selectedFiles.splice(index, 1);
            updateFileList();
            updateSendButtonState();
        });
    });
}

// 更新发送按钮状态
function updateSendButtonState() {
    sendFilesBtn.disabled = !connection || selectedFiles.length === 0;
}

// 启用发送按钮
function enableSendButtons() {
    sendTextBtn.disabled = false;
    updateSendButtonState();
}

// 禁用发送按钮
function disableSendButtons() {
    sendFilesBtn.disabled = true;
    sendTextBtn.disabled = true;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
}

// 复制Peer ID到剪贴板
function copyIdToClipboard() {
    navigator.clipboard.writeText(myPeerId)
        .then(() => {
            copyIdBtn.textContent = '已复制';
            setTimeout(() => {
                copyIdBtn.textContent = '复制';
            }, 2000);
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
}

// 检查URL参数是否包含连接ID
function checkUrlForConnection() {
    const urlParams = new URLSearchParams(window.location.search);
    const connectId = urlParams.get('connect');
    
    if (connectId) {
        // 等待Peer初始化完成后再连接
        const checkPeerReady = setInterval(() => {
            if (myPeerId) {
                clearInterval(checkPeerReady);
                // 自动填充输入框并连接
                peerIdInput.value = connectId;
                connectBtn.click();
                
                // 清除URL参数，防止刷新页面时重复连接
                const newUrl = window.location.pathname;
                window.history.pushState({}, document.title, newUrl);
            }
        }, 500);
    }
}

// 初始化标签页切换
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // 激活选中的标签页
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 初始化拖放文件
function initDragDrop() {
    // 阻止默认拖放行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragArea.addEventListener(eventName, preventDefaults, false);
    });
    
    // 高亮拖放区域
    ['dragenter', 'dragover'].forEach(eventName => {
        dragArea.addEventListener(eventName, highlight, false);
    });
    
    // 取消高亮拖放区域
    ['dragleave', 'drop'].forEach(eventName => {
        dragArea.addEventListener(eventName, unhighlight, false);
    });
    
    // 处理拖放文件
    dragArea.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dragArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dragArea.classList.remove('highlight');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        handleFileSelect({
            dataTransfer: dt
        });
    }
}

// 添加事件监听器
function addEventListeners() {
    connectBtn.addEventListener('click', connectToPeer);
    copyIdBtn.addEventListener('click', copyIdToClipboard);
    sendFilesBtn.addEventListener('click', sendFiles);
    sendTextBtn.addEventListener('click', sendText);
    fileInput.addEventListener('change', handleFileSelect);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializePeer();
    initTabs();
    initDragDrop();
    addEventListeners();
    checkUrlForConnection(); // 检查URL是否包含连接ID
    
    // 初始状态
    disableSendButtons();
}); 