document.addEventListener('DOMContentLoaded', function () {
    const HOVER_DELAY = 1800; // 显示延迟（毫秒）
    let showTimeout; // 显示定时器

    // 1. 处理.summary-title的悬停和点击事件
    document.querySelectorAll('.summary-title').forEach(preview => {
        const details = preview.nextElementSibling;

        // 鼠标悬停事件，延迟显示详情
        preview.addEventListener('mouseenter', () => {
            clearTimeout(showTimeout); // 清除之前的显示定时器
            // 检查当前悬停元素对应的子页面是否已经打开
            if (details.style.display!== 'block') {
                // 若未打开，则关闭所有已打开的子页面
                document.querySelectorAll('.summary-details').forEach(detail => {
                    detail.style.display = 'none';
                });
                showTimeout = setTimeout(() => {
                    details.style.display = 'block';
                }, HOVER_DELAY);
            }
        });

        // 鼠标移出事件，清除显示定时器
        preview.addEventListener('mouseleave', () => {
            clearTimeout(showTimeout);
        });

        // 点击事件，处理子页面的显示和隐藏逻辑
        preview.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止点击链接默认行为
            if (details.style.display === 'block') {
                // 若当前子页面已打开，则关闭它
                details.style.display = 'none';
            } else {
                // 若当前子页面未打开，先关闭其他子页面，再打开当前子页面
                document.querySelectorAll('.summary-details').forEach(detail => {
                    detail.style.display = 'none';
                });
                details.style.display = 'block';
            }
        });
    });

    // 2. 处理.bullet的点击事件，实现视频跳转和子页面切换
    document.querySelectorAll('.bullet').forEach(bullet => {
        bullet.addEventListener('click', function () {
            const liveRecord = bullet.closest('.live-record');
            const videoLinkElement = liveRecord.querySelector('a.source-link');
            if (videoLinkElement) {
                const videoLink = videoLinkElement.href;
                const timestamp = this.querySelector('.timestamp-inner').textContent;
                const parts = timestamp.split(':');
                let timeParam;
                if (parts.length === 2) {
                    const [minutes, seconds] = parts;
                    timeParam = `?t=${minutes}m${seconds}s`;
                } else if (parts.length === 3) {
                    const [hours, minutes, seconds] = parts;
                    timeParam = `?t=${hours}h${minutes}m${seconds}s`;
                }
                const newLink = videoLink + timeParam;
                window.open(newLink, '_blank'); // 打开带有时间戳的视频链接
            }

            const details = liveRecord.querySelector('.summary-details');
            if (details.style.display!== 'block') {
                // 若当前子页面未打开，则打开它，不关闭其他子页面
                details.style.display = 'block';
            }
        });
    });

    // 3. 全局点击事件，点击页面其他区域隐藏所有子页面
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (!target.closest('.summary-title, .summary-details')) {
            document.querySelectorAll('.summary-details').forEach(detail => {
                detail.style.display = 'none'; // 隐藏所有子页面
            });
        }
    });
});