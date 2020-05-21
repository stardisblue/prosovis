import { line, curveBundle } from 'd3-shape';

const path = line().curve(curveBundle.beta(1));
export default path;
