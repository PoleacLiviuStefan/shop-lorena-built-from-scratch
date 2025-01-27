export default {
    name: 'fanCourierToken',
    title: 'FanCourier Token',
    type: 'document',
    fields: [
      {
        name: 'token',
        title: 'Token',
        type: 'string'
      },
      {
        name: 'expiresAt',
        title: 'Expires At',
        type: 'datetime'
      }
    ]
  }