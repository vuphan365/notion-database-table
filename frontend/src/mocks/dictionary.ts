import { NotionDictionary } from '@/types/notion';

const dictionary: NotionDictionary = {
  Interview: {
    type: 'checkbox',
    dataSource: ['false', 'true'],
  },
  Status: {
    type: 'select',
    dataSource: ['Cancelled', 'Completed', 'Scheduled'],
  },
  'Completion Time': {
    type: 'number',
    dataSource: [],
  },
  Result: {
    type: 'status',
    dataSource: ['Done', 'In progress', 'Not started'],
  },
  Confidence: {
    type: 'multi_select',
    dataSource: ['Low', 'High', 'Medium'],
  },
  Salary: {
    type: 'number',
    dataSource: [],
  },
  Task: {
    type: 'select',
    dataSource: ['Offline Mode', 'Profile Editing', 'Onboarding Flow'],
  },
};

export default dictionary;
