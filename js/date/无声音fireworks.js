!(function () {
    // 创建画布
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    // 设置画布样式
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.zIndex = 9999; // 设置画布样式，将 z-index 设置为一个较大的值，比如 9999（最小-1）
    // 让鼠标事件穿透画布
    canvas.style.pointerEvents = "none";

    // 获取画布上下文
    var context = canvas.getContext("2d");

    // 调整画布大小的函数
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // 初始化画布大小
    resizeCanvas();

    // 监听窗口大小变化事件，动态调整画布大小
    window.addEventListener("resize", resizeCanvas);

    // 粒子数组，用于存储所有烟花粒子
    var particles = [];
    // 烟花数组，用于存储上升中的烟花
    var fireworks = [];

    // 烟花类
    class Firework {
        constructor() {
            // 烟花的初始 x 坐标，随机在窗口宽度内
            this.x = Math.random() * canvas.width;
            // 烟花的初始 y 坐标，在窗口底部下方一点距离
            const offset = 300; // 可根据需要调整这个偏移量
            this.y = canvas.height + offset;
            // 允许的最大锐角偏移（这里设置为 15 度）
            const maxAngleOffset = 15;
            // 随机生成一个在 -maxAngleOffset 到 maxAngleOffset 之间的角度偏移
            const angleOffset = (Math.random() * 2 - 1) * maxAngleOffset;
            // 垂直向上的角度为 90 度，加上随机偏移
            this.angle = 90 + angleOffset;
            // 将角度转换为弧度
            this.radians = this.angle * Math.PI / 180;

            // 爆炸高度设置为一个范围，这里是窗口高度的 1/10 到 9/10 之间
            const minExplodeHeight = canvas.height * 1 / 10;
            const maxExplodeHeight = canvas.height * 9 / 10;
            this.explodeHeight = Math.random() * (maxExplodeHeight - minExplodeHeight) + minExplodeHeight;

            // 计算烟花生成位置与爆炸位置的垂直距离
            const distance = this.y - this.explodeHeight;

            // 根据距离范围设置速度
            if (distance < canvas.height * 0.2) {
                // 距离较近，速度范围 2 - 5
                this.speed = Math.random() * 3 + 2;
            } else if (distance < canvas.height * 0.6) {
                // 距离中等，速度范围 5 - 8
                this.speed = Math.random() * 3 + 5;
            } else {
                // 距离较远，速度范围 8 - 11
                this.speed = Math.random() * 3 + 8;
            }

            // 修改烟花大小的随机范围为 3 - 7
            this.size = Math.random() * 4 + 3;

            // 烟花是否已经爆炸
            this.exploded = false;
            // 随机生成烟花的色调
            this.hue = Math.random() * 360;
            // 色调的变化范围
            this.hueVariance = 30;
        }

        update() {
            // 计算烟花的新位置
            this.x += Math.cos(this.radians) * this.speed;
            this.y -= Math.sin(this.radians) * this.speed;

            // 当烟花上升到爆炸高度时爆炸
            if (!this.exploded && this.y <= this.explodeHeight) {
                this.explode();
            }
        }

        explode() {
            this.exploded = true;
            // 粒子数量
            var count = 100;
            for (var i = 0; i < count; i++) {
                var p = {};

                // 每个粒子的角度
                var angle = 360 / count * i;
                // 将角度转换为弧度
                var radians = angle * Math.PI / 180;

                // 粒子的初始 x 坐标
                p.x = this.x;
                // 粒子的初始 y 坐标
                p.y = this.y;
                // 粒子运动的弧度
                p.radians = radians;

                // 粒子的大小，随机范围 1 - 3
                p.size = Math.random() * 2 + 1;

                // 粒子的速度，随机范围 0.4 - 5.4
                p.speed = Math.random() * 5 + 0.4;

                // 粒子运动的半径，随机范围 50 - 130
                p.radius = Math.random() * 81 + 50;

                // 粒子的目标 x 坐标
                p.fx = this.x + Math.cos(radians) * p.radius;
                // 粒子的目标 y 坐标
                p.fy = this.y + Math.sin(radians) * p.radius;

                // 设置粒子的颜色
                this.setupColors(p);

                // 将粒子添加到粒子数组中
                particles.push(p);
            }
        }

        setupColors(p) {
            // 随机生成粒子的色调，在 hue 上下 hueVariance 范围内
            p.hue = Math.floor(Math.random() * ((this.hue + this.hueVariance) - (this.hue - this.hueVariance))) + (this.hue - this.hueVariance);
            // 随机生成粒子的亮度，范围 50 - 70
            p.brightness = Math.floor(Math.random() * 21) + 50;
            // 随机生成粒子的透明度，范围 0.4 - 1
            p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
        }

        draw() {
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = 'hsla(' + this.hue + ',100%,' + 50 + '%,' + 1 + ')';
            context.fill();
        }
    }

    // 绘制烟花粒子的函数
    function drawFireworks() {
        // 遍历所有粒子
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            // 粒子向目标位置移动，移动速度为与目标位置距离的 1/10
            p.x += (p.fx - p.x) / 10;
            p.y += (p.fy - p.y) / 10 - (p.alpha - 1) * p.speed;

            // 粒子透明度逐渐降低
            p.alpha -= 0.006;

            // 如果粒子透明度小于等于 0，从粒子数组中移除该粒子
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            // 开始绘制粒子
            context.beginPath();
            // 绘制圆形粒子
            context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            context.closePath();

            // 设置粒子的填充颜色，使用 HSLA 颜色模式
            context.fillStyle = 'hsla(' + p.hue + ',100%,' + p.brightness + '%,' + p.alpha + ')';
            // 填充粒子
            context.fill();
        }

        // 遍历所有上升中的烟花
        for (var i = 0; i < fireworks.length; i++) {
            var firework = fireworks[i];
            firework.update();
            if (!firework.exploded) {
                firework.draw();
            } else {
                fireworks.splice(i, 1);
                i--;
            }
        }
    }

    // 动画循环函数
    function tick() {
        // 清空画布
        context.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制烟花粒子
        drawFireworks();
        // 请求下一帧动画
        requestAnimationFrame(tick);
    }

    // 开始动画循环
    tick();

    // 监听“烟花效果展示”按钮的点击事件
    var fireworkTrigger = document.getElementById('firework-trigger');
    if (fireworkTrigger) {
        fireworkTrigger.addEventListener('click', function (e) {
            // 随机生成烟花数量，范围 20 - 50
            var numFireworks = Math.floor(Math.random() * 41) + 20;
            for (var i = 0; i < numFireworks; i++) {
                fireworks.push(new Firework());
            }
        });
    }
})();