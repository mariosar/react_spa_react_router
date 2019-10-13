import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.css';
import './index.scss';
import mario from './public/images/super_mario.png';

class App extends React.Component{
    render(){
        return(
            <div className={styles.appContainer}>
                <div className="dashed-class">Should be line-through</div>
                Hello World!
                <img src={mario} alt="Logo" />;
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
