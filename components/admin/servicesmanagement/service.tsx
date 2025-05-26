"use client";
import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Card from '@mui/joy/Card';
import Textarea from '@mui/joy/Textarea';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CategoryIcon from '@mui/icons-material/Category';

// Sample service data
const initialServiceData = [
  {
    id: 'SRV-1001',
    name: 'General Consultation',
    category: 'Consultation',
    minPrice: 500,
    maxPrice: 1000,
    description: 'Regular doctor consultation for general health issues',
    status: 'Active',
    color: '#4CAF50',
    icon: 'GC'
  },
  {
    id: 'SRV-1002',
    name: 'Blood Test - Complete',
    category: 'Laboratory',
    minPrice: 1200,
    maxPrice: 1500,
    description: 'Complete blood profile including CBC, lipid profile, and blood sugar',
    status: 'Active',
    color: '#2196F3',
    icon: 'BT'
  },
  {
    id: 'SRV-1003',
    name: 'X-Ray (Single)',
    category: 'Radiology',
    minPrice: 800,
    maxPrice: 1200,
    description: 'X-ray imaging for a single body part',
    status: 'Active',
    color: '#9C27B0',
    icon: 'XR'
  },
  {
    id: 'SRV-1004',
    name: 'Dental Cleaning',
    category: 'Dental',
    minPrice: 1500,
    maxPrice: 2500,
    description: 'Professional dental cleaning and check-up',
    status: 'Active',
    color: '#FF9800',
    icon: 'DC'
  },
  {
    id: 'SRV-1005',
    name: 'Physiotherapy Session',
    category: 'Therapy',
    minPrice: 700,
    maxPrice: 1200,
    description: 'Single physiotherapy session including assessment and treatment',
    status: 'Inactive',
    color: '#F44336',
    icon: 'PT'
  },
];

// Available service categories
const serviceCategories = [
  'Consultation',
  'Laboratory',
  'Radiology',
  'Dental',
  'Therapy',
  'Surgery',
  'Wellness',
  'Other'
];

function descendingComparator(a: { [x: string]: number; }, b: { [x: string]: number; }, orderBy: string | number) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: { [key: string]: any }, b: { [key: string]: any }) => descendingComparator(a, b, orderBy)
    : (a: { [key: string]: any }, b: { [key: string]: any }) => -descendingComparator(a, b, orderBy);
}

function RowMenu({
  onEdit,
  onDelete,
  onToggleStatus,
  status
}: {
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  status: 'Active' | 'Inactive';
}) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={onEdit}>Edit Service</MenuItem>
        <MenuItem onClick={onToggleStatus}>
          {status === 'Active' ? 'Deactivate Service' : 'Activate Service'}
        </MenuItem>
        <MenuItem onClick={onDelete} color="danger">Delete Service</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function ServiceManagement() {
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Service data state
  const [serviceData, setServiceData] = React.useState(initialServiceData);
  
  // Modal states
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<{
    id: string;
    name: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    description: string;
    status: string;
    color: string;
    icon: string;
  } | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    category: 'Consultation',
    minPrice: 0,
    maxPrice: 0,
    description: '',
    status: 'Active'
  });
  
  const handleRequestSort = (property: React.SetStateAction<string>) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleFormChange = (field: string, value: string | null) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleAddService = () => {
    // Generate a new ID
    const newId = `SRV-${1006 + serviceData.length}`;
    
    // Create icon from name
    const nameParts = formData.name.split(' ');
    const icon = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : `${nameParts[0][0]}${nameParts[0][1] || ''}`;
    
    // Generate a color based on category
    const colors = {
      'Consultation': '#4CAF50',
      'Laboratory': '#2196F3',
      'Radiology': '#9C27B0',
      'Dental': '#FF9800',
      'Therapy': '#F44336',
      'Surgery': '#795548',
      'Wellness': '#00BCD4',
      'Other': '#607D8B'
    };
    
    const newService = {
      ...formData,
      id: newId,
      icon,
      color: colors[formData.category as keyof typeof colors] || '#607D8B',
      minPrice: Number(formData.minPrice),
      maxPrice: Number(formData.maxPrice)
    };
    
    setServiceData([newService, ...serviceData]);
    
    // Reset form
    resetForm();
    setOpenAddModal(false);
  };
  
  const handleEditService = () => {
    if (selectedService) {
      // Update the service data
      setServiceData(
        serviceData.map((service) =>
          service.id === selectedService.id
            ? { 
                ...service, 
                name: formData.name,
                category: formData.category,
                minPrice: Number(formData.minPrice),
                maxPrice: Number(formData.maxPrice),
                description: formData.description,
                status: formData.status
              }
            : service
        )
      );
      setOpenEditModal(false);
      setSelectedService(null);
      resetForm();
    }
  };
  
  const handleToggleStatus = (id: string) => {
    setServiceData(
      serviceData.map((service) =>
        service.id === id
          ? { ...service, status: service.status === "Active" ? "Inactive" : "Active" }
          : service
      )
    );
  };
  
  const handleDeleteService = () => {
    if (selectedService) {
      setServiceData(serviceData.filter((service) => service.id !== selectedService.id));
      setOpenDeleteModal(false);
      setSelectedService(null);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Consultation',
      minPrice: 0,
      maxPrice: 0,
      description: '',
      status: 'Active'
    });
  };
  
  const openEditForm = (service: {
    id: string;
    name: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    description: string;
    status: string;
    color: string;
    icon: string;
  }) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      category: service.category,
      minPrice: service.minPrice,
      maxPrice: service.maxPrice,
      description: service.description,
      status: service.status
    });
    setOpenEditModal(true);
  };
  
  const prepareForDelete = (service: {
    id: string;
    name: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    description: string;
    status: string;
    color: string;
    icon: string;
  }) => {
    setSelectedService(service);
    setOpenDeleteModal(true);
  };
  
  // Filter services based on search and filters
  const filteredServices = serviceData.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        service.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          value={statusFilter}
          onChange={(_, value) => setStatusFilter(value || 'all')}
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Category</FormLabel>
        <Select
          size="sm"
          value={categoryFilter}
          onChange={(_, value) => setCategoryFilter(value || 'all')}
          placeholder="Filter by category"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="all">All Categories</Option>
          {serviceCategories.map((category) => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );

  // Calculate statistics
  const activeServices = filteredServices.filter(service => service.status === 'Active').length;
  const categories = [...new Set(filteredServices.map(service => service.category))].length;
  const avgMinPrice = filteredServices.length ? 
    filteredServices.reduce((sum, service) => sum + service.minPrice, 0) / filteredServices.length : 0;
  const avgMaxPrice = filteredServices.length ? 
    filteredServices.reduce((sum, service) => sum + service.maxPrice, 0) / filteredServices.length : 0;

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="h3">Services Management</Typography>
        <Button startDecorator={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Add Service
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <Typography level="body-sm">Total Services</Typography>
          <Typography level="h4">{filteredServices.length}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MedicalServicesIcon fontSize="small" />
            <Typography level="body-xs">{activeServices} active services</Typography>
          </Box>
        </Card>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <Typography level="body-sm">Categories</Typography>
          <Typography level="h4">{categories}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CategoryIcon fontSize="small" />
            <Typography level="body-xs">Distinct service categories</Typography>
          </Box>
        </Card>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <Typography level="body-sm">Average Price Range</Typography>
          <Typography level="h4">₹{Math.round(avgMinPrice)} - ₹{Math.round(avgMaxPrice)}</Typography>
          <Typography level="body-xs">Min-max price average</Typography>
        </Card>
      </Box>
      
      {/* Mobile Search and Filters */}
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search services"
          startDecorator={<SearchIcon />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setFilterOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setFilterOpen(false)}>
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
          <FormLabel>Search for services</FormLabel>
          <Input 
            size="sm" 
            placeholder="Search by name, ID, or description" 
            startDecorator={<SearchIcon />} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Services Table */}
      <Sheet
        className="ServiceTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
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
                    selected.length > 0 && selected.length !== filteredServices.length
                  }
                  checked={selected.length === filteredServices.length && filteredServices.length > 0}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? filteredServices.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === filteredServices.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Typography
                  level="body-sm"
                  sx={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handleRequestSort('id')}
                >
                  Service ID
                  <ArrowDropDownIcon
                    sx={{
                      transition: '0.2s',
                      transform:
                        orderBy === 'id' && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                  />
                </Typography>
              </th>
              <th style={{ width: 240, padding: '12px 6px' }}>
                <Typography
                  level="body-sm"
                  sx={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handleRequestSort('name')}
                >
                  Service Name
                  <ArrowDropDownIcon
                    sx={{
                      transition: '0.2s',
                      transform:
                        orderBy === 'name' && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                  />
                </Typography>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>Category</th>
              <th style={{ width: 180, padding: '12px 6px' }}>Price Range</th>
              <th style={{ width: 260, padding: '12px 6px' }}>Description</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 100, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              [...filteredServices]
                .sort(getComparator(order, orderBy))
                .map((row) => (
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
                        <Avatar size="sm" sx={{ bgcolor: row.color }}>{row.icon}</Avatar>
                        <Typography level="body-sm" fontWeight="md">{row.name}</Typography>
                      </Box>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        size="sm"
                        color="neutral"
                      >
                        {row.category}
                      </Chip>
                    </td>
                    <td>
                      <Typography level="body-sm">₹{row.minPrice} - ₹{row.maxPrice}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs" noWrap sx={{ maxWidth: 250 }}>
                        {row.description}
                      </Typography>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        size="sm"
                        color={row.status === 'Active' ? 'success' : 'neutral'}
                      >
                        {row.status}
                      </Chip>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          variant="plain"
                          color="primary"
                          size="sm"
                          onClick={() => openEditForm(row)}
                        >
                          <EditIcon />
                        </IconButton>
                        <RowMenu 
                          status={row.status === "Active" ? "Active" : "Inactive"}
                          onToggleStatus={() => handleToggleStatus(row.id)} 
                          onEdit={() => openEditForm(row)} 
                          onDelete={() => prepareForDelete(row)}
                        />
                      </Box>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '16px' }}>
                  <Typography level="body-sm">No service entries found</Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* Mobile Service List (shown on xs screens) */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
        {filteredServices.length > 0 ? (
          filteredServices.map((row) => (
            <Card key={row.id} sx={{ mb: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar size="sm" sx={{ bgcolor: row.color }}>{row.icon}</Avatar>
                  <Typography level="title-md">{row.name}</Typography>
                </Box>
                <Chip
                  variant="soft"
                  size="sm"
                  color={row.status === "Active" ? "success" : "neutral"}
                >
                  {row.status}
                </Chip>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">ID:</Typography>
                <Typography level="body-xs">{row.id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Category:</Typography>
                <Typography level="body-xs">{row.category}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Price Range:</Typography>
                <Typography level="body-sm">₹{row.minPrice} - ₹{row.maxPrice}</Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography level="body-xs">Description:</Typography>
                <Typography level="body-xs" sx={{ mt: 0.5 }}>{row.description}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="primary"
                  onClick={() => openEditForm(row)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  color={row.status === 'Active' ? 'warning' : 'success'}
                  onClick={() => handleToggleStatus(row.id)}
                >
                  {row.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography level="body-sm">No service entries found</Typography>
          </Card>
        )}
      </Box>

      {/* Bottom Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: 'background.level1',
          borderRadius: 'sm',
          mt: 1,
        }}
      >
        <Typography level="body-sm">
          {selected.length} of {filteredServices.length} selected
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="soft"
            color="neutral"
            size="sm"
            onClick={() => setSelected([])}
          >
            Deselect All
          </Button>
          {selected.length > 0 && (
            <Button 
              variant="solid" 
              color={
                serviceData.filter(s => selected.includes(s.id) && s.status === 'Active').length > 0
                  ? 'warning' 
                  : 'success'
              }
              size="sm"
              onClick={() => {
                // Toggle status of selected services
                setServiceData(
                  serviceData.map((service) => {
                    if (selected.includes(service.id)) {
                      // If any selected services are active, deactivate all selected
                      // Otherwise activate all selected
                      const hasActive = serviceData.some(
                        s => selected.includes(s.id) && s.status === 'Active'
                      );
                      return { 
                        ...service, 
                        status: hasActive ? 'Inactive' : 'Active' 
                      };
                    }
                    return service;
                  })
                );
                setSelected([]);
              }}
            >
              {serviceData.some(s => selected.includes(s.id) && s.status === 'Active')
                ? "Deactivate Selected" 
                : "Activate Selected"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Add Service Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Add New Service</Typography>
          <Divider sx={{ my: 2 }} />
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Service Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              placeholder="e.g., General Consultation"
            />
          </FormControl>
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Category</FormLabel>
            <Select
              value={formData.category}
              onChange={(_, value) => handleFormChange('category', value)}
            >
              {serviceCategories.map((category) => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Minimum Price (₹)</FormLabel>
              <Input
                type="number"
                value={formData.minPrice}
                onChange={(e) => handleFormChange('minPrice', e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Maximum Price (₹)</FormLabel>
              <Input
                type="number"
                value={formData.maxPrice}
                onChange={(e) => handleFormChange('maxPrice', e.target.value)}
              />
            </FormControl>
          </Box>
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Description</FormLabel>
            <Textarea
              minRows={3}
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Brief description of the service"
            />
          </FormControl>
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Status</FormLabel>
            <Select
              value={formData.status}
              onChange={(_, value) => handleFormChange('status', value)}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </FormControl>

          <Button onClick={handleAddService} fullWidth color="primary">
            Save Service
          </Button>
        </ModalDialog>
      </Modal>

      {/* Edit Service Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Edit Service</Typography>
          <Divider sx={{ my: 2 }} />

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Service Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              placeholder="e.g., General Consultation"
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Category</FormLabel>
            <Select
              value={formData.category}
              onChange={(_, value) => handleFormChange('category', value)}
            >
              {serviceCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Minimum Price (₹)</FormLabel>
              <Input
                type="number"
                value={formData.minPrice}
                onChange={(e) => handleFormChange('minPrice', e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Maximum Price (₹)</FormLabel>
              <Input
                type="number"
                value={formData.maxPrice}
                onChange={(e) => handleFormChange('maxPrice', e.target.value)}
              />
            </FormControl>
          </Box>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Description</FormLabel>
            <Textarea
              minRows={3}
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Brief description of the service"
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Status</FormLabel>
            <Select
              value={formData.status}
              onChange={(_, value) => handleFormChange('status', value)}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </FormControl>

          <Button onClick={handleEditService} fullWidth color="primary">
            Update Service
          </Button>
        </ModalDialog>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Delete Service</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedService?.name}</strong>? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDeleteService}>
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
