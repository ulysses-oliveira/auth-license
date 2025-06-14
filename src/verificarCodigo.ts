import { verificarCodigo } from "./test";

async function main() {
  try {
    const resultado = await verificarCodigo("c818fe2b-fa85-49d8-9032-e7d14db70f53", "643648");
    console.log('Resultado da verificação:', resultado);
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();