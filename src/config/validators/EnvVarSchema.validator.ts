import * as joi from 'joi';
import { EnvVars } from '../entities/EnvVars.entity';

export const envSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
    ORDERS_MS_HOST: joi.string().required(),
    ORDERS_MS_PORT: joi.number().required(),
  })
  .unknown(true);
