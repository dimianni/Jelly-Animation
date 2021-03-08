let canvas = document.getElementById('drawOnMe');
let ctx = canvas.getContext('2d');

// Setting proper width & height
resize();
function resize() {
    ctx.canvas.width = $('.container').width();
    ctx.canvas.height = $('.container').height();
}


// A JavaScript class is not an object.
// It is a template for JavaScript objects.

class Mouse {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;

        let rect = canvas.getBoundingClientRect();

        canvas.onmousemove = e => {
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        }
    }
}

class Ball {
    constructor(x, y, radius, color) {
        this.x = x || 0;
        this.y = y || 0;

        // Изначальные координаты

        this.origX = x || 0;
        this.origY = y || 0;

        // Скорость (вектор)
        this.vx = 0;
        this.vy = 0;

        // Сила трения чтобы шарик останавливался
        this.friction = 0.9;

        this.springFactor = 0.05;

        this.radius = radius || 2;
        this.color = color || "ff6600";
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    think(mouse){
        // Расстояние между центром мишки и центром шарика
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;

        // Теорема Пифагора -- C равно корень из A кадрат плюс B кадрат
        let dist = Math.sqrt(dx*dx + dy*dy);

        // Interaction
        // Compared to radius
        if (dist < 30){
            let angle = Math.atan2(dy, dx);

            let tx = mouse.x + Math.cos(angle) * 30;
            let ty = mouse.y + Math.sin(angle) * 30;

            this.vx += tx - this.x;
            this.vy += ty - this.y;
        }

        // friction
        // При каждом фрейме скорость будет падать
        this.vx *= this.friction;
        this.vy *= this.friction;


        // Spring back
        let dx1 = -(this.x - this.origX);
        let dy1 = -(this.y - this.origY);

        this.vx += dx1 * this.springFactor;
        this.vy += dy1 * this.springFactor;

        // Actual movement
        // При каждом фрейме добавляеться что то к координатам обьекта (скорость)
        this.x += this.vx;
        this.y += this.vy;
    }



    draw(ctx) {
        ctx.save();
        ctx.beginPath();

        // Используеться чтобы рисовать круги
        // Первые 2 параметра это координаты
        // Третий это радиус
        // Четвертый -- начальная точка круга
        // Пятый -- Конечная точка круга
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

        // Есть stroke а есть stroke() -- border
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.closePath();

        // Save & Restore это как скобки для js (переменные доступны только здесь)
        ctx.restore();
    }
}


let mouse = new Ball(0, 0, 30, 'green');
let pos = new Mouse(canvas);


let balls = [];
for (let i = 0; i < 20; i++) {
    balls.push(
        new Ball(
            // Рандомная генерация значений
            // Math.random() * 600,
            // Math.random() * 600
            ctx.canvas.width*0.5 + 100 * Math.cos(i * 2 * Math.PI / 20),
            ctx.canvas.width*0.5 + 100 * Math.sin(i * 2 * Math.PI / 20),
        )
    )
}

// function connectDots(balls){
//     ctx.beginPath();
//     ctx.moveTo(balls[0].x, balls[0].y);

//     balls.forEach(ball => {
//         ctx.lineTo(ball.x, ball.y);
//     })

//     ctx.closePath();
//     ctx.fill();
// }


function connectDots1(dots) {
    ctx.beginPath();

    for (var i = 0, jlen = dots.length; i <= jlen; ++i) {
        var p0 = dots[i + 0 >= jlen ? i + 0 - jlen : i + 0];
        var p1 = dots[i + 1 >= jlen ? i + 1 - jlen : i + 1];
        ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }

    ctx.closePath();
    ctx.fill();
}

//Вызываеться бесконечно
function Render() {
    window.requestAnimationFrame(Render);

    // Прямоугольник очищающий канвас на каждом кадре
    ctx.clearRect(0, 0, 600, 600);

    mouse.setPos(pos.x, pos.y);
    mouse.draw(ctx);


    balls.forEach(ball => {
        ball.think(pos)
        // ball.draw(ctx);
    });

    connectDots1(balls)
}

Render();

