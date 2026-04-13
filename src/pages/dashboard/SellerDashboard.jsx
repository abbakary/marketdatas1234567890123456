import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import { DatasetCard, allDatasets } from './lib/DatasetCard';
import { sellerStats, salesTrendData } from './lib/mockData';
import { DollarSign, Package, TrendingUp, Eye, Plus, Edit, Trash2, X } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeColors } from '../../utils/useThemeColors';
import { useChartColors } from '../../utils/useChartColors';

const Badge = ({ children, style }) => <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', ...style }}>{children}</span>;

const myDatasets = allDatasets.filter(d => ['s1', 's2'].includes(d.sellerId));
const topCustomers = [
  { name: 'DataCorp Ltd', purchases: 18, revenue: 5400 },
  { name: 'Tech Analytics', purchases: 12, revenue: 3800 },
  { name: 'Research Hub', purchases: 9, revenue: 2900 },
  { name: 'AI Solutions', purchases: 7, revenue: 2100 },
];

export default function SellerDashboard() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const themeColors = useThemeColors();
  const chartColors = useChartColors();

  return (
    <DashboardLayout role="seller">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Welcome Banner */}
        <div style={{ borderRadius: 24, background: themeColors.card, padding: 40, border: `1px solid ${themeColors.border}`, boxShadow: themeColors.isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: themeColors.isDarkMode ? '#FF8C0025' : '#FF8C0015', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, background: themeColors.isDarkMode ? '#20B2AA25' : '#20B2AA15', borderRadius: '50%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 1 }}>
            <div>
              <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, color: themeColors.text, letterSpacing: '-0.02em' }}>Welcome back, <span style={{ color: '#FF8C00' }}>Seller!</span></h2>
              <p style={{ color: themeColors.textMuted, marginTop: 8, marginBottom: 0, fontSize: 18, fontWeight: 500 }}>Your sales are growing steadily this month</p>
            </div>
            <button onClick={() => setIsAddOpen(true)} style={{ padding: '14px 28px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: themeColors.isDarkMode ? '0 10px 15px -3px rgba(255,140,0,0.5)' : '0 10px 15px -3px rgba(255,140,0,0.3)', transition: 'transform 0.2s' }}>
              <Plus size={20} /> Create New Listing
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          <StatCard title="Active Listings" value={sellerStats.activeListings} change={8} icon={<Package size={24} />} />
          <StatCard title="Monthly Sales" value={`$${sellerStats.totalSales.toLocaleString()}`} change={15} icon={<DollarSign size={24} />} />
          <StatCard title="Total Earnings" value={`$${sellerStats.totalEarnings.toLocaleString()}`} change={12} icon={<TrendingUp size={24} />} />
          <StatCard title="Monthly Views" value={sellerStats.monthlyViews} change={20} icon={<Eye size={24} />} />
        </div>

        {/* My Dataset Listings — using DatasetCard */}
        <ChartCard title="My Active Listings" action={
          <a href="/dashboard/seller/listings" style={{ fontSize: 14, color: '#FF8C00', fontWeight: 700, textDecoration: 'none' }}>View All</a>
        }>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {myDatasets.filter(d => d.status === 'approved').slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d} showStatus
                onAction={() => { }}
                actionLabel="Edit"
                actionStyle={{ background: '#FF8C00', color: '#fff' }}
              />
            ))}
          </div>
        </ChartCard>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <ChartCard title="Sales Trend">
            <div style={{ height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#20B2AA" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#20B2AA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                  <YAxis stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                  <Tooltip contentStyle={chartColors.tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, 'Sales']} />
                  <Area type="monotone" dataKey="sales" stroke="#20B2AA" fill="url(#salesGrad)" strokeWidth={4} dot={{ fill: '#20B2AA', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: chartColors.tooltipStyle.backgroundColor, strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Top Customers">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {topCustomers.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 16, background: themeColors.hoverBg, border: `1px solid ${themeColors.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, background: i === 0 ? '#FFD700' : i === 1 ? themeColors.hoverBg : i === 2 ? '#F6AD55' : themeColors.hoverBg, color: i === 0 ? '#856404' : themeColors.textMuted, boxShadow: themeColors.isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.05)' }}>{i + 1}</div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: themeColors.text, margin: 0 }}>{c.name}</p>
                      <p style={{ fontSize: 13, color: themeColors.textMuted, margin: 0, fontWeight: 500 }}>{c.purchases} individual purchases</p>
                    </div>
                  </div>
                  <span style={{ color: '#20B2AA', fontWeight: 800, fontSize: 16 }}>${c.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Pending Datasets */}
        {myDatasets.filter(d => d.status === 'pending').length > 0 && (
          <ChartCard title="Pending Approval" action={
            <a href="/dashboard/seller/pending" style={{ fontSize: 14, color: '#FF8C00', fontWeight: 700, textDecoration: 'none' }}>View All</a>
          }>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {myDatasets.filter(d => d.status === 'pending').slice(0, 3).map(d => (
                <DatasetCard key={d.id} dataset={d} showStatus
                  onAction={() => { }}
                  actionLabel="View Status"
                  actionStyle={{ background: themeColors.isDarkMode ? '#3a2f1b' : '#fffaf0', color: '#dd6b20', border: themeColors.isDarkMode ? '1px solid #5a4a2b' : '1px solid #feebc8' }}
                />
              ))}
            </div>
          </ChartCard>
        )}

        {/* Sales by Category */}
        <ChartCard title="Sales by Category">
          <div style={{ height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ category: 'Tech', sales: 4500 }, { category: 'Health', sales: 3200 }, { category: 'Finance', sales: 2800 }, { category: 'Env', sales: 1900 }, { category: 'Agri', sales: 1200 }]}>
                <XAxis dataKey="category" stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <YAxis stroke={chartColors.text} fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <Tooltip contentStyle={chartColors.tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#FF8C00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Add Listing Modal */}
      {isAddOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: themeColors.isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: themeColors.card, borderRadius: 24, padding: 32, width: '100%', maxWidth: 480, boxShadow: themeColors.isDarkMode ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${themeColors.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: themeColors.text, margin: 0, fontSize: 24, fontWeight: 800 }}>Create New Listing</h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', color: themeColors.textMuted, cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            {[['Dataset Title', 'title', 'text', 'Cloud Infrastructure Logs 2024'], ['Description', 'description', 'text', 'High-quality dataset for infrastructure monitoring...'], ['Price ($)', 'price', 'number', '299']].map(([l, k, t, p]) => (
              <div key={k} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, color: themeColors.textMuted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
                <input type={t} placeholder={p} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                  style={{ width: '100%', background: themeColors.bg, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 16px', color: themeColors.text, fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, color: themeColors.textMuted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', background: themeColors.bg, border: `1px solid ${themeColors.border}`, borderRadius: 12, padding: '12px 16px', color: themeColors.text, fontSize: 15, outline: 'none', cursor: 'pointer', appearance: 'none' }}>
                <option value="">Select a category</option>
                {['Computer Science', 'Finance and Investment', 'Social Services', 'Agriculture and Environment', 'ICT and Digital Economy'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setIsAddOpen(false)} style={{ padding: '12px 24px', background: themeColors.hoverBg, border: `1px solid ${themeColors.border}`, borderRadius: 12, color: themeColors.textMuted, cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Cancel</button>
              <button onClick={() => setIsAddOpen(false)} style={{ padding: '12px 24px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 700, boxShadow: themeColors.isDarkMode ? '0 4px 10px rgba(255,140,0,0.4)' : '0 4px 10px rgba(255,140,0,0.2)' }}>Create Listing</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
