import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Identity } from './pages/Identity';
import { Frames } from './pages/Frames';
import { Adjust } from './pages/Adjust';
import { Result } from './pages/Result';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { AppProvider } from './store/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="identity" element={<Identity />} />
            <Route path="frames" element={<Frames />} />
            <Route path="adjust" element={<Adjust />} />
            <Route path="result" element={<Result />} />
            <Route path="about" element={<About />} />
            <Route path="gallery" element={<Gallery />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
