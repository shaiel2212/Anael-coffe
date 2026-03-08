require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, Cafe, User } = require('../src/models');

async function run() {
  try {
    await sequelize.authenticate();
    const cafe = await Cafe.findOne();
    if (!cafe) {
      console.error('No cafe found. Run mysql-workbench-setup.sql first.');
      process.exit(1);
    }
    const passwordHash = bcrypt.hashSync('Aa123456', 10);
    let user = await User.findOne({ where: { email: 'daminshaiel@coffe.com' } });
    if (user) {
      await user.update({ password_hash: passwordHash, name: 'daminshaiel', role: 'admin', is_active: true });
      console.log('User updated: daminshaiel@coffe.com / Aa123456');
    } else {
      await User.create({
        cafe_id: cafe.id,
        name: 'daminshaiel',
        email: 'daminshaiel@coffe.com',
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
      });
      console.log('User created: daminshaiel@coffe.com / Aa123456');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
