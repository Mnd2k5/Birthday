const mazeLayout = [
    // 0=open, 1=wall, 2=gift, 3=goal
    [0,1,0,0,0,1,0,2],
    [0,1,0,1,0,1,0,1],
    [0,0,0,1,0,0,0,1],
    [1,1,0,1,1,1,0,1],
    [2,0,0,0,2,1,0,0],
    [1,1,1,1,0,1,1,0],
    [0,0,2,0,0,0,1,0],
    [1,0,1,1,1,0,0,3]
];
const photoUrls = [
    'assets/photo1.jpg',
    'assets/photo2.jpg',
    'assets/photo3.jpg',
    'assets/photo4.jpg',
    'assets/photo5.jpg',
    'assets/photo6.jpg',
    'assets/photo7.jpg',
    'assets/photo8.jpg',
    'assets/photo9.jpg',
    'assets/photo10.jpg',
    'assets/photo11.jpg',
    'assets/photo12.jpg',
    'assets/photo13.jpg'
];

const letters = [
    "Bốn bánh lăn xa, hành trình mở lối<br>Vỏ cứng im lìm cất biết bao điều.<br>Hãy nâng nắp lớn – nơi anh khẽ giấu 🌟",

    "Khóa kéo bí mật nép ở thành sâu.<br>Đêm đêm lấp lánh ánh sao nho nhỏ.<br>Mở ngăn lót trong – nơi ai ít ngó, ❤️",

    "Nếu tìm được rồi thì chớ vội đọc nhé.<br>Điều bất ngờ chờ Ngân ở cuối con đường đó."
];

let playerPos = {x:0, y:0};
let giftsCollected = 0;
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.5;

document.getElementById('startBtn').addEventListener('click', () => {
    bgMusic.play();
    document.getElementById('introScreen').style.display = 'none'; // hides whole intro overlay
});
function showPhotoBurst() {
    const IMG_SIZE = 120;           // px – must match the CSS width
    const GAP      = 16;            // extra clearance between photos
    const TTL_MS   = 10000;          // how long the burst lasts

    const taken = [];               // stores already‑used positions

    photoUrls.forEach(src => {
        let top, left, tries = 0;
        do {
            top  = Math.random() * (window.innerHeight - IMG_SIZE - 2 * GAP) + GAP;
            left = Math.random() * (window.innerWidth  - IMG_SIZE - 2 * GAP) + GAP;
            tries++;
        } while (
            tries < 50 &&           // give up after 50 attempts (small screens)
            taken.some(p =>
                Math.abs(p.top  - top)  < IMG_SIZE + GAP &&
                Math.abs(p.left - left) < IMG_SIZE + GAP
            )
        );

        taken.push({ top, left });

        const img = document.createElement('img');
        img.src = src;
        img.className = 'floating-photo';
        img.style.top  = `${top}px`;
        img.style.left = `${left}px`;

        document.body.appendChild(img);
        setTimeout(() => img.remove(), TTL_MS);
    });
}
function createBackgroundIcons() {
    const iconChoices = ["🎂","⭐","💖","🎈","✨"];
    const howMany = 40;                       // number of icons

    const holder = document.getElementById('bgIcons');

    for (let i = 0; i < howMany; i++) {
        const span = document.createElement('span');
        span.className = 'bg-icon';
        span.textContent = iconChoices[Math.floor(Math.random()*iconChoices.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.top  = Math.random() * 120 + 'vh';     // start slightly below screen
        span.style.animationDelay = (-Math.random()*14) + 's'; // stagger motion
        holder.appendChild(span);
    }
}

function createMaze() {
    const maze = document.getElementById('maze');
    maze.innerHTML = '';

    mazeLayout.forEach((row, y) => {
        row.forEach((cell, x) => {
            const div = document.createElement('div');
            div.classList.add('cell');
            if(cell === 1) div.classList.add('wall');
            if(cell === 2) div.classList.add('gift');
            if(cell === 3) div.classList.add('goal');
            if(playerPos.x === x && playerPos.y === y) div.classList.add('player');
            maze.appendChild(div);
        });
    });
}

document.addEventListener('keydown', (e) => {
    const dirs = {ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    if (!dirs[e.key]) return;

    const [dx, dy] = dirs[e.key];
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if(newX < 0 || newX > 7 || newY < 0 || newY > 7 || mazeLayout[newY][newX] === 1) return;

    playerPos = {x:newX, y:newY};

    let message = '';
    if (mazeLayout[newY][newX] === 2) {
        giftsCollected++;
        
        if (giftsCollected === 4) {            // 3rd gift → photo burst
            message = "📸 Memories appear all around you!";
            showPhotoBurst();
        } else {
            message = letters[giftsCollected - 1];  // normal letters (1st,2nd,4th)
        }
    
        mazeLayout[newY][newX] = 0;             // clear the gift from the maze
    }
    
    if(mazeLayout[newY][newX] === 3){
        message = "🎉 Món quà ngày sinh nhật nhé! 🎉";
        document.getElementById('videoContainer').style.display = 'block';
        bgMusic.pause(); 
    }

    document.getElementById('message').innerHTML = message;   // use HTML, not plain text
    createMaze();
});

createMaze();
createBackgroundIcons();

