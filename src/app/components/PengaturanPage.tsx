import { Save, RefreshCw, Database, FileText } from 'lucide-react';
import { useState } from 'react';

export function PengaturanPage() {
  const [persenCore, setPersenCore] = useState(60);
  const [persenSecondary, setPersenSecondary] = useState(40);

  const handleSave = () => {
    // Simpan ke localStorage
    localStorage.setItem('persenCore', persenCore.toString());
    localStorage.setItem('persenSecondary', persenSecondary.toString());
    alert('Pengaturan berhasil disimpan!');
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset data ke default?')) {
      localStorage.clear();
      setPersenCore(60);
      setPersenSecondary(40);
      alert('Data berhasil direset! Silakan refresh halaman.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-foreground mb-2">Pengaturan Sistem</h1>
        <p className="text-muted-foreground text-sm">
          Konfigurasi parameter Profile Matching
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bobot Faktor */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Bobot Faktor</h3>
              <p className="text-xs text-muted-foreground">Atur persentase Core & Secondary Factor</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Core Factor (%)
                </label>
                <span className="text-sm font-semibold text-blue-600">
                  {persenCore}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={persenCore}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPersenCore(value);
                  setPersenSecondary(100 - value);
                }}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Secondary Factor (%)
                </label>
                <span className="text-sm font-semibold text-indigo-600">
                  {persenSecondary}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={persenSecondary}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPersenSecondary(value);
                  setPersenCore(100 - value);
                }}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Total harus 100%. Rekomendasi: Core 60%, Secondary 40%
              </p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Informasi Sistem</h3>
              <p className="text-xs text-muted-foreground">Detail konfigurasi aplikasi</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <span className="text-sm text-muted-foreground">Versi Aplikasi</span>
              <span className="text-sm font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <span className="text-sm text-muted-foreground">Metode</span>
              <span className="text-sm font-medium text-foreground">Profile Matching</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <span className="text-sm text-muted-foreground">Storage</span>
              <span className="text-sm font-medium text-foreground">Local Storage</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <span className="text-sm text-muted-foreground">Framework</span>
              <span className="text-sm font-medium text-foreground">React + Tailwind</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Pengaturan</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset ke Default</span>
        </button>
      </div>

      {/* Documentation */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-3">Panduan Penggunaan</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Atur bobot Core Factor dan Secondary Factor sesuai kebutuhan analisis Anda</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Core Factor biasanya memiliki bobot lebih besar (60-70%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Klik "Simpan Pengaturan" untuk menyimpan perubahan ke browser</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Gunakan "Reset ke Default" untuk menghapus semua data dan kembali ke pengaturan awal</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
