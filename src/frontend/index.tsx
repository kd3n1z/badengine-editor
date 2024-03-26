import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/fonts/BlinkMacSystemFont/stylesheet.css';
import './styles/index.css';
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab);

dom.i2svg();

const root = createRoot(document.getElementById("react-root"));
root.render(
    <App />
);