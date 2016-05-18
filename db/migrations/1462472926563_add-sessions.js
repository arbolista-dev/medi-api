exports.up = function(pgm) {
  pgm.createTable( 'sessions', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users',
      onDelete: 'cascade'
    },
    status: 'boolean',
    date: 'integer',
    duration_planned: 'integer',
    duration_success: 'integer',
    location: 'varchar(50)',
    note: 'varchar(255)'
  });
};

exports.down = function(pgm) {
  pgm.dropTable( 'sessions' );
};
