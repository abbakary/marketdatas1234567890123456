import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button, Chip, Tab, Tabs,
  Avatar, AvatarGroup, Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, IconButton,
} from '@mui/material';
import {
  FileText, DollarSign, Calendar, Users, Eye, X, CheckCircle, Clock,
  AlertCircle, TrendingUp, Star, Send, Award,
} from 'lucide-react';
import projectRequestService from '../../../utils/projectRequestService';

const PRIMARY = '#FF8C00';
const SECONDARY = '#20B2AA';
const SUCCESS = '#16a34a';
const WARNING = '#f59e0b';
const DANGER = '#dc2626';

export default function RequestsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isBidDetailsOpen, setIsBidDetailsOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    bidding: 0,
    accepted: 0,
    totalBids: 0,
    totalBudget: 0,
  });

  // Get current user (demo: buyer)
  const currentBuyerId = '4'; // Demo: Jane Buyer

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // Get buyer's requests
      const buyerRequests = projectRequestService.getRequestsByBuyer(currentBuyerId);
      setRequests(buyerRequests);

      // Get stats
      const requestStats = projectRequestService.getRequestStats(currentBuyerId);
      setStats(requestStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = (bid) => {
    setSelectedBid(bid);
    setAcceptDialogOpen(true);
  };

  const confirmAcceptBid = () => {
    try {
      projectRequestService.acceptBid(selectedRequest.id, selectedBid.id);
      alert('Bid accepted! This collaboration is now active.');
      loadData();
      setIsBidDetailsOpen(false);
      setAcceptDialogOpen(false);
    } catch (error) {
      alert('Error accepting bid: ' + error.message);
    }
  };

  const handleRejectBid = (bid) => {
    try {
      projectRequestService.rejectBid(selectedRequest.id, bid.id);
      alert('Bid rejected.');
      loadData();
      setIsBidDetailsOpen(false);
    } catch (error) {
      alert('Error rejecting bid: ' + error.message);
    }
  };

  const stats_cards = [
    { label: 'Total Requests', value: stats.total, icon: <FileText size={20} color={PRIMARY} /> },
    { label: 'Pending', value: stats.pending, icon: <Clock size={20} color={WARNING} /> },
    { label: 'With Bids', value: stats.bidding, icon: <TrendingUp size={20} color={PRIMARY} /> },
    { label: 'Active Projects', value: stats.accepted, icon: <CheckCircle size={20} color={SUCCESS} /> },
  ];

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status.toLowerCase() === filter);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fb', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#111827', mb: 0.5 }}>
            My Project Requests
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '1rem' }}>
            Track your project requests and manage collaborator bids
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
            <Tab label="All Requests" sx={{ textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }} />
            <Tab label="Active" sx={{ textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }} />
            <Tab label="Completed" sx={{ textTransform: 'none', fontSize: '0.95rem', fontWeight: 600 }} />
          </Tabs>
        </Box>

        {/* Filter Chips */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
            label="Bidding"
            onClick={() => setFilter('bidding')}
            variant={filter === 'bidding' ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: filter === 'bidding' ? SECONDARY : '#fff',
              color: filter === 'bidding' ? '#fff' : '#374151',
              borderColor: '#d1d5db',
              fontSize: '0.9rem',
            }}
          />
        </Box>

        {/* Requests List */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography>Loading requests...</Typography>
          </Box>
        ) : filteredRequests.length === 0 ? (
          <Card sx={{ borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none', p: 4, textAlign: 'center' }}>
            <AlertCircle size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <Typography sx={{ color: '#6b7280' }}>
              No requests found. Create one to get started!
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr' }, gap: 2.5 }}>
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onViewBids={() => {
                  setSelectedRequest(request);
                  setIsBidDetailsOpen(true);
                }}
              />
            ))}
          </Box>
        )}

        {/* Bid Details Dialog */}
        <Dialog
          open={isBidDetailsOpen}
          onClose={() => setIsBidDetailsOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedRequest && (
            <>
              <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>
                Bids for: {selectedRequest.title}
              </DialogTitle>
              <DialogContent sx={{ py: 3 }}>
                {selectedRequest.bids?.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Clock size={40} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                    <Typography sx={{ color: '#6b7280' }}>
                      No bids yet. Check back soon!
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'grid', gap: 2.5 }}>
                    {selectedRequest.bids?.map((bid) => (
                      <BidItemDialog
                        key={bid.id}
                        bid={bid}
                        requestBudget={[selectedRequest.budgetMin, selectedRequest.budgetMax]}
                        onAccept={() => handleAcceptBid(bid)}
                        onReject={() => handleRejectBid(bid)}
                      />
                    ))}
                  </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Accept Bid Confirmation Dialog */}
        <Dialog
          open={acceptDialogOpen}
          onClose={() => setAcceptDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>
            Accept This Bid?
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            {selectedBid && (
              <Box>
                <Typography sx={{ mb: 2 }}>
                  You are about to accept a bid from <strong>{selectedBid.collaboratorName}</strong>
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 2, mb: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 0.3 }}>
                        Bid Amount
                      </Typography>
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: PRIMARY }}>
                        ${selectedBid.price}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 0.3 }}>
                        Delivery Time
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                        {selectedBid.deliveryTime}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5 }}>
                  Proposal: {selectedBid.proposal}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setAcceptDialogOpen(false)} sx={{ color: '#6b7280', fontWeight: 700 }}>
              Cancel
            </Button>
            <Button
              onClick={confirmAcceptBid}
              variant="contained"
              sx={{
                backgroundColor: SUCCESS, fontWeight: 700, '&:hover': { backgroundColor: '#15803d' }
              }}
            >
              Accept Bid
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

/**
 * Request Card Component
 */
function RequestCard({ request, onViewBids }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#fffbeb', color: WARNING, label: 'Awaiting Bids' };
      case 'BIDDING':
        return { bg: '#e6f7f6', color: SECONDARY, label: 'Bidding in Progress' };
      case 'ACCEPTED':
        return { bg: '#f0fdf4', color: SUCCESS, label: 'Active' };
      case 'IN_PROGRESS':
        return { bg: '#e6f0ff', color: '#2563eb', label: 'In Progress' };
      case 'COMPLETED':
        return { bg: '#f0fdf4', color: SUCCESS, label: 'Completed' };
      case 'REJECTED':
        return { bg: '#fef2f2', color: DANGER, label: 'Rejected' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', label: status };
    }
  };

  const statusColor = getStatusColor(request.status);

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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {request.category}
              </Typography>
              <Box sx={{ width: 4, height: 4, backgroundColor: '#d1d5db', borderRadius: '50%' }} />
              <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {request.dataType}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={statusColor.label}
            size="small"
            sx={{
              backgroundColor: statusColor.bg,
              color: statusColor.color,
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
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Data Size</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
              {request.datasetSize}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Bids</Typography>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: SECONDARY }}>
              {request.bids?.length || 0}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 0.5 }}>Priority</Typography>
            <Chip
              label={request.priorityLevel}
              size="small"
              variant="outlined"
              sx={{
                borderColor: '#d1d5db',
                fontSize: '0.75rem',
              }}
            />
          </Box>
          <Button
            onClick={onViewBids}
            variant="contained"
            endIcon={<Eye size={16} />}
            disabled={!request.bids?.length}
            sx={{
              backgroundColor: request.bids?.length ? PRIMARY : '#d1d5db',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 1.5,
              '&:hover': { backgroundColor: request.bids?.length ? '#e67e00' : '#d1d5db' }
            }}
          >
            View Bids ({request.bids?.length || 0})
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Bid Item Dialog Component
 */
function BidItemDialog({ bid, requestBudget, onAccept, onReject }) {
  const withinBudget = bid.price >= requestBudget[0] && bid.price <= requestBudget[1];

  return (
    <Card sx={{
      borderRadius: 2,
      border: withinBudget ? `2px solid ${SUCCESS}` : '1px solid #e5e7eb',
      boxShadow: 'none',
      backgroundColor: withinBudget ? '#f0fdf420' : '#f9fafb',
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar
              src={bid.collaboratorAvatar}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                {bid.collaboratorName}
              </Typography>
              <Chip
                label={bid.status === 'PENDING' ? 'Awaiting Review' : bid.status === 'ACCEPTED' ? 'Won' : 'Rejected'}
                size="small"
                sx={{
                  backgroundColor: bid.status === 'PENDING' ? '#fffbeb' : bid.status === 'ACCEPTED' ? '#f0fdf4' : '#fef2f2',
                  color: bid.status === 'PENDING' ? WARNING : bid.status === 'ACCEPTED' ? SUCCESS : DANGER,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  mt: 0.5,
                }}
              />
            </Box>
          </Box>
          {withinBudget && (
            <Box sx={{ px: 1.5, py: 0.5, backgroundColor: `${SUCCESS}20`, borderRadius: 1, display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <CheckCircle size={14} color={SUCCESS} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: SUCCESS }}>
                Within Budget
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5, p: 1.5, backgroundColor: '#ffffff', borderRadius: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Bid Amount</Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: PRIMARY }}>
              ${bid.price}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.3 }}>Delivery</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
              {bid.deliveryTime}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2.5, p: 1.5, backgroundColor: '#ffffff', borderRadius: 1.5 }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', mb: 0.5 }}>
            Proposal
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>
            {bid.proposal}
          </Typography>
        </Box>

        {bid.status === 'PENDING' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Button
              onClick={onReject}
              variant="outlined"
              sx={{
                borderColor: DANGER, color: DANGER, fontWeight: 700, textTransform: 'none',
                '&:hover': { backgroundColor: `${DANGER}10` }
              }}
            >
              Reject
            </Button>
            <Button
              onClick={onAccept}
              variant="contained"
              startIcon={<Award size={16} />}
              sx={{
                backgroundColor: SUCCESS, color: '#fff', fontWeight: 700, textTransform: 'none',
                '&:hover': { backgroundColor: '#15803d' }
              }}
            >
              Accept
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
