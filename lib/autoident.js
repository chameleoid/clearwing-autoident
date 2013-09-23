module.exports = function(client) {
	// nickserv wants us to identify
	client.on('network user.nickserv raw:notice', function(event) {
		if (!this.network.get('ns:nick') || !this.network.get('ns:password'))
			return;

		var text     = event.params[event.params.length - 1],
		    password = this.network.get('ns:password');

		if (/choose a different nick|your nick will be changed/.test(text))
			this.network.send('nickserv', 'identify ' + password);
		else if (/(nick.* (isn't|is not|cannot be)|is not a) registered/.test(text))
			this.network.send('nick', this.network.get('ns:nick'));
	});

	// nick needs to be released
	client.on('network raw:432', function() {
		if (!this.get('ns:nick') || !this.get('ns:password'))
			return;

		this.send('nickserv', ['release', this.get('ns:nick'), this.get('ns:password')].join(' '));
		this.send('nick', this.get('ns:nick'));
	});

	// nick in use
	client.on('network raw:433', function() {
		if (!this.get('ns:nick') || !this.get('ns:password'))
			return;

		this.send('nickserv', ['ghost', this.get('ns:nick'), this.get('ns:password')].join(' '));
		this.send('nick', this.get('ns:nick'));
	});
};
