//农历获取实现 By @stxttkx
// 由 lingbopro 改良

let lunarCache = null;
let lunarCachePromise = null;
async function getLunar() {
    let lunarDisplay = document.getElementById('lunar');

    // 缓存验证
    if (lunarCache?.data?.AD) {
        const now = new Date();
        const nowAD = new RegExp(`${now.getFullYear()}年0?${now.getMonth() + 1}月0?${now.getDate()}日`, 'g');
        if (!lunarCache.data.AD.match(nowAD)) {
            lunarCache = null;
        }
    }

    // 如果没有缓存且当前没有进行中的请求，则发起新的请求
    if (!lunarCache && !lunarCachePromise) {
        lunarCachePromise = (async () => {
            try {
                const response = await fetch('https://api.xcboke.cn/api/calendar');
                if (!response.ok) {
                    throw new Error('HTTP 状态码不符合预期: ' + response.status);
                }
                const jsonContent = await response.json();
                if (typeof jsonContent?.['农历'] !== 'string') {
                    throw new Error('服务器返回数据格式异常');
                }
                lunarCache = jsonContent;
                return lunarCache;
            } catch (error) {
                lunarDisplay.textContent = '';
                console.error('获取农历信息失败: ', error);
                throw error;
            } finally {
                // 请求结束后，无论成功与否，都清除进行中的 Promise 标记
                lunarCachePromise = null;
            }
        })();
    }
    // 如果有进行中的请求但还没有缓存，等待请求完成
    if (!lunarCache && lunarCachePromise) {
        await lunarCachePromise;
    }

    if (lunarCache?.['农历']) {
        const lunarContent = lunarCache['农历'];
        lunarDisplay.textContent = lunarContent;
    }
}
