import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Alternatif, Kriteria } from '../utils/profileMatching';

interface DataAlternatifProps {
  alternatif: Alternatif[];
  kriteria: Kriteria[];
  onUpdate: (alternatif: Alternatif[]) => void;
}

export function DataAlternatif({ alternatif, kriteria, onUpdate }: DataAlternatifProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlternatif, setEditingAlternatif] = useState<Alternatif | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    nilai: {} as Record<string, number>,
  });

  const openModal = (alt?: Alternatif) => {
    if (alt) {
      setEditingAlternatif(alt);
      setFormData({
        nama: alt.nama,
        jabatan: alt.jabatan,
        nilai: { ...alt.nilai },
      });
    } else {
      setEditingAlternatif(null);
      const initialNilai: Record<string, number> = {};
      kriteria.forEach(k => {
        initialNilai[k.id] = 0;
      });
      setFormData({ nama: '', jabatan: '', nilai: initialNilai });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAlternatif(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAlternatif) {
      // Update
      const updated = alternatif.map(a =>
        a.id === editingAlternatif.id
          ? { ...a, ...formData }
          : a
      );
      onUpdate(updated);
    } else {
      // Create
      const newAlternatif: Alternatif = {
        id: `A${alternatif.length + 1}`,
        ...formData,
      };
      onUpdate([...alternatif, newAlternatif]);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus alternatif ini?')) {
      onUpdate(alternatif.filter(a => a.id !== id));
    }
  };

  const updateNilai = (kriteriaId: string, value: number) => {
    setFormData({
      ...formData,
      nilai: {
        ...formData.nilai,
        [kriteriaId]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-foreground mb-2">Data Alternatif</h1>
          <p className="text-muted-foreground text-sm">
            Kelola data kandidat/karyawan yang akan dinilai
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Alternatif</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Jabatan</th>
                {kriteria.map(k => (
                  <th key={k.id} className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    {k.nama}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alternatif.map((alt) => (
                <tr key={alt.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{alt.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{alt.nama}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{alt.jabatan}</td>
                  {kriteria.map(k => (
                    <td key={k.id} className="px-6 py-4 text-sm text-foreground">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                        {alt.nilai[k.id] || 0}
                      </span>
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(alt)}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(alt.id)}
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
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-semibold text-foreground">
                {editingAlternatif ? 'Edit Alternatif' : 'Tambah Alternatif Baru'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nama Lengkap
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
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-4">Nilai Kriteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kriteria.map(k => (
                    <div key={k.id}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {k.nama}
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Target: {k.targetValue})
                        </span>
                      </label>
                      <input
                        type="number"
                        value={formData.nilai[k.id] || 0}
                        onChange={(e) => updateNilai(k.id, Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                        min="0"
                        max="5"
                        step="1"
                        required
                      />
                    </div>
                  ))}
                </div>
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
                  {editingAlternatif ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
