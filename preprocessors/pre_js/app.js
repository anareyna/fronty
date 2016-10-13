var App = (() =>  {
	var st = {
			body: "body"
		},
		dom = {},
		catchDom = () => {
			dom.body = $(st.body);
		},
		subscribeEvents = () => {

		},
		functions = {
			test() {
				console.log("test");
			}

		},
		initialize = () => {
			console.log("Date")
			catchDom();
			subscribeEvents();
			functions.test();
		};
	return {
		init: initialize
	};
})();
App.init();
