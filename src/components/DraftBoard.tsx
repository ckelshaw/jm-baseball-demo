import React, { useState } from 'react';
import players from '../data/staticPlayers.json';

type Player = {
  Player: string;
  Team: string;
  HR: number;
  BA?: number;
  OPS_Plus?: number;
  WAR?: number;
  OBP?: number;
};

type DraftCategory = 'HR' | 'BA' | 'OPS+' | 'WAR' | 'OBP';

type DraftBoardProps = {
  category: DraftCategory;
};

const DraftBoard: React.FC<DraftBoardProps> = ({ category }) => {
  const [lineup, setLineup] = useState<Player[]>(() =>
    Array(9).fill(null).map(() => ({ Player: '', Team: '', HR: 0, BA: 0, OPS_Plus: 0, WAR: 0, OBP: 0 }))
  );
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const firstEmptyIndex = lineup.findIndex(player => player.Player === '');

  const handleRowClick = (index: number) => {
    if (index === firstEmptyIndex) setSelectedRowIndex(index);
  };

  const handlePlayerSelect = (player: Player) => {
    if (selectedRowIndex === null) return;
    const updated = [...lineup];
    updated[selectedRowIndex] = player;
    setLineup(updated);
    setSelectedRowIndex(null);
    setSearchTerm('');
  };

  const filteredPlayers = players.filter(p =>
    p.Player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryConfig = {
    HR: { label: 'HR', getValue: (p: Player) => p.HR },
    BA: { label: 'BA', getValue: (p: Player) => p.BA?.toFixed(3) ?? '-' },
    'OPS+': { label: 'OPS+', getValue: (p: Player) => p.OPS_Plus ?? '-' },
    WAR: { label: 'WAR', getValue: (p: Player) => p.WAR},
    OBP: { label: 'OBP', getValue: (p: Player) => p.OBP}
  };

  const { label: statLabel, getValue: getStat } = categoryConfig[category];

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fffacd', minWidth: '1000px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5dc', fontWeight: 'bold', color: 'black', borderBottom: '2px solid black' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>PLAYER</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>TEAM</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>{statLabel}</th>
          </tr>
        </thead>
        <tbody>
          {lineup.map((player, index) => {
            const isFilled = player.Player !== '';
            const isNextToPick = index === firstEmptyIndex;
            const isDisabled = !isFilled && !isNextToPick;

            return (
              <tr
                key={index}
                onClick={() => handleRowClick(index)}
                style={{
                  borderBottom: '1px solid #ccc',
                  backgroundColor: selectedRowIndex === index ? '#d3f9d8' : isDisabled ? '#f0f0f0' : 'inherit',
                  color: isDisabled ? '#aaa' : 'black',
                  cursor: isNextToPick ? 'pointer' : 'default'
                }}
              >
                <td style={{ padding: '10px' }}>{index + 1}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{player.Player}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{player.Team}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{isFilled ? getStat(player) : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedRowIndex !== null && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', background: '#fff' }}>
          <h3>Pick a Player for Slot {selectedRowIndex + 1}</h3>
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '250px', overflowY: 'auto' }}>
            {filteredPlayers.map((p, i) => (
              <li
                key={i}
                onClick={() => handlePlayerSelect(p)}
                style={{
                  padding: '0.5rem',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer'
                }}
              >
                {p.Player} — {p.Team} — {getStat(p)} {statLabel}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DraftBoard;