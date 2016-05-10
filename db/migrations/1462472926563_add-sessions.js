exports.up = function(pgm) {
  pgm.createTable( 'sessions', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users',
      onDelete: 'cascade'
    },
    status: 'boolean',
    date: 'timestamp',
    duration_planned: 'interval',
    duration_success: 'interval',
    location: 'point',
    note: 'varchar(255)'
  });
};

exports.down = function(pgm) {
  pgm.dropTable( 'sessions' );
};
