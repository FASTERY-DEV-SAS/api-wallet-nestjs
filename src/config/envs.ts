import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  API_PREFIX: string;
  STAGE: string;
  DB_PASS: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  JWT_SECRET: string;
  TOKEN_WEBSERVICES: string;
  // DATA_MANAGEMENT
  DB_PASS_DATA_MANAGEMENT: string;
  DB_NAME_DATA_MANAGEMENT: string;
  DB_HOST_DATA_MANAGEMENT: string;
  DB_PORT_DATA_MANAGEMENT: number;
  DB_USER_DATA_MANAGEMENT: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    API_PREFIX: joi.string().required(),
    STAGE: joi.string().required(),
    DB_PASS: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    TOKEN_WEBSERVICES: joi.string().required(),
    // DATA_MANAGEMENT
    DB_PASS_DATA_MANAGEMENT: joi.string().required(),
    DB_NAME_DATA_MANAGEMENT: joi.string().required(),
    DB_HOST_DATA_MANAGEMENT: joi.string().required(),
    DB_PORT_DATA_MANAGEMENT: joi.number().required(),
    DB_USER_DATA_MANAGEMENT: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config ENV error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  apiPrefix: envVars.API_PREFIX,
  sta: envVars.STAGE,
  dbPass: envVars.DB_PASS,
  dbName: envVars.DB_NAME,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  jwtSecret: envVars.JWT_SECRET,
  tokenWebservices: envVars.TOKEN_WEBSERVICES,
  dbPassDataManagement: envVars.DB_PASS_DATA_MANAGEMENT,
  dbNameDataManagement: envVars.DB_NAME_DATA_MANAGEMENT,
  dbHostDataManagement: envVars.DB_HOST_DATA_MANAGEMENT,
  dbPortDataManagement: envVars.DB_PORT_DATA_MANAGEMENT,
  dbUserDataManagement: envVars.DB_USER_DATA_MANAGEMENT,
};
