export function validate(cuit: string): boolean {
  let esValido = false;
  if (validarFormato(cuit)) {
    if (validarTipoCuit(cuit)) {
      if (validarContraDigitoVerificador(cuit)) {
        esValido = true;
      }
    }
  }
  return esValido;

  function validarFormato(cuit: string): boolean {
    return new RegExp(/^([0-9]{2}-[0-9]{8}-[0-9]{1}|[0-9]{11})$/).test(cuit);
  }
  function validarTipoCuit(cuit: string): boolean {
    let esValido = false;
    const tipoCuit = Number(cuit.slice(0, 2));
    const tiposCuitValidos = [30, 33, 34];
    esValido = tiposCuitValidos.includes(tipoCuit);
    return esValido;
  }
  function validarContraDigitoVerificador(cuit: string) {
    const digitoVerificador = Number(cuit.slice(-1));
    let resultado = false;
    cuit =
      cuit.length > 11
        ? cuit.replace(/-/g, "").slice(0, 10)
        : cuit.slice(0, 10);

    let resultadoPonderacion = 0;
    let contadorFactorPonderado = -1;
    const factorChequeoPonderado = [2, 3, 4, 5, 6, 7];
    const validando = [...cuit].reverse();
    for (let i = 0; i < 10; i++) {
      !(i % 6) && contadorFactorPonderado++;
      resultadoPonderacion +=
        Number(validando[i]) *
        factorChequeoPonderado[i - 6 * contadorFactorPonderado];
    }
    const modulo11ResultadoPonderado = resultadoPonderacion % 11;
    switch (modulo11ResultadoPonderado) {
      case 11:
        resultado = digitoVerificador === 0;
        break;
      case 10:
        resultado = digitoVerificador === 9;
        break;
      default:
        resultado = digitoVerificador === 11 - modulo11ResultadoPonderado;
    }
    return resultado;
  }
}
