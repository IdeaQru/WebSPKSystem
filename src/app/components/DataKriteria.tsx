import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Kriteria } from '../utils/profileMatching';

interface DataKriteriaProps {
  kriteria: Kriteria[];
  onUpdate: (kriteria: Kriteria[]) => void;
}

export function DataKriteria({ kriteria, onUpdate }: DataKriteriaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKriteria, setEditingKriteria] = useState<Kriteria | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    bobot: 0,
    targetValue: 0,
    jenis: 'core' as 'core' | 'secondary',
  });

  const openModal = (k?: Kriteria) => {
    if (k) {
      setEditingKriteria(k);
      setFormData({
        nama: k.nama,
        bobot: k.bobot,
        targetValue: k.targetValue,
        jenis: k.jenis,
      });
    } else {
      setEditingKriteria(null);
      setFormData({ nama: '', bobot: 0, targetValue: 0, jenis: 'core' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingKriteria(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingKriteria) {
      // Update
      const updated = kriteria.map(k =>
        k.id === editingKriteria.id
          ? { ...k, ...formData }
          : k
      );
      onUpdate(updated);
    } else {
      // Create
      const newKriteria: Kriteria = {
        id: `K${kriteria.length + 1}`,
        ...formData,
      };
      onUpdate([...kriteria, newKriteria]);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kriteria ini?')) {
      onUpdate(kriteria.filter(k => k.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-foreground mb-2">Data Kriteria</h1>
          <p className="text-muted-foreground text-sm">
            Kelola kriteria penilaian untuk Profile Matching
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kriteria</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Nama Kriteria</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Bobot (%)</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Target Value</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Jenis</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {kriteria.map((k) => (
                <tr key={k.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{k.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{k.nama}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{k.bobot}%</td>
                  <td className="px-6 py-4 text-sm text-foreground">{k.targetValue}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        k.jenis === 'core'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {k.jenis === 'core' ? 'Core Factor' : 'Secondary Factor'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(k)}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(k.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-semibold text-foreground">
                {editingKriteria ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Kriteria
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bobot (%)
                </label>
                <input
                  type="number"
                  value={formData.bobot}
                  onChange={(e) => setFormData({ ...formData, bobot: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Value
                </label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                  min="0"
                  max="5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Jenis Faktor
                </label>
                <select
                  value={formData.jenis}
                  onChange={(e) => setFormData({ ...formData, jenis: e.target.value as 'core' | 'secondary' })}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                >
                  <option value="core">Core Factor</option>
                  <option value="secondary">Secondary Factor</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  {editingKriteria ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
