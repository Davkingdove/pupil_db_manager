const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('pupil_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
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
