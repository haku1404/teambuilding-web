// main.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCLqabwUCha5Qap6nsdSuqx2Mg9jkcpcdI",
  authDomain: "a3-badminton.firebaseapp.com",
  projectId: "a3-badminton",
  storageBucket: "a3-badminton.firebasestorage.app",
  messagingSenderId: "495072972318",
  appId: "1:495072972318:web:7adb86255ad39cfaa4680f",
  databaseURL: "https://a3-badminton-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'messages');
const galleryRef = ref(db, 'gallery');

const IMGBB_API_KEY = "ebc1b1415afac7601fc8a887c8f4e632";

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 1.5. Scrollspy for Navbar
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  let lastActive = "";
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 300)) {
        current = section.getAttribute("id");
      }
    });

    if (current !== lastActive) {
      lastActive = current;
      navLinks.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${current}`) {
          a.classList.add("active");
          if (window.innerWidth <= 768) {
            a.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      });
    }
  });

  // 1.6. Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg && closeBtn) {
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Kiểm tra xem phần tử bị click có phải là ảnh cần zoom không
      const isZoomableImg = target.matches('.space-card img, .photo-img') || target.classList.contains('menu-img');
      
      if (isZoomableImg) {
        let src = target.src;
        if (!src && target.style.backgroundImage) {
           src = target.style.backgroundImage.slice(4, -1).replace(/"/g, "").replace(/'/g, "");
        }
        if (src) {
          lightbox.style.display = 'flex';
          lightboxImg.src = src;
        }
      }
    });

    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) {
        lightbox.style.display = 'none';
      }
    });
  }

  // 1.7. Interactive Map Logic
  const mapPins = document.querySelectorAll('.map-pin');
  const mapTooltip = document.getElementById('mapTooltip');
  const tooltipTitle = document.getElementById('tooltipTitle');
  const tooltipDesc = document.getElementById('tooltipDesc');

  if (mapPins.length > 0 && mapTooltip) {
    mapPins.forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        
        tooltipTitle.textContent = pin.getAttribute('data-title');
        tooltipDesc.textContent = pin.getAttribute('data-desc');
        
        mapTooltip.classList.add('show');
        mapPins.forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('map-pin') && !e.target.closest('.map-tooltip')) {
        mapTooltip.classList.remove('show');
        mapPins.forEach(p => p.classList.remove('active'));
      }
    });
  }

  // 2. Intersection Observer for Fade-up animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);


  // 3. Mock Data & DOM Injection for Journey (Hành trình 2 cột)
  const journeyData = [
    {
      dateString: 'NGÀY 1 - 11/07/2026',
      dayName: 'Thứ Bảy',
      theme: 'Let\'s Gooo',
      events: [
        { time: '11:00', title: 'Tập trung & Khởi hành', desc: 'Địa điểm tập trung sẽ cập nhật sau.' },
        { time: '14:00', title: 'Check-in', desc: 'Nhận phòng, cất hành lý và nghỉ ngơi nhẹ.' },
        { time: '15:00', title: 'Giải Đấu Pickleball <span onclick="openModal(\'rules-modal\')" style="font-size: 0.75rem; background: var(--primary-color); color: #fff; padding: 2px 8px; border-radius: 12px; cursor: pointer; margin-left: 8px; vertical-align: middle; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">📖 Xem Luật</span>', desc: 'Chia cặp và vung vợt tranh tài nảy lửa.' },
        { time: '17:30', title: 'Bơi', desc: 'Giải nhiệt tại bể bơi vô cực.' },
        { time: '19:00', title: 'Ăn Tối BBQ & Lẩu', desc: 'Nạp năng lượng với tiệc nướng và lẩu xì xụp.' },
        { time: '21:00', title: 'Game Đêm', desc: 'Xuyên đêm với Ma sói, Poker và các game tập thể.' }
      ]
    },
    {
      dateString: 'NGÀY 2 - 12/07/2026',
      dayName: 'Chủ Nhật',
      theme: 'Tự Do Thư Giãn',
      events: [
        { time: '08:00', title: 'Dậy Xem World Cup', desc: 'Hô vang cổ vũ cùng anh em đam mê bóng đá.' },
        { time: '09:00', title: 'Lịch Trình Tự Do', desc: 'Tự do đi dạo, chụp ảnh sống ảo, tận hưởng không khí.' },
        { time: '11:30', title: 'Check out', desc: 'Dọn phòng và làm thủ tục trả phòng.' },
        { time: '12:30', title: 'Ăn Trưa & Trở Về', desc: 'Ăn trưa nhẹ nhàng, lên xe quay về thành phố.' }
      ]
    }
  ];

  const checkIsLive = (dateString, timeStr, nextTimeStr) => {
    const now = new Date();
    const datePart = dateString.split(' - ')[1];
    if (!datePart) return false;
    const [day, month, year] = datePart.split('/');
    
    const [startH, startM] = timeStr.split(':').map(Number);
    const startDate = new Date(year, month - 1, day, startH, startM);
    
    let endDate;
    if (nextTimeStr) {
      const [endH, endM] = nextTimeStr.split(':').map(Number);
      endDate = new Date(year, month - 1, day, endH, endM);
    } else {
      endDate = new Date(year, month - 1, day, startH + 4, startM); // Assume last event is 4 hours
    }
    
    // DEMO MODE: Bật cờ này thành true để xem thử giao diện "Đang diễn ra" (Fix cứng vào sự kiện 15h Ngày 1)
    const DEMO_MODE = false;
    if (DEMO_MODE && dateString.includes('NGÀY 1') && timeStr === '15:00') return true;

    return now >= startDate && now < endDate;
  };

  const journeyGrid = document.getElementById('journey-grid');
  if (journeyGrid) {
    journeyData.forEach((day, idx) => {
      const delay = `delay-${idx + 1}`;
      const eventsHtml = day.events.map((ev, evIdx) => {
        const nextEv = day.events[evIdx + 1];
        const isLive = checkIsLive(day.dateString, ev.time, nextEv ? nextEv.time : null);
        
        return `
        <div class="event-item ${isLive ? 'is-live' : ''}">
          <div class="event-time-wrap">
            <span class="event-time">${ev.time}</span>
            ${isLive ? '<span class="live-badge">🔥 Đang diễn ra</span>' : ''}
          </div>
          <h4 class="event-title">${ev.title}</h4>
          ${ev.desc ? `<p class="event-desc">${ev.desc}</p>` : ''}
        </div>
      `}).join('');

      const cardHtml = `
        <div class="day-card fade-up ${delay}">
          <div class="day-header">
            <span class="date-small">${day.dateString}</span>
            <h3 class="day-name">${day.dayName}</h3>
            <p class="day-theme">${day.theme}</p>
          </div>
          <div class="day-body">
            <div class="day-timeline">
              ${eventsHtml}
            </div>
          </div>
        </div>
      `;
      journeyGrid.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  // 4. Mock Data & DOM Injection for Members / Rooms
  const totalMembers = 16;
  const totalRooms = 8;

  // Animate numbers
  const animateNumber = (id, endVal, duration) => {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * endVal);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateNumber('total-members', totalMembers, 2000);
      animateNumber('total-rooms', totalRooms, 2000);
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  
  const statsSection = document.querySelector('.members-stats');
  if(statsSection) statsObserver.observe(statsSection);

  // 3. Render Room List Mock Data
  const mockNames = [
    'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D',
    'Hoàng Văn E', 'Vũ Thị F', 'Đặng Văn G', 'Bùi Thị H',
    'Ngô Thị I', 'Đỗ Văn K', 'Lý Thị L', 'Đoàn Văn M',
    'Bùi Văn N', 'Võ Thị O', 'Phan Văn P', 'Lương Thị Q'
  ];
  let currentNameIndex = 0;
  
  const actualRooms = [
    { name: 'P. Đôi 1 (Villa)', capacity: 2, pin: 'pin-villa' },
    { name: 'P. Đôi 2 (Villa)', capacity: 2, pin: 'pin-villa' },
    { name: 'P. Đôi 3 (Villa)', capacity: 2, pin: 'pin-villa' },
    { name: 'Tập Thể (Villa)', capacity: 4, pin: 'pin-villa' },
    { name: 'Bungalow 1', capacity: 2, pin: 'pin-bungalow' },
    { name: 'Bungalow 2', capacity: 2, pin: 'pin-bungalow' },
    { name: 'Bungalow 3', capacity: 2, pin: 'pin-bungalow' },
    { name: 'Tập Thể (Hồ Bơi)', capacity: 4, pin: 'pin-pool' }
  ];

  const membersGrid = document.getElementById('members-grid');

  if (membersGrid) {
    membersGrid.innerHTML = `
      <div class="table-container glass-card" style="padding: 0; overflow: hidden;">
        <div style="overflow-x: auto;">
          <table class="member-table" style="width: 100%;">
            <thead>
              <tr>
                <th style="width: 30%;">PHÒNG</th>
                <th style="width: 20%;">SỐ LƯỢNG</th>
                <th>THÀNH VIÊN</th>
              </tr>
            </thead>
            <tbody>
              ${actualRooms.map(room => {
                const roomMembers = [];
                for (let j = 0; j < room.capacity; j++) {
                  roomMembers.push(mockNames[currentNameIndex % mockNames.length]);
                  currentNameIndex++;
                }
                const memberListHtml = roomMembers.map(name => `<span style="display:inline-block; padding: 4px 8px; background: rgba(35, 78, 42, 0.1); border-radius: 4px; margin: 2px;">${name}</span>`).join('');
                
                return `
                  <tr style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'" onclick="highlightMapPin('${room.pin}')">
                    <td style="font-weight: 700; color: var(--primary-color);">
                      ${room.name}
                      <br><small style="color: #64748b; font-weight: normal; text-decoration: underline; font-size: 0.75rem;">📍 Xem trên map</small>
                    </td>
                    <td><span class="td-badge" style="background: ${room.capacity === 2 ? '#10b981' : '#f59e0b'}; color: white;">${room.capacity} Người</span></td>
                    <td style="line-height: 1.8;">${memberListHtml}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.highlightMapPin = (pinId) => {
    // Cuộn lên phần bản đồ
    const mapSection = document.querySelector('.interactive-map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Gỡ highlight tất cả pin
    const allPins = document.querySelectorAll('.map-pin');
    allPins.forEach(p => {
      p.classList.remove('active');
      p.classList.remove('pin-here');
    });
    
    const tooltip = document.getElementById('mapTooltip');
    if (tooltip) tooltip.classList.remove('show');

    // Thêm highlight cho pin được chọn
    const targetPin = document.getElementById(pinId);
    if (targetPin) {
      // Delay chút để mượt hơn trong lúc scroll
      setTimeout(() => {
        targetPin.classList.add('pin-here');
        
        // Tự động tắt highlight sau 5s
        setTimeout(() => {
          targetPin.classList.remove('pin-here');
        }, 5000);
      }, 500);
    }
  };


  // Render Member List Table
  const membersList = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0987 654 321', travel: '🚗 Xe đoàn', note: 'Dị ứng hải sản' },
    { id: 2, name: 'Trần Thị B', phone: '0912 345 678', travel: '🚗 Xe đoàn', note: '' },
    { id: 3, name: 'Lê Văn C', phone: '0909 111 222', travel: '🏍️ Tự di chuyển', note: 'Mang theo loa kéo' },
    { id: 4, name: 'Phạm Thị D', phone: '0988 999 888', travel: '🚗 Xe đoàn', note: '' },
    { id: 5, name: 'Hoàng Văn E', phone: '0977 666 555', travel: '🏍️ Tự di chuyển', note: '' },
    { id: 6, name: 'Vũ Thị F', phone: '0966 555 444', travel: '🚗 Xe đoàn', note: 'Ăn chay' },
    { id: 7, name: 'Đặng Văn G', phone: '0955 444 333', travel: '🚗 Xe đoàn', note: '' },
    { id: 8, name: 'Bùi Thị H', phone: '0944 333 222', travel: '🏍️ Tự di chuyển', note: 'Đến trễ 1 tiếng' },
    { id: 9, name: 'Đỗ Văn I', phone: '0933 222 111', travel: '🚗 Xe đoàn', note: '' },
    { id: 10, name: 'Hồ Thị K', phone: '0922 111 000', travel: '🚗 Xe đoàn', note: '' },
    { id: 11, name: 'Ngô Văn L', phone: '0911 000 999', travel: '🏍️ Tự di chuyển', note: '' },
    { id: 12, name: 'Dương Thị M', phone: '0900 999 888', travel: '🚗 Xe đoàn', note: 'Ban tổ chức' },
    { id: 13, name: 'Lý Văn N', phone: '0899 888 777', travel: '🚗 Xe đoàn', note: '' },
    { id: 14, name: 'Đoàn Thị P', phone: '0888 777 666', travel: '🏍️ Tự di chuyển', note: '' },
    { id: 15, name: 'Trịnh Văn Q', phone: '0877 666 555', travel: '🚗 Xe đoàn', note: '' },
    { id: 16, name: 'Đinh Thị R', phone: '0866 555 444', travel: '🚗 Xe đoàn', note: '' }
  ];

  const tableBody = document.getElementById('member-table-body');
  if (tableBody) {
    membersList.forEach(m => {
      const isCar = m.travel.includes('Xe đoàn');
      const badgeClass = isCar ? 'td-badge car' : 'td-badge';
      const row = `
        <tr>
          <td>${m.id}</td>
          <td style="font-weight: 600;">${m.name}</td>
          <td>${m.phone}</td>
          <td><span class="${badgeClass}">${m.travel}</span></td>
          <td style="color: #64748b; font-style: italic;">${m.note || '-'}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });
  }

  // Tab Switching Logic
  window.switchTab = (tabId) => {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Activate target tab
    document.getElementById(`tab-${tabId}`).classList.add('active');
    // Activate clicked button
    if (event && event.currentTarget) {
      event.currentTarget.classList.add('active');
    }
  };

  // 5. Countdown & Winding Road Progress
  const targetDate = new Date('2026-07-11T00:00:00').getTime();
  const startDate = new Date('2026-06-10T00:00:00').getTime(); // Start point

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('cd-days').innerText = '00';
      document.getElementById('cd-hours').innerText = '00';
      document.getElementById('cd-mins').innerText = '00';
      document.getElementById('cd-secs').innerText = '00';
      document.getElementById('cd-vehicle').style.left = 'calc(100% - 35px)';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('cd-days').innerText = days.toString().padStart(2, '0');
    document.getElementById('cd-hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('cd-mins').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('cd-secs').innerText = seconds.toString().padStart(2, '0');

    // Calculate progress percentage
    const totalDuration = targetDate - startDate;
    const passedDuration = now - startDate;
    let progress = (passedDuration / totalDuration) * 100;
    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;
    
    // Adjust left position
    const vehicle = document.getElementById('cd-vehicle');
    if (vehicle) {
      vehicle.style.left = `calc(${progress}% - 20px)`;
      vehicle.style.transform = `translateY(-100%)`;
    }
  };

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 6. Music & Danmaku Toggle Logic
  const iconOff = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
  const iconOn = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;

  window.toggleMusic = () => {
    const bgm = document.getElementById('bgm');
    const player = document.getElementById('music-player');
    const icon = document.getElementById('music-icon-svg');
    
    if (bgm.paused) {
      bgm.play().then(() => {
        player.classList.add('music-playing');
        icon.innerHTML = iconOn;
      }).catch(err => console.log('Chưa thể phát nhạc tự động:', err));
    } else {
      bgm.pause();
      player.classList.remove('music-playing');
      icon.innerHTML = iconOff;
    }
  };

  let danmakuEnabled = true;
  const danmakuIconOn = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  const danmakuIconOff = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="3" y1="3" x2="21" y2="21"></line></svg>`;

  window.toggleDanmaku = () => {
    const container = document.getElementById('danmaku-container');
    const icon = document.getElementById('danmaku-icon-svg');
    danmakuEnabled = !danmakuEnabled;
    if (danmakuEnabled) {
      container.style.display = 'block';
      icon.innerHTML = danmakuIconOn;
    } else {
      container.style.display = 'none';
      icon.innerHTML = danmakuIconOff;
    }
  };

  // 7. Dynamic Weather
  const weatherContainer = document.getElementById('weather-days-container');
  if (weatherContainer) {
    const today = new Date();
    const weatherData = [
      { icon: '⛅', temp: '28°C' },
      { icon: '☀️', temp: '30°C' },
      { icon: '🌧️', temp: '26°C' }
    ];
    
    weatherContainer.innerHTML = weatherData.map((data, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      return `
        <div class="w-day">
          <span class="w-date">${index === 0 ? 'Hôm nay' : dateStr}</span>
          <span class="w-icon">${data.icon}</span>
          <span class="w-temp">${data.temp}</span>
        </div>
      `;
    }).join('');
  }

  // Observe all fade-up elements (including dynamically injected ones)
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => observer.observe(el));

  // --- 8. Danmaku & Chat System (Firebase) ---
  let messages = [];

  // Lắng nghe dữ liệu Realtime từ Firebase
  onValue(messagesRef, (snapshot) => {
    messages = [];
    snapshot.forEach((child) => {
      messages.push({ id: child.key, ...child.val() });
    });
    // Render lại hòm thư khi có dữ liệu mới
    if (document.getElementById('mailbox-modal').classList.contains('show')) {
      renderMailbox();
    }
  });

  // Modals
  window.openModal = (id) => {
    document.getElementById(id).classList.add('show');
    if (id === 'mailbox-modal') {
      renderMailbox();
    }
  };
  
  window.closeModal = (id) => {
    document.getElementById(id).classList.remove('show');
  };

  window.updateFileName = () => {
    const input = document.getElementById('photo-upload-input');
    const label = document.getElementById('upload-filename');
    const previewArea = document.getElementById('upload-area-label');
    
    if (input.files && input.files.length > 0) {
      if (input.files.length === 1) {
        const file = input.files[0];
        label.textContent = "Đã chọn: " + file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
          previewArea.style.backgroundImage = `url('${e.target.result}')`;
          previewArea.style.backgroundSize = 'cover';
          previewArea.style.backgroundPosition = 'center';
          previewArea.querySelector('.upload-icon').style.display = 'none';
          label.style.background = 'rgba(255,255,255,0.85)';
          label.style.padding = '4px 8px';
          label.style.borderRadius = '6px';
          label.style.color = '#1e293b';
          label.style.fontWeight = '600';
        }
        reader.readAsDataURL(file);
      } else {
        // Multiple files selected
        label.textContent = `Đã chọn ${input.files.length} ảnh`;
        previewArea.style.backgroundImage = 'none';
        previewArea.querySelector('.upload-icon').style.display = 'block';
        label.style.background = 'rgba(16, 185, 129, 0.9)'; // Green badge
        label.style.padding = '4px 12px';
        label.style.borderRadius = '20px';
        label.style.color = '#fff';
        label.style.fontWeight = '700';
      }
    } else {
      label.textContent = "Bấm để chụp hoặc chọn ảnh";
      previewArea.style.backgroundImage = 'none';
      previewArea.querySelector('.upload-icon').style.display = 'block';
      label.style.background = 'transparent';
      label.style.color = '#cbd5e1';
      label.style.fontWeight = '400';
    }
  };

  // Image compression utility using Canvas
  const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', quality);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  window.submitPhoto = async () => {
    const fileInput = document.getElementById('photo-upload-input');
    const nameInput = document.getElementById('upload-name');
    const captionInput = document.getElementById('upload-caption');
    const btn = document.getElementById('upload-btn');

    const files = Array.from(fileInput.files);
    let name = nameInput.value.trim();
    const caption = captionInput.value.trim();

    if (files.length === 0) {
      alert("Vui lòng chọn hoặc chụp ít nhất một bức ảnh!");
      return;
    }
    if (!name) name = "Thành viên A3"; // Auto-fallback so it doesn't block

    btn.disabled = true;
    let uploadedCount = 0;

    try {
      for (let file of files) {
        btn.textContent = `Đang nén & tải lên ${uploadedCount + 1}/${files.length}...`;
        
        // Compress image before uploading
        const compressedFile = await compressImage(file, 1920, 0.85); // Max width 1920px (Full HD), 85% quality
        
        // 1. Upload to ImgBB
        const formData = new FormData();
        formData.append('image', compressedFile);
        
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData
        });
        const imgbbData = await imgbbRes.json();
        
        if (!imgbbData.success) throw new Error(`Upload failed for ${file.name}`);
        
        const imageUrl = imgbbData.data.url;

        // 2. Save to Firebase RTDB
        const photoData = {
          name: name,
          caption: caption,
          url: imageUrl,
          date: new Date().toLocaleDateString('vi-VN'),
          timestamp: Date.now()
        };

        const newPhotoRef = push(galleryRef);
        await set(newPhotoRef, photoData);
        
        uploadedCount++;
      }

      alert(`Tuyệt vời! Đã tải lên thành công ${uploadedCount} ảnh! 🚀`);
      
      // Reset UI
      fileInput.value = "";
      captionInput.value = "";
      nameInput.value = ""; // Clear name
      const previewArea = document.getElementById('upload-area-label');
      previewArea.style.backgroundImage = 'none';
      previewArea.querySelector('.upload-icon').style.display = 'block';
      const label = document.getElementById('upload-filename');
      label.style.background = 'transparent';
      label.style.color = '#cbd5e1';
      label.style.fontWeight = '400';
      label.textContent = "Bấm để chụp hoặc chọn ảnh";
      
      closeModal('upload-modal');
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối mạng, vui lòng thử lại!");
    } finally {
      btn.textContent = "Gửi Ảnh";
      btn.disabled = false;
    }
  };

  // Form helpers
  window.addEmoji = (emoji) => {
    const input = document.getElementById('chat-text');
    input.value += emoji;
  };

  window.sendChat = () => {
    const nameInput = document.getElementById('chat-name');
    const textInput = document.getElementById('chat-text');
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
      alert("Vui lòng nhập đầy đủ Tên và Lời nhắn!");
      return;
    }

    const newMsgData = {
      name: name,
      text: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('vi-VN'),
      timestamp: Date.now()
    };

    // Đẩy lên Firebase
    const newMsgRef = push(messagesRef);
    set(newMsgRef, newMsgData).then(() => {
      // Tự bắn Danmaku ngay lập tức cho bản thân xem trước
      spawnDanmaku(newMsgData.name, newMsgData.text, newMsgRef.key);
    }).catch(err => {
      console.error(err);
      alert("Lỗi kết nối mạng, vui lòng thử lại!");
    });

    // Reset and close
    textInput.value = '';
    closeModal('chat-modal');
  };

  let activeDanmakus = new Set();
  const TRACKS = [10, 17, 24, 31, 38, 45, 52, 59, 66, 73];

  window.spawnDanmaku = (name, text, id = null, trackIndex = -1) => {
    if (!danmakuEnabled) return;
    const container = document.getElementById('danmaku-container');
    if (!container) return;

    if (id) activeDanmakus.add(id);

    const el = document.createElement('div');
    el.className = 'danmaku-item';
    el.innerHTML = `<span class="danmaku-name">${name}:</span> <span>${text}</span>`;

    // Assign Track
    let topPos;
    if (trackIndex >= 0 && trackIndex < TRACKS.length) {
      topPos = TRACKS[trackIndex];
    } else {
      topPos = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    }
    
    // Thêm jitter nhỏ (+- 1%) để tự nhiên
    const jitter = Math.floor(Math.random() * 3) - 1;
    el.style.top = `${topPos + jitter}%`;

    // Random Speed Slower (18s to 28s)
    const duration = Math.floor(Math.random() * 10) + 18;
    el.style.animationDuration = `${duration}s`;

    container.appendChild(el);

    // Cleanup after animation
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (id) activeDanmakus.delete(id);
    }, duration * 1000);
  };

  window.renderMailbox = () => {
    const list = document.getElementById('mailbox-list');
    if (!list) return;

    if (messages.length === 0) {
      list.innerHTML = `<p style="text-align: center; color: #64748b; padding: 20px;">Hòm thư trống. Hãy gửi lời nhắn đầu tiên!</p>`;
      return;
    }

    // Sort newest first
    const sorted = [...messages].sort((a, b) => b.timestamp - a.timestamp);
    
    list.innerHTML = sorted.map(msg => `
      <div class="mailbox-item">
        <div class="mail-info">
          <span class="mail-header">${msg.time} - ${msg.date}</span>
          <span class="mail-name">${msg.name}</span>
          <span class="mail-text">${msg.text}</span>
        </div>
        <button class="btn-delete" onclick="deleteMessage('${msg.id}')" title="Xóa tin nhắn">🗑️</button>
      </div>
    `).join('');
  };

  // Admin & Moderation
  let adminMode = false;
  window.promptAdmin = () => {
    if (adminMode) {
      adminMode = false;
      document.body.classList.remove('admin-mode');
      alert("Đã thoát chế độ Admin.");
      return;
    }
    
    const pwd = prompt("Nhập mật khẩu Admin:");
    if (pwd === "a3admin") {
      adminMode = true;
      document.body.classList.add('admin-mode');
      alert("Chế độ Admin đã được kích hoạt. Bạn có thể xóa tin nhắn và ảnh.");
    } else if (pwd !== null) {
      alert("Sai mật khẩu.");
    }
  };

  window.deleteMessage = (id) => {
    if (!adminMode) {
      alert("Bạn không có quyền xóa tin nhắn.");
      return;
    }
    if (confirm('Bạn chắc chắn muốn xóa tin nhắn này?')) {
      const msgRef = ref(db, `messages/${id}`);
      remove(msgRef);
    }
  };

  window.deletePhoto = (id) => {
    if (!adminMode) return;
    if (confirm('Bạn chắc chắn muốn xóa bức ảnh này khỏi thư viện?')) {
      const pRef = ref(db, `gallery/${id}`);
      remove(pRef);
    }
  };

  // Spawner: Continuously spawn waves of historical messages
  const spawnWave = () => {
    if (!danmakuEnabled) return;

    const availableMsgs = messages.filter(m => !activeDanmakus.has(m.id));
    if (availableMsgs.length === 0) return;

    // Lấy ngẫu nhiên 2 đến 4 tin nhắn cho mỗi đợt
    const shuffled = availableMsgs.sort(() => 0.5 - Math.random());
    const waveSize = Math.min(Math.floor(Math.random() * 3) + 2, shuffled.length);
    const waveMsgs = shuffled.slice(0, waveSize);

    // Tạo danh sách làn đường ngẫu nhiên để không bị đè
    const availableTracks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());

    waveMsgs.forEach((msg, idx) => {
      const trackIdx = availableTracks[idx];
      setTimeout(() => {
        spawnDanmaku(msg.name, msg.text, msg.id, trackIdx);
      }, idx * 1500); // giãn cách từng tin trong đợt
    });
  };

  setInterval(() => {
    // Chỉ bắn đợt mới khi màn hình trống trải (0 tin nhắn đang bay)
    // Điều này tạo ra khoảng nghỉ để người dùng xem giao diện
    const currentDanmakus = document.querySelectorAll('.danmaku-item').length;
    if (currentDanmakus === 0) {
      spawnWave();
    }
  }, 5000); // Check mỗi 5s

  // --- Photo Gallery System ---
  let photos = [];
  
  onValue(galleryRef, (snapshot) => {
    photos = [];
    snapshot.forEach(child => {
      photos.push({ id: child.key, ...child.val() });
    });
    renderGallery();
  });

  const renderGallery = () => {
    const container = document.getElementById('gallery-timeline');
    if (!container) return;

    if (photos.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: #64748b; font-style: italic; padding: 20px;">Chưa có ảnh nào được tải lên. Hãy là người đầu tiên!</p>`;
      return;
    }

    // Group photos by date
    const grouped = {};
    photos.sort((a, b) => b.timestamp - a.timestamp).forEach(photo => {
      if (!grouped[photo.date]) grouped[photo.date] = [];
      grouped[photo.date].push(photo);
    });

    let html = '';
    for (const [date, daysPhotos] of Object.entries(grouped)) {
      html += `
        <div class="timeline-day">
          <div class="timeline-date">${date}</div>
          <div class="timeline-photos">
            ${daysPhotos.map(p => `
              <div class="photo-card">
                <img src="${p.url}" alt="Kỷ niệm" class="photo-img" loading="lazy">
                <button class="photo-delete-btn" onclick="deletePhoto('${p.id}')" title="Xóa ảnh">🗑️</button>
                <div class="photo-meta">
                  ${p.caption ? `<span class="photo-caption">${p.caption}</span>` : ''}
                  <span class="photo-author">Đăng bởi: ${p.name}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  };

  // --- Wheel of Names Logic ---
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  let currentRotation = 0;
  let isSpinning = false;
  let currentWinner = '';

  window.drawWheel = () => {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const textarea = document.getElementById('wheel-names');
    
    // Init default if empty
    if (textarea && textarea.value.trim() === '') {
      textarea.value = mockNames.join('\n');
    }

    let names = [];
    if (textarea) {
      names = textarea.value.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    }
    if (names.length === 0) names = ['Trống'];
    
    window.wheelNames = names;
    
    const numSegments = names.length;
    const arc = Math.PI * 2 / numSegments;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < numSegments; i++) {
      const angle = i * arc;
      
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px "Outfit", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(names[i], radius - 20, 6);
      ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const playTickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.03);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch(e) {}
  };

  window.spinWheel = () => {
    if (isSpinning || !window.wheelNames || window.wheelNames.length === 0) return;
    isSpinning = true;
    
    const canvas = document.getElementById('wheel-canvas');
    const resultDiv = document.getElementById('wheel-result');
    const removeBtn = document.getElementById('remove-winner-btn');
    
    resultDiv.textContent = 'Đang quay...';
    resultDiv.style.color = '#cbd5e1';
    resultDiv.style.transition = 'transform 0.3s';
    removeBtn.style.display = 'none';
    
    // Play tick sounds with decreasing speed
    let tickCount = 0;
    const maxTicks = 35;
    const tickInterval = () => {
      if (!isSpinning) return;
      playTickSound();
      tickCount++;
      if (tickCount < maxTicks) {
        // Tốc độ chậm dần (delay tăng dần)
        const delay = 30 + Math.pow(tickCount, 1.8);
        setTimeout(tickInterval, delay);
      }
    };
    tickInterval();
    
    const spinSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 full spins
    const randomDegrees = Math.floor(Math.random() * 360);
    const totalDegrees = spinSpins * 360 + randomDegrees;
    
    currentRotation += totalDegrees;
    
    canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.1, 1)';
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
      isSpinning = false;
      
      const numSegments = window.wheelNames.length;
      const degreesPerSegment = 360 / numSegments;
      const normalizedRot = currentRotation % 360;
      
      // Pointer is at top (270 deg)
      const topAngle = (270 - normalizedRot + 360) % 360;
      const winnerIndex = Math.floor(topAngle / degreesPerSegment);
      
      currentWinner = window.wheelNames[winnerIndex];
      resultDiv.textContent = `🎉 ${currentWinner} 🎉`;
      resultDiv.style.color = '#10b981';
      removeBtn.style.display = 'block';
      
      resultDiv.style.transform = 'scale(1.2)';
      setTimeout(() => resultDiv.style.transform = 'scale(1)', 300);
      
      // Play cheer sound
      const cheerAudio = document.getElementById('wheel-cheer');
      if (cheerAudio) {
        cheerAudio.currentTime = 0;
        cheerAudio.volume = 0.6;
        cheerAudio.play().catch(e => console.log('Audio play failed', e));
      }

      // Trigger Confetti
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 99999
        });
      }

      // Show Winner Popup
      setTimeout(() => {
        const winnerDisplay = document.getElementById('winner-name-display');
        if (winnerDisplay) {
          winnerDisplay.textContent = currentWinner;
          window.openModal('winner-modal');
        }
      }, 500);
      
    }, 4000);
  };

  window.shuffleNames = () => {
    const textarea = document.getElementById('wheel-names');
    if (!textarea) return;
    let names = textarea.value.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    names.sort(() => Math.random() - 0.5);
    textarea.value = names.join('\n');
    window.drawWheel();
  };

  window.multiplyNames = () => {
    const textarea = document.getElementById('wheel-names');
    if (!textarea) return;
    let names = textarea.value.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (names.length > 0) {
      names = [...names, ...names];
      textarea.value = names.join('\n');
      window.drawWheel();
    }
  };

  window.removeWinner = () => {
    const textarea = document.getElementById('wheel-names');
    const resultDiv = document.getElementById('wheel-result');
    const removeBtn = document.getElementById('remove-winner-btn');
    
    if (!textarea || !currentWinner) return;
    
    let names = textarea.value.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    const index = names.indexOf(currentWinner);
    if (index > -1) {
      names.splice(index, 1);
      textarea.value = names.join('\n');
      window.drawWheel();
    }
    
    resultDiv.textContent = '';
    removeBtn.style.display = 'none';
    currentWinner = '';
  };

  // Draw wheel initially if modal is opened
  // Móc sự kiện openModal để drawWheel
  const originalOpenModal = window.openModal;
  window.openModal = (modalId) => {
    originalOpenModal(modalId);
    if (modalId === 'wheel-modal') {
      // Delay chút để DOM render hiển thị rõ kích thước canvas
      setTimeout(() => window.drawWheel(), 100);
    }
  };

});
