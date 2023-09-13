// assets
import { IconHistory, IconTicket } from '@tabler/icons';

// constant
const icons = {
  IconHistory,
  IconTicket
};

const pages = {
  id: 'pages',
  type: 'group',
  children: [
    {
      id: 'bookingMain',
      title: 'Bookings',
      caption: 'Booking Details',
      icon: icons.IconTicket,
      type: 'collapse',
      children: [
        {
          id: 'Booking',
          title: 'Booking History',
          type: 'item',
          icon: icons.IconHistory,
          url: '/Bookings',
          breadcrumbs: false
        },
        {
          id: 'createBooking',
          title: 'Create Booking',
          type: 'item',
          icon: icons.IconTicket,
          url: '/createBooking',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default pages;
