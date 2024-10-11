import { ConnectionPoint, Rect } from "./utils";

type Case = [Rect, Rect, ConnectionPoint, ConnectionPoint];

const rect1: Rect = { position: { x: 400, y: 400 }, size: { width: 100, height: 100 } };
const rect2: Rect = { position: { x: 100, y: 100 }, size: { width: 100, height: 100 } };
const rect3: Rect = { position: { x: 400, y: 100 }, size: { width: 100, height: 100 } };
const rect4: Rect = { position: { x: 700, y: 100 }, size: { width: 100, height: 100 } };
const rect5: Rect = { position: { x: 100, y: 400 }, size: { width: 100, height: 100 } };
const rect6: Rect = { position: { x: 700, y: 400 }, size: { width: 100, height: 100 } };
const rect7: Rect = { position: { x: 100, y: 700 }, size: { width: 100, height: 100 } };
const rect8: Rect = { position: { x: 400, y: 700 }, size: { width: 100, height: 100 } };
const rect9: Rect = { position: { x: 700, y: 700 }, size: { width: 100, height: 100 } };

const connectionPoint1: ConnectionPoint = { point: { x: 400, y: 350 }, angle: 90 };
const connectionPoint11: ConnectionPoint = { point: { x: 450, y: 400 }, angle: 0 };
const connectionPoint111: ConnectionPoint = { point: { x: 400, y: 450 }, angle: 270 };
const connectionPoint1111: ConnectionPoint = { point: { x: 350, y: 400 }, angle: 180 };



const connectionPoint2: ConnectionPoint = { point: { x: 100, y: 50 }, angle: 90 };
const connectionPoint3: ConnectionPoint = { point: { x: 400, y: 50 }, angle: 90 };
const connectionPoint4: ConnectionPoint = { point: { x: 700, y: 50 }, angle: 90 };
const connectionPoint5: ConnectionPoint = { point: { x: 100, y: 350 }, angle: 90 };
const connectionPoint6: ConnectionPoint = { point: { x: 700, y: 350 }, angle: 90 };
const connectionPoint7: ConnectionPoint = { point: { x: 100, y: 650 }, angle: 90 };
const connectionPoint8: ConnectionPoint = { point: { x: 400, y: 650 }, angle: 90 };
const connectionPoint9: ConnectionPoint = { point: { x: 700, y: 650 }, angle: 90 };


const connectionPoint22: ConnectionPoint = { point: { x: 150, y: 100 }, angle: 0 };
const connectionPoint33: ConnectionPoint = { point: { x: 450, y: 100 }, angle: 0 };
const connectionPoint44: ConnectionPoint = { point: { x: 750, y: 100 }, angle: 0 };
const connectionPoint55: ConnectionPoint = { point: { x: 150, y: 400 }, angle: 0 };
const connectionPoint66: ConnectionPoint = { point: { x: 750, y: 400 }, angle: 0 };
const connectionPoint77: ConnectionPoint = { point: { x: 150, y: 700 }, angle: 0 };
const connectionPoint88: ConnectionPoint = { point: { x: 450, y: 700 }, angle: 0 };
const connectionPoint99: ConnectionPoint = { point: { x: 750, y: 700 }, angle: 0 };


const connectionPoint222: ConnectionPoint = { point: { x: 100, y: 150 }, angle: 270 };
const connectionPoint333: ConnectionPoint = { point: { x: 400, y: 150 }, angle: 270 };
const connectionPoint444: ConnectionPoint = { point: { x: 700, y: 150 }, angle: 270 };
const connectionPoint555: ConnectionPoint = { point: { x: 100, y: 450 }, angle: 270 };
const connectionPoint666: ConnectionPoint = { point: { x: 700, y: 450 }, angle: 270 };
const connectionPoint777: ConnectionPoint = { point: { x: 100, y: 750 }, angle: 270 };
const connectionPoint888: ConnectionPoint = { point: { x: 400, y: 750 }, angle: 270 };
const connectionPoint999: ConnectionPoint = { point: { x: 700, y: 750 }, angle: 270 };


const connectionPoint2222: ConnectionPoint = { point: { x: 50, y: 100 }, angle: 180 };
const connectionPoint3333: ConnectionPoint = { point: { x: 350, y: 100 }, angle: 180 };
const connectionPoint4444: ConnectionPoint = { point: { x: 650, y: 100 }, angle: 180 };
const connectionPoint5555: ConnectionPoint = { point: { x: 50, y: 400 }, angle: 180 };
const connectionPoint6666: ConnectionPoint = { point: { x: 650, y: 400 }, angle: 180 };
const connectionPoint7777: ConnectionPoint = { point: { x: 50, y: 700 }, angle: 180 };
const connectionPoint8888: ConnectionPoint = { point: { x: 350, y: 700 }, angle: 180 };
const connectionPoint9999: ConnectionPoint = { point: { x: 650, y: 700 }, angle: 180 };

//cases 1-2
const case1: Case = [rect1, rect2, connectionPoint1, connectionPoint2];
const case2: Case = [rect1, rect2, connectionPoint1, connectionPoint22];
const case3: Case = [rect1, rect2, connectionPoint1, connectionPoint222];
const case4: Case = [rect1, rect2, connectionPoint1, connectionPoint2222];
const case5: Case = [rect1, rect2, connectionPoint11, connectionPoint2];
const case6: Case = [rect1, rect2, connectionPoint11, connectionPoint22];
const case7: Case = [rect1, rect2, connectionPoint11, connectionPoint222];
const case8: Case = [rect1, rect2, connectionPoint11, connectionPoint2222];
const case9: Case = [rect1, rect2, connectionPoint111, connectionPoint2];
const case10: Case = [rect1, rect2, connectionPoint111, connectionPoint22];
const case11: Case = [rect1, rect2, connectionPoint111, connectionPoint222];
const case12: Case = [rect1, rect2, connectionPoint111, connectionPoint2222];
const case13: Case = [rect1, rect2, connectionPoint1111, connectionPoint2];
const case14: Case = [rect1, rect2, connectionPoint1111, connectionPoint22];
const case15: Case = [rect1, rect2, connectionPoint1111, connectionPoint222];
const case16: Case = [rect1, rect2, connectionPoint1111, connectionPoint2222];

export const cases12 = [case1, case2, case3, case4, case5, case6, case7, case8, case9, case10, case11, case12, case13, case14, case15, case16];

//cases 1-3
const case17: Case = [rect1, rect3, connectionPoint1, connectionPoint3];
const case18: Case = [rect1, rect3, connectionPoint1, connectionPoint33];
const case19: Case = [rect1, rect3, connectionPoint1, connectionPoint333];
const case20: Case = [rect1, rect3, connectionPoint1, connectionPoint3333];
const case21: Case = [rect1, rect3, connectionPoint11, connectionPoint3];
const case22: Case = [rect1, rect3, connectionPoint11, connectionPoint33];
const case23: Case = [rect1, rect3, connectionPoint11, connectionPoint333];
const case24: Case = [rect1, rect3, connectionPoint11, connectionPoint3333];
const case25: Case = [rect1, rect3, connectionPoint111, connectionPoint3];
const case26: Case = [rect1, rect3, connectionPoint111, connectionPoint33];
const case27: Case = [rect1, rect3, connectionPoint111, connectionPoint333];
const case28: Case = [rect1, rect3, connectionPoint111, connectionPoint3333];
const case29: Case = [rect1, rect3, connectionPoint1111, connectionPoint3];
const case30: Case = [rect1, rect3, connectionPoint1111, connectionPoint33];
const case31: Case = [rect1, rect3, connectionPoint1111, connectionPoint333];
const case32: Case = [rect1, rect3, connectionPoint1111, connectionPoint3333];

export const cases13 = [case17, case18, case19, case20, case21, case22, case23, case24, case25, case26, case27, case28, case29, case30, case31, case32];

//cases 1-4
const case33: Case = [rect1, rect4, connectionPoint1, connectionPoint4];
const case34: Case = [rect1, rect4, connectionPoint1, connectionPoint44];
const case35: Case = [rect1, rect4, connectionPoint1, connectionPoint444];
const case36: Case = [rect1, rect4, connectionPoint1, connectionPoint4444];
const case37: Case = [rect1, rect4, connectionPoint11, connectionPoint4];
const case38: Case = [rect1, rect4, connectionPoint11, connectionPoint44];
const case39: Case = [rect1, rect4, connectionPoint11, connectionPoint444];
const case40: Case = [rect1, rect4, connectionPoint11, connectionPoint4444];
const case41: Case = [rect1, rect4, connectionPoint111, connectionPoint4];
const case42: Case = [rect1, rect4, connectionPoint111, connectionPoint44];
const case43: Case = [rect1, rect4, connectionPoint111, connectionPoint444];
const case44: Case = [rect1, rect4, connectionPoint111, connectionPoint4444];
const case45: Case = [rect1, rect4, connectionPoint1111, connectionPoint4];
const case46: Case = [rect1, rect4, connectionPoint1111, connectionPoint44];
const case47: Case = [rect1, rect4, connectionPoint1111, connectionPoint444];
const case48: Case = [rect1, rect4, connectionPoint1111, connectionPoint4444];

export const cases14 = [case33, case34, case35, case36, case37, case38, case39, case40, case41, case42, case43, case44, case45, case46, case47, case48];

//cases 1-5
const case49: Case = [rect1, rect5, connectionPoint1, connectionPoint5];
const case50: Case = [rect1, rect5, connectionPoint1, connectionPoint55];
const case51: Case = [rect1, rect5, connectionPoint1, connectionPoint555];
const case52: Case = [rect1, rect5, connectionPoint1, connectionPoint5555];
const case53: Case = [rect1, rect5, connectionPoint11, connectionPoint5];
const case54: Case = [rect1, rect5, connectionPoint11, connectionPoint55];
const case55: Case = [rect1, rect5, connectionPoint11, connectionPoint555];
const case56: Case = [rect1, rect5, connectionPoint11, connectionPoint5555];
const case57: Case = [rect1, rect5, connectionPoint111, connectionPoint5];
const case58: Case = [rect1, rect5, connectionPoint111, connectionPoint55];
const case59: Case = [rect1, rect5, connectionPoint111, connectionPoint555];
const case60: Case = [rect1, rect5, connectionPoint111, connectionPoint5555];
const case61: Case = [rect1, rect5, connectionPoint1111, connectionPoint5];
const case62: Case = [rect1, rect5, connectionPoint1111, connectionPoint55];
const case63: Case = [rect1, rect5, connectionPoint1111, connectionPoint555];
const case64: Case = [rect1, rect5, connectionPoint1111, connectionPoint5555];

export const cases15 = [case49, case50, case51, case52, case53, case54, case55, case56, case57, case58, case59, case60, case61, case62, case63, case64];

//cases 1-6
const case65: Case = [rect1, rect6, connectionPoint1, connectionPoint6];
const case66: Case = [rect1, rect6, connectionPoint1, connectionPoint66];
const case67: Case = [rect1, rect6, connectionPoint1, connectionPoint666];
const case68: Case = [rect1, rect6, connectionPoint1, connectionPoint6666];
const case69: Case = [rect1, rect6, connectionPoint11, connectionPoint6];
const case70: Case = [rect1, rect6, connectionPoint11, connectionPoint66];
const case71: Case = [rect1, rect6, connectionPoint11, connectionPoint666];
const case72: Case = [rect1, rect6, connectionPoint11, connectionPoint6666];
const case73: Case = [rect1, rect6, connectionPoint111, connectionPoint6];
const case74: Case = [rect1, rect6, connectionPoint111, connectionPoint66];
const case75: Case = [rect1, rect6, connectionPoint111, connectionPoint666];
const case76: Case = [rect1, rect6, connectionPoint111, connectionPoint6666];
const case77: Case = [rect1, rect6, connectionPoint1111, connectionPoint6];
const case78: Case = [rect1, rect6, connectionPoint1111, connectionPoint66];
const case79: Case = [rect1, rect6, connectionPoint1111, connectionPoint666];
const case80: Case = [rect1, rect6, connectionPoint1111, connectionPoint6666];

export const cases16 = [case65, case66, case67, case68, case69, case70, case71, case72, case73, case74, case75, case76, case77, case78, case79, case80];

const case81: Case = [rect1, rect7, connectionPoint1, connectionPoint7];
const case82: Case = [rect1, rect7, connectionPoint1, connectionPoint77];
const case83: Case = [rect1, rect7, connectionPoint1, connectionPoint777];
const case84: Case = [rect1, rect7, connectionPoint1, connectionPoint7777];
const case85: Case = [rect1, rect7, connectionPoint11, connectionPoint7];
const case86: Case = [rect1, rect7, connectionPoint11, connectionPoint77];
const case87: Case = [rect1, rect7, connectionPoint11, connectionPoint777];
const case88: Case = [rect1, rect7, connectionPoint11, connectionPoint7777];
const case89: Case = [rect1, rect7, connectionPoint111, connectionPoint7];
const case90: Case = [rect1, rect7, connectionPoint111, connectionPoint77];
const case91: Case = [rect1, rect7, connectionPoint111, connectionPoint777];
const case92: Case = [rect1, rect7, connectionPoint111, connectionPoint7777];
const case93: Case = [rect1, rect7, connectionPoint1111, connectionPoint7];
const case94: Case = [rect1, rect7, connectionPoint1111, connectionPoint77];
const case95: Case = [rect1, rect7, connectionPoint1111, connectionPoint777];
const case96: Case = [rect1, rect7, connectionPoint1111, connectionPoint7777];

export const cases17 = [case81, case82, case83, case84, case85, case86, case87, case88, case89, case90, case91, case92, case93, case94, case95, case96];

//cases 1-8
const case97: Case = [rect1, rect8, connectionPoint1, connectionPoint8];
const case98: Case = [rect1, rect8, connectionPoint1, connectionPoint88];
const case99: Case = [rect1, rect8, connectionPoint1, connectionPoint888];
const case100: Case = [rect1, rect8, connectionPoint1, connectionPoint8888];
const case101: Case = [rect1, rect8, connectionPoint11, connectionPoint8];
const case102: Case = [rect1, rect8, connectionPoint11, connectionPoint88];
const case103: Case = [rect1, rect8, connectionPoint11, connectionPoint888];
const case104: Case = [rect1, rect8, connectionPoint11, connectionPoint8888];
const case105: Case = [rect1, rect8, connectionPoint111, connectionPoint8];
const case106: Case = [rect1, rect8, connectionPoint111, connectionPoint88];
const case107: Case = [rect1, rect8, connectionPoint111, connectionPoint888];
const case108: Case = [rect1, rect8, connectionPoint111, connectionPoint8888];
const case109: Case = [rect1, rect8, connectionPoint1111, connectionPoint8];
const case110: Case = [rect1, rect8, connectionPoint1111, connectionPoint88];
const case111: Case = [rect1, rect8, connectionPoint1111, connectionPoint888];
const case112: Case = [rect1, rect8, connectionPoint1111, connectionPoint8888];

export const cases18 = [case97, case98, case99, case100, case101, case102, case103, case104, case105, case106, case107, case108, case109, case110, case111, case112];

//cases 1-9
const case113: Case = [rect1, rect9, connectionPoint1, connectionPoint9];
const case114: Case = [rect1, rect9, connectionPoint1, connectionPoint99];
const case115: Case = [rect1, rect9, connectionPoint1, connectionPoint999];
const case116: Case = [rect1, rect9, connectionPoint1, connectionPoint9999];
const case117: Case = [rect1, rect9, connectionPoint11, connectionPoint9];
const case118: Case = [rect1, rect9, connectionPoint11, connectionPoint99];
const case119: Case = [rect1, rect9, connectionPoint11, connectionPoint999];
const case120: Case = [rect1, rect9, connectionPoint11, connectionPoint9999];
const case121: Case = [rect1, rect9, connectionPoint111, connectionPoint9];
const case122: Case = [rect1, rect9, connectionPoint111, connectionPoint99];
const case123: Case = [rect1, rect9, connectionPoint111, connectionPoint999];
const case124: Case = [rect1, rect9, connectionPoint111, connectionPoint9999];
const case125: Case = [rect1, rect9, connectionPoint1111, connectionPoint9];
const case126: Case = [rect1, rect9, connectionPoint1111, connectionPoint99];
const case127: Case = [rect1, rect9, connectionPoint1111, connectionPoint999];
const case128: Case = [rect1, rect9, connectionPoint1111, connectionPoint9999];

export const cases19 = [case113, case114, case115, case116, case117, case118, case119, case120, case121, case122, case123, case124, case125, case126, case127, case128];

export const cases = [...cases19]