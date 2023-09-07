// assets
import { IconKey, IconUser, IconUsers, IconUserPlus } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconUser,
  IconUsers,
  IconUserPlus
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  type: 'group',
  children: [
    {
      id: 'Customer',
      title: 'Customer',
      caption: 'Customer Details',
      icon: icons.IconUser,
      type: 'collapse',
      children: [
        {
          id: 'Customers',
          title: 'Customers',
          type: 'item',
          icon: icons.IconUsers,
          url: '/Customers',
          breadcrumbs: false
        },
        {
          id: 'createCustomer',
          title: 'Create Customer',
          type: 'item',
          icon: icons.IconUserPlus,
          url: '/createCustomer',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default pages;
