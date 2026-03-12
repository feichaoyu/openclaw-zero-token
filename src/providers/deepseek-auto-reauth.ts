import { loginDeepseekWebAttachOnly } from "./deepseek-web-auth.js";
import { setDeepseekWebCookie } from "../commands/onboard-auth.credentials.js";
import { resolveOpenClawAgentDir } from "../agents/agent-paths.js";

/**
 * 自动重新认证 DeepSeek
 * 当检测到 Bearer Token 过期时自动调用
 */
export async function autoReauthDeepSeek(): Promise<{
  cookie: string;
  bearer: string;
  userAgent: string;
} | null> {
  console.log("[DeepSeek AutoReauth] 检测到认证失败，尝试自动重新认证...");

  try {
    const result = await loginDeepseekWebAttachOnly({
      onProgress: (msg) => console.log(`[DeepSeek AutoReauth] ${msg}`),
    });

    // 保存新的凭据
    await setDeepseekWebCookie(
      {
        cookie: result.cookie,
        bearer: result.bearer,
        userAgent: result.userAgent,
      },
      resolveOpenClawAgentDir(),
    );

    console.log("[DeepSeek AutoReauth] 自动重新认证成功！");
    return result;
  } catch (error) {
    console.error("[DeepSeek AutoReauth] 自动重新认证失败:", error);
    return null;
  }
}
