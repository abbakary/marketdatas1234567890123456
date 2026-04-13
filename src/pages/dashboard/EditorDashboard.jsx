import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import { DatasetCard, allDatasets } from './lib/DatasetCard';
import { editorStats, mockReviews, contentPerformanceData } from './lib/mockData';
import { FileCheck, Database, Clock, Check, X, Eye } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useThemeColors } from '../../utils/useThemeColors';
import { useChartColors } from '../../utils/useChartColors';

const qualityData = [
  { name: 'Approved', value: 872 }, { name: 'Rejected', value: 45 }, { name: 'Pending', value: 34 },
];
const COLORS = ['#20B2AA', '#e53e3e', '#FF8C00'];
const Badge = ({ children, style }) => <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, ...style }}>{children}</span>;

const pendingDatasets = allDatasets.filter(d => d.status === 'pending');
const approvedDatasets = allDatasets.filter(d => d.status === 'approved');

export default function EditorDashboard() {
  const [reviews, setReviews] = useState(mockReviews);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const themeColors = useThemeColors();
  const chartColors = useChartColors();

  const pendingReviews = reviews.filter(r => r.status === 'pending');

  const handleReview = (action) => {
    if (!selectedReview) return;
    setReviews(reviews.map(r => r.id === selectedReview.id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', reviewerId: '2' } : r));
    setSelectedReview(null); setReviewNotes('');
  };

  return (
    <DashboardLayout role="editor">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Welcome Banner */}
        <div style={{ borderRadius: 16, background: themeColors.card, border: `1px solid ${themeColors.border}`, padding: '32px', boxShadow: themeColors.isDarkMode ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#FF8C00' }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, color: themeColors.text, margin: 0, letterSpacing: '-0.02em' }}>Hello, <span style={{ color: '#FF8C00' }}>Editor!</span></h2>
          <p style={{ color: themeColors.textMuted, marginTop: 8, marginBottom: 0, fontSize: 16, fontWeight: 500 }}>You have {pendingReviews.length} items pending review</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          <StatCard title="Pending Reviews" value={editorStats.pendingReviews} change={-5} icon={<FileCheck size={24} />} />
          <StatCard title="Approved Datasets" value={editorStats.approvedDatasets} change={12} icon={<Database size={24} />} />
          <StatCard title="Rejected" value={editorStats.rejectedDatasets} change={-8} icon={<X size={24} />} />
          <StatCard title="Avg Review Time" value={editorStats.avgReviewTime} icon={<Clock size={24} />} />
        </div>

        {/* Pending Datasets for Review — using DatasetCard */}
        <ChartCard title="Datasets Pending Review" action={
          <a href="/dashboard/editor/reviews" style={{ fontSize: 14, color: '#FF8C00', textDecoration: 'none', fontWeight: 700 }}>View All</a>
        }>
          {pendingDatasets.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {pendingDatasets.slice(0, 4).map(d => (
                <DatasetCard key={d.id} dataset={d} showStatus
                  onAction={() => setSelectedReview({ id: d.id, datasetId: d.id, datasetTitle: d.title, status: 'pending', submittedAt: new Date() })}
                  actionLabel="Review"
                  actionStyle={{ background: '#FF8C00', color: '#fff' }}
                />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#718096', padding: '32px 0', fontSize: 15, fontWeight: 600 }}>No pending reviews</p>
          )}
        </ChartCard>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <ChartCard title="Content Performance">
            <div style={{ height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contentPerformanceData}>
                  <XAxis dataKey="month" stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                  <YAxis stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                  <Tooltip contentStyle={chartColors.tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                  <Line type="monotone" dataKey="approved" stroke="#20B2AA" strokeWidth={4} dot={{ fill: '#20B2AA', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: chartColors.tooltipStyle.backgroundColor, strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="rejected" stroke="#e53e3e" strokeWidth={4} dot={{ fill: '#e53e3e', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: chartColors.tooltipStyle.backgroundColor, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Quality Stats">
            <div style={{ height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={qualityData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={6} dataKey="value">
                    {qualityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={chartColors.tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} formatter={v => <span style={{ color: themeColors.textMuted, fontSize: 12, fontWeight: 700 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Approved Datasets — using DatasetCard */}
        <ChartCard title="Recently Approved Datasets" action={
          <a href="/dashboard/editor/approvals" style={{ fontSize: 14, color: '#FF8C00', textDecoration: 'none', fontWeight: 700 }}>View All</a>
        }>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {approvedDatasets.slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d} showStatus
                onAction={() => { }}
                actionLabel="View"
                actionStyle={{ background: themeColors.hoverBg, color: themeColors.textMuted, border: `1px solid ${themeColors.border}` }}
              />
            ))}
          </div>
        </ChartCard>

        {/* Moderation Tasks */}
        <ChartCard title="Moderation Tasks">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
            {[
              { label: 'Flagged Duplicates', count: 8, status: '12.5%', color: '#f59e0b' },
              { label: 'Content Violations', count: 3, status: '8%', color: '#e53e3e' },
              { label: 'Quality Issues', count: 12, status: '5%', color: '#FF8C00' },
              { label: 'Content Analytics', count: 5, status: '13.8%', color: '#20B2AA' },
            ].map(task => (
              <div key={task.label} style={{ padding: 20, borderRadius: 16, background: themeColors.hoverBg, border: `1px solid ${themeColors.border}`, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = task.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = themeColors.border}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: themeColors.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{task.label}</span>
                  <span style={{ fontSize: 13, color: task.color, fontWeight: 700 }}>{task.status}</span>
                </div>
                <p style={{ fontSize: 32, fontWeight: 800, color: themeColors.text, margin: 0 }}>{task.count}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Review Dialog */}
      {selectedReview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: themeColors.isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: themeColors.card, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, boxShadow: themeColors.isDarkMode ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${themeColors.border}` }}>
            <h3 style={{ color: themeColors.text, margin: '0 0 6px', fontSize: 24, fontWeight: 800 }}>Review Dataset</h3>
            <p style={{ color: themeColors.textMuted, margin: '0 0 24px', fontSize: 15, fontWeight: 500 }}>Review the dataset and approve or reject.</p>
            {(() => {
              const d = allDatasets.find(x => x.id === selectedReview.datasetId);
              return d ? (
                <div style={{ padding: 20, borderRadius: 16, background: themeColors.hoverBg, marginBottom: 24, border: `1px solid ${themeColors.border}` }}>
                  <p style={{ color: themeColors.text, fontWeight: 800, margin: '0 0 6px', fontSize: 17 }}>{d.title}</p>
                  <p style={{ fontSize: 14, color: themeColors.textMuted, margin: '0 0 16px', lineHeight: 1.5 }}>{d.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                    {[['Category', d.category], ['Price', `$${d.price}`], ['Size', d.size], ['Format', d.format]].map(([k, v]) => (
                      <div key={k}><span style={{ color: themeColors.textMuted, fontWeight: 700 }}>{k}: </span><span style={{ color: themeColors.text, fontWeight: 700 }}>{v}</span></div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, color: themeColors.textMuted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review Notes</label>
              <textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} rows={4} placeholder="Add review feedback..."
                style={{ width: '100%', background: themeColors.bg, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: 14, color: themeColors.text, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setSelectedReview(null)} style={{ padding: '10px 22px', background: themeColors.hoverBg, border: `1px solid ${themeColors.border}`, borderRadius: 10, color: themeColors.textMuted, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Cancel</button>
              <button onClick={() => handleReview('reject')} style={{ padding: '10px 22px', background: themeColors.isDarkMode ? '#3a1e1e' : '#fff5f5', border: themeColors.isDarkMode ? '1px solid #5a3a3a' : '1px solid #fed7d7', borderRadius: 10, color: '#e53e3e', cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><X size={18} /> Reject</button>
              <button onClick={() => handleReview('approve')} style={{ padding: '10px 22px', background: '#FF8C00', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, boxShadow: themeColors.isDarkMode ? '0 4px 10px rgba(255,140,0,0.4)' : '0 4px 10px rgba(255,140,0,0.2)' }}><Check size={18} /> Approve</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
