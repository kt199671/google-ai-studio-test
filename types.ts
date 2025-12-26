
export interface AtomData {
  element: string;
  position: [number, number, number];
  id: string;
}

export interface BondData {
  start: string; // Atom ID
  end: string;   // Atom ID
  order?: number; // 1 for single, 2 for double, etc.
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  description: string;
  atoms: AtomData[];
  bonds: BondData[];
}

export const CPK_COLORS: Record<string, string> = {
  'H': '#ffffff',
  'C': '#333333',
  'O': '#ff0000',
  'N': '#3050f8',
  'S': '#ffff30',
  'P': '#ffa500',
  'Cl': '#1ff01f',
  'Br': '#a62929',
  'I': '#940094',
  'He': '#ffc0cb',
  'F': '#90e050',
  'DEFAULT': '#dddddd'
};

export const ATOM_RADII: Record<string, number> = {
  'H': 0.3,
  'C': 0.6,
  'O': 0.55,
  'N': 0.55,
  'S': 0.8,
  'P': 0.8,
  'Cl': 0.7,
  'F': 0.5,
  'DEFAULT': 0.5
};
