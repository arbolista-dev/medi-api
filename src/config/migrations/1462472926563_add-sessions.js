exports.up = function(pgm) {
  pgm.createTable( 'sessions', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    user_id: {
      type: 'integer',
      references: 'users',
      onDelete: 'cascade'
    },
    status: { type: 'boolean' },
    date: { type: 'timestamp' },
    duration_planned: { type: 'interval' },
    duration_success: { type: 'interval' },
    location: { type: 'varchar(50)' },
    note: { type: 'varchar(255)' }
  });
};

exports.down = function(pgm) {
  pgm.dropTable( 'sessions' );
};
