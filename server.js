import express from "express"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
import { musics } from './data.js'

mongoose.connect(
  'mongodb+srv://tanmayg2102:crud2@cluster2.ul4iomv.mongodb.net/music?retryWrites=true&w=majority'
).then(() => {
  console.log("MongoDB connected")
})
const musicSchema = new mongoose.Schema(
  {
    Song_name: String,
    Film_name: String,
    Music_Director: String,
    Singer: String,
    Actor: String,
    Actress: String
  }
);

const musicModel = mongoose.model('songdetails', musicSchema)

app.get('/addData', async (req, res) => {
  try {
    const data = await musicModel.insertMany(musics)
    res.send("Data inserted")
  } catch (error) {
    res.send(error)
  }
})

app.get("/data", async (req, res) => {
  try {
    const count = await musicModel.countDocuments();
    const musics = await musicModel.find()
    const musicdata = musics.map(md => {
      return `
      <tr>
      <td>${md.Film_name}</td>
      <td>${md.Music_Director}</td>
      <td>${md.Song_name}</td>
      <td>${md.Singer}</td>
      <td>${md.Actress}</td>
      <td>${md.Actor}</td>
      </tr>
      `
    })

    const table = `
    <table>
    <thead>
    <tr>
    <th>Film Name</th>
    <th>Music_Director</th>
    <th>Song_name</th>
    <th>Singer</th>
    <th>Actress</th>
    <th>Actor</th>
    </tr>
    </thead>
    <tbody>
    ${musicdata.join('')}
    </tbody>
    </table>
    `
    res.send(`No of music entries : ${count} <br><br> ${table}`)
  } catch (error) {
    res.send(error)
  }
})

// specified music director songs
app.get('/director/:name', async (req, res) => {
  try {
    const {name} = req.params
    const song = await musicModel.find({ Music_Director: name }, '-_id Song_name')
    res.send(`Songs directed by SH : ${song}`)
  } catch (error) {
    res.send(error)
  }
})

// f) List specified Music Director songs sung by specified Singer
app.get('/specified',async(req,res)=>{
  try {
    
    const song = await musicModel.find({
      Music_Director : 'SH',
      Singer : 'PG'
    },'-_id Song_name')

    res.send(song)
  } catch (error) {
    res.send(error)
  }
})

// g) Delete the song which you don’t like.
app.get('/delete',async(req,res)=>{
  try {
    const deletemusic = await musicModel.deleteOne({
      Song_name : 'C'
    })
    if(deletemusic)res.send('Deleted')
    else res.send('failed to delete')
  } catch (error) {
    res.send(error)
  }
})


// i) List Songs sung by Specified Singer from specified film.
app.get('/singerfilm',async(req,res)=>{
  try {
    const song = await musicModel.find({
      Singer : 'PG',
      Film_name : 'PKPK'
    })
    res.send(song)
  } catch (error) {
    res.send(error)
  }
})
app.listen(7000, () => {
  console.log("Server Connected")
})