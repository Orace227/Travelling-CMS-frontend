// assets
import { IconBuildingBridge, IconPlus } from '@tabler/icons';

// constant
const icons = {
  IconBuildingBridge,
  IconPlus
};

const country = {
  id: 'country',
  type: 'group',
  children: [
    {
      id: 'countryMain',
      title: 'Countries',
      caption: 'country Details',
      icon: icons.IconBuildingBridge,
      type: 'collapse',
      children: [
        {
          id: 'country',
          title: 'countries',
          type: 'item',
          icon: icons.IconBuildingBridge,
          url: '/Countries',
          breadcrumbs: false
        },
        {
          id: 'createcountry',
          title: 'Create country',
          type: 'item',
          icon: icons.IconPlus,
          url: '/CreateCountry',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default country;
