# Handmade Shop Telegram Bot

Ushbu bot Node.js va Telegraf kutubxonasi yordamida yaratilgan. Bot orqali mijozlar qo'g'irchoq to'plamlari va kerakli materiallarni harid qilishlari, savatga qo'shishlari va buyurtma berishlari mumkin.

## Ishga tushirish uchun qadamlar:

1. **Node.js o'rnatilganligini tekshiring.**
   Kompyuteringizda Node.js dasturi o'rnatilgan bo'lishi kerak.

2. **Kutubxonalarni o'rnatish:**
   Terminalda (yoki CMD da) ushbu papkaga kirib quyidagi buyruqni kiriting:
   ```bash
   npm install
   ```
   *(Agar PowerShell da xatolik bersa, `cmd.exe /c npm install` deb yozib ko'ring)*

3. **Sozlamalarni kiritish (.env):**
   Ushbu papkada `.env` fayli mavjud, uni ochib o'z botingiz ma'lumotlarini kiritishingiz kerak:
   - `BOT_TOKEN`: BotFather orqali olgan tokeningiz.
   - `ADMIN_CHAT_ID`: O'zingizning Telegram ID raqamingiz. (Buni bilish uchun Telegramda @userinfobot kabi botlardan foydalanib o'z IDingizni olishingiz mumkin).

4. **Botni ishga tushirish:**
   Terminalda quyidagi buyruqni kiriting:
   ```bash
   npm start
   ```

5. **Rasmlar ko'rinishi bo'yicha muhim eslatma:**
   Botdagi rasmlar to'g'ri ko'rinishi uchun `bot.js` faylidagi barcha `img` qismlaridagi linklarni haqiqiy rasmlar linkiga o'zgartiring. Hozirda barcha to'plam va matolarda yozuvli namuna (placeholder) rasmlar qo'yilgan. O'zingizning haqiqiy rasmlaringizni qo'yish uchun:
   - Telegramga (masalan, o'zingizga) rasmni yuborib, o'sha rasmning ustiga o'ng tugmani bosib URL linkini olib qo'yishingiz mumkin.
   - Yoki telegraph.ph ga rasmni yuklab linkini ishlating.
   - E'tibor bering, har doim ishonchli (telegraf, google photos h.k) URL manzillaridan foydalaning.

## Imkoniyatlar:
- Bepul darslik olish
- Turli xil to'plamlar, matolar, sochlar, oyoq kiyim va aksessuarlarni ko'rish
- Savat tizimi (buyumlarni savatda yig'ish va jami narxni avtomatik hisoblash)
- Bot ichidan to'g'ridan to'g'ri buyurtma berish
- Adminga bot xabar yuborishi
- Ko'p beriladigan savollar va Bog'lanish menyulari
