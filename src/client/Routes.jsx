import React from 'react'
import Home from './components/Home'

const Routes = [
    {
        ...Home,
        path: '/',
        exact: true,
    }
]

export default Routes