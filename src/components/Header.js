import React from 'react'

import svgIMG from "./quit.svg"

const Header = () => {
    return (
        <header>
            <ul>
                <li>
                    nav 1
                </li>
                <li>
                    nav 2
                </li>
            </ul>
            <img src={svgIMG} alt="HELLO" width={40} />
        </header>
    )   
}

export default Header