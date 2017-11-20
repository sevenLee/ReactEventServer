import 'babel-polyfill'
import io from 'socket.io';
import express from 'express'
import http from 'http'
import {matchRoutes} from 'react-router-config'
import {handleSSR, createServerStore} from './src/common/helper'
import Routes from './src/client/Routes'

const app = express();
const server = http.createServer(app)

let database = []


app.use(express.static('public'))
app.get('*', (req, res) => {
    console.log('@@ has req!!')
    const store = createServerStore()
    const promises = matchRoutes(Routes, req.path)
        .map(({ route }) => {
            return route.loadData ? route.loadData(store) : null;
        })
        .map(promise => {
            if (promise) {
                return new Promise((resolve) => {
                    promise.then(resolve).catch(resolve);
                });
            }
        });

    Promise.all(promises)
        .then(() => {
            if(database.length === 0){
                database = store.getState().events
            }else{
                // database.forEach()
            }
            res.send(handleSSR(req, store));
        })
})



const socket = io(server);
socket.on('connection', socket => {
    // socket.on('update-from-client', data => database.push(data));

    socket.on('disconnect', () => {
        console.log('@@@server disconnect')
        socket.emit('server-close');

    })
});

server.listen(3000, () => {
    console.log('Listening on 3000')
})

let i = 0;
setInterval(() => {
    i = i + 1
    const alertEvent = {
        id: i,
        name: `event_${i}`
    };
    database.push(alertEvent)
    console.log('server emit:', alertEvent)
    socket.emit('update-from-server', alertEvent);
}, 3000)