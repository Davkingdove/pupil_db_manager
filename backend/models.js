const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('pupil_db', 'root', 'root', {
  host: 'localhost',
  production: {
    use_env_variable:'mysql://rll6jyttsifrn4bw:q909hllqxt6vahg3@aqx5w9yc5brambgl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/uo5f6pj42eij4jgu',  // Sequelize auto-parses the connection string
    dialect: 'mysql',
  },
});

const Student = sequelize.define('Student', {
  firstName: DataTypes.STRING,
  surname: DataTypes.STRING,
  middleNames: DataTypes.STRING,
  dateOfBirth: DataTypes.DATEONLY,
  yearOfAdmission: DataTypes.INTEGER,
  programme: DataTypes.STRING,
  previousSchool: DataTypes.STRING,
  beceAggregate: DataTypes.INTEGER,
  motherName: DataTypes.STRING,
  motherContact: DataTypes.STRING,
  fatherName: DataTypes.STRING,
  fatherContact: DataTypes.STRING,
  beceResultFile: DataTypes.STRING,
}, {
  timestamps: true,
});

module.exports = { sequelize, Student };
