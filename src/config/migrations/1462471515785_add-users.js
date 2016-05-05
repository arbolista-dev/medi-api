exports.up = function(pgm) {
  pgm.createTable( 'users', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    email: {
      type: 'varchar(50)',
      notNull: true,
      unique: true
    },
    first_name: { type: 'varchar(50)' },
    last_name: { type: 'varchar(50)' },
    hash: { type: 'varchar(60)' }
  });
};

exports.down = function(pgm) {
  pgm.dropTable( 'users' );
};
