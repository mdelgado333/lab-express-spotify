require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/artist-search',(req,res)=>{
    const {artist}=req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists);
            res.render('artist-search-results', {data})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id',(req,res) =>{
    const {id} = req.params
    console.log('holaaaaaaaaaaaaaaaa',id)
    spotifyApi
        .getArtistAlbums(id)
        .then(dataAlbums => {
            console.log('The received data from the API: ', dataAlbums.body.items)
            res.render('albums',{dataAlbums})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req,res)=>{
    const {id} = req.params
    spotifyApi
        .getAlbumTracks(id)
        .then(dataTracks => {
            console.log('The received data from the API: ', dataTracks.body)
            // res.render('',{dataTracks})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
