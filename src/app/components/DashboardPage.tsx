import { TrendingUp, Users, ListChecks, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Alternatif, Kriteria } from '../utils/profileMatching';

interface DashboardPageProps {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
}

export function DashboardPage({ kriteria, alternatif }: DashboardPageProps) {
  // Data untuk chart
  const alternatifChartData = alternatif.map(alt => ({
    name: alt.nama,
    rata: Object.values(alt.nilai).reduce((a, b) => a + b, 0) / Object.values(alt.nilai).length,
  }));

  const radarData = kriteria.map(k => ({
    kriteria: k.nama,
    target: k.targetValue,
    avg: alternatif.reduce((sum, alt) => sum + (alt.nilai[k.id] || 0), 0) / alternatif.length,
  }));

  const stats = [
    {
      title: 'Total Kriteria',
      value: kriteria.length,
      icon: ListChecks,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Alternatif',
      value: alternatif.length,
      icon: Users,
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Core Factor',
      value: kriteria.filter(k => k.jenis === 'core').length,
      icon: Award,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Secondary Factor',
      value: kriteria.filter(k => k.jenis === 'secondary').length,
      icon: TrendingUp,
      color: 'from-pink-600 to-pink-700',
      bgColor: 'bg-pink-50 dark:bg-pink-950/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">
          Ringkasan data sistem pendukung keputusan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="font-semibold text-foreground">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
          <h3 className="font-medium text-foreground mb-4">Rata-rata Nilai Alternatif</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alternatifChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
              <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" fontSize={12} />
              <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="rata" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
          <h3 className="font-medium text-foreground mb-4">Perbandingan Target vs Rata-rata</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="currentColor" className="text-border" />
              <PolarAngleAxis dataKey="kriteria" stroke="currentColor" className="text-muted-foreground" fontSize={11} />
              <PolarRadiusAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} />
              <Radar name="Target" dataKey="target" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.3} />
              <Radar name="Rata-rata" dataKey="avg" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} />
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

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-3">
          {[
            { action: 'Data kriteria diperbarui', time: '5 menit yang lalu', type: 'update' },
            { action: 'Alternatif baru ditambahkan', time: '1 jam yang lalu', type: 'create' },
            { action: 'Perhitungan profile matching selesai', time: '2 jam yang lalu', type: 'success' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'create' ? 'bg-blue-500' :
                'bg-orange-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
