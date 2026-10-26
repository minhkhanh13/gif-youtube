// MemeTube Pro v2 - Content Script
(() => {
  let activeEditor = null;
  let currentTab = 'gif';
  let currentAsciiCat = 'all';

  // ==================== 1. KHO 35+ TRANH KÝ TỰ ASCII / BRAILLE ====================
  const ASCII_MEMES = [
    { name: "Pop Cat Há Mồm (To Bản Chuẩn)", cat: "Mèo & Động Vật", art: "      /\\_/\\\n     ( o.o )\n     (  O  )  POP! POP! POP!\n      / | \\\n     (__|__)" },
    { name: "Smug Cat Cười Đểu (Full HD)", cat: "Mèo & Động Vật", art: "　　　　　／＞　　フ\n　　　　　| 　_　 _ l\n　 　　　／` ミ＿xノ\n　　 　 /　　　 　 |\n　　　 /　 ヽ　　 ﾉ\n　 　 │　　|　|　|\n／￣|　　 |　|　|\n| (￣ヽ＿_ヽ_)__)\n＼二つ" },
    { name: "Doge Shiba Huyền Thoại (Full)", cat: "Mèo & Động Vật", art: "  ░░░░░░░░░░░░░░░\n  ░░░░▄▄▄▄▄▄░░░░░\n  ░░▄█████████▄░░\n  ░███▀█▀█▀████░░\n  ░███▄█▄█▄████░░\n  ░░▀█████████▀░░\n  ░░░░░░░░░░░░░░░\n  much wow, such comment!" },
    { name: "Mèo Cầm Súng Đòi Like (Bản To)", cat: "Mèo & Động Vật", art: "      /\\_/\\\n     ( •_• )▄︻デ══━一\n     / >   \\  Đưa Like đây không bắn!\n    (__|__)" },
    { name: "Mèo Nằm Ngủ Thảnh Thơi", cat: "Mèo & Động Vật", art: "         |\\__/,|   (`\\\n       _.|o o  |_   ) )\n     -(((---(((--------" },
    { name: "Capybara Chill Cam Trên Đầu", cat: "Mèo & Động Vật", art: "        🍊\n       (￣(工)￣)\n      /|   |   |\\\n     ( |   |   | )  Ok I pull up~\n      (___(___)__)" },
    { name: "Chó Cheems Bị Bonk Đầu", cat: "Mèo & Động Vật", art: "       \\\n        \\    /\\_/\\\n       BONK ( >_< )\n            /     \\\n           (__|__)" },
    { name: "Bongo Cat Đánh Trống (Bản To)", cat: "Mèo & Động Vật", art: "         /\\_/\\\n        ( •ω• )\n      ┏━∪━━━∪━┓\n      ┃ 🥁 🥁 ┃  Tùng tùng tùng!\n      ┗━━━━━━━┛" },
    { name: "GigaChad Sigma (Bản Khắc Nét)", cat: "Meme Chúa", art: "⠀⠀⠀⢀⣴⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠈⢿⣿⡟⠀⠀⠀⠀⢀⣀⣤⣄\n⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⣴⣿⣿⣿⣿\n⠀⠀⠀⠀⢸⣿⣇⣀⣀⣀⣈⣉⣛⡛⠃\n⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆\n🗿 Average YouTube Enjoyer" },
    { name: "Moai Mặt Đá 🗿 (Đại Tượng Khổng Lồ)", cat: "Meme Chúa", art: "⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣶⣶⣶⣶⣶⣶⣶⣦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀\n⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀\n⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠉⠙⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠛⠋⠉⠀⠀⠀⠀\nBruh 🗿" },
    { name: "Trollface Classic (Full HD Đầy Đủ)", cat: "Meme Chúa", art: "  ░░░░░▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄▄▄▄░░░░░░░\n  ░░░░█░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░▀▀▄░░░░\n  ░░░█░░░▒▒▒▒▒▒░░░░░░░░▒▒▒░░█░░░\n  ░░█░░░░░░▄██▀▄▄░░░░░▄▄▄░░░░█░░\n  ░▀▒░▄▄▄▒░█▀▀▀▀▄▄█░░▀▄▄▄█░░░▒▀░\n  ░░░░░░░░░░Problem, YouTube?░░░" },
    { name: "Pepe The Frog Cười Tươi", cat: "Meme Chúa", art: "    .-'''''-.\n  .'   .-.   '.\n /   /`   `\\   \\\n|   | (o) (o) |   |\n|   |   .     |   |\n \\   \\  '---' /   /\n  '.  `'---'`  .'\n    '-._____.-'\n   Feels Good Man!" },
    { name: "Stonks Tăng Trưởng Vút Trời", cat: "Meme Chúa", art: "          😎     📈\n         /|\\   /\n         / \\  /   STONKS!\n       ──────" },
    { name: "Absolute Cinema (Bản Hoành Tráng)", cat: "Meme Chúa", art: "           🙌\n         ( •_•)\n        /|  |\\\n        ABSOLUTE\n         CINEMA" },
    { name: "UNO Thẻ Đảo Ngược Bàn Cờ", cat: "Meme Chúa", art: "┌─────────┐\n│ 🔄      │\n│         │\n│  ĐẢO    │\n│  NGƯỢC  │\n│         │\n│      🔄 │\n└─────────┘" },
    { name: "Hai Người Nhện Chỉ Nhau 👉👈", cat: "Meme Chúa", art: "    ( •_•) 👉      👈 (•_• )\n   <)   )╯          ╰(   (>\n    /   \\            /   \\" },
    { name: "Among Us Sus (Full Bản To)", cat: "Game & Anime", art: "  ⣠⣤⣤⣤⣤⣤⣄⡀\n ⣴⣿⣿⣿⣿⣿⣿⣿⣷⡀\n ⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n ⣿⣿⡟⠋⠁⠀⠀⠈⢻⡇\n ⣿⣿⣷⣄⡀⠀⠀⢀⣼⡇\n ⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n ⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n ⢿⣿⣿⣿⠏⠹⣿⣿⣿⠇\n   SUS! 📮" },
    { name: "Minecraft Creeper (Full Đầu)", cat: "Game & Anime", art: "████████\n█░░██░░█\n█░░██░░█\n███░░███\n██░░░░██\n██░░░░██\n██░██░██\n  Tsssss... 💥" },
    { name: "Pikachu Há Hốc Mồm", cat: "Game & Anime", art: "   ⚡️   /\\__/\\\n       ( ° o ° )\n      /|   |   |\\\n     ( |   |   | )  Hả?! Thật á?!\n      (___(___)__)" },
    { name: "Chiikawa Mời Trà (Bản Đẹp)", cat: "Game & Anime", art: "      ( ˶ˆᗜˆ˵ )\n     (つ 🍵 ⊂)\n    Mời bạn một tách trà\n    Xem video cho ấm lòng!" },
    { name: "Anya Forger Cười Đểul (Heh)", cat: "Game & Anime", art: "       /\\___/\\\n      ( 𓁹 ‿ 𓁹 )\n     /|   |   |\\\n       Heh..." },
    { name: "Press F To Pay Respects", cat: "Game & Anime", art: "███████╗\n██╔════╝\n█████╗░░\n██╔══╝░░\n██║░░░░░\n╚═╝░░░░░" },
    { name: "Dark Souls: YOU DIED", cat: "Game & Anime", art: "═════════════════════\n     Y O U   D I E D\n═════════════════════" },
    { name: "Xe Tăng Bắn Pháo Hạng Nặng", cat: "Biển Báo & VIP", art: "      ░░░░░░███████ ]▄▄▄▄▄▄▄▄\n ▂▄▅█████████▅▄▃▂\nI███████████████████].\n  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤..." },
    { name: "Vé Xem Chùa Hạng VIP", cat: "Biển Báo & VIP", art: "🎫━━━━━━━ VÉ VIP ━━━━━━━🎫\n┃ Người xem sớm nhất   ┃\n┃ Chỗ ngồi: Hàng đầu 🍿┃\n🎫━━━━━━━━━━━━━━━━━━━━━━🎫" },
    { name: "Thỏ Bưng Bảng Khen Video", cat: "Biển Báo & VIP", art: " (\\(\\\n ( -.-)\n o_(\")(\")\n┌────────────────────┐\n│ Video đỉnh thực sự │\n└────────────────────┘" },
    { name: "Cảnh Sát Giao Thông YouTube", cat: "Biển Báo & VIP", art: "  👮‍♂️📢 DỪNG LẠI!\n  ┌───────────────────────┐\n  │ Xe của bạn vi phạm    │\n  │ lỗi: Xem chưa bấm Like│\n  └───────────────────────┘" },
    { name: "Hộp Bắp Rang Ngồi Xem Drama", cat: "Biển Báo & VIP", art: "   🍿🍿🍿\n  ┌──────┐\n  │DRAMA │  Ngồi hóng biến căng!\n  └──────┘" },
    { name: "Cúp Chứng Nhận Siêu Phẩm", cat: "Biển Báo & VIP", art: "🏆════════════════════🏆\n  CHỨNG NHẬN SIÊU PHẨM\n    10/10 Không Có Nhưng!\n🏆════════════════════🏆" }
  ];

  // ==================== 2. KHO 60+ KAOMOJI BIỂU CẢM NHẬT BẢN ====================
  const KAOMOJIS = [
    { k: "(╯°□°）╯︵ ┻━┻", d: "Lật bàn tức giận" },
    { k: "┬─┬ノ( º _ ºノ)", d: "Đặt bàn lại bình tĩnh" },
    { k: "┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻", d: "Lật 2 bàn điên cuồng" },
    { k: "¯\\_(ツ)_/¯", d: "Nhún vai bất lực" },
    { k: "( ͡° ͜ʖ ͡°)", d: "Lenny Face cười gian" },
    { k: "( ˶ˆᗜˆ˵ )", d: "Cười tươi đáng yêu" },
    { k: "(っ˘ω˘ς ) ❤️", d: "Thả tim ấm áp" },
    { k: "(╬ Ò﹏Ó)", d: "Tức xì khói" },
    { k: "(╥﹏╥)", d: "Khóc ròng ròng" },
    { k: "(っ˘̩╭╮˘̩)っ", d: "Tủi thân cần ôm" },
    { k: "(ง'̀-'́)ง", d: "Giơ nắm đấm solo" },
    { k: "ᕙ(⇀‸↼‶)ᕗ", d: "Khoe cơ bắp" },
    { k: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", d: "Rải phép thuật lấp lánh" },
    { k: "(☞ﾟヮﾟ)☞", d: "Chỉ tay chuẩn luôn" },
    { k: "☜(ﾟヮﾟ☜)", d: "Chỉ tay ngược lại" },
    { k: "(づ｡◕‿‿◕｡)づ", d: "Ôm một cái nào" },
    { k: "( •_•)>⌐■-■", d: "Đeo kính ngầu (1)" },
    { k: "(⌐■_■)", d: "Đeo kính cực ngầu (2)" },
    { k: "(⊙_⊙)", d: "Mắt chữ A mồm chữ O" },
    { k: "(°ロ°) !", d: "Sốc toàn tập" },
    { k: "(¬‿¬)", d: "Liếc mắt nghi ngờ" },
    { k: "(¬_¬)", d: "Cạn lời không muốn nói" },
    { k: "( ´･･)ﾉ(._.`) ", d: "Xoa đầu an ủi" },
    { k: "ヾ(≧▽≦*)o", d: "Vẫy tay hào hứng" },
    { k: "o(*￣▽￣*)ブ", d: "Chào buổi sáng vui vẻ" },
    { k: "(￣y▽,￣)╭ ", d: "Cười khẩy" },
    { k: "♪(^∇^*)", d: "Quẩy theo nhạc" },
    { k: "ヾ(⌐■_■)ノ♪", d: "DJ Quẩy nhạc chất" },
    { k: "(∪.∪ )...zzz", d: "Buồn ngủ gật gù" },
    { k: "( ´ཀ` )", d: "Thổ huyết vì quá đỉnh" },
    { k: "🙏 ( ˘ω˘ ) 🙏", d: "Chắp tay cầu nguyện" },
    { k: "(/_ _)/ 🏆", d: "Quỳ lạy trao cúp" },
    { k: "(つ✧ω✧)つ 💵", d: "Hãy cầm lấy tiền của tôi" },
    { k: "ʕ•́ᴥ•̀ʔっ ❤️", d: "Gấu nhỏ tặng tim" },
    { k: "=^._.^= ∫", d: "Mèo con vẫy đuôi" },
    { k: "(V)(°,,,,°)(V)", d: "Cua kẹp ngang ngược" }
  ];

  const POPULAR_GIF_TAGS = ['Trending 🔥', 'Cat Meme 🐱', 'Anime Dance 💃', 'Laughing 😂', 'Shocked 😱', 'Crying 😭', 'Clapping 👏', 'Gaming 🎮', 'Sigma 🗿'];

  // ==================== 3. MODAL UI & TƯƠNG TÁC ====================
  let modalOverlay = null;

  function createModal() {
    if (modalOverlay) return;

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'memetube-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="memetube-modal">
        <div class="memetube-header">
          <div class="memetube-title">✨ MemeTube Studio v2 (Siêu Khổng Lồ)</div>
          <button class="memetube-close-btn" title="Đóng">&times;</button>
        </div>

        <div class="memetube-tabs">
          <button class="memetube-tab-btn active" data-tab="gif">🎬 Kho GIF Tenor</button>
          <button class="memetube-tab-btn" data-tab="ascii">🗿 35+ Tranh Ký Tự</button>
          <button class="memetube-tab-btn" data-tab="kao">UwU 60+ Kaomoji</button>
          <button class="memetube-tab-btn" data-tab="studio">🎨 Tạo Ảnh -> Chữ</button>
        </div>

        <!-- Thanh chủ đề nhanh cho GIF -->
        <div class="memetube-subcats" id="subcats-gif"></div>
        <!-- Thanh chủ đề cho ASCII -->
        <div class="memetube-subcats" id="subcats-ascii" style="display:none;"></div>

        <div class="memetube-search-wrap" id="memetube-search-wrap">
          <input type="text" class="memetube-search-input" placeholder="🔍 Tìm hàng triệu ảnh GIF từ Tenor (VD: cat, haha, anime, dance)..." />
        </div>

        <div class="memetube-content">
          <!-- TAB 1: GIF -->
          <div class="memetube-tab-pane active" id="pane-gif">
            <div style="font-size:11px; color:#aaa; margin-bottom:8px;">
              💡 <b>Mẹo:</b> Click vào GIF sẽ chèn mã <code>[gif:ID]</code>. Máy bạn và ai cài tiện ích sẽ thấy <b>ảnh GIF động chạy ngay trong bình luận</b>!
            </div>
            <div class="memetube-gif-grid" id="gif-grid"></div>
          </div>

          <!-- TAB 2: ASCII -->
          <div class="memetube-tab-pane" id="pane-ascii">
            <div style="font-size:11px; color:#aaa; margin-bottom:8px;">
              🔥 <b>Ai cũng nhìn thấy:</b> Tranh ký tự gửi phát ăn ngay, 100% người dùng điện thoại & máy tính đều thấy!
            </div>
            <div class="memetube-ascii-grid" id="ascii-grid"></div>
          </div>

          <!-- TAB 3: KAOMOJI -->
          <div class="memetube-tab-pane" id="pane-kao">
            <div class="memetube-kao-grid" id="kao-grid"></div>
          </div>

          <!-- TAB 4: STUDIO TỰ TẠO ẢNH -->
          <div class="memetube-tab-pane" id="pane-studio">
            <div class="memetube-studio">
              <label class="memetube-dropzone" id="studio-dropzone">
                <input type="file" id="studio-file" accept="image/*" style="display:none;" />
                <div style="font-size:14px; font-weight:700; color:#ff6688;">📁 Bấm vào đây để chọn bất kỳ ảnh Meme / Ảnh chụp nào từ máy tính</div>
                <div style="font-size:11px; color:#888; margin-top:4px;">Tự động biến bức ảnh của bạn thành tranh ký tự siêu nét để comment lên YouTube!</div>
              </label>
              <div class="memetube-studio-controls">
                <label>Độ rộng: <input type="range" id="studio-width" min="15" max="42" value="32" /></label>
                <label><input type="checkbox" id="studio-invert" /> Đảo ngược sáng/tối</label>
              </div>
              <pre class="memetube-studio-preview" id="studio-preview">Chưa có ảnh nào được chọn...</pre>
              <button class="memetube-insert-studio-btn" id="studio-insert-btn">🚀 Chèn Bức Tranh Này Vào Bình Luận</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Đóng modal
    modalOverlay.querySelector('.memetube-close-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Chặn phím tắt của YouTube khi đang gõ trong modal
    modalOverlay.addEventListener('keydown', (e) => e.stopPropagation());
    modalOverlay.addEventListener('keyup', (e) => e.stopPropagation());

    // Render sub-categories cho GIF
    const subGif = modalOverlay.querySelector('#subcats-gif');
    POPULAR_GIF_TAGS.forEach((tag, idx) => {
      const btn = document.createElement('button');
      btn.className = 'memetube-pill' + (idx === 0 ? ' active' : '');
      btn.textContent = tag;
      btn.addEventListener('click', () => {
        subGif.querySelectorAll('.memetube-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const q = idx === 0 ? '' : tag.replace(/[^\w\s]/gi, '').trim();
        modalOverlay.querySelector('.memetube-search-input').value = q;
        loadGifs(q);
      });
      subGif.appendChild(btn);
    });

    // Render sub-categories cho ASCII
    const subAscii = modalOverlay.querySelector('#subcats-ascii');
    const asciiCats = ['Tất cả', 'Mèo & Động Vật', 'Meme Chúa', 'Game & Anime', 'Biển Báo & VIP'];
    asciiCats.forEach((cat, idx) => {
      const btn = document.createElement('button');
      btn.className = 'memetube-pill' + (idx === 0 ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        subAscii.querySelectorAll('.memetube-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAsciiCat = idx === 0 ? 'all' : cat;
        renderAsciiGrid();
      });
      subAscii.appendChild(btn);
    });

    // Chuyển Tab
    const tabs = modalOverlay.querySelectorAll('.memetube-tab-btn');
    const searchWrap = modalOverlay.querySelector('#memetube-search-wrap');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;

        modalOverlay.querySelectorAll('.memetube-tab-pane').forEach(p => p.classList.remove('active'));
        modalOverlay.querySelector(`#pane-${currentTab}`).classList.add('active');

        subGif.style.display = currentTab === 'gif' ? 'flex' : 'none';
        subAscii.style.display = currentTab === 'ascii' ? 'flex' : 'none';
        searchWrap.style.display = currentTab === 'gif' ? 'block' : 'none';
      });
    });

    // Tìm kiếm GIF
    const searchInput = modalOverlay.querySelector('.memetube-search-input');
    let timer = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadGifs(searchInput.value), 350);
    });

    // Khởi tạo dữ liệu
    renderAsciiGrid();
    renderKaomojiGrid();
    setupImageStudio();
  }

  function openModal(editor) {
    activeEditor = editor;
    createModal();
    modalOverlay.classList.add('open');
    const grid = modalOverlay.querySelector('#gif-grid');
    if (!grid.children.length) loadGifs('');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
  }

  // ==================== 4. RENDER CÁC TAB ====================
  function renderAsciiGrid() {
    const grid = modalOverlay.querySelector('#ascii-grid');
    grid.innerHTML = '';
    const list = currentAsciiCat === 'all' ? ASCII_MEMES : ASCII_MEMES.filter(m => m.cat === currentAsciiCat);
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'memetube-ascii-card';
      card.innerHTML = `
        <div class="ascii-name"><span>${item.name}</span><span class="ascii-cat">${item.cat}</span></div>
        <pre>${item.art}</pre>
      `;
      card.addEventListener('click', () => {
        insertTextToEditor(item.art + '\n');
        closeModal();
      });
      grid.appendChild(card);
    });
  }

  function renderKaomojiGrid() {
    const grid = modalOverlay.querySelector('#kao-grid');
    grid.innerHTML = '';
    KAOMOJIS.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'memetube-kao-btn';
      btn.innerHTML = `<div>${item.k}</div><small>${item.d}</small>`;
      btn.addEventListener('click', () => {
        insertTextToEditor(' ' + item.k + ' ');
        closeModal();
      });
      grid.appendChild(btn);
    });
  }

  function extractShortTenorCode(url) {
    // Biến URL https://media.tenor.com/xxxx/yyyy.gif thành mã xxxx/yyyy gọn nhẹ không dính bộ lọc link của YouTube!
    const m = url.match(/tenor\.com\/([^/?#]+)\/([^/?#]+?)\.gif/i);
    if (m) return `${m[1]}/${m[2]}`;
    return url;
  }

  function loadGifs(query) {
    const grid = modalOverlay.querySelector('#gif-grid');
    grid.innerHTML = '<div style="grid-column:span 3;text-align:center;padding:40px;color:#888;">⏳ Đang tải kho GIF từ Tenor...</div>';

    chrome.runtime.sendMessage({ type: 'search-gif', query }, (res) => {
      if (!res || !res.ok || !res.gifs || !res.gifs.length) {
        grid.innerHTML = '<div style="grid-column:span 3;text-align:center;padding:40px;color:#ff6666;">Không tìm thấy GIF nào. Hãy thử từ khóa khác!</div>';
        return;
      }
      grid.innerHTML = '';
      res.gifs.forEach(gif => {
        const item = document.createElement('div');
        item.className = 'memetube-gif-item';
        item.innerHTML = `
          <img src="${gif.preview}" alt="${gif.title}" loading="lazy"  />
          <div class="gif-title">${gif.title}</div>
        `;
        item.addEventListener('click', () => {
          const shortCode = extractShortTenorCode(gif.url);
          insertTextToEditor(` [gif:${shortCode}] `);
          closeModal();
        });
        grid.appendChild(item);
      });
    });
  }

  // ==================== 5. STUDIO CHUYỂN ẢNH BẤT KỲ SANG BRAILLE ART ====================
  function setupImageStudio() {
    const fileInput = modalOverlay.querySelector('#studio-file');
    const widthInput = modalOverlay.querySelector('#studio-width');
    const invertInput = modalOverlay.querySelector('#studio-invert');
    const previewEl = modalOverlay.querySelector('#studio-preview');
    const insertBtn = modalOverlay.querySelector('#studio-insert-btn');
    let currentImg = null;

    function convertToBraille() {
      if (!currentImg) return;
      const charW = parseInt(widthInput.value, 10) || 28;
      const invert = invertInput.checked;
      const pixelW = charW * 2;
      const aspect = currentImg.height / currentImg.width;
      const pixelH = Math.max(4, Math.round(pixelW * aspect * 0.95 / 4) * 4);

      const canvas = document.createElement('canvas');
      canvas.width = pixelW;
      canvas.height = pixelH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = invert ? '#000' : '#fff';
      ctx.fillRect(0, 0, pixelW, pixelH);
      ctx.drawImage(currentImg, 0, 0, pixelW, pixelH);

      const imgData = ctx.getImageData(0, 0, pixelW, pixelH).data;
      const dotMap = [
        [0, 0, 0x01], [0, 1, 0x02], [0, 2, 0x04],
        [1, 0, 0x08], [1, 1, 0x10], [1, 2, 0x20],
        [0, 3, 0x40], [1, 3, 0x80]
      ];

      let out = '';
      for (let y = 0; y < pixelH; y += 4) {
        for (let x = 0; x < pixelW; x += 2) {
          let mask = 0;
          for (const [dx, dy, bit] of dotMap) {
            const px = x + dx;
            const py = y + dy;
            const idx = (py * pixelW + px) * 4;
            const r = imgData[idx], g = imgData[idx + 1], b = imgData[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const on = invert ? (lum > 128) : (lum < 128);
            if (on) mask |= bit;
          }
          // Dùng ký tự Braille trống (U+2800) hoặc chấm đơn để YouTube không gộp khoảng trắng
          out += String.fromCharCode(0x2800 + (mask || 0x04));
        }
        out += '\n';
      }
      previewEl.textContent = out;
    }

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          currentImg = img;
          convertToBraille();
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    widthInput.addEventListener('input', convertToBraille);
    invertInput.addEventListener('change', convertToBraille);

    insertBtn.addEventListener('click', () => {
      const art = previewEl.textContent;
      if (art && !art.startsWith('Chưa có ảnh')) {
        insertTextToEditor(art + '\n');
        closeModal();
      }
    });
  }

  // ==================== 6. CHÈN TEXT VÀO Ô BÌNH LUẬN YOUTUBE ====================
  function insertTextToEditor(text) {
    if (!activeEditor || !activeEditor.isConnected) return;
    activeEditor.focus();

    let ok = false;
    try {
      ok = document.execCommand('insertText', false, text);
    } catch (e) {}

    if (!ok) {
      activeEditor.textContent += text;
      activeEditor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }

    const box = activeEditor.closest('ytd-commentbox');
    if (box) {
      const submitBtn = box.querySelector('#submit-button button');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('disabled');
        submitBtn.setAttribute('aria-disabled', 'false');
        submitBtn.classList.remove('yt-spec-button-shape-next--disabled', 'ytSpecButtonShapeNextDisabled');
      }
    }
  }

  // ==================== 7. HIỂN THỊ INLINE GIF & TÀNG HÌNH CHỮ 100% ====================
  // Bắt mọi định dạng: [gif:code], [🎬 GIF:code], [gif:https://...]
  function getGifRegex() {
    return /\[(?:🎬\s*)?gif:\s*([^\]\s]+)\]/gi;
  }

  function resolveGifUrl(rawCode) {
    const clean = rawCode.replace(/<[^>]*>/g, '').trim();
    if (/^https?:\/\//i.test(clean)) return clean;
    return `https://media.tenor.com/${clean}.gif`;
  }

  function renderInlineGifs() {
    const commentNodes = document.querySelectorAll('#content-text');
    commentNodes.forEach(el => {
      const textContent = el.textContent || '';
      if (!/\[(?:🎬\s*)?gif:/i.test(textContent)) return;

      const matches = [...textContent.matchAll(getGifRegex())];
      if (!matches.length) return;

      // 1. TÀNG HÌNH TRIỆT ĐỂ: Dọn dẹp text nodes bằng Regex mới không bị kẹt lastIndex
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      for (let n = walker.nextNode(); n; n = walker.nextNode()) textNodes.push(n);

      textNodes.forEach(node => {
        if (/\[(?:🎬\s*)?gif:/i.test(node.nodeValue)) {
          node.nodeValue = node.nodeValue.replace(/\[(?:🎬\s*)?gif:\s*([^\]\s]+)\]/gi, '').trim();
        }
      });

      // 2. Dọn dẹp các thẻ con span/a nếu YouTube bọc vào
      el.querySelectorAll('span, a').forEach(child => {
        if (/\[(?:🎬\s*)?gif:/i.test(child.textContent)) {
          child.textContent = child.textContent.replace(/\[(?:🎬\s*)?gif:\s*([^\]\s]+)\]/gi, '').trim();
        }
        if (/tenor\.com/i.test(child.href || '')) {
          child.remove();
        }
      });

      // 3. Nếu bình luận chỉ có độc mỗi GIF, ẩn dòng chữ trống của YouTube đi
      const remainingText = el.textContent.trim();
      if (!remainingText) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }

      // 4. Render khung GIF động mượt mà
      const parent = el.parentElement || el;
      matches.forEach(m => {
        const gifUrl = resolveGifUrl(m[1]);
        if (parent.querySelector(`img[data-memetube-src="${gifUrl}"]`)) return;

        const box = document.createElement('div');
        box.className = 'memetube-rendered-box';
        box.innerHTML = `
          <img src="${gifUrl}" data-memetube-src="${gifUrl}" class="memetube-rendered-gif"  loading="lazy" />
          <span class="memetube-badge">GIF</span>
        `;
        el.after(box);
      });
    });
  }

  // ==================== 8. GẮN NÚT VÀO YOUTUBE COMMENT BOX ====================
  function injectButtons() {
    document.querySelectorAll('ytd-commentbox').forEach(box => {
      const footer = box.querySelector('#footer');
      const editor = box.querySelector('#contenteditable-root');
      if (!footer || !editor || footer.querySelector('.memetube-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'memetube-btn';
      btn.innerHTML = '🔥 Meme / GIF Studio';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(editor);
      });

      const emoji = footer.querySelector('#emoji-button');
      if (emoji) emoji.after(btn);
      else footer.prepend(btn);
    });
  }

  const observer = new MutationObserver(() => {
    injectButtons();
    renderInlineGifs();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  setInterval(renderInlineGifs, 1500);
  injectButtons();
  renderInlineGifs();
})();
