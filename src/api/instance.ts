import axios from 'axios'

import { API_URL } from '../constants'

export const createHttpClient = (token: string) =>
	axios.create({
		baseURL: API_URL,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	})
