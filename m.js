const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const token = '6742681842:AAEuMzFWzHvBQAz82-8hzOZ0wv5GcY8uLfk';
const bot = new TelegramBot(token, { polling: true });

const serviceAccount = require("./Accountkey.json");

// Initialize Firebase app
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

bot.on('message', function(mg) {
    console.log(mg);
});

bot.on('message', function(mg) {
    request('http://www.omdbapi.com/?t='+mg.text+'&apikey=f2443c5e', function(err, responce, body) {
        if (err) {
            console.error('Error fetching movie data:', err);
            bot.sendMessage(mg.chat.id, 'Error fetching movie data: ' + err.message);
            return;
        }

        try {
            const movieData = JSON.parse(body);
            const actors = movieData.Actors;
            const genre = movieData.Genre;

            bot.sendMessage(mg.chat.id, 'Actors: ' + actors);
            bot.sendMessage(mg.chat.id, 'Genre: ' + genre);

            // Store movie data in Firestore
            db.collection('movies').add({
                Actors: actors,
                Genre: genre,
                userID: mg.from.id
            })
            .then(() => {
                console.log('Movie data stored successfully');
                bot.sendMessage(mg.chat.id, 'Movie data stored successfully');
            })
            .catch(error => {
                console.error('Error storing movie data:', error);
                bot.sendMessage(mg.chat.id, 'Error storing movie data: ' + error.message);
            });
        } catch (error) {
            console.error('Error parsing movie data:', error);
            bot.sendMessage(mg.chat.id, 'Error parsing movie data: ' + error.message);
        }
    });
});
