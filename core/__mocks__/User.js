module.exports = jest.fn(() => ({
  get: jest.fn().mockResolvedValue({
    data: {},
  }),
}))
