/* eslint no-unused-vars: 0 no-console: 0 */
import models from 'server/model-config.json';
import datasources from 'server/datasources.json';

module.exports = (app) => {
  // update all the models
  // TODO: remove comment for code block below when ready for deployment to production
  // const autoUpdateAll = () => {
  //   Object.keys(models).forEach((key) => {
  //     if (typeof models[key].dataSource !== 'undefined') {
  //       if (typeof datasources[models[key].dataSource] !== 'undefined') {
  //         app.dataSources[models[key].dataSource]
  //         .autoupdate(key, (err) => {
  //           if (err) throw err;
  //         });
  //       }
  //     }
  //   });
  // };

  // delete current db and re-migrate all the models
  const autoMigrateAll = () => {
    Object.keys(models).forEach((key) => {
      if (typeof models[key].dataSource !== 'undefined') {
        if (typeof datasources[models[key].dataSource] !== 'undefined') {
          app.dataSources[models[key].dataSource].automigrate(key, (err) => {
            if (err) throw err;
          });
        }
      }
    });
  };

  autoMigrateAll();
  // TODO: change to autoUpdateAll when ready for deployment to production
  // autoUpdateAll();
  console.log('> Auto-update Datasource done.');
};
