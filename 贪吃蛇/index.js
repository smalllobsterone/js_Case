function main() {
    let snake = new Init();
    let speed = null; //定时器
    let start = document.querySelector('#start');
    let pause = document.querySelector('#pause');

    initGameWindow(snake);
    render(snake);

    start.addEventListener('click', () => {
        snake = new Init();
        snake.pause = false;
    })
    pause.addEventListener('click', () => {
        if (!snake.pause) {
            snake.pause = true;
            pause.style.backgroundColor = 'red';
        } else {
            snake.pause = false;
            pause.style.backgroundColor = '';
        }
    })
    document.addEventListener('keydown', (e) => {
        snake.keyDown = true;
        snake.key = e.key;
    })
    document.addEventListener('keyup', (e) => {
        snake.keyDown = false;
    })
    setInterval(() => {
        setkey(snake);
        if (snake.speedFlag) {
            clearInterval(speed);
            snake.speedFlag = false;
            speed = setInterval(() => {
                if (!(snake.pause || snake.end)) {
                    move(snake);
                    cross(snake);
                    render(snake);
                }
            }, snake.frame)
        }
    }, 2)
}

// 初始化数据
function Init() {
    // 蛇身
    this.snakeBody = [
        {x: 4, y: 7},
        {x: 3, y: 7},
        {x: 2, y: 7}
    ];
    // 食物
    this.food = {x: 7, y: 7};
    // 键盘按下
    this.keyDown = false;
    // 按下时的按键
    this.key;
    // 上一个方向
    this.preDirection = 'd';
    // 下一个方向
    this.nextDirection = 'd';
    // 食物是否被吃
    this.eat = false;
    // 是否咬到自己
    this.biteSelf = [false, {x: 0, y: 0}];
    // 得分
    this.scored = 0;
    // 帧率
    this.frame = 300;
    // 变速标记
    this.speedFlag = true;
    // 变速节
    this.s = 0;
    // 游戏结束
    this.end = false;
    // 游戏暂停
    this.pause = true;
}

// 初始化游戏窗口
function initGameWindow(obj) {
    let box = document.getElementById('window');
    let gameWindow = document.createElement('table');

    for (let i = 0; i < 13; i++) {
        let tr = document.createElement('tr');
        for (let i = 0; i < 13; i++) {
            let td = document.createElement('td');
            tr.appendChild(td);
        }
        gameWindow.appendChild(tr);
    }
    box.appendChild(gameWindow);
}

// 键盘事件处理
function setkey(obj) {
    if (obj.keyDown) {
        switch (obj.key) {
            case 'w':
                if (obj.preDirection !== 's') {
                    obj.nextDirection = obj.key;
                }
                break;
            case 's':
                if (obj.preDirection !== 'w') {
                    obj.nextDirection = obj.key;
                }
                break;
            case 'a':
                if (obj.preDirection !== 'd') {
                    obj.nextDirection = obj.key;
                }
                break;
            case 'd':
                if (obj.preDirection !== 'a') {
                    obj.nextDirection = obj.key;
                }
                break;
            default:
                break;
        }
    }
}

// 渲染
function render(obj) {
    let flag = true;
    let target = document.querySelector('#window>table');
    let tds = document.querySelectorAll('td');
    let end = document.querySelector('#end');
    // 渲染蛇身
    if (!obj.end) {
        for (e of tds) {
            e.className = '';
        }
        end.style.visibility = 'hidden';
    } else {
        end.style.visibility = 'visible';
    }
    for (e of obj.snakeBody) {
        if (flag) {
            target.children[e.y - 1].children[e.x - 1].className = 'head';
            flag = false;
        } else {
            target.children[e.y - 1].children[e.x - 1].className = 'body';
        }

    }
    document.querySelector('#scored').innerHTML = `分数：${obj.scored}`;
    // 渲染食物
    target.children[obj.food.y - 1].children[obj.food.x - 1].className = 'food';
    // 渲染咬到自己时的头
    if (obj.biteSelf[0]) {
        target.children[obj.biteSelf[1].y - 1].children[obj.biteSelf[1].x - 1].className = '';
        target.children[obj.biteSelf[1].y - 1].children[obj.biteSelf[1].x - 1].className = 'head';
        obj.biteSelf[0] = false;
    }
}

// 蛇前进
function move(obj) {
    let m = null;
    switch (obj.nextDirection) {
        case 'w':
            m = {
                x: obj.snakeBody[0].x,
                y: obj.snakeBody[0].y - 1
            };
            break;
        case 's':
            m = {
                x: obj.snakeBody[0].x,
                y: obj.snakeBody[0].y + 1
            };
            break;
        case 'a':
            m = {
                x: obj.snakeBody[0].x - 1,
                y: obj.snakeBody[0].y
            };
            break;
        case 'd':
            m = {
                x: obj.snakeBody[0].x + 1,
                y: obj.snakeBody[0].y
            };
            break;
        default:
            break;
    }
    // 添加头部
    obj.snakeBody.unshift(m);
    // 判断有没有吃到食物
    let head = obj.snakeBody[0];
    if (head.x === obj.food.x && head.y === obj.food.y) {
        obj.eat = true;
        obj.scored += 10;
        obj.s++;
        if (obj.frame > 100) {
            if (obj.s == 5) {
                obj.frame = obj.frame - 20;
                obj.speedFlag = true;
                obj.s = 0;
                console.log(obj.speedFlag);
            }
        }
    }
    // 吃到了跳过尾部删除
    if (!obj.eat) {
        obj.snakeBody.pop();
    }
    // 吃到了生成食物
    if (obj.eat) {
        let flag = true;
        while (flag) {
            let f = 0;
            obj.food.x = Math.floor(Math.random() * 13) + 1;
            obj.food.y = Math.floor(Math.random() * 13) + 1;
            for (e of obj.snakeBody) {
                if (e.x === obj.food.x && e.y === obj.food.y) {
                    f++;
                }
            }
            if (f === 0) flag = false;
        }
        obj.eat = false;
    }
    // 移动完记录上次移动方向
    obj.preDirection = obj.nextDirection;
}

// 蛇碰壁咬自己
function cross(obj) {
    let f = false;
    let head = obj.snakeBody[0];

    if (obj.snakeBody[0].x === 0 ||
        obj.snakeBody[0].x === 14 ||
        obj.snakeBody[0].y === 0 ||
        obj.snakeBody[0].y === 14) {
        obj.end = true;
    }
    if (obj.snakeBody.length > 4) {
        for (let i = 5; i <= obj.snakeBody.length; i++) {
            if (head.x === obj.snakeBody[i - 1].x && head.y === obj.snakeBody[i - 1].y) {
                f++;
                obj.end = true;
                obj.biteSelf[0] = true;
                obj.biteSelf[1] = obj.snakeBody[0];
            }
        }
    }
}