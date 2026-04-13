import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import { DatasetCard, allDatasets } from './lib/DatasetCard';
import { buyerStats, mockPurchases } from './lib/mockData';
import { ShoppingCart, Heart, DollarSign, TrendingUp, Download, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeColors } from '../../utils/useThemeColors';
import { useChartColors } from '../../utils/useChartColors';

const Badge = ({ children, style }) => <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, ...style }}>{children}</span>;
const budgetData = [
   { name: 'Used', value: buyerStats.budgetUsed },
   { name: 'Remaining', value: buyerStats.budgetLimit - buyerStats.budgetUsed },
];
const COLORS = ['#FF8C00', '#20B2AA'];

const approvedDatasets = allDatasets.filter(d => d.status === 'approved');

export default function BuyerDashboard() {
   const themeColors = useThemeColors();
   const chartColors = useChartColors();
   const [wishlist, setWishlist] = useState([]);
   const budgetPct = (buyerStats.budgetUsed / buyerStats.budgetLimit) * 100;

   const statusStyle = s => s === 'completed' ? { background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: `1px solid ${themeColors.border}` } : s === 'pending' ? { background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: `1px solid ${themeColors.border}` } : { background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: `1px solid ${themeColors.border}` };

   return (
      <DashboardLayout role="buyer">
         <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Welcome Banner */}
            <div style={{ borderRadius: 24, backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}`, padding: 40, color: themeColors.text, boxShadow: themeColors.isDarkMode ? '0 20px 25px -5px rgba(0,0,0,0.3)' : '0 20px 25px -5px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: themeColors.text }}>Welcome back, <span style={{ color: '#FF8C00' }}>{buyerStats.name || 'Explorer'}!</span></h2>
                  <p style={{ color: themeColors.textMuted, marginTop: 8, marginBottom: 0, fontSize: 18, fontWeight: 500 }}>Find the perfect data for your next project.</p>
               </div>
               <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'linear-gradient(135deg, #FF8C00 0%, transparent 70%)', opacity: 0.1, borderRadius: '50%' }} />
               <div style={{ position: 'absolute', bottom: -50, left: 100, width: 150, height: 150, background: 'linear-gradient(135deg, #20B2AA 0%, transparent 70%)', opacity: 0.1, borderRadius: '50%' }} />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
               <StatCard title="Total Purchases" value={buyerStats.totalPurchases} change={8} icon={<ShoppingCart size={24} />} />
               <StatCard title="Wishlist Items" value={buyerStats.wishlistItems} change={15} icon={<Heart size={24} />} />
               <StatCard title="Budget Used" value={`$${buyerStats.budgetUsed.toLocaleString()}`} icon={<DollarSign size={24} />} />
               <StatCard title="Budget Limit" value={`$${buyerStats.budgetLimit.toLocaleString()}`} icon={<TrendingUp size={24} />} />
            </div>

            {/* Recommended Datasets — using DatasetCard */}
            <ChartCard title="Recommended Datasets" action={
               <a href="/dashboard/buyer/recommendations" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>View All</a>
            }>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {approvedDatasets.slice(0, 4).map(d => (
                     <DatasetCard key={d.id} dataset={d}
                        onAction={() => { }}
                        actionLabel="Buy Now"
                        actionStyle={{ background: '#0891b2', color: '#fff' }}
                     />
                  ))}
               </div>
            </ChartCard>

            {/* Budget Tracker + Purchase History */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
               <ChartCard title="Budget Tracker">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                     <div style={{ height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                               <Pie data={budgetData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                                 {budgetData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                               </Pie>
                               <Tooltip contentStyle={chartColors.tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, '']} />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: themeColors.textMuted, fontWeight: 600 }}>Budget Used</span>
                            <span style={{ color: themeColors.text, fontWeight: 800 }}>${buyerStats.budgetUsed.toLocaleString()}</span>
                         </div>
                         <div style={{ height: 10, background: themeColors.border, borderRadius: 5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${budgetPct}%`, background: 'linear-gradient(90deg, #FF8C00, #ED8936)', borderRadius: 5 }} />
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: themeColors.textMuted, fontWeight: 600 }}>Remaining</span>
                            <span style={{ color: '#20B2AA', fontWeight: 800 }}>${(buyerStats.budgetLimit - buyerStats.budgetUsed).toLocaleString()}</span>
                         </div>
                      </div>
                  </div>
               </ChartCard>

               <ChartCard title="Purchase History">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                     <a href="/dashboard/buyer/purchases" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>View All History</a>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                         <thead>
                            <tr style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                               {['Dataset', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                                  <th key={h} style={{ padding: '16px', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: 13, fontWeight: 700, color: themeColors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                               ))}
                            </tr>
                         </thead>
                         <tbody>
                            {mockPurchases.slice(0, 5).map(p => (
                               <tr key={p.id} style={{ borderBottom: `1px solid ${themeColors.border}`, transition: 'background 0.2s' }}>
                                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: themeColors.text }}>{p.datasetTitle}</td>
                                  <td style={{ padding: '16px', fontSize: 13, color: themeColors.textMuted, fontWeight: 600 }}>{p.date.toLocaleDateString()}</td>
                                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 800, color: '#20B2AA' }}>${p.amount}</td>
                                  <td style={{ padding: '16px' }}><Badge style={{ ...statusStyle(p.status), fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>{p.status}</Badge></td>
                                  <td style={{ padding: '16px', textAlign: 'right' }}>
                                     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                        <button style={{ padding: '8px 12px', background: themeColors.hoverBg, border: `1px solid ${themeColors.border}`, borderRadius: 10, color: themeColors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}><Download size={14} /> Download</button>
                                        <button style={{ padding: '8px', background: themeColors.hoverBg, border: `1px solid ${themeColors.border}`, borderRadius: 10, color: themeColors.textMuted, cursor: 'pointer' }}><Eye size={16} /></button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                     </table>
                  </div>
               </ChartCard>
            </div>

            {/* Wishlist Preview — using DatasetCard */}
            <ChartCard title="My Wishlist" action={
               <a href="/dashboard/buyer/wishlist" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>View All</a>
            }>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {approvedDatasets.slice(2, 5).map(d => (
                     <DatasetCard key={d.id} dataset={d}
                        onAction={() => { }}
                        actionLabel="Buy Now"
                        actionStyle={{ background: '#0891b2', color: '#fff' }}
                     />
                  ))}
               </div>
            </ChartCard>
         </div>
      </DashboardLayout>
   );
}
