import * as path from 'path';
import { readFileSync } from 'fs-extra';

const file = readFileSync('./config.json', { encoding: 'utf-8' });
const config = JSON.parse(file);

export const BASE_URL = 'http://assets.millennium-war.net';
export const SELF_BASE_URL = config.SELF_BASE_URL;
export const MONGODB_URL = config.MONGODB_URL;
export const DATA_DIR = 'data';
export const CACHE_DIR = 'cache';
export const STATIC_DIR = 'static';
export const MAP_INFO_DIR = path.join(CACHE_DIR, 'map');
export const PLAYERDOT_IMG_DIR = path.join(STATIC_DIR, 'playerdot');
export const PLAYERDOT_INFO_DIR = path.join(CACHE_DIR, 'playerdot');
export const ENEMYDOT_IMG_DIR = path.join(STATIC_DIR, 'enemydot');
export const ENEMYDOT_INFO_DIR = path.join(CACHE_DIR, 'enemydot');
export const MAP_DIR = path.join(CACHE_DIR, 'map');
export const SELF_STATIC_URL = SELF_BASE_URL + '/static';
export const SELF_PLAYERDOT_URL = SELF_STATIC_URL + '/playerdot';
export const ICO_DIR = path.join(STATIC_DIR, 'ico');
export const HARLEM_TEXT_R_DIR = path.join(CACHE_DIR, 'HarlemTextR');
export const HARLEM_TEXT_A_DIR = path.join(CACHE_DIR, 'HarlemTextA');
