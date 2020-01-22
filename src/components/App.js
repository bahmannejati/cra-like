import React from 'react'

import Header from './Header';
import './style.css';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import 'antd/es/button/style/css';


const App = () => {
    return (
        <div>
            <Header />
            <Button>دکمه</Button>
        </div>
    )
}

export default App