module.exports = (sequelize, DataTypes) => {
  const Part = sequelize.define('parts', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    portrait: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  Part.associate = models => {
    models.Part.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });

    models.Part.belongsTo(models.Order, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });

    models.Part.belongsTo(models.Product, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });

    models.Part.belongsTo(models.Size, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });

    models.Part.belongsTo(models.Design, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Part;
};
