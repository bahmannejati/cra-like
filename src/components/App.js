import React, {useState} from 'react'

import Header from './Header';
import './style.css';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import 'antd/es/button/style/css';


import Hello from './Hello';


const App = () => {
    const [counter, setCouter] = useState(0)
    return (
        <div>
            <Header />
            <Hello />
            <Button onClick={() => {setCouter(counter + 1)}}>دکمه {counter}</Button>
        </div>
    )
}

export default App