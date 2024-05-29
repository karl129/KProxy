document.getElementById("toggleProxy").addEventListener("click", () => {
  // 获取输入字段的值
  const ip = document.getElementById("ip").value;
  const port = document.getElementById("port").value;

  // 从Chrome存储中获取当前的代理状态和IP、端口配置
  chrome.storage.sync.get(["proxyEnabled", "ip", "port"], (data) => {
    // 切换代理状态
    const proxyEnabled = !data.proxyEnabled;

    // 设置新的IP、端口和代理状态
    chrome.storage.sync.set({ ip, port, proxyEnabled }, () => {
      console.log(`代理状态已设置为：${proxyEnabled ? "启用" : "禁用"}`);
      console.log(`IP地址已更新为：${ip}`);
      console.log(`端口号已更新为：${port}`);
      // 可以在这里更新popup的UI来反映代理的新状态及配置
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleProxy");

  // 检查当前的proxyEnabled状态并更新按钮
  chrome.storage.sync.get("proxyEnabled", (data) => {
    updateButton(data.proxyEnabled);
  });
});

// 更新按钮的样式和文本
function updateButton(enabled) {
  const toggleButton = document.getElementById("toggleProxy");
  const ip = document.getElementById("ip");
  const port = document.getElementById("port");
  if (enabled) {
    toggleButton.classList.add("active");
    toggleButton.textContent = "Proxy ON";
  } else {
    toggleButton.classList.remove("active");
    toggleButton.textContent = "Proxy OFF";
  }
  chrome.storage.sync.get(["ip", "port"], (data) => {
    ip.value = data.ip;
    port.value = data.port;
  });
}

// 监听存储变化，以便在popup页面打开时更新按钮状态
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.proxyEnabled) {
    updateButton(changes.proxyEnabled.newValue);
  }
});
