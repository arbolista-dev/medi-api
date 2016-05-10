exports.up = function(pgm) {
  pgm.createTable( 'users', {
    id: 'id',
    email: {
      type: 'varchar(50)',
      notNull: true,
      unique: true
    },
    first_name: 'varchar(50)',
    last_name: 'varchar(50)',
    hash: 'varchar(60)'
  });
};

exports.down = function(pgm) {
  pgm.dropTable( 'users' );
};
