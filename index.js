const mongoose = require("mongoose")
const path = require("path")
const config = require(path.join(__dirname, "./config.js"))
const gateDom = require("./modules/html-parser")
const telegram = require("./modules/telegram.js")
const Startup = require("./models/Startup")

async function start() {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const startups = await fetchStarpups()

    /////////////////////// новый стартап
    const gateActivStartups = await gateDom.fetchActiveStartaps()
    for (gateActivStartup of gateActivStartups) {
      const st = startups.find((s) => s.name === gateActivStartup.name)
      //если  активный и нет в базе
      if (!st) {
        telegram.sendImgByURL(gateActivStartup.src, gateActivStartup.title)
        await saveStarpup(gateActivStartup)
      }
    }
    ////////////////////////

    const newlisteds = await gateDom.fetchNewlisted()
    if (newlisteds.length && startups.length) {
      for (let startup of startups) {
        const newlisted = newlisteds.find(
          (n) => n.name.trim() === startup.name.trim()
        )
        if (newlisted) {
          if (checkTime(newlisted.time)) {
            telegram.sendMessage(
              `in 10 minutes trading on ${newlisted.name} will start`
            )
            await Startup.deleteOne({ _id: startup._id })
          } else {
            console.log("wait start ", newlisted.name)
          }
        }
      }
    }
  } catch (e) {
    console.log("Server Error", e.message)
  }
}

start()
console.log('start')
setInterval(() => {
  console.log("start")
  start()
}, 600000)

async function fetchStarpups() {
  return await Startup.find()
}

async function saveStarpup(startup) {
  const newStartup = new Startup({ name: startup.name })

  return await newStartup.save()
}

function checkTime(startupStart, i = 10) {
  const myDate = "Oct 13, 2010"
  const start = new Date(myDate + " " + startupStart)
  const end = new Date(myDate + " " + "00:00:00")

  return start.setMinutes(start.getMinutes() - i) <= end
}

// getStartups()
//await Post.deleteOne({_id: req.params.id})
