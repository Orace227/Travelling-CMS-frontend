// assets
import { IconBuildingBridge, IconPlus } from '@tabler/icons';

// constant
const icons = {
  IconBuildingBridge,
  IconPlus
};

const Inquiry = {
  id: 'Inquiry',
  type: 'group',
  children: [
    {
      id: 'InquiryMain',
      title: 'Inquiries',
      caption: 'Inquiry Details',
      icon: icons.IconBuildingBridge,
      type: 'collapse',
      children: [
        {
          id: 'Inquiry',
          title: 'Inquiries',
          type: 'item',
          icon: icons.IconBuildingBridge,
          url: '/GetInquiry',
          breadcrumbs: false
        },
        {
          id: 'ConfirmedInquiry',
          title: 'Confirmed Inquiries',
          type: 'item',
          icon: icons.IconBuildingBridge,
          url: '/GetConfirmedInquiry',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default Inquiry;
