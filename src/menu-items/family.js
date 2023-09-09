// assets
import { IconKey, IconUser, IconUsers, IconUserPlus } from '@tabler/icons';


// constant
export const icons = {
  IconKey,
  IconUser,
  IconUsers,
  IconUserPlus
};

export const family = {
    id: 'family',
    type: 'group',
    children: [
        {
            id: 'familyMembers',
            title: 'family Members',
            caption: 'family Members Details',
            icon: icons.IconUser,
            type: 'collapse',
            children: [
                {
                    id: 'Customers',
                    title: 'Customers',
                    type: 'item',
                    icon: icons.IconUsers,
                    url: '/familyMembers/:clientId',
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

export default family;
