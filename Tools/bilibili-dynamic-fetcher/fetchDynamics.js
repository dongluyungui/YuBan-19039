const axios = require('axios');

// 定义一个函数用于创建延迟
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchBilibiliDynamics(uid) {
    // 使用新的 API 链接
    const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${uid}`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': `https://space.bilibili.com/${uid}`
    };

    try {
        // 等待 2 秒（可根据实际情况调整）
        await sleep(2000);

        const response = await axios.get(url, {
            headers: headers
        });

        if (response.data.code !== 0) {
            console.error('请求失败，错误码：', response.data.code, response.data.message);
            return null;
        }

        // 根据新 API 的数据结构获取动态数据
        const dynamics = response.data.data.items;
        return processDynamics(dynamics); // 处理动态数据
    } catch (error) {
        console.error('请求异常：', error.message);
        return null;
    }
}

// 处理动态数据（提取关键信息）
function processDynamics(cards) {
    // 检查 cards 是否为 null 或 undefined
    if (!cards) {
        return [];
    }
    return cards.map(card => {
        const dynamic = card.modules.module_dynamic;
        return {
            dynamicId: card.id_str, // 动态 ID
            timestamp: card.timestamp, // 发布时间（时间戳）
            publishTime: new Date(card.timestamp * 1000).toLocaleString(), // 格式化时间
            content: dynamic.major.draw ? dynamic.major.draw.text : dynamic.major.text, // 动态文本内容
            images: dynamic.major.draw ? dynamic.major.draw.items.map(item => item.src) : [], // 图片链接数组
            videoUrl: dynamic.major.archive ? `https://www.bilibili.com/video/${dynamic.major.archive.bvid}` : null, // 视频动态链接
            forwardContent: dynamic.extend?.origin?.modules?.module_dynamic?.major?.text || null // 转发内容（如有）
        };
    });
}

// 调用函数获取动态
fetchBilibiliDynamics(12136555).then(dynamics => {
    if (dynamics) {
        console.log('动态列表：', dynamics);
    }
});
    