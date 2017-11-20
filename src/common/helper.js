import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import { renderRoutes } from 'react-router-config'

import reducers from '../client/reducers'
import Routes from '../client/Routes'

export const createServerStore = () => {
    const store = createStore(reducers, {}, applyMiddleware(thunk))
    return store
}

export const handleSSR = (req, store) => {

    console.log('server side store:', store.getState())

    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.path} contex={{}}>
                <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
        </Provider>
    )
    const html = `
        <html>
            <head></head>
            <body>
                <div id="root"}>${content}</div>
                <script>
                  window.INITIAL_STATE = ${JSON.stringify(store.getState())}
                </script>
                <script src="bundle.js"></script>
            </body>
        </html>
    `

    return html
}