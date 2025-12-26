
import { Molecule } from '../types';

export const MOLECULES: Molecule[] = [
  {
    id: 'h2o',
    name: '水',
    formula: 'H₂O',
    description: '生命に不可欠な化合物。極性分子であり、水素結合によって独特な性質を持ちます。',
    atoms: [
      { id: 'o1', element: 'O', position: [0, 0, 0] },
      { id: 'h1', element: 'H', position: [0.75, 0.6, 0] },
      { id: 'h2', element: 'H', position: [-0.75, 0.6, 0] },
    ],
    bonds: [
      { start: 'o1', end: 'h1' },
      { start: 'o1', end: 'h2' },
    ]
  },
  {
    id: 'ch4',
    name: 'メタン',
    formula: 'CH₄',
    description: '最も単純な炭化水素。正四面体構造をしており、天然ガスの主成分です。',
    atoms: [
      { id: 'c1', element: 'C', position: [0, 0, 0] },
      { id: 'h1', element: 'H', position: [1, 1, 1] },
      { id: 'h2', element: 'H', position: [-1, -1, 1] },
      { id: 'h3', element: 'H', position: [-1, 1, -1] },
      { id: 'h4', element: 'H', position: [1, -1, -1] },
    ],
    bonds: [
      { start: 'c1', end: 'h1' },
      { start: 'c1', end: 'h2' },
      { start: 'c1', end: 'h3' },
      { start: 'c1', end: 'h4' },
    ]
  },
  {
    id: 'co2',
    name: '二酸化炭素',
    formula: 'CO₂',
    description: '直線状の分子。炭素1つと酸素2つが二重結合で結ばれています。',
    atoms: [
      { id: 'c1', element: 'C', position: [0, 0, 0] },
      { id: 'o1', element: 'O', position: [1.2, 0, 0] },
      { id: 'o2', element: 'O', position: [-1.2, 0, 0] },
    ],
    bonds: [
      { start: 'c1', end: 'o1', order: 2 },
      { start: 'c1', end: 'o2', order: 2 },
    ]
  },
  {
    id: 'nh3',
    name: 'アンモニア',
    formula: 'NH₃',
    description: '三角錐形の分子。強い刺激臭があり、肥料などの原料として重要です。',
    atoms: [
      { id: 'n1', element: 'N', position: [0, 0, 0] },
      { id: 'h1', element: 'H', position: [0.94, 0, -0.3] },
      { id: 'h2', element: 'H', position: [-0.47, 0.81, -0.3] },
      { id: 'h3', element: 'H', position: [-0.47, -0.81, -0.3] },
    ],
    bonds: [
      { start: 'n1', end: 'h1' },
      { start: 'n1', end: 'h2' },
      { start: 'n1', end: 'h3' },
    ]
  },
  {
    id: 'c2h5oh',
    name: 'エタノール',
    formula: 'C₂H₅OH',
    description: 'アルコールの一種。消毒用や飲料用として広く利用されています。',
    atoms: [
      { id: 'c1', element: 'C', position: [-0.75, -0.25, 0] },
      { id: 'c2', element: 'C', position: [0.75, 0.25, 0] },
      { id: 'o1', element: 'O', position: [1.5, -0.75, 0] },
      { id: 'h1', element: 'H', position: [-0.8, -1.3, 0] },
      { id: 'h2', element: 'H', position: [-1.3, 0.1, 0.9] },
      { id: 'h3', element: 'H', position: [-1.3, 0.1, -0.9] },
      { id: 'h4', element: 'H', position: [0.8, 1.3, 0.4] },
      { id: 'h5', element: 'H', position: [0.8, 1.3, -0.4] },
      { id: 'h6', element: 'H', position: [2.4, -0.5, 0] },
    ],
    bonds: [
      { start: 'c1', end: 'c2' },
      { start: 'c2', end: 'o1' },
      { start: 'c1', end: 'h1' },
      { start: 'c1', end: 'h2' },
      { start: 'c1', end: 'h3' },
      { start: 'c2', end: 'h4' },
      { start: 'c2', end: 'h5' },
      { start: 'o1', end: 'h6' },
    ]
  }
];
