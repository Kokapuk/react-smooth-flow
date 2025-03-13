import { FalsyArray } from './types';

const getTruthyArray = <T>(array: FalsyArray<T>) => array.filter(Boolean) as T[];

export default getTruthyArray;
