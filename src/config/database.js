export const DB_CONFIG = {
  name: 'pos_db',
  version: 2,
  stores: {
    products: {
      keyPath: 'id',
      indexes: [
        { name: 'category', keyPath: 'category' },
        { name: 'sku', keyPath: 'sku', options: { unique: true } }
      ]
    },
    transactions: {
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'synced', keyPath: 'synced' }
      ]
    },
    sync_queue: {
      keyPath: 'id',
      autoIncrement: true
    }
  }
}; 