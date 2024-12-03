const TelegramBot = require('node-telegram-bot-api'); 
const request = require('request');
const token = '6742681842:AAEuMzFWzHvBQAz82-8hzOZ0wv5GcY8uLfk';
const { getFirestore} = require('firebase-admin/firestore');
const bot = new TelegramBot(token, {polling: true});
const { initializeApp, cert } = require('firebase-admin/app');


var serviceAccount = require("./Accountkey.json");

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
    
bot.on('message', function(mg){
   console.log(mg) 
})

bot.on('message',function(mg){
    request('http://www.omdbapi.com/?t='+mg.text+'&apikey=f2443c5e', function(err, responce, body){
     const actors = JSON.parse(body).Actors 
     const gen = JSON.parse(body).Genre    
bot.sendMessage(mg.chat.id,actors)
bot.sendMessage(mg.chat.id,gen)
db.collection('movies').add({
    Actors:actors,
    Genere:gen,
    userID:mg.from.id
})

}).then(()=>{
  bot.sendMessage(" stored sucessfully ")
})
});