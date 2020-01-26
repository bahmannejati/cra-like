import React from 'react'

import Header from './Header';
import './style.css';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import 'antd/es/button/style/css';


import Hello from './Hello';


const App = () => {
    return (
        <div>
            <Header />
            <Hello />
            <Button>دکمه</Button>
        </div>
    )
}

export default App