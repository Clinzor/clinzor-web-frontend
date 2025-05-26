"use client";
import * as React from 'react';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Tooltip from '@mui/joy/Tooltip';

// Icons
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

// Mock data - importing from parent component or context would be better in a real app
const userData = [
  {
    id: 'USR-1232',
    joinedDate: 'Dec 19, 2022',
    status: 'Blocked',
    name: 'Ciaran Murray',
    email: 'ciaran.murray@email.com',
    initial: 'C',
  },
  {
    id: 'USR-1230',
    joinedDate: 'Oct 23, 2022',
    status: 'Blocked',
    name: 'Charles Fulton',
    email: 'fulton@email.com',
    initial: 'C',
  },
];

// Status chip component for consistency
const StatusChip: React.FC<{ status: string }> = ({ status }) => (
  <Chip
    variant="soft"
    size="sm"
    startDecorator={<BlockIcon />}
    color="danger"
  >
    {status}
  </Chip>
);

// Component for user action buttons
const UserActions: React.FC<{ onView: () => void; onUnblock: () => void; onDelete: () => void }> = ({ onView, onUnblock, onDelete }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
    <Tooltip title="View User">
      <IconButton
        size="sm"
        variant="soft"
        color="primary"
        onClick={onView}
      >
        <VisibilityRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    
    <Tooltip title="Unblock User">
      <IconButton
        size="sm"
        variant="soft"
        color="success"
        onClick={onUnblock}
      >
        <CheckRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    
    <Tooltip title="Delete User">
      <IconButton
        size="sm"
        variant="soft"
        color="danger"
        onClick={onDelete}
      >
        <DeleteRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

export default function BlockedUsersTable() {
  const [blockedUsers, setBlockedUsers] = React.useState(userData);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openUserModal, setOpenUserModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<{
    id: string;
    joinedDate: string;
    status: string;
    name: string;
    email: string;
    initial: string;
  } | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const usersPerPage = 5;

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    return blockedUsers.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [blockedUsers, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, currentPage]);

  // Handle user unblocking
  const handleUnblockUser = (userId: string) => {
    setBlockedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId)
    );
    // In a real app, you would update the status and not remove the user from this list
    // But for this UI demo, we'll just remove them from the blocked users list
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (userToDelete) {
      setBlockedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
      setUserToDelete(null);
      setOpenDeleteModal(false);
      
      // Adjust current page if needed after deletion
      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Handle user view
  const handleViewUser = (user: { id: string; joinedDate: string; status: string; name: string; email: string; initial: string }) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with Search */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
          bgcolor: 'background.level1',
          p: { xs: 2, sm: 3 },
          borderRadius: 'md',
        }}
      >
        <Typography level="h4">Blocked Users</Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          width: { xs: '100%', sm: '50%' }
        }}>
          <Input
            size="sm"
            placeholder="Search blocked users..."
            startDecorator={<SearchRoundedIcon />}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            sx={{ flexGrow: 1, minWidth: { sm: 200 } }}
          />
        </Box>
      </Box>

      {/* Mobile View */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }}>
        {paginatedUsers.length === 0 ? (
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography level="body-md">No blocked users found</Typography>
          </Sheet>
        ) : (
          paginatedUsers.map((user) => (
            <Sheet
              key={user.id}
              variant="outlined"
              sx={{
                borderRadius: 'md',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 2,
                  p: 3,
                  width: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar size="md" variant="soft" color="primary">{user.initial}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography level="title-md">{user.name}</Typography>
                    <Typography level="body-sm">{user.email}</Typography>
                  </Box>
                  <StatusChip status={user.status} />
                </Box>
                
                <Divider />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <Box>
                    <Typography level="body-xs" color="neutral">ID: {user.id}</Typography>
                    <Typography level="body-xs" color="neutral">Joined: {user.joinedDate}</Typography>
                  </Box>
                  
                  <UserActions 
                    onView={() => handleViewUser(user)}
                    onUnblock={() => handleUnblockUser(user.id)}
                    onDelete={() => {
                      setUserToDelete(user.id);
                      setOpenDeleteModal(true);
                    }}
                  />
                </Box>
              </Box>
            </Sheet>
          ))
        )}
      </Box>

      {/* Desktop Table View */}
      <Sheet
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: '100%',
          borderRadius: 'md',
          overflow: 'auto',
          mb: 2,
        }}
      >
        {/* Table Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
            alignItems: 'center',
            px: 2,
            py: 1.5,
            bgcolor: 'background.level1',
          }}
        >
          <Typography level="body-xs" fontWeight="lg">User</Typography>
          <Typography level="body-xs" fontWeight="lg">Email</Typography>
          <Typography level="body-xs" fontWeight="lg">Joined Date</Typography>
          <Typography level="body-xs" fontWeight="lg">Status</Typography>
          <Typography level="body-xs" fontWeight="lg" textAlign="right">Actions</Typography>
        </Box>
        
        <Divider />
        
        {/* Table Body */}
        {paginatedUsers.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography level="body-md">No blocked users found</Typography>
          </Box>
        ) : (
          paginatedUsers.map((user, index) => (
            <React.Fragment key={user.id}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                  width: '100%',
                  '&:hover': { bgcolor: 'background.level1' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar size="sm" variant="soft" color="primary">{user.initial}</Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography level="body-sm" fontWeight="md" noWrap>
                      {user.name}
                    </Typography>
                    <Typography level="body-xs" color="neutral" noWrap>
                      {user.id}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography level="body-sm" noWrap>
                  {user.email}
                </Typography>
                
                <Typography level="body-sm">
                  {user.joinedDate}
                </Typography>
                
                <StatusChip status={user.status} />
                
                <UserActions 
                  onView={() => handleViewUser(user)}
                  onUnblock={() => handleUnblockUser(user.id)}
                  onDelete={() => {
                    setUserToDelete(user.id);
                    setOpenDeleteModal(true);
                  }}
                />
              </Box>
              {index < paginatedUsers.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </Sheet>
      
      {/* Pagination Controls */}
      {totalPages > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            px: { xs: 2, sm: 3 },
            width: '100%',
          }}
        >
          <Typography level="body-sm">
            {filteredUsers.length} blocked {filteredUsers.length === 1 ? 'user' : 'users'}
          </Typography>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                aria-label="previous page"
                variant="outlined"
                color="neutral"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              
              <Typography level="body-sm" sx={{ minWidth: 80, textAlign: 'center' }}>
                Page {currentPage} of {totalPages}
              </Typography>
              
              <IconButton
                aria-label="next page"
                variant="outlined"
                color="neutral"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {/* User Details Modal */}
      <Modal open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <ModalDialog 
          size="md"
          layout="center"
          variant="outlined"
          sx={{ 
            width: { xs: '90%', sm: '80%', md: 600 },
            maxWidth: '100%',
            borderRadius: 'md',
            p: { xs: 2, sm: 3 }
          }}
        >
          <ModalClose />
          
          {selectedUser && (
            <>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: 2, 
                mb: 3 
              }}>
                <Avatar 
                  size="lg" 
                  variant="soft" 
                  color="primary"
                  sx={{ width: 80, height: 80, fontSize: '2rem' }}
                >
                  {selectedUser.initial}
                </Avatar>
                
                <Box sx={{ 
                  textAlign: { xs: 'center', sm: 'left' },
                  mt: { xs: 1, sm: 0 }
                }}>
                  <Typography level="h4">{selectedUser.name}</Typography>
                  <Typography level="body-md">{selectedUser.email}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <StatusChip status={selectedUser.status} />
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 3,
                mb: 3
              }}>
                <FormControl>
                  <FormLabel>User ID</FormLabel>
                  <Typography level="body-md">{selectedUser.id}</Typography>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Joined Date</FormLabel>
                  <Typography level="body-md">{selectedUser.joinedDate}</Typography>
                </FormControl>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="neutral"
                  onClick={() => setOpenUserModal(false)}
                >
                  Close
                </Button>
                
                <Button 
                  variant="solid" 
                  color="success"
                  startDecorator={<CheckRoundedIcon />}
                  onClick={() => {
                    handleUnblockUser(selectedUser.id);
                    setOpenUserModal(false);
                  }}
                >
                  Unblock User
                </Button>
              </Box>
            </>
          )}
        </ModalDialog>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <ModalDialog 
          variant="outlined" 
          role="alertdialog"
          layout="center"
          sx={{ 
            width: { xs: '90%', sm: '80%', md: 450 },
            maxWidth: '100%',
            borderRadius: 'md',
            p: { xs: 2, sm: 3 }
          }}
        >
          <Typography level="h4" mb={2}>
            Confirm Deletion
          </Typography>
          
          <Typography level="body-md">
            Are you sure you want to permanently delete this user? This action cannot be undone.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="plain" 
              color="neutral" 
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </Button>
            
            <Button 
              variant="solid" 
              color="danger" 
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}