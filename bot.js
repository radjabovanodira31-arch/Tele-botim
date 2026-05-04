import { Telegraf, session, Markup, Scenes } from 'telegraf';
import dotenv from 'dotenv';
import http from 'http';

// .env faylidan o'zgaruvchilarni o'qish
dotenv.config();

const { BOT_TOKEN, ADMIN_CHAT_ID } = process.env;

// Token tekshiruvi
if (!BOT_TOKEN || BOT_TOKEN === 'bu_yerdagi_yozuv_orniga_bot_tokenni_yozing') {
    console.error("XATO: BOT_TOKEN topilmadi! Iltimos, .env faylini ochib bot tokenini kiriting.");
    process.exit(1);
}

// Bot obyekti
const bot = new Telegraf(BOT_TOKEN);

// --- MA'LUMOTLAR BAZASI (Xotirada saqlash uchun) ---
// Haqiqiy loyihalarda MongoDB yoki PostgreSQL kabi ma'lumotlar bazasidan foydalanish tavsiya etiladi.
const db = {
    users: 0,
    orders: 0
};

// --- MAHSULOTLAR RO'YXATI ---
// Rasmlar o'rniga namuna rasm linklari kiritilgan, ishlatishdan oldin o'zgartirib olish mumkin.
const products = {
    kits: [
        { id: 'kit1', name: "Klara to'plami", price: 150000, img: "./images/Klara_ to'plami.jpg.jpg" },
        { id: 'kit2', name: "Alisa to'plami", price: 160000, img: "./images/Alisa_ to'plami.jpg.jpg" },
        { id: 'kit3', name: "Zara to'plami", price: 150000, img: "./images/Zara to'plami.jpg" },
        { id: 'kit4', name: "Ella to'plami", price: 150000, img: "./images/Ella_ to'plami..jpg" },
        { id: 'kit5', name: "Ro'za to'plami", price: 150000, img: "./images/Ro'za to'plami.jpg" },
        { id: 'kit6', name: "Liza to'plami", price: 350000, img: "./images/Liza to'plami.jpg" }
    ],
    matolar: [
        { id: 'mat1', name: "Kukolniy trikotaj 0.5 - yarim metr", price: 35000, img: "./images/kukolniy trikotaj.jpg" },
        { id: 'mat2', name: "2 talik Alisa uchun to'plam matolari + furnitura", price: 55000, img: "./images/Alisa_ uchun_  mato_ to'plam.jpg.jpg" },
        { id: 'mat3', name: "Klara uchun to'plam matosi + furnitura", price: 45000, img: "./images/Klara_ uchun_ to'plam_ matolari.jpg.jpg" },
        { id: 'mat4', name: "Zara uchun to'plam matosi + furnitura", price: 45000, img: "./images/Zara uchu to'plam matolari.jpg" },
        { id: 'mat5', name: "Roza uchun to'plam matosi + furnitura", price: 45000, img: "./images/Ro'za uchun to'plam matolari.jpg" },
        { id: 'mat6', name: "Ella uchun to'plam matosi + furnitura", price: 40000, img: "./images/Ella_uchun_toplam_matolari.jpg.jpg" }
    ],
    sochlar: [
        { id: 'soch1', name: "To'q jigarrang 25 smli sochlar", price: 23000, img: "./images/to'q jigarrang 25 smli.jpg" },
        { id: 'soch2', name: "Kashtan rangli 25 smli sochlar", price: 23000, img: "./images/kashtan_ rangli_ 25_ smli_ sochlar.jpg.jpg" },
        { id: 'soch3', name: "Sariq soch 25 sm", price: 23000, img: "./images/25_ smli_ sariqsoch.jpg.jpg" },
        { id: 'soch4', name: "To'q jigarrang 15 smli", price: 18000, img: "./images/toq jigarrang 15 smli.jpg" },
        { id: 'soch5', name: "Sariq soch 15 smli", price: 18000, img: "./images/sariq soch 15 smli.jpg" },
        { id: 'soch6', name: "To'q jigarrang soch 5 smli", price: 12000, img: "./images/to'q jigarrang soch 5 smli.jpg" },
        { id: 'soch7', name: "To'q kashtan soch 5 smli", price: 12000, img: "./images/to'q kashtan 5 smli.jpg" },
        { id: 'soch8', name: "Pushti soch 25 smli", price: 23000, img: "./images/pushti soch 25 smli.jpg" },
        { id: 'soch9', name: "Siyoxrang soch 25 smli", price: 23000, img: "./images/siyoxrang soch.jpg" },
        { id: 'soch10', name: "To'lqin kashtan soch 20 sm", price: 25000, img: "./images/to'lqin kashtan soch 20 sm.jpg" },
        { id: 'soch11', name: "To'lqin russiy 15 smli", price: 20000, img: "./images/to'lqin russiy15 smli.jpg" },
        { id: 'soch12', name: "Lokon kashtan rang, 15 sm", price: 25000, img: "./images/lokon kashtan 15 smli.jpg" }
    ],
    oyoq_kiyim: [
        { id: 'oyoq1', name: "5 smli och pushti keda", price: 20000, img: "./images/och pushti keda.jpg" },
        { id: 'oyoq2', name: "To'q pushti keda", price: 20000, img: "./images/to'q pushti keda.jpg" },
        { id: 'oyoq3', name: "Qora keda", price: 20000, img: "./images/qora keda.jpg" },
        { id: 'oyoq4', name: "Havorang keda", price: 20000, img: "./images/xavorang keda.jpg" },
        { id: 'oyoq5', name: "Keda siyoxrang", price: 20000, img: "./images/siyoxrang keda.jpg" },
        { id: 'oyoq6', name: "Sandal 5,5 smli, pushti", price: 25000, img: "./images/sandal.jpg" }
    ],
    aksessuar: [
        { id: 'aks1', name: "Tugmacha 18 mmli", price: 300, img: "./images/tugmacha 18 mmli.jpg" },
        { id: 'aks2', name: "Tugmacha 12 mmli", price: 200, img: "./images/tugmacha 12 mmli.jpg" },
        { id: 'aks3', name: "Remen regulyator", price: 1000, img: "./images/remen regulyator.jpg" },
        { id: 'aks4', name: "Qora ko'z 8 mmli (1 pachka)", price: 6000, img: "./images/qora ko'z 8 mm.jpg" },
        { id: 'aks5', name: "Qora ko'z 4 mmli (1 pachka)", price: 5000, img: "./images/qora ko'z 4mm.jpg" },
        { id: 'aks6', name: "Kipriklar 8 mmli", price: 13000, img: "./images/kipriklar.jpg.jpg" },
        { id: 'aks7', name: "Metall knopka sumka uchun", price: 1000, img: "./images/metal knopka sumka uchun.jpg" },
        { id: 'aks8', name: "Termonakleyka 12sm ga - 12sm", price: 12000, img: "./images/termonakleyka web.jpg" },
        { id: 'aks9', name: "Ko'zli yuz termonakleykasi (dona)", price: 3000, img: "./images/ko'zli yuz.jpg" },
        { id: 'aks10', name: "Kiprikli yuz", price: 3000, img: "./images/kiprikli_ yuz.jpg.jpg" },
        { id: 'aks11', name: "Jung igna 9 smli", price: 1500, img: "./images/jung_ igna_ 9 sm.jpg.jpg" },
        { id: 'aks12', name: "Oq jung 50 gr", price: 35000, img: "./images/oq jung 50 gram.jpg" },
        { id: 'aks13', name: "Dermantin 30x30 sm havorang + pushti 2 ta", price: 18000, img: "./images/dermantin.jpg.jpg" },
        { id: 'aks14', name: "Zanjir 3 mmli (1 metr)", price: 4000, img: "./images/zanjir.jpg" },
        { id: 'aks15', name: "Metal knopka (sarafan uchun, 1 jufti)", price: 4000, img: "./images/metal knopka sarafan uchun.jpg" },
        { id: 'aks16', name: "Oq quyoncha 6 smli", price: 9000, img: "./images/oq quyoncha.jpg" },
        { id: 'aks17', name: "Xalqa 6 mmli 1 pachka", price: 9000, img: "./images/xalqa 6 mm.jpg" }
    ]
};

// Barcha mahsulotlarni bitta massivda saqlab olish (savatni hisoblashda oson bo'lishi uchun)
const allProducts = [
    ...products.kits, ...products.matolar, ...products.sochlar, 
    ...products.oyoq_kiyim, ...products.aksessuar
];

// Asosiy menyu (Klaviaturadagi tugmalar)
const mainMenu = Markup.keyboard([
    ['🎁 Bepul darslik', '🧸 To\'plamlar'],
    ['🛍 Kerakli mahsulotlar', '🛒 Savat'],
    ['📦 Buyurtma berish', '❓ Savollar'],
    ['📞 Bog\'lanish']
]).resize();

// "Kerakli mahsulotlar" osti menyusi
const materialsMenu = Markup.keyboard([
    ['🪡 Matolar', '💇‍♀️ Sochlar'],
    ['👟 Oyoq kiyimlar', '🎀 Aksessuarlar'],
    ['⬅️ Asosiy menyu']
]).resize();

// --- BUYURTMA BERISH SCENE (Bosqichma-bosqich so'rovnomasi) ---
const orderWizard = new Scenes.WizardScene(
    'order-wizard',
    // 1-qadam: Ismni so'rash
    (ctx) => {
        ctx.reply("Iltimos, ismingizni kiriting:", Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    // 2-qadam: Telefon raqam
    (ctx) => {
        ctx.wizard.state.name = ctx.message.text;
        ctx.reply("Iltimos, telefon raqamingizni kiriting:\n(Masalan: +998901234567)");
        return ctx.wizard.next();
    },
    // 3-qadam: To'plam yoki nima kerakligini so'rash (Izoh)
    (ctx) => {
        ctx.wizard.state.phone = ctx.message.text;
        ctx.reply("Qaysi to'plam kerak? yoki Qo'shimcha izohingizni yozib qoldiring:");
        return ctx.wizard.next();
    },
    // 4-qadam: Yakuniy tasdiq va Adminga yuborish
    async (ctx) => {
        ctx.wizard.state.comment = ctx.message.text;
        
        // Savatni o'qish
        const cart = ctx.session?.cart || {};
        let orderText = `📦 *YANGI BUYURTMA* \n\n`;
        orderText += `👤 *Ism:* ${ctx.wizard.state.name}\n`;
        orderText += `📞 *Telefon:* ${ctx.wizard.state.phone}\n`;
        orderText += `📝 *Izoh:* ${ctx.wizard.state.comment}\n\n`;
        
        let total = 0;
        let cartItemsText = `*Xarid qilingan narsalar (Savatdan):*\n`;
        for (let [id, qty] of Object.entries(cart)) {
            let item = allProducts.find(p => p.id === id);
            if (item) {
                let sum = item.price * qty;
                cartItemsText += `- ${item.name} | ${qty} x ${item.price} = ${sum} so'm\n`;
                total += sum;
            }
        }
        
        if (Object.keys(cart).length === 0) {
            cartItemsText += "Xaridorning savati bo'sh. Faqatgina izoh yozilgan.\n";
        } else {
            orderText += cartItemsText;
            orderText += `\n💰 *Umumiy summa:* ${total} so'm`;
        }
        
        // Adminga xabar yuborish qismi
        try {
            if(ADMIN_CHAT_ID && ADMIN_CHAT_ID !== 'bu_yerdagi_yozuv_orniga_telegram_id_yozing') {
                await bot.telegram.sendMessage(ADMIN_CHAT_ID, orderText, { parse_mode: 'Markdown' });
            }
            db.orders += 1; // Ma'lumotlar bazasida(xotira) buyurtmani bittaga oshiramiz
            
            ctx.reply("Buyurtmangiz qabul qilindi! Tez orada aloqaga chiqamiz.", mainMenu);
            
            // Buyurtma berilgach, savatni bo'shatamiz
            ctx.session.cart = {}; 
        } catch (error) {
            ctx.reply("Kechirasiz, xatolik yuz berdi. Iltimos qayta urinib ko'ring yoki adminga to'g'ridan-to'g'ri yozing.", mainMenu);
            console.error("Adminga xabar yuborishda xato:", error);
        }
        
        return ctx.scene.leave(); // Sahnadan chiqish
    }
);

// Sahnani ishga tushirish uchun Stage ga qo'shamiz
const stage = new Scenes.Stage([orderWizard]);

// Session va Stage middleware'larni botga ulaymiz
bot.use(session());
bot.use(stage.middleware());

// Har safar foydalanuvchi ishlatsa, agar savati bo'lmasa uni bo'sh obyekt qilib yaratib qoyish
bot.use((ctx, next) => {
    if (!ctx.session) ctx.session = {};
    if (!ctx.session.cart) ctx.session.cart = {};
    return next();
});


// --- ASOSIY BUYRUQLAR ---

// "/start" buyrug'i - botga kirganda ishlaydi
bot.start((ctx) => {
    db.users += 1; // Foydalanuvchilar sonini oshirish
    ctx.reply(`Salom ${ctx.from.first_name || ''}! Bizning qo'g'irchoqlar va mahsulotlar do'konimizga xush kelibsiz.\nQuyidagi menyudan kerakli bo'limni tanlang:`, mainMenu);
});

// "/admin" buyrug'i - Faqat admin ishlata oladi
bot.command('admin', (ctx) => {
    if (ctx.from.id.toString() === ADMIN_CHAT_ID) {
         ctx.reply(`📊 *Admin Statistika:*\n\n👥 Botdan foydalanganlar soni (taxminiy): ${db.users}\n📦 Jami qabul qilingan buyurtmalar: ${db.orders}`, {parse_mode: 'Markdown'});
    } else {
         ctx.reply("Sizda admin huquqlari yo'q.");
    }
});


// --- MENYU TUGMALARI ISHLASHI ---

// 1. Bepul darslik
bot.hears('🎁 Bepul darslik', async (ctx) => {
    const text = `Salom! 7 yillik hunarmand master sifatida, ijodkorlikka qiziqish bildirayotganligingizdan hursandman! Marhamat bepul darslikni oling.`;
    const photoUrl = './images/master.jpg'; // Shu yerga o'zingizning rasmingizni images papkasiga tashlab nomini yozing
    
    // Rasm va tugma (Inline keyboard) bilan yuborish
    try {
        await ctx.replyWithPhoto(
            { source: photoUrl }, 
            {
                caption: text,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '▶️ Darslikni ko\'rish', url: 'https://t.me/master_tkaniart/543' }]
                    ]
                }
            }
        );
    } catch (e) {
        console.error("Bepul darslik rasmini jo'natishda xato: ", e);
        // Agar rasm xato bersa, matnning o'zini yuboradi
        ctx.reply(text, Markup.inlineKeyboard([
            Markup.button.url('▶️ Darslikni ko\'rish', 'https://t.me/master_tkaniart/543')
        ]));
    }
});

// Tugmalarni yasovchi yordamchi funksiya
function getProductKeyboard(itemId, cart) {
    const qty = cart[itemId] || 0;
    return {
        inline_keyboard: [
            [
                {text: '➖', callback_data: `minus_${itemId}`},
                {text: `${qty} ta`, callback_data: `noop`},
                {text: '➕', callback_data: `plus_${itemId}`}
            ]
        ]
    };
}

// 2. To'plamlar
bot.hears('🧸 To\'plamlar', async (ctx) => {
    await ctx.reply("6 xil qo’g’irchoq tikish to’plamlarimiz bor:");
    for (let kit of products.kits) {
        try {
            await ctx.replyWithPhoto({source: kit.img}, {
                caption: `📦 *${kit.name}*\n💰 Narxi: ${kit.price} so'm`,
                parse_mode: 'Markdown',
                reply_markup: getProductKeyboard(kit.id, ctx.session.cart || {})
            });
        } catch(e) {
            console.error("Rasm yuborishda xato (To'plamlar): ", e.message);
            // Agar rasm yuborib bo'lmasa shunchaki yozuv yuboradi
            await ctx.reply(`📦 *${kit.name}*\n💰 Narxi: ${kit.price} so'm`, {
                parse_mode: 'Markdown',
                reply_markup: getProductKeyboard(kit.id, ctx.session.cart || {})
            });
        }
    }
});

// 3. Kerakli mahsulotlar (Kategoriya bo'limi)
bot.hears('🛍 Kerakli mahsulotlar', (ctx) => {
    ctx.reply("Qaysi turdagi mahsulot kerak?", materialsMenu);
});

// Yordamchi funksiya: Kategoriya bo'yicha mahsulotlarni bot orqali ko'rsatish
async function sendCategoryProducts(ctx, categoryArray) {
    for (let item of categoryArray) {
         try {
             await ctx.replyWithPhoto({source: item.img}, {
                caption: `🔹 *${item.name}*\n💰 Narxi: ${item.price} so'm`,
                parse_mode: 'Markdown',
                reply_markup: getProductKeyboard(item.id, ctx.session.cart || {})
            });
         } catch(e) {
             console.error("Rasm yuborishda xato: ", e.message);
             await ctx.reply(`🔹 *${item.name}*\n💰 Narxi: ${item.price} so'm`, {
                parse_mode: 'Markdown',
                reply_markup: getProductKeyboard(item.id, ctx.session.cart || {})
            });
         }
    }
}

// Kerakli mahsulotlar > Matolar
bot.hears('🪡 Matolar', async (ctx) => {
    await sendCategoryProducts(ctx, products.matolar);
});

// Kerakli mahsulotlar > Sochlar
bot.hears('💇‍♀️ Sochlar', async (ctx) => {
    await sendCategoryProducts(ctx, products.sochlar);
});

// Kerakli mahsulotlar > Oyoq kiyimlar
bot.hears('👟 Oyoq kiyimlar', async (ctx) => {
    await sendCategoryProducts(ctx, products.oyoq_kiyim);
});

// Kerakli mahsulotlar > Aksessuarlar
bot.hears('🎀 Aksessuarlar', async (ctx) => {
    await sendCategoryProducts(ctx, products.aksessuar);
});

// Orqaga (Asosiy menyuga qaytish)
bot.hears('⬅️ Asosiy menyu', (ctx) => {
    ctx.reply("Asosiy menyu:", mainMenu);
});


// Tugmani bosish (Savatga qo'shish jarayoni - PLUS)
bot.action(/plus_(.+)/, async (ctx) => {
    const itemId = ctx.match[1];
    if(!ctx.session.cart) ctx.session.cart = {};
    if (ctx.session.cart[itemId]) {
        ctx.session.cart[itemId] += 1;
    } else {
        ctx.session.cart[itemId] = 1;
    }
    
    try {
        await ctx.editMessageReplyMarkup(getProductKeyboard(itemId, ctx.session.cart));
    } catch(e) {}
    
    await ctx.answerCbQuery();
});

// Tugmani bosish (Savatdan ayirish jarayoni - MINUS)
bot.action(/minus_(.+)/, async (ctx) => {
    const itemId = ctx.match[1];
    if(!ctx.session.cart) ctx.session.cart = {};
    if (ctx.session.cart[itemId] && ctx.session.cart[itemId] > 0) {
        ctx.session.cart[itemId] -= 1;
        if(ctx.session.cart[itemId] === 0) {
            delete ctx.session.cart[itemId];
        }
    }
    
    try {
        await ctx.editMessageReplyMarkup(getProductKeyboard(itemId, ctx.session.cart));
    } catch(e) {}
    
    await ctx.answerCbQuery();
});

// O'rtadagi sonni bossa hech narsa qilmasligi uchun
bot.action('noop', async (ctx) => {
    await ctx.answerCbQuery();
});

// 4. Savatni ko'rish
bot.hears('🛒 Savat', (ctx) => {
    const cart = ctx.session.cart || {};
    if (Object.keys(cart).length === 0) {
        return ctx.reply("Sizning savatingiz hozircha bo'sh.");
    }

    let text = "🛒 *Sizning savatingiz:*\n\n";
    let total = 0;

    for (let [id, qty] of Object.entries(cart)) {
        let item = allProducts.find(p => p.id === id);
        if (item) {
            let sum = item.price * qty;
            text += `🔸 *${item.name}*\n`;
            text += `${qty} dona x ${item.price} = ${sum} so'm\n\n`;
            total += sum;
        }
    }

    text += `💰 *Umumiy summa:* ${total} so'm`;

    ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{text: "🗑 Savatni tozalash", callback_data: "clear_cart"}],
                [{text: "📦 Buyurtma berish", callback_data: "checkout"}]
            ]
        }
    });
});

// Savatni tozalash (Inline tugma)
bot.action('clear_cart', async (ctx) => {
    ctx.session.cart = {};
    await ctx.editMessageText("Savat tozalandi! 🗑");
    await ctx.answerCbQuery();
});

// Savatdan to'g'ridan to'g'ri buyurtma berish qismiga o'tish (Inline tugma)
bot.action('checkout', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.scene.enter('order-wizard');
});

// 5. Buyurtma berish (To'g'ridan to'g'ri tugma)
bot.hears('📦 Buyurtma berish', (ctx) => {
    ctx.scene.enter('order-wizard');
});


// 6. Savollar
bot.hears('❓ Savollar', (ctx) => {
    const faq = `❓ *Ko'p beriladigan savollar:*\n\n` +
    `💬 "Video darsliklar qanday formatda bo'ladi?"\n` +
    `✅ Onlayn formatda\n\n` +
    `💬 "Qanday uslubda olish mumkin?"\n` +
    `✅ Toshkent bo'ylab Yandex orqali\n` +
    `✅ Viloyatlar bo'ylab 1 kundan 3 kungacha BTS pochta orqali.\n\n` +
    `💬 "To'lov usuli qanday?"\n` +
    `✅ Karta orqali oldindan to'lov.`;

    ctx.reply(faq, {parse_mode: 'Markdown'});
});

// 7. Bog'lanish
bot.hears('📞 Bog\'lanish', (ctx) => {
    const contacts = `📞 *Biz bilan bog'lanish:*\n\n` +
    `🔵 Telegram: @Nodira_Abdullaevna\n` +
    `📱 Telefon: +998950589181\n` +
    `⏰ Ish vaqti: 09:00 - 18:00`;

    ctx.reply(contacts, {parse_mode: 'Markdown'});
});

// Botni ishga tushirish (xatolarni ushlash bilan birga)
bot.launch().then(() => {
    console.log("===============================");
    console.log("✅ Bot muvaffaqiyatli ishga tushdi!");
    console.log("===============================");
}).catch((err) => {
    console.error("Bot ishga tushishda xatolik:", err);
});

// Node process to'xtaganda (masalan CTRL+C bosganda) botni to'xtatish
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Railway va boshqa bulutli xizmatlar xatolik bermasligi (portni kutib qotib qolmasligi) uchun
// kichik veb-server ochib qo'yamiz.
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running...');
}).listen(PORT, () => {
    console.log(`Port tinglanmoqda: ${PORT} (Railway uchun)`);
});
