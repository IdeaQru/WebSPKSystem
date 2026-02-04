import { Trophy, Award, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Alternatif, Kriteria, prosesProfileMatching, HasilPerhitungan as HasilType } from '../utils/profileMatching';

interface HasilPerhitunganProps {
  alternatif: Alternatif[];
  kriteria: Kriteria[];
}

export function HasilPerhitungan({ alternatif, kriteria }: HasilPerhitunganProps) {
  // Proses perhitungan Profile Matching
  const hasil = prosesProfileMatching(alternatif, kriteria);

  // Data untuk chart
  const rankingData = hasil.map(h => ({
    nama: h.nama,
    ncf: h.ncf,
    nsf: h.nsf,
    nilaiAkhir: h.nilaiAkhir,
  }));

  const radarData = kriteria.map(k => {
    const data: any = { kriteria: k.nama };
    hasil.forEach(h => {
      data[h.nama] = h.bobotGap[k.id] || 0;
    });
    return data;
  });

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
  };

  const handleExport = () => {
    // Simulasi export ke CSV
    let csv = 'Ranking,Nama,NCF,NSF,Nilai Akhir\n';
    hasil.forEach(h => {
      csv += `${h.ranking},${h.nama},${h.ncf.toFixed(2)},${h.nsf.toFixed(2)},${h.nilaiAkhir.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hasil-profile-matching.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-foreground mb-2">Hasil Perhitungan</h1>
          <p className="text-muted-foreground text-sm">
            Hasil ranking menggunakan metode Profile Matching
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hasil.slice(0, 3).map((h, index) => {
          const icons = [Trophy, Award, TrendingUp];
          const Icon = icons[index];
          const colors = [
            'from-yellow-500 to-yellow-600',
            'from-gray-400 to-gray-600',
            'from-orange-500 to-orange-600',
          ];

          return (
            <div
              key={h.alternatifId}
              className="relative overflow-hidden rounded-xl bg-card border border-border p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[index]} opacity-10 rounded-full -mr-16 -mt-16`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[index]}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-muted-foreground">
                    #{h.ranking}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{h.nama}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nilai Akhir: {h.nilaiAkhir.toFixed(3)}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 rounded bg-secondary">
                    <p className="text-muted-foreground">NCF</p>
                    <p className="font-medium text-foreground">{h.ncf.toFixed(2)}</p>
                  </div>
                  <div className="p-2 rounded bg-secondary">
                    <p className="text-muted-foreground">NSF</p>
                    <p className="font-medium text-foreground">{h.nsf.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-4">Perbandingan Nilai Akhir</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rankingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
              <XAxis dataKey="nama" stroke="currentColor" className="text-muted-foreground" fontSize={12} />
              <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="ncf" fill="#2563eb" name="NCF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="nsf" fill="#1e3a8a" name="NSF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="nilaiAkhir" fill="#60a5fa" name="Nilai Akhir" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-4">Profil Bobot Gap per Kriteria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="currentColor" className="text-border" />
              <PolarAngleAxis dataKey="kriteria" stroke="currentColor" className="text-muted-foreground" fontSize={11} />
              <PolarRadiusAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} />
              {hasil.map((h, index) => (
                <Radar
                  key={h.alternatifId}
                  name={h.nama}
                  dataKey={h.nama}
                  stroke={['#2563eb', '#1e3a8a', '#60a5fa', '#3b82f6'][index % 4]}
                  fill={['#2563eb', '#1e3a8a', '#60a5fa', '#3b82f6'][index % 4]}
                  fillOpacity={0.3}
                />
              ))}
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-medium text-foreground">Detail Perhitungan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Ranking</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">NCF</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">NSF</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Nilai Akhir</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hasil.map((h) => (
                <tr key={h.alternatifId} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-medium ${getRankBadgeColor(h.ranking)}`}>
                      {h.ranking}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{h.nama}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{h.ncf.toFixed(3)}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{h.nsf.toFixed(3)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{h.nilaiAkhir.toFixed(3)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        h.ranking === 1
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : h.ranking <= 3
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {h.ranking === 1 ? 'Terpilih' : h.ranking <= 3 ? 'Kandidat' : 'Standar'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-3">Tentang Profile Matching</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">NCF (Nilai Core Factor)</p>
            <p>Rata-rata bobot gap dari kriteria inti (60% pengaruh)</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">NSF (Nilai Secondary Factor)</p>
            <p>Rata-rata bobot gap dari kriteria pendukung (40% pengaruh)</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-medium text-foreground mb-1">Nilai Akhir</p>
            <p>Hasil dari: (60% × NCF) + (40% × NSF)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
