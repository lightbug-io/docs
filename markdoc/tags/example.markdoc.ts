import {Example} from '../../components';

export const example = {
  render: Example,
  children: ['paragraph', 'tag', 'list'],
  attributes: {
    title: {
      type: String,
    },
    href: {
      type: String,
    },
  },
};
