// Collections
import config from 'client/config/environment';
import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import $ from 'jquery';

export default Route.extend({
  ajax: service(),

  model() {
    const uuid = 1; // will be managed from a user session later
    return get(this, 'ajax').request(`/collections/${uuid}`);
  },

  extractQueryParams(collection) {
	  const queryParams = {};
	  for(var key in collection) {
		// gets all filterParams[*] from collection object
		if( /filterParams/.test(key) ) {
		  let filterName = key.match(/\[(.*)\]/)[1];
		  queryParams[filterName] = collection[key];
		}
	  }
	  return queryParams;
	},

  setupController(controller) {
	  this._super(...arguments);
	  controller.set('isShowingModal', false);
  },

  actions: {
	setClxnDelveModal(collection) {
		this.controller.set('modalCollection', collection);
	},

    viewCollection(collection) {
      const queryParams = get(this, 'extractQueryParams')(collection);
      this.transitionTo('search', { queryParams });
    },

	viewWorkflow(collection){
		// const clxnName = this.controller.set('statistic1', collection.name);
		// console.log(clxnName);
	},

	extractClxnMeta(collection){
		// todo get meta statistics for clxn such as top 3 largest grants
	},
    editCollection(collection) {
    //   console.log('todo', collection);
    },

    exportCollection(collection) {
      const queryParams = get(this, 'extractQueryParams')(collection);
      queryParams.export = true;
      const url = `${config.apiHost}/${config.apiNamespace}/grants/?${$.param(queryParams)}`;
      window.open(url, 'Download');
    },

    deleteCollection(collection) {
      const url = `collections/${collection._id}`;
      get(this, 'ajax').delete(url).then(() => {
        this.refresh(); // trigger model refresh and subsequent component update
      });
  	}
  }
});
