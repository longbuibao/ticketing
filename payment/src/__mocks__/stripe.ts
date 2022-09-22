export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: 'ch_3LkqXcA07qmrVBis1bhNkLYu',
    }),
  },
};
