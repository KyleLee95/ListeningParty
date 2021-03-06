'use strict'

const db = require('../server/db')
const {User, Channel, Song, HistoricalPlayList} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const userArray = [
    {email: 'cody@email.com', password: '123'},
    {email: 'murphy@email.com', password: '123'},
    {
      email: 'steve@email.com',
      password: '123',
      firstName: 'Steve',
      lastName: 'Bonifas'
    },
    {
      email: 'kyle@email.com',
      password: '123',
      firstName: 'Kyle',
      lastName: 'Lee'
    },
    {
      email: 'alex@email.com',
      password: '123',
      firstName: 'Alex',
      lastName: 'Lee'
    }
  ]
  await User.bulkCreate(userArray)

  const channelArray = [
    {
      name: 'Chicago Blues',
      description: 'Lots of text describing the Chicago Blues Channel',
      ownerId: 3,
      imageURL:
        'http://www.experiencehendrixtour.com/images/venue_il_chicago.jpg'
    },
    {
      name: 'Smooth Jazz',
      description: 'Lots of text describing the Smooth Jazz Channel',
      ownerId: 2,
      imageURL:
        'https://lastfm-img2.akamaized.net/i/u/300x300/fe6b4fb54ed64405a80d430ac1259177.jpg'
    },
    {
      name: 'Hip Hop',
      description: 'Lots of text describing the Hip Hop Channel',
      ownerId: 4,
      imageURL:
        'https://images.sk-static.com/images/media/profile_images/artists/552177/huge_avatar'
    },
    {
      name: 'Modern Pop',
      description: 'Lots of text describing the Modern Pop Channel',
      ownerId: 1,
      imageURL:
        'https://a2-images.myspacecdn.com/images03/17/213d558a3adb4d1a9827f09d75ad4b19/300x300.jpg'
    },
    {
      name: 'Oldies',
      description: 'Lots of text describing the Oldies Channel',
      ownerId: 3,
      imageURL:
        'https://s3.amazonaws.com/gigsalad_media/s/surfinsafariband/5acfddf504039_300_sq'
    },
    {
      name: 'Rap',
      description: 'Lots of text describing the Rap Channel',
      ownerId: 4,
      imageURL:
        'https://i2.wp.com/thewestcoastlist.com/wp-content/uploads/2017/04/21-savage-tickets_05-02-17_58a5d8cc5fff4.jpg?resize=300%2C300'
    }
  ]
  await Channel.bulkCreate(channelArray)

  const users = await User.findAll()
  // const channels = await Channel.findAll()
  // await users[1].addFavoriteChannel(channels[1])
  // await users[2].addFavoriteChannel(channels[1])
  // await users[0].addFavoriteChannel(channels[1])
  // await users[1].addFavoriteChannel(channels[2])
  // await users[3].addFavoriteChannel(channels[2])
  // await users[4].addFavoriteChannel(channels[2])
  // await users[0].addFavoriteChannel(channels[2])
  // await users[2].addFavoriteChannel(channels[3])
  // await users[4].addFavoriteChannel(channels[3])
  // await users[2].addFavoriteChannel(channels[4])
  // await users[3].addFavoriteChannel(channels[4])
  // await users[4].addFavoriteChannel(channels[4])
  // await users[1].addFavoriteChannel(channels[5])
  // await users[2].addFavoriteChannel(channels[5])
  // await users[3].addFavoriteChannel(channels[5])
  // await users[0].addFavoriteChannel(channels[5])
  // await users[4].addFavoriteChannel(channels[6])
  // await users[1].addFavoriteChannel(channels[0])
  // await users[0].addFavoriteChannel(channels[0])

  // const importData = require('../public/data/music.json')
  // let songsArray = importData.map(record => {
  //   return {
  //     title: record.song.title,
  //     artist: record.artist.name,
  //     album: record.release.name,
  //     releaseYear: record.song.year,
  //     length: record.song.duration
  //   }
  // })

  // await Song.bulkCreate(songsArray)

  // const randomInt = (low, high) => {
  //   return Math.floor(Math.random() * (high - low) + low)
  // }

  // let historicalPlayListArray = []
  // for (let i = 1; i < 8; i++) {
  //   for (let j = 1; j < 51; j++) {
  //     historicalPlayListArray.push({channelId: i, songId: randomInt(1, 10000)})
  //   }
  // }

  // await HistoricalPlayList.bulkCreate(historicalPlayListArray)

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
