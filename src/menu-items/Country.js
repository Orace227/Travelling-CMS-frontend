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
      caption: 'Country Details',
      icon: icons.IconBuildingBridge,
      type: 'collapse',
      children: [
        {
          id: 'country',
          title: 'Countries',
          type: 'item',
          icon: icons.IconBuildingBridge,
          url: '/Countries',
          breadcrumbs: false
        },
        {
          id: 'createcountry',
          title: 'Create Country',
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
