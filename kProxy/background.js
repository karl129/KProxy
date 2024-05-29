// 安装的时候初始化存储
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.storage.sync.set({
      proxyEnabled: false,
      ip: "127.0.0.1",
      port: 7890,
    });
    console.log("初始化成功，代理设置为禁用状态。默认: 127.0.0.1:7890");
  }
});

// 当proxyEnabled变化时，根据其新值更新代理配置
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.proxyEnabled) {
    const proxyEnabled = changes.proxyEnabled.newValue;
    updateProxyConfig(proxyEnabled);
  }
});

function updateProxyConfig(enabled) {
  if (enabled) {
    console.log("启用代理配置...");

    // 从chrome.storage.sync获取IP和端口
    chrome.storage.sync.get(["ip", "port"], (result) => {
      const ip = result.ip || "127.0.0.1"; // 如果没有找到IP，则使用默认值
      const port = parseInt(result.port, 10) || 7890; // 如果没有找到端口，则使用默认值
      console.log(`代理ip和端口: ${ip}:${port}`);

      // 异步加载bypassList
      fetch("bypassList.json")
        .then((response) => response.json())
        .then((bypassList) => {
          console.log(`白名单长度: ${bypassList.length}`);
          // 使用从存储中获取的IP和端口构造代理配置
          const config = {
            mode: "fixed_servers",
            rules: {
              singleProxy: {
                scheme: "socks5",
                host: ip,
                port: port, // 使用从存储中获取的端口
              },
              bypassList: bypassList,
            },
          };
          // 设置代理配置
          chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
            if (!chrome.runtime.lastError) {
              console.log("代理配置启用成功。");
            } else {
              console.error("设置代理时发生错误:", chrome.runtime.lastError);
            }
          });
        })
        .catch((error) => {
          console.error("加载bypassList时发生错误:", error);
        });
    });
  } else {
    console.log("禁用代理配置...");
    chrome.proxy.settings.clear({ scope: "regular" }, () => {
      if (!chrome.runtime.lastError) {
        console.log("代理配置已被禁用。");
      } else {
        console.error(
          "清除代理设置时发生错误:",
          chrome.runtime.lastError.message
        );
      }
    });
  }
}
