import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	const hasLangPair = (from, to, pairs) => {
		return pairs.some(pair => (pair.from === from && pair.to === to));
	}	
	const translate = (phrase, from, to, options) => {
		return "Bonjour ! Il n'y a pas API maintenant";
	}

	api.get('/translate', (req, res) =>{
		setTimeout(()=>{
			let config = require('../dict/config.json');
			const { phrase, from, to, token } = req.query;
			if (hasLangPair(from, to, config.languages))
				res.json({ mean: translate(phrase, from, to) });
			else if (hasLangPair(from, 'en', config.languages) && hasLangPair('en', to, config.languages)) {
				const temp = res.json({ mean: translate(phrase, from, to, { interpolate: 'en' }) });
			}
			else
				res.json({ error: 'Cannot find languages pair' });
		}, 1000);
	});

	return api;
}
