/**
 * Cria um objeto com as propriedades especificadas (keys) do objeto original.
 * @param object Objeto original
 * @param keys Lista de propriedades a selecionar
 * @returns Objeto contendo apenas as propriedades selecionadas
 */
function pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {} as Pick<T, K>);
}

export default pick;
