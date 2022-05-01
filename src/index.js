import S from 'sanctuary'

const API = {
	config: {
		dbHost: S.Nothing,
		dbPort: S.Nothing,
		dbName: S.Nothing,
		dbUser: S.Nothing,
		dbPassword: S.Nothing,
	},

	hello (options) {
		return JSON.stringify (options, null, 4)
	}
}

export default API