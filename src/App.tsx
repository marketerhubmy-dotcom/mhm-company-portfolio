import { Route, Routes } from 'react-router';
import { SiteLayout } from '@/layouts/SiteLayout';
import HomePage from '@/pages/HomePage';
import WorkPage from '@/pages/WorkPage';
import ProjectPage from '@/pages/ProjectPage';
import ServicesPage from '@/pages/ServicesPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="kerja" element={<WorkPage />} />
        <Route path="kerja/:slug" element={<ProjectPage />} />
        <Route path="servis" element={<ServicesPage />} />
        <Route path="tentang" element={<AboutPage />} />
        <Route path="hubungi" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
