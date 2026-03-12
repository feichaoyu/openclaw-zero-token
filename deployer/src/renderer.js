const { ipcRenderer } = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
const platforms = [
  { id: "claude", name: "Claude", url: "https://claude.ai/new" },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com" },
  { id: "doubao", name: "Doubao", url: "https://www.doubao.com/chat/" },
  { id: "qwen", name: "Qwen", url: "https://chat.qwen.ai" },
  { id: "kimi", name: "Kimi", url: "https://www.kimi.com" },
  { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app" },
  { id: "grok", name: "Grok", url: "https://grok.com" },
  { id: "deepseek", name: "DeepSeek", url: "https://chat.deepseek.com/" },
  { id: "glm", name: "GLM", url: "https://chatglm.cn" },
];

let selectedPlatforms = [];

function renderPlatforms() {
  const container = document.getElementById("platforms");
  container.innerHTML = platforms
    .map(
      (p) => `
    <div class="platform-card" data-id="${p.id}">
      <div class="platform-name">${p.name}</div>
      <div class="platform-url">${p.url}</div>
    </div>
  `,
    )
    .join("");

  document.querySelectorAll(".platform-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (selectedPlatforms.includes(id)) {
        selectedPlatforms = selectedPlatforms.filter((p) => p !== id);
        card.classList.remove("selected");
      } else {
        selectedPlatforms.push(id);
        card.classList.add("selected");
      }
      document.getElementById("startBtn").disabled = selectedPlatforms.length === 0;
    });
  });
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function appendOutput(text) {
  const output = document.getElementById("output");
  output.textContent += text;
  setTimeout(() => {
    output.scrollTop = output.scrollHeight;
  }, 0);
}

async function startDeploy() {
  showScreen("deployScreen");
  appendOutput("开始部署流程...\n\n");

  for (const platformId of selectedPlatforms) {
    const platform = platforms.find((p) => p.id === platformId);
    appendOutput(`\n步骤 2: 配置 ${platform.name}...\n`);
    appendOutput(`打开浏览器窗口，请登录 ${platform.name}\n`);

    const result = await ipcRenderer.invoke("open-platform", platform);

    if (result.cookies) {
      appendOutput(`✓ 已获取登录信息\n`);
      appendOutput(`执行 onboard 配置...\n`);

      let envPrefix = '';
      let cookiesToPass = result.cookies;
      const authChoice = `${platformId}-web`;
      const cookieParamName = `--${platformId}-web-cookie`;

      // Consistency: always wrap credentials in JSON for web platforms
      const credentials = {
        cookie: result.cookies,
        bearer: result.bearer,
        userAgent: navigator.userAgent
      };
      const credentialsStr = JSON.stringify(credentials);
      
      let cmd = `node dist/index.mjs onboard --non-interactive --accept-risk --auth-choice ${authChoice} ${cookieParamName}='${credentialsStr}' --gateway-port 3001 --skip-health`;
      
      const onboardResult = await ipcRenderer.invoke("exec-command", cmd);
      if (onboardResult.code !== 0) {
        appendOutput(`\n❌ ${platform.name} 配置失败\n`);
        appendOutput(`错误详情：\n${onboardResult.output}\n`);
      } else {
        appendOutput(`✓ ${platform.name} 配置完成\n`);
      }
    }
  }

  appendOutput("\n🎉 配置完成！\n");
  appendOutput("\n步骤 3: 启动服务...\n");
  appendOutput("正在启动网关服务，请稍候...\n");

  // 在后台启动 gateway 服务
  await ipcRenderer.invoke("exec-command-background", "node dist/index.mjs gateway --port 3001");

  // 等待服务启动
  setTimeout(async () => {
    appendOutput("\n✓ 服务已启动\n");
    appendOutput("正在加载界面...\n");

    let targetUrl = "http://127.0.0.1:3001";
    try {
      const configPath = path.join(os.homedir(), ".openclaw-zero", "openclaw.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        const token = config?.gateway?.auth?.token;
        if (token) {
          targetUrl += `/?token=${token}`;
        }

        // 强制开启无头模式，避免未命中的 Web 模型偷偷弹窗
        if (!config.browser) {
          config.browser = {};
        }
        config.browser.headless = true;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      }
    } catch (e) {
      appendOutput(`尝试读取和配置环境失败: ${e.message}\n`);
    }

    showScreen("serviceScreen");
    document.getElementById("serviceView").src = targetUrl;
  }, 3000);
}

document.getElementById("startBtn").addEventListener("click", startDeploy);
document.getElementById("backBtn").addEventListener("click", () => showScreen("platformScreen"));

ipcRenderer.on("command-output", (event, data) => appendOutput(data));

let installProgress = 0;
ipcRenderer.on("init-status", (event, msg) => {
  document.getElementById("loadingText").textContent = msg;
  installProgress += 33;
  document.getElementById("progressFill").style.width = `${Math.min(installProgress, 100)}%`;
});

ipcRenderer.on("project-ready", async (event, path) => {
  document.getElementById("loadingText").textContent = "安装依赖中...";
  document.getElementById("progressFill").style.width = "40%";

  const installResult = await ipcRenderer.invoke("exec-command-silent", "pnpm install");

  if (installResult.code === 0) {
    document.getElementById("loadingText").textContent = "构建项目中...";
    document.getElementById("progressFill").style.width = "70%";

    const buildResult = await ipcRenderer.invoke("exec-command-silent", "pnpm run build");

    if (buildResult.code === 0) {
      document.getElementById("loadingText").textContent = "构建 UI 中...";
      document.getElementById("progressFill").style.width = "90%";

      await ipcRenderer.invoke("exec-command-silent", "pnpm run ui:build");
    }
  }

  document.getElementById("progressFill").style.width = "100%";
  document.getElementById("loadingText").textContent = "完成！";

  setTimeout(() => {
    showScreen("platformScreen");
    document.getElementById("settingsBtn").classList.add("visible");
  }, 500);
});

document.getElementById("settingsBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("settingsMenu").classList.toggle("show");
});

document.addEventListener("click", () => {
  document.getElementById("settingsMenu").classList.remove("show");
});

document.getElementById("backToPlatforms").addEventListener("click", () => {
  location.reload();
});

document.getElementById("clearConfig").addEventListener("click", async () => {
  if (confirm("确定要清空所有平台配置信息吗？此操作不可恢复。")) {
    const result = await ipcRenderer.invoke("clear-config");
    if (result.success) {
      alert("配置已清空");
      location.reload();
    } else {
      alert("清空失败: " + result.error);
    }
  }
});

renderPlatforms();
