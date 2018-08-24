//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var LocalStore;

(function(){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// packages/frozeman_storage/LocalStore.js                                    //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //

/**
The LocalStore singleton.

@class TemplateStore
@constructor
**/
LocalStore = {
    /**
    This object stores all keys and their values.

    @property keys
    @type Object
    @default {}
    @example

        {
            name->myProperty: "myValue",
            ...
        }

    **/
    keys: {},


    /**
    Keeps the dependencies for the keys in the store.

    @property deps
    @type Object
    @default {}
    @example

        {
            name->myProperty: new Tracker.Dependency,
            ...
        }

    **/
    deps: {},

    // METHODS

    // PRIVATE
    /**
    Creates at least ones a `Tracker.Dependency` object to a key.

    @method _ensureDeps
    @private
    @param {String} key     the name of the key to add a dependecy tracker to
    @return undefined
    **/
    _ensureDeps: function (key) {
        if (!this.deps[key]){
            this.deps[key] = new Tracker.Dependency;
        }
    },
	set: function(key, value, options, callback){

        this._ensureDeps(key);

		// USE CHROME STORAGE
		if(typeof chrome !== 'undefined' && chrome.storage) {
			var item = {};
			item[key] = value;

			// set
			chrome.storage.local.set(item, function(){

				// re-run reactive functions
				if(!options || options.reactive !== false)
	                this.deps[key].changed();

	            // run callbacks
				if(_.isFunction(callback))
					callback();
			});


		// USE LOCALSTORAGE
		} else {
			// stringify
			if(_.isObject(value))
				value = EJSON.stringify(value);

			// set
            // use try to prevent warnings from low cache storages
            try {
    			localStorage.setItem(key, value);
            } catch(e) {

            }

			// re-run reactive functions
			if(!options || options.reactive !== false)
                this.deps[key].changed();

			// run callbacks
			if(_.isFunction(callback))
				callback();
		}
	},
	get: function(key, options, callback){

        this._ensureDeps(key);


        // DEPEND REACTIVE FUNCTIONS
		if(!options || options.reactive !== false)
            this.deps[key].depend();


		// use chrome storage
		if(typeof chrome !== 'undefined' && chrome.storage) {

			// get
			chrome.storage.local.get(key, callback);


		// USE LOCALSTORAGE
		} else {
			// get
			var value = localStorage.getItem(key),
				retunValue = value;

			// try to parse
            if(value && _.isString(value)) {
            	try {
	                retunValue = EJSON.parse(value);
            	} catch(error){
            		retunValue = value;
            	}
            }

            return retunValue;
		}

	}
}
////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("frozeman:storage", {
  LocalStore: LocalStore
});

})();
