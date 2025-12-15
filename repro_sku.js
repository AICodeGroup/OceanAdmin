const attrValueStr = "{\"颜色\":\"白色\"}";
const attrValueObj = JSON.parse(attrValueStr);
const specText = Object.values(attrValueObj).join(' / ');
console.log(specText);

const attrValueStr2 = "{\"颜色\":\"白色\",\"尺码\":\"L\"}";
const attrValueObj2 = JSON.parse(attrValueStr2);
const specText2 = Object.values(attrValueObj2).join(' / ');
console.log(specText2);
