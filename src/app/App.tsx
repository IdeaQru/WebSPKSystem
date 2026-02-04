import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './components/DashboardPage';
import { DataKriteria } from './components/DataKriteria';
import { DataAlternatif } from './components/DataAlternatif';
import { HasilPerhitungan } from './components/HasilPerhitungan';
import { PengaturanPage } from './components/PengaturanPage';
import { Kriteria, Alternatif } from './utils/profileMatching';
import { Loader2 } from 'lucide-react';

// Data dummy awal
const initialKriteria: Kriteria[] = [
  { id: 'K1', nama: 'Kompetensi Teknis', bobot: 25, targetValue: 4, jenis: 'core' },
  { id: 'K2', nama: 'Pengalaman Kerja', bobot: 20, targetValue: 3, jenis: 'core' },
  { id: 'K3', nama: 'Sikap Kerja', bobot: 20, targetValue: 4, jenis: 'core' },
  { id: 'K4', nama: 'Kemampuan Komunikasi', bobot: 15, targetValue: 4, jenis: 'secondary' },
  { id: 'K5', nama: 'Kepemimpinan', bobot: 10, targetValue: 3, jenis: 'secondary' },
  { id: 'K6', nama: 'Kreativitas', bobot: 10, targetValue: 3, jenis: 'secondary' },
];

const initialAlternatif: Alternatif[] = [
  {
    id: 'A1',
    nama: 'Ahmad Ridwan',
    jabatan: 'Senior Developer',
    nilai: { K1: 4, K2: 4, K3: 5, K4: 4, K5: 3, K6: 4 },
  },
  {
    id: 'A2',
    nama: 'Siti Nurhaliza',
    jabatan: 'Project Manager',
    nilai: { K1: 3, K2: 5, K3: 4, K4: 5, K5: 4, K6: 3 },
  },
  {
    id: 'A3',
    nama: 'Budi Santoso',
    jabatan: 'UI/UX Designer',
    nilai: { K1: 3, K2: 2, K3: 4, K4: 4, K5: 2, K6: 5 },
  },
  {
    id: 'A4',
    nama: 'Dewi Lestari',
    jabatan: 'Business Analyst',
    nilai: { K1: 4, K2: 3, K3: 5, K4: 5, K5: 4, K6: 4 },
  },
];

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [kriteria, setKriteria] = useState<Kriteria[]>(initialKriteria);
  const [alternatif, setAlternatif] = useState<Alternatif[]>(initialAlternatif);
  const [loading, setLoading] = useState(true);

  // Load data dari localStorage
  useEffect(() => {
    const savedKriteria = localStorage.getItem('kriteria');
    const savedAlternatif = localStorage.getItem('alternatif');

    if (savedKriteria) {
      setKriteria(JSON.parse(savedKriteria));
    }
    if (savedAlternatif) {
      setAlternatif(JSON.parse(savedAlternatif));
    }

    // Simulasi loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Save data ke localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('kriteria', JSON.stringify(kriteria));
      localStorage.setItem('alternatif', JSON.stringify(alternatif));
    }
  }, [kriteria, alternatif, loading]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      );
    }

    switch (activeMenu) {
      case 'dashboard':
        return <DashboardPage kriteria={kriteria} alternatif={alternatif} />;
      case 'kriteria':
        return <DataKriteria kriteria={kriteria} onUpdate={setKriteria} />;
      case 'alternatif':
        return <DataAlternatif alternatif={alternatif} kriteria={kriteria} onUpdate={setAlternatif} />;
      case 'hasil':
        return <HasilPerhitungan alternatif={alternatif} kriteria={kriteria} />;
      case 'pengaturan':
        return <PengaturanPage />;
      default:
        return <DashboardPage kriteria={kriteria} alternatif={alternatif} />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-background font-['Inter',sans-serif]">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            
            {/* Content Area */}
            <main className="flex-1 p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-4 px-6">
              <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
                <p>© 2026 SPK Profile Matching. All rights reserved.</p>
                <p>Built with React & Tailwind CSS</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
