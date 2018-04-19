module.exports = (sequelize, DataTypes) => {
  const DesignSize = sequelize.define('design_sizes', {
    imageUrl: {
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

  DesignSize.associate = models => {
    DesignSize.belongsTo(models.Design, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });

    DesignSize.belongsTo(models.Size, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return DesignSize;
};
