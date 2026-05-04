import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

async function test() {
    try {
        console.log("Testing file existence...");
        const imgPath = "./images/Klara_ to'plami..jpg";
        if (fs.existsSync(imgPath)) {
            console.log("File exists!");
        } else {
            console.log("File DOES NOT exist!");
        }
        
        console.log("Attempting to send message to admin...");
        await bot.telegram.sendPhoto(process.env.ADMIN_CHAT_ID, { source: imgPath });
        console.log("Successfully sent photo!");
    } catch (e) {
        console.error("Error sending photo:", e);
    }
}

test();
