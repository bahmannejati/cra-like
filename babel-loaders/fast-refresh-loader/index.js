module.exports = function(source) {
	return `
		var prevRefreshReg = window.$RefreshReg$;
		var prevRefreshSig = window.$RefreshSig$;
		var RefreshRuntime = require('react-refresh/runtime');


		const debounce = require("lodash.debounce");
		let enqueueUpdate = debounce(RefreshRuntime.performReactRefresh, 30);


		
		window.$RefreshReg$ = (type, id) => {
			const fullId = module.id + ' ' + id;
			RefreshRuntime.register(type, fullId);
		}
		window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
		
		try {
			${source}

			// $RefreshReg$(Index, "Index");
			module.hot.accept();
			enqueueUpdate();
		} finally {
			window.$RefreshReg$ = prevRefreshReg;
			window.$RefreshSig$ = prevRefreshSig;
		}
	`
}