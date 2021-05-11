import Main from './components/Main';
import Sidebar from './components/Sidebar';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div style={{display:"flex"}}>
            <Sidebar/>
                <Main />
        </div>
    )
}

export default App;
