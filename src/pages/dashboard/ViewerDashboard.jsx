import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import { DatasetCard, allDatasets } from './lib/DatasetCard';
import { viewerStats, mockViewHistory } from './lib/mockData';
import { Eye, Bookmark, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useThemeColors } from '../../utils/useThemeColors';
import { useChartColors } from '../../utils/useChartColors';

const categoryData = [
   { name: 'Technology', value: 85 }, { name: 'Healthcare', value: 45 },
   { name: 'Finance', value: 32 }, { name: 'Environment', value: 28 }, { name: 'Science', value: 22 },
];
const viewingHistoryData = [
   { day: 'Mon', views: 12 }, { day: 'Tue', views: 19 }, { day: 'Wed', views: 8 },
   { day: 'Thu', views: 25 }, { day: 'Fri', views: 15 }, { day: 'Sat', views: 6 }, { day: 'Sun', views: 10 },
];
const COLORS = ['#FF8C00', '#20B2AA', '#ED8936', '#4FD1C5', '#CBD5E0'];

const approvedDatasets = allDatasets.filter(d => d.status === 'approved');

export default function ViewerDashboard() {
   const [bookmarkedIds, setBookmarkedIds] = useState(['d1', 'd4']);
   const toggleBookmark = id => setBookmarkedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
   const themeColors = useThemeColors();
   const chartColors = useChartColors();

   return (
      <DashboardLayout role="viewer">
         <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Welcome Banner */}
            <div style={{ borderRadius: 24, background: themeColors.card, border: `1px solid ${themeColors.border}`, padding: 40, color: themeColors.text, boxShadow: themeColors.isDarkMode ? '0 20px 25px -5px rgba(0,0,0,0.3)' : '0 20px 25px -5px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: themeColors.text }}>Welcome back, <span style={{ color: '#FF8C00' }}>Viewer!</span></h2>
                  <p style={{ color: themeColors.textMuted, marginTop: 8, marginBottom: 0, fontSize: 18, fontWeight: 500 }}>Explore datasets and discover new insights.</p>
               </div>
               <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'linear-gradient(135deg, #FF8C00 0%, transparent 70%)', opacity: 0.1, borderRadius: '50%' }} />
               <div style={{ position: 'absolute', bottom: -50, left: 100, width: 150, height: 150, background: 'linear-gradient(135deg, #20B2AA 0%, transparent 70%)', opacity: 0.1, borderRadius: '50%' }} />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
               <StatCard title="Datasets Viewed" value={viewerStats.datasetsViewed} change={12} icon={<Eye size={24} />} />
               <StatCard title="Bookmarked Items" value={viewerStats.bookmarkedItems} change={8} icon={<Bookmark size={24} />} />
               <StatCard title="Viewing Streak" value={`${viewerStats.viewingStreak} days`} change={5} icon={<TrendingUp size={24} />} />
               <StatCard title="Reports Generated" value={viewerStats.reportsGenerated} icon={<FileText size={24} />} />
            </div>

            {/* Browse Categories */}
            <ChartCard title="Explore Datasets" action={
               <a href="/dashboard/viewer/browse" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>Browse All</a>
            }>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 16, marginBottom: 32 }}>
                  {[
                     { name: 'Technology', icon: '💻', color: '#FF8C00' },
                     { name: 'Healthcare', icon: '🏥', color: '#20B2AA' },
                     { name: 'Finance', icon: '📊', color: '#ED8936' },
                     { name: 'Environment', icon: '🌍', color: '#4FD1C5' },
                     { name: 'Science', icon: '🔬', color: '#f6ad55' },
                     { name: 'Agriculture', icon: '🌾', color: '#38b2ac' },
                  ].map(cat => (
                     <button key={cat.name} style={{ padding: 20, borderRadius: 20, background: themeColors.hoverBg, border: `1px solid ${themeColors.border}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: themeColors.isDarkMode ? '0 4px 6px -1px rgba(0,0,0,0.2)' : '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: themeColors.text, margin: 0 }}>{cat.name}</p>
                     </button>
                  ))}
               </div>

               {/* Featured Datasets using DatasetCard */}
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {approvedDatasets.slice(0, 4).map(d => (
                     <DatasetCard key={d.id} dataset={d}
                        onAction={() => toggleBookmark(d.id)}
                        actionLabel={bookmarkedIds.includes(d.id) ? '✓ Bookmarked' : 'Bookmark'}
                        actionStyle={{ background: bookmarkedIds.includes(d.id) ? (themeColors.isDarkMode ? '#3a2f1b' : '#fffaf0') : themeColors.hoverBg, color: bookmarkedIds.includes(d.id) ? '#dd6b20' : themeColors.textMuted, border: bookmarkedIds.includes(d.id) ? (themeColors.isDarkMode ? '1px solid #5a4a2b' : '1px solid #feebc8') : `1px solid ${themeColors.border}`, fontWeight: 700 }}
                     />
                  ))}
               </div>
            </ChartCard>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
               <ChartCard title="Viewing History">
                  <div style={{ height: 256 }}>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={viewingHistoryData}>
                           <XAxis dataKey="day" stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                           <YAxis stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                           <Tooltip contentStyle={chartColors.tooltipStyle} />
                           <Bar dataKey="views" fill="#20B2AA" radius={[6, 6, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </ChartCard>
               <ChartCard title="Trending Reports">
                  <div style={{ height: 256 }}>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                              {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                           </Pie>
                           <Tooltip contentStyle={chartColors.tooltipStyle} />
                           <Legend iconType="circle" />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </ChartCard>
            </div>

            {/* More Datasets to Explore */}
            <ChartCard title="More Datasets to Explore" action={
               <a href="/dashboard/viewer/browse" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>Browse All</a>
            }>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {approvedDatasets.slice(4, 8).map(d => (
                     <DatasetCard key={d.id} dataset={d}
                        onAction={() => { }}
                        actionLabel="View Details"
                        actionStyle={{ background: '#FF8C00', color: '#fff', fontWeight: 700 }}
                     />
                  ))}
               </div>
            </ChartCard>

            {/* Recent Activity */}
            <ChartCard title="Recent Activity" action={
               <a href="/dashboard/viewer/history" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>View All</a>
            }>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
                  {mockViewHistory.slice(0, 4).map(item => (
                     <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16, background: themeColors.hoverBg, border: `1px solid ${themeColors.border}`, transition: 'all 0.2s', boxShadow: themeColors.isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: themeColors.isDarkMode ? '#1e3a1e' : '#f0fff4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#38a169' }}>
                           <Eye size={22} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                           <p style={{ fontSize: 14, fontWeight: 700, color: themeColors.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.datasetTitle}</p>
                           <p style={{ fontSize: 12, color: themeColors.textMuted, margin: '2px 0 0', fontWeight: 600 }}>{item.viewedAt.toLocaleDateString()}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </ChartCard>
         </div>
      </DashboardLayout>
   );
}
