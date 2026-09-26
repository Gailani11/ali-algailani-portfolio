import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/chrome.css';
import './styles/home.css';
import './styles/chapters.css';
import './styles/pages.css';

document.documentElement.classList.add('js');
createRoot(document.getElementById('root')!).render(<App />);
