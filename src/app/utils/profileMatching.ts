// Utils untuk kalkulasi Profile Matching

export interface Kriteria {
  id: string;
  nama: string;
  bobot: number;
  targetValue: number;
  jenis: 'core' | 'secondary'; // Core Factor / Secondary Factor
}

export interface Alternatif {
  id: string;
  nama: string;
  jabatan: string;
  nilai: Record<string, number>; // { kriteriaId: nilai }
}

export interface HasilPerhitungan {
  alternatifId: string;
  nama: string;
  gap: Record<string, number>;
  bobotGap: Record<string, number>;
  ncf: number; // Nilai Core Factor
  nsf: number; // Nilai Secondary Factor
  nilaiAkhir: number;
  ranking: number;
}

// Gap = Nilai Alternatif - Target Value
export function hitungGap(nilai: number, target: number): number {
  return nilai - target;
}

// Mapping Bobot Gap (sesuai tabel standar Profile Matching)
export function getBobotGap(gap: number): number {
  const mapping: Record<number, number> = {
    0: 5,    // No gap (kompetensi sesuai)
    1: 4.5,  // Kompetensi individu kelebihan 1 tingkat
    '-1': 4, // Kompetensi individu kekurangan 1 tingkat
    2: 3.5,  // Kompetensi individu kelebihan 2 tingkat
    '-2': 3, // Kompetensi individu kekurangan 2 tingkat
    3: 2.5,  // Kompetensi individu kelebihan 3 tingkat
    '-3': 2, // Kompetensi individu kekurangan 3 tingkat
    4: 1.5,  // Kompetensi individu kelebihan 4 tingkat
    '-4': 1, // Kompetensi individu kekurangan 4 tingkat
  };
  
  return mapping[gap] || 1; // Default 1 jika gap > 4 atau < -4
}

// Hitung NCF (Nilai Core Factor)
export function hitungNCF(
  bobotGap: Record<string, number>,
  kriteria: Kriteria[]
): number {
  const coreCriteria = kriteria.filter(k => k.jenis === 'core');
  if (coreCriteria.length === 0) return 0;
  
  const totalBobot = coreCriteria.reduce((sum, k) => sum + bobotGap[k.id], 0);
  return totalBobot / coreCriteria.length;
}

// Hitung NSF (Nilai Secondary Factor)
export function hitungNSF(
  bobotGap: Record<string, number>,
  kriteria: Kriteria[]
): number {
  const secondaryCriteria = kriteria.filter(k => k.jenis === 'secondary');
  if (secondaryCriteria.length === 0) return 0;
  
  const totalBobot = secondaryCriteria.reduce((sum, k) => sum + bobotGap[k.id], 0);
  return totalBobot / secondaryCriteria.length;
}

// Hitung Nilai Akhir: (x% * NCF) + (y% * NSF)
// Standar: 60% Core, 40% Secondary
export function hitungNilaiAkhir(
  ncf: number,
  nsf: number,
  persenCore: number = 60,
  persenSecondary: number = 40
): number {
  return (persenCore / 100) * ncf + (persenSecondary / 100) * nsf;
}

// Proses Profile Matching lengkap
export function prosesProfileMatching(
  alternatif: Alternatif[],
  kriteria: Kriteria[]
): HasilPerhitungan[] {
  const hasil: HasilPerhitungan[] = alternatif.map(alt => {
    const gap: Record<string, number> = {};
    const bobotGap: Record<string, number> = {};
    
    // Hitung gap dan bobot gap untuk setiap kriteria
    kriteria.forEach(k => {
      const nilai = alt.nilai[k.id] || 0;
      gap[k.id] = hitungGap(nilai, k.targetValue);
      bobotGap[k.id] = getBobotGap(gap[k.id]);
    });
    
    // Hitung NCF dan NSF
    const ncf = hitungNCF(bobotGap, kriteria);
    const nsf = hitungNSF(bobotGap, kriteria);
    
    // Hitung nilai akhir
    const nilaiAkhir = hitungNilaiAkhir(ncf, nsf);
    
    return {
      alternatifId: alt.id,
      nama: alt.nama,
      gap,
      bobotGap,
      ncf,
      nsf,
      nilaiAkhir,
      ranking: 0, // akan diisi setelah sorting
    };
  });
  
  // Urutkan berdasarkan nilai akhir (descending) dan assign ranking
  hasil.sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);
  hasil.forEach((h, index) => {
    h.ranking = index + 1;
  });
  
  return hasil;
}
