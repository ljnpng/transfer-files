const express = require('express');
const path = require('path');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

// 获取本地IP地址
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // 跳过内部和非IPv4地址
            if (iface.family !== 'IPv4' || iface.internal) {
                continue;
            }
            // 返回第一个找到的有效外部IPv4地址
            return iface.address;
        }
    }
    return 'localhost'; // 如果没有找到，返回localhost
}

// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 扫描页面路由
app.get('/scan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'scan.html'));
});

// 启动服务器 - 使用'0.0.0.0'在所有网络接口上监听
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`服务器已启动，访问 http://localhost:${PORT}`);
    console.log(`在本地网络中，其他设备可以通过 http://${localIP}:${PORT} 访问此应用`);
}); 