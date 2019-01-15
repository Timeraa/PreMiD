var playback = false,
videoTitle,
videoAuthor,
videoTimestamps,
playbackBoolean,
smallImageKey,
smallImageText,
urlForVideo,
lastURL = null

/**
 * Handles Media Key controls
 * @param {data} data Data passed by socketConnector.js
 */
async function handleMediaKeys(data) {
  if(playback) {
    switch (data.mediaKeys) {
      case "pause":
        playbackBoolean ? $(".light-player").pause() : $(".light-player").play()
        break
    }
  }
}

/**
 * Updates the Presence data and sends it back
 * to the background.js for further interaction
 */
async function updateData() {
  urlForVideo = document.location.href;
  
  playback = $(".light-player") != undefined ? true : false
  console.log(playback)

  //* If page has all required propertys
  if(playback) {
    if (urlForVideo != lastURL) {
      lastURL = urlForVideo;
      startTimeStamp = Math.floor(Date.now() / 1000);
    }

    videoTitle = $(".stream-title span").innerHTML;
    videoAuthor = $('.profile-header h2').innerHTML;
    playbackBoolean = !$(".light-player").paused;
    smallImageKey = playbackBoolean ? 'play' : 'pause'
    smallImageText = playbackBoolean ? await getString("presence.playback.playing") : await getString("presence.playback.paused")

    var data = {
      clientID: '501021996336021504',
      presenceData: {
        details: "teste",
        state: "teste",
        largeImageKey: 'twitch_lg',
        largeImageText: chrome.runtime.getManifest().name + ' V' + chrome.runtime.getManifest().version,
        smallImageKey: smallImageKey,
        smallImageText: smallImageText,
      },
      trayTitle: $('<div/>').html(videoTitle).text(),
      playback: playbackBoolean,
      service: 'Mixer'
    }

    if(playbackBoolean) {
      data.presenceData.startTimestamp = startTimeStamp
    } else {
      delete data.presenceData.startTimestamp
    }

    chrome.runtime.sendMessage({presence: data})
  }
}