import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE-NoC1TChFBfyP8huhuHH3lctjrot0vE",
  authDomain: "bd-wish-c7848.firebaseapp.com",
  projectId: "bd-wish-c7848",
  storageBucket: "bd-wish-c7848.firebasestorage.app",
  messagingSenderId: "470725558147",
  appId: "1:470725558147:web:911bc5e14f49bfbfffc0b6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Music Controls ---
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

    musicToggle.addEventListener('change', () => {
        if (musicToggle.checked) {
            bgMusic.play().catch(error => {
                console.log('Audio playback failed:', error);
                alert('โปรดคลิกที่ใดก็ได้บนหน้าเว็บก่อนเพื่อเล่นเพลง');
                musicToggle.checked = false;
            });
        } else {
            bgMusic.pause();
        }
    });

    // --- 2. Stars Animation ---
    const starsContainer = document.getElementById('stars-container');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        starsContainer.appendChild(star);
    }

    // --- 3. Balloons Animation ---
    const balloonsContainer = document.getElementById('balloons-container');
    const balloonColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#1dd1a1'];

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.left = `${Math.random() * 90}vw`;
        balloon.style.animationDuration = `${Math.random() * 5 + 8}s`;
        balloonsContainer.appendChild(balloon);
        setTimeout(() => balloon.remove(), parseFloat(balloon.style.animationDuration) * 1000);
    }

    setInterval(createBalloon, 1500);
    for (let i = 0; i < 5; i++) setTimeout(createBalloon, i * 300);

    // --- 4. Wishes Logic ---
    const wishForm = document.getElementById('wish-form');
    const wishName = document.getElementById('wish-name');
    const wishMessage = document.getElementById('wish-message');
    const successMsg = document.getElementById('success-msg');

    wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = wishName.value.trim();
        const message = wishMessage.value.trim();
        if (name && message) {
            await addDoc(collection(db, "wishes"), {
                name: name,
                message: message,
                time: Date.now()
            });
            wishName.value = '';
            wishMessage.value = '';
            successMsg.classList.remove('hidden');
            setTimeout(() => successMsg.classList.add('hidden'), 3000);
        }
    });

    // --- 5. Wishes Modal ---
    const modal = document.getElementById('wishes-modal');
    const giftBtn = document.getElementById('gift-btn');
    const closeBtn = document.querySelector('.close-btn');
    const wishesListContainer = document.getElementById('wishes-list');

    async function renderWishes() {
        const querySnapshot = await getDocs(collection(db, "wishes"));
        wishesListContainer.innerHTML = "";
        if (querySnapshot.empty) {
            wishesListContainer.innerHTML = '<p class="no-wishes">ยังไม่มีคำอวยพร เป็นคนแรกที่เริ่มเขียนสิ! 😊</p>';
            return;
        }
        querySnapshot.forEach((doc) => {
            const wish = doc.data();
            const wishCard = document.createElement('div');
            wishCard.classList.add('wish-card');
            const sender = document.createElement('div');
            sender.classList.add('wish-sender');
            sender.textContent = `จาก: ${wish.name}`;
            const text = document.createElement('div');
            text.classList.add('wish-text');
            text.textContent = wish.message;
            wishCard.appendChild(sender);
            wishCard.appendChild(text);
            wishesListContainer.appendChild(wishCard);
        });
    }

    giftBtn.addEventListener('click', () => {
        renderWishes();
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
        if (event.target === specialModal) specialModal.style.display = 'none';
    });

    // --- 6. Gacha Card Flip ---
    const cards = document.querySelectorAll('.card-flip');
    const flipProgress = document.getElementById('flip-progress');
    const specialModal = document.getElementById('special-modal');
    const specialClose = document.getElementById('special-close');
    const fireworksContainer = document.getElementById('fireworks-container');

    let flippedSet = new Set();
    let allFlippedOnce = false;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');

            const idx = card.dataset.index;
            if (card.classList.contains('flipped')) {
                flippedSet.add(idx);
            }

            flipProgress.textContent = `เปิดแล้ว ${flippedSet.size} / 12 ✨`;

            // ✅ แก้ไข: ไม่เด้ง popup อัตโนมัติ แต่แสดงปุ่มแทน
            if (flippedSet.size === 12 && !allFlippedOnce) {
                allFlippedOnce = true;
                setTimeout(() => {
                    launchFireworks();
                    const openSpecialBtn = document.getElementById('open-special-btn');
                    if (openSpecialBtn) openSpecialBtn.style.display = 'inline-block';
                }, 600);
            }
        });
    });

    // ✅ ปุ่มเปิด special modal
    const openSpecialBtn = document.getElementById('open-special-btn');
    openSpecialBtn.addEventListener('click', () => {
        specialModal.style.display = 'block';
    });

    specialClose.addEventListener('click', () => {
        specialModal.style.display = 'none';
    });

    function launchFireworks() {
        const colors = ['#ff6b6b','#ffd700','#4ecdc4','#ff9ff3','#feca57','#a18cd1'];
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.classList.add('firework-particle');
                p.style.left = `${20 + Math.random() * 60}%`;
                p.style.top = `${20 + Math.random() * 40}%`;
                p.style.background = colors[Math.floor(Math.random() * colors.length)];
                const angle = Math.random() * 360;
                const dist = 60 + Math.random() * 80;
                p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
                p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
                fireworksContainer.appendChild(p);
                setTimeout(() => p.remove(), 1000);
            }, i * 30);
        }
    }

});
