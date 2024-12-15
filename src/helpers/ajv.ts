import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();

addFormats(ajv);

export default ajv;
