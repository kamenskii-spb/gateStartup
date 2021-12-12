process.env.NTBA_FIX_319 = 1
const TelegramBot = require("node-telegram-bot-api")
const path = require("path")

const config = require(path.join(__dirname, "../config.js"))
const chatId = "-1001412114934"

const token = process.env.TOKEN ?? config.TOKEN

const bot = new TelegramBot(token, {
  polling: false,
})


const sendMessage = async (message = "") => {
    try {
      await bot.sendMessage(chatId, message)
    } catch (error) {
      console.log("node-telegram-bot-api error")
    }
  }


  const sendImgByURL = async (src, descripton = '') => {

    var request = require('request');

    var pic_stream = request.get(src).on('error', function(err) { console.log(err); });

    bot.sendPhoto(chatId, pic_stream, { caption: descripton, parse_mode : "HTML" }); 

  }




module.exports = {sendMessage, sendImgByURL}





