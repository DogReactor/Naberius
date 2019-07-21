import * as path from 'path';

if (!process.env.MONGODB_URL) {
  console.error('NO MONGODB_URL SETTED!');
  process.exit();
}

export const BASE_URL = 'http://assets.millennium-war.net';
export const MONGODB_URL = process.env.MONGODB_URL!;
export const PORT =
  (process.env.PORT && Number.parseInt(process.env.PORT, 10)) || 4000;
export const HOST = process.env.HOST || '0.0.0.0';
export const FILES_ROOT_DIR = process.env.FILES_ROOT_DIR || '.';
export const DATA_DIR = path.join(FILES_ROOT_DIR, 'data');
export const CACHE_DIR = path.join(FILES_ROOT_DIR, 'cache');
export const STATIC_DIR = path.join(FILES_ROOT_DIR, 'static');
export const MAP_INFO_DIR = path.join(CACHE_DIR, 'map');
export const PLAYERDOT_IMG_DIR = path.join(STATIC_DIR, 'playerdot');
export const PLAYERDOT_INFO_DIR = path.join(CACHE_DIR, 'playerdot');
export const ENEMYDOT_IMG_DIR = path.join(STATIC_DIR, 'enemydot');
export const ENEMYDOT_INFO_DIR = path.join(CACHE_DIR, 'enemydot');
export const POSTER_IMG_DIR = path.join(STATIC_DIR, 'poster');
export const MAP_DIR = path.join(CACHE_DIR, 'map');
export const ICO_DIR = path.join(STATIC_DIR, 'ico');
export const HARLEM_TEXT_R_DIR = path.join(CACHE_DIR, 'HarlemTextR');
export const HARLEM_TEXT_A_DIR = path.join(CACHE_DIR, 'HarlemTextA');
export const EVENT_ARC_DIR = path.join(CACHE_DIR, 'EventArc');
export const POSTER_ROOT_URL = 'http://assets.millennium-war.net/00/html/image';
