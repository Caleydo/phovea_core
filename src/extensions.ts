import {IPluginDesc} from './plugin';

/**
 * Triggered when a user was logged in
 *
 * @factoryParam {IUser} user The user object that was logged in
 */
export const EP_PHOVEA_CORE_LOGIN = 'epPhoveaCoreLogin';

/**
 * Triggered when a user was logged out. Does not provide any further information.
 */
export const EP_PHOVEA_CORE_LOGOUT = 'epPhoveaCoreLogout';

/**
 * Load locale JSON files with translations
 */
export const EP_PHOVEA_CORE_LOCALE = 'epPhoveaCoreLocale';

export interface ILocaleEPDesc extends IPluginDesc {
  /**
   * Locale namespace that usually matches the resource filename (e.g., `phovea` and `phovea.json`)
   */
  ns: string;

  /**
   * Language following the [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., `en` or `en-US`)
   * Default value is `en`.
   */
  lng?: string;

  /**
   * Order of the locales, if two locales with the same namespace and language are found.
   * Locales with a higher the order number override the locales with lower order numbers.
   * Default value is  `0`.
   */
  order?: number;
}
