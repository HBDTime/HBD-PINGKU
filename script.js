// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE-NoC1TChFBfyP8huhuHH3lctjrot0vE",
  authDomain: "bd-wish-c7848.firebaseapp.com",
  projectId: "bd-wish-c7848",
  storageBucket: "bd-wish-c7848.firebasestorage.app",
  messagingSenderId: "470725558147",
  appId: "1:470725558147:web:911bc5e14f49bfbfffc0b6",
  measurementId: "G-41HZ73G4FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Music Controls ---
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

    musicToggle.addEventListener('change', () => {
        if (musicToggle.checked) {
            // Some browsers require interaction before playing audio
            bgMusic.play().catch(error => {
                console.log('Audio playback failed:', error);
                alert('โปรดคลิกที่ใดก็ได้บนหน้าเว็บก่อนเพื่อเล่นเพลง');
                musicToggle.checked = false;
            });
        } else {
            bgMusic.pause();
        }
    });

    // --- 2. Stars Animation (ดาววิบวับ) ---
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100; // Number of stars

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random properties
        const size = Math.random() * 3 + 1; // 1px to 4px
        const posX = Math.random() * 100; // 0% to 100%
        const posY = Math.random() * 100; // 0% to 100%
        const delay = Math.random() * 2; // 0s to 2s
        const duration = Math.random() * 2 + 1; // 1s to 3s

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}vw`;
        star.style.top = `${posY}vh`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;

        starsContainer.appendChild(star);
    }

    // --- 3. Balloons Animation (ลูกโป่งลอย) ---
    const balloonsContainer = document.getElementById('balloons-container');
    const balloonColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#1dd1a1'];
    
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        
        // Random properties
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const posX = Math.random() * 90; // 0% to 90vw
        const duration = Math.random() * 5 + 8; // 8s to 13s float duration

        balloon.style.backgroundColor = color;
        balloon.style.left = `${posX}vw`;
        balloon.style.animationDuration = `${duration}s`;

        balloonsContainer.appendChild(balloon);

        // Remove balloon after it floats up to prevent DOM bloat
        setTimeout(() => {
            balloon.remove();
        }, duration * 1000);
    }

    // Create a new balloon every 1.5 seconds
    setInterval(createBalloon, 1500);
    // Create some initial balloons
    for(let i=0; i<5; i++) setTimeout(createBalloon, i*300);


    // --- 4. Wishes Logic ---
    const wishForm = document.getElementById('wish-form');
    const wishName = document.getElementById('wish-name');
    const wishMessage = document.getElementById('wish-message');
    const successMsg = document.getElementById('success-msg');
    const wishesListContainer = document.getElementById('wishes-list');
    
    // Default dummy wish or load from local storage if needed. We'll use memory for now.
    const wishes = [];

   wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = wishName.value.trim();
        const message = wishMessage.value.trim();

        if (name && message) {
            await addDoc(collection(db, "wishes"), {
            name: name,
            message: message,
            time: Date.now() });
            
            // Clear form
            wishName.value = '';
            wishMessage.value = '';

            // Show success message
            successMsg.classList.remove('hidden');
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 3000);
        }
    });

    // --- 5. Modal Logic ---
    const modal = document.getElementById('wishes-modal');
    const giftBtn = document.getElementById('gift-btn');
    const closeBtn = document.querySelector('.close-btn');

  async function renderWishes() {

    const querySnapshot = await getDocs(collection(db, "wishes"));

    wishesListContainer.innerHTML = "";

    if (querySnapshot.empty) {
        wishesListContainer.innerHTML =
        '<p class="no-wishes">ยังไม่มีคำอวยพร เป็นคนแรกที่เริ่มเขียนสิ! 😊</p>';
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

    // Close modal if clicked outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

});
