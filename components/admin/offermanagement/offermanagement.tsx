"use client";
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Tooltip from '@mui/joy/Tooltip';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import PendingIcon from '@mui/icons-material/Pending';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Sample offer data
const offersData = [
  {
    id: 'OFFER-5001',
    clinicName: 'Sunshine Medical Center',
    clinicLogo: 'SM',
    offerTitle: 'Family Doctor Position - Full Time',
    specialty: 'Family Medicine',
    compensation: '$250,000/year',
    location: 'Los Angeles, CA',
    status: 'Pending',
    postedDate: 'May 10, 2025',
    expirationDate: 'June 10, 2025',
    description: 'Join our team as a full-time family physician. Competitive salary with excellent benefits package including health insurance, retirement plan, and paid time off.'
  },
  {
    id: 'OFFER-5002',
    clinicName: 'Urban Healthcare Clinic',
    clinicLogo: 'UH',
    offerTitle: 'Cardiologist - Part Time',
    specialty: 'Cardiology',
    compensation: '$180/hour',
    location: 'New York, NY',
    status: 'Approved',
    postedDate: 'May 8, 2025',
    expirationDate: 'June 8, 2025',
    description: 'Looking for a board-certified cardiologist to join our team for 20 hours per week. Flexible scheduling available.'
  },
  {
    id: 'OFFER-5003',
    clinicName: 'Riverside Family Practice',
    clinicLogo: 'RF',
    offerTitle: 'Pediatrician - Full Time',
    specialty: 'Pediatrics',
    compensation: '$230,000/year',
    location: 'Chicago, IL',
    status: 'Rejected',
    postedDate: 'May 5, 2025',
    expirationDate: 'June 5, 2025',
    description: 'Seeking a compassionate pediatrician to join our growing practice. Experience with newborns and adolescents required.'
  },
  {
    id: 'OFFER-5004',
    clinicName: 'Green Valley Medical Center',
    clinicLogo: 'GV',
    offerTitle: 'Oncologist - Locum Tenens',
    specialty: 'Oncology',
    compensation: '$1,500/day',
    location: 'Seattle, WA',
    status: 'Pending',
    postedDate: 'May 3, 2025',
    expirationDate: 'June 3, 2025',
    description: 'Temporary position available for 3 months to cover a physician on leave. Possibility of extension or permanent position.'
  },
  {
    id: 'OFFER-5005',
    clinicName: 'Coastal Wellness Clinic',
    clinicLogo: 'CW',
    offerTitle: 'Sports Medicine Physician',
    specialty: 'Sports Medicine',
    compensation: '$240,000/year',
    location: 'Miami, FL',
    status: 'Approved',
    postedDate: 'April 30, 2025',
    expirationDate: 'May 30, 2025',
    description: 'Join our multidisciplinary sports medicine team. Experience working with athletes preferred. Competitive benefits package included.'
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>View Details</MenuItem>
        <MenuItem>Contact Clinic</MenuItem>
        <MenuItem>Flag Offer</MenuItem>
        <Divider />
        <MenuItem color="danger">Hide Offer</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function OfferManagementTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [selectedOffer, setSelectedOffer] = React.useState<any>(null);

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Specialty</FormLabel>
        <Select size="sm" placeholder="All Specialties">
          <Option value="all">All</Option>
          <Option value="familyMedicine">Family Medicine</Option>
          <Option value="cardiology">Cardiology</Option>
          <Option value="oncology">Oncology</Option>
          <Option value="sportsMedicine">Sports Medicine</Option>
          <Option value="pediatrics">Pediatrics</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Location</FormLabel>
        <Select size="sm" placeholder="All Locations">
          <Option value="all">All</Option>
          <Option value="losAngeles">Los Angeles, CA</Option>
          <Option value="newYork">New York, NY</Option>
          <Option value="chicago">Chicago, IL</Option>
          <Option value="seattle">Seattle, WA</Option>
          <Option value="miami">Miami, FL</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  const handleViewOffer = (offer: any) => {
    setSelectedOffer(offer);
    setOpenViewModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <ThumbUpAltIcon />;
      case 'Rejected':
        return <ThumbDownAltIcon />;
      case 'Pending':
        return <PendingIcon />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string): ColorPaletteProp => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const handleApprove = (offerId: string) => {
    // Here you would implement logic to approve the offer
    console.log(`Approving offer ${offerId}`);
  };

  const handleReject = (offerId: string) => {
    // Here you would implement logic to reject the offer
    console.log(`Rejecting offer ${offerId}`);
  };

  return (
    <React.Fragment>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography level="h2">Offer Management</Typography>
        <Button startDecorator={<AttachMoneyIcon />} color="primary">
          Add New Offer
        </Button>
      </Box>

      {/* Mobile Search and Filters */}
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search offers"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Apply Filters
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* Desktop Filters */}
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search offers</FormLabel>
          <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Offers Table */}
      <Sheet
        className="OffersTableContainer"
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== offersData.length
                  }
                  checked={selected.length === offersData.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? offersData.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === offersData.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: 'lg',
                      '& svg': {
                        transition: '0.2s',
                        transform:
                          order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                      },
                    },
                  ]}
                >
                  Offer ID
                </Link>
              </th>
              <th style={{ width: 180, padding: '12px 6px' }}>Clinic</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Offer Title</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Specialty</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Compensation</th>
              <th style={{ width: 110, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Posted Date</th>
              <th style={{ width: 180, padding: '12px 6px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...offersData].sort(getComparator(order, 'id')).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 48 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar size="sm">{row.clinicLogo}</Avatar>
                    <Typography level="body-xs" fontWeight="lg">
                      {row.clinicName}
                    </Typography>
                  </Box>
                </td>
                <td>
                  <Typography level="body-xs" fontWeight="lg">
                    {row.offerTitle}
                  </Typography>
                  <Typography level="body-xs">
                    {row.location}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.specialty}</Typography>
                </td>
                <td>
                  <Typography level="body-xs" fontWeight="lg">
                    {row.compensation}
                  </Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={getStatusIcon(row.status)}
                    color={getStatusColor(row.status)}
                    sx={{ textTransform: 'capitalize' }}    
                  >                       
                    {row.status}
                  </Chip>     
                </td>   
                <td>
                  <Typography level="body-xs">{row.postedDate}</Typography>
                  <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    Expires: {row.expirationDate}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        variant="plain"
                        color="neutral"
                        size="sm"
                        onClick={() => handleViewOffer(row)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {row.status === 'Pending' && (
                      <>
                        <Tooltip title="Approve Offer">
                          <IconButton
                            variant="plain"
                            color="success"
                            size="sm"
                            onClick={() => handleApprove(row.id)}
                          >
                            <ThumbUpAltIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Offer">
                          <IconButton
                            variant="plain"
                            color="danger"
                            size="sm"
                            onClick={() => handleReject(row.id)}
                          >
                            <ThumbDownAltIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <RowMenu />
                  </Box>                
                </td>   
              </tr>   
            ))} 
          </tbody>            
        </Table>    
      </Sheet>

      {/* Pagination and Action Bar */}                
      <Box        
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: 'background.level1',
        }}      
      >
        <Typography level="body-sm">
          {selected.length} of {offersData.length} selected
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="soft"
            color="neutral"
            size="sm"  
            startDecorator={<KeyboardArrowLeftIcon />}
          >
            Previous
          </Button>
          <Button
            variant="soft"
            color="neutral"
            size="sm"
            endDecorator={<KeyboardArrowRightIcon />}
          >
            Next
          </Button>
        </Box>                          
      </Box>  

      {/* View Offer Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <ModalDialog aria-labelledby="view-offer-modal" size="lg">
          <ModalClose />
          <Typography id="view-offer-modal" level="h2">
            Offer Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          {selectedOffer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size="lg">{selectedOffer.clinicLogo}</Avatar>
                <Box>
                  <Typography level="h3">{selectedOffer.offerTitle}</Typography>
                  <Typography level="body-md">{selectedOffer.clinicName}</Typography>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={getStatusIcon(selectedOffer.status)}
                    color={getStatusColor(selectedOffer.status)}
                    sx={{ mt: 1 }}
                  >
                    {selectedOffer.status}
                  </Chip>
                </Box>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography level="body-sm" fontWeight="lg">Specialty</Typography>
                  <Typography level="body-md">{selectedOffer.specialty}</Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" fontWeight="lg">Location</Typography>
                  <Typography level="body-md">{selectedOffer.location}</Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" fontWeight="lg">Compensation</Typography>
                  <Typography level="body-md">{selectedOffer.compensation}</Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" fontWeight="lg">Posted Date</Typography>
                  <Typography level="body-md">{selectedOffer.postedDate}</Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" fontWeight="lg">Offer ID</Typography>
                  <Typography level="body-md">{selectedOffer.id}</Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" fontWeight="lg">Expiration Date</Typography>
                  <Typography level="body-md">{selectedOffer.expirationDate}</Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography level="body-sm" fontWeight="lg">Description</Typography>
                <Typography level="body-md">{selectedOffer.description}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                {selectedOffer.status === 'Pending' && (
                  <>
                    <Button
                      color="danger"
                      variant="soft"
                      onClick={() => handleReject(selectedOffer.id)}
                      startDecorator={<ThumbDownAltIcon />}
                    >
                      Reject Offer
                    </Button>
                    <Button
                      color="success"
                      onClick={() => handleApprove(selectedOffer.id)}
                      startDecorator={<ThumbUpAltIcon />}
                    >
                      Approve Offer
                    </Button>
                  </>
                )}
                {selectedOffer.status !== 'Pending' && (
                  <Button
                    color="primary"
                    onClick={() => setOpenViewModal(false)}
                  >
                    Close
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );  
}