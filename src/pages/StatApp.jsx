import React from 'react';
import Enca from "./Enca";
import Dir from "./Dir";
import Month from "./Month";
import Etab from "./Etab";

function StatApp() {
  return (
    <div style={{
      backgroundColor: '#f8f9fe',
      padding: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Stats Cards */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <StatCard number="04" label="Utilisateurs" color="#5352ed" />
        <StatCard number="7" label="Total stagiaires" color="#4b7bec" />
        <StatCard number="10" label="Total appentis" color="#3867d6" />
        <StatCard number="03" label="Stagiaires du jour" color="#8c7ae6" />
        <StatCard number="04" label="Apprentis du jour" color="#8c7ae8" />
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '10px',
        flexWrap: 'wrap'
      }}>
        <ChartCard 
          component={<Month />}
          width="calc(33.33% - 16px)"
        />
        
        <ChartCard 
          component={<Dir />}
          width="calc(33.33% - 16px)"
        />

        <ChartCard 
          component={<Enca />}
          width="calc(33.33% - 16px)"
        />
        
        <ChartCard 
          component={<Etab />}
          width="calc(33.33% - 16px)"
        />
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 150px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        marginRight: '16px'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#3d4465'
        }}>
          {number}
        </div>
        <div style={{ fontSize: '14px', color: '#7e84a3' }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// Chart Card Component
function ChartCard({ title, component, width }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      flex: `1 1 ${width}`,
      padding: '20px 24px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '14px', color: '#7e84a3' }}>
          {title}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '13px',
          color: '#7e84a3',
          padding: '4px 12px',
          border: '1px solid #eaedf5',
          borderRadius: '4px'
        }}>
        </div>
      </div>
      {component}
    </div>
  );
}

export default StatApp;
