import { verificarCodigo } from "./test";

async function main() {
  try {
    const resultado = await verificarCodigo("ceaf2c33-c58b-4c4b-82cc-116a454d0e84", "876203");
    console.log('Resultado da verificação:', resultado);
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();