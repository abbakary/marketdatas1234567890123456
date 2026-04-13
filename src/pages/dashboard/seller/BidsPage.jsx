import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button, TextField, Modal, Fade,
  Backdrop, IconButton, Chip, LinearProgress, Tab, Tabs, Avatar, AvatarGroup,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  FileText, DollarSign, Calendar, Users, Zap, X, Plus, Send, CheckCircle,
  Clock, AlertCircle, TrendingUp, Star,
} from 'lucide-react';
import projectRequestService from '../../../utils/projectRequestService';

const PRIMARY = '#FF8C00';
const SECONDARY = '#20B2AA';
const SUCCESS = '#16a34a';
const WARNING = '#f59e0b';
const DANGER = '#dc2626';

export default function BidsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidForm, setBidForm] = useState({ price: '', deliveryTime: '', proposal: '' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalBids: 0,
    pendingBids: 0,
    acceptedBids: 0,
    totalEarnings: 0,
  });

  // Get current user (demo: collaborator)
  const currentCollaboratorId = 'c1'; // Demo: Dr. Aisha Patel

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // Get matching requests for this collaborator
      const matchingRequests = projectRequestService.getMatchingRequests(currentCollaboratorId);
      setRequests(matchingRequests);

      // Get all collaborator's bids
      const allRequests = projectRequestService.getAllRequests();
      const collaboratorBids = [];
      allRequests.forEach(r => {
        r.bids.forEach(b => {
          if (b.collaboratorId === currentCollaboratorId) {
            collaboratorBids.push({
              ...b,
              requestId: r.id,
              requestTitle: r.title,
              requestBudgetMin: r.budgetMin,
              requestBudgetMax: r.budgetMax,
              requestDeadline: r.deadline,
              buyerName: r.buyerName,
            });
          }
        });
      });
      setBids(collaboratorBids);

      // Get stats
      const collaboratorStats = projectRequestService.getCollaboratorStats(currentCollaboratorId);
      setStats(collaboratorStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidModalOpen = (request) => {
    setSelectedRequest(request);
    setBidForm({ price: '', deliveryTime: '', proposal: '' });
    setIsBidModalOpen(true);
  };

  const handleBidModalClose = () => {
    setIsBidModalOpen(false);
    setSelectedRequest(null);
    setBidForm({ price: '', deliveryTime: '', proposal: '' });
  };

  const handleSubmitBid = () => {
    if (!bidForm.price || !bidForm.deliveryTime || !bidForm.proposal) {
      alert('Please fill in all fields');
      return;
    }

    try {
      projectRequestService.submitBid(selectedRequest.id, {
        collaboratorId: currentCollaboratorId,
        collaboratorName: 'Dr. Aisha Patel',
        collaboratorAvatar: 'https://i.pravatar.cc/40?img=47',
        price: parseFloat(bidForm.price),
        deliveryTime: bidForm.deliveryTime,
        proposal: bidForm.proposal,
      });

      alert('Bid submitted successfully!');
      loadData();
      handleBidModalClose();
    } catch (error) {
      alert('Error submitting bid: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#fffbeb', color: WARNING, label: 'Pending' };
      case 'ACCEPTED':
        return { bg: '#f0fdf4', color: SUCCESS, label: 'Won' };
      case 'REJECTED':
        return { bg: '#fef2f2', color: DANGER, label: 'Lost' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', label: status };
    }
  };

  const filteredBids = filter === 'all' ? bids : bids.filter(b => b.status.toLowerCase() === filter);

  const stats_cards = [
    { label: 'Active Bids', value: stats.pendingBids, icon: <Clock size={20} color={PRIMARY} /> },
    { label: 'Won Projects', value: stats.acceptedBids, icon: <CheckCircle size={20} color={SUCCESS} /> },
    { label: 'Total Bids', value: stats.totalBids, icon: <TrendingUp size={20} color={PRIMARY} /> },
    { label: 'Earnings', value: `$${stats.totalEarnings.toLocaleString()}`, icon: <DollarSign size={20} color={SECONDARY} /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fb', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#111827', mb: 0.5 }}>
            Project Bids & Opportunities
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '1rem' }}>
            Discover, bid on, and win project requests from buyers
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
          {stats_cards.map((stat, idx) => (
            <Card key={idx} sx={{ borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1, backgroundColor: '#e6f7f6', borderRadius: 2, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 3, borderBottom: '1px solid #e5e7eb' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 'none' }}>
            <Tab label="Available Opportunities" sx={{ textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }} />
            <Tab label="My Bids" sx={{ textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }} />
          </Tabs>
        </Box>

        {/* Tab 1: Available Opportunities */}
        {tabValue === 0 && (
          <Box>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography>Loading opportunities...</Typography>
              </Box>
            ) : requests.length === 0 ? (
              <Card sx={{ borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none', p: 4, textAlign: 'center' }}>
                <AlertCircle size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                <Typography sx={{ color: '#6b7280' }}>
                  No matching opportunities found. Check back soon or update your profile!
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr' }, gap: 2.5 }}>
                {requests.map((request) => (
                  <OpportunityCard
                    key={request.id}
                    request={request}
                    onBid={() => handleBidModalOpen(request)}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: My Bids */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: filter === 'all' ? PRIMARY : '#fff',
                  color: filter === 'all' ? '#fff' : '#374151',
                  borderColor: '#d1d5db',
                  fontSize: '0.9rem',
                }}
              />
              <Chip
                label="Pending"
                onClick={() => setFilter('pending')}
                variant={filter === 'pending' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: filter === 'pending' ? WARNING : '#fff',
                  color: filter === 'pending' ? '#fff' : '#374151',
                  borderColor: '#d1d5db',
                  fontSize: '0.9rem',
                }}
              />
              <Chip
                label="Won"
                onClick={() => setFilter('accepted')}
                variant={filter === 'accepted' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: filter === 'accepted' ? SUCCESS : '#fff',
                  color: filter === 'accepted' ? '#fff' : '#374151',
                  borderColor: '#d1d5db',
                  fontSize: '0.9rem',
                }}
              />
            </Box>

            {filteredBids.length === 0 ? (
              <Card sx={{ borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none', p: 4, textAlign: 'center' }}>
                <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                <Typography sx={{ color: '#6b7280' }}>
                  No bids yet. Start bidding on opportunities!
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr' }, gap: 2.5 }}>
                {filteredBids.map((bid) => (
                  <BidCard key={bid.id} bid={bid} />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Bid Modal */}
        <Modal
          open={isBidModalOpen}
          onClose={handleBidModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500, sx: { backgroundColor: 'rgba(17, 24, 39, 0.7)' } }}
        >
          <Fade in={isBidModalOpen}>
            <Box sx={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 }, bgcolor: 'background.paper', borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              p: 0, overflow: 'hidden', outline: 'none', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
              {/* Modal Header */}
              <Box sx={{ px: 3, py: 2.5, backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                    Submit Your Bid
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mt: 0.3 }}>
                    {selectedRequest?.title}
                  </Typography>
                </Box>
                <IconButton onClick={handleBidModalClose} size="small" sx={{ color: '#9ca3af' }}>
                  <X size={20} />
                </IconButton>
              </Box>

              {/* Modal Content */}
              <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
                {selectedRequest && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3, p: 2, backgroundColor: '#f9fafb', borderRadius: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 0.3 }}>Budget Range</Typography>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: PRIMARY }}>
                        ${selectedRequest.budgetMin} - ${selectedRequest.budgetMax}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 0.3 }}>Deadline</Typography>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                        {new Date(selectedRequest.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 0.3 }}>Description</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.4 }}>
                        {selectedRequest.description.substring(0, 150)}...
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', mb: 0.8 }}>
                      Your Price Quote (USD) *
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="e.g. 3500"
                      value={bidForm.price}
                      onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', mb: 0.8 }}>
                      Delivery Timeline *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. 4 weeks"
                      value={bidForm.deliveryTime}
                      onChange={(e) => setBidForm({ ...bidForm, deliveryTime: e.target.value })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mt: 2.5 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', mb: 0.8 }}>
                    Your Proposal *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Explain your approach, experience, and why you're the best fit for this project..."
                    value={bidForm.proposal}
                    onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
              </Box>

              {/* Modal Footer */}
              <Box sx={{ p: 2.5, backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleBidModalClose} sx={{ px: 3, py: 1, color: '#6b7280', fontWeight: 700, textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitBid}
                  variant="contained"
                  startIcon={<Send size={16} />}
                  disabled={!bidForm.price || !bidForm.deliveryTime || !bidForm.proposal}
                  sx={{
                    px: 4, py: 1, backgroundColor: PRIMARY, fontWeight: 700, textTransform: 'none',
                    boxShadow: 'none', borderRadius: 2, '&:hover': { backgroundColor: '#e67e00' }
                  }}
                >
                  Submit Bid
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
}

/**
 * Opportunity Card Component
 */
function OpportunityCard({ request, onBid }) {
  return (
    <Card sx={{
      borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none',
      transition: 'all 0.3s ease', '&:hover': {
        transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(97,197,195,0.12)',
        borderColor: PRIMARY
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', mb: 0.5 }}>
              {request.title}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Posted by {request.buyerName}
            </Typography>
          </Box>
          <Chip
            label={`Priority: ${request.priorityLevel}`}
            size="small"
            sx={{
              backgroundColor: request.priorityLevel === 'High' ? '#fee2e2' : '#fef3c7',
              color: request.priorityLevel === 'High' ? DANGER : WARNING,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
        </Box>

        <Typography sx={{ fontSize: '0.9rem', color: '#6b7280', mb: 2, lineHeight: 1.5 }}>
          {request.description.substring(0, 120)}...
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3, p: 2, backgroundColor: '#f9fafb', borderRadius: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Budget</Typography>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: PRIMARY }}>
              ${request.budgetMin} - ${request.budgetMax}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Deadline</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
              {new Date(request.deadline).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Data Type</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
              {request.dataType}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Size</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
              {request.datasetSize}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: `1fr auto`, gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 0.5 }}>Bids Received</Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
              {request.bids?.length || 0} bids
            </Typography>
          </Box>
          <Button
            onClick={onBid}
            variant="contained"
            startIcon={<Plus size={16} />}
            sx={{
              backgroundColor: PRIMARY, color: '#fff', fontWeight: 700, textTransform: 'none',
              borderRadius: 1.5, alignSelf: 'flex-end', '&:hover': { backgroundColor: '#e67e00' }
            }}
          >
            Place Bid
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Bid Card Component
 */
function BidCard({ bid }) {
  const statusColor = getStatusColorHelper(bid.status);

  return (
    <Card sx={{
      borderRadius: 2, border: `1px solid ${statusColor.border}`, boxShadow: 'none',
      backgroundColor: statusColor.bg,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', mb: 0.5 }}>
              {bid.requestTitle}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
              From {bid.buyerName}
            </Typography>
          </Box>
          <Chip
            label={bid.status === 'PENDING' ? 'Awaiting Response' : bid.status === 'ACCEPTED' ? 'Won' : 'Lost'}
            size="small"
            sx={{
              backgroundColor: statusColor.chipBg,
              color: statusColor.color,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Your Bid</Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: PRIMARY }}>
              ${bid.price}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Budget Range</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
              ${bid.requestBudgetMin} - ${bid.requestBudgetMax}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Delivery</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
              {bid.deliveryTime}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 1.5, mb: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>
            <strong>Your Proposal:</strong> {bid.proposal}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          Submitted {new Date(bid.submittedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

function getStatusColorHelper(status) {
  switch (status) {
    case 'PENDING':
      return {
        bg: '#fffbeb',
        color: '#f59e0b',
        border: '#fed7aa',
        chipBg: '#fef3c7',
      };
    case 'ACCEPTED':
      return {
        bg: '#f0fdf4',
        color: '#16a34a',
        border: '#bbf7d0',
        chipBg: '#dbeafe',
      };
    case 'REJECTED':
      return {
        bg: '#fef2f2',
        color: '#dc2626',
        border: '#fecaca',
        chipBg: '#fee2e2',
      };
    default:
      return {
        bg: '#f9fafb',
        color: '#6b7280',
        border: '#e5e7eb',
        chipBg: '#f3f4f6',
      };
  }
}
