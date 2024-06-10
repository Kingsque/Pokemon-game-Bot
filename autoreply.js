//auto reply 
        for (let anji of setik){
				if (budy === anji){
					result = fs.readFileSync(`./assets/sticker/${anji}.webp`)
					ScotchXd.sendMessage(m.chat, { sticker: result }, { quoted: m })
					}
			}
			for (let anju of vien){
				if (budy === anju){
					result = fs.readFileSync(`./assets/vn/${anju}.mp3`)
					ScotchXd.sendMessage(m.chat, { audio: result, mimetype: 'audio/mp4', ptt: true }, { quoted: m })     
					}
			}
			for (let anjh of imagi){
				if (budy === anjh){
					result = fs.readFileSync(`./assets/image/${anjh}.jpg`)
					ScotchXd.sendMessage(m.chat, { image: result }, { quoted: m })
					}
			}
					for (let anjh of videox){
				if (budy === anjh){
					result = fs.readFileSync(`./assets/vid/${anjh}.mp4`)
					ScotchXd.sendMessage(m.chat, { video: result }, { quoted: m })
					}
				  }
