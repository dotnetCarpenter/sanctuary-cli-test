import S from 'sanctuary'

const API = {
	config: {
		dbHost: S.Left (''),
		dbPort: S.Left (''),
		dbName: S.Left (''),
		dbUser: S.Left (''),
		dbPassword: S.Left (''),
	},

	hello (options) {
		return JSON.stringify (options, null, 4)
	}
}

export default API
