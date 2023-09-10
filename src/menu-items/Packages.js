// assets
import { IconPackgeExport,IconPackages,IconBox } from '@tabler/icons';

// constant
const icons = {
    IconBox,
    IconPackgeExport,
  IconPackages
};

const pages = {
  id: 'pages',
  type: 'group',
  children: [
    {
      id: 'packagesMain',
      title: 'Packages',
      caption: 'Packages Details',
      icon: icons.IconBox,
      type: 'collapse',
      children: [
        {
          id: 'Package',
          title: 'Packages',
          type: 'item',
          icon: icons.IconPackages,
          url: '/Packages',
          breadcrumbs: false
        },
        {
          id: 'createPackage',
          title: 'Create Package',
          type: 'item',
          icon: icons.IconPackgeExport,
          url: '/createPackage',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default pages;
