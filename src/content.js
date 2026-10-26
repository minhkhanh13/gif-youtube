// MemeTube Pro v7 - International Edition (EN & VI)
(() => {
  let activeEditor = null;
  let currentTab = 'gif';
  let currentAsciiCat = 'all';

  // ==================== 0. INTERNATIONALIZATION (i18n) ====================
  // Tự động nhận diện ngôn ngữ: Nếu trình duyệt/YouTube là tiếng Việt thì dùng VI, còn lại mặc định tiếng Anh (EN)
  let currentLang = 'en';
  try {
    const pageLang = (document.documentElement.lang || navigator.language || '').toLowerCase();
    if (pageLang.startsWith('vi')) currentLang = 'vi';
  } catch (e) {}

  chrome.storage.local.get('memetube_lang').then(res => {
    if (res && res.memetube_lang) currentLang = res.memetube_lang;
  });

  const I18N = {
    en: {
      btnText: '🔥 Meme / GIF Studio',
      title: '✨ MemeTube Pro Studio',
      langToggle: '🌐 EN',
      tabGif: '🎬 Tenor GIFs',
      tabAscii: '🗿 ASCII Memes',
      tabKao: 'UwU Kaomoji',
      tabStudio: '🎨 Image to Art',
      gifTip: '💡 <b>Tip:</b> Click any GIF to insert. The animated GIF will play smoothly right inside YouTube comments!',
      asciiTip: '🔥 <b>Visible to Everyone:</b> 100% visible on mobile & desktop without needing any extensions!',
      searchPlaceholder: '🔍 Search millions of Tenor GIFs (e.g. cat, dance, haha, anime)...',
      loadingGifs: '⏳ Loading GIFs from Tenor...',
      noGifsFound: 'No GIFs found. Try another search!',
      asciiCats: ['All', 'Cats & Pets', 'Top Memes', 'Gaming & Anime', 'Signs & Badges'],
      studioDrop: '📁 Click or drop any image / meme from your computer',
      studioDesc: 'Automatically converts your image into high-detail Unicode Braille art ready for YouTube comments!',
      studioWidth: 'Width:',
      studioInvert: 'Invert brightness',
      studioPlaceholder: 'No image selected yet...',
      studioInsert: '🚀 Insert Art Into Comment',
      gifTags: ['Trending 🔥', 'Cat Meme 🐱', 'Anime Dance 💃', 'Laughing 😂', 'Shocked 😱', 'Crying 😭', 'Clapping 👏', 'Gaming 🎮', 'Sigma 🗿'],
      naturalPhrases: [
        'Great video, loved this part! 🔥',
        'This part was so funny haha 😂',
        '10/10 content, absolute cinema 🙌',
        "Can't stop rewatching this! 👍",
        'Such high quality content ❤️',
        'That ending was unexpected! 🤣',
        'Quality video as always ✨',
        'Amazing edit right here 👏'
      ]
    },
    vi: {
      btnText: '🔥 Meme / GIF Studio',
      title: '✨ MemeTube Pro Studio',
      langToggle: '🇻🇳 VI',
      tabGif: '🎬 Kho GIF Tenor',
      tabAscii: '🗿 35+ Tranh Ký Tự',
      tabKao: 'UwU 60+ Kaomoji',
      tabStudio: '🎨 Tạo Ảnh -> Chữ',
      gifTip: '💡 <b>Mẹo:</b> Click vào GIF để gửi. Ảnh GIF động sẽ phát mượt mà ngay trong bình luận YouTube!',
      asciiTip: '🔥 <b>Ai cũng nhìn thấy:</b> 100% người dùng trên điện thoại & máy tính đều thấy ngay lập tức!',
      searchPlaceholder: '🔍 Tìm hàng triệu ảnh GIF từ Tenor (VD: cat, haha, anime, dance)...',
      loadingGifs: '⏳ Đang tải kho GIF từ Tenor...',
      noGifsFound: 'Không tìm thấy GIF nào. Hãy thử từ khóa khác!',
      asciiCats: ['Tất cả', 'Mèo & Động Vật', 'Meme Chúa', 'Game & Anime', 'Biển Báo & VIP'],
      studioDrop: '📁 Bấm vào đây để chọn bất kỳ ảnh Meme nào từ máy tính',
      studioDesc: 'Tự động biến bức ảnh của bạn thành tranh ký tự siêu nét để comment lên YouTube!',
      studioWidth: 'Độ rộng:',
      studioInvert: 'Đảo ngược sáng/tối',
      studioPlaceholder: 'Chưa có ảnh nào được chọn...',
      studioInsert: '🚀 Chèn Bức Tranh Này Vào Bình Luận',
      gifTags: ['Thịnh hành 🔥', 'Meme Mèo 🐱', 'Anime Dance 💃', 'Cười bể bụng 😂', 'Bất ngờ 😱', 'Khóc thét 😭', 'Vỗ tay 👏', 'Gaming 🎮', 'Sigma 🗿'],
      naturalPhrases: [
        'Video cuốn thực sự kkk',
        'Đoạn này hài vcl 😂',
        'Đỉnh nóc kịch trần luôn 🔥',
        'Cười xỉu đoạn này 🤣',
        'Xem đi xem lại vẫn thấy hay 👍',
        '10 điểm không có nhưng ✨',
        'Hay quá ad ơi ❤️',
        'Đoạn cuối bất ngờ thật sự',
        'Nội dung chất lượng ghê'
      ]
    }
  };

  const t = () => I18N[currentLang] || I18N.en;

  // ==================== 1. KHO 29+ TRANH KÝ TỰ FULL SIZE ====================
  const ASCII_CAT_MAP = {
    'all': { en: 'All', vi: 'Tất cả' },
    'Mèo & Động Vật': { en: 'Cats & Pets', vi: 'Mèo & Động Vật' },
    'Meme Chúa': { en: 'Top Memes', vi: 'Meme Chúa' },
    'Game & Anime': { en: 'Gaming & Anime', vi: 'Game & Anime' },
    'Biển Báo & VIP': { en: 'Signs & Badges', vi: 'Biển Báo & VIP' }
  };

  const ASCII_MEMES = [
    {
      name: 'Pop Cat (Full Body)',
      cat: 'Mèo & Động Vật',
      art: `      /\\_/\\\n     ( o.o )\n     (  O  )  POP! POP! POP!\n      / | \\\n     (__|__)`
    },
    {
      name: 'Smug Cat (Full Detail)',
      cat: 'Mèo & Động Vật',
      art: `　　　　　／＞　　フ\n　　　　　| 　_　 _ l\n　 　　　／\` ミ＿xノ\n　　 　 /　　　 　 |\n　　　 /　 ヽ　　 ﾉ\n　 　 │　　|　|　|\n／￣|　　 |　|　|\n| (￣ヽ＿_ヽ_)__)\n＼二つ`
    },
    {
      name: 'Doge Shiba Legend',
      cat: 'Mèo & Động Vật',
      art: `  ░░░░░░░░░░░░░░░\n  ░░░░▄▄▄▄▄▄░░░░░\n  ░░▄█████████▄░░\n  ░███▀█▀█▀████░░\n  ░███▄█▄█▄████░░\n  ░░▀█████████▀░░\n  ░░░░░░░░░░░░░░░\n  much wow, such comment!`
    },
    {
      name: 'Gun Cat Give Me Likes',
      cat: 'Mèo & Động Vật',
      art: `      /\\_/\\\n     ( •_• )▄︻デ══━一\n     / >   \\  Drop a like right now!\n    (__|__)`
    },
    {
      name: 'Sleeping Cat',
      cat: 'Mèo & Động Vật',
      art: `         |\\__/,|   (\`\\\n       _.|o o  |_   ) )\n     -(((---(((--------`
    },
    {
      name: 'Capybara Orange Chill',
      cat: 'Mèo & Động Vật',
      art: `        🍊\n       (￣(工)￣)\n      /|   |   |\\\n     ( |   |   | )  Ok I pull up~\n      (___(___)__)`
    },
    {
      name: 'Cheems Doge Bonked',
      cat: 'Mèo & Động Vật',
      art: `       \\\n        \\    /\\_/\\\n       BONK ( >_< )\n            /     \\\n           (__|__)`
    },
    {
      name: 'Bongo Cat Playing Drums',
      cat: 'Mèo & Động Vật',
      art: `         /\\_/\\\n        ( •ω• )\n      ┏━∪━━━∪━┓\n      ┃ 🥁 🥁 ┃  Badum tss!\n      ┗━━━━━━━┛`
    },
    {
      name: 'GigaChad Sigma',
      cat: 'Meme Chúa',
      art: `⠀⠀⠀⢀⣴⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠈⢿⣿⡟⠀⠀⠀⠀⢀⣀⣤⣄\n⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⣴⣿⣿⣿⣿\n⠀⠀⠀⠀⢸⣿⣇⣀⣀⣀⣈⣉⣛⡛⠃\n⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆\n🗿 Average YouTube Enjoyer`
    },
    {
      name: 'Moai Stone Face 🗿',
      cat: 'Meme Chúa',
      art: `⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣶⣶⣶⣶⣶⣶⣶⣦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀\n⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀\n⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀\n⠀⠀⠀⠀⠀⠉⠙⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠛⠋⠉⠀⠀⠀⠀\nBruh 🗿`
    },
    {
      name: 'Trollface Classic',
      cat: 'Meme Chúa',
      art: `  ░░░░░▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄▄▄▄░░░░░░░\n  ░░░░█░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░▀▀▄░░░░\n  ░░░█░░░▒▒▒▒▒▒░░░░░░░░▒▒▒░░█░░░\n  ░░█░░░░░░▄██▀▄▄░░░░░▄▄▄░░░░█░░\n  ░▀▒░▄▄▄▒░█▀▀▀▀▄▄█░░▀▄▄▄█░░░▒▀░\n  ░░░░░░░░░░Problem?░░░░░░░░░░░░`
    },
    {
      name: 'Pepe The Frog Happy',
      cat: 'Meme Chúa',
      art: `    .-'''''-.\n  .'   .-.   '.\n /   /\`   \`\\   \\\n|   | (o) (o) |   |\n|   |   .     |   |\n \\   \\  '---' /   /\n  '.  \`'---'\`  .'\n    '-._____.-'\n   Feels Good Man!`
    },
    {
      name: 'Stonks Graph High',
      cat: 'Meme Chúa',
      art: `          😎     📈\n         /|\\   /\n         / \\  /   STONKS!\n       ──────`
    },
    {
      name: 'Absolute Cinema 🙌',
      cat: 'Meme Chúa',
      art: `           🙌\n         ( •_•)\n        /|  |\\\n        ABSOLUTE\n         CINEMA`
    },
    {
      name: 'UNO Reverse Card',
      cat: 'Meme Chúa',
      art: `┌─────────┐\n│ 🔄      │\n│         │\n│ REVERSE │\n│  CARD   │\n│         │\n│      🔄 │\n└─────────┘`
    },
    {
      name: 'Spider-Man Pointing 👉👈',
      cat: 'Meme Chúa',
      art: `    ( •_•) 👉      👈 (•_• )\n   <)   )╯          ╰(   (>\n    /   \\            /   \\`
    },
    {
      name: 'Among Us Crewmate Sus',
      cat: 'Game & Anime',
      art: `  ⣠⣤⣤⣤⣤⣤⣄⡀\n ⣴⣿⣿⣿⣿⣿⣿⣿⣷⡀\n ⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n ⣿⣿⡟⠋⠁⠀⠀⠈⢻⡇\n ⣿⣿⣷⣄⡀⠀⠀⢀⣼⡇\n ⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n ⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n ⢿⣿⣿⣿⠏⠹⣿⣿⣿⠇\n   SUS! 📮`
    },
    {
      name: 'Minecraft Creeper Face',
      cat: 'Game & Anime',
      art: `████████\n█░░██░░█\n█░░██░░█\n███░░███\n██░░░░██\n██░░░░██\n██░██░██\n  Tsssss... 💥`
    },
    {
      name: 'Surprised Pikachu',
      cat: 'Game & Anime',
      art: `   ⚡️   /\\__/\\\n       ( ° o ° )\n      /|   |   |\\\n     ( |   |   | )  Nani?!\n      (___(___)__)`
    },
    {
      name: 'Chiikawa Tea Time',
      cat: 'Game & Anime',
      art: `      ( ˶ˆᗜˆ˵ )\n     (つ 🍵 ⊂)\n    Here is some tea for you,\n    Enjoy the video!`
    },
    {
      name: 'Anya Forger Smug Heh',
      cat: 'Game & Anime',
      art: `       /\\___/\\\n      ( 𓁹 ‿ 𓁹 )\n     /|   |   |\\\n       Heh...`
    },
    {
      name: 'Press F To Pay Respects',
      cat: 'Game & Anime',
      art: `███████╗\n██╔════╝\n█████╗░░\n██╔══╝░░\n██║░░░░░\n╚═╝░░░░░`
    },
    {
      name: 'Dark Souls: YOU DIED',
      cat: 'Game & Anime',
      art: `═════════════════════\n     Y O U   D I E D\n═════════════════════`
    },
    {
      name: 'Heavy Tank Artillery',
      cat: 'Biển Báo & VIP',
      art: `      ░░░░░░███████ ]▄▄▄▄▄▄▄▄\n ▂▄▅█████████▅▄▃▂\nI███████████████████].\n  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤...`
    },
    {
      name: 'VIP Front Row Ticket',
      cat: 'Biển Báo & VIP',
      art: `🎫━━━━━━━ VIP TICKET ━━━━━━━🎫\n┃ Earliest Viewer Pass       ┃\n┃ Seat: Front Row 🍿         ┃\n🎫━━━━━━━━━━━━━━━━━━━━━━━━━━━🎫`
    },
    {
      name: 'Bunny Holding Great Video Sign',
      cat: 'Biển Báo & VIP',
      art: ` (\\(\\ \n ( -.-) \n o_(")(")\n┌────────────────────┐\n│ Truly a masterpiece│\n└────────────────────┘`
    },
    {
      name: 'Like Police Officer',
      cat: 'Biển Báo & VIP',
      art: `  👮‍♂️📢 STOP RIGHT THERE!\n  ┌───────────────────────┐\n  │ Violation: Watching   │\n  │ without hitting Like  │\n  └───────────────────────┘`
    },
    {
      name: 'Popcorn Watching Drama',
      cat: 'Biển Báo & VIP',
      art: `   🍿🍿🍿\n  ┌──────┐\n  │DRAMA │  Here for the comment section!\n  └──────┘`
    },
    {
      name: 'Masterpiece Certificate 10/10',
      cat: 'Biển Báo & VIP',
      art: `🏆════════════════════🏆\n  CERTIFIED MASTERPIECE\n       10/10 Content!\n🏆════════════════════🏆`
    }
  ];

  // ==================== 2. KHO 36+ KAOMOJI ====================
  const KAOMOJIS = [
    { k: "(╯°□°）╯︵ ┻━┻", d: "Table Flip" },
    { k: "┬─┬ノ( º _ ºノ)", d: "Put Table Back" },
    { k: "┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻", d: "Rage Double Flip" },
    { k: "¯\\_(ツ)_/¯", d: "Shrug" },
    { k: "( ͡° ͜ʖ ͡°)", d: "Lenny Face" },
    { k: "( ˶ˆᗜˆ˵ )", d: "Happy Smile" },
    { k: "(っ˘ω˘ς ) ❤️", d: "Warm Hug" },
    { k: "(╬ Ò﹏Ó)", d: "Angry Steam" },
    { k: "(╥﹏╥)", d: "Crying Hard" },
    { k: "(っ˘̩╭╮˘̩)っ", d: "Need A Hug" },
    { k: "(ง'̀-'́)ง", d: "Fist Fight" },
    { k: "ᕙ(⇀‸↼‶)ᕗ", d: "Flexing Muscles" },
    { k: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", d: "Magic Sparkles" },
    { k: "(☞ﾟヮﾟ)☞", d: "Pointing Right" },
    { k: "☜(ﾟヮﾟ☜)", d: "Pointing Left" },
    { k: "(づ｡◕‿‿◕｡)づ", d: "Big Hug" },
    { k: "( •_•)>⌐■-■", d: "Puts On Glasses" },
    { k: "(⌐■_■)", d: "Cool Shades" },
    { k: "(⊙_⊙)", d: "Shocked Stare" },
    { k: "(°ロ°) !", d: "Mind Blown" },
    { k: "(¬‿¬)", d: "Smirking" },
    { k: "(¬_¬)", d: "Side Eye" },
    { k: "( ´･･)ﾉ(._.`) ", d: "Pat Pat Head" },
    { k: "ヾ(≧▽≦*)o", d: "Excited Wave" },
    { k: "o(*￣▽￣*)ブ", d: "Cheerful Hello" },
    { k: "(￣y▽,￣)╭ ", d: "Chuckle" },
    { k: "♪(^∇^*)", d: "Dancing To Beat" },
    { k: "ヾ(⌐■_■)ノ♪", d: "Cool DJ Party" },
    { k: "(∪.∪ )...zzz", d: "Sleeping Zzz" },
    { k: "( ´ཀ` )", d: "Dead From Cinema" },
    { k: "🙏 ( ˘ω˘ ) 🙏", d: "Praying In Peace" },
    { k: "(/_ _)/ 🏆", d: "Bowing To Trophy" },
    { k: "(つ✧ω✧)つ 💵", d: "Shut Up Take My Money" },
    { k: "ʕ•́ᴥ•̀ʔっ ❤️", d: "Cute Bear Heart" },
    { k: "=^._.^= ∫", d: "Cat Tail Wag" },
    { k: "(V)(°,,,,°)(V)", d: "Zoidberg Crab" }
  ];

  // ==================== 3. MODAL UI BUILDER (INTERNATIONAL) ====================
  let modalOverlay = null;

  function createModal() {
    if (modalOverlay) return;

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'memetube-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="memetube-modal">
        <div class="memetube-header">
          <div class="memetube-title">${t().title}</div>
          <div class="memetube-header-actions">
            <button class="memetube-lang-btn" id="memetube-lang-btn" title="Switch Language / Đổi ngôn ngữ">${t().langToggle}</button>
            <button class="memetube-close-btn" title="Close / Đóng">&times;</button>
          </div>
        </div>

        <div class="memetube-tabs">
          <button class="memetube-tab-btn active" data-tab="gif">${t().tabGif}</button>
          <button class="memetube-tab-btn" data-tab="ascii">${t().tabAscii}</button>
          <button class="memetube-tab-btn" data-tab="kao">${t().tabKao}</button>
          <button class="memetube-tab-btn" data-tab="studio">${t().tabStudio}</button>
        </div>

        <div class="memetube-subcats" id="subcats-gif"></div>
        <div class="memetube-subcats" id="subcats-ascii" style="display:none;"></div>

        <div class="memetube-search-wrap" id="memetube-search-wrap">
          <input type="text" class="memetube-search-input" placeholder="${t().searchPlaceholder}" />
        </div>

        <div class="memetube-content">
          <!-- TAB 1: GIF -->
          <div class="memetube-tab-pane active" id="pane-gif">
            <div class="memetube-tip-banner" id="tip-gif">${t().gifTip}</div>
            <div class="memetube-gif-grid" id="gif-grid"></div>
          </div>

          <!-- TAB 2: ASCII -->
          <div class="memetube-tab-pane" id="pane-ascii">
            <div class="memetube-tip-banner" id="tip-ascii">${t().asciiTip}</div>
            <div class="memetube-ascii-grid" id="ascii-grid"></div>
          </div>

          <!-- TAB 3: KAOMOJI -->
          <div class="memetube-tab-pane" id="pane-kao">
            <div class="memetube-kao-grid" id="kao-grid"></div>
          </div>

          <!-- TAB 4: STUDIO -->
          <div class="memetube-tab-pane" id="pane-studio">
            <div class="memetube-studio">
              <label class="memetube-dropzone" id="studio-dropzone">
                <input type="file" id="studio-file" accept="image/*" style="display:none;" />
                <div style="font-size:14px; font-weight:700; color:#ff6688;" id="studio-drop-text">${t().studioDrop}</div>
                <div style="font-size:11px; color:#888; margin-top:4px;" id="studio-desc-text">${t().studioDesc}</div>
              </label>
              <div class="memetube-studio-controls">
                <label><span id="studio-w-label">${t().studioWidth}</span> <input type="range" id="studio-width" min="15" max="42" value="32" /></label>
                <label><input type="checkbox" id="studio-invert" /> <span id="studio-inv-label">${t().studioInvert}</span></label>
              </div>
              <pre class="memetube-studio-preview" id="studio-preview">${t().studioPlaceholder}</pre>
              <button class="memetube-insert-studio-btn" id="studio-insert-btn">${t().studioInsert}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Event listeners
    modalOverlay.querySelector('.memetube-close-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Language Toggle Listener
    const langBtn = modalOverlay.querySelector('#memetube-lang-btn');
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'vi' : 'en';
      chrome.storage.local.set({ memetube_lang: currentLang });
      updateModalLanguage();
    });

    modalOverlay.addEventListener('keydown', (e) => e.stopPropagation());
    modalOverlay.addEventListener('keyup', (e) => e.stopPropagation());

    // Tab Switching
    const tabs = modalOverlay.querySelectorAll('.memetube-tab-btn');
    const searchWrap = modalOverlay.querySelector('#memetube-search-wrap');
    const subGif = modalOverlay.querySelector('#subcats-gif');
    const subAscii = modalOverlay.querySelector('#subcats-ascii');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(tEl => tEl.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;

        modalOverlay.querySelectorAll('.memetube-tab-pane').forEach(p => p.classList.remove('active'));
        modalOverlay.querySelector(`#pane-${currentTab}`).classList.add('active');

        subGif.style.display = currentTab === 'gif' ? 'flex' : 'none';
        subAscii.style.display = currentTab === 'ascii' ? 'flex' : 'none';
        searchWrap.style.display = currentTab === 'gif' ? 'block' : 'none';
      });
    });

    // Search input
    const searchInput = modalOverlay.querySelector('.memetube-search-input');
    let timer = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadGifs(searchInput.value), 350);
    });

    renderSubcategories();
    renderAsciiGrid();
    renderKaomojiGrid();
    setupImageStudio();
  }

  function updateModalLanguage() {
    if (!modalOverlay) return;
    const langBtn = modalOverlay.querySelector('#memetube-lang-btn');
    langBtn.textContent = t().langToggle;
    modalOverlay.querySelector('.memetube-title').textContent = t().title;

    // Tabs
    const tabBtns = modalOverlay.querySelectorAll('.memetube-tab-btn');
    tabBtns[0].textContent = t().tabGif;
    tabBtns[1].textContent = t().tabAscii;
    tabBtns[2].textContent = t().tabKao;
    tabBtns[3].textContent = t().tabStudio;

    // Tips & Search
    modalOverlay.querySelector('#tip-gif').innerHTML = t().gifTip;
    modalOverlay.querySelector('#tip-ascii').innerHTML = t().asciiTip;
    modalOverlay.querySelector('.memetube-search-input').placeholder = t().searchPlaceholder;

    // Studio labels
    modalOverlay.querySelector('#studio-drop-text').textContent = t().studioDrop;
    modalOverlay.querySelector('#studio-desc-text').textContent = t().studioDesc;
    modalOverlay.querySelector('#studio-w-label').textContent = t().studioWidth;
    modalOverlay.querySelector('#studio-inv-label').textContent = t().studioInvert;
    modalOverlay.querySelector('#studio-insert-btn').textContent = t().studioInsert;

    renderSubcategories();
    renderAsciiGrid();
  }

  function renderSubcategories() {
    // Render GIF Subcategories
    const subGif = modalOverlay.querySelector('#subcats-gif');
    subGif.innerHTML = '';
    t().gifTags.forEach((tag, idx) => {
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

    // Render ASCII Subcategories
    const subAscii = modalOverlay.querySelector('#subcats-ascii');
    subAscii.innerHTML = '';
    const internalKeys = ['all', 'Mèo & Động Vật', 'Meme Chúa', 'Game & Anime', 'Biển Báo & VIP'];
    internalKeys.forEach((key, idx) => {
      const label = ASCII_CAT_MAP[key][currentLang];
      const btn = document.createElement('button');
      btn.className = 'memetube-pill' + (currentAsciiCat === key ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        subAscii.querySelectorAll('.memetube-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAsciiCat = key;
        renderAsciiGrid();
      });
      subAscii.appendChild(btn);
    });
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
      const catLabel = ASCII_CAT_MAP[item.cat] ? ASCII_CAT_MAP[item.cat][currentLang] : item.cat;
      card.innerHTML = `
        <div class="ascii-name"><span>${item.name}</span><span class="ascii-cat">${catLabel}</span></div>
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
    const m = url.match(/tenor\.com\/([^/?#]+)\/([^/?#]+?)\.gif/i);
    if (m) return `${m[1]}/${m[2]}`;
    return url;
  }

  function loadGifs(query) {
    const grid = modalOverlay.querySelector('#gif-grid');
    grid.innerHTML = `<div style="grid-column:span 3;text-align:center;padding:40px;color:#888;">${t().loadingGifs}</div>`;

    chrome.runtime.sendMessage({ type: 'search-gif', query }, (res) => {
      if (!res || !res.ok || !res.gifs || !res.gifs.length) {
        grid.innerHTML = `<div style="grid-column:span 3;text-align:center;padding:40px;color:#ff6666;">${t().noGifsFound}</div>`;
        return;
      }
      grid.innerHTML = '';
      res.gifs.forEach(gif => {
        const item = document.createElement('div');
        item.className = 'memetube-gif-item';
        item.innerHTML = `
          <img src="${gif.preview}" alt="${gif.title}" loading="lazy" />
          <div class="gif-title">${gif.title}</div>
        `;
        item.addEventListener('click', () => {
          insertGifStealth(gif.url);
          closeModal();
        });
        grid.appendChild(item);
      });
    });
  }

  // ==================== 5. STUDIO CHUYỂN ẢNH SANG BRAILLE ART ====================
  function setupImageStudio() {
    const fileInput = modalOverlay.querySelector('#studio-file');
    const widthInput = modalOverlay.querySelector('#studio-width');
    const invertInput = modalOverlay.querySelector('#studio-invert');
    const previewEl = modalOverlay.querySelector('#studio-preview');
    const insertBtn = modalOverlay.querySelector('#studio-insert-btn');
    let currentImg = null;

    function convertToBraille() {
      if (!currentImg) return;
      const charW = parseInt(widthInput.value, 10) || 32;
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
      if (art && !art.startsWith('Chưa') && !art.startsWith('No image')) {
        insertTextToEditor(art + '\n');
        closeModal();
      }
    });
  }

  // ==================== 6. CHÈN TEXT VÀO YOUTUBE COMMENT BOX ====================
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

    // ==================== CÔNG NGHỆ TÀNG HÌNH ZERO-WIDTH STEALTH ====================
  // Mã hóa mã GIF thành chuỗi ký tự tàng hình tuyệt đối (Zero-Width Characters)
  // KHÔNG CHÈN BẤT KỲ CÂU CHỮ GIẢ NÀO VÀO Ô NHẬP BÌNH LUẬN!
  function encodeToZeroWidth(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      let b = text.charCodeAt(i).toString(2);
      binary += '00000000'.slice(b.length) + b;
    }
    let zw = '';
    for (let i = 0; i < binary.length; i++) {
      zw += binary[i] === '0' ? '\u200B' : '\u200C';
    }
    return '\u200D' + zw + '\u200D';
  }

  function decodeFromZeroWidth(text) {
    const match = text.match(/\u200D([\u200B\u200C]+)\u200D/);
    if (!match) return null;
    const binary = match[1].replace(/\u200B/g, '0').replace(/\u200C/g, '1');
    let decoded = '';
    for (let i = 0; i < binary.length; i += 8) {
      decoded += String.fromCharCode(parseInt(binary.slice(i, i + 8), 2));
    }
    return decoded;
  }

  // Chèn GIF vào ô nhập:
  // CHỈ chèn mã tàng hình, TUYỆT ĐỐI KHÔNG chèn câu giả ("That ending was unexpected!" hay câu khen nhảm nhí)
  // Người dùng gõ bình luận gì thì bình luận đó giữ nguyên 100%!
  function insertGifStealth(gifUrl) {
    if (!activeEditor || !activeEditor.isConnected) return;
    const shortCode = extractShortTenorCode(gifUrl);
    const hiddenCode = encodeToZeroWidth(shortCode);

    // Chèn mã tàng hình vào ô nhập
    insertTextToEditor(hiddenCode);

    // Hiển thị một badge nhỏ bên cạnh nút Meme để người dùng biết GIF đã được đính kèm thành công
    const box = activeEditor.closest('ytd-commentbox');
    if (box) {
      let badge = box.querySelector('.memetube-attached-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'memetube-attached-badge';
        const btn = box.querySelector('.memetube-btn');
        if (btn) btn.after(badge);
      }
      badge.textContent = '✅ Attached GIF';
      badge.style.display = 'inline-block';
    }
  }

  function getGifRegex() {
    return /\[(?:🎬\s*)?gif:\s*([^\s\]]+)\]/gi;
  }

  function resolveGifUrl(rawCode) {
    const clean = rawCode.replace(/<[^>]*>/g, '').replace(/^(AUT|USR)\|/, '').trim();
    if (/^https?:\/\//i.test(clean)) return clean;
    return `https://media.tenor.com/${clean}.gif`;
  }

  // ==================== 7. HIỂN THỊ INLINE GIF & GIỮ NGUYÊN COMMENT CỦA USER ====================
  function renderInlineGifs() {
    const commentNodes = document.querySelectorAll('#content-text:not([data-memetube-done="true"])');
    commentNodes.forEach(el => {
      const textContent = el.textContent || '';
      
      const hasZeroWidth = /\u200D[\u200B\u200C]+\u200D/.test(textContent);
      const hasOldTag = /\[(?:🎬\s*)?gif:/i.test(textContent);

      if (!hasZeroWidth && !hasOldTag) return;

      let gifUrls = [];

      // 1. Giải mã dạng tàng hình (Zero-Width)
      if (hasZeroWidth) {
        const decoded = decodeFromZeroWidth(textContent);
        if (decoded) {
          gifUrls.push(resolveGifUrl(decoded));
        }

        // Xóa sạch chuỗi ký tự tàng hình khỏi nội dung text hiển thị
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) textNodes.push(n);
        textNodes.forEach(node => {
          if (/[\u200B-\u200D]/.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(/\u200D[\u200B\u200C]+\u200D|[\u200B-\u200D]/g, '').trim();
          }
        });
      }

      // 2. Giải mã dạng cũ [gif:...] nếu có
      if (hasOldTag) {
        const matches = [...textContent.matchAll(getGifRegex())];
        matches.forEach(m => gifUrls.push(resolveGifUrl(m[1])));

        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) textNodes.push(n);
        textNodes.forEach(node => {
          if (/\[(?:🎬\s*)?gif:/i.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(/\[(?:🎬\s*)?gif:\s*([^\s\]]+)\]/gi, '').trim();
          }
        });
        el.querySelectorAll('span, a').forEach(child => {
          if (/\[(?:🎬\s*)?gif:/i.test(child.textContent)) {
            child.textContent = child.textContent.replace(/\[(?:🎬\s*)?gif:\s*([^\s\]]+)\]/gi, '').trim();
          }
        });
      }

      if (gifUrls.length === 0) return;

      el.setAttribute('data-memetube-done', 'true');

      // 3. KIỂM TRA BÌNH LUẬN CỦA USER:
      // Dọn sạch khoảng trắng dư thừa
      const remainingText = el.textContent.trim();

      if (!remainingText) {
        // Nếu user KHÔNG gõ chữ gì (chỉ gửi mỗi GIF): ẩn dòng trống để không bị khoảng trắng thừa
        el.style.setProperty('display', 'none', 'important');
        const expander = el.closest('#expander, ytd-expander');
        if (expander) expander.style.setProperty('display', 'none', 'important');
      } else {
        // NẾU USER CÓ GÕ COMMENT (ví dụ: "hay vcl"): GIỮ NGUYÊN 100%, KHÔNG ĐƯỢC ẨN!
        el.style.removeProperty('display');
        const expander = el.closest('#expander, ytd-expander');
        if (expander) expander.style.removeProperty('display');
      }

      // 4. Render khung ảnh GIF động bo góc mượt mà bên dưới bình luận
      const parent = el.parentElement || el;
      gifUrls.forEach(url => {
        if (parent.querySelector(`img[data-memetube-src="${url}"]`)) return;

        const box = document.createElement('div');
        box.className = 'memetube-rendered-box';
        box.innerHTML = `
          <img src="${url}" data-memetube-src="${url}" class="memetube-rendered-gif" referrerpolicy="no-referrer" loading="lazy" />
          <span class="memetube-badge">GIF</span>
        `;
        const insertAfterTarget = el.closest('#expander, ytd-expander') || el;
        insertAfterTarget.after(box);
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
      btn.innerHTML = t().btnText;
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
