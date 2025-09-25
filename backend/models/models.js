const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = sequelize.define('Student', {
  firstName: DataTypes.STRING,
  surname: DataTypes.STRING,
  dateOfBirth: DataTypes.DATEONLY,
  yearOfAdmission: DataTypes.INTEGER,
  programme: DataTypes.STRING,
  previousSchool: DataTypes.STRING,
  beceAggregate: DataTypes.INTEGER,
  motherName: DataTypes.STRING,
  motherContact: DataTypes.STRING,
  fatherName: DataTypes.STRING,
  fatherContact: DataTypes.STRING,
}, {
  timestamps: true,
});

module.exports = { sequelize, Student };
